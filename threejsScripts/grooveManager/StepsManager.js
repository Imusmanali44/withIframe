import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
export class StepsManager {
  constructor(scene,modelManager,grooveManager) {
    this.scene = scene;
    // Initialize the camera variable
   
    // this.loadMidMesh();
    this.modelManager = modelManager
    this.grooveManager = grooveManager
    // console.log( )
  }

  async addLeftStep(milgrainBool) {

    
    const models = this.modelManager.currentDisplayedModels;
    
    // Check if any current model doesn't support steps
    const unsupportedModels = ["P7", "P8", "P15"];
    for (const model of models) {
        if (unsupportedModels.includes(model.userData.modelId)) {
            alert("This ring does not support Steps");
            return;
        }
    }

    const getScaleValues = (modelIndex) => {
        const scaleGroup1 = [0, 3, 5, 8, 11, 12, 13]; // P1, P4, P6, P9, P12, P13, P14
        const scaleGroup2 = [1, 4]; // P2, P5
        const scaleGroup3 = [2, 9]; // P3, P10
    
        // New scale values adjusted for base scale of ~1
        if (scaleGroup1.includes(modelIndex)) {
            return { scaleY: -0.04, scaleZ: -0.04, positionOffset: 0 };
        } else if (scaleGroup2.includes(modelIndex)) {
            return { scaleY: -0.045, scaleZ: -0.045, positionOffset: 0 };
        } else if (scaleGroup3.includes(modelIndex)) {
            return { scaleY: -0.047, scaleZ: -0.047, positionOffset: -0.002 };
        }
        return { scaleY: -0.04, scaleZ: -0.04, positionOffset: 0 };
    };

    // Function to create and position a step
    const createStep = async (isFirstModel, position) => {
        await this.modelManager.loadMidMesh("Milgrain", false);
       
        const midMesh = isFirstModel ? this.modelManager.midMesh : this.modelManager.midMesh2;
        const step = this.modelManager.cloneModelWithUniqueMaterial(midMesh);
        if(milgrainBool)  {
            this.modelManager.GrooveManagerIns.toggleMilgrainGroove(step,milgrainBool)

        }
        else{
            this.modelManager.GrooveManagerIns.toggleMilgrainGroove(step,false)

        }
        console.log(" bugg Initial scale:", step.scale);
// console.log("Scale modifications:", scaleY, scaleZ);
const modelIndex = isFirstModel ? 
models[0].userData.modelIndex : 
models[1].userData.modelIndex;

const { scaleY, scaleZ, positionOffset } = getScaleValues(modelIndex);

        step.userData = isFirstModel ? "leftStepRing1" : "leftStepRing2";
        step.position.x = position + positionOffset;
        step.scale.y *= (1 + scaleY);
        step.scale.z *= (1 + scaleZ);
        
        console.log("bug Final scale:", step.scale);
        return step;
    };

    // Handle single model case
    if (!this.modelManager.pair1) {
        const step = await createStep(
            this.modelManager.selectedModel === 1,
            this.modelManager.selectedModel === 1 ? -0.865 : 0.565
        );
        // this.grooveManager.removeMidMeshes();
        this.scene.add(step);
        if (this.modelManager.selectedModel === 1) {
            this.leftStep = step;
        } else {
            this.leftStep2 = step;
        }
        return;
    }

    // Handle paired models case
    const step1 = await createStep(true, -0.865);
    const step2 = await createStep(false, 0.565);
    
    this.leftStep = step1;
    this.leftStep2 = step2;
    
    // this.grooveManager.removeMidMeshes();
    this.scene.add(step1);
    this.scene.add(step2);
}

async addRightStep(milgrainBool) {
    const models = this.modelManager.currentDisplayedModels;
    
    // Check if any current model doesn't support steps
    const unsupportedModels = ["P7", "P8", "P15"];
    for (const model of models) {
        if (unsupportedModels.includes(model.userData.modelId)) {
            alert("This ring does not support Steps");
            return;
        }
    }

    // Helper function to get scale values based on model index
    const getScaleValues = (modelIndex) => {
        const scaleGroup1 = [0, 3, 5, 8, 11, 12, 13]; // P1, P4, P6, P9, P12, P13, P14
        const scaleGroup2 = [1, 4]; // P2, P5
        const scaleGroup3 = [2, 9]; // P3, P10

        if (scaleGroup1.includes(modelIndex)) {
            return { scaleY: -0.04, scaleZ: -0.04, positionOffset: 0 };
        } else if (scaleGroup2.includes(modelIndex)) {
            return { scaleY: -0.045, scaleZ: -0.045, positionOffset: 0 };
        } else if (scaleGroup3.includes(modelIndex)) {
            return { scaleY: -0.047, scaleZ: -0.047, positionOffset: 0.016 };
        }
        return { scaleY: -0.04, scaleZ: -0.04, positionOffset: 0 };
    };

    // Function to create and position a step
    const createStep = async (isFirstModel, position) => {
        await this.modelManager.loadMidMesh("Milgrain", false);
        const midMesh = isFirstModel ? this.modelManager.midMesh : this.modelManager.midMesh2;
        const step = this.modelManager.cloneModelWithUniqueMaterial(midMesh);
        if(milgrainBool)  {
            this.modelManager.GrooveManagerIns.toggleMilgrainGroove(step,milgrainBool)

        }
        else{
            this.modelManager.GrooveManagerIns.toggleMilgrainGroove(step,false)

        }
        const modelIndex = isFirstModel ? 
            models[0].userData.modelIndex : 
            models[1].userData.modelIndex;
        
        const { scaleY, scaleZ, positionOffset } = getScaleValues(modelIndex);
        
        step.userData = isFirstModel ? "rightStepRing1" : "rightStepRing2";
        step.position.x = position + positionOffset;
        
        // Multiply the scale instead of adding
        step.scale.y *= (1 + scaleY);
        step.scale.z *= (1 + scaleZ);
        
        // Add debug logs if needed
        console.log("Right Step Initial scale:", { ...step.scale });
        console.log("Right Step Scale modifications:", { scaleY, scaleZ });
        console.log("Right Step Final scale:", { ...step.scale });
        
        return step;
    };

    // Handle single model case
    if (!this.modelManager.pair1) {
        const step = await createStep(
            this.modelManager.selectedModel === 1,
            this.modelManager.selectedModel === 1 ? -0.52 : 0.85
        );
        // this.grooveManager.removeMidMeshes();
        this.scene.add(step);
        if (this.modelManager.selectedModel === 1) {
            this.rightStep = step;
        } else {
            this.rightStep2 = step;
        }
        return;
    }

    // Handle paired models case
    const step1 = await createStep(true, -0.52);
    const step2 = await createStep(false, 0.85);
    
    this.rightStep = step1;
    this.rightStep2 = step2;
    
    // this.grooveManager.removeMidMeshes();
    this.scene.add(step1);
    this.scene.add(step2);
}
removeLeftSteps() {
  // Helper function to dispose and remove objects
  const disposeAndRemove = (mesh) => {
      if (!mesh) return;

      console.log("Removing left step mesh:", mesh);

      // Remove from scene
      this.scene.remove(mesh);

      // Dispose of geometry and materials
      mesh.traverse((child) => {
          if (child.isMesh) {
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

  // Remove left step mesh objects
  this.leftStep = disposeAndRemove(this.leftStep);
  this.leftStep2 = disposeAndRemove(this.leftStep2);

  // Remove any remaining left step meshes by traversing the scene
  let objectsToRemove = [];
  this.scene.traverse((child) => {
      if (
          child.userData === "leftStepRing1" || 
          child.userData === "leftStepRing2"
      ) {
          console.log("Removing left step from traverse:", child);
          objectsToRemove.push(child);
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

  console.log("Left step meshes removed from scene and set to null.", this.scene);
}

removeRightSteps() {
  // Helper function to dispose and remove objects
  const disposeAndRemove = (mesh) => {
      if (!mesh) return;

      console.log("Removing right step mesh:", mesh);

      // Remove from scene
      this.scene.remove(mesh);

      // Dispose of geometry and materials
      mesh.traverse((child) => {
          if (child.isMesh) {
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

  // Remove right step mesh objects
  this.rightStep = disposeAndRemove(this.rightStep);
  this.rightStep2 = disposeAndRemove(this.rightStep2);

  // Remove any remaining right step meshes by traversing the scene
  let objectsToRemove = [];
  this.scene.traverse((child) => {
      if (
          child.userData === "rightStepRing1" || 
          child.userData === "rightStepRing2"
      ) {
          console.log("Removing right step from traverse:", child);
          objectsToRemove.push(child);
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

  console.log("Right step meshes removed from scene and set to null.", this.scene);
}
}