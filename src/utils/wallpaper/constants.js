export const CANVAS_WIDTH = 1242;
export const CANVAS_HEIGHT = 2688;
export const FIGMA_FRAME_WIDTH = 390;
export const FIGMA_SCALE = CANVAS_WIDTH / FIGMA_FRAME_WIDTH;
export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const scale = (value) => value * FIGMA_SCALE;
