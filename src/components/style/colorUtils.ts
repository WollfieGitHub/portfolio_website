import {hashcode} from "./jsUtils";
import {Theme} from "@mui/system";
import {modulo} from "./mathUtils";

export function rgbDictToHex({r, g, b}: { r: number, g: number, b: number }) {
	return rgbToHex(r, g, b);
}

export function hexToRgb(hex: string) {
	const bigint = parseInt(hex.replace("#", ""), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	return {r: r, g: g, b: b};
}

export function rgbToHex(r: number, g: number, b: number) {
	function componentToHex(c: number) {
		const hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
export function hslToRgb(h: number, s: number, l: number) {
	let r, g, b;

	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		const hue2rgb = function hue2rgb(p: number, q: number, t: number) {
			if (t < 0) {
				t += 1;
			}
			if (t > 1) {
				t -= 1;
			}
			if (t < 1 / 6) {
				return p + (q - p) * 6 * t;
			}
			if (t < 1 / 2) {
				return q;
			}
			if (t < 2 / 3) {
				return p + (q - p) * (2 / 3 - t) * 6;
			}
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255),
	};
}

export function rgbDictToHsl({r, g, b}: { r: number, g: number, b: number }) {
	return rgbToHsl(r, g, b);
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
export function rgbToHsl(r: number, g: number, b: number) {
	r /= 255;
	g /= 255;
	b /= 255;
	let max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h = 0, s, l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return {h, s, l};
}

/**
 *
 * @param color The color to set the alpha channel of
 * @param opacity The value of the alpha channel (0 to 1)
 */
export function withAlpha(color: string, opacity: number) {

	// coerce values so ti is between 0 and 1.
	const _color = color.startsWith("#") ? color : "#" + color;
	const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
	const hex = _opacity.toString(16).toUpperCase();
	return _color.substring(0, 7) + (hex.length < 2 ? "0" + hex : hex);
}

/**
 * Converts an integer to a hex string
 * @param i The integer to convert
 */
function intToHex(i: number) {
	const c = (i & 0x00FFFFFF)
		.toString(16)
		.toUpperCase();


	return "00000".substring(0, 6 - c.length) + c;
}

/** The range of hue (total is 1) over which the hue is restricted in the {@link stringToColor} function */
const HUE_RANGE = 0.4;
/** The total range of hues (360 usually but here is 1) */
const HUE_TOTAL_RANGE = 1;

/**
 * Converts a string to a color using its hashcode
 * @param text The text string
 * @param theme The theme used by the app
 * @param restrictHueRange Whether to restrict, pre-determined the generated color to a specific hue range. This is used
 * for course color-codes such that it does not disturb other tasks in the calendar, these tasks being
 * restricted to the other part of the hue spectrum
 */
export function stringToColor(text: string, theme: Theme, restrictHueRange: boolean = true) {
	const hex = intToHex(hashcode(text));

	if (!restrictHueRange) {
		return hex;
	}

	const {h: primaryHue} = rgbDictToHsl(hexToRgb(theme.palette.primary.main));
	const minHue = primaryHue - (HUE_RANGE / 2);
	const maxHue = primaryHue + (HUE_RANGE / 2);

	const rgb = hexToRgb(hex);
	let {h, s, l} = rgbDictToHsl(rgb);

	h = modulo(modulo(h, maxHue - minHue) + minHue, HUE_TOTAL_RANGE);

	return rgbDictToHex(hslToRgb(h, s, l));
}

const COLOR_TO_CONTAINER_RATIO = 0.1;

export function colorToContainerAndText(
	color: string, theme: Theme, transparent: boolean,
): {
	base: string,
	textColor: string,
	backgroundColor: string
} {
	const base = theme.palette.customColor(color, true, "base");
	const containerColor = theme.palette.customColor(color, true, "container");
	const textColor = containerColor.contrastText;

	const ratio = theme.palette.mode === "light" ? COLOR_TO_CONTAINER_RATIO : 1 - COLOR_TO_CONTAINER_RATIO;
	let backgroundColor;
	if (transparent) {
		backgroundColor = withAlpha(containerColor.main, ratio);
	} else {
		backgroundColor = interpolate(containerColor.main, theme.palette.background.paper, ratio);
	}

	return {
		base: base.main,
		textColor: textColor,
		backgroundColor: backgroundColor,
	};
}

/**
 *
 * @param c0
 * @param c1
 * @param ratio Clamped between 0 and 1 within the function
 */
export function interpolate(c0: string, c1: string, ratio: number) {
	ratio = Math.max(Math.min(ratio, 1), 0);

	const {r: r1, g: g1, b: b1} = hexToRgb(c0);
	const {r: r2, g: g2, b: b2} = hexToRgb(c1);

	return rgbDictToHex({
		r: Math.floor(r1 * (1 - ratio) + r2 * ratio),
		g: Math.floor(g1 * (1 - ratio) + g2 * ratio),
		b: Math.floor(b1 * (1 - ratio) + b2 * ratio),
	});
}