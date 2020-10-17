import React, {memo, Fragment} from "react";

const Viewpoints = ({defaults=[], custom=[]})=>{

	return (
	
			defaults.concat(...custom).map(vp=>
				<>
					<viewpoint is="x3d"
						key={vp.id}
						id={vp.id}
						position={vp.position}
						orientation={vp.orientation}
						centerofrotation={vp.centerOfRotation}
						description="camera">
					</viewpoint>
				</>
			)
	
	);
}


export default memo(Viewpoints);
