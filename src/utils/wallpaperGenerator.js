import { drawImageCover, fillRoundedRect, loadImage, strokeRoundedRect } from "./wallpaper/canvas.js";
import { withAlpha } from "./wallpaper/color.js";
import { drawCalendar } from "./wallpaper/calendar.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, MONTH_LABELS, scale } from "./wallpaper/constants.js";

export const generateWallpaperImage = async ({
  backgroundColor = "#6d28d9",
  eventTypeColors,
  thumbnailImageUrl = "",
  schedules = [],
  referenceDate = new Date(),
}) => {
  const dpr = window.devicePixelRatio || 1;
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH * dpr;
  canvas.height = CANVAS_HEIGHT * dpr;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context is not available.");
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const accentColor = backgroundColor;
  const month = MONTH_LABELS[referenceDate.getMonth()];
  const thumbnail = await loadImage(thumbnailImageUrl);

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const photoX = scale(17);
  const photoY = scale(17);
  const photoWidth = scale(356);
  const photoHeight = scale(285);
  const photoRadius = scale(20);

  fillRoundedRect(
    ctx,
    photoX,
    photoY,
    photoWidth,
    photoHeight,
    photoRadius,
    withAlpha("#ffffff", 0.35),
  );
  drawImageCover(
    ctx,
    thumbnail,
    photoX,
    photoY,
    photoWidth,
    photoHeight,
    photoRadius,
  );

  if (!thumbnail) {
    fillRoundedRect(
      ctx,
      photoX,
      photoY,
      photoWidth,
      photoHeight,
      photoRadius,
      withAlpha("#ffffff", 0.65),
    );

    ctx.fillStyle = withAlpha("#2f4f68", 0.86);
    ctx.font = "600 54px Ysabeau Infant, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "Select a thumbnail",
      CANVAS_WIDTH / 2,
      photoY + photoHeight / 2 - 8,
    );
    ctx.font = "28px Ysabeau Infant, sans-serif";
    ctx.fillText(
      "Your wallpaper preview will appear here.",
      CANVAS_WIDTH / 2,
      photoY + photoHeight / 2 + 44,
    );
  }

  fillRoundedRect(
    ctx,
    scale(17),
    scale(211),
    scale(142),
    scale(67),
    0,
    withAlpha("#ffffff", 0.12),
  );
  ctx.fillStyle = accentColor;
  ctx.fillRect(scale(28), scale(221), scale(1), scale(14));
  ctx.fillStyle = accentColor;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = `700 ${scale(14)}px Belgrano, serif`;
  ctx.fillText(month, scale(33), scale(220));
  ctx.font = `700 ${scale(26)}px Belgrano, serif`;
  ctx.fillText("Schedule", scale(26), scale(238));

  drawCalendar({
    ctx,
    eventTypeColors,
    schedules,
    referenceDate,
  });

  strokeRoundedRect(
    ctx,
    photoX,
    photoY,
    photoWidth,
    photoHeight,
    photoRadius,
    withAlpha("#ffffff", 0.42),
    2,
  );

  return canvas.toDataURL("image/png", 1.0);
};
