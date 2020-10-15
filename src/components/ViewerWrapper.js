import { memo, useEffect, useState, useCallback } from "react";
import React from 'react'
import { MyX3DViewer } from "x3d-viewer";


function ViewerWrapper() {
	const [conf, setConf] = useState({});
	const [active, setActive] = useState(null);
	const [over, setOver] = useState(null);

	useEffect(()=>{
		(async ()=>{
			/*
				the configuration can be loaded consuming any json producing resource,
				like an rest api endpoint or a file, or even generated programatically
      */
      const name = "4cfa25df-ccea-4a39-bd01-944823732e26";
			const jsonConf = await fetch(`${name}.json`);
      const confObj = await jsonConf.json();
      confObj.url = `http://localhost:3000/${name}.x3d?${Date.now()}`;
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
