/**
 * Generates a high-resolution Vintage Bangladesh Commute Postcard (৮ আনা ডাকটিকিট শৈলী)
 * with extra large, high-contrast typography so older commuters can read it with ease.
 * Uses native HTML5 Canvas - requires zero external dependencies.
 */

export function generateOfflineRouteCard(arg1, arg2, arg3, arg4) {
  // Support both object syntax: { route, origin, destination, lang } and positional syntax
  let route, origin, destination, lang;
  if (arg1 && arg1.route) {
    route = arg1.route;
    origin = arg1.origin;
    destination = arg1.destination;
    lang = arg1.lang || 'bn';
  } else {
    route = arg1;
    origin = arg2;
    destination = arg3;
    lang = arg4 || 'bn';
  }

  if (!route) return;

  const canvas = document.createElement('canvas');
  canvas.width = 850;
  canvas.height = 580;
  const ctx = canvas.getContext('2d');

  // 1. Vintage Aged Parchment Cream Background
  ctx.fillStyle = '#f8f4eb';
  ctx.fillRect(0, 0, 850, 580);

  // 2. Air Mail Postal Serrated / Perforated Border
  ctx.strokeStyle = '#c69429';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, 818, 548);

  ctx.strokeStyle = '#b83a2e';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(24, 24, 802, 532);
  ctx.setLineDash([]); // Reset dash

  // 3. Top Postal Header Banner
  ctx.fillStyle = '#15453b';
  ctx.fillRect(35, 35, 780, 50);

  ctx.fillStyle = '#f6d16f';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillText('BANGLADESH POSTCARD — DHAKAPATH COMMUTE CARD', 50, 68);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('৮ আনা ডাকটিকিট • লাইভ ট্রানজিট রুট', 600, 68);

  // 4. Circular Postal Seal Stamp (Top Right)
  ctx.save();
  ctx.translate(720, 140);
  ctx.rotate(-0.1);
  ctx.strokeStyle = 'rgba(184, 58, 46, 0.75)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#b83a2e';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DHAKA G.P.O.', 0, -18);
  ctx.font = 'bold 14px Georgia, serif';
  ctx.fillText('2026', 0, 2);
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('POSTAL TRANSIT', 0, 20);
  ctx.restore();

  // 5. Center Focused Route Ledger (White/Cream High Contrast Panel for Easy Reading)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(45, 100, 640, 435);
  ctx.strokeStyle = 'rgba(198, 148, 41, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 100, 640, 435);

  // 6. Huge Route Heading (Large for Older People to Read Easily!)
  ctx.fillStyle = '#120e0b';
  ctx.font = 'bold 28px Georgia, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${origin}   ➔   ${destination}`, 65, 140);

  ctx.fillStyle = '#b83a2e';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(lang === 'bn' ? route.title_bn : route.title, 65, 168);

  // Divider
  ctx.strokeStyle = '#c69429';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(65, 185);
  ctx.lineTo(665, 185);
  ctx.stroke();

  // 7. Key Metrics in Extra Large Font
  // Duration
  ctx.fillStyle = '#15453b';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(lang === 'bn' ? 'মোট সময়:' : 'Total Duration:', 65, 215);
  ctx.font = 'bold 24px monospace';
  ctx.fillStyle = '#120e0b';
  ctx.fillText(`${route.total_duration_mins} mins`, 65, 245);

  // Regular Fare
  ctx.fillStyle = '#15453b';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(lang === 'bn' ? 'সাধারণ ভাড়া:' : 'Regular Fare:', 240, 215);
  ctx.font = 'bold 26px monospace';
  ctx.fillStyle = '#b83a2e';
  ctx.fillText(`${route.total_regular_fare} ৳`, 240, 245);

  // Student Half-Pass Fare
  ctx.fillStyle = '#15453b';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(lang === 'bn' ? 'শিক্ষার্থী হাফ-পাস:' : 'Student Half-Pass:', 430, 215);
  ctx.font = 'bold 26px monospace';
  ctx.fillStyle = '#0e6e41';
  ctx.fillText(`${route.total_student_fare} ৳`, 430, 245);

  // Divider
  ctx.strokeStyle = '#e2d5bd';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(65, 265);
  ctx.lineTo(665, 265);
  ctx.stroke();

  // 8. Step-by-Step Large Print Instructions
  ctx.fillStyle = '#120e0b';
  ctx.font = 'bold 16px Georgia, sans-serif';
  ctx.fillText(lang === 'bn' ? 'যাত্রার ধাপ ও ওঠার স্থান (বড় অক্ষরে নির্দেশিকা):' : 'Step-by-Step Instructions & Boarding Landmarks:', 65, 295);

  let yOffset = 330;
  route.legs.forEach((leg, idx) => {
    if (idx >= 3) return; // Top legs
    // Step Number Badge
    ctx.fillStyle = '#b83a2e';
    ctx.beginPath();
    ctx.arc(78, yOffset - 6, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${idx + 1}`, 78, yOffset - 2);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#120e0b';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(
      `[${leg.mode.toUpperCase()}] ${leg.line_name} (${leg.from_hub} ➔ ${leg.to_hub})`,
      100,
      yOffset - 5
    );

    ctx.fillStyle = '#3d3026';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(
      `বোর্ডিং স্থান: ${leg.landmark_instructions} | সময়: ${leg.duration_mins} মিনিট | ভাড়া: ${leg.regular_fare_bdt} ৳ (হাফ-পাস: ${leg.student_fare_bdt} ৳)`,
      100,
      yOffset + 18
    );

    yOffset += 55;
  });

  // Emergency Footer Bar
  ctx.fillStyle = '#1c1511';
  ctx.fillRect(45, 485, 640, 40);

  ctx.fillStyle = '#f6d16f';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('জরুরি ট্রাফিক কন্ট্রোল: 01713398500  |  জাতীয় জরুরি সেবা: 999  |  মেট্রোরেল হেল্পলাইন: 16111', 65, 510);

  // Trigger download
  const link = document.createElement('a');
  link.download = `dhakapath-postcard-${origin}-to-${destination}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
