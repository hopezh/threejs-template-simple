import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// [+] Var
var ToRad = Math.PI / 180;

// [+] Canvas
const canvas = document.querySelector("canvas.webgl");

// [+] Scene
const scene = new THREE.Scene();

// [+] Window size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// [+] Camera
// [-] base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.01,
  1000
);
// [-] cam position
camera.position.x = 1.0;
camera.position.y = 0.8;
camera.position.z = 1.5;
scene.add(camera);

// [+] Lights
// [-] ambient light
scene.add(new THREE.AmbientLight(0x555555));

// [+] Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// [+] Gradient background
// [-] gradient geom
var buffgeoBack = new THREE.IcosahedronGeometry(100, 5);
// [-] gradient mesh
var back = new THREE.Mesh(
  buffgeoBack,
  new THREE.MeshBasicMaterial({
    map: gradTexture([
      [1.0, 0.75, 0.5, 0.25],
      ["#1B1D1E", "#3D4143", "#72797D", "#b0babf"],
    ]),
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  })
);

// [-] rotate background if needed
// back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(15 * ToRad));

// [-] gradient texture
function gradTexture(color) {
  var c = document.createElement("canvas");
  var ct = c.getContext("2d");
  var size = 1024;
  c.width = 16;
  c.height = size;
  var gradient = ct.createLinearGradient(0, 0, 0, size);
  var i = color[0].length;
  while (i--) {
    gradient.addColorStop(color[0][i], color[1][i]);
  }
  ct.fillStyle = gradient;
  ct.fillRect(0, 0, 16, size);
  var texture = new THREE.Texture(c);
  texture.needsUpdate = true;
  return texture;
}
scene.add(back);

// [+] Helper
// [-] grid helper
const gridSize = 10;
const gridDivisions = 10;
const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
scene.add(gridHelper);

// [-] axes helper
scene.add(new THREE.AxesHelper(1));

// [+] Geometry
// [-] geom
const cubeGeom = new THREE.BoxGeometry(0.6, 0.4, 0.2);
// [-] mat
const cubeMat = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  opacity: 0.5,
  transparent: true,
  wireframe: false,
});
// [-] mesh
const cube = new THREE.Mesh(cubeGeom, cubeMat);
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

// [+] Window event listener
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
