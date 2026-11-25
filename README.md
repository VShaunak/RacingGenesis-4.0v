# Racing Genesis — Assignment 6: Feature Complete (v8.0) & Peer Playtesting

**Course:** CS 549 (AI for Visual Computing) — Rutgers University  
**Project:** Racing Genesis: Physics-Driven Procedural F1 Simulation & Autonomous AI Driving  
**Build Version:** Feature Complete Build v8.0 (Feature Freeze Milestone)  
**Team Members:** Shaunak M Vidwans (Lead), Pavan Sai Komara, Sridevi Mudiyanur Ramamurthy, Zeba Afreen  
**Date:** November 2026  

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

## 👥 Assignment 6 User Study Results

**CS 549 AI for Visual Computing, Rutgers University**

### Methodology

After playing Racing Genesis 2.0, participants completed a six-question Google Form about onboarding, controls, performance, enjoyment, and possible improvements. The form used a 1–10 controls rating, a Yes/No question about objective clarity, and four open-ended questions. The five responses below were selected from nine submissions for the specificity of their gameplay feedback.

### Subject Feedback

All **nine respondents** said the objective was clear from the beginning. The five students profiled below rated the controls **8.8/10** on average. In those five responses, three participants reported no visual glitches, one reported a rendering problem, and one could not verify real-time performance.

| Participant | Controls Rating | Objective Clarity | Visual Glitches / Performance | Key Strengths & Suggestions | Test Dossier Links |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **Swanith Reddy Inugala** | **8/10** | Yes | Blank 3D view at ~2 FPS in cloud browser; visible via Top / Orbit → Map | Liked starting lights & braking telemetry. Suggested collapsing editor at startup & adding grip lap-time comparison. | [DOCX](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_1_Swanith_Reddy_Inugala.docx) • [PDF](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_1_Swanith_Reddy_Inugala.pdf) |
| **Shweatha Bathina Mallikarjuna** | **9/10** | Yes | No glitches or lag reported | Enjoyed racing itself. Suggested brief tutorial, clearer control instructions, and polished feedback transitions. | [DOCX](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_2_Shweatha_Bathina_Mallikarjuna.docx) • [PDF](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_2_Shweatha_Bathina_Mallikarjuna.pdf) |
| **Dev Sachin Solai Giri** | **8/10** | Yes | Could not verify real-time performance | Liked AI/Manual toggle, cameras, telemetry, and track customization. Suggested beginner tutorial, simplified HUD, and AI opponents. | [DOCX](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_3_Dev_Sachin_Solai_Giri.docx) • [PDF](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_3_Dev_Sachin_Solai_Giri.pdf) |
| **Prithvi Govindareddy** | **9/10** | Yes | Smooth tracking, no noticeable glitches or lag | Praised physics, animations, and helicopter tracking. Suggested on-screen hint for 3D zoom controls. | [DOCX](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_4_Prithvi_Govindareddy.docx) • [PDF](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_4_Prithvi_Govindareddy.pdf) |
| **Jayanth Jayaram Naidu Jayakumar** | **10/10** | Yes | Car stayed in frame throughout; zero glitches | Loved helicopter view and zooming/panning during race. Suggested showing lap target and AI/Manual choice in pre-race intro. | [DOCX](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_5_Jayanth_Jayaram_Naidu_Jayakumar.docx) • [PDF](file:///d:/My%20files/Rutgers/7-AI%20for%20Visual%20Computing/All%20assignments/Assignment-6/peer_playtesting/Peer_Playtest_Participant_5_Jayanth_Jayaram_Naidu_Jayakumar.pdf) |

#### Swanith Reddy Inugala

- **What they liked most.** Liked the starting lights and seeing brake pressure rise in the telemetry as the AI entered a marked braking zone on the map.
- **Objective and controls.** Said the objective was clear and rated the controls **8/10**.
- **Confusion and performance.** After pressing Start in AI mode, the speed and lap timer updated while the 3D view stayed blank at about **2 FPS** in a cloud browser. They could see the circuit after switching to **Top / Orbit → Map**.
- **Suggestions.** Collapse the track editor at startup, prompt players to try Map if 3D fails, and offer a way to compare lap times at different grip settings on the same circuit.

#### Shweatha Bathina Mallikarjuna

- **What they liked most.** Enjoyed the racing itself.
- **Objective and controls.** Said the objective was clear and rated the controls **9/10**.
- **Confusion and performance.** Found the game easy to understand and reported no glitches or lag.
- **Suggestions.** Add a brief tutorial, clearer control instructions, and more noticeable gameplay feedback. Polish transitions and responsiveness.

#### Dev Sachin Solai Giri

- **What they liked most.** Liked the option to switch between AI and manual driving. The camera angles and live telemetry reinforced the simulation feel, and track customization stood out.
- **Objective and controls.** Said the objective was clear and rated the controls **8/10**.
- **Confusion and performance.** Wanted a quick explanation of what to do before starting the race. They could not verify real-time performance.
- **Suggestions.** Add a beginner tutorial and an optional simplified HUD. They also suggested AI opponents, difficulty levels, and a leaderboard for replayability.

#### Prithvi Govindareddy

- **What they liked most.** Praised the physics, animations, and AI. Helicopter tracking helped them follow the car through turns, and zooming and panning let them explore the circuit during the race.
- **Objective and controls.** Said the objective was clear and rated the controls **9/10**.
- **Confusion and performance.** Found the camera views easy to understand. Reported smooth tracking, with the car in frame for a full Workshop lap and no noticeable glitches or lag.
- **Suggestion.** Make the 3D zoom controls easier to discover with an on-screen hint.

#### Jayanth Jayaram Naidu Jayakumar

- **What they liked most.** Liked seeing the car and the road ahead from the helicopter view and exploring the circuit by zooming and panning during the race.
- **Objective and controls.** Said the objective was clear and rated the controls **10/10**.
- **Confusion and performance.** Found each camera view easy to understand and reported no glitches. The car stayed in frame throughout play.
- **Suggestion.** Show the lap target and the choice between manual driving and AI mode in a short pre-race introduction.

---

### Assignment 7 Action Items

1. **Handle 3D startup failures.** Reproduce the blank view and low frame rate in a cloud browser. Add a clear loading or error message and offer a **Switch to Map** button if the 3D view fails to initialize.
2. **Clarify the start of a race.** Add a brief introduction with the lap target, the manual and AI options, and the basic manual controls.
3. **Simplify the default HUD.** Start with the track editor collapsed and keep the race, lap count, and playback controls prominent. Keep the editor toggle visible for players who want to customize the track.
4. **Clarify race-state transitions.** Show consistent countdown, racing, and paused indicators near the playback controls. Test the Start and Resume flows to make sure the indicators update promptly.
5. **Make camera gestures easier to discover.** Put the existing Full circuit zoom controls near the camera selector and show a short drag-to-rotate hint in the 3D views.

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
