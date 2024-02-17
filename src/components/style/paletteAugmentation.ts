import {Palette} from "@mui/material";
import {CSSProperties} from "react";
import {ModdedThemeTones, PaletteColor, ThemeTones} from "./tonalPalette";
import {CustomColorsType} from "./palettes";

declare module "@mui/material/Paper" {
    interface PaperPropsVariantOverrides {
        flat: true;
    }
}

declare module "@mui/material/styles" {

    type CustomColorBlender = (
	    color: Exclude<CSSProperties["color"], undefined>,
	    blend: boolean,
	    type: keyof ThemeTones,
	    transparent?: boolean,
    ) => PaletteColor;

    interface BorderRadius {
        small: string,
        medium: string,
        large: string,
        extraLarge: string,
        full: string,
    }

    interface Padding {
        small: string,
        medium: string,
        large: string,
    }

    interface Theme {
        borderRadius: BorderRadius,
        padding: Padding,
    }

    interface ThemeOptions {
        borderRadius: BorderRadius,
    }

    interface Palette {
	    primaryContainer: Palette["primary"];
	    secondaryContainer: Palette["primary"];
	    errorContainer: Palette["primary"];
	    infoContainer: Palette["primary"];
	    outline: CSSProperties["color"];
	    customColors: { [k in keyof CustomColorsType]: ModdedThemeTones };
	    customColor: CustomColorBlender;
    }

    interface Color {
	    primaryContainer: Palette["primary"];
	    secondaryContainer: Palette["primary"];
	    errorContainer: Palette["primary"];
	    infoContainer: Palette["primary"];
	    outline: CSSProperties["color"];
    }

    interface PaletteOptions {
	    primaryContainer: PaletteOptions["primary"];
	    secondaryContainer: PaletteOptions["primary"];
	    errorContainer: PaletteOptions["primary"];
	    infoContainer: PaletteOptions["primary"];
	    outline: CSSProperties["color"];
	    customColors: ModdedThemeTones[];
	    customColor: CustomColorBlender;
    }
}

