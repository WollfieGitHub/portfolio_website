import {useEffect, useState} from "react";
import {hexToRgb, hslToRgb, rgbDictToHex, rgbDictToHsl} from "./colorUtils";
import {Slider} from "@mui/material";

interface ThemColorControllerProps {
	defaultColor: string;
	onColorChanged: (color: string) => void;
}

export default function ThemColorController(
	{ defaultColor, onColorChanged }: ThemColorControllerProps,
) {
	const [colorHue, setColorHue] = useState(rgbDictToHsl(hexToRgb(defaultColor)).h);
	
	useEffect(() => {
		const { s, l } = rgbDictToHsl(hexToRgb(defaultColor));
		
		onColorChanged(rgbDictToHex(hslToRgb(colorHue, s, l)))
		
	}, [colorHue, defaultColor, onColorChanged])
	
	return <Slider
		min={0} max={360} step={20}
		onChange={(e, newValue) => setColorHue((Array.isArray(newValue) ? newValue[0] : newValue)/360)}
		style={{

			width: "90%",
		}}/>;
}