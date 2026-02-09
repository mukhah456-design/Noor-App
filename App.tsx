
import React, { useState, useEffect, useCallback } from 'react';
import { Sunrise, Sunset, Moon, Sun, CloudSun, Clock, MapPin, Calendar, BookOpen, Quote } from 'lucide-react';
import { getPrayerTimes, getNextPrayer, getUrduName } from './services/prayerService';
import { fetchDailyReflection } from './services/geminiService';
import { Coordinates, PrayerTimesData, SpiritualReflection } from './types';
import PrayerCard from './components/PrayerCard';

const App: React.FC = () => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [nextPrayerName, setNextPrayerName] = useState<string>('None');
  const [reflection, setReflection] = useState<SpiritualReflection | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      // Geolocation
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCoords({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            });
          },
          (err) => {
            console.error("Geo error:", err);
            // Default to Karachi coordinates if permission denied
            setCoords({ latitude: 24.8607, longitude: 67.0011 });
            setError("مقام تک رسائی ممکن نہیں ہو سکی۔ کراچی کے اوقات دکھائے جا رہے ہیں۔");
          }
        );
      } else {
        setCoords({ latitude: 24.8607, longitude: 67.0011 });
      }

      const refl = await fetchDailyReflection();
      setReflection(refl);
    };

    init();
  }, []);

  // Update prayers when coords change
  useEffect(() => {
    if (coords) {
      const data = getPrayerTimes(coords.latitude, coords.longitude);
      setPrayerData(data);
      setNextPrayerName(getNextPrayer(data.raw));
      setLoading(false);
    }
  }, [coords]);

  const prayerIcons: Record<string, React.ReactNode> = {
    fajr: <CloudSun size={32} />,
    sunrise: <Sunrise size={32} />,
    dhuhr: <Sun size={32} />,
    asr: <Sun size={32} className="opacity-80" />,
    maghrib: <Sunset size={32} />,
    isha: <Moon size={32} />
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl nastaliq">نور دعا... براہ کرم انتظار کریں</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-[#0f172a] selection:bg-emerald-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-600 rounded-full blur-[120px]"></div>
      </div>

      <header className="relative z-10 px-4 pt-8 pb-4 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-right">
          <h1 className="text-5xl font-bold text-emerald-400 mb-2 drop-shadow-lg nastaliq">نور</h1>
          <p className="text-gray-400 flex items-center gap-2 justify-center md:justify-start">
            <MapPin size={16} className="text-emerald-500" />
            پاکستان اور گردونواح کے مستند اوقات
          </p>
        </div>

        <div className="glass px-6 py-4 rounded-3xl flex items-center gap-6 shadow-2xl">
          <div className="text-right border-l border-white/10 pl-6">
            <div className="text-3xl font-mono text-white">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
            <div className="text-sm text-emerald-400 mt-1 flex items-center justify-end gap-1">
              {prayerData && (
                <>
                  اگلی نماز: {getUrduName(nextPrayerName)}
                  <Clock size={14} />
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">{prayerData?.date}</div>
            <div className="text-emerald-400 text-sm">{prayerData?.hijriDate} ھ</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 mt-8">
        {error && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 p-3 rounded-xl mb-6 text-center text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {prayerData && Object.entries(prayerData).map(([key, value]) => {
            if (['date', 'hijriDate', 'raw'].includes(key)) return null;
            return (
              <PrayerCard
                key={key}
                name={key}
                time={value as string}
                isActive={nextPrayerName.toLowerCase() === key.toLowerCase() || (key === 'fajr' && nextPrayerName === 'None')}
                icon={prayerIcons[key]}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
             <div className="glass rounded-3xl p-8 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/50"></div>
               <div className="flex items-start gap-6">
                 <div className="bg-emerald-500/20 p-4 rounded-2xl text-emerald-400">
                    <BookOpen size={40} />
                 </div>
                 <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 nastaliq">
                      آج کی حدیث
                      <div className="h-px bg-white/10 flex-1"></div>
                    </h2>
                    {reflection ? (
                      <div className="space-y-6">
                        <p className="text-2xl nastaliq leading-relaxed text-gray-100 italic">
                          " {reflection.hadith} "
                        </p>
                        <div className="flex justify-between items-end">
                          <p className="text-emerald-400 font-medium">
                            {reflection.reference}
                          </p>
                          <div className="bg-white/5 px-4 py-2 rounded-xl text-sm text-gray-300 border border-white/10">
                            {reflection.reflection}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                        <div className="h-4 bg-white/10 rounded w-1/2"></div>
                      </div>
                    )}
                 </div>
               </div>
             </div>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-3xl p-6 border-r-4 border-emerald-500">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Calendar size={18} className="text-emerald-500" />
                اسلامی تقویم
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                آج کی تاریخ {prayerData?.hijriDate} ہے، جو ایک بابرکت دن کی نوید ہے۔
              </p>
            </div>
            
            <div className="glass rounded-3xl p-6 bg-emerald-500/5">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Quote size={18} className="text-emerald-500" />
                روزانہ کی دعا
              </h3>
              <p className="nastaliq text-lg text-gray-200">
                رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ
              </p>
              <p className="text-xs text-gray-500 mt-2">
                اے میرے رب، مجھے اور میری اولاد کو نماز قائم کرنے والا بنا۔
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-center text-gray-500 text-sm relative z-10 px-4">
        <p dir="ltr">© {new Date().getFullYear()} Noor Prayer App. Calculated using Karachi Method.</p>
        <p className="mt-2 nastaliq">اللہ پاک ہماری تمام عبادات قبول فرمائے۔ آمین</p>
      </footer>
    </div>
  );
};

export default App;
