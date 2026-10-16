# DhakaPath: Live Urban Transit & Route Intelligence
### Official Hackathon Entry | IAIT National IT Fest 2026 (INIF 2026)
**Theme:** Smart City | **Platform:** 100% Free Open Tech Stack | **Architecture:** Next.js 14 + FastAPI + NetworkX + Leaflet

---

## 📌 Executive Summary
Standard navigation platforms (like Google Maps) fail in Dhaka because they cater to private vehicles and predictable schedules. Commuters in Dhaka rely on a fragmented network of **local buses, the MRT-6 Metro Rail, legunas (human haulers), and connector rickshaws**, while navigating **monsoon waterlogging (জলজট), student half-fare rules, sudden intersection blockades, and unregulated weather surges**.

**DhakaPath** is a production-ready, multimodal transit and live street-alert intelligence platform built specifically for Dhaka’s geography and commuter realities.

---

## 🚀 Key Features & Hackathon Capabilities

### 1. Transit & Street-Status Management (Part 1 - CMS)
- **14 Major Dhaka Hubs Monitored:** Motijheel, Banasree, Malibagh, Shahbagh, Farmgate, Science Lab, Dhanmondi, Mohammadpur, Mirpur 10, Agargaon, Mohakhali, Badda, Uttara, and Jatrabari.
- **Multimodal Route Directory:** Official MRT-6 Metro Rail line, 7 major local bus lines (Bikolpo, Shikor, Thikana, Victor Classic, etc.), 4 leguna corridors, and connector rickshaw links.
- **Live Disruption Feed:** Categorized street incident logs (waterlogging, road construction, severe gridlock, intersection blockades) with affected transit modes.

### 2. Intelligent Multi-Constraint Trip Search (Part 2)
- **Natural Language & Banglish Processing:** Commuters can query in everyday Banglish or English (e.g., *"Farmgate theke Motijheel jabo half pass e, Shahbagh avoid kore"*).
- **Multi-Leg Itineraries:** Combines rickshaw + metro + bus transfers ranked by duration, cost, and number of transfers.
- **Landmark Guidance:** Specific boarding guidance for each leg (e.g., *"Board Bikolpo Bus opposite Ananda Cinema Hall; Metro Exit A"*).

### 3. Dynamic Fare Estimation & Disruption Rerouting (Part 3)
- **Authentic Dhaka Fare Engine:**
  - **Local Buses:** 50% legal student half-pass discount subject to the statutory **10 BDT minimum bus fare floor**.
  - **MRT-6 Metro Rail:** Fixed distance-based DMTCL government fare matrix (20 to 100 BDT, no student discount).
  - **Connector Rickshaws / CNGs:** Base rates with dynamic **weather surge multipliers** (+50% during rain, +80% during heavy monsoon) and rush-hour multipliers (+25%).
- **Interactive Urban Disruption Simulator:** Real-time controls to trigger heavy rainfall in Malibagh, peak 5:30 PM office rush hour, or a Shahbagh blockade to demonstrate instantaneous dynamic detour recalculation.

### 4. Report Validation & Output Grounding (Part 4)
- **AI Route Grounding:** Every AI-generated route recommendation is cross-referenced against the internal NetworkX graph to guarantee 100% factual accuracy with zero hallucinations.
- **Crowd Corroboration & Decay:** Commuters confirm ("Upvote") or mark resolved ("Downvote") alerts. Alerts feature a mathematical time-decay algorithm that downgrades or deactivates stale reports older than 3 hours.
- **Sanity Checks:** Automatic rule-based filtering to flag unrealistic fare submissions or spam reports.

### 5. Conversational Commute Assistant (Part 5)
- Context-aware chatbot supporting English, Bangla, and Banglish.
- Natural conversation to search multi-leg routes, check fares, and report live disruptions.

### 🎁 Bonus Features Included (From Hackathon Specification)
1. **Signboard & Notice Digitization (Bonus 1):** Upload a photo of a local bus signboard or printed fare chart to automatically extract structured route data via AI Vision OCR.
2. **Audio/Visual Route Briefing (Bonus 2):**
   - **TTS Audio Briefing ("শুনুন / Listen"):** Browser Web Speech synthesis for audio readout.
   - **Downloadable Offline Visual Card:** Native HTML5 canvas export that creates a compact transit pass PNG for commuters with low battery or poor connectivity.
3. **Commuter Ride-Share & Bot Coordination (Bonus 3):** Community coordination board for commuters at the same hub to share a rickshaw or CNG with automated per-person split-fare calculations.

---

## 🛠️ System Architecture

```
                                  [ COMMUTER CLIENT (Next.js 14) ]
                                                │
             ┌──────────────────────────────────┼──────────────────────────────────┐
             ▼                                  ▼                                  ▼
  [ Leaflet Map & Nodes ]            [ Conversational & Voice ]        [ Scenario Simulator ]
  • 14 Dhaka Hubs                    • Web Speech API (bn-BD)          • Rain / Blockade triggers
  • Route Polylines & Markers        • Audio Briefing (SpeechSynth)    • Dynamic Detour Visualizer
             │                                  │                                  │
             └──────────────────────────────────┼──────────────────────────────────┘
                                                │ REST API (JSON)
                                                ▼
                              [ BACKEND (FastAPI + Python 3.11) ]
                                                │
 ┌──────────────────────────────────────────────┼──────────────────────────────────────────────┐
 ▼                                              ▼                                              ▼
[ Routing & Graph Engine ]           [ Fare Calculation Module ]                 [ Grounding & AI Gateway ]
• NetworkX Directed Graph            • General vs Student Half-Pass              • Gemini 1.5 Flash (Free Tier)
• Dijkstra Shortest Path               (50% discount, 10 BDT floor)              • Route Grounding Validator
• Dynamic Edge Penalties             • Rickshaw/CNG Surge Calculator               (Validates AI against Graph)
  (Waterlogging, Jam, Blockades)       (Rain: +50%, Rush: +25%)                  • Sanity Checker & Time Decay
 │                                              │                                              │
 └──────────────────────────────────────────────┼──────────────────────────────────────────────┘
                                                │
                                                ▼
                                 [ IN-MEMORY / SQLITE DATABASE ]
                                 • 14 Major Hubs & Lat/Lng
                                 • Routes: Metro, Buses, Leguna, Rickshaw
                                 • Active Alerts & Verification Scores
```

---

## ⚡ Quick Start (1-Click Local Run)

### Prerequisites
- Node.js v18+ or v20+
- Python 3.10+
- Git

### 1. Clone & Start
```bash
git clone https://github.com/sabrinamaimon/inif-hackathon.git
cd inif-hackathon

# 1-Click Automated Startup (installs dependencies and starts both services)
./start.sh
```

- **Frontend Web App:** `http://localhost:3000`
- **Backend API:** `http://localhost:8000`
- **Swagger Interactive API Documentation:** `http://localhost:8000/docs`

---

## 🐳 Docker Deployment

Run both the frontend and backend with a single command:
```bash
docker-compose up --build
```

---

## 👥 Hackathon Team & Roles
- **Member 1:** Frontend Architect & Lead Integration
- **Member 2:** Backend, Database & Graph Routing Engineer
- **Member 3:** UI/UX & Frontend Support

---

## 📜 License
Developed for the **IAIT National IT Fest 2026 | Smart City Hackathon**. Free and open-source under the MIT License.
