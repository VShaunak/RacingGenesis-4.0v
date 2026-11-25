import { Vector3 } from "./three.module.js";

const MPH_TO_MS = 1 / 2.23694;
const G_ACCEL = 9.81;

const GUIDANCE_COLORS = ["#70ded6", "#f8ce7c", "#ff8475"];

function prepareCanvas(canvas, ctx, width, height, ratio) {
  const pixelWidth = Math.round(width * ratio);
  const pixelHeight = Math.round(height * ratio);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
}

// Advisory braking guidance for the map, independent of the race AI.
function buildGuidance(track, grip) {
  const n = track.sampleCount;
  const maxSpeed = 228 * MPH_TO_MS;
  const speeds = new Float32Array(n);
  const curvature = new Float32Array(n);
  // Sample the actual offset path, including the intervals between road samples.
  for (let i = 0; i < n; i++) {
    curvature[i] = Math.max(track.getPathCurvature(i / n), track.getPathCurvature((i + 0.5) / n));
  }
  for (let i = 0; i < n; i++) {
    const k = Math.max(curvature[(i - 1 + n) % n], curvature[i], curvature[(i + 1) % n]);
    let low = 0, high = maxSpeed;
    for (let iteration = 0; iteration < 24; iteration++) {
      const v = (low + high) / 2;
      const available = Math.min(54, grip * G_ACCEL * (1 + Math.min(4.4, (v / 26) ** 2 * 0.52)));
      if (v * v * k <= available * 0.90) low = v;
      else high = v;
    }
    speeds[i] = low;
  }
  // Backward braking envelope across the closed lap, with a conservative
  // deceleration budget that leaves room for steering and acceleration ramping.
  const cornerSpeeds = speeds.slice();
  const ds = track.totalLength / n;
  for (let pass = 0; pass < 2; pass++) {
    for (let i = n - 1; i >= 0; i--) {
      speeds[i] = Math.min(speeds[i], Math.sqrt(speeds[(i + 1) % n] ** 2 + 2 * 24 * ds));
    }
  }
  return Uint8Array.from(speeds, (speed, i) => {
    if (speed < cornerSpeeds[i] - 2) return 2;
    return cornerSpeeds[i] < maxSpeed * 0.9 ? 1 : 0;
  });
}

export class TrackOverview {
  constructor(routeCanvas, legend) {
    this.routeCanvas = routeCanvas;
    this.legend = legend;
    this.projected = new Vector3();
    this.points = [];
    this.routeFrame = [];
    this.guidanceSource = [];
  }

  draw(track, cameraManager) {
    const { camera, mode, orbitPhi, orbitTheta, orbitDistance, orbitFitDistance } = cameraManager;
    const showRoute = mode === "map" && !track.editHandlesVisible
      && orbitPhi >= Math.PI / 3 && orbitDistance >= orbitFitDistance * 0.6;
    this.routeCanvas.hidden = this.legend.hidden = !showRoute;
    if (!showRoute) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    camera.updateMatrixWorld();
    this.routeCtx ??= this.routeCanvas.getContext("2d");
    const grip = track.app?.tireGrip ?? 1.10;
    const guidanceSource = [track.samples, track.activePathOffsets, grip];
    if (guidanceSource.some((value, i) => value !== this.guidanceSource[i])) {
      this.guidance = buildGuidance(track, grip);
      this.guidanceSource = guidanceSource;
    }
    const frame = [track.samples, this.guidance, width, height, ratio, orbitPhi, orbitTheta, orbitDistance];
    if (this.routeCtx && frame.some((value, i) => value !== this.routeFrame[i])) {
      this.drawRoute(track, camera, width, height, ratio);
      this.routeFrame = frame;
    }
  }

  drawRoute(track, camera, width, height, ratio) {
    const ctx = this.routeCtx;
    prepareCanvas(this.routeCanvas, ctx, width, height, ratio);
    ctx.fillStyle = "rgba(7, 21, 30, 0.24)";
    ctx.fillRect(0, 0, width, height);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const count = track.samples.length;
    this.points.length = count * 2;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const p = this.projected.copy(track.samples[i].position).project(camera);
      const x = (1 + p.x) * width / 2;
      const y = (1 - p.y) * height / 2;
      this.points[2 * i] = x;
      this.points[2 * i + 1] = y;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    for (const [size, color] of [[24, "#0b1c26a6"], [18, "#526d75"], [14, "#c1d2d1"], [11, "#182633"]]) {
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.stroke();
    }

    // Group each continuous stretch so the guidance dashes follow the circuit.
    for (let category = 0; category < GUIDANCE_COLORS.length; category++) {
      ctx.beginPath();
      let drawing = false;
      for (let i = 0; i < count; i++) {
        if (this.guidance[i] !== category) {
          drawing = false;
          continue;
        }
        const next = (i + 1) % count;
        if (!drawing) ctx.moveTo(this.points[2 * i], this.points[2 * i + 1]);
        ctx.lineTo(this.points[2 * next], this.points[2 * next + 1]);
        drawing = true;
      }
      ctx.strokeStyle = GUIDANCE_COLORS[category];
      ctx.lineWidth = category === 2 ? 3 : 2;
      ctx.setLineDash(category === 0 ? [5, 4] : []);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    const [startX, startY] = this.points;
    const angle = Math.atan2(this.points[3] - startY, this.points[2] - startX);
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(angle);
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 2; col++) {
        ctx.fillStyle = (row + col) % 2 ? "#111923" : "#f3f6f8";
        ctx.fillRect(col * 3 - 3, row * 3 - 9, 3, 3);
      }
    }
    ctx.restore();
  }
}
