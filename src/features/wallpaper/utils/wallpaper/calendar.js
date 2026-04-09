import { DAY_LABELS, MONTH_LABELS, scale } from "./constants.js";
import { withAlpha } from "./color.js";
import {
  addDays,
  formatTotalDuration,
  getMonthGrid,
  getScheduleDurationMinutes,
  isOvernightFlight,
  parseDateParts,
  toDateKey,
} from "./date.js";
import { fillRectWithShadow, fillRoundedRect } from "./canvas.js";
import {
  DEFAULT_EVENT_TYPE_COLORS,
  EVENT_TYPE_LABELS,
} from "../../constants/eventTypes.js";

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

  if (!schedule.isLayover) {
    return arrival ? `${departure}-${arrival}` : departure;
  }

  const hongKongDeparture =
    schedule.hongKongDepartureTime && schedule.hongKongDepartureTime !== "-"
      ? schedule.hongKongDepartureTime
      : "--:--";
  const hongKongArrival =
    schedule.hongKongArrivalTime && schedule.hongKongArrivalTime !== "-"
      ? schedule.hongKongArrivalTime
      : "--:--";

  return `${departure}-${arrival || "--:--"} / ${hongKongDeparture}-${hongKongArrival}`;
};

const getEventType = (schedule) => schedule.eventType ?? "flight";

const getEventLabel = (schedule) => {
  const eventType = getEventType(schedule);
  if (eventType === "flight") {
    return getAirportCode(schedule.destination);
  }

  return EVENT_TYPE_LABELS[eventType] ?? EVENT_TYPE_LABELS.flight;
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

const buildScheduleMap = (schedules, referenceDate, eventTypeColors) => {
  const { year, month } = getMonthGrid(referenceDate);
  const dayMap = new Map();
  const overlayEvents = [];
  const getDayDiff = (startDate, endDate) =>
    Math.round((endDate - startDate) / (24 * 60 * 60 * 1000));

  const ensureDay = (dateKey) => {
    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, {
        baseColor: eventTypeColors.off,
        items: [],
      });
    }
    return dayMap.get(dateKey);
  };

  schedules.forEach((schedule) => {
    const parsed = parseDateParts(schedule.date);
    if (!parsed) return;

    const eventType = getEventType(schedule);
    const blockColor = eventTypeColors[eventType] ?? eventTypeColors.off;
    const startDate = new Date(parsed.year, parsed.month - 1, parsed.day);
    const layoverEndParsed = schedule.isLayover
      ? parseDateParts(schedule.hongKongDepartureDate)
      : null;
    const layoverEndDate = layoverEndParsed
      ? new Date(
          layoverEndParsed.year,
          layoverEndParsed.month - 1,
          layoverEndParsed.day,
        )
      : null;
    const rangeEndDate = layoverEndDate ?? startDate;
    const currentMonthStart = new Date(year, month, 1);
    const currentMonthEnd = new Date(year, month + 1, 0);

    if (rangeEndDate < currentMonthStart || startDate > currentMonthEnd) {
      return;
    }

    const colorStartDate =
      startDate < currentMonthStart ? currentMonthStart : startDate;
    const colorEndDate =
      rangeEndDate > currentMonthEnd ? currentMonthEnd : rangeEndDate;

    for (
      let currentDate = new Date(colorStartDate);
      currentDate <= colorEndDate;
      currentDate = addDays(currentDate, 1)
    ) {
      ensureDay(toDateKey(currentDate)).baseColor = blockColor;
    }

    if (parsed.year !== year || parsed.month - 1 !== month) return;

    if (schedule.isLayover && layoverEndDate) {
      const layoverDayDiff = getDayDiff(startDate, layoverEndDate);

      if (layoverDayDiff === 1) {
        overlayEvents.push({
          schedule,
          startKey: toDateKey(startDate),
          endKey: toDateKey(layoverEndDate),
        });
        return;
      }

      const middleOffset = Math.floor(layoverDayDiff / 2);
      const middleDate = addDays(startDate, middleOffset);

      if (middleDate >= currentMonthStart && middleDate <= currentMonthEnd) {
        ensureDay(toDateKey(middleDate)).items.push({
          schedule,
          kind: "flight",
        });
      }

      return;
    }

    const startKey = toDateKey(startDate);
    const startDay = ensureDay(startKey);

    if (eventType === "flight" && isOvernightFlight(schedule)) {
      const arrivalDate = addDays(startDate, 1);
      const arrivalKey = toDateKey(arrivalDate);
      const arrivalDay = ensureDay(arrivalKey);
      arrivalDay.baseColor = blockColor;

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

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  fillRoundedRect(
    ctx,
    chipX,
    chipY,
    chipWidth,
    chipHeight,
    chipHeight / 2,
    withAlpha("#000000", 0.16),
  );

  // 캔버스 텍스트는 ctx.font 값으로 직접 그려지므로, 여기서 최종 이미지의 폰트가 결정됩니다.
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${scale(8)}px Alatsi, sans-serif`;
  ctx.fillText(
    getEventType(schedule) === "flight"
      ? schedule.aircraft || "FLT"
      : EVENT_TYPE_LABELS[getEventType(schedule)] || "EVT",
    chipCenterX,
    chipCenterY,
  );

  ctx.font = `800 ${scale(10)}px Belgrano, serif`;
  ctx.fillText(
    getEventLabel(schedule),
    x + width / 2,
    chipY + chipHeight + scale(7),
  );

  ctx.font = `500 ${scale(7)}px Ysabeau Infant, sans-serif`;
  const timeLines = formatTimeRange(schedule).split(" / ");
  timeLines.forEach((line, index) => {
    ctx.fillText(
      line,
      x + width / 2,
      chipY + chipHeight + scale(18) + index * scale(8),
    );
  });
};

const drawSingleDayContent = ({ ctx, x, y, width, item }) => {
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
  // 자정을 넘기는 일정도 일반 일정 칩과 같은 폰트 설정을 사용합니다.
  ctx.font = `700 ${scale(8)}px Alatsi, sans-serif`;
  ctx.fillText(schedule.aircraft || "FLT", chipCenterX, chipCenterY);

  ctx.font = `800 ${scale(10)}px Belgrano, serif`;
  ctx.fillText(
    getAirportCode(schedule.destination),
    spanX + spanWidth / 2,
    chipY + chipHeight + scale(7),
  );

  ctx.font = `500 ${scale(7)}px Ysabeau Infant, sans-serif`;
  const timeLines = formatTimeRange(schedule).split(" / ");
  timeLines.forEach((line, index) => {
    ctx.fillText(
      line,
      spanX + spanWidth / 2,
      chipY + chipHeight + scale(18) + index * scale(7),
    );
  });
};

export const drawCalendar = ({
  ctx,
  schedules,
  referenceDate,
  eventTypeColors = DEFAULT_EVENT_TYPE_COLORS,
}) => {
  const { year, month, daysInMonth, firstDay } = getMonthGrid(referenceDate);
  const calendarX = scale(17);
  const calendarWidth = scale(356);
  const weekdayTop = scale(312);
  const dividerY = scale(336);
  const layout = getCellLayout();
  const dateYAdjustment = scale(2);
  const { dayMap, overlayEvents } = buildScheduleMap(
    schedules,
    referenceDate,
    eventTypeColors,
  );
  const rectByDateKey = new Map();

  ctx.strokeStyle = withAlpha("#2b5170", 0.72);
  ctx.lineWidth = scale(1);
  ctx.beginPath();
  ctx.moveTo(calendarX, dividerY);
  ctx.lineTo(calendarX + calendarWidth, dividerY);
  ctx.stroke();

  DAY_LABELS.forEach((label, index) => {
    const x = scale(layout.cardLefts[index] + 26);
    const weekendColor =
      index === 0 ? "#d72323" : index === 6 ? "#0a56ff" : "#1b1b1b";

    ctx.fillStyle = weekendColor;
    ctx.font = `600 ${scale(12)}px Belgrano, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(label, x, weekdayTop);
  });

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = getCellPosition(day, firstDay, layout);
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEntry = dayMap.get(dateKey) || {
      baseColor: eventTypeColors.off,
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
    ctx.fillStyle =
      cell.col === 0 ? "#d72323" : cell.col === 6 ? "#0a56ff" : "#161616";
    ctx.font = `${scale(10)}px Brawler, serif`;
    ctx.textBaseline = "top";
    ctx.fillText(
      String(day),
      cell.x + layout.cardWidth / 2,
      scale(layout.dateRows[cell.row]) + dateYAdjustment,
    );

    drawCardBase({
      ctx,
      x: cell.x,
      y: cell.y,
      width: layout.cardWidth,
      height: layout.cardBoxHeight,
      fill: dayEntry.baseColor,
    });

    const localItems = dayEntry.items.slice(0, 2);
    localItems.forEach((item, index) => {
      const itemHeight =
        localItems.length === 1
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

  const totalFlightMinutes = schedules.reduce(
    (sum, schedule) =>
      getEventType(schedule) === "flight"
        ? sum + getScheduleDurationMinutes(schedule)
        : sum,
    0,
  );

  ctx.fillStyle = withAlpha("#000000", 0.8);
  ctx.font = `600 ${scale(12)}px Ysabeau Infant, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(
    `${MONTH_LABELS[month]} total ${formatTotalDuration(totalFlightMinutes)}`,
    56,
    2600,
  );
};
