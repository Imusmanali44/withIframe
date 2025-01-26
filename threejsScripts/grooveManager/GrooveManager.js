import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
export class GrooveManager {
  constructor(scene,modelManager) {
    this.scene = scene;
    // Initialize the camera variable
    this.midMesh = null
    this.loader = new GLTFLoader();
    // this.loadMidMesh();
    this.modelManager = modelManager
    console.log( )
  }

  removeMidMeshes() {
    if (this.modelManager.midMesh) {
      this.scene.remove(this.modelManager.midMesh); // Remove midMesh from the scene
      this.modelManager.midMesh.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose(); // Dispose of geometry
          if (child.material) {
            // Dispose of all material maps
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => {
                for (const key in material) {
                  if (material[key] && material[key].isTexture) {
                    material[key].dispose();
                  }
                }
                material.dispose();
              });
            } else {
              for (const key in child.material) {
                if (child.material[key] && child.material[key].isTexture) {
                  child.material[key].dispose();
                }
              }
              child.material.dispose();
            }
          }
        }
      });
      this.modelManager.midMesh = null; // Set midMesh to null
    }
  
    if (this.modelManager.midMesh2) {
      this.scene.remove(this.modelManager.midMesh2); // Remove midMesh2 from the scene
      this.modelManager.midMesh2.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose(); // Dispose of geometry
          if (child.material) {
            // Dispose of all material maps
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => {
                for (const key in material) {
                  if (material[key] && material[key].isTexture) {
                    material[key].dispose();
                  }
                }
                material.dispose();
              });
            } else {
              for (const key in child.material) {
                if (child.material[key] && child.material[key].isTexture) {
                  child.material[key].dispose();
                }
              }
              child.material.dispose();
            }
          }
        }
      });
      this.modelManager.midMesh2 = null; // Set midMesh2 to null
    }
  
    console.log("Mid meshes removed from scene and set to null.");
  }


loadMidMesh(){

    this.loader.load('models/midMesh/Mid.glb', (gltf) => {
        this.midMesh = gltf.scene;
        this.midMesh.scale.set(40, 115, 115);
        
        this.midMesh.traverse((child) => {
          if (child.isMesh && child.material) {
            const originalMaterial = child.material;
            child.material = new THREE.MeshStandardMaterial({
              color: '#D8BC7E',
              metalness: 0.7,
              roughness:  0.1,
              map: originalMaterial.map,
              normalMap: originalMaterial.normalMap,
              metalnessMap: originalMaterial.metalnessMap,
              roughnessMap: originalMaterial.roughnessMap,
              emissiveMap: originalMaterial.emissiveMap,
              emissive: originalMaterial.emissive,
              stencilWrite: true,
              stencilRef: 0,
              stencilFunc: THREE.NotEqualStencilFunc,
              stencilFail: THREE.KeepStencilOp,
              stencilZFail: THREE.KeepStencilOp,
              stencilZPass: THREE.KeepStencilOp,
              depthWrite: true,  // Enable depth writing
              polygonOffset: true,  // Enable polygon offset
              polygonOffsetFactor: -1,  // Initial offset factor
              polygonOffsetUnits: -1    // Initial offset units
            });
          }
        })
    this.scene.add(this.midMesh)
    // this.midMesh.position.x = -0.7
    });

}

}
