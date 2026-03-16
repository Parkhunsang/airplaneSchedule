export const loadImage = (imageUrl) =>
  new Promise((resolve) => {
    if (!imageUrl) {
      resolve(null);
      return;
    }

    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = imageUrl;
  });

export const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

export const fillRoundedRect = (ctx, x, y, width, height, radius, color) => {
  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = color;
  ctx.fill();
};

export const fillRectWithShadow = ({
  ctx,
  x,
  y,
  width,
  height,
  color,
  shadowColor = "rgba(0, 0, 0, 0.1)",
  shadowBlur = 2,
  shadowOffsetX = 0,
  shadowOffsetY = 2,
}) => {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = shadowOffsetX;
  ctx.shadowOffsetY = shadowOffsetY;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
};

export const strokeRoundedRect = (
  ctx,
  x,
  y,
  width,
  height,
  radius,
  color,
  lineWidth = 1,
) => {
  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
};

export const drawImageCover = (ctx, image, x, y, width, height, radius = 0) => {
  if (!image) {
    return;
  }

  const imageRatio = image.naturalWidth / image.naturalHeight;
  const frameRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let offsetX = x;
  let offsetY = y;

  if (imageRatio > frameRatio) {
    drawHeight = height;
    drawWidth = height * imageRatio;
    offsetX = x - (drawWidth - width) / 2;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;
    offsetY = y - (drawHeight - height) / 2;
  }

  ctx.save();
  if (radius > 0) {
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.clip();
  }
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  ctx.restore();
};
