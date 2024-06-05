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







                //gun
            
            let coltScene = await loadGLTF('assets/colt_1911.glb', 1)
            scene.add(coltScene.scene)
            console.log(coltScene)
            colt.object = coltScene.scene.children[0];
            colt.object.receiveShadow = true;
            colt.object.castShadow = true;
            colt.fireFrom = colt.object.children[0];
            colt.flashObj = colt.object.children[1];
            colt.muzzle = colt.object.children[2];
            colt.muzzle.intensity = 0;
            colt.muzzle.castShadow = true;
            colt.flashObj.visible = false;
            colt.flashObj.backface = true;
            
            
            for (let [body, mesh] of meshMap.entries()) {
                if (mesh === colt.object) {
                    colt.body = body;
                    break;
                }
            }
            colt.body.allowSleep = false;
            colt.body.collisionFilterGroup = EVERYTHING_ELSE_GROUP;
            colt.body.collisionFilterMask = PLAYER_GROUP | EVERYTHING_ELSE_GROUP;

            window.addEventListener('click', () => {
                console.log('loaded sound')
                colt.fireSound = new THREE.PositionalAudio( listener );
                audioLoader.load( 'assets/sound/colt_fire.mp3', function( buffer ) {
                    
                    colt.fireSound.setBuffer( buffer );
                    colt.fireSound.setRefDistance( 20 );
                    // colt.fireSound.loop = true

                    // colt.fireSound.play()
                    colt.fireFrom.add( colt.fireSound );
                });
                colt.ricochetSound = new THREE.PositionalAudio( listener );
                audioLoader.load( 'assets/sound/ricochet2.mp3', function( buffer ) {
                    
                    colt.ricochetSound.setBuffer( buffer );
                    colt.ricochetSound.setRefDistance( 5 );
                    colt.ricochetSound.setVolume(0.5)
                    // colt.ricochetSound.play()
                    scene.add(colt.ricochetSound);
                });
            
            }, { once: true });

            

            colt.grabReset = new THREE.Vector3(0.2, -0.2, -0.4);
            colt.adsPosition = new THREE.Vector3(0, -0.125, -0.4);
            colt.grabPosition = colt.grabReset;

            colt.adsConstraint = null;

            colt.equip = function() {
                colt.body.originalMass = colt.body.mass;

                // colt.body.collisionResponse = false;
                colt.body.mass = 0
                colt.body.collisionFilterGroup = PLAYER_GROUP;
                colt.body.collisionFilterMask = EVERYTHING_ELSE_GROUP;

                player.equipped = colt;
                // player.equipped.euler = new THREE.Euler(0, -Math.PI/2, 0);
                player.anim.grabDest.position.copy(player.equipped.grabPosition);
                player.anim.grabDest.body.position.copy(player.anim.grabDest.getWorldPosition(new THREE.Vector3()))

                colt.body.position.copy(player.anim.grabDest.getWorldPosition(new THREE.Vector3()));
                // colt.body.position.vadd(new CANNON.Vec3(0, -0.2, -0.1), colt.body.position);
                // colt.body.quaternion.copy(player.anim.grabDest.getWorldQuaternion(new THREE.Quaternion()));

                colt.body.quaternion.copy(player.anim.grabDest.body.quaternion);
                // colt.body.quaternion.setFromEuler(0, -Math.PI/2, 0);
                let rotationQuaternion = new CANNON.Quaternion();
                rotationQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);

                // Multiply the colt body's quaternion by the rotation quaternion
                colt.body.quaternion = colt.body.quaternion.mult(rotationQuaternion);

                let constraint = new CANNON.LockConstraint(player.anim.grabDest.body, colt.body, { maxForce: 1 });
                world.addConstraint(constraint);
                player.equipped.constraint = constraint;

                let handConstraint = new CANNON.PointToPointConstraint(player.ragdollHand, new CANNON.Vec3(0, 0, 0), colt.body, new CANNON.Vec3(0, 0, 0));

                player.handConstraint = handConstraint;
                // player.ragdollHand.mass = 0;
                player.ragdollHand.position.copy(colt.body.position);
                
                world.addConstraint(handConstraint);

                // world.addConstraint(grabConstraint)

            }

            colt.body.parent = colt

            colt.canFire = true;
            colt.fireDelay = 0.5;
            colt.recoilMult = 0.02;
            colt.recoilMultDefault = 0.02;

            colt.click = function() {
                if(colt.canFire && !colt.timeOut) {
                    console.log(player.result)
                    if(player.result.hasHit) {
                        let ray = player.result;
                        let hitPointLocal = ray.hitPointWorld.vsub(ray.body.position)

                        //draw a debugline at hitpoint world facing in the ray.hitNormalWorld direction
                        // createDebugLine(ray.hitPointWorld, ray.hitPointWorld.vadd(ray.hitNormalWorld), 0xff0000, 1000);
                        
                        let parent = scene;
                        
                        let decalObj = decal(decalMat, 0.1, ray.hitPointWorld, ray.hitNormalWorld);

                        // console.log(player.result.body)

                        let ricochetSound = colt.ricochetSound;
                        
                        

                        if(player.result.body.mass != 0) {
                            
                            parent = ray.body.mesh ? ray.body.mesh : meshMap.get(ray.body);

                            // console.log(parent)

                            ricochetSound = parent.hitSound ? parent.hitSound : ricochetSound;

                            let localPosition = parent.worldToLocal(decalObj.position.clone());
                            decalObj.position.copy(localPosition);

                            let hitNormalWorldThree = new THREE.Vector3(ray.hitNormalWorld.x, ray.hitNormalWorld.y, ray.hitNormalWorld.z);
                            let localHitNormal = parent.worldToLocal(hitNormalWorldThree.clone().add(ray.hitPointWorld)).sub(localPosition);
                            decalObj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), localHitNormal);                            

                            ray.body.wakeUp()
                            console.log(ray)

                            let directionVector = ray.body.position.vsub(ray.hitPointWorld);
                            let length = Math.sqrt(directionVector.x * directionVector.x + directionVector.y * directionVector.y + directionVector.z * directionVector.z);
                            let direction = new CANNON.Vec3(directionVector.x / length, directionVector.y / length, directionVector.z / length).scale(10);
                            console.log(direction)

                            ray.body.applyImpulse(direction, hitPointLocal)  

                        }
                        parent.add(decalObj);
                        
                        // console.log(ricochetSound)

                        ricochetSound.position.set(ray.hitPointWorld.x, ray.hitPointWorld.y, ray.hitPointWorld.z);
                        ricochetSound.setPlaybackRate(Math.random() * 0.2 + 0.9);
                        ricochetSound.stop();
                        ricochetSound.play();

                        setTimeout(() => {
                            parent.remove(decalObj);
                        }, 5000);

                    }

                    // console.log(colt.fireSound)
                    colt.fireSound.stop();
                    // console.log(colt.object.getWorldPosition(new THREE.Vector3()))
                    // colt.fireSound.position.set(colt.object.getWorldPosition(new THREE.Vector3()).x, colt.object.getWorldPosition(new THREE.Vector3()).y, colt.object.getWorldPosition(new THREE.Vector3()).z);
                    let playbackRate = Math.random() * 0.2 + 0.9; // Random value between 0.9 and 1.1
                    colt.fireSound.setPlaybackRate(playbackRate);

                    colt.fireSound.play();

                    //recoil
                        
                    colt.body.applyLocalImpulse(new CANNON.Vec3(7, 0, 0), new CANNON.Vec3(0, 0, 0));

                    

                    //pitch is always positive
                    colt.recoilValuePitch = (Math.random() * 0.8 + 0.2) * colt.recoilMult
                    //yaw can be positive or negative
                    colt.recoilValueYaw = (((Math.random() - 0.5) * 2) * 0.5) * colt.recoilMult


                    //rotate pitchobject and yawobject to simulate recoil
                    player.pitchObject.rotation.x += colt.recoilValuePitch;
                    player.yawObject.rotation.y += colt.recoilValueYaw;



                    colt.muzzle.intensity = 20;
                    colt.flashObj.visible = true;
                    setTimeout(() => {
                    colt.flashObj.visible = false;
                    colt.muzzle.intensity = 0;
                    }, 100);
                    colt.canFire = false;

                    if(!colt.canFire && !colt.timeOut) {
                    colt.timeOut = true
                    setTimeout(() => {
                        colt.canFire = true;
                        colt.timeOut = false;
                    }, colt.fireDelay * 1000);

                    }
                }
                
              
                
                
            }

            colt.rightClick = function() {
                player.equipped.grabPosition = player.equipped.adsPosition;

                if(colt.adsConstraint == null) {
                    let lhConstraint = new CANNON.PointToPointConstraint(player.ragdollLeftHand, new CANNON.Vec3(0, 0, 0), colt.body, new CANNON.Vec3(0, 0, 0));
                    player.ragdollLeftHand.position.copy(colt.body.position);
                    world.addConstraint(lhConstraint);
                    colt.adsConstraint = lhConstraint;
                    colt.recoilMult = colt.recoilMult / 2;
                }
                
            }

            console.log(colt)