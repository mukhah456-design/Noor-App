
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  hijriDate: string;
}

export interface SpiritualReflection {
  hadith: string;
  reference: string;
  reflection: string;
}

export enum PrayerName {
  FAJR = 'Fajr',
  SUNRISE = 'Sunrise',
  DHUHR = 'Dhuhr',
  ASR = 'Asr',
  MAGHRIB = 'Maghrib',
  ISHA = 'Isha'
}
