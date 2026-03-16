import React, { useState } from "react";

import DESTINATIONS from "../constants/destinations";

function ScheduleForm({ onAddSchedule }) {
  const [formData, setFormData] = useState({
    date: "",
    departureTime: "",
    arrivalTime: "",
    aircraft: "",
    destination: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.departureTime ||
      !formData.aircraft ||
      !formData.destination
    ) {
      alert("모든 필수 항목을 입력해주세요!");
      return;
    }

    try {
      await onAddSchedule({
        date: formData.date,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime || "-",
        aircraft: formData.aircraft,
        destination: formData.destination,
      });
    } catch (error) {
      return;
    }

    setFormData({
      date: "",
      departureTime: "",
      arrivalTime: "",
      aircraft: "",
      destination: "",
    });
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="min-h-[400px]">
        <p className="text-xl font-bold text-gray-900 sm:text-2xl">
          새 비행편 추가
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
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <label
              htmlFor="departureTime"
              className="mb-2 font-semibold text-gray-700"
            >
              출발 시간 *
            </label>
            <input
              type="time"
              id="departureTime"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              required
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <label
              htmlFor="arrivalTime"
              className="mb-2 font-semibold text-gray-700"
            >
              도착 시간
            </label>
            <input
              type="time"
              id="arrivalTime"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <label
              htmlFor="aircraft"
              className="mb-2 font-semibold text-gray-700"
            >
              비행기 편명 *
            </label>
            <input
              type="text"
              id="aircraft"
              name="aircraft"
              value={formData.aircraft}
              onChange={handleChange}
              placeholder="예:HX080"
              required
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-1 flex-col lg:col-span-2">
            <label
              htmlFor="destination"
              className="mb-2 font-semibold text-gray-700"
            >
              도착지 *
            </label>
            <select
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              className="min-h-[44px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-base font-medium transition focus:border-purple-500 focus:outline-none"
            >
              <option value="">도착지를 선택하세요...</option>
              {Object.entries(DESTINATIONS).map(([country, cities]) => (
                <optgroup key={country} label={country}>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="col-span-1 inline-flex min-h-[48px] items-center justify-center gap-2 self-end rounded-2xl bg-[#1E6DEB] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#1E6DEB] active:bg-[#1565C0] sm:col-span-2 lg:col-span-1"
          >
            <span className="text-lg leading-none">+</span>
            <span>비행편 추가</span>
          </button>
        </form>
      </div>
    </section>
  );
}

export default ScheduleForm;
