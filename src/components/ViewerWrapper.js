import { memo, useEffect, useState, useCallback } from "react";
import React from 'react'
import { MyX3DViewer } from "./MyX3DViewer";



function ViewerWrapper() {
	const [conf, setConf] = useState(null);
	const [active, setActive] = useState(null);
	const [over, setOver] = useState(null);

	useEffect(()=>{
		(async ()=>{
			const confObj = {
				"boundingBox": {
					"xmax": 19.71497917175293,
					"xmin": 10.477374076843262,
					"ymax": -7.748879432678223,
					"ymin": -12.748879432678223,
					"zmax": 52.47846984863281,
					"zmin": 44.47846984863281
				},
				"cog": {
					"x": 15.09618054577758,
					"y": -10.318064720704973,
					"z": 48.4784776612303
				},
				"errors": [
					{
						"color": [
							0.737374,
							0.1111,
							0.243245676543
						],
						"desc": "Its a hole",
						"id": "holes",
						"name": "HOLES",
						"visible": true
					},
					{
						"color": [
							0.737374,
							0.1111,
							0.243245676543
						],
						"desc": "Its a thin wall",
						"id": "wt",
						"name": "WT",
						"visible": true
					},
					{
						"color": [
							0.737374,
							0.1111,
							0.243245676543
						],
						"desc": "Its an overhanging are",
						"id": "overhanging",
						"name": "OVERHANGING",
						"visible": true
					}
				],
				"id": "0",
				"showXYZ": true,
				url: `http://localhost:3000/4cfa25df-ccea-4a39-bd01-944823732e26.x3d?${Date.now()}`

			};			
			setConf(confObj);
		})();
	}, []);

	const clickHandler = useCallback(
		(payload) => {
			setActive(payload);
		},[]
	)
	const mouseoverHandler = useCallback(
		(payload) => {
			setOver(payload.id);
		},[]
	)
	const mouseoutHandler = useCallback(
		(payload) => {
			setOver(null)
		},[]
	)
	const toggleAxes = useCallback(
		() => {
			setConf((config)=>({
				...config,
				showXYZ: !config.showXYZ
			}))
		},[]
	)
	const toggleError = useCallback(
		(errorId) => {
			setConf(()=>({
				...conf,
				errors: conf.errors.map(e=>({...e, visible: e.id===errorId ? !e.visible : e.visible}))
			}))
		},[conf]
  )

  const getColor = useCallback((color)=>{
		const colorArr = (color?.length ? color : [0,0,0]);
		const colorHex = [colorArr[0]*256, colorArr[1]*256, colorArr[2]*256];

		return `rgb(${colorHex.join(",")})`;
	}, []);

	return (
		<>
			<header className="App-header">
				<h2 >X3D File Viewer</h2>
			</header>
			<div className="content">
				<button id="axestoggler" type="button" onClick={toggleAxes}>Toggle Axes</button>
				{ conf?.url && (
				<MyX3DViewer
					conf={conf}
					mouseoutHandler={mouseoutHandler}
					mouseoverHandler={mouseoverHandler}
					clickHandler={clickHandler}></MyX3DViewer>
				)}

			</div>
			<footer>
				{active && (<h5>{active.id}</h5>)}
				<ul className="error-list">
					{(conf?.errors || []).map((error)=>(
						<li key={error.id} style={{color: getColor(error.color)}}>
							<span className={`error-desc toggle-${error.visible ? 'on' : 'off'}`}> {error.desc} </span> |
					    <strong className={`toggle-${error.visible ? 'on' : 'off'}`} onClick={()=>toggleError(error.id)}>Toggle {error.visible ? 'off' : 'on'}</strong >
						</li>
					))}
				</ul>
			</footer>
		</>
	)


}

export default memo(ViewerWrapper);
