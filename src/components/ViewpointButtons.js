import React, {memo, Fragment, useCallback} from "react";

const ViewpointButtons = ({defaults=[], custom=[]})=>{

	const gotoViewpoint = useCallback((vp) => {
		document.querySelectorAll(`viewpoint`).forEach(vp=>vp.removeAttribute('set_bind'));
		document.querySelector(`#${vp.id}`).setAttribute('set_bind','true');
	},[]);

	return (
		<>
			{
				custom.map(vp=>
					<button className="viewport-button _1AbTG" key={vp.id} onClick={()=>gotoViewpoint(vp)}>{ vp.name }</button>
				)
			}
			{
				defaults.map(vp=>
					<button className="viewport-button _1AbTG" key={vp.id} onClick={()=>gotoViewpoint(vp)}>{ vp.name }</button>
				)
			}
		</>
	);
}


export default memo(ViewpointButtons);
