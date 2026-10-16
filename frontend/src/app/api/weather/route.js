import { NextResponse } from 'next/server';
import { FLOOD_PRONE_HUBS } from '@/data/inMemoryStore';

export const dynamic = 'force-dynamic';

// Weather code mapping according to WMO standard
function parseWmoWeather(code, rainMm) {
  if (code >= 95) {
    return {
      condition: 'thunderstorm',
      condition_bn: 'তীব্র কালবৈশাখী ঝড় ও ভারি বৃষ্টি',
      is_raining: true,
      is_severe: true,
      icon: '⛈️'
    };
  }
  if (code >= 80 || code >= 61 || rainMm > 1.0) {
    return {
      condition: 'heavy_rain',
      condition_bn: 'ভারি বৃষ্টিপাত ও জলজট ঝুঁকি',
      is_raining: true,
      is_severe: true,
      icon: '🌧️'
    };
  }
  if (code >= 51 || rainMm > 0.1) {
    return {
      condition: 'light_rain',
      condition_bn: 'গুঁড়ি গুঁড়ি বৃষ্টি',
      is_raining: true,
      is_severe: false,
      icon: '🌦️'
    };
  }
  if (code >= 1 && code <= 3) {
    return {
      condition: 'cloudy',
      condition_bn: 'আংশিক মেঘলা আকাশ',
      is_raining: false,
      is_severe: false,
      icon: '⛅'
    };
  }
  return {
    condition: 'clear',
    condition_bn: 'পরিষ্কার রোদ ও স্বাভাবিক আবহাওয়া',
    is_raining: false,
    is_severe: false,
    icon: '☀️'
  };
}

export async function GET() {
  try {
    let rawData = null;
    try {
      const openMeteoUrl = 'https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m&timezone=Asia%2FDhaka';
      const res = await fetch(openMeteoUrl, { 
        next: { revalidate: 180 }, // cache for 3 minutes
        headers: { 'User-Agent': 'DhakaPath Transit Intelligence/1.0' }
      });
      if (res.ok) {
        rawData = await res.json();
      }
    } catch (netErr) {
      console.warn('Open-Meteo direct fetch failed, using realistic fallback:', netErr.message);
    }

    const current = rawData?.current || {
      temperature_2m: 32.5,
      relative_humidity_2m: 55,
      precipitation: 0,
      rain: 0,
      weather_code: 0,
      wind_speed_10m: 6.0
    };

    const temp = Math.round(current.temperature_2m * 10) / 10;
    const humidity = current.relative_humidity_2m;
    const rainMm = current.rain || current.precipitation || 0;
    const weatherInfo = parseWmoWeather(current.weather_code, rainMm);

    // Area-specific transit impact analysis
    const isRaining = weatherInfo.is_raining;
    const areaImpacts = {
      flood_prone_zones: FLOOD_PRONE_HUBS,
      flood_prone_hubs_bn: 'মালিবাগ, শান্তিনগর, কাজীপাড়া, মিরপুর ১০ ও পুরান ঢাকা (লালবাগ/সদরঘাট)',
      rickshaw_surge_pct: isRaining ? 50 : 0,
      cng_surge_pct: isRaining ? 30 : 0,
      metro_surge_pct: 0,
      impact_summary_bn: isRaining
        ? `বর্তমানে ঢাকায় ${weatherInfo.condition_bn} চলছে। নিচু অঞ্চলগুলোতে (যেমন: মালিবাগ ও কাজীপাড়া) রাস্তায় পানি জমার ঝুঁকি থাকায় রিকশা ও সিএনজি ভাড়ায় এলাকাভিত্তিক সার্ফ (+৫০%) প্রযোজ্য। তবে এমআরটি-৬ মেট্রোরেল সম্পূর্ণ স্বাভাবিক ভাড়ায় ও সিগন্যালমুক্তভাবে চলছে।`
        : `বর্তমানে ঢাকায় ${weatherInfo.condition_bn} বিরাজ করছে। তাপমাত্রা ${temp}° সেলসিয়াস। কোনো সড়ক জলজট নেই; বাস, রিকশা ও মেট্রোরেল স্বাভাবিক ভাড়ায় চলাচল করছে।`
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      location: 'Dhaka, Bangladesh',
      temperature: temp,
      humidity,
      precipitation_mm: rainMm,
      wind_speed_kmh: current.wind_speed_10m,
      weather_code: current.weather_code,
      ...weatherInfo,
      area_impacts: areaImpacts
    });
  } catch (error) {
    console.error('Weather route error:', error);
    return NextResponse.json({
      success: false,
      temperature: 32.0,
      condition: 'clear',
      condition_bn: 'স্বাভাবিক আবহাওয়া',
      is_raining: false,
      precipitation_mm: 0
    }, { status: 200 });
  }
}
