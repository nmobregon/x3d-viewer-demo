import { memo, useEffect, useState, useCallback } from "react";
import React from 'react'
import MyX3DViewer from "./MyX3DViewer";


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
			const jsonConf = await fetch("example.json");
			const confObj = await jsonConf.json();
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
			const showXYZ = !conf.showXYZ;
			setConf(()=>({
				...conf,
				showXYZ
			}))
		},[conf]
	)
	const toggleError = useCallback(
		(errorId) => {
			setConf(()=>({
				...conf,
				errors: conf.errors.map(e=>({...e, visible: e.id===errorId ? !e.visible : e.visible}))
			}))
		},[conf]
	)

	return (
		<>
			<header className="App-header">
				<h2 onClick={toggleAxes}>X3D File Viewer</h2><br/>
			</header>
			<div className="content">
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
					{(active?.errors || []).map((error)=>(
						<li key={error.errorId} style={{color: error.color}}>
							<span className="error-desc"> {error.description} </span> | 
							<strong onClick={()=>toggleError(error.errorId)}>Toggle</strong >
						</li>
					))}
				</ul>
			</footer>
		</>
	)


}

export default memo(ViewerWrapper);