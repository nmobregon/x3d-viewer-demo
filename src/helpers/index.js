/**
 * Receives a [0-1,0-1,0-1] formatted rgb hex color and returns its 0-256 counterpart also un rgb, ready for inline style
 * If input color array is empty, black ( rgb(0,0,0) is returned instead )
 *
 * @param {number[]} color
 */
export function arrayColorToRgb(color) {

	const colorArr = (color?.length ? color : [0, 0, 0]);
	const colorHex = [colorArr[0] * 256, colorArr[1] * 256, colorArr[2] * 256];

	return `rgb(${colorHex.join(",")})`;
}

/**
 * Receives an array of [0-1,0-1,0-1] formatted rgb hex colors and calculates the average value
 * @param {number[][]} colors
 */
export function calculateAverageColor(colors) {
	const cantColors = colors.length;
	const [avRed, avGreen, avBlue] =
	colors.reduce((color1, color2) => [
		color1[0] + color2[0],
		color1[1] + color2[1],
		color1[2] + color2[2]
	], [0, 0, 0])
	return `${avRed/cantColors} ${avGreen/cantColors} ${avBlue/cantColors}`;
}

export const axisExtraLengthFactor = 0.2;

/**
 * Makes sure that axes pass through 0,0,0 coordinates
 *
 * @param {object} boundingBox
 * @param {number} extra
 */
export function normalizedBoundingBox(boundingBox, extra) {
	const {xmin, xmax, ymin, ymax, zmin, zmax} = boundingBox;
	const [newminx, newmaxx] = getMinMax(xmin, xmax, extra);
	const [newminy, newmaxy] = getMinMax(ymin, ymax, extra);
	const [newminz, newmaxz] = getMinMax(zmin, zmax, extra);

	return {
		xmin: newminx,
		xmax: newmaxx,
		ymin: newminy,
		ymax: newmaxy,
		zmin: newminz,
		zmax: newmaxz
	};
}

function getMinMax(refMin=0, refMax=1, extra=0.2) {

	let min = +refMin;
	let max = +refMax;
	const extraValue = parseFloat(`${extra}`) * axisExtraLengthFactor;
	if (min < 0 && max < 0) {
		max = extraValue;
	} else if (min > 0 && max > 0) {
		min = -(extraValue);
	}

	return [min, max];
}

/**
 * Get default viewpoints from center of gravity and bounding box
 * @param {*} cog 
 * @param {*} boundingBox 
 */
export function resolveViewpoints(cog, boundingBox) {
	const namedViews = [];
	const {x: cogX, y: cogY, z: cogZ } = cog;
	const {xmin,xmax,ymin,ymax,zmin,zmax} = boundingBox;
	
	const modelLength = {x: xmax-xmin, y: ymax-ymin, z: zmax-zmin};
	const maxDelta = Math.max(modelLength.x, modelLength.y, modelLength.z);
	const sqrt2_2 = Math.SQRT2 / 2;
	const characteristicLength = axisExtraLengthFactor * maxDelta;
	const extra = 8 * characteristicLength;

	namedViews.push(getViewData("top", "Top", `${cogX}, ${cogY}, ${zmax + extra}`,quaternion2vectorAngle(0, 0, 0, +1), cogX, cogY, cogZ));
	namedViews.push(getViewData("axonometric", "Axonometric", `${cogX+0.55 * extra} ${cogY - 0.55 * extra} ${cogZ + extra}`, quaternion2vectorAngle(-0.353553, -0.146447, -0.353553, -0.853553), cogX, cogY, cogZ));
	namedViews.push(getViewData("front", "Front", `${cogX} ${ymin - extra} ${cogZ}`, quaternion2vectorAngle(-sqrt2_2, 0, 0, -sqrt2_2), cogX, cogY, cogZ));
	namedViews.push(getViewData("rear", "Rear", `${cogX} ${ymax + extra} ${cogZ}`, quaternion2vectorAngle(0, +sqrt2_2, +sqrt2_2, 0), cogX, cogY, cogZ));
	namedViews.push(getViewData("bottom", "Bottom", `${cogX} ${cogY} ${zmin - extra}`,quaternion2vectorAngle(-0.5, 0, 0, 0), cogX, cogY, cogZ));
	namedViews.push(getViewData("left", "Left", `${xmin - extra} ${cogY} ${cogZ}`,quaternion2vectorAngle(-0.5, 0.5, 0.5, -0.5), cogX, cogY, cogZ));
	namedViews.push(getViewData("right", "Right", `${xmax + extra} ${cogY} ${cogZ}`,quaternion2vectorAngle(+0.5, 0.5, 0.5, +0.5), cogX, cogY, cogZ));

	return namedViews;
}

function getViewData(id, name, position, orientation, cogX, cogY, cogZ){
	const viewpoint = {
		id, name, position, orientation, centerOfRotation: `${cogX} ${cogY} ${cogZ}`
	};
	console.log(viewpoint);
	return viewpoint;
}

function quaternion2vectorAngle(q1, q2, q3, q4) {
	let x, y, z, theta;
	if (Math.abs(q4) < 1) {
		theta = Math.acos(q4) * 2.0;
		const scale = Math.sin(theta / 2.0);
		x = q1 / scale;
		y = q2 / scale;
		z = q3 / scale;
	} else {
		theta = 0;
		x = 0;
		y = -1;
		z = 0;
	}
	return `${x} ${y} ${z} ${theta}`//`;
}

/**
 * Receives a list of errors and creates a new list of shapes with acumulated errors
 * @param {*} errors
 */
export function resolveErrorsByShape(errors=[]){
	const shapes = [];
	//process each error line
	errors.forEach((error)=> {
		const {id, color, desc:description, name, visible} = error;
		const colorValue = arrayColorToRgb(color);
		const fullId = "Model__"+id;

		let shape = shapes.find(sh=>sh.id === fullId);
		if (!shape){
			shape={id: fullId, colors: [], errors: []};
			shapes.push(shape);
		}
		visible && shape.colors.push(color);
		shape.errors.push({description, name, visible, id, color: colorValue});
	});

	return shapes.map(shape=>{
		shape.color = shape.colors.length ? calculateAverageColor(shape.colors) : undefined;
		delete shape.colors;
		return shape;
	});
}

/**
 * 
 * Receives an <inline> element ref, the shape object to update it's corresponding <shape> element and the event callbacks
 * 
 * @param {*} refInline 
 * @param {*} shape 
 * @param {*} clickHandler 
 * @param {*} mouseoverHandler 
 * @param {*} mouseoutHandler 
 */
export function updateShape(refInline, shape, clickHandler, mouseoverHandler, mouseoutHandler){
	const shapeRef = refInline.current.querySelector(`#${shape.id}`);
	if (!shapeRef) return;

	updateShapeMaterial(shapeRef, shape);
	updateShapeEvents(shapeRef, shape, clickHandler, mouseoverHandler, mouseoutHandler);
}


export function updateShapeMaterial(shapeRef, shape) {
	const shapeMaterial = shapeRef.querySelector("appearance > material");

	shapeRef.setAttribute("data-originalColor", shapeRef.getAttribute("data-originalColor") || shapeMaterial.getAttribute('diffuseColor'));
	shapeMaterial.setAttribute('diffuseColor', shape.color || shapeRef.getAttribute("data-originalColor"));

}

function updateShapeEvents(shapeRef, shape, clickHandler, mouseoverHandler, mouseoutHandler) {
	[
		{event: 'click', callback: clickHandler},
		{event: 'mouseover', callback: mouseoverHandler},
		{event: 'mouseout', callback: mouseoutHandler}
	].forEach(ev=>shapeRef.addEventListener(ev.event,  (evt) => { ev.callback(shape); }));
}