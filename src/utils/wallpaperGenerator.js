const SAFE_MAX = 20;

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

const formatShort = (schedule, maxLength = 18) => {
  const title = `${schedule.aircraft || "-"} ${schedule.destination || "-"}`.trim();
  const time = schedule.departureTime || "";
  const line = time ? `${time} ${title}` : title;

  if (line.length <= maxLength) {
    return line;
  }
  return `${line.slice(0, maxLength - 1)}...`;
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

export const generateWallpaperImage = async ({
  backgroundColor = "#6d28d9",
  thumbnailImageUrl = "",
  schedules = [],
  referenceDate = new Date(),
}) => {
  const width = 1242;
  const height = 2688;
  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const dpr = window.devicePixelRatio || 1;

  const canvas = document.createElement("canvas");
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context is not available.");
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Thumbnail
  const thumbnail = await loadImage(thumbnailImageUrl);
  const thumbSize = 380;
  const thumbX = (width - thumbSize) / 2;
  const thumbY = 140;

  ctx.fillStyle = "rgba(255,255,255,0.24)";
  ctx.fillRect(thumbX - 12, thumbY - 12, thumbSize + 24, thumbSize + 24);
  if (thumbnail) {
    const ratio = Math.min(
      thumbSize / thumbnail.naturalWidth,
      thumbSize / thumbnail.naturalHeight,
    );
    const scaledW = thumbnail.naturalWidth * ratio;
    const scaledH = thumbnail.naturalHeight * ratio;
    const x = thumbX + (thumbSize - scaledW) / 2;
    const y = thumbY + (thumbSize - scaledH) / 2;
    ctx.drawImage(thumbnail, x, y, scaledW, scaledH);
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize);
    ctx.fillStyle = "#fff";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("No thumbnail selected", width / 2, thumbY + thumbSize / 2);
    ctx.textAlign = "left";
  }

  // Title
  ctx.fillStyle = "#fff";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("FLIGHT SCHEDULE", width / 2, 90);
  ctx.textAlign = "left";

  // Calendar area
  const calendarX = 64;
  const calendarY = 600;
  const calendarWidth = width - calendarX * 2;
  const cellW = calendarWidth / 7;
  const cellH = 170;

  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = firstDate.getDay();

  const grouped = {};
  schedules.forEach((schedule) => {
    const parsed = parseDateParts(schedule.date);
    if (!parsed) return;
    const key = `${parsed.year}-${String(parsed.month).padStart(2, "0")}-${String(parsed.day).padStart(2, "0")}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(schedule);
  });

  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(calendarX, calendarY, calendarWidth, 72);
  ctx.fillStyle = "#fff";
  ctx.font = "34px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${year}.${String(month + 1).padStart(2, "0")}`, width / 2, calendarY + 48);
  ctx.textAlign = "left";

  const monthHeaderY = calendarY + 86;
  for (let i = 0; i < 7; i++) {
    const x = calendarX + i * cellW;
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.strokeRect(x, monthHeaderY, cellW, 64);
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(dayLabels[i], x + cellW / 2, monthHeaderY + 40);
  }

  let stripe = 0;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const dayIndex = row * 7 + col - firstDay;
      const day = dayIndex + 1;
      const x = calendarX + col * cellW;
      const y = monthHeaderY + 64 + row * cellH;
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.strokeRect(x, y, cellW, cellH);

      if (day >= 1 && day <= daysInMonth) {
        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const items = grouped[dateKey] || [];

        ctx.fillStyle = stripe % 2 === 0
          ? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.1)";
        stripe += 1;

        ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 24px Arial";
        ctx.fillText(String(day), x + 10, y + 32);

        items.slice(0, 3).forEach((item, idx) => {
          const textY = y + 62 + idx * 42;
          ctx.font = "20px Arial";
          ctx.fillStyle = "#fff";
          ctx.fillText(formatShort(item, SAFE_MAX), x + 10, textY);
          const timeY = textY + 24;
          if (idx < 2 && item.arrivalTime) {
            ctx.font = "16px Arial";
            ctx.fillStyle = "rgba(255,255,255,0.82)";
            ctx.fillText(
              `${item.departureTime || "-"} -> ${item.arrivalTime}`,
              x + 10,
              timeY,
            );
          }
        });

        if (items.length > 3) {
          ctx.fillStyle = "#fff";
          ctx.font = "16px Arial";
          ctx.fillText(`+${items.length - 3} more`, x + 10, y + cellH - 12);
        }
      }
    }
  }

  // Footer
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.fillRect(0, height - 160, width, 160);
  ctx.fillStyle = "#fff";
  ctx.font = "22px Arial";
  ctx.fillText(
    `총 ${schedules.length}개의 비행편이 등록되어 있습니다.`,
    52,
    height - 96,
  );
  ctx.fillText(
    "저장 후 iPhone 설정에서 배경화면으로 적용해 보세요.",
    52,
    height - 56,
  );

  return canvas.toDataURL("image/png", 1.0);
};
