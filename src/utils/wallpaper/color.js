const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const hexToRgb = (hex) => {
  const normalized = hex.replace("#", "");
  const safeHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  const value = Number.parseInt(safeHex, 16);

  if (Number.isNaN(value)) {
    return { r: 135, g: 196, b: 238 };
  }

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

export const withAlpha = (hex, alpha) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const mixColor = (baseHex, targetHex, ratio) => {
  const base = hexToRgb(baseHex);
  const target = hexToRgb(targetHex);

  return `#${[base.r, base.g, base.b]
    .map((channel, index) => {
      const targetChannels = [target.r, target.g, target.b];
      return clamp(
        Math.round(channel + (targetChannels[index] - channel) * ratio),
        0,
        255,
      )
        .toString(16)
        .padStart(2, "0");
    })
    .join("")}`;
};
