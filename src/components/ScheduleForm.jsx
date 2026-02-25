import React, { useState } from "react";

const DESTINATIONS = {
  "🇯🇵 일본": [
    "Fukuoka (FUK)",
    "Okinawa (OKA)",
    "Osaka (KIX)",
    "Sapporo (CTS)",
    "Tokyo (NRT)",
  ],
  "🇨🇳 중국": [
    "Beijing Daxing Int'l (PKX)",
    "Beijing Capital Int'l (PEK)",
    "Beijing (PEK/PKX)",
    "Chengdu Tianfu (TFU)",
    "Chongqing (CKG)",
    "Dongguan Humen HK Macau Ferry Terminal (ZTI)",
    "Guangzhou Pazhou Ferry Terminal (PFT)",
    "Haikou (HAK)",
    "Hangzhou (HGH)",
    "HZMB ZhuHai Port (HZI)",
    "Nanjing (NKG)",
    "Sanya (SYX)",
    "Shanghai Pudong (PVG)",
    "Shanghai Hongqiao (SHA)",
    "Shanghai (SHA/PVG)",
    "Shenzhen Airport Ferry Terminal (FYG)",
    "Shenzhen Shekou Cruise Homeport (ZYK)",
    "Xi'an (XIY)",
    "Xining (XNN)",
    "Zhongshan Ferry Terminal (ZGN)",
    "Guangzhou Nansha Ferry Port (NSZ)",
    "Hulunbuir (HLD)",
    "Lijiang (LJG)",
    "Changchun (CGQ)",
  ],
  "🇭🇰 홍콩": ["Hong Kong (HKG)"],
  "🇹🇼 대만": ["Taipei (TPE)", "Kaohsiung (KHH)"],
  "🇱🇦 라오스": ["Vientiane (VTE)", "Luang Prabang (LPQ)"],
  "🇻🇳 베트남": ["Da Nang (DAD)", "Hanoi (HAN)"],
  "🇦🇺 호주": [
    "Sydney (SYD)",
    "Melbourne (MEL)",
    "Canberra (CBR)",
    "Brisbane (BNE)",
    "Gold Coast (OOL)",
    "Sunshine Coast (MCY)",
    "Adelaide (ADL)",
    "Hobart (HBA)",
    "Launceston (LST)",
    "Cairns (CNS)",
    "Hamilton Island (HTI)",
    "Darwin (DRW)",
    "Ayers Rock (AYQ)",
    "Newcastle (NTL)",
    "Perth (PER)",
  ],
  "🇲🇵 북마리아나제도": ["Saipan (SPN)"],
  "🇨🇦 캐나다": [
    "Vancouver (YVR)",
    "Montreal (YUL)",
    "Regina (YQR)",
    "Saskatoon (YXE)",
    "Edmonton (YEG)",
    "Ottawa (YOW)",
    "Winnipeg (YWG)",
    "Victoria (YYJ)",
    "Kelowna (YLW)",
    "Toronto (YYZ)",
    "Calgary (YYC)",
  ],
  "🇰🇭 캄보디아": ["Siem Reap (SAI)", "Phnom Penh (KTI)"],
  "🇺🇸 미국": ["Los Angeles (LAX)"],
  "🇹🇭 태국": [
    "Bangkok (BKK)",
    "Chiang Mai (CNX)",
    "Koh Samui (USM)",
    "Krabi (KBV)",
    "Phuket (HKT)",
  ],
  "🇮🇩 인도네시아": ["Bali (DPS)", "Jakarta (CGK)"],
  "🇲🇻 몰디브": ["Male (MLE)"],
  "🇰🇷 한국": ["Seoul (ICN)"],
  "🇹🇷 튀르키예": ["Istanbul (IST)"],
};

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

    setFormData({
      date: "",
      departureTime: "",
      arrivalTime: "",
      aircraft: "",
      destination: "",
    });
  };

  return (
    <div className="rounded-none p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 w-full min-h-[400px] bg-white shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
        새 비행편 추가
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
            className="flex-1 px-4 py-3 text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white transition min-h-[44px]"
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
            className="flex-1 px-4 py-3 text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white transition min-h-[44px]"
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
            className="flex-1 px-4 py-3 text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white transition min-h-[44px]"
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
            className="flex-1 px-4 py-3 text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white transition min-h-[44px]"
          />
        </div>

        <div className="flex flex-col flex-1 lg:col-span-2">
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
            className="flex-1 px-4 py-3 text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white transition min-h-[44px] font-medium"
          >
            <option value="">도착지 선택...</option>
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
          className="col-span-1 sm:col-span-2 lg:col-span-1 px-6 py-3 text-base font-semibold min-h-[48px] bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all self-end"
        >
          비행편 추가
        </button>
      </form>
    </div>
  );
}

export default ScheduleForm;
