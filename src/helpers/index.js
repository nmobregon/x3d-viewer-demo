/**
 * Receives a [0-1,0-1,0-1] formatted rgb hex color and returns its 0-256 counterpart also un rgb, ready for inline style
 * If input color array is empty, black ( rgb(0,0,0) is returned instead )
 * 
 * @param {number[]} color
 */
export function arrayColorToRgb(color){

	const colorArr = (color?.length ? color : [0,0,0]);
	const colorHex = [colorArr[0]*256, colorArr[1]*256, colorArr[2]*256];

	return `rgb(${colorHex.join(",")})`;
}

/**
 * Receives an array of [0-1,0-1,0-1] formatted rgb hex colors and calculates the average value
 * @param {number[][]} colors 
 */
export function calculateAverageColor(colors){
	const cantColors = colors.length;
	const [avRed, avGreen, avBlue] = 
		colors.reduce((color1, color2)=>
			[
				color1[0] + color2[0],
				color1[1] + color2[1],
				color1[2] + color2[2]
			]
		, [0,0,0])
	return `${avRed/cantColors} ${avGreen/cantColors} ${avBlue/cantColors}`;
}

export const axisExtraLengthFactor = 0.2;