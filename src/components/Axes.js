import React, { memo, useEffect, useState } from "react";
import { axisExtraLengthFactor, normalizedBoundingBox } from "../helpers";


function Axes({bbox, show}) {

	const [extraLength, setExtraLength] = useState(1);
	const [boundingBox, setBoundingBox] = useState({
        "xmax": 1,
        "xmin": 0,
        "ymax": 1,
        "ymin": 0,
        "zmax": 1,
        "zmin": 0
    });

	useEffect(()=>{

		const extra = Math.max(bbox.xmax, bbox.ymax, bbox.zmax) * axisExtraLengthFactor;
		setExtraLength(extra);
		setBoundingBox(normalizedBoundingBox(bbox, extra));
	}, [bbox]);

	useEffect(()=>{
		document.querySelector("Group#axes").setAttribute("render", show);
	}, [show])


	return (
		<group is="x3d" id="axes">
			<shape isPickable="false" DEF="axis_line_x" is="x3d">
				<indexedLineSet index="0 1 -1" is="x3d">
					<coordinate is="x3d" point={` ${boundingBox.xmin - extraLength } 0 0, ${boundingBox.xmax + extraLength} 0 0 `} color="1 0 0, 1 0 0" />
				</indexedLineSet>
				<appearance is="x3d" DEF="red">
					<material is="x3d" diffuseColor="0 0 0" emissiveColor="0.7 0 0" />
					<depthmode is="x3d" readOnly="false" />
					<lineProperties is="x3d" DEF='TestLineProperties' linewidthScaleFactor='2' />
				</appearance>
			</shape>
			<transform is="x3d" translation={`${boundingBox.xmax + extraLength} 0 0`}>
				<transform is="x3d" rotation="0 0 1 -1.57079632679">
					<shape is="x3d" isPickable="false" DEF="axis_arrow_x">
						<cone is="x3d" DEF="Arrowconex" bottomRadius={extraLength/10} height={extraLength/2} subdivision="16" />
						<appearance is="x3d" USE="red" />
					</shape>
				</transform>
			</transform>
			<transform is="x3d" translation={`${boundingBox.xmax + 1.5*extraLength} 0 0`}>
				<billboard is="x3d" axisOfRotation="0 0 0">
					<transform is="x3d" translation="0 0 0" scale={`${2*axisExtraLengthFactor*extraLength} ${2*axisExtraLengthFactor*extraLength} ${2*axisExtraLengthFactor*extraLength}`}>
						<shape is="x3d" isPickable="false" DEF="axis_label_x">
						<text is="x3d" string="x" solid="false">
							<fontstyle is="x3d" family="'Serif'"/>
						</text>
						<appearance is="x3d" DEF="gray">
							<material  is="x3d" diffuseColor="0.15 0.15 0.15" emissiveColor="0.15 0.15 0.15" />
						</appearance>
						</shape>
					</transform>
				</billboard>
			</transform>
			<shape is="x3d" isPickable="false" DEF="axis_line_y">
				<indexedLineSet is="x3d" index="0 1 -1">
					<coordinate  is="x3d"point={` 0 ${boundingBox.ymin - extraLength} 0, 0 ${boundingBox.ymax + extraLength} 0 `} color="0 1 0, 0 1 0" />
				</indexedLineSet>
				<appearance is="x3d" DEF="green">
					<material is="x3d" diffuseColor="0 0 0" emissiveColor="0 0.7 0" />
					<depthmode is="x3d" readOnly="false" />
					<lineProperties  is="x3d" linewidthScaleFactor="2.0" />
				</appearance>
			</shape>
			<transform  is="x3d" translation={`0 ${boundingBox.ymax + extraLength} 0`}>
				<transform is="x3d" rotation="0 1 0 -1.57079632679">
					<shape is="x3d" isPickable="false" DEF="axis_arrow_y">
					<cone is="x3d" DEF="Arrowconey" bottomRadius={extraLength/10} height={extraLength/2} subdivision="16" />
						<appearance is="x3d" USE="green" />
					</shape>
				</transform>
			</transform>
			<transform is="x3d" translation={` 0 ${boundingBox.ymax + 1.5*extraLength} 0`}>
				<billboard is="x3d" axisOfRotation="0 0 0">
					<transform is="x3d" translation="0 0 0" scale={`${2*axisExtraLengthFactor*extraLength} ${2*axisExtraLengthFactor*extraLength} ${2*axisExtraLengthFactor*extraLength}`}>
						<shape is="x3d" isPickable="false" DEF="axis_label_y">
						<text is="x3d" string="y" solid="false">
							<fontstyle is="x3d" family="'Serif'"/>
						</text>
						<appearance is="x3d" DEF="gray">
							<material is="x3d" diffuseColor="0.15 0.15 0.15" emissiveColor="0.15 0.15 0.15" />
						</appearance>
						</shape>
					</transform>
				</billboard>
			</transform>
			<shape is="x3d" isPickable="false" DEF="axis_line_z">
				<indexedLineSet is="x3d" index="0 1 -1">
					<coordinate is="x3d" point={` 0 0 ${boundingBox.zmin - extraLength}, 0 0 ${boundingBox.zmax + extraLength} `} color="0 0 1, 0 0 1" />
				</indexedLineSet>
				<appearance is="x3d" DEF="blue">
					<material is="x3d" diffuseColor="0 0 0" emissiveColor="0 0 0.7" />
					<depthmode is="x3d" readOnly="false" />
					<lineProperties is="x3d" linewidthScaleFactor="2.0" />
				</appearance>
			</shape>
			<transform is="x3d" translation={` 0 0 ${boundingBox.zmax + extraLength} `}>
				<transform is="x3d" rotation="1 0 0 +1.57079632679">
					<shape is="x3d" isPickable="false" DEF="axis_arrow_z">
					<cone is="x3d" DEF="Arrowconez" bottomRadius={extraLength/10} height={extraLength/2} subdivision="16" />
						<appearance is="x3d" USE="blue" />
					</shape>
				</transform>
			</transform>
			<transform is="x3d" translation={` 0 0 ${boundingBox.zmax + 1.5*extraLength} `}>
				<billboard is="x3d" axisOfRotation="0 0 0">
					<transform is="x3d" translation="0 0 0" scale={`${2*axisExtraLengthFactor*extraLength} ${2*axisExtraLengthFactor*extraLength} ${2*axisExtraLengthFactor*extraLength}`}>
						<shape is="x3d" isPickable="false" DEF="axis_label_z">
						<text is="x3d" string="z" solid="false">
							<fontstyle is="x3d" family="'Serif'"/>
						</text>
						<appearance is="x3d" DEF="gray">
							<material is="x3d" diffuseColor="0.15 0.15 0.15" emissiveColor="0.15 0.15 0.15" />
						</appearance>
						</shape>
					</transform>
				</billboard>
			</transform>
		</group>
	);


};

export default memo(Axes);
