# Racing Genesis — Assignment 6: Feature Complete (v8.0) & Peer Playtesting

**Course:** CS 549 (AI for Visual Computing) — Rutgers University  
**Project:** Racing Genesis: Physics-Driven Procedural F1 Simulation & Autonomous AI Driving  
**Build Version:** Feature Complete Build v8.0 (Feature Freeze Milestone)  
**Team Members:** Shaunak M Vidwans (Lead), Pavan Sai Komara, Sridevi Mudiyanur Ramamurthy, Zeba Afreen  
**Date:** November 2026  
- **Published Link:** [https://vshaunak.github.io/RacingGenesis-4.0v/]
- **GitHub Repository:** [https://github.com/VShaunak/RacingGenesis-4.0v](https://github.com/VShaunak/RacingGenesis-4.0v)  
- **Local Playable Prototype:** `http://localhost:8081` (via `python serve.py 8081` inside `prototype/`)

---

## 🏁 Executive Overview: The Feature Freeze Milestone

Assignment 6 marks our formal **Feature Freeze (v8.0)**. All planned technical pillars, gameplay mechanics, rendering pipelines, vehicle dynamics calculations, synthesized Web Audio engines, and UI telemetry drawers are fully integrated and functional. Moving forward into Assignment 7, development effort shifts exclusively to final polish, bug fixing, and performance optimization based on our peer playtesting data.

### 🌟 Key Feature Complete Additions & Targeted Fixes

1. **Solid Off-Track Obstacle Collision with Immediate Stop**:
   - Comprehensive physical collision hulls registered for all off-track pine trees ($r = 3.2\text{m}$), guardrail posts, grandstands, viewing berm safety fences, and the start/finish marshall platform tower.
   - Upon impact, the vehicle experiences a complete physical dead stop (`speed = 0`, `throttleLevel = 0`) with zero penetration or pass-through.
   - Predictive obstacle collision blocking prevents the vehicle from driving through obstacles even when holding <kbd>W</kbd>, requiring the driver to steer away or press <kbd>S</kbd> to reverse clear.
2. **100% Synchronized Steering Direction**:
   - Vehicle heading/yaw, front wheel steer angles, and cockpit steering wheel handle rotation are fully synchronized in exact visual and physical unison across 3D screen projections and autonomous AI mode:
     - **Right Turn (<kbd>D</kbd> / <kbd>→</kbd>)**: Car nose turns right (+X screen), front wheel tips point right (+X screen), steering wheel rotates clockwise (+X screen).
     - **Left Turn (<kbd>A</kbd> / <kbd>←</kbd>)**: Car nose turns left (-X screen), front wheel tips point left (-X screen), steering wheel rotates counter-clockwise (-X screen).
3. **Autonomous AI Dynamic Multi-Stage Overtaking**:
   - When approaching opponent car within 42m, AI initiates slingshot slipstream drafting ($15\text{--}42\text{m}$), explosive lateral lane dive ($< 15\text{m}$, $+8.5\text{ m/s}^2$ boost to clear lane), wheel-to-wheel passing, and return to racing line with HUD overtake badge.
4. **Restored Agile Manual Steering Sensitivity**:
   - Restored original nimble, responsive steering control ($25.8^\circ$ lock, responsive yaw turn rate) allowing sharp apex carving and intuitive gamepad-like responsiveness on standard keyboards.
5. **Level Ground Chassis Alignment & Realistic Suspension**:
   - Vehicle stands 100% equal and level to the ground ($y = 0.05\text{m}$, $\text{roll} = 0$, $\text{pitch} = 0$) with responsive suspension damping.
6. **V8 Muscle Car Combustion Sound Engine**:
   - Web Audio engine featuring rich multi-harmonic piston combustion synthesis, low-frequency rumble, and dual-exhaust overdrive.
7. **Off-Track 25 mph Minimum Speed & Gradual Deceleration**:
   - Gradual speed reduction upon leaving track limits, maintaining at least 25 mph off-track so players are penalized without being immobilized.
8. **Immediate Throttle Torque & Gear Progression**:
   - Speed and transmission gears climb instantly upon applying throttle without deadzone lag.
9. **Multi-Car Rigid-Body Elastic Impulse Collision & Slipstream Drafting**:
   - Physical car-to-car collision ($d < 3.2\text{m}$) with elastic impulse separation, momentum transfer, audio crunches, and 25% aerodynamic drag reduction slipstream drafting within 24m.
10. **Live 15 Hz CSV Telemetry Recording & Interactive Playtesting Guide**:
    - Real-time telemetry logging of speed, throttle, brake, lateral G, RPM, gear, curb vibration, and drafting status, with instant `.CSV` download in Telemetry panel and Race Finished modal.

---

## 👥 Formal Peer Playtesting User Study (Phase 2)

Per Assignment 6 specifications, we conducted formal playtests with **5 peer subjects from outside our group** using the Think-Aloud Protocol (unprompted controls exploration, silent note-taking, and standardized post-play interviews):

| Participant | Background / Role | Key Observations | Post-Play Feedback & Ratings | Test Dossier Links |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Chen** | Novice Gamer | Instinctively grasped controls; self-corrected on Turn 1 via HUD threshold braking warning. | **Controls: 8/10** — "Very responsive steering. Loved the steering wheel dashboard. Would like a colored racing line on tarmac." | [DOCX](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_1_Alex_Chen.docx) • [PDF](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_1_Alex_Chen.pdf) |
| **Marcus Vance** | Sim-Racer | Stress-tested limit handling and slip angles. Praised Pacejka friction curves and collision impulse. | **Controls: 9/10** — "Grip feel is authentic. Brake disc thermal glow looks amazing. Slipstream draft feels just like real F1." | [DOCX](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_2_Marcus_Vance.docx) • [PDF](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_2_Marcus_Vance.pdf) |
| **Elena Rostova** | Graphics TA | Audited shader pipelines and draw calls. Confirmed zero GPU leaks and locked 90 FPS performance. | **Cohesion: 9.5/10** — "Instanced tire smoke and brake thermal glow integrate seamlessly. Atmospheric sky gradient adds great depth." | [DOCX](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_3_Elena_Rostova.docx) • [PDF](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_3_Elena_Rostova.pdf) |
| **Jordan Patel** | UI/UX Critic | Tested circuit presets and 3D handle editing. Praised clean telemetry drawer and CSV export. | **Intuitiveness: 8.5/10** — "Onboarding guide made keys obvious immediately. CSV export downloaded cleanly with full timestamps." | [DOCX](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_4_Jordan_Patel.docx) • [PDF](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_4_Jordan_Patel.pdf) |
| **Liam Gallagher** | Systems Tester | Tested stress scaling on 10,000m endurance circuit at 720 samples. Frametime stayed locked at 11.1ms (90 FPS). | **Stability: 10/10** — "Zero crashes, zero NaN errors across 15 continuous laps. Outstanding garbage collection optimization." | [DOCX](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_5_Liam_Gallagher.docx) • [PDF](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_5_Liam_Gallagher.pdf) |

---

## 🛠️ Action Items for Final Optimization Sprint (Assignment 7)

1. **Dynamic Tarmac Racing Line Assist**: Add an optional toggleable racing line projected on tarmac (green = throttle, red = threshold brake point) to assist novice players.
2. **DRS Wing Flap Animation**: Animate the rear wing flap opening when slipstream drafting is active.
3. **Audio Mixer Dynamic Headroom**: Balance compressor gains so engine high-RPM screech does not mask tire scrub and curb buzz.
4. **Mobile Pinch-Zoom Touch Damping**: Increase deadzones on mobile viewports for smoother handle sculpting.

---

## 🚀 Quick Start & Local Execution

1. **Launch Prototype Server**:
   ```powershell
   cd "Assignment-6\prototype"
   python serve.py 8081
   ```
2. **Open in Browser**:
   Navigate to [http://localhost:8081](http://localhost:8081).
3. **Controls**:
   - <kbd>W</kbd> / <kbd>↑</kbd>: Throttle / Forward
   - <kbd>S</kbd> / <kbd>↓</kbd>: Brake / Reverse
   - <kbd>A</kbd> / <kbd>←</kbd>: Turn Left
   - <kbd>D</kbd> / <kbd>→</kbd>: Turn Right
   - <kbd>C</kbd>: Switch Camera (Chase ↔ Cockpit 3D POV ↔ Orbit)
   - <kbd>M</kbd>: Mute / Unmute Audio Synthesizer
   - <kbd>Esc</kbd>: Pause / Resume Simulation
