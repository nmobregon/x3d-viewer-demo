//React and Fragment are imported for compiler sake
import React, {  useRef,useEffect, memo, useState, Fragment } from 'react';
import { interval, timer } from 'rxjs';
import { takeUntil, takeWhile, tap } from 'rxjs/operators';
import { calculateAverageColor, resolveViewpoints, resolveErrorsByShape } from './helpers';
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
		const setup = ()=>{
			const shapes = resolveErrorsByShape(conf.errors);
			//once I have my "shape map", I process the colors for each one
			shapes.forEach((shape)=>{
				const shapeRef = refInline.current.querySelector(`#${shape.id}`);
				if (!shapeRef) return;

				const shapeMaterial = shapeRef.querySelector("appearance > material");
				!shapeRef.getAttribute("data-originalColor") && shapeRef.setAttribute("data-originalColor", shapeMaterial.getAttribute('diffuseColor'));

				if (shape.colors?.length){
					shape.color = calculateAverageColor(shape.colors);
					delete shape.colors;
					//update the calculated color
					shapeMaterial.setAttribute('diffuseColor', shape.color);
				} else {
					shapeMaterial.setAttribute('diffuseColor', shapeRef.getAttribute("data-originalColor"));
				}

				//set the events to the shape
				[
					{event: 'click', callback: clickHandler},
					{event: 'mouseover', callback: mouseoverHandler},
					{event: 'mouseout', callback: mouseoutHandler}
				].forEach(ev=>shapeRef.addEventListener(ev.event,  (evt) => { ev.callback(shape); }));
			 });

			 setDefaultVps(resolveViewpoints({...conf.cog}, {...conf.boundingBox}));
		};

		if (!refInline.current.querySelectorAll("shape").length){
			//check every 250ms if model is already loaded, when it does, it calls the complete callback
			//however if after 5s it hasn't loaded, it shows an error
			interval(250)
				.pipe(takeUntil(timer(5000)))
				.pipe(takeWhile(()=>!refInline.current.querySelectorAll("shape").length))
				.subscribe({complete: ()=>{
					if (!refInline.current.querySelectorAll("shape").length){
						setError(`Model could not be loaded, please check ${conf.url} format and try again.`);
						return;
					} else setup();
				}});
		} else setup();

	}, [conf.cog, conf.url, conf.errors, conf.boundingBox, clickHandler, mouseoverHandler, mouseoutHandler]);

  return (
		<div>
			{ error && (<>{error}<br/></>) }
			{ !error && <ViewpointButtons defaults={defaultVps} custom={conf.viewpoints}/>}
			<x3d >
				<scene ref={refScene} >
					{ !error && <Viewpoints defaults={defaultVps} custom={conf.viewpoints}/>}
					<Axes bbox={conf.boundingBox} show={conf.showXYZ} />
					<inline ref={refInline} nameSpaceName="Model" mapDEFToID="true" url={`${conf.url}`}   />
				</scene>
			</x3d>
		</div>) ;
});
