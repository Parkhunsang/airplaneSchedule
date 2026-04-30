import {
  drawImageCover,
  fillRoundedRect,
  loadImage,
  strokeRoundedRect,
} from "./wallpaper/canvas.js";
import { withAlpha } from "./wallpaper/color.js";
import { drawCalendar } from "./wallpaper/calendar.js";
import { getMonthGrid } from "./wallpaper/date.js";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MONTH_LABELS,
  WALLPAPER_SIX_WEEK_VERTICAL_OFFSET,
  scale,
} from "./wallpaper/constants.js";

const loadWallpaperFonts = async () => {
  if (!document.fonts?.load) {
    return;
  }

  await Promise.all([
    document.fonts.load('700 12px "Belgrano"'),
    document.fonts.load('400 12px "Brawler"'),
    document.fonts.load('500 12px "Ysabeau Infant"'),
  ]);
};

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

  await loadWallpaperFonts();

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const accentColor = backgroundColor;
  const month = MONTH_LABELS[referenceDate.getMonth()];
  const thumbnail = await loadImage(thumbnailImageUrl);
  const { weekCount } = getMonthGrid(referenceDate);
  const verticalOffset =
    weekCount > 5 ? WALLPAPER_SIX_WEEK_VERTICAL_OFFSET : 0;
  const photoHeight = scale(288 - verticalOffset);

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const photoX = scale(17);
  const photoY = scale(17);
  const photoWidth = scale(360);
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
    scale(211 - verticalOffset),
    scale(142),
    scale(67),
    0,
    withAlpha("#ffffff", 0.12),
  );
  ctx.fillStyle = accentColor;
  ctx.fillRect(scale(28), scale(221 - verticalOffset), scale(1), scale(14));
  ctx.fillStyle = accentColor;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  // 상단 월/제목 텍스트의 폰트도 여기서 캔버스 font 문자열로 직접 지정합니다.
  ctx.font = `700 ${scale(14)}px Belgrano, serif`;
  ctx.fillText(month, scale(33), scale(220 - verticalOffset));
  ctx.font = `700 ${scale(26)}px Belgrano, serif`;
  ctx.fillText("Schedule", scale(26), scale(238 - verticalOffset));

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
