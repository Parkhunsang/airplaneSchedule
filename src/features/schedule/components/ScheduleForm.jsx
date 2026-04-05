import React, { useState } from "react";

import DESTINATIONS from "../constants/destinations";
import { EVENT_TYPE_OPTIONS } from "../../wallpaper/constants/eventTypes";

function ScheduleForm({ onAddSchedule }) {
  const [formData, setFormData] = useState({
    date: "",
    eventType: "flight",
    isLayover: false,
    departureTime: "",
    arrivalTime: "",
    hongKongDepartureTime: "",
    hongKongArrivalTime: "",
    aircraft: "",
    destination: "",
  });

  const requiresTimeRange =
    formData.eventType === "flight" ||
    formData.eventType === "standby" ||
    formData.eventType === "training";
  const isFlightEvent = formData.eventType === "flight";

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const nextValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
      ...(name === "isLayover" && !checked
        ? {
            hongKongDepartureTime: "",
            hongKongArrivalTime: "",
          }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingLayoverTimes =
      formData.isLayover &&
      (!formData.hongKongDepartureTime || !formData.hongKongArrivalTime);

    if (
      !formData.date ||
      !formData.eventType ||
      (requiresTimeRange &&
        (!formData.departureTime || !formData.arrivalTime)) ||
      missingLayoverTimes ||
      (isFlightEvent && (!formData.aircraft || !formData.destination))
    ) {
      alert("모든 필수 항목을 입력해주세요!");
      return;
    }

    try {
      await onAddSchedule({
        date: formData.date,
        eventType: formData.eventType,
        isLayover: formData.isLayover,
        departureTime: requiresTimeRange ? formData.departureTime : "-",
        arrivalTime: requiresTimeRange ? formData.arrivalTime : "-",
        hongKongDepartureTime: formData.isLayover
          ? formData.hongKongDepartureTime
          : "-",
        hongKongArrivalTime: formData.isLayover
          ? formData.hongKongArrivalTime
          : "-",
        aircraft: isFlightEvent ? formData.aircraft : formData.eventType,
        destination: isFlightEvent ? formData.destination : formData.eventType,
      });
    } catch (error) {
      return;
    }

    setFormData({
      date: "",
      eventType: "flight",
      isLayover: false,
      departureTime: "",
      arrivalTime: "",
      hongKongDepartureTime: "",
      hongKongArrivalTime: "",
      aircraft: "",
      destination: "",
    });
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="min-h-[400px]">
        <p className="text-xl font-bold text-gray-900 sm:text-2xl">
          비행 일정 추가
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-4 grid h-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
        >
          <div className="flex flex-1 flex-col">
            <label htmlFor="date" className="mb-2 font-semibold text-gray-700">
              날짜 *
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
              근무 종류 *
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base font-medium transition focus:border-[#1565C0] focus:outline-none"
            >
              {EVENT_TYPE_OPTIONS.map((option) => (
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
              레이오버
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
              <span>레이오버 포함</span>
            </label>
          </div>

          <div className="flex flex-1 flex-col">
            <label
              htmlFor="departureTime"
              className="mb-2 font-semibold text-gray-700"
            >
              출발 시간 {requiresTimeRange ? "*" : ""}
            </label>
            <input
              type="time"
              id="departureTime"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              required={requiresTimeRange}
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-[#1565C0] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <label
              htmlFor="arrivalTime"
              className="mb-2 font-semibold text-gray-700"
            >
              도착 시간 {requiresTimeRange ? "*" : ""}
            </label>
            <input
              type="time"
              id="arrivalTime"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              required={requiresTimeRange}
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-[#1565C0] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <label
              htmlFor="hongKongDepartureTime"
              className="mb-2 font-semibold text-gray-700"
            >
              홍콩 출발 시간 {formData.isLayover ? "*" : ""}
            </label>
            <input
              type="time"
              id="hongKongDepartureTime"
              name="hongKongDepartureTime"
              value={formData.hongKongDepartureTime}
              onChange={handleChange}
              required={formData.isLayover}
              disabled={!formData.isLayover}
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-[#1565C0] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <label
              htmlFor="hongKongArrivalTime"
              className="mb-2 font-semibold text-gray-700"
            >
              홍콩 도착 시간 {formData.isLayover ? "*" : ""}
            </label>
            <input
              type="time"
              id="hongKongArrivalTime"
              name="hongKongArrivalTime"
              value={formData.hongKongArrivalTime}
              onChange={handleChange}
              required={formData.isLayover}
              disabled={!formData.isLayover}
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-[#1565C0] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <label
              htmlFor="aircraft"
              className="mb-2 font-semibold text-gray-700"
            >
              비행기 편명 {isFlightEvent ? "*" : ""}
            </label>
            <input
              type="text"
              id="aircraft"
              name="aircraft"
              value={formData.aircraft}
              onChange={handleChange}
              placeholder="예: HX080"
              required={isFlightEvent}
              disabled={formData.eventType !== "flight"}
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-[#1565C0] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          <div className="flex flex-1 flex-col lg:col-span-2">
            <label
              htmlFor="destination"
              className="mb-2 font-semibold text-gray-700"
            >
              목적지 {isFlightEvent ? "*" : ""}
            </label>
            <select
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required={isFlightEvent}
              disabled={formData.eventType !== "flight"}
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base font-medium transition focus:border-[#1565C0] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">목적지를 선택하세요..</option>
              {Object.entries(DESTINATIONS).map(
                ([country, destinationGroup]) => (
                  <optgroup
                    key={country}
                    label={`${destinationGroup.flag} ${country}`}
                  >
                    {destinationGroup.cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </optgroup>
                ),
              )}
            </select>
          </div>

          <button
            type="submit"
            className="col-span-1 inline-flex min-h-[48px] items-center justify-center gap-2 self-end rounded-2xl bg-[#1E6DEB] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#1E6DEB] active:bg-[#1565C0] sm:col-span-2 lg:col-span-1"
          >
            <span className="text-lg leading-none">+</span>
            <span>일정 추가</span>
          </button>
        </form>
      </div>
    </section>
  );
}

export default ScheduleForm;
