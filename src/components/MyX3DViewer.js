//React and Fragment are imported for compiler sake
import React, {  useRef,useEffect, memo, useState, Fragment } from 'react';
import { interval, timer } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { resolveViewpoints, resolveErrorsByShape, updateShape } from '../helpers';
import Axes from './Axes';
import './MyX3DViewer.css';
import ViewpointButtons from './ViewpointButtons';
import Viewpoints from './Viewpoints';

export const MyX3DViewer = memo(({conf, clickHandler, mouseoverHandler, mouseoutHandler}) => {
	const refScene = useRef(null);
	const refInline = useRef(null);

  	const [error, setError] = useState("");
  	const [defaultVps, setDefaultVps] = useState([]);

    useEffect(() => {
		//check every 250ms if model is already loaded, when it does, it calls the complete callback
		//however if after 5s it hasn't loaded, it shows an error
		interval(250)
			.pipe(takeUntil(timer(5000)))
			.pipe(takeWhile(()=>!refInline.current.querySelectorAll("shape").length))
			.subscribe({complete: ()=>{
				if (!refInline.current.querySelectorAll("shape").length){
					setError(`Model could not be loaded, please check ${conf.url} format and try again.`);
				} else {
					//transpose error list into shape list with errors
					const shapes = resolveErrorsByShape(conf.errors);
					//once I have my "shape map", I process the colors for each one
					shapes.forEach(shape => updateShape(refInline, shape, clickHandler, mouseoverHandler, mouseoutHandler));
					//now that everyting is set right according to the conf object, we get the viewpoints
					setDefaultVps(resolveViewpoints({...conf.cog}, {...conf.boundingBox}));
				}
			}});
	}, [conf.cog, conf.url, conf.errors, conf.boundingBox, clickHandler, mouseoverHandler, mouseoutHandler]);

  return (
		<div>
			{ error || <ViewpointButtons defaults={defaultVps} custom={conf.viewpoints}/> }
			<x3d is="x3d">
				<scene  is="x3d" ref={refScene} >
					{ !error && <Viewpoints defaults={defaultVps} custom={conf.viewpoints}/>}
					<Axes bbox={conf.boundingBox} show={conf.showXYZ} />
					<inline is="x3d" ref={refInline} nameSpaceName="Model" mapDEFToID="true" url={conf.url}/>
				</scene>
			</x3d>
		</div>) ;
});