import {differenceDegrees, rotationDirection, sanitizeDegreesDouble} from "./mathUtils";
import {CSSProperties} from "react";
import {CustomColorsType} from "./palettes";
import {hexToRgb, hslToRgb, rgbDictToHex, rgbDictToHsl, rgbToHex, rgbToHsl, withAlpha} from "./colorUtils";

export interface ThemeTones {
	base: PaletteColor,
	container: PaletteColor,
}

export interface ModdedThemeTones {
	light: ThemeTones,
	dark: ThemeTones
}

export interface PaletteColor {
	main: Exclude<CSSProperties["color"], undefined>,
	light: Exclude<CSSProperties["color"], undefined>,
	dark: Exclude<CSSProperties["color"], undefined>,
	contrastText: Exclude<CSSProperties["color"], undefined>,
}

const TRANSPARENCY_COLOR_TO_CONTAINER_RATIO = 0.1;

export class TonalPalette {
	private static BlendingFactor = .5;
	source: string;
	primary: ModdedThemeTones;
	secondary: ModdedThemeTones;
	tertiary: ModdedThemeTones;
	neutral: string;
	neutralVariant: string;
	error: ModdedThemeTones;
	customColors: { [k in keyof CustomColorsType]: ModdedThemeTones };

	constructor(
		primary: string,
		secondary: string,
		tertiary: string,
		error: string,
		neutral: string,
		neutralVariant: string,
		customColors: CustomColorsType = {},
		source: string = primary,
	) {
		this.source = source;
		this.primary = TonalPalette.generateTones(primary);
		this.secondary = TonalPalette.generateTones(secondary);
		this.tertiary = TonalPalette.generateTones(tertiary);
		this.error = TonalPalette.generateTones(error);
		this.neutral = neutral;
		this.neutralVariant = neutralVariant;
		this.customColors = Object.fromEntries(Object.entries(customColors).map(
			([colorKey, colorValue]) => {
				return [colorKey, this.customColor(colorValue, true)];
			},
		));
	}

	static fromColor(color: string, customColors?: CustomColorsType, isContent: boolean = false): TonalPalette {
		const {r: r, g: g, b: b} = hexToRgb(color);
		const {h, s, l} = rgbToHsl(r, g, b);

		if (isContent) {
			return new TonalPalette(
				rgbDictToHex(hslToRgb(h, s, l)),
				rgbDictToHex(hslToRgb(h, s / 3, l)),
				rgbDictToHex(hslToRgb(h + 60 / 360, s / 2, l)),
				rgbDictToHex(hslToRgb(25 / 360, .84, l)),
				rgbDictToHex(hslToRgb(h, Math.min(s / 12, .04), l)),
				rgbDictToHex(hslToRgb(h, Math.min(s / 6, .08), l)),
				(customColors || {}),
				color,
			);
		} else {
			return new TonalPalette(
				rgbDictToHex(hslToRgb(h, Math.max(0.48, s), l)),
				rgbDictToHex(hslToRgb(h, 0.16, l)),
				rgbDictToHex(hslToRgb(h + 60 / 360, 0.24, l)),
				rgbDictToHex(hslToRgb(25 / 360, 84 / 100, l)),
				rgbDictToHex(hslToRgb(h, 0.04, l)),
				rgbDictToHex(hslToRgb(h, 0.08, l)),
				(customColors || {}),
				color,
			);
		}
	}

	static luminanceScale(base: string, value: number) {
		const luminance = value;
		const {r: r0, g: g0, b: b0} = hexToRgb(base);
		const {h, s} = rgbToHsl(r0, g0, b0);
		const {r: rF, g: gF, b: bF} = hslToRgb(h, s, luminance / 100.0);

		return rgbToHex(rF, gF, bF);
	}

	static harmonize(from: string, to: string): string {
		const fromHsl = rgbDictToHsl(hexToRgb(from));
		const toHsl = rgbDictToHsl(hexToRgb(to));

		const fromHue = fromHsl.h * 360;
		const toHue = toHsl.h * 360;

		const diffDeg = differenceDegrees(fromHue, toHue);
		const rotDeg = Math.min(diffDeg * TonalPalette.BlendingFactor, 15.0);

		const outputHue = sanitizeDegreesDouble(
			fromHue
			+ rotDeg * rotationDirection(fromHue, toHue),
		);
		return rgbDictToHex(hslToRgb(outputHue / 360, fromHsl.s, fromHsl.l));
	}

	static generateTones(color: string): ModdedThemeTones {
		return {
			dark: {base: this.getDarkBase(color), container: this.getDarkContainer(color)},
			light: {base: this.getLightBase(color), container: this.getLightContainer(color)},
		};
	}

	static getDarkBase(color: string): PaletteColor {
		return {
			main: TonalPalette.luminanceScale(color, 80),
			light: TonalPalette.luminanceScale(color, 90),
			dark: TonalPalette.luminanceScale(color, 70),
			contrastText: TonalPalette.luminanceScale(color, 20),
		};
	}

	static getDarkContainer(color: string): PaletteColor {
		return {
			main: TonalPalette.luminanceScale(color, 30),
			light: TonalPalette.luminanceScale(color, 35),
			dark: TonalPalette.luminanceScale(color, 25),
			contrastText: TonalPalette.luminanceScale(color, 90),
		};
	}

	static getLightBase(color: string): PaletteColor {
		return {
			main: TonalPalette.luminanceScale(color, 40),
			dark: TonalPalette.luminanceScale(color, 30),
			light: TonalPalette.luminanceScale(color, 50),
			contrastText: TonalPalette.luminanceScale(color, 100),
		};
	}

	static getLightContainer(color: string): PaletteColor {
		return {
			main: TonalPalette.luminanceScale(color, 90),
			dark: TonalPalette.luminanceScale(color, 95),
			light: TonalPalette.luminanceScale(color, 80),
			contrastText: TonalPalette.luminanceScale(color, 10),
		};
	}

	static withTransparency(color: PaletteColor, alpha: number): PaletteColor {
		return {
			light: withAlpha(color.light, alpha),
			main: withAlpha(color.main, alpha),
			dark: withAlpha(color.dark, alpha),
			contrastText: withAlpha(color.contrastText, alpha),
		};
	}

	customColor(customColor: string, blend: boolean, transparent: boolean = false): ModdedThemeTones {
		let color = customColor;

		if (blend) {
			color = TonalPalette.harmonize(customColor, this.source);
		}

		const palette = TonalPalette.fromColor(color, {}, false);

		if (!transparent) {
			return palette.primary;
		} else {
			return {
				light: {
					base: palette.primary.light.base,
					container: TonalPalette.withTransparency(palette.primary.light.container, 1 - TRANSPARENCY_COLOR_TO_CONTAINER_RATIO),
				},
				dark: {
					base: palette.primary.dark.base,
					container: TonalPalette.withTransparency(palette.primary.dark.container, TRANSPARENCY_COLOR_TO_CONTAINER_RATIO),
				},
			};
		}
	}
}


