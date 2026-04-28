import DESTINATIONS from "./destinations";

export const DEFAULT_AIRLINE_CODE = "default";

const CATHAY_PACIFIC_DESTINATIONS = {
  Australia: {
    flag: "AU",
    cities: [
      "Adelaide (ADL)",
      "Brisbane (BNE)",
      "Cairns (CNS)",
      "Melbourne (MEL)",
      "Perth (PER)",
      "Sydney (SYD)",
    ],
  },
  Bangladesh: {
    flag: "BD",
    cities: ["Dhaka (DAC)"],
  },
  Belgium: {
    flag: "BE",
    cities: ["Brussels (BRU)"],
  },
  Cambodia: {
    flag: "KH",
    cities: ["Phnom Penh (KTI)"],
  },
  Canada: {
    flag: "CA",
    cities: ["Toronto (YYZ)", "Vancouver (YVR)"],
  },
  "Chinese Mainland": {
    flag: "CN",
    cities: [
      "Beijing (PEK)",
      "Chengdu (TFU)",
      "Chongqing (CKG)",
      "Fuzhou (FOC)",
      "Guangzhou (CAN)",
      "Hangzhou (HGH)",
      "Nanjing (NKG)",
      "Qingdao (TAO)",
      "Shanghai (PVG)",
      "Wuhan (WUH)",
      "Xi'an (XIY)",
      "Xiamen (XMN)",
      "Zhengzhou (CGO)",
    ],
  },
  France: {
    flag: "FR",
    cities: ["Paris (CDG)"],
  },
  Germany: {
    flag: "DE",
    cities: ["Frankfurt (FRA)", "Munich (MUC)"],
  },
  "Hong Kong SAR": {
    flag: "HK",
    cities: ["Hong Kong (HKG)"],
  },
  India: {
    flag: "IN",
    cities: [
      "Bengaluru (BLR)",
      "Chennai (MAA)",
      "Delhi (DEL)",
      "Hyderabad (HYD)",
      "Mumbai (BOM)",
    ],
  },
  Indonesia: {
    flag: "ID",
    cities: ["Denpasar (DPS)", "Jakarta (CGK)", "Surabaya (SUB)"],
  },
  Italy: {
    flag: "IT",
    cities: ["Milan (MXP)", "Rome (FCO)"],
  },
  Japan: {
    flag: "JP",
    cities: [
      "Fukuoka (FUK)",
      "Nagoya (NGO)",
      "Osaka (KIX)",
      "Sapporo (CTS)",
      "Tokyo Haneda (HND)",
      "Tokyo Narita (NRT)",
    ],
  },
  Malaysia: {
    flag: "MY",
    cities: ["Kuala Lumpur (KUL)", "Penang (PEN)"],
  },
  Maldives: {
    flag: "MV",
    cities: ["Male (MLE)"],
  },
  Myanmar: {
    flag: "MM",
    cities: ["Yangon (RGN)"],
  },
  Nepal: {
    flag: "NP",
    cities: ["Kathmandu (KTM)"],
  },
  Netherlands: {
    flag: "NL",
    cities: ["Amsterdam (AMS)"],
  },
  "New Zealand": {
    flag: "NZ",
    cities: ["Auckland (AKL)", "Christchurch (CHC)"],
  },
  Philippines: {
    flag: "PH",
    cities: ["Cebu (CEB)", "Manila (MNL)"],
  },
  "Saudi Arabia": {
    flag: "SA",
    cities: ["Riyadh (RUH)"],
  },
  Singapore: {
    flag: "SG",
    cities: ["Singapore (SIN)"],
  },
  "South Africa": {
    flag: "ZA",
    cities: ["Johannesburg (JNB)"],
  },
  "South Korea": {
    flag: "KR",
    cities: ["Seoul (ICN)"],
  },
  Spain: {
    flag: "ES",
    cities: ["Barcelona (BCN)", "Madrid (MAD)"],
  },
  "Sri Lanka": {
    flag: "LK",
    cities: ["Colombo (CMB)"],
  },
  Switzerland: {
    flag: "CH",
    cities: ["Zurich (ZRH)"],
  },
  Taiwan: {
    flag: "TW",
    cities: ["Kaohsiung (KHH)", "Taichung (RMQ)", "Taipei (TPE)"],
  },
  Thailand: {
    flag: "TH",
    cities: ["Bangkok (BKK)", "Phuket (HKT)"],
  },
  "United Arab Emirates": {
    flag: "AE",
    cities: ["Dubai (DXB)"],
  },
  "United Kingdom": {
    flag: "GB",
    cities: ["London Gatwick (LGW)", "London Heathrow (LHR)", "Manchester (MAN)"],
  },
  "United States": {
    flag: "US",
    cities: [
      "Boston (BOS)",
      "Chicago (ORD)",
      "Dallas (DFW)",
      "Los Angeles (LAX)",
      "New York (JFK)",
      "San Francisco (SFO)",
      "Seattle (SEA)",
    ],
  },
  Vietnam: {
    flag: "VN",
    cities: ["Hanoi (HAN)", "Ho Chi Minh City (SGN)"],
  },
};

const AIRLINE_DESTINATIONS = {
  [DEFAULT_AIRLINE_CODE]: {
    names: {
      ko: "기본 노선",
      en: "Default routes",
    },
    destinations: DESTINATIONS,
  },
  cathayPacific: {
    names: {
      ko: "케세이퍼시픽",
      en: "Cathay Pacific",
    },
    destinations: CATHAY_PACIFIC_DESTINATIONS,
  },
};

export const getAirlineDestinationGroups = (airlineCode) =>
  AIRLINE_DESTINATIONS[airlineCode]?.destinations ??
  AIRLINE_DESTINATIONS[DEFAULT_AIRLINE_CODE].destinations;

export default AIRLINE_DESTINATIONS;
