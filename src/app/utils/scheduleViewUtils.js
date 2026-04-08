export const SORT_OPTIONS = {
  DATE_ASC: "date_asc",
  DATE_DESC: "date_desc",
  FLIGHT_DESC: "flight_desc",
  STANDBY_DESC: "standby_desc",
  TRAINING_DESC: "training_desc",
};

export const SCREEN_KEYS = {
  MONTH_LIST: "month_list",
  ENTRY: "entry",
  SETUP: "setup",
  RESULT: "result",
  SAVED_RESULT: "saved_result",
};

export const DEFAULT_WORKFLOW_KEY = "__default__";
export const DEFAULT_BG_COLOR = "#6d28d9";

export const compareByDateAsc = (a, b) => a.date.localeCompare(b.date);
export const compareByDateDesc = (a, b) => b.date.localeCompare(a.date);

export const getMonthKey = (dateText = "") => String(dateText).slice(0, 7);

export const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split("-");
  return `${year}-${Number(month)}월 스케줄`;
};

export const getSortedSchedules = (schedules, sortOption) => {
  const sortedSchedules = [...schedules];

  switch (sortOption) {
    case SORT_OPTIONS.DATE_DESC:
      return sortedSchedules.sort(compareByDateDesc);
    case SORT_OPTIONS.FLIGHT_DESC:
      return sortedSchedules
        .filter((schedule) => schedule.eventType === "flight")
        .sort(compareByDateDesc);
    case SORT_OPTIONS.STANDBY_DESC:
      return sortedSchedules
        .filter((schedule) => schedule.eventType === "standby")
        .sort(compareByDateDesc);
    case SORT_OPTIONS.TRAINING_DESC:
      return sortedSchedules
        .filter((schedule) => schedule.eventType === "training")
        .sort(compareByDateDesc);
    case SORT_OPTIONS.DATE_ASC:
    default:
      return sortedSchedules.sort(compareByDateAsc);
  }
};

export const getMonthOptions = (schedules) =>
  Array.from(
    schedules.reduce((map, schedule) => {
      const monthKey = getMonthKey(schedule.date);

      if (!monthKey) {
        return map;
      }

      if (!map.has(monthKey)) {
        map.set(monthKey, []);
      }

      map.get(monthKey).push(schedule);
      return map;
    }, new Map()),
  )
    .map(([key, monthSchedules]) => ({
      key,
      label: formatMonthLabel(key),
      schedules: [...monthSchedules].sort(compareByDateAsc),
    }))
    .sort((a, b) => b.key.localeCompare(a.key));

export const shouldShowStepper = (screenKey) =>
  screenKey === SCREEN_KEYS.ENTRY ||
  screenKey === SCREEN_KEYS.SETUP ||
  screenKey === SCREEN_KEYS.RESULT;
