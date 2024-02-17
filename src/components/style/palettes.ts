import {CSSProperties} from "react";
import {TonalPalette} from "./tonalPalette";

export const CustomColors: any = {}
export const CustomColorKeys = Object.keys(CustomColors);
export type CustomColorsType = {
    [key in typeof CustomColorKeys[number]]: (Exclude<CSSProperties['color'], undefined>)
}

export const Palettes: any = {
    ['Default - Cozy Latte']: new TonalPalette(
        '#ffb86e',
        '#a88b71',
        '#71ccff',
        '#ffb4ab',
        '#988f89',
        '#50453a',
    ),
    ['Studious Blue']: new TonalPalette(
        '#8ecdff',
        '#8293a2',
        '#f4bf00',
        '#ffb4ab',
        '#8f9193',
        '#41474d',
    ),
    ['Dedicated Aqua']: TonalPalette.fromColor('#42ebb5'),
    ['Dreamy Rose']: TonalPalette.fromColor('#d998eb'),
    ['Nerdy Orange']: TonalPalette.fromColor('#db946b'),
    ['Luxurious Green']: TonalPalette.fromColor('#306225'),
    ['Disgusting Yellow']: TonalPalette.fromColor("#ddff00"),
    ['Angry Red']: TonalPalette.fromColor("#ff0000"),
    ['Coffee Beans Brown']: TonalPalette.fromColor("#6b5545"),
}
export const ColorKeys = Object.keys(Palettes)

export type ColorsType = {
    [key in typeof ColorKeys[number]]: TonalPalette
}