const DAY_MS = 24 * 60 * 60 * 1000;

const EVENT_TYPE_LABELS = {
  flight: {
    en: "Flight",
    ko: "비행",
  },
  off: {
    en: "Off",
    ko: "휴무",
  },
  training: {
    en: "Training",
    ko: "훈련",
  },
  standby: {
    en: "Standby",
    ko: "대기",
  },
};

const pad = (value) => String(value).padStart(2, "0");

export const addDaysToDateText = (dateText, amount) => {
  if (!dateText) {
    return "";
  }

  const baseDate = new Date(`${dateText}T00:00:00`);
  baseDate.setDate(baseDate.getDate() + amount);
  return `${baseDate.getFullYear()}-${pad(baseDate.getMonth() + 1)}-${pad(
    baseDate.getDate(),
  )}`;
};

export const getEventTypeLabel = (eventType, language = "en") =>
  EVENT_TYPE_LABELS[eventType]?.[language] ??
  EVENT_TYPE_LABELS[eventType]?.en ??
  eventType;

const getFlightNumber = (schedule) =>
  schedule.aircraft ||
  schedule.flightNumber ||
  schedule.flightNo ||
  schedule.flight ||
  "";

const getDestination = (schedule) =>
  schedule.destination ||
  schedule.arrivalAirport ||
  schedule.destinationName ||
  schedule.city ||
  "";

export const buildScheduleSummary = (schedule, language = "en") => {
  const label = getEventTypeLabel(schedule.eventType, language);

  if (schedule.eventType === "flight") {
    const flightNumber = getFlightNumber(schedule)?.trim();
    const destination = getDestination(schedule)?.trim();

    if (flightNumber && destination) {
      return `${label} ${flightNumber} · ${destination}`;
    }

    if (flightNumber) {
      return `${label} ${flightNumber}`;
    }

    if (destination) {
      return `${label} · ${destination}`;
    }
  }

  return label;
};

export const buildCalendarScheduleChipLabel = (schedule, language = "en") =>
  getEventTypeLabel(schedule.eventType ?? "flight", language);

export const buildScheduleDescription = (schedule, language = "en") => {
  const lines = [];
  const label = getEventTypeLabel(schedule.eventType, language);

  lines.push(`Type: ${label}`);

  if (schedule.departureTime && schedule.departureTime !== "-") {
    lines.push(`Departure: ${schedule.departureTime}`);
  }

  if (schedule.arrivalTime && schedule.arrivalTime !== "-") {
    lines.push(`Arrival: ${schedule.arrivalTime}`);
  }

  if (schedule.aircraft && schedule.eventType === "flight") {
    lines.push(`Flight number: ${schedule.aircraft}`);
  }

  if (schedule.airline && schedule.eventType === "flight") {
    lines.push(`Airline: ${schedule.airline}`);
  }

  if (schedule.destination) {
    lines.push(`Destination: ${schedule.destination}`);
  }

  if (
    schedule.isLayover &&
    schedule.hongKongDepartureDate &&
    schedule.hongKongDepartureTime &&
    schedule.hongKongArrivalTime
  ) {
    lines.push(
      `Layover: ${schedule.hongKongDepartureDate} ${schedule.hongKongDepartureTime} - ${schedule.hongKongArrivalTime}`,
    );
  }

  return lines.join("\n");
};

export const buildGoogleCalendarEventPayload = (
  schedule,
  language = "en",
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  appScheduleId = "",
) => {
  const payload = {
    summary: buildScheduleSummary(schedule, language),
    description: buildScheduleDescription(schedule, language),
    location: schedule.eventType === "flight" ? schedule.destination || "" : "",
    extendedProperties: {
      private: {
        appScheduleId,
        source: "han-bi-schedule",
      },
    },
  };

  const hasTimedRange =
    schedule.departureTime &&
    schedule.departureTime !== "-" &&
    schedule.arrivalTime &&
    schedule.arrivalTime !== "-";

  if (!hasTimedRange) {
    payload.start = {
      date: schedule.date,
    };
    payload.end = {
      date: addDaysToDateText(schedule.date, 1),
    };
    return payload;
  }

  const nextDay =
    String(schedule.arrivalTime) < String(schedule.departureTime) ? 1 : 0;

  payload.start = {
    dateTime: `${schedule.date}T${schedule.departureTime}:00`,
    timeZone,
  };
  payload.end = {
    dateTime: `${addDaysToDateText(schedule.date, nextDay)}T${schedule.arrivalTime}:00`,
    timeZone,
  };

  return payload;
};

export const getMonthBounds = (monthDate) => {
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);

  return {
    start,
    end,
  };
};

export const buildMonthGrid = (monthDate) => {
  const { start, end } = getMonthBounds(monthDate);
  const startOffset = start.getDay();
  const firstCellDate = new Date(start);
  firstCellDate.setDate(start.getDate() - startOffset);
  const today = new Date();
  const todayText = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate(),
  )}`;

  const cells = [];

  for (let index = 0; index < 42; index += 1) {
    const cellDate = new Date(firstCellDate.getTime() + index * DAY_MS);
    const dateText = `${cellDate.getFullYear()}-${pad(cellDate.getMonth() + 1)}-${pad(
      cellDate.getDate(),
    )}`;

    cells.push({
      dateText,
      dayOfMonth: cellDate.getDate(),
      isCurrentMonth: cellDate >= start && cellDate < end,
      isToday: dateText === todayText,
    });
  }

  return cells;
};

const extractGoogleEventDateText = (event) => {
  if (event.start?.date) {
    return event.start.date;
  }

  if (event.start?.dateTime) {
    return String(event.start.dateTime).slice(0, 10);
  }

  return "";
};

export const buildCalendarEntriesByDate = ({
  schedules,
  googleEvents,
  monthDate,
  language = "en",
}) => {
  const monthKey = `${monthDate.getFullYear()}-${pad(monthDate.getMonth() + 1)}`;
  const map = new Map();

  schedules.forEach((schedule) => {
    if (!String(schedule.date).startsWith(monthKey)) {
      return;
    }

    const existingEntries = map.get(schedule.date) ?? [];
    existingEntries.push({
      id: `app-${schedule.id}`,
      source: "app",
      schedule,
      title: buildCalendarScheduleChipLabel(schedule, language),
      colorClass:
        schedule.eventType === "flight"
          ? "bg-sky-100 text-sky-800"
          : schedule.eventType === "training"
            ? "bg-pink-100 text-pink-800"
            : schedule.eventType === "standby"
              ? "bg-amber-100 text-amber-800"
              : "bg-slate-200 text-slate-700",
    });
    map.set(schedule.date, existingEntries);
  });

  googleEvents.forEach((event) => {
    const dateText = extractGoogleEventDateText(event);

    if (!dateText || !dateText.startsWith(monthKey)) {
      return;
    }

    if (event.extendedProperties?.private?.appScheduleId) {
      return;
    }

    const existingEntries = map.get(dateText) ?? [];
    existingEntries.push({
      id: `google-${event.id}`,
      source: "google",
      event,
      title: event.summary || "Google Calendar event",
      colorClass: "bg-emerald-100 text-emerald-800",
    });
    map.set(dateText, existingEntries);
  });

  return map;
};

export const formatCalendarMonthLabel = (monthDate, language = "en") =>
  new Intl.DateTimeFormat(language === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
  }).format(monthDate);
