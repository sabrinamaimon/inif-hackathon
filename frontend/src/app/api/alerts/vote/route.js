import { NextResponse } from 'next/server';
import { voteAlert } from '@/data/inMemoryStore';

export async function POST(request) {
  try {
    const { alert_id, vote_type } = await request.json();
    if (!alert_id || !vote_type) {
      return NextResponse.json({ 
        error: 'তথ্য অসম্পূর্ণ',
        message_bn: 'সঠিক সতর্কতার তথ্য প্রদান করুন।' 
      }, { status: 400 });
    }

    // Extract client IP address from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = (forwarded ? forwarded.split(',')[0].trim() : realIp) || '127.0.0.1';

    const result = voteAlert(alert_id, vote_type, clientIp);
    if (!result) {
      return NextResponse.json({ 
        error: 'সতর্কতা পাওয়া যায়নি',
        message_bn: 'অনুরোধকৃত সতর্কতাটি বর্তমানে সক্রিয় নেই।' 
      }, { status: 404 });
    }

    if (result.already_voted) {
      return NextResponse.json({
        already_voted: true,
        message_bn: 'আপনি ইতোমধ্যেই এই সতর্কতায় আপনার মূল্যবান মতামত প্রদান করেছেন। ধন্যবাদ!',
        message_en: 'You have already voted on this alert.',
        user_vote: result.user_vote,
        alert: result.alert
      }, { status: 200 });
    }

    return NextResponse.json({
      already_voted: false,
      message_bn: 'আপনার মতামত সফলভাবে গৃহীত হয়েছে। ধন্যবাদ!',
      message_en: 'Your vote has been recorded. Thank you!',
      user_vote: result.user_vote,
      alert: result.alert
    }, { status: 200 });
  } catch (error) {
    console.error('Alert vote error:', error);
    return NextResponse.json({ 
      error: 'মতামত গ্রহণ ব্যর্থ হয়েছে',
      message_bn: 'সাময়িক সমস্যার কারণে মতামত রেকর্ড করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।' 
    }, { status: 500 });
  }
}
