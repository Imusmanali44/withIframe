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
    // console.log( )
  }
  triGroovePair(){
  this.modelManager.midMeshTri =   this.modelManager.midMesh.clone()
  this.modelManager.midMeshTri.position.x = -0.7;

  this.modelManager.midMeshTri2 =   this.modelManager.midMesh2.clone()
  this.modelManager.midMeshTri2.position.x = 0.7;

  this.modelManager.midMesh.position.x = -0.65
  this.modelManager.midMeshTri.position.x = -0.75

  this.modelManager.midMesh2.position.x = 0.65
  this.modelManager.midMeshTri2.position.x = 0.75

  this.scene.add(this.modelManager.midMeshTri)
  this.scene.add(this.modelManager.midMeshTri2)




  }
  removeMidMeshes() {
    // Helper function to dispose and remove objects
    const disposeAndRemove = (mesh) => {
        if (!mesh) return;

        console.log("Removing mesh:", mesh);

        // Remove from scene
        this.scene.remove(mesh);

        // Dispose of geometry and materials
        mesh.traverse((child) => {
            if (child.isMesh) {
                if(child.name=""){
                    console.log("name AAAAAAA", child)
                }
                child.geometry.dispose();
                if (child.material) {
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

        // Hide and clear reference
        mesh.visible = false;
        return null;
    };

    // Remove midMesh objects
    this.modelManager.midMesh = disposeAndRemove(this.modelManager.midMesh);
    this.modelManager.midMesh2 = disposeAndRemove(this.modelManager.midMesh2);
    this.modelManager.midMeshTri = disposeAndRemove(this.modelManager.midMeshTri);
    this.modelManager.midMeshTri2 = disposeAndRemove(this.modelManager.midMeshTri2);

    // Remove any remaining midMeshes by traversing the scene
    let objectsToRemove = [];
    this.scene.traverse((child) => {
        // console.log("razi 333", child.userData);
        if (child.userData === "midMeshRing1" || child.userData === "midMeshRing2") {
            console.log("Removing from traverse:", child);
            objectsToRemove.push(child);
            if(child.name==''){
                console.log("name", child)
                objectsToRemove.push(child);
            }
        }
    });

    // Remove collected objects from the scene
    objectsToRemove.forEach((obj) => {
        if (obj.parent) {
            obj.parent.remove(obj);
        } else {
            this.scene.remove(obj);
        }
    });

    console.log("Mid meshes removed from scene and set to null.", this.scene);
}



getScaleForModel(modelId,type) {
  let scale = { x: 37, y: 115, z: 115 }; // Default scale values

  switch (modelId) {
    case "P1":
    case "P4":
    case "P6":
    case "P9":
    case "P11":
      scale = { x: 37, y: 111, z: 111 };
      break;
    case "P7":
    case "P15":
      scale = { x: 37, y: 109, z: 109 };
      break;
    case "P8":
      scale = { x: 37, y: 106, z: 106 };
      break;
    case "P12":
    case "P13":
    case "P14":
      scale = { x: 37, y: 112, z: 112 };
      break;
    default:
      console.log("Using default scale for modelId:", modelId);
      break;
  }
  if (type=="U-groove"){
   scale.x =  scale.x * 1.6
  }
  if (type=="Corner joint"){
    scale.x =  scale.x * 2.1
   }
  console.log("scale chk", scale)
  return scale;
}



}
