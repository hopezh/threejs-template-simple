import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// [+] Base
// [-] canvas
const canvas = document.querySelector("canvas.webgl");

// [-] scene
const scene = new THREE.Scene();

// [-] size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// [-] window event listener
window.addEventListener("resize", () => {
  // [.] update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // [.] update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // [.] update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// [+] Camera
// [-] base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
scene.add(camera);

// [-] controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// [+] Geometry
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
scene.add(cube);

// [+] Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// [+] Animate
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  // [.] update controls
  controls.update();

  // [.] render
  renderer.render(scene, camera);

  // [.] call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
