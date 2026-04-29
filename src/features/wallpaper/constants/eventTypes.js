import i18n from "../../../app/i18n";

export const EVENT_TYPES = [
  { value: "flight", label: "Flight" },
  { value: "training", label: "Training" },
  { value: "standby", label: "Stand by" },
];
export const BLOCK_COLOR_VALUES = ["flight", "off", "training", "standby"];

export const getEventTypeLabel = (eventType, t = i18n.t.bind(i18n)) =>
  t(`eventTypes.${eventType}`);

export const getFixedEventTypeLabel = (eventType) =>
  EVENT_TYPES.find(({ value }) => value === eventType)?.label ??
  (eventType === "off" ? "Off" : eventType);

export const getEventTypeOptions = (t = i18n.t.bind(i18n)) =>
  EVENT_TYPES.map(({ value }) => ({
    value,
    label: getEventTypeLabel(value, t),
  }));

export const getBlockColorOptions = (t = i18n.t.bind(i18n)) =>
  BLOCK_COLOR_VALUES.map((value) => ({
    value,
    label: getEventTypeLabel(value, t),
  }));

export const EVENT_TYPE_LABELS = Object.fromEntries(
  BLOCK_COLOR_VALUES.map((value) => [value, getEventTypeLabel(value)]),
);

export const DEFAULT_EVENT_TYPE_COLORS = {
  flight: "#87C4EE",
  off: "#D8C7F1",
  training: "#F7C6D9",
  standby: "#F9D66B",
};
