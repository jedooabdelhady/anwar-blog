import { buildLegacyTheme } from "sanity";

/**
 * Anwar light earthy theme for Sanity Studio.
 * Matches the public site palette (SIENNA / GUM / CLAY / OAK / PEPPER / SMOKE).
 */
const PALETTE = {
  sienna: "#6B3F23",
  siennaDark: "#5a341c",
  gum:    "#8F8C78",
  clay:   "#EDE5DE",
  oak:    "#B0997D",
  pepper: "#38261C",
  smoke:  "#DBD9CF",

  bg:        "#f5efe8",
  bgSoft:    "#ece2d6",
  bgSofter:  "#f7f1ea",
  ink:       "#2b1d15",
  muted:     "#6b5b50",
  line:      "#d9cdbe",
  white:     "#ffffff",
  danger:    "#a3422f",
  success:   "#5e8a4f",
  warning:   "#b08833",
};

export const anwarStudioTheme = buildLegacyTheme({
  /* base */
  "--black":        PALETTE.pepper,
  "--white":        PALETTE.bgSofter,

  /* surface */
  "--gray":         PALETTE.muted,
  "--gray-base":    PALETTE.muted,

  "--component-bg": PALETTE.bgSofter,
  "--component-text-color": PALETTE.pepper,

  /* primary (used for highlights, links, focused inputs) */
  "--brand-primary": PALETTE.sienna,

  /* default button */
  "--default-button-color":          PALETTE.bgSoft,
  "--default-button-primary-color":  PALETTE.sienna,
  "--default-button-success-color":  PALETTE.success,
  "--default-button-warning-color":  PALETTE.warning,
  "--default-button-danger-color":   PALETTE.danger,

  /* state colors */
  "--state-info-color":    PALETTE.gum,
  "--state-success-color": PALETTE.success,
  "--state-warning-color": PALETTE.warning,
  "--state-danger-color":  PALETTE.danger,

  /* nav / sidebar */
  "--main-navigation-color":      PALETTE.pepper,
  "--main-navigation-color--inverted": PALETTE.bgSofter,

  /* focus ring */
  "--focus-color": PALETTE.sienna,
});
