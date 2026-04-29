import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EVENT_TYPES } from "../../wallpaper/constants/eventTypes";
import AIRLINE_DESTINATIONS, {
  DEFAULT_AIRLINE_CODE,
  getAirlineDestinationGroups,
} from "../constants/airlineDestinations";

const buildDestinationOptions = (destinationGroups) =>
  Object.entries(destinationGroups).flatMap(([country, destinationGroup]) =>
    destinationGroup.cities.map((city) => ({
      city,
      country,
      flag: destinationGroup.flag,
      searchText: `${country} ${city}`.toLowerCase(),
    })),
  );

const getDestinationOptionsForAirline = (airlineCode) =>
  buildDestinationOptions(getAirlineDestinationGroups(airlineCode));

const createInitialFormData = (schedule = null) => ({
  date: schedule?.date ?? "",
  eventType: schedule?.eventType ?? "flight",
  isLayover: schedule?.isLayover ?? false,
  departureTime:
    schedule?.departureTime && schedule.departureTime !== "-"
      ? schedule.departureTime
      : "",
  arrivalTime:
    schedule?.arrivalTime && schedule.arrivalTime !== "-"
      ? schedule.arrivalTime
      : "",
  hongKongDepartureDate: schedule?.hongKongDepartureDate ?? "",
  hongKongDepartureTime:
    schedule?.hongKongDepartureTime && schedule.hongKongDepartureTime !== "-"
      ? schedule.hongKongDepartureTime
      : "",
  hongKongArrivalTime:
    schedule?.hongKongArrivalTime && schedule.hongKongArrivalTime !== "-"
      ? schedule.hongKongArrivalTime
      : "",
  airline:
    schedule?.eventType === "flight"
      ? schedule?.airline ?? DEFAULT_AIRLINE_CODE
      : DEFAULT_AIRLINE_CODE,
  aircraft:
    schedule?.eventType === "flight" ? schedule?.aircraft ?? "" : "",
  destination:
    schedule?.eventType === "flight" ? schedule?.destination ?? "" : "",
});

function ScheduleForm({
  onAddSchedule,
  onUpdateSchedule,
  editingSchedule,
  onCancelEdit,
}) {
  const { t, i18n } = useTranslation();
  const eventTypeOptions = EVENT_TYPES;
  const airlineOptions = Object.entries(AIRLINE_DESTINATIONS).map(
    ([value, airline]) => ({
      value,
      label: airline.names[i18n.language] ?? airline.names.ko,
    }),
  );
  const [formData, setFormData] = useState(createInitialFormData());
  const [destinationSearch, setDestinationSearch] = useState("");
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const isEditing = Boolean(editingSchedule?.id);

  const requiresTimeRange =
    formData.eventType === "flight" ||
    formData.eventType === "standby" ||
    formData.eventType === "training";
  const isFlightEvent = formData.eventType === "flight";
  const availableDestinations = getDestinationOptionsForAirline(formData.airline);
  const availableDestinationCities = new Set(
    availableDestinations.map((option) => option.city),
  );
  const filteredDestinations = availableDestinations
    .filter((option) =>
      option.searchText.includes(destinationSearch.trim().toLowerCase()),
    )
    .slice(0, 12);

  useEffect(() => {
    setFormData(createInitialFormData(editingSchedule));
    setDestinationSearch(
      editingSchedule?.eventType === "flight"
        ? editingSchedule.destination ?? ""
        : "",
    );
    setIsDestinationOpen(false);
  }, [editingSchedule]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const nextValue = type === "checkbox" ? checked : value;
    const nextDestinationOptions =
      name === "airline"
        ? getDestinationOptionsForAirline(nextValue)
        : availableDestinations;
    const nextDestinationCities = new Set(
      nextDestinationOptions.map((option) => option.city),
    );
    const shouldResetDestination =
      name === "airline" && !nextDestinationCities.has(formData.destination);

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
      ...(name === "isLayover" && !checked
        ? {
            hongKongDepartureDate: "",
            hongKongDepartureTime: "",
            hongKongArrivalTime: "",
          }
        : {}),
      ...(name === "eventType" && value !== "flight"
        ? {
            airline: DEFAULT_AIRLINE_CODE,
            destination: "",
          }
        : {}),
      ...(shouldResetDestination
        ? {
            destination: "",
          }
        : {}),
    }));

    if (name === "eventType" && value !== "flight") {
      setDestinationSearch("");
      setIsDestinationOpen(false);
    }

    if (shouldResetDestination) {
      setDestinationSearch("");
      setIsDestinationOpen(false);
    }
  };

  const handleDestinationInputChange = (e) => {
    const { value } = e.target;

    setDestinationSearch(value);
    setFormData((prev) => ({
      ...prev,
      destination: value,
    }));
    setIsDestinationOpen(true);
  };

  const handleSelectDestination = (city) => {
    setDestinationSearch(city);
    setFormData((prev) => ({
      ...prev,
      destination: city,
    }));
    setIsDestinationOpen(false);
  };

  const resetEditingState = () => {
    setFormData(createInitialFormData());
    setDestinationSearch("");
    setIsDestinationOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingLayoverTimes =
      formData.isLayover &&
      (!formData.hongKongDepartureDate ||
        !formData.hongKongDepartureTime ||
        !formData.hongKongArrivalTime);

    if (
      !formData.date ||
      !formData.eventType ||
      (requiresTimeRange &&
        (!formData.departureTime || !formData.arrivalTime)) ||
      missingLayoverTimes ||
      (isFlightEvent && (!formData.aircraft || !formData.destination))
    ) {
      alert(t("schedule.requiredAlert"));
      return;
    }

    if (
      isFlightEvent &&
      !availableDestinationCities.has(formData.destination.trim())
    ) {
      alert(t("schedule.invalidDestinationAlert"));
      return;
    }

    try {
      const payload = {
        date: formData.date,
        eventType: formData.eventType,
        isLayover: formData.isLayover,
        departureTime: requiresTimeRange ? formData.departureTime : "-",
        arrivalTime: requiresTimeRange ? formData.arrivalTime : "-",
        hongKongDepartureDate: formData.isLayover
          ? formData.hongKongDepartureDate
          : "",
        hongKongDepartureTime: formData.isLayover
          ? formData.hongKongDepartureTime
          : "-",
        hongKongArrivalTime: formData.isLayover
          ? formData.hongKongArrivalTime
          : "-",
        airline: isFlightEvent ? formData.airline : "",
        aircraft: isFlightEvent ? formData.aircraft : formData.eventType,
        destination: isFlightEvent
          ? formData.destination.trim()
          : formData.eventType,
      };

      if (isEditing) {
        await onUpdateSchedule({
          ...editingSchedule,
          ...payload,
        });
      } else {
        await onAddSchedule(payload);
      }
    } catch (error) {
      return;
    }

    resetEditingState();

    if (isEditing) {
      onCancelEdit?.();
    }
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="min-h-[400px]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {isEditing ? (
            <button
              type="button"
              onClick={() => {
                resetEditingState();
                onCancelEdit?.();
              }}
              className="inline-flex w-fit items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
            >
              수정 취소
            </button>
          ) : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 grid h-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
        >
          <div className="flex flex-1 flex-col">
            <label htmlFor="date" className="mb-2 font-semibold text-gray-700">
              {t("schedule.date")} *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-[#1565C0] focus:outline-none"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <label
              htmlFor="eventType"
              className="mb-2 font-semibold text-gray-700"
            >
              {t("schedule.eventType")} *
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base font-medium transition focus:border-[#1565C0] focus:outline-none"
            >
              {eventTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex min-h-[44px] flex-1 flex-col justify-end">
            <label
              htmlFor="isLayover"
              className="mb-2 font-semibold text-gray-700"
            >
              {t("schedule.layover")}
            </label>
            <label className="flex min-h-[44px] items-center gap-3 rounded-lg border-2 border-gray-300 px-4 py-3 text-base text-gray-900">
              <input
                type="checkbox"
                id="isLayover"
                name="isLayover"
                checked={formData.isLayover}
                onChange={handleChange}
                className="h-4 w-4 accent-[#1565C0]"
              />
              <span>{t("schedule.includeLayover")}</span>
            </label>
          </div>

          <div className="flex flex-1 flex-col">
            <label
              htmlFor="departureTime"
              className="mb-2 font-semibold text-gray-700"
            >
              {t("schedule.departureTime")} {requiresTimeRange ? "*" : ""}
            </label>
            <input
              type="time"
              id="departureTime"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              required={requiresTimeRange}
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-[#1565C0] focus:outline-none"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <label
              htmlFor="arrivalTime"
              className="mb-2 font-semibold text-gray-700"
            >
              {t("schedule.arrivalTime")} {requiresTimeRange ? "*" : ""}
            </label>
            <input
              type="time"
              id="arrivalTime"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              required={requiresTimeRange}
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-[#1565C0] focus:outline-none"
            />
          </div>

          {formData.isLayover ? (
            <>
              <div className="flex flex-1 flex-col">
                <label
                  htmlFor="hongKongDepartureDate"
                  className="mb-2 font-semibold text-gray-700"
                >
                  {t("schedule.hongKongDepartureDate")} *
                </label>
                <input
                  type="date"
                  id="hongKongDepartureDate"
                  name="hongKongDepartureDate"
                  value={formData.hongKongDepartureDate}
                  onChange={handleChange}
                  required
                  className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-[#1565C0] focus:outline-none"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <label
                  htmlFor="hongKongDepartureTime"
                  className="mb-2 font-semibold text-gray-700"
                >
                  {t("schedule.hongKongDepartureTime")} *
                </label>
                <input
                  type="time"
                  id="hongKongDepartureTime"
                  name="hongKongDepartureTime"
                  value={formData.hongKongDepartureTime}
                  onChange={handleChange}
                  required
                  className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-[#1565C0] focus:outline-none"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <label
                  htmlFor="hongKongArrivalTime"
                  className="mb-2 font-semibold text-gray-700"
                >
                  {t("schedule.hongKongArrivalTime")} *
                </label>
                <input
                  type="time"
                  id="hongKongArrivalTime"
                  name="hongKongArrivalTime"
                  value={formData.hongKongArrivalTime}
                  onChange={handleChange}
                  required
                  className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-[#1565C0] focus:outline-none"
                />
              </div>
            </>
          ) : null}

          <div className="flex flex-1 flex-col">
            <label
              htmlFor="airline"
              className="mb-2 font-semibold text-gray-700"
            >
              {t("schedule.airline")} {isFlightEvent ? "*" : ""}
            </label>
            <select
              id="airline"
              name="airline"
              value={formData.airline}
              onChange={handleChange}
              disabled={!isFlightEvent}
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base font-medium transition focus:border-[#1565C0] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            >
              {airlineOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-1 flex-col">
            <label
              htmlFor="aircraft"
              className="mb-2 font-semibold text-gray-700"
            >
              {t("schedule.aircraft")} {isFlightEvent ? "*" : ""}
            </label>
            <input
              type="text"
              id="aircraft"
              name="aircraft"
              value={formData.aircraft}
              onChange={handleChange}
              placeholder={t("schedule.aircraftPlaceholder")}
              required={isFlightEvent}
              disabled={!isFlightEvent}
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-[#1565C0] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          <div className="relative flex flex-1 flex-col lg:col-span-2">
            <label
              htmlFor="destination"
              className="mb-2 font-semibold text-gray-700"
            >
              {t("schedule.destination")} {isFlightEvent ? "*" : ""}
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={destinationSearch}
              onChange={handleDestinationInputChange}
              onFocus={() => setIsDestinationOpen(true)}
              onBlur={() => {
                window.setTimeout(() => {
                  setIsDestinationOpen(false);
                }, 120);
              }}
              placeholder={t("schedule.destinationPlaceholder")}
              required={isFlightEvent}
              disabled={!isFlightEvent}
              autoComplete="off"
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base font-medium transition focus:border-[#1565C0] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />

            {isFlightEvent && isDestinationOpen ? (
              <div className="absolute top-full z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((option) => (
                    <button
                      key={option.city}
                      type="button"
                      onMouseDown={() => handleSelectDestination(option.city)}
                      className="flex w-full items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 text-left text-sm text-gray-900 transition hover:bg-gray-50 last:border-b-0"
                    >
                      <span>{option.city}</span>
                      <span className="text-xs text-gray-500">
                        {option.flag} {option.country}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    {t("schedule.noDestinationResults")}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            className="col-span-1 inline-flex min-h-[48px] items-center justify-center gap-2 self-end rounded-2xl bg-[#1E6DEB] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#1E6DEB] active:bg-[#1565C0] sm:col-span-2 lg:col-span-1"
          >
            <span className="text-lg leading-none">{isEditing ? "✓" : "+"}</span>
            <span>{isEditing ? "수정 완료" : t("schedule.addSchedule")}</span>
          </button>
        </form>
      </div>
    </section>
  );
}

export default ScheduleForm;
