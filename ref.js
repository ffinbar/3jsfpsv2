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






// if(player.actions) {
                //     switch (isGrabbing) {
                //         case true:
                //             if(player.actions['grab_add'].getEffectiveWeight() < 1) {
                //                 player.actions['grab_add'].setEffectiveWeight(player.actions['grab_add'].getEffectiveWeight() + 0.02);
                //             }
                //             break;
                //         case false:
                //             if(player.actions['grab_add'].getEffectiveWeight() > 0) {
                //                 player.actions['grab_add'].setEffectiveWeight(player.actions['grab_add'].getEffectiveWeight() - 0.01);
                //             }
                //             break;

                //     }

                //     if(controls) {
                //         if(controls.moveForward || controls.moveBackward || controls.moveLeft || controls.moveRight) {
                //             if(player.actions['walk'].getEffectiveWeight() < 1) {
                //                 player.actions['walk'].setEffectiveWeight(player.actions['walk'].getEffectiveWeight() + 0.02);
                //             }
                //         } else {
                //             if(player.actions['walk'].getEffectiveWeight() > 0) {
                //                 player.actions['walk'].setEffectiveWeight(player.actions['walk'].getEffectiveWeight() - 0.01);
                //             }
                //         }

                        
                //         if(playerBody.velocity.y > 1) {

                //             player.actions['jump'].isRunning() ? null : player.actions['jump'].reset().play();
                //             player.actions['jump'].clampWhenFinished = true;
                //             if(player.actions['jump'].getEffectiveWeight() < 1) {
                //                 player.actions['jump'].setEffectiveWeight(player.actions['jump'].getEffectiveWeight() + 0.1);
                //             } 
                //         } else {
                //             if(player.actions['jump'].getEffectiveWeight() > 0) {
                //                 player.actions['jump'].setEffectiveWeight(player.actions['jump'].getEffectiveWeight() - 0.01);
                //             }
                //         }
                        
                //         if(playerBody.velocity.y <= -1) {
                //             if(player.actions['fall'].getEffectiveWeight() < 1) {
                //                 player.actions['fall'].setEffectiveWeight(player.actions['fall'].getEffectiveWeight() + 0.01);
                //             } 
                //         } else {
                //             if(player.actions['fall'].getEffectiveWeight() > 0) {
                //                 player.actions['fall'].setEffectiveWeight(player.actions['fall'].getEffectiveWeight() - 0.01);
                //             }
                //         }                    
                    
                //     }
                // }