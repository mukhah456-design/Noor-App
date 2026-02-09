
import { Coordinates, CalculationMethod, PrayerTimes, SunnahTimes } from 'adhan';

export const getPrayerTimes = (lat: number, lng: number) => {
  const coords = new Coordinates(lat, lng);
  const date = new Date();
  const params = CalculationMethod.Karachi(); // Defaulting to Karachi method for Pakistan region as requested in Urdu
  const prayerTimes = new PrayerTimes(coords, date, params);
  const sunnahTimes = new SunnahTimes(prayerTimes);

  const format = (d: Date) => d.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });

  // Calculate Hijri Date using native Intl API
  // Using islamic-uma (Umm al-Qura) which is the standard for most modern applications
  const hijriFormatter = new Intl.DateTimeFormat('ur-PK-u-ca-islamic-uma', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const hijri = hijriFormatter.format(date);

  return {
    fajr: format(prayerTimes.fajr),
    sunrise: format(prayerTimes.sunrise),
    dhuhr: format(prayerTimes.dhuhr),
    asr: format(prayerTimes.asr),
    maghrib: format(prayerTimes.maghrib),
    isha: format(prayerTimes.isha),
    date: date.toLocaleDateString('ur-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    hijriDate: hijri,
    raw: prayerTimes // keep raw for countdowns
  };
};

export const getNextPrayer = (prayerTimes: PrayerTimes) => {
  return prayerTimes.nextPrayer();
};

export const getUrduName = (name: string): string => {
  const mapping: Record<string, string> = {
    'fajr': 'فجر',
    'sunrise': 'طلوعِ آفتاب',
    'dhuhr': 'ظہر',
    'asr': 'عصر',
    'maghrib': 'مغرب',
    'isha': 'عشاء',
    'none': 'انتظار'
  };
  return mapping[name.toLowerCase()] || name;
};
