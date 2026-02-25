import React, { useState } from "react";

const DESTINATIONS = [
  "서울",
  "부산",
  "제주",
  "인천",
  "대구",
  "대전",
  "광주",
  "울산",
  "로스앤젤레스",
  "도쿄",
  "홍콩",
  "싱가포르",
  "방콕",
  "런던",
  "뉴욕",
];

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    if (
      !formData.date ||
      !formData.departureTime ||
      !formData.aircraft ||
      !formData.destination
    ) {
      alert("모든 필수 항목을 입력해주세요!");
      return;
    }

    onAddSchedule({
      date: formData.date,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime || "-",
      aircraft: formData.aircraft,
      destination: formData.destination,
    });

    // 폼 초기화
    setFormData({
      date: "",
      departureTime: "",
      arrivalTime: "",
      aircraft: "",
      destination: "",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-md w-full min-h-[400px]">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
        ✈️ 새 비행편 추가
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 h-full"
      >
        <div className="flex flex-col flex-1">
          <label
            htmlFor="date"
            className="font-semibold mb-2 text-gray-700 dark:text-gray-200"
          >
            날짜 *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white transition"
          />
        </div>

        <div className="flex flex-col flex-1">
          <label
            htmlFor="departureTime"
            className="font-semibold mb-2 text-gray-700 dark:text-gray-200"
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
            className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white transition"
          />
        </div>

        <div className="flex flex-col flex-1">
          <label
            htmlFor="arrivalTime"
            className="font-semibold mb-2 text-gray-700 dark:text-gray-200"
          >
            도착 시간
          </label>
          <input
            type="time"
            id="arrivalTime"
            name="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white transition"
          />
        </div>

        <div className="flex flex-col flex-1">
          <label
            htmlFor="aircraft"
            className="font-semibold mb-2 text-gray-700 dark:text-gray-200"
          >
            비행기 편명 *
          </label>
          <input
            type="text"
            id="aircraft"
            name="aircraft"
            value={formData.aircraft}
            onChange={handleChange}
            placeholder="예: HX080"
            required
            className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white transition"
          />
        </div>

        <div className="flex flex-col flex-1">
          <label
            htmlFor="destination"
            className="font-semibold mb-2 text-gray-700 dark:text-gray-200"
          >
            도착지 *
          </label>
          <select
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white transition"
          >
            <option value="">도착지 선택...</option>
            {DESTINATIONS.map((dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="col-span-1 md:col-span-2 lg:col-span-3 px-6 py-2 h-fit bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all self-end"
        >
          비행편 추가
        </button>
      </form>
    </div>
  );
}

export default ScheduleForm;
