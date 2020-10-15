import React, {memo, Fragment} from "react";

const Viewpoints = ({defaults=[], custom=[]})=>{

	return (
		<>
		{
			defaults.map(vp=>
				<>
					<viewpoint
						  key={vp.id}
						id={vp.id}
						position={vp.position}
						orientation={vp.orientation}
						centerofrotation={vp.centerOfRotation}
						description="camera">
					</viewpoint>
				</>
			)
		}
		{
			custom.map(vp=>{ return (
				<>
					<viewpoint
						  	key={vp.id}
							id={vp.id}
							position={vp.position}
							orientation={vp.orientation}
							centerofrotation={vp.centerOfRotation}
							description={vp.id === "default" ? "defaultX3DViewpointNode" : "camera"}>
					</viewpoint>
					{ vp.id==="default" && (
						<viewpoint
							key={`${vp.id}default`}
							id={vp.id}
							position={vp.position}
							orientation={vp.orientation}
							centerofrotation={vp.centerOfRotation}
							description={"camera"}>
						</viewpoint>
					)}
				</>
			)})
		}
		</>
	);
}


export default memo(Viewpoints);
