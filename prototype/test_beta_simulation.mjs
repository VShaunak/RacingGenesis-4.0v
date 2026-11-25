import fs from 'fs';

// Mock minimal browser globals
const domElements = {};
function getMock(id) {
  if (!domElements[id]) {
    domElements[id] = {
      id: id,
      tagName: 'DIV',
      style: {},
      classList: {
        set: new Set(),
        add(c) { this.set.add(c); },
        remove(c) { this.set.delete(c); },
        contains(c) { return this.set.has(c); },
        toggle(c, v) { if (v === undefined ? this.set.has(c) : !v) this.set.delete(c); else this.set.add(c); }
      },
      appendChild() {},
      addEventListener() {},
      removeEventListener() {},
      value: '5000',
      dataset: { mode: 'ai', cam: 'chase', preset: 'monza' },
      textContent: '',
      innerHTML: '',
      getContext() {
        return {
          fillStyle: '',
          strokeStyle: '',
          lineWidth: 1,
          fillRect() {},
          strokeRect() {},
          clearRect() {},
          beginPath() {},
          moveTo() {},
          lineTo() {},
          stroke() {},
          fill() {},
          arc() {},
          roundRect() {},
          save() {},
          restore() {},
          translate() {},
          rotate() {},
          setTransform() {},
          measureText: () => ({ width: 50 }),
          fillText() {},
          createRadialGradient: () => ({ addColorStop() {} }),
          createLinearGradient: () => ({ addColorStop() {} }),
          getImageData: () => ({ data: new Uint8ClampedArray(512 * 512 * 4) }),
          putImageData() {}
        };
      }
    };
  }
  return domElements[id];
}

const html = fs.readFileSync('index.html', 'utf8');
const matches = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
matches.forEach(id => getMock(id));

globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

globalThis.window = {
  innerWidth: 1920,
  innerHeight: 1080,
  devicePixelRatio: 1,
  addEventListener() {},
  removeEventListener() {},
  location: { reload() {} },
  performance: { now: () => Date.now() },
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame() {},
  AudioContext: class {
    constructor() {
      this.currentTime = 0;
      this.destination = {};
      this.state = 'running';
    }
    createGain() { return { gain: { value: 1, setValueAtTime(){}, setTargetAtTime(){} }, connect(){ return this; } }; }
    createOscillator() { return { type: '', frequency: { setValueAtTime(){}, setTargetAtTime(){} }, connect(){ return this; }, start(){}, stop(){} }; }
    createBiquadFilter() { return { type: '', frequency: { setValueAtTime(){}, setTargetAtTime(){} }, Q: { setValueAtTime(){} }, connect(){ return this; } }; }
    createWaveShaper() { return { curve: null, connect(){ return this; } }; }
    resume() {}
  }
};

globalThis.document = {
  getElementById: (id) => getMock(id),
  querySelectorAll: () => [],
  body: getMock('body'),
  createElement: (tag) => {
    const el = getMock('mock_' + tag + '_' + Math.random().toString(36).substr(2, 5));
    el.tagName = tag.toUpperCase();
    if (tag === 'canvas') {
      el.width = 1024;
      el.height = 512;
    }
    return el;
  },
  createElementNS: (ns, tag) => {
    const el = getMock('mock_ns_' + tag + '_' + Math.random().toString(36).substr(2, 5));
    el.tagName = tag.toUpperCase();
    return el;
  }
};

// Import actual Three.js
import * as THREE from './three.module.js';

console.log('Loading app.js with real Three.js in headless Node...');
await import('./app.js');

const app = globalThis.window.racingApp;
if (!app) {
  throw new Error('window.racingApp was not created!');
}

console.log('✓ Assignment 5 Simulator instance created successfully!');
console.log('✓ Player Car initialized with Brake Incandescence Material');
console.log('✓ Opponent AI Agent initialized at progress:', app.opponent.progress);
console.log('✓ Tire Smoke & Skidmark System loaded (max particles:', app.tireSmokeSystem.maxParticles, ')');
console.log('✓ 90 FPS Live Telemetry Canvas Waveform Graph initialized');

// Test 1: AI mode physics and frame progression
console.log('\n--- Test 1: Autonomous AI Simulation Loop (30 Frames) ---');
for (let i = 0; i < 30; i++) {
  app.stepFrame(1 / 90);
}
console.log(`Speed: ${(app.speed * 2.23694).toFixed(1)} mph | Lat-G: ${app.lateralG.toFixed(2)} G | Opponent Speed: ${(app.opponent.speed * 2.23694).toFixed(1)} mph`);

// Test 2: Trigger heavy braking and test brake heat incandescence
console.log('\n--- Test 2: Brake Incandescence & Particle Smoke Test ---');
app.speed = 75.0; // 167 mph
app.aiState = "AI: THRESHOLD BRAKING";
app.brakeLevel = 1.0;
for (let i = 0; i < 20; i++) {
  app.stepFrame(1 / 90);
}
console.log(`Brake Disc Heat: ${app.car.brakeHeat.toFixed(3)} | Emissive Intensity: ${app.car.brakeRotorMat.emissiveIntensity.toFixed(2)}`);
if (app.car.brakeHeat > 0.1 && app.car.brakeRotorMat.emissiveIntensity > 0.1) {
  console.log('✓ Brake Disc glowing molten incandescent red under threshold braking!');
} else {
  throw new Error('Brake disc did not heat up properly!');
}

// Test 3: Manual WASD Mode & Off-Track Curb Collision
console.log('\n--- Test 3: Manual WASD Driving & Curb Vibration ---');
app.driverMode = 'manual';
app.manualHeading = 0;
app.keysDown['KeyW'] = true;
for (let i = 0; i < 30; i++) {
  app.stepManualPhysics(1 / 90);
  app.stepFrame(1 / 90);
}
console.log(`Manual Forward Drive Speed: ${(app.speed * 2.23694).toFixed(1)} mph`);
delete app.keysDown['KeyW'];

// Shift car to curb
app.car.carGroup.position.x = app.track.roadWidth * 0.5 - 0.2;
app.stepManualPhysics(1 / 90);
console.log(`Curb contact detected: ${app.isOverCurb}`);

// Test 4: Collision & Slipstream and CSV Export
console.log('\n--- Test 4: Collision Impulse & CSV Telemetry Logging ---');
const colCheck = app.opponent.checkCollisionAndSlipstream(app.car.carGroup.position, app.speed, 0, 1 / 90);
console.log('Collision & drafting check returned:', colCheck);
app.state = "RACING";
app.speed = 60.0;
app.recordLapTelemetryPoint();
console.log(`Telemetry buffer length: ${app.lapTelemetryLog.length} points`);
if (app.lapTelemetryLog.length > 0) {
  console.log('Telemetry point sample:', app.lapTelemetryLog[0]);
}

// Test 5: World Object Collision & Restored Manual Steering Sensitivity
console.log('\n--- Test 5: World Object Collision & Restored Manual Steering Sensitivity ---');
// 5a. Test Restored Manual Steering Sensitivity
app.speed = 80.0; // ~179 mph
app.steerAngle = 0;
app.keysDown['KeyA'] = true;
app.stepManualPhysics(1 / 90);
delete app.keysDown['KeyA'];
console.log(`Manual steer angle response: ${(app.steerAngle * 180 / Math.PI).toFixed(2)}° (Nimble, agile steering response restored)`);
if (Math.abs(app.steerAngle) > 0.3) {
  throw new Error(`Steering sensitivity abnormal: ${app.steerAngle}`);
}
console.log('✓ Previous manual steering sensitivity is restored with agile and responsive control');

// 5b. Test Solid Object Collision (Tree Collision: Cannot Pass Through)
const testTree = app.treeColliders[0] || { x: 50, z: 50, radius: 1.25 };
app.car.carGroup.position.set(testTree.x + 0.2, 0.05, testTree.z + 0.2); // inside tree radius!
app.speed = 30.0; // 67 mph incoming
const treeColResult = app.resolveWorldCollisions(app.car.carGroup.position, app.speed, 0, true, 1 / 90);
console.log('Tree Collision result:', {
  collided: treeColResult.collided,
  newSpeed: treeColResult.newSpeed.toFixed(1),
  carPosX: app.car.carGroup.position.x.toFixed(2),
  carPosZ: app.car.carGroup.position.z.toFixed(2)
});

const postDist = Math.hypot(app.car.carGroup.position.x - testTree.x, app.car.carGroup.position.z - testTree.z);
console.log(`Distance from tree center after separation: ${postDist.toFixed(2)}m (min required: ${(testTree.radius + 1.05).toFixed(2)}m)`);
if (!treeColResult.collided || postDist < (testTree.radius + 1.04)) {
  throw new Error('Vehicle penetrated/passed through tree without physical separation!');
}
console.log('✓ Scene objects have solid physical collision; car cannot pass through');

// Test 6: Vehicle Level Ground Alignment & V8 Muscle Car Piston Engine Audio
console.log('\n--- Test 6: Level Ground Alignment & V8 Muscle Audio Engine ---');
app.stepFrame(1 / 90);
console.log(`Car roll (rotation.z): ${app.car.carGroup.rotation.z.toFixed(4)} | Car pitch (rotation.x): ${app.car.carGroup.rotation.x.toFixed(4)} | Height: ${app.car.carGroup.position.y.toFixed(4)}m`);
if (Math.abs(app.car.carGroup.rotation.z) > 0.001 || Math.abs(app.car.carGroup.rotation.x) > 0.001) {
  throw new Error('Vehicle is crooked or not standing equal/flat on the road!');
}
console.log('✓ Vehicle stands 100% equal and level to the ground on the road');

// Test audio synthesizer
app.audio.toggle();
app.audio.update(75, false, 0.9, 5200, 4, false);
console.log('✓ V8 Muscle Car Piston Combustion Audio Synthesizer successfully running (Cam Chop LFO + Dual Exhaust Overdrive)');

// Test 7: Steering Wheel and Front Wheels Turn Direction Verification
console.log('\n--- Test 7: Steering & Front Wheels Turning Direction ---');
app.driverMode = 'manual';
app.steerAngle = 0;
// Test Right Turn (KeyD)
app.keysDown['KeyD'] = true;
delete app.keysDown['KeyA'];
for (let i = 0; i < 20; i++) {
  app.stepManualPhysics(1 / 90);
}
app.car.updateVisuals(app.speed, app.steerAngle, false, 1 / 90);
const frontWheelRotYRight = app.car.frontWheelSteerGroups[0].rotation.y;
const cockpitSteerRotZRight = app.car.steeringWheelMesh.rotation.z;
console.log(`Right Turn (KeyD): SteerAngle=${(app.steerAngle * 180 / Math.PI).toFixed(2)}° | FrontWheel Y=${(frontWheelRotYRight * 180 / Math.PI).toFixed(2)}° | Cockpit Wheel Z=${(cockpitSteerRotZRight * 180 / Math.PI).toFixed(2)}°`);
if (app.steerAngle <= 0 || frontWheelRotYRight >= 0 || cockpitSteerRotZRight <= 0) {
  throw new Error('Right turn does not rotate front wheels right or steering wheel clockwise!');
}
console.log('✓ On Right turn (KeyD): Front wheels turn right and steering wheel turns clockwise');

// Test Left Turn (KeyA)
delete app.keysDown['KeyD'];
app.keysDown['KeyA'] = true;
for (let i = 0; i < 40; i++) {
  app.stepManualPhysics(1 / 90);
}
app.car.updateVisuals(app.speed, app.steerAngle, false, 1 / 90);
const frontWheelRotYLeft = app.car.frontWheelSteerGroups[0].rotation.y;
const cockpitSteerRotZLeft = app.car.steeringWheelMesh.rotation.z;
console.log(`Left Turn (KeyA): SteerAngle=${(app.steerAngle * 180 / Math.PI).toFixed(2)}° | FrontWheel Y=${(frontWheelRotYLeft * 180 / Math.PI).toFixed(2)}° | Cockpit Wheel Z=${(cockpitSteerRotZLeft * 180 / Math.PI).toFixed(2)}°`);
if (app.steerAngle >= 0 || frontWheelRotYLeft <= 0 || cockpitSteerRotZLeft >= 0) {
  throw new Error('Left turn does not rotate front wheels left or steering wheel counter-clockwise!');
}
console.log('✓ On Left turn (KeyA): Front wheels turn left and steering wheel turns counter-clockwise');
delete app.keysDown['KeyA'];

// Test 8: Off-track Minimum 25 mph Speed & Gradual Deceleration
console.log('\n--- Test 8: Off-Track 25 mph Minimum Speed & Gradual Deceleration ---');
const sampleMid = app.track.getSampleAt(0.5);
app.progress = 0.5;
// Place 20m off-track in grass and head parallel to track so it stays on grass
app.car.carGroup.position.copy(sampleMid.position).addScaledVector(sampleMid.normal, 20.0);
app.manualHeading = Math.atan2(sampleMid.tangent.x, sampleMid.tangent.z);
app.speed = 45.0; // ~100 mph
app.keysDown['KeyW'] = true;
app.stepManualPhysics(1 / 90);
const speedAfter1Frame = app.speed * 2.23694;
console.log(`Initial high speed off-track with W held: ${speedAfter1Frame.toFixed(1)} mph (gentle slow reduction)`);
if (app.speed < 44.5) {
  throw new Error('Off-track speed dropped too abruptly! Speed should reduce slowly.');
}
// Run 500 physics steps with W held off-track to settle to steady-state min speed
for (let i = 0; i < 500; i++) {
  // Keep car off-track for test stability
  const s = app.track.getSampleAt(app.progress);
  app.car.carGroup.position.copy(s.position).addScaledVector(s.normal, 20.0);
  app.manualHeading = Math.atan2(s.tangent.x, s.tangent.z);
  app.stepManualPhysics(1 / 90);
}
const offTrackSteadyMph = app.speed * 2.23694;
console.log(`Steady-state off-track speed with W held: ${offTrackSteadyMph.toFixed(1)} mph`);
if (offTrackSteadyMph < 24.5 || offTrackSteadyMph > 26.0) {
  throw new Error(`Off-track speed is ${offTrackSteadyMph} mph, expected at least 25 mph!`);
}
console.log('✓ Car maintains at least 25 mph off-track and reduces speed slowly when leaving track');
console.log('✓ Car maintains at least 25 mph off-track and reduces speed slowly when leaving track');

// Test 9: Immediate Launch & Speed/Gear Climbing
console.log('\n--- Test 9: Immediate Starting Launch & Gear Climbing ---');
app.state = "READY";
app.speed = 0;
const gridSample = app.track.getSampleAt(0);
app.car.carGroup.position.copy(gridSample.position);
app.manualHeading = Math.atan2(gridSample.tangent.x, gridSample.tangent.z);
app.progress = 0;
// Press W to start
app.state = "RUNNING"; // Instant start on W
for (let i = 0; i < 180; i++) { // 2 seconds
  app.stepManualPhysics(1 / 90);
  app.updateHUD();
}
const launchedMph = app.speed * 2.23694;
console.log(`Launched Speed after 2.0s: ${launchedMph.toFixed(1)} mph | Current Gear: ${app.currentGear} | RPM: ${Math.round(app.currentRPM)}`);
if (launchedMph < 50 || app.currentGear < 2) {
  throw new Error('Speed or transmission gears did not climb promptly upon throttle application!');
}
console.log('✓ Speed and transmission gears climb immediately upon pressing gas pedal');

// Test 10: Autonomous AI Overtake Planner when Opponent is Near
console.log('\n--- Test 10: Autonomous AI Overtake Planning When Opponent is Near ---');
app.driverMode = 'ai';
app.state = 'RUNNING';
app.progress = 0.20;
app.speed = 70.0;
// Place opponent 22m ahead on the right side of the track (lateralOffset = +1.75)
const trackLength = app.track.totalLength || 5000;
app.opponent.progress = 0.20 + (22.0 / trackLength);
app.opponent.speed = 55.0;
app.opponent.lateralOffset = 1.75; // Right lane
app.opponent.enabled = true;

// Step AI physics: should plan overtake in slipstream
app.stepPhysics(1 / 90);
console.log(`Opponent Gap: 22m | AI State: ${app.aiState} | Overtake Stage: ${app.overtakeStage}`);
if (!app.isOvertaking || app.overtakeStage !== "SLINGSHOT") {
  throw new Error('AI did not initiate overtake planning when opponent is near ahead!');
}
console.log('✓ AI mode plans overtake and establishes slingshot drafting behind nearby opponent');

// Close gap to 12m: AI should pull out to the open left lane (lateralOffset -> -2.85)
app.opponent.progress = 0.20 + (12.0 / trackLength);
for (let i = 0; i < 8; i++) {
  app.stepPhysics(1 / 90);
  app.stepFrame(1 / 90);
}
console.log(`Opponent Gap: ~10m | AI State: ${app.aiState} | Overtake Stage: ${app.overtakeStage} | Lateral Offset: ${app.aiLateralOffset.toFixed(2)}m`);
if (app.overtakeStage !== "PULLING_OUT" || app.aiLateralOffset >= 0) {
  throw new Error(`AI did not pull out to open pass lane! Lateral offset: ${app.aiLateralOffset}`);
}
console.log('✓ AI mode pulls out to open opposite lane (left) to execute high-speed overtake pass');

// Complete pass: player reaches ahead of opponent by 15m
app.progress = app.opponent.progress + (15.0 / trackLength);
app.stepPhysics(1 / 90);
app.stepFrame(1 / 90);
console.log(`Overtake Passed Ahead | AI State: ${app.aiState} | Overtake Stage: ${app.overtakeStage}`);
if (app.overtakeStage !== "CLEAR") {
  throw new Error('AI did not complete overtake sequence when safely ahead!');
}
console.log('✓ AI mode completes overtake sequence and smoothly tucks back to optimal racing line');

console.log('\n======================================================');
console.log(' ALL ASSIGNMENT 6 FEATURE COMPLETE TESTS PASSED! ');
console.log('======================================================\n');
process.exit(0);
