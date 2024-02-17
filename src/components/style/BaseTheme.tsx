import {createTheme, Palette, ThemeOptions} from "@mui/material";
import {PaletteColor} from "./tonalPalette";
import {withAlpha} from "./colorUtils";

// @ts-ignore
export const BaseTheme = createTheme({
	borderRadius: {
		small: "8px",
		medium: "12px",
		large: "16px",
		extraLarge: "28px",
		full: "50%",
	},
	padding: {
		small: "8px",
		medium: "24px",
		large: "40px",
	},
	components: {
		MuiButton: {
			defaultProps: {
				variant: "contained",
				color: "primary",
			},
			styleOverrides: {
				root: ({theme, ownerState}) => ({
					...(ownerState.variant === "outlined" && {
						borderColor: theme.palette.outline,
					}),
					"&:hover": {
						...(ownerState.color === "primary" && {backgroundColor: theme.palette.primaryContainer}),
						...(ownerState.color === "secondary" && {backgroundColor: theme.palette.secondaryContainer}),
						...(ownerState.color === "info" && {backgroundColor: theme.palette.infoContainer}),
						...(ownerState.color === "error" && {backgroundColor: theme.palette.errorContainer}),
					},
					borderRadius: theme.borderRadius.extraLarge,
					padding: "0 24px",
					...(ownerState.size === "medium" && {height: "40px"}),
					...(ownerState.size === "small" && {height: "28px"}),
					fontFamily: "\"Google Sans Text\", sans-serif",
				}),
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: ({theme, ownerState}) => ({
					...(ownerState.variant === "outlined" && {
						borderColor: theme.palette.outline,
					}),
				}),
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {color: "inherit"},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {color: "inherit"},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: ({theme, ownerState}) => ({
					...(ownerState.variant === "outlined" && {
						borderColor: theme.palette.outline,
					}),
				}),
			},
		},
		MuiPaper: {
			defaultProps: {color: "primary"},
			styleOverrides: {
				root: ({theme, ownerState}) => {

					const colorIndex = ownerState.color as keyof Palette;
					const colorContainerIndex = colorIndex + "Container" as keyof Palette;

					return (
						{
							["&:not(" +
							".MuiMenu-paper, " +
							".MuiAppBar-root, " +
							".MuiCard-root, " +
							".MuiDialog-paper, " +
							".MuiPopover-paper," +
							".MuiPickersPopper-paper," +
							")"]: {
								padding: 5,
								borderRadius: theme.borderRadius.medium,
								backgroundColor: withAlpha(
									(theme.palette[colorIndex] as PaletteColor).main as string,
									ownerState.color === "primary" ? 0.05 : 1,
								),
								backgroundImage: "none",
								color: (theme.palette[colorContainerIndex] as PaletteColor).contrastText,
							},
							["&.MuiMenu-paper"]: {
								padding: 0,
							},
						});
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
				paper: ({theme}) => ({
					padding: theme.padding.small,
					borderRadius: theme.borderRadius.small,
				}),
			},
		},
		MuiCard: {
			styleOverrides: {
				root: ({theme}) => ({
					borderRadius: theme.borderRadius.medium,
				}),
			},
		},
		MuiAppBar: {
			// @ts-ignore
			defaultProps: {color: "primaryContainer", enableColorOnDark: true},
			styleOverrides: {
				root: {position: "sticky"},
			},
		},
		MuiIconButton: {defaultProps: {color: "primary"}},
		MuiDivider: {
			styleOverrides: {
				root: ({theme}) => ({
					borderColor: theme.palette.outline,
				}),
			},
		},
		MuiTab: {
			styleOverrides: {
				root: ({ownerState}) => ({
					...(!ownerState.label ? {
						minWidth: "inherit",
						aspectRatio: "1/1",
					} : {}),
					"& > .MuiTouchRipple-root": {
						borderRadius: 999,
						left: 0,
						right: 0,
						...(!ownerState.label ? {
							top: 0,
							bottom: 0,
						} : {
							top: 9,
							bottom: 9,
						}),
					},
				}),
			},
		},
		MuiTabs: {
			styleOverrides: {
				root: ({theme, ownerState}) => ({
					"&  .MuiTabs-indicator": {
						backgroundColor: "transparent",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",

						"&:after": {
							content: "\"\"",
							display: "block",
							width: ownerState.orientation === "horizontal" ? "40%" : "100%",
							height: ownerState.orientation === "horizontal" ? "100%" : "40%",
							// @ts-ignore
							backgroundColor: theme.palette[ownerState.indicatorColor]!.main,
							borderTopLeftRadius: theme.borderRadius.extraLarge,
							borderTopRightRadius: theme.borderRadius.extraLarge,
						},
					},
				}),
			},
		},
		MuiBadge: {
			defaultProps: {color: "primary"},
		},
	},
	typography: {
		fontFamily: [
			"\"Google Sans Text\", sans-serif",
			"\"Open Sans\", sans-serif",
			"-apple-system",
			"BlinkMacSystemFont",
			"\"Segoe UI\"",
			"Roboto",
			"\"Helvetica Neue\"",
			"Arial",
			"sans-serif",
			"\"Apple Color Emoji\"",
			"\"Segoe UI Emoji\"",
			"\"Segoe UI Symbol\"",
		].join(","),
	},
}) as ThemeOptions;