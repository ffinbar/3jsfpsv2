import * as THREE from 'three'
import * as CANNON from 'cannon-es'


class M4 {
    constructor(player, scene, world, object, body, muzzle, fireFrom, flashObj, lhPos, fireSound, ricochetSound, decal, decalMat, meshMap, EVERYTHING_ELSE_GROUP, PLAYER_GROUP, listener) {
        this.scene = scene
        this.object = object
        this.player = player
        this.world = world
        this.body = body
        this.muzzle = muzzle
        this.muzzle.intensity = 0;
        this.fireFrom = fireFrom
        this.flashObj = flashObj
        this.flashObj.visible = false;
        this.lhPos = lhPos;
        this.adsConstraint = null;
        this.adsPosition = new THREE.Vector3(0.01, -0.24, -0.25);
        this.grabReset = new THREE.Vector3(0.1, -0.3, -0.3);
        this.grabPosition = new THREE.Vector3(0.1, -0.3, -0.3);
        this.body.parent = this;
        this.canFire = true;
        this.fireDelay = 0.2;
        this.recoilMult = 0.04;
        this.recoilMultDefault = 0.04;
        this.body.allowSleep = false;
        this.EVERYTHING_ELSE_GROUP = EVERYTHING_ELSE_GROUP;
        this.PLAYER_GROUP = PLAYER_GROUP;
        this.body.collisionFilterGroup = this.EVERYTHING_ELSE_GROUP;
        this.body.collisionFilterMask = this.PLAYER_GROUP | this.EVERYTHING_ELSE_GROUP;
        this.timeOut = false;
        this.fireSound = fireSound
        this.ricochetSound = ricochetSound;
        this.recoilValuePitch = 0;
        this.recoilValueYaw = 0;
        this.decal = decal;
        this.decalMat = decalMat;
        this.meshMap = meshMap;
        this.lhConstraint = null;

        this.listener = listener;
    }
    
    equip() {
        this.body.originalMass = this.body.mass;
        this.body.mass = 0
        this.body.collisionFilterGroup = this.PLAYER_GROUP;
        this.body.collisionFilterMask = this.EVERYTHING_ELSE_GROUP;

        this.player.equipped = this;
        this.player.anim.grabDest.position.copy(this.player.equipped.grabPosition);
        this.player.anim.grabDest.body.position.copy(this.player.anim.grabDest.getWorldPosition(new THREE.Vector3()))
        this.body.position.copy(this.player.anim.grabDest.getWorldPosition(new THREE.Vector3()));

        this.body.quaternion.copy(this.player.anim.grabDest.body.quaternion);

        let rotationQuaternion = new CANNON.Quaternion();
        rotationQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);

        this.body.quaternion = this.body.quaternion.mult(rotationQuaternion);

        let constraint = new CANNON.LockConstraint(this.player.anim.grabDest.body, this.body, { maxForce: 1 });
        this.world.addConstraint(constraint);
        this.player.equipped.constraint = constraint;

        let handConstraint = new CANNON.PointToPointConstraint(this.player.ragdollHand, new CANNON.Vec3(0, 0, 0), this.body, new CANNON.Vec3(0, 0, 0));

        this.player.handConstraint = handConstraint;
        this.player.ragdollHand.position.copy(this.body.position);
        
        this.world.addConstraint(handConstraint);

        this.lhConstraint = new CANNON.PointToPointConstraint(this.player.ragdollLeftHand, new CANNON.Vec3(0, 0, 0), this.body, new CANNON.Vec3(-0.4, 0, 0.05));
        this.player.ragdollLeftHand.position.copy(this.body.position);
        this.world.addConstraint(this.lhConstraint);

    }

    click() {
        if(this.canFire && !this.timeOut) {
            // console.log(player.result)
            if(this.player.result.hasHit) {

                let ray = this.player.result;
                let hitPointLocal = ray.hitPointWorld.vsub(ray.body.position)

                //draw a debugline at hitpoint world facing in the ray.hitNormalWorld direction
                // createDebugLine(ray.hitPointWorld, ray.hitPointWorld.vadd(ray.hitNormalWorld), 0xff0000, 1000);
                
                let parent = this.scene;
                
                let decalObj = this.decal(this.decalMat, 0.1, ray.hitPointWorld, ray.hitNormalWorld);

                // console.log(player.result.body)

                let ricochetSound = this.ricochetSound;
                
                

                if(this.player.result.body.mass != 0) {
                    
                    parent = ray.body.mesh ? ray.body.mesh : this.meshMap.get(ray.body);

                    // console.log(parent)

                    ricochetSound = parent.hitSound ? parent.hitSound : ricochetSound;

                    let localPosition = parent.worldToLocal(decalObj.position.clone());
                    decalObj.position.copy(localPosition);

                    let hitNormalWorldThree = new THREE.Vector3(ray.hitNormalWorld.x, ray.hitNormalWorld.y, ray.hitNormalWorld.z);
                    let localHitNormal = parent.worldToLocal(hitNormalWorldThree.clone().add(ray.hitPointWorld)).sub(localPosition);
                    decalObj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), localHitNormal);                            

                    ray.body.wakeUp()
                    // console.log(ray)

                    let directionVector = ray.body.position.vsub(ray.hitPointWorld);
                    let length = Math.sqrt(directionVector.x * directionVector.x + directionVector.y * directionVector.y + directionVector.z * directionVector.z);
                    let direction = new CANNON.Vec3(directionVector.x / length, directionVector.y / length, directionVector.z / length).scale(10);
                    // console.log(direction)

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

            let newFireSound = new THREE.PositionalAudio(this.listener);
            newFireSound.setBuffer(this.fireSound.buffer);
            newFireSound.setRefDistance(this.fireSound.getRefDistance());
            newFireSound.setVolume(0.5);
            let playbackRate = Math.random() * 0.2 + 0.9; // Random value between 0.9 and 1.1
            newFireSound.setPlaybackRate(playbackRate);

            this.fireFrom.add(newFireSound);
            newFireSound.play();

            //recoil
                
            this.body.applyLocalImpulse(new CANNON.Vec3(7, 0, 0), new CANNON.Vec3(0, 0, 0));

            

            //pitch is always positive
            this.recoilValuePitch = (Math.random() * 0.8 + 0.2) * this.recoilMult
            //yaw can be positive or negative
            this.recoilValueYaw = (((Math.random() - 0.5) * 2) * 0.5) * this.recoilMult * 0.7


            //rotate pitchobject and yawobject to simulate recoil
            this.player.pitchObject.rotation.x += this.recoilValuePitch;
            this.player.yawObject.rotation.y += this.recoilValueYaw;



            this.muzzle.intensity = 20;
            this.flashObj.visible = true;
            setTimeout(() => {
                this.flashObj.visible = false;
                this.muzzle.intensity = 0;
            }, 100);
            this.canFire = false;

            if(!this.canFire && !this.timeOut) {
                this.timeOut = true
                setTimeout(() => {
                    this.canFire = true;
                    this.timeOut = false;
                }, this.fireDelay * 1000);

            }
        }
    }

    rightClick() {
        this.player.equipped.grabPosition = this.adsPosition;
        if(this.adsConstraint == null) {
            
            this.adsConstraint = true;
            this.recoilMult = this.recoilMult / 2;
        }
            
    }

    unequip() {
        this.player.equipped.body.mass = this.player.equipped.body.originalMass;
        this.player.equipped.body.collisionResponse = true;
        this.player.equipped.body.collisionFilterGroup = this.EVERYTHING_ELSE_GROUP;
        this.player.equipped.body.collisionFilterMask = this.PLAYER_GROUP | this.EVERYTHING_ELSE_GROUP;
        
        this.player.anim.grabDest.position.copy(this.player.anim.grabDest.resetPosition);

        this.world.removeConstraint(this.player.handConstraint);
        this.world.removeConstraint(this.player.equipped.constraint);
        this.world.removeConstraint(this.lhConstraint);
        this.player.handConstraint = this.player.resetHandConstraint;

        this.player.equipped = null;
        
    }
}

export { M4 }