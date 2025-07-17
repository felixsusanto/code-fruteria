import {
  themeAlpine,
  colorSchemeDarkBlue,
} from "ag-grid-community";

const params = {
  fontFamily: "monospace",
  headerFontWeight: 700,
  borderRadius: 0,
};

export const agGridDarkTheme = themeAlpine.withPart(colorSchemeDarkBlue).withParams(params);
export const agGridLightTheme = themeAlpine.withParams(params);
