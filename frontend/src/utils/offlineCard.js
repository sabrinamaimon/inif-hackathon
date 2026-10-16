import { formatFare, formatDuration, toBnDigits } from './localization';
import { STATIC_HUBS } from '../data/staticData';

/**
 * Generates a high-resolution, beautifully formatted Commute Pass Card
 * with Vintage Postcard / Rickshaw Art aesthetic, high contrast, and perfectly balanced layout.
 * Eliminates gimmicky text and focuses on essential commuter route information.
 * Uses native HTML5 Canvas - requires zero external dependencies.
 */

// Helper to draw clean rounded rectangles on any canvas
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Helper to truncate text that exceeds maxWidth with ellipsis
function fitText(ctx, text, maxWidth) {
  if (!text) return '';
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + '…').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '…';
}

export function generateOfflineRouteCard(arg1, arg2, arg3, arg4) {
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

  const isBn = lang === 'bn';

  // 1. High-Resolution Canvas Dimensions (Width: 940px, Height: 650px)
  const canvas = document.createElement('canvas');
  canvas.width = 940;
  canvas.height = 650;
  const ctx = canvas.getContext('2d');

  // 2. Vintage Cream Parchment Background
  ctx.fillStyle = '#faf6ee';
  ctx.fillRect(0, 0, 940, 650);

  // 3. Vintage Double Borders (Gold + Crimson Dashed Postal Line)
  ctx.strokeStyle = '#c69429';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, 908, 618);

  ctx.strokeStyle = '#b83a2e';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(24, 24, 892, 602);
  ctx.setLineDash([]); // Reset dash

  // 4. Clean Official Header Banner (Full Width: 868px)
  const bannerX = 36;
  const bannerY = 36;
  const bannerW = 868;
  const bannerH = 48;

  ctx.fillStyle = '#15453b';
  drawRoundedRect(ctx, bannerX, bannerY, bannerW, bannerH, 8);
  ctx.fill();
  ctx.strokeStyle = '#c69429';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Left Title: Official Commute Card Branding
  ctx.fillStyle = '#f6d16f';
  ctx.font = 'bold 20px "Anek Bangla", "Segoe UI", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    isBn ? 'ঢাকা-পাথ • ডিজিটাল কমিউট কার্ড' : 'DHAKAPATH • DIGITAL COMMUTE CARD',
    bannerX + 18,
    bannerY + bannerH / 2
  );

  // Right Badge: Smart City Verification Pass
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px "Anek Bangla", "Segoe UI", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(
    isBn ? 'স্মার্ট সিটি ট্রানজিট নেটওয়ার্ক ২০২৬ • ভেরিফাইড পাস' : 'SMART CITY TRANSIT NETWORK 2026 • VERIFIED PASS',
    bannerX + bannerW - 18,
    bannerY + bannerH / 2
  );

  // 5. Center Focused Route Ledger (White High-Contrast Panel)
  const panelX = 36;
  const panelY = 96;
  const panelW = 868;
  const panelH = 466;

  ctx.fillStyle = '#ffffff';
  drawRoundedRect(ctx, panelX, panelY, panelW, panelH, 12);
  ctx.fill();
  ctx.strokeStyle = '#c69429';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 6. Vintage Transit Rubber Stamp Seal (Top Right of Panel)
  ctx.save();
  ctx.translate(panelX + panelW - 85, panelY + 68);
  ctx.rotate(-0.08); // Slight organic tilt
  ctx.strokeStyle = 'rgba(184, 58, 46, 0.7)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.stroke();

  // Inner dotted ring
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#b83a2e';
  ctx.font = 'bold 10px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DHAKAPATH', 0, -18);
  ctx.font = 'bold 13px Georgia, serif';
  ctx.fillText('★ 2026 ★', 0, 0);
  ctx.font = 'bold 9px "Segoe UI", sans-serif';
  ctx.fillText('COMMUTE PASS', 0, 16);
  ctx.fillText('VERIFIED', 0, 27);
  ctx.restore();

  // 7. Journey Route Header
  const contentLeft = panelX + 24;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Category Tag
  ctx.fillStyle = '#b83a2e';
  ctx.font = 'bold 12px "Anek Bangla", "Segoe UI", sans-serif';
  ctx.fillText(
    isBn ? 'সরাসরি যাত্রাপথ করিডোর' : 'DIRECT TRANSIT CORRIDOR',
    contentLeft,
    panelY + 30
  );

  // Route Title (Origin ➔ Destination)
  ctx.fillStyle = '#120e0b';
  ctx.font = 'bold 28px "Anek Bangla", "Segoe UI", Georgia, serif';
  const originName = isBn ? (STATIC_HUBS[origin]?.name_bn || origin) : origin;
  const destName = isBn ? (STATIC_HUBS[destination]?.name_bn || destination) : destination;
  const corridorText = `${originName}   ➔   ${destName}`;
  ctx.fillText(fitText(ctx, corridorText, panelW - 200), contentLeft, panelY + 64);

  // Route Subtitle
  ctx.fillStyle = '#7a6654';
  ctx.font = 'bold 15px "Anek Bangla", "Segoe UI", sans-serif';
  const subtitle = isBn ? (route.title_bn || route.title) : (route.title || route.title_bn);
  ctx.fillText(fitText(ctx, subtitle, panelW - 200), contentLeft, panelY + 90);

  // Hairline Divider
  ctx.strokeStyle = '#c69429';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(contentLeft, panelY + 104);
  ctx.lineTo(panelX + panelW - 24, panelY + 104);
  ctx.stroke();

  // 8. Key Metrics Bar (Fare & Duration Slip)
  const metricBoxX = contentLeft;
  const metricBoxY = panelY + 116;
  const metricBoxW = panelW - 48;
  const metricBoxH = 68;

  ctx.fillStyle = '#f5eedf';
  drawRoundedRect(ctx, metricBoxX, metricBoxY, metricBoxW, metricBoxH, 10);
  ctx.fill();
  ctx.strokeStyle = 'rgba(198, 148, 41, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const colW = metricBoxW / 3;

  // Metric 1: Total Duration
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7a6654';
  ctx.font = 'bold 11px "Anek Bangla", "Segoe UI", sans-serif';
  ctx.fillText(isBn ? 'মোট আনুমানিক সময়' : 'TOTAL DURATION', metricBoxX + colW * 0.5, metricBoxY + 24);
  ctx.fillStyle = '#15453b';
  ctx.font = 'bold 24px "Anek Bangla", monospace';
  ctx.fillText(formatDuration(route.total_duration_mins, lang), metricBoxX + colW * 0.5, metricBoxY + 54);

  // Divider 1
  ctx.strokeStyle = 'rgba(198, 148, 41, 0.35)';
  ctx.beginPath();
  ctx.moveTo(metricBoxX + colW, metricBoxY + 10);
  ctx.lineTo(metricBoxX + colW, metricBoxY + metricBoxH - 10);
  ctx.stroke();

  // Metric 2: Regular Fare
  ctx.fillStyle = '#7a6654';
  ctx.font = 'bold 11px "Anek Bangla", "Segoe UI", sans-serif';
  ctx.fillText(isBn ? 'সাধারণ ভাড়া' : 'REGULAR FARE', metricBoxX + colW * 1.5, metricBoxY + 24);
  ctx.fillStyle = '#b83a2e';
  ctx.font = 'bold 24px "Anek Bangla", monospace';
  ctx.fillText(formatFare(route.total_regular_fare, lang), metricBoxX + colW * 1.5, metricBoxY + 54);

  // Divider 2
  ctx.beginPath();
  ctx.moveTo(metricBoxX + colW * 2, metricBoxY + 10);
  ctx.lineTo(metricBoxX + colW * 2, metricBoxY + metricBoxH - 10);
  ctx.stroke();

  // Metric 3: Student Fare
  ctx.fillStyle = '#0e6e41';
  ctx.font = 'bold 11px "Anek Bangla", "Segoe UI", sans-serif';
  ctx.fillText(isBn ? '🎓 শিক্ষার্থী হাফ-পাস' : '🎓 STUDENT HALF-PASS', metricBoxX + colW * 2.5, metricBoxY + 24);
  ctx.fillStyle = '#0e6e41';
  ctx.font = 'bold 24px "Anek Bangla", monospace';
  ctx.fillText(formatFare(route.total_student_fare, lang), metricBoxX + colW * 2.5, metricBoxY + 54);

  // 9. Step-by-Step Leg Instructions
  const stepsStartY = metricBoxY + metricBoxH + 26;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#120e0b';
  ctx.font = 'bold 15px "Anek Bangla", "Segoe UI", Georgia, serif';
  ctx.fillText(
    isBn ? 'যাত্রাপথের ধাপ ও বাহন নির্দেশিকা:' : 'Step-by-Step Transit Instructions & Boarding:',
    contentLeft,
    stepsStartY
  );

  let currentY = stepsStartY + 24;
  const maxLegs = Math.min(route.legs.length, 3);

  route.legs.slice(0, maxLegs).forEach((leg, idx) => {
    // Numbered Badge Circle
    ctx.fillStyle = '#b83a2e';
    ctx.beginPath();
    ctx.arc(contentLeft + 12, currentY + 10, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${idx + 1}`, contentLeft + 12, currentY + 10);

    // Leg Line Title & Route
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#120e0b';
    ctx.font = 'bold 16px "Anek Bangla", "Segoe UI", sans-serif';

    const modeTag = leg.mode 
      ? (isBn 
          ? `[${leg.mode === 'metro' ? 'মেট্রোরেল' : leg.mode === 'bus' ? 'বাস' : leg.mode === 'cng' ? 'সিএনজি' : leg.mode === 'bike' ? 'বাইক' : leg.mode === 'car' ? 'প্রাইভেট কার' : 'রিকশা'}] ` 
          : `[${leg.mode.toUpperCase()}] `) 
      : '';
    const lineName = isBn ? (leg.line_name_bn || leg.line_name) : leg.line_name;
    const fromName = isBn ? (STATIC_HUBS[leg.from_hub]?.name_bn || leg.from_hub) : leg.from_hub;
    const toName = isBn ? (STATIC_HUBS[leg.to_hub]?.name_bn || leg.to_hub) : leg.to_hub;
    const legTitle = `${modeTag}${lineName} (${fromName} ➔ ${toName})`;
    ctx.fillText(fitText(ctx, legTitle, 530), contentLeft + 32, currentY + 7);

    // Leg Right-Aligned Quick Metrics
    ctx.textAlign = 'right';
    ctx.fillStyle = '#15453b';
    ctx.font = 'bold 13px "Anek Bangla", "Segoe UI", monospace';
    const legDurationText = formatDuration(leg.duration_mins, lang);
    const legFareText = formatFare(leg.regular_fare_bdt, lang);
    const legStudentText = formatFare(leg.student_fare_bdt, lang);
    ctx.fillText(
      isBn 
        ? `⏱ ${legDurationText}  •  ভাড়া: ${legFareText} (হাফ: ${legStudentText})` 
        : `⏱ ${legDurationText}  •  Fare: ${legFareText} (Half: ${legStudentText})`,
      panelX + panelW - 24,
      currentY + 7
    );

    // Landmark & Boarding Instruction
    ctx.textAlign = 'left';
    ctx.fillStyle = '#59473a';
    ctx.font = '13px "Anek Bangla", "Segoe UI", sans-serif';
    const landmarkPrefix = isBn ? 'বোর্ডিং নির্দেশিকা: ' : 'Boarding Landmark: ';
    const landmarkText = isBn 
      ? (leg.landmark_instructions_bn || leg.landmark_instructions || 'নির্ধারিত কাউন্টার বা স্টপেজ থেকে উঠুন।') 
      : (leg.landmark_instructions || 'Board at designated transit station counter.');
    const landmarkFull = `${landmarkPrefix}${landmarkText}`;
    ctx.fillText(fitText(ctx, landmarkFull, panelW - 70), contentLeft + 32, currentY + 28);

    // Subtle divider between legs
    if (idx < maxLegs - 1) {
      ctx.strokeStyle = '#e8dec9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(contentLeft + 32, currentY + 38);
      ctx.lineTo(panelX + panelW - 24, currentY + 38);
      ctx.stroke();
    }

    currentY += 46;
  });

  // 10. Emergency Helpline Footer Bar (Span Across Full Width)
  const footerX = panelX;
  const footerY = 574;
  const footerW = panelW;
  const footerH = 40;

  ctx.fillStyle = '#18130f';
  drawRoundedRect(ctx, footerX, footerY, footerW, footerH, 8);
  ctx.fill();

  ctx.fillStyle = '#f6d16f';
  ctx.font = 'bold 12.5px "Anek Bangla", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    isBn 
      ? 'জরুরি সহায়তা: ট্রাফিক কন্ট্রোল ০১৭১৩-৩৯৮৫০০  |  জাতীয় জরুরি সেবা ৯৯৯  |  মেট্রোরেল হেল্পলাইন ১৬১১১'
      : 'Emergency Contacts: Traffic Control 01713398500  |  National Service 999  |  Metro Helpline 16111',
    footerX + footerW / 2,
    footerY + footerH / 2
  );

  // 11. Subtle Bottom Credit
  ctx.fillStyle = '#8c7762';
  ctx.font = '11px "Anek Bangla", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(
    isBn 
      ? 'ঢাকা-পাথ আরবান মবিলিটি ইন্টেলিজেন্স • অফলাইনে সহজে পড়ার জন্য ডিজিটাল কমিউট কার্ড'
      : 'DhakaPath Urban Mobility Intelligence • Digital Commute Card for Offline Use',
    940 / 2,
    642
  );

  // 12. Trigger Instant Download as PNG
  const safeOrigin = (origin || 'origin').replace(/\s+/g, '-');
  const safeDest = (destination || 'destination').replace(/\s+/g, '-');
  const link = document.createElement('a');
  link.download = `dhakapath-commute-pass-${safeOrigin}-to-${safeDest}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
