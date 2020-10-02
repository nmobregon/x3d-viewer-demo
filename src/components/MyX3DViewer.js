import React, {  useRef,useEffect, memo, useCallback } from 'react';
import { interval } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
import { arrayColorToRgb, calculateAverageColor } from '../helpers';
import Axes from './Axes';


function MyX3DViewer({conf, clickHandler, mouseoverHandler, mouseoutHandler}) {
	const refScene = useRef(null);
	const refInline = useRef(null);

	const gotoViewpoint = useCallback((vp) => {
		refScene.current.querySelector(`#${vp.id}`).setAttribute('set_bind','true');
	},[]);

    useEffect(() => {
		interval(250)
			.pipe(
				tap(()=>console.count("Waiting for model to load")), 
				takeWhile(()=>!refInline.current.querySelectorAll("shape").length))
			.subscribe({
				complete: ()=>{
					const shapes = [];
					//process each error line
					(conf.errors || []).forEach((error)=> {
						const {ids, color, desc:description, name, visible, id:errorId} = error;
						const colorValue = arrayColorToRgb(color);
						//go through each id in order to transform the list of shapes
						(ids || []).forEach(id=>{
							const fullId = "Model__"+id;
							let shape = shapes.find(sh=>sh.id === fullId);
							if (!shape){
								shape={id: fullId, colors: [], errors: []};
								shapes.push(shape);
							}
							visible && shape.colors.push(color);
							shape.errors.push({description, name, visible, errorId, color: colorValue});
						});
					});

					//once I have my "shape map", I process the colors for each one
					shapes
						.forEach((shape)=>{
							
							shape.color = calculateAverageColor(shape.colors);
							delete shape.colors;

							const shapeRef = refInline.current.querySelector(`#${shape.id}`);
							if (!shapeRef) return;
							
							//actualizo el color calculado
							shapeRef.querySelector(`appearance > material`).setAttribute('diffuseColor', shape.color);

							//asocio los eventos
							const events = [
								{event: 'click', callback: clickHandler},
								{event: 'mouseover', callback: mouseoverHandler},
								{event: 'mouseout', callback: mouseoutHandler}
							];
							events.forEach(ev=>shapeRef.addEventListener(ev.event,  (event) => { ev.callback(shape); }));
					});
				}
			});
	
	}, [conf.url, conf.errors, conf.boundingBox, clickHandler, mouseoverHandler, mouseoutHandler]);

  return (
	  <>
		<div>
			{
				conf.viewpoints && conf.viewpoints.map(vp=>
					<button onClick={()=>gotoViewpoint(vp)}>{ vp.name }</button>
				)
			}
			<x3d >
				<scene ref={refScene} >
					{
						conf.viewpoints && conf.viewpoints.map(vp=>{ return (
							<>
								<viewpoint 	
									id={vp.id} 
									position={vp.position} 
									orientation={vp.orientation} 
									zNear={vp.zNear} 
									zFar={vp.zFar} 
									description={vp.id === "default" ? "defaultX3DViewpointNode" : "camera"}>
								</viewpoint>
								{ vp.id==="default" && (
									<viewpoint 	
										id={vp.id} 
										position={vp.position} 
										orientation={vp.orientation} 
										zNear={vp.zNear} 
										zFar={vp.zFar} 
										description={"camera"}>
									</viewpoint>	
								)}
							</>
						)})
					}
					<Axes bbox={conf.boundingBox} show={conf.showXYZ} />
					<inline ref={refInline} nameSpaceName="Model" mapDEFToID="true" url={conf.url}   />
				</scene>
			</x3d>
		</div>
	</>) ;
}

export default memo(MyX3DViewer);