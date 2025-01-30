/**
 * Adjusts the brightness of a given color by darkening it.
 * The function decreases the RGB components of the color to create a darker shade.
 *
 * @param {string} color - A string representing the hexadecimal color value (e.g., "#RRGGBB").
 * @param {number} [tone=30] - The amount to darken each RGB component. Default is 30.
 * @returns {string} A new hexadecimal color string that represents the darker shade of the input color.
 */
export const darken = (color: string, tone: number = 30) => {
  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);

  r = Math.max(0, r - tone);
  g = Math.max(0, g - tone);
  b = Math.max(0, b - tone);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * A list of hex color codes used for marketing purposes.
 * This array contains a predefined selection of colors
 * that can be utilized for branding, design, and promotional
 * materials to ensure consistency and attractiveness.
 */
export const COLORS_LIST_MARKETING = [
  '#00A76F',
  '#00B8D9',
  '#003768',
  '#6d1818',
  '#392996',
  '#B71D18',
  '#00A76F',
  '#00B8D9',
  '#003768',
  '#6d1818',
  '#392996',
  '#B71D18',
  '#00A76F',
  '#00B8D9',
  '#003768',
  '#6d1818',
  '#392996',
  '#B71D18',
  '#00A76F',
  '#00B8D9',
  '#003768',
  '#6d1818',
  '#392996',
  '#B71D18',
];

export const COLORS = {
  success: '#00AB55',
  danger: '#FF4842',
  warning: '#dc9f00',
  info: '#3a7dd5',
}

export const TX_COLORS: any = {
  'transferTo': COLORS.danger,
  'transferFrom': COLORS.success,
  'deposit': COLORS.success,
  'withdraw': COLORS.danger,
  'locked': COLORS.info,
  'claimed': COLORS.success,
  'approved': COLORS.warning,
  'collected': COLORS.danger,
  'released': COLORS.success,
}
