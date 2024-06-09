const generatedColors = [];
let totalPossibleColors = 256 * 256 * 256;

export function getRandomColor() {
  if (generatedColors.length >= totalPossibleColors) {
    generatedColors.length = 0;
  }
  let color = "";
  do {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const hexR = r.toString(16).padStart(2, "0");
    const hexG = g.toString(16).padStart(2, "0");
    const hexB = b.toString(16).padStart(2, "0");

    color = `#${hexR}${hexG}${hexB}`;
  } while (generatedColors.includes(color));

  generatedColors.push(color);

  return color;
}
