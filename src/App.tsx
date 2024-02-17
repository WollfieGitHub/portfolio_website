import React, {useEffect, useMemo, useState} from "react";
import {AppBar, Button, Paper, ThemeProvider, Typography} from "@mui/material";
import {LightTheme} from "./components/style/Theme";
import {TonalPalette} from "./components/style/tonalPalette";
import ThemColorController from "./components/style/ThemColorController";


const defaultThemeColor = "#7cb9d0";

function App() {
	const [themeColor, setThemeColor] = useState(defaultThemeColor);

	const theme = useMemo(() => {
		return LightTheme(TonalPalette.fromColor(themeColor));
	}, [themeColor]);

	useEffect(() => {
		document.body.style.backgroundColor = theme.palette.background.default;
	}, [theme.palette.background.default]);

	return (
		<ThemeProvider theme={theme}>
			<div className="App" style={{
				marginTop: 50,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
				width: "60%",
      }}>
				<AppBar sx={{ padding: 2 }}>
					<Typography variant={"h3"} fontWeight={"lighter"}>
						Léo Wolff
					</Typography>
				</AppBar>
				<ThemColorController defaultColor={defaultThemeColor} onColorChanged={setThemeColor}/>
				<div style={{padding: 10}}>
					<Paper sx={{padding: 5}}>
						<Button>
							Hey !!!
						</Button>
					</Paper>
				</div>
			</div>
		</ThemeProvider>
	);
}

export default App;
