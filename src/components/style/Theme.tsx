import {createTheme} from "@mui/material";
import {BaseTheme} from "./BaseTheme";
import {ThemeTones, TonalPalette} from "./tonalPalette";
import {CSSProperties} from "react";
import {withAlpha} from "./colorUtils";

export const DarkTheme = (
    palette: TonalPalette
) => createTheme(BaseTheme, {
    palette: {
        mode: 'dark',
        primary: palette.primary.dark.base,
        primaryContainer: palette.primary.dark.container,

        secondary: palette.secondary.dark.base,
        secondaryContainer: palette.secondary.dark.container,

        info: palette.tertiary.dark.base,
        infoContainer: palette.tertiary.dark.container,

        error: palette.error.dark.base,
        errorContainer: palette.error.dark.container,

        success: palette.customColor("#66bb6a", true)["dark"].base,

        background: {
	        default: TonalPalette.luminanceScale(palette.neutral, 10),
	        paper: TonalPalette.luminanceScale(palette.neutralVariant, 30),
        },
	    textColor: {
		    primary: TonalPalette.luminanceScale(palette.neutral, 90),
		    secondary: TonalPalette.luminanceScale(palette.neutral, 70),
		    disabled: withAlpha(TonalPalette.luminanceScale(palette.neutral, 0), 0.38),
	    },
	    outline: TonalPalette.luminanceScale(palette.neutralVariant, 60),
	    customColors: palette.customColors.dark,
	    customColor: function (
		    color: Exclude<CSSProperties["color"], undefined>,
		    blend: boolean,
		    type: keyof ThemeTones,
		    transparent?: boolean,
	    ) {
		    return palette.customColor(color, blend, transparent)["dark"][type];
	    },
    },
})


export const LightTheme = (
    palette: TonalPalette
) => createTheme(BaseTheme, {
    palette: {
        mode: 'light',

        primary: palette.primary.light.base,
        primaryContainer: palette.primary.light.container,

        secondary: palette.secondary.light.base,
        secondaryContainer: palette.secondary.light.container,

        error: palette.error.light.base,
        errorContainer: palette.error.light.container,

        info: palette.tertiary.light.base,
        infoContainer: palette.tertiary.light.container,

        success: palette.customColor("#66bb6a", true)["light"].base,

        background: {
	        default: TonalPalette.luminanceScale(palette.neutral, 99),
	        paper: TonalPalette.luminanceScale(palette.neutralVariant, 90),
        },
	    textColor: {
		    primary: TonalPalette.luminanceScale(palette.neutral, 10),
		    secondary: TonalPalette.luminanceScale(palette.neutral, 30),
		    disabled: withAlpha(TonalPalette.luminanceScale(palette.neutral, 0), 0.38),
	    },
	    outline: TonalPalette.luminanceScale(palette.neutralVariant, 50),
	    customColors: palette.customColors.light,
	    customColor: function (
		    color: Exclude<CSSProperties["color"], undefined>,
		    blend: boolean,
		    type: keyof ThemeTones,
		    transparent?: boolean,
	    ) {
		    return palette.customColor(color, blend, transparent)["light"][type];
	    },

    },
})
