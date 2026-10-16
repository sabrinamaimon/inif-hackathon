/**
 * Generates an offline transit itinerary summary card as a downloadable PNG image.
 * Uses native HTML5 Canvas - requires zero external dependencies.
 */

export function generateOfflineRouteCard(route, origin, destination, lang = 'bn') {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 600, 420);
  grad.addColorStop(0, '#064e3b'); // Dark emerald
  grad.addColorStop(1, '#022c22');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 420);

  // Card Border
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, 580, 400);

  // Header Title
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('DhakaPath — Offline Commute Card', 30, 45);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px sans-serif';
  ctx.fillText('ঢাকা আরবান ট্রানজিট রুট গার্ড', 30, 68);

  // Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 85);
  ctx.lineTo(570, 85);
  ctx.stroke();

  // Route Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(`${origin}  ➜  ${destination}`, 30, 120);

  // Stats
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`Est. Duration: ${route.total_duration_mins} mins`, 30, 150);
  ctx.fillText(`Regular Fare: ${route.total_regular_fare} BDT`, 240, 150);
  ctx.fillText(`Student Half-Pass: ${route.total_student_fare} BDT`, 410, 150);

  // Legs steps
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Step-by-Step Multi-Modal Legs:', 30, 185);

  let yOffset = 215;
  route.legs.forEach((leg, idx) => {
    if (idx >= 3) return; // Keep top 3 for space
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(40, yOffset - 4, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(
      `Leg ${leg.leg_number}: [${leg.mode.toUpperCase()}] ${leg.line_name} (${leg.from_hub} ➔ ${leg.to_hub})`,
      55,
      yOffset
    );

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText(`${leg.duration_mins}m | Fare: ${leg.regular_fare_bdt} BDT (Stud: ${leg.student_fare_bdt} BDT) - ${leg.landmark_instructions}`, 55, yOffset + 18);

    yOffset += 45;
  });

  // Footer Helpline
  ctx.fillStyle = '#6ee7b7';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('Emergency Traffic Police: 01713398500 | National Helpline: 999', 30, 390);

  // Trigger download
  const link = document.createElement('a');
  link.download = `dhakapath-route-${origin}-to-${destination}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
