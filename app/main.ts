import { Camera } from '../core/Camera';
import { Renderer } from '../core/Renderer';
import { Scene } from '../core/Scene';
import { NFXLoader, NFXFile } from '../loader/NFXLoader';

const canvas = document.getElementById('nfx-canvas') as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error('Canvas #nfx-canvas não encontrado.');
}

const scene = new Scene();
const camera = new Camera();
camera.position.set(0, 1.4, 5);

const renderer = new Renderer(canvas, scene, camera);
const loader = new NFXLoader(renderer.gl);

const sampleNfx: NFXFile = {
  format: 'nfx' as const,
  version: 1,
  objects: [
    {
      id: 'ground',
      mesh: {
        vertices: [
          [-2, 0, -2],
          [2, 0, -2],
          [2, 0, 2],
          [-2, 0, 2],
        ],
        faces: [[0, 1, 2, 3]],
      },
      transform: {
        position: [0, -1, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      color: [0.22, 0.28, 0.24],
    },
    {
      id: 'poly-prism',
      mesh: {
        vertices: [
          [0, 1, 0],
          [-0.8, 0.2, 0.8],
          [0.8, 0.2, 0.8],
          [1.0, 0.2, -0.3],
          [0, 0.2, -1.1],
          [-1.0, 0.2, -0.3],
          [-0.6, -0.9, 0.7],
          [0.6, -0.9, 0.7],
          [0.7, -0.9, -0.4],
          [0, -0.9, -0.9],
          [-0.7, -0.9, -0.4],
        ],
        faces: [
          [0, 1, 2],
          [0, 2, 3],
          [0, 3, 4],
          [0, 4, 5],
          [0, 5, 1],
          [1, 2, 7, 6],
          [2, 3, 8, 7],
          [3, 4, 9, 8],
          [4, 5, 10, 9],
          [5, 1, 6, 10],
          [6, 7, 8, 9, 10],
        ],
      },
      transform: {
        position: [0, 0.4, 0],
        rotation: [0, 0, 0],
        scale: [1.2, 1.2, 1.2],
      },
      color: [0.35, 0.62, 0.95],
    },
  ],
};

for (const mesh of loader.parse(sampleNfx)) {
  renderer.add(mesh);
}

const orbit = {
  yaw: 0,
  pitch: -0.15,
  distance: 6,
};

let isDragging = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', (evt) => {
  isDragging = true;
  lastX = evt.clientX;
  lastY = evt.clientY;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

window.addEventListener('mousemove', (evt) => {
  if (!isDragging) return;

  const dx = evt.clientX - lastX;
  const dy = evt.clientY - lastY;
  lastX = evt.clientX;
  lastY = evt.clientY;

  orbit.yaw -= dx * 0.005;
  orbit.pitch -= dy * 0.005;
  orbit.pitch = Math.max(-1.2, Math.min(1.2, orbit.pitch));
});

canvas.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  orbit.distance += evt.deltaY * 0.01;
  orbit.distance = Math.max(2, Math.min(16, orbit.distance));
}, { passive: false });

window.addEventListener('keydown', (evt) => {
  if (evt.key.toLowerCase() === 'f') {
    renderer.wireframe = !renderer.wireframe;
  }
  if (evt.key.toLowerCase() === 'l') {
    renderer.lightingEnabled = !renderer.lightingEnabled;
  }
});

renderer.onBeforeRender((dt) => {
  const target = scene.getAll().find((m) => m.id === 'poly-prism');
  if (target) {
    target.rotation.y += dt * 0.7;
  }

  const cp = Math.cos(orbit.pitch);
  camera.position.set(
    Math.sin(orbit.yaw) * cp * orbit.distance,
    Math.sin(orbit.pitch) * orbit.distance + 0.2,
    Math.cos(orbit.yaw) * cp * orbit.distance,
  );

  camera.rotation.y = orbit.yaw + Math.PI;
  camera.rotation.x = -orbit.pitch;
});

renderer.start();
