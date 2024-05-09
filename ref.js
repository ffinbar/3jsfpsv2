sphereBody.allowSleep = true;

sphereBody.sleepSpeedLimit = 0.1; // Body will feel sleepy if speed<1 (speed == norm of velocity)
sphereBody.sleepTimeLimit = 1; // Body falls asleep after 1s of sleepiness

sphereBody.addEventListener("sleepy", (event) => {
  console.log("The sphere is feeling sleepy...");
});

sphereBody.addEventListener("sleep", (event) => {
  console.log("The sphere fell asleep!");
});

// trimesh

// How to make a mesh with a single triangle
const vertices = [
  0,
  0,
  0, // vertex 0
  1,
  0,
  0, // vertex 1
  0,
  1,
  0, // vertex 2
];
const indices = [
  0,
  1,
  2, // triangle 0
];
const trimeshShape = new CANNON.Trimesh(vertices, indices);
const trimeshBody = new CANNON.Body({
  mass: 3, // kg
  shape: trimeshShape,
});
trimeshBody.position.set(0, 0, 0); // m
world.addBody(trimeshBody);

const triangleGeometry = new THREE.BufferGeometry();
const triverts = new Float32Array([
  0,
  0,
  0, // vertex 0
  1,
  0,
  0, // vertex 1
  0,
  1,
  0, // vertex 2
]);
triangleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(triverts, 3)
);

const triangleMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
});
const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);

scene.add(triangleMesh);

// trigger

const boxShape = new CANNON.Box(new CANNON.Vec3(2, 2, 5));
const triggerBody = new CANNON.Body({ isTrigger: true });
triggerBody.addShape(boxShape);
triggerBody.position.set(0, 0, 0);
world.addBody(triggerBody);

// It is possible to run code on the exit/enter
// of the trigger.
triggerBody.addEventListener("collide", (event) => {
  if (event.body === sphereBody) {
    console.log("The sphere entered the trigger!", event);
  }
});
