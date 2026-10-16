import { NextResponse } from 'next/server';
import { getAlerts, addAlert } from '@/data/inMemoryStore';
import { STATIC_ALERTS } from '@/data/staticData';

export async function POST(request) {
  try {
    const { scenario } = await request.json();

    if (scenario === 'reset') {
      return NextResponse.json({
        scenario: 'reset',
        message: 'All disruptions cleared. City transit back to normal baseline.',
        message_bn: 'সকল সংকট প্রত্যাহার করা হয়েছে। যান চলাচল স্বাভাবিক।',
        rain_active: false,
        rush_hour_active: false,
        blocked_hubs: [],
        waterlogged_hubs: [],
        active_alerts: STATIC_ALERTS
      });
    }

    if (scenario === 'monsoon_flood') {
      const floodAlert = addAlert({
        id: `alert-flood-${Date.now()}`,
        type: 'waterlogging',
        hub: 'Malibagh',
        severity: 'severe',
        title: 'Severe Waterlogging at Malibagh Intersection',
        title_bn: 'মালিবাগ মোড়ে তীব্র জলাবদ্ধতা ও যান চলাচল স্থবির',
        description: 'Roads knee-deep underwater near Malibagh railgate. Buses stalled.',
        description_bn: 'মালিবাগ রেলগেটে হাঁটু পানি। বাস চলাচল বন্ধ, রিকশা দ্বিগুণ ভাড়া চাইছে।',
        upvotes: 42,
        downvotes: 1,
        trust_score: 94.0,
        verified: true
      });

      return NextResponse.json({
        scenario: 'monsoon_flood',
        message: 'Severe monsoon flooding simulated at Malibagh. Surface lines rerouted.',
        message_bn: 'মালিবাগে তীব্র জলাবদ্ধতা সক্রিয় করা হয়েছে। সারফেস রুটগুলো ঘুরিয়ে দেওয়া হয়েছে।',
        rain_active: true,
        rush_hour_active: false,
        blocked_hubs: [],
        waterlogged_hubs: ['Malibagh'],
        new_alert: floodAlert,
        active_alerts: getAlerts()
      });
    }

    if (scenario === 'shahbagh_blockade') {
      const protestAlert = addAlert({
        id: `alert-blockade-${Date.now()}`,
        type: 'blockade',
        hub: 'Shahbagh',
        severity: 'critical',
        title: 'Sudden Student Protest & Intersection Blockade at Shahbagh',
        title_bn: 'শাহবাগ মোড়ে আকস্মিক শিক্ষার্থী অবরোধ',
        description: 'Ground traffic halted completely. MRT-6 Metro Rail running unimpeded overhead.',
        description_bn: 'নিচের সব যান চলাচল বন্ধ। উপর দিয়ে মেট্রোরেল স্বাভাবিক গতিতে চলছে।',
        upvotes: 89,
        downvotes: 0,
        trust_score: 99.0,
        verified: true
      });

      return NextResponse.json({
        scenario: 'shahbagh_blockade',
        message: 'Shahbagh ground intersection barricaded. Metro Rail overhead active.',
        message_bn: 'শাহবাগ মোড় অবরুদ্ধ। উপর দিয়ে মেট্রোরেল পুরোপুরি সচল।',
        rain_active: false,
        rush_hour_active: false,
        blocked_hubs: ['Shahbagh'],
        waterlogged_hubs: [],
        new_alert: protestAlert,
        active_alerts: getAlerts()
      });
    }

    if (scenario === 'rush_hour') {
      return NextResponse.json({
        scenario: 'rush_hour',
        message: '5:30 PM Evening Peak Rush Activated. Rickshaw dynamic fare surge applied.',
        message_bn: 'সন্ধ্যা ৫:৩০ অফিস ছুটি ও তীব্র জ্যাম সক্রিয়। রিকশায় সার্ফ চার্জ প্রযোজ্য।',
        rain_active: false,
        rush_hour_active: true,
        blocked_hubs: [],
        waterlogged_hubs: [],
        active_alerts: getAlerts()
      });
    }

    return NextResponse.json({ error: 'Unknown scenario' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Simulation trigger failed' }, { status: 500 });
  }
}
