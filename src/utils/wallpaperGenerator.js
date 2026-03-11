const CANVAS_WIDTH = 1242;
const CANVAS_HEIGHT = 2688;
const FIGMA_FRAME_WIDTH = 390;
const FIGMA_SCALE = CANVAS_WIDTH / FIGMA_FRAME_WIDTH;
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
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

const WORK_DAY_COLOR = "#87C4EE";
const OFF_DAY_COLOR = "#D8C7F1";

const scale = (value) => value * FIGMA_SCALE;

const parseDateParts = (dateText) => {
  if (!dateText) return null;

  const values = String(dateText).split("-");
  if (values.length !== 3) return null;

  const year = Number(values[0]);
  const month = Number(values[1]) - 1;
  const day = Number(values[2]);
  const parsed = new Date(year, month, day);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return { year, month: month + 1, day };
};

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateFromKey = (dateKey) => {
  const parsed = parseDateParts(dateKey);
  if (!parsed) return null;
  return new Date(parsed.year, parsed.month - 1, parsed.day);
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const loadImage = (imageUrl) =>
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

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const hexToRgb = (hex) => {
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

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`;

const mixColor = (baseHex, targetHex, ratio) => {
  const base = hexToRgb(baseHex);
  const target = hexToRgb(targetHex);

  return rgbToHex({
    r: base.r + (target.r - base.r) * ratio,
    g: base.g + (target.g - base.g) * ratio,
    b: base.b + (target.b - base.b) * ratio,
  });
};

const withAlpha = (hex, alpha) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getAirportCode = (destination = "") => {
  const codeMatch = destination.match(/\(([A-Z/]+)\)/);
  if (codeMatch?.[1]) {
    return codeMatch[1].split("/")[0];
  }

  const plainText = destination.split("(")[0].trim();
  const compact = plainText.replace(/[^A-Za-z]/g, "").toUpperCase();

  return compact.slice(0, 3) || "DST";
};

const formatTimeRange = (schedule) => {
  const departure = schedule.departureTime || "--:--";
  const arrival =
    schedule.arrivalTime && schedule.arrivalTime !== "-"
      ? schedule.arrivalTime
      : null;
  return arrival ? `${departure}-${arrival}` : departure;
};

const isOvernightFlight = (schedule) => {
  if (!schedule.arrivalTime || schedule.arrivalTime === "-") {
    return false;
  }

  return schedule.arrivalTime < schedule.departureTime;
};

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
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

const fillRoundedRect = (ctx, x, y, width, height, radius, color) => {
  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = color;
  ctx.fill();
};

const fillRectWithShadow = ({
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

const strokeRoundedRect = (ctx, x, y, width, height, radius, color, lineWidth = 1) => {
  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
};

const drawImageCover = (ctx, image, x, y, width, height, radius = 0) => {
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

const getMonthGrid = (referenceDate) => {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = firstDate.getDay();

  return { year, month, daysInMonth, firstDay };
};

const getCellLayout = () => {
  const cardLefts = [13, 65, 117, 169, 221, 273, 325];
  const dateRows = [346, 438, 530, 622, 714];
  const cardRows = [366, 458, 550, 642, 734];
  const cardWidth = scale(52);
  const cardBoxHeight = scale(68);

  return {
    cardLefts,
    dateRows,
    cardRows,
    cardWidth,
    cardBoxHeight,
  };
};

const getCellPosition = (day, firstDay, layout) => {
  const zeroBasedIndex = day + firstDay - 1;
  const row = Math.floor(zeroBasedIndex / 7);
  const col = zeroBasedIndex % 7;

  return {
    row,
    col,
    x: scale(layout.cardLefts[col]),
    y: scale(layout.cardRows[row]),
  };
};

const buildScheduleMap = (schedules, referenceDate) => {
  const { year, month } = getMonthGrid(referenceDate);
  const dayMap = new Map();
  const overlayEvents = [];

  const ensureDay = (dateKey) => {
    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, {
        baseColor: OFF_DAY_COLOR,
        items: [],
      });
    }
    return dayMap.get(dateKey);
  };

  schedules.forEach((schedule) => {
    const parsed = parseDateParts(schedule.date);
    if (!parsed) return;
    if (parsed.year !== year || parsed.month - 1 !== month) return;

    const startDate = new Date(parsed.year, parsed.month - 1, parsed.day);
    const startKey = toDateKey(startDate);
    const startDay = ensureDay(startKey);
    startDay.baseColor = WORK_DAY_COLOR;

    const overnight = isOvernightFlight(schedule);
    if (overnight) {
      const arrivalDate = addDays(startDate, 1);
      const arrivalKey = toDateKey(arrivalDate);
      const arrivalDay = ensureDay(arrivalKey);
      arrivalDay.baseColor = WORK_DAY_COLOR;

      overlayEvents.push({
        schedule,
        startKey,
        endKey: arrivalKey,
      });

      return;
    }

    startDay.items.push({
      schedule,
      kind: "flight",
    });
  });

  return { dayMap, overlayEvents };
};

const drawStickerTop = (ctx, x, y, width, color) => {
  const stickerWidth = scale(13);
  const stickerHeight = scale(4);
  const stickerGap = scale(10);
  const totalWidth = stickerWidth * 2 + stickerGap;
  const startX = x + (width - totalWidth) / 2;

  ctx.fillStyle = color;
  ctx.fillRect(startX, y, stickerWidth, stickerHeight);
  ctx.fillRect(
    startX + stickerWidth + stickerGap,
    y,
    stickerWidth,
    stickerHeight,
  );
};

const drawCardBase = ({ ctx, x, y, width, height, fill }) => {
  drawStickerTop(ctx, x, y, width, fill);
  fillRectWithShadow({
    ctx,
    x,
    y: y + scale(4),
    width,
    height: height - scale(4),
    color: fill,
  });
};

const drawFlightChip = ({ ctx, x, y, width, schedule }) => {
  const chipWidth = scale(40);
  const chipHeight = scale(12);
  const chipX = x + (width - chipWidth) / 2;
  const chipY = y + scale(10);
  const chipCenterX = chipX + chipWidth / 2;
  const chipCenterY = chipY + chipHeight / 2;
  const chipColor = withAlpha("#000000", 0.16);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  fillRoundedRect(ctx, chipX, chipY, chipWidth, chipHeight, chipHeight / 2, chipColor);

  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${scale(8)}px Alatsi, sans-serif`;
  ctx.fillText(schedule.aircraft || "FLT", chipCenterX, chipCenterY);

  ctx.font = `700 ${scale(10)}px Belgrano, serif`;
  ctx.fillText(getAirportCode(schedule.destination), x + width / 2, chipY + chipHeight + scale(7));

  ctx.font = `500 ${scale(5)}px Ysabeau Infant, sans-serif`;
  ctx.fillText(formatTimeRange(schedule), x + width / 2, chipY + chipHeight + scale(18));
};

const drawEmptyCell = ({ ctx, x, y, width, height, fill }) => {
  drawCardBase({ ctx, x, y, width, height, fill });
};

const drawSingleDayContent = ({ ctx, x, y, width, height, item }) => {
  drawFlightChip({
    ctx,
    x,
    y: y + scale(4),
    width,
    schedule: item.schedule,
  });
};

const drawSpanningFlight = ({ ctx, startRect, endRect, schedule }) => {
  if (!startRect || !endRect || startRect.row !== endRect.row) {
    drawFlightChip({
      ctx,
      x: startRect.x,
      y: startRect.y + scale(4),
      width: startRect.width,
      schedule,
    });
    drawFlightChip({
      ctx,
      x: endRect.x,
      y: endRect.y + scale(4),
      width: endRect.width,
      schedule,
    });
    return;
  }

  const spanX = startRect.x;
  const spanWidth = endRect.x + endRect.width - startRect.x;
  const chipWidth = scale(40);
  const chipHeight = scale(12);
  const chipX = spanX + (spanWidth - chipWidth) / 2;
  const chipY = startRect.y + scale(14);
  const chipCenterX = chipX + chipWidth / 2;
  const chipCenterY = chipY + chipHeight / 2;

  fillRoundedRect(
    ctx,
    chipX,
    chipY,
    chipWidth,
    chipHeight,
    chipHeight / 2,
    withAlpha("#000000", 0.16),
  );

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${scale(8)}px Alatsi, sans-serif`;
  ctx.fillText(schedule.aircraft || "FLT", chipCenterX, chipCenterY);

  ctx.font = `700 ${scale(10)}px Belgrano, serif`;
  ctx.fillText(getAirportCode(schedule.destination), spanX + spanWidth / 2, chipY + chipHeight + scale(7));

  ctx.font = `500 ${scale(5)}px Ysabeau Infant, sans-serif`;
  ctx.fillText(formatTimeRange(schedule), spanX + spanWidth / 2, chipY + chipHeight + scale(18));
};

const drawCalendar = ({
  ctx,
  schedules,
  referenceDate,
}) => {
  const { year, month, daysInMonth, firstDay } = getMonthGrid(referenceDate);
  const calendarX = scale(17);
  const calendarWidth = scale(356);
  const weekdayTop = scale(312);
  const dividerY = scale(336);
  const layout = getCellLayout();
  const dateYAdjustment = scale(2);
  const { dayMap, overlayEvents } = buildScheduleMap(schedules, referenceDate);
  const rectByDateKey = new Map();

  ctx.strokeStyle = withAlpha("#2b5170", 0.72);
  ctx.lineWidth = scale(1);
  ctx.beginPath();
  ctx.moveTo(calendarX, dividerY);
  ctx.lineTo(calendarX + calendarWidth, dividerY);
  ctx.stroke();

  DAY_LABELS.forEach((label, index) => {
    const x = scale(layout.cardLefts[index] + 26);
    const weekendColor = index === 0 ? "#d72323" : index === 6 ? "#0a56ff" : "#1b1b1b";

    ctx.fillStyle = weekendColor;
    ctx.font = `${scale(12)}px Belgrano, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(label, x, weekdayTop);
  });

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = getCellPosition(day, firstDay, layout);
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEntry = dayMap.get(dateKey) || {
      baseColor: OFF_DAY_COLOR,
      items: [],
    };

    rectByDateKey.set(dateKey, {
      row: cell.row,
      col: cell.col,
      x: cell.x,
      y: cell.y,
      width: layout.cardWidth,
      height: layout.cardBoxHeight,
    });

    ctx.textAlign = "center";
    ctx.fillStyle = cell.col === 0 ? "#d72323" : cell.col === 6 ? "#0a56ff" : "#161616";
    ctx.font = `${scale(10)}px Brawler, serif`;
    ctx.textBaseline = "top";
    ctx.fillText(
      String(day),
      cell.x + layout.cardWidth / 2,
      scale(layout.dateRows[cell.row]) + dateYAdjustment,
    );

    drawEmptyCell({
      ctx,
      x: cell.x,
      y: cell.y,
      width: layout.cardWidth,
      height: layout.cardBoxHeight,
      fill: dayEntry.baseColor,
    });

    const localItems = dayEntry.items.slice(0, 2);
    localItems.forEach((item, index) => {
      const itemHeight = localItems.length === 1
        ? layout.cardBoxHeight
        : Math.floor((layout.cardBoxHeight - scale(4)) / 2);
      const itemY = cell.y + index * (itemHeight + scale(4));

      if (localItems.length > 1) {
        drawCardBase({
          ctx,
          x: cell.x,
          y: itemY,
          width: layout.cardWidth,
          height: itemHeight,
          fill: dayEntry.baseColor,
        });
      }

      drawSingleDayContent({
        ctx,
        x: cell.x,
        y: itemY,
        width: layout.cardWidth,
        height: itemHeight,
        item,
      });
    });
  }

  overlayEvents.forEach((event) => {
    const startRect = rectByDateKey.get(event.startKey);
    const endRect = rectByDateKey.get(event.endKey);
    if (!startRect || !endRect) return;

    drawSpanningFlight({
      ctx,
      startRect,
      endRect,
      schedule: event.schedule,
    });
  });

  const totalSchedules = schedules.length;
  ctx.fillStyle = withAlpha("#2b5170", 0.68);
  ctx.font = "600 24px Ysabeau Infant, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`${MONTH_LABELS[month]} route plan · ${totalSchedules} flights`, 56, 2580);
};

export const generateWallpaperImage = async ({
  backgroundColor = "#6d28d9",
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

  const skyColor = mixColor(backgroundColor, "#cfe9f7", 0.84);
  const skyShade = mixColor(backgroundColor, "#b8dcef", 0.74);
  const accentColor = mixColor(backgroundColor, "#87c4ee", 0.68);
  const month = MONTH_LABELS[referenceDate.getMonth()];
  const thumbnail = await loadImage(thumbnailImageUrl);

  const backgroundGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  backgroundGradient.addColorStop(0, skyShade);
  backgroundGradient.addColorStop(0.55, skyColor);
  backgroundGradient.addColorStop(1, mixColor(backgroundColor, "#d8edf8", 0.88));
  ctx.fillStyle = backgroundGradient;
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
  drawImageCover(ctx, thumbnail, photoX, photoY, photoWidth, photoHeight, photoRadius);

  if (!thumbnail) {
    const placeholderGradient = ctx.createLinearGradient(
      photoX,
      photoY,
      photoX,
      photoY + photoHeight,
    );
    placeholderGradient.addColorStop(0, withAlpha("#ffffff", 0.6));
    placeholderGradient.addColorStop(1, withAlpha(accentColor, 0.65));
    fillRoundedRect(
      ctx,
      photoX,
      photoY,
      photoWidth,
      photoHeight,
      photoRadius,
      placeholderGradient,
    );

    ctx.fillStyle = withAlpha("#2f4f68", 0.86);
    ctx.font = "600 54px Ysabeau Infant, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Select a thumbnail", CANVAS_WIDTH / 2, photoY + photoHeight / 2 - 8);
    ctx.font = "28px Ysabeau Infant, sans-serif";
    ctx.fillText("Your wallpaper preview will appear here.", CANVAS_WIDTH / 2, photoY + photoHeight / 2 + 44);
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
