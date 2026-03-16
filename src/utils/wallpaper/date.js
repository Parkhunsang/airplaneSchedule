export const parseDateParts = (dateText) => {
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

export const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const getMonthGrid = (referenceDate) => {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = firstDate.getDay();

  return { year, month, daysInMonth, firstDay };
};

export const parseTimeToMinutes = (timeText) => {
  if (!timeText || timeText === "-") return null;

  const [hoursText, minutesText] = String(timeText).split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

export const isOvernightFlight = (schedule) => {
  if (!schedule.arrivalTime || schedule.arrivalTime === "-") {
    return false;
  }

  return schedule.arrivalTime < schedule.departureTime;
};

export const getScheduleDurationMinutes = (schedule) => {
  const departureMinutes = parseTimeToMinutes(schedule.departureTime);
  const arrivalMinutes = parseTimeToMinutes(schedule.arrivalTime);

  if (departureMinutes === null || arrivalMinutes === null) {
    return 0;
  }

  const duration = arrivalMinutes - departureMinutes;
  return duration >= 0 ? duration : duration + 24 * 60;
};

export const formatTotalDuration = (totalMinutes) => {
  const safeMinutes = Math.max(0, totalMinutes);
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};
