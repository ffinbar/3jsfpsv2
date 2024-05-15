import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from './node_modules/three/examples/jsm/exporters/GLTFExporter.js';
import { ConvexMeshDecomposition } from "./node_modules/vhacd-js/lib/vhacd.js";



loader.load('models/box.glb', function (gltf) {

    const options = {
        maxHulls: 32,
        voxelResolution: 10,
        // minVolumePercentError: 0.001,
        // maxRecursionDepth: 20,
        maxVerticesPerHull: 64,
        // minEdgeLength: 0.0,
        // shrinkWrap: 0.0,
        // findBestPlane: false,
        fillMode: "flood",
        messages: "all",
    }
    
    const exporter = new GLTFExporter();

    gltf.scene.traverse(function (child) {
        if (child.isMesh) {
            let collisionType = child.userData.collisionType;
            switch (collisionType) {
                case 'box':
                    console.log('box');
                    break;
                case 'convex':
                    console.log('convex');
                    break;
                case 'concave':
                    console.log('concave');
                    if(child.userData.collisionHulls) {
                        console.log('node has collision hulls, skipping');
                    } else {
                        const mesh = {
                            positions: child.geometry.attributes.position.array,
                            indices: child.geometry.index.array,
                        };
                        ConvexMeshDecomposition.create().then((decomposition) => {
                            const hulls = decomposition.computeConvexHulls(mesh, options);
                            for (let i = 0; i < hulls.length; i++) {
                                const hull = hulls[i];
                                const geometry = new THREE.BufferGeometry();
                                geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(hull.positions), 3));
                                geometry.setIndex(hull.indices);
                                const convexMesh = new THREE.Mesh(geometry, child.material);
                                convexMesh.userData.collisionType = 'convex';
                                convexMesh.userData.collisionHulls = true;
                                convexMesh.position.copy(child.position);
                                convexMesh.quaternion.copy(child.quaternion);
                                convexMesh.scale.copy(child.scale);
                                child.add(convexMesh);
                            }
                        });
                    }
                break;
                default:
                    console.log('mesh ' + child.name + ' has no collision type.');
                break;


            }
        }
    });

    exporter.parse(gltf.scene, function (result) {
        console.log(result);
    }, {
        binary: true,
        trs: false,
        onlyVisible: true,
        truncateDrawRange: true,
        embedImages: true,
        animations: [],
        forceIndices: false,
        forcePowerOfTwoTextures: false,
    });

    //download result as glb
    const blob = new Blob([result], { type: 'model/gltf-binary' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = url;
    link.download = 'model.glb';
    link.click();
    URL.revokeObjectURL(url);


});
