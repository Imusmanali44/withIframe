import * as THREE from "three";

export class PreciousMetal {
  constructor(scene, modelManager,renderer) {
    this.scene = scene;
    this.modelManager = modelManager;
    // this.volumeVisualization = new THREE.Group();
    // this.volumeVisualization.visible = true; // Initially hidden
    // this.scene.add(this.volumeVisualization);
    this.renderer = renderer
    renderer.localClippingEnabled = true;
    this.clippingPlanes = []; // Array to hold clipping planes

    this.orignalColor = this.getCurrentColor(this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1])
  }

//   biColorOneRing(val) {
//     this.removeHelperModelAndClipping(); // Ensure no duplicate models or clipping planes.

//     let offset = 0; // 0 for 1:1, 0.1 for 1:3
//     if (val === "1:1") offset = 0;
//     else if (val === "1:2") offset = 0.05;
//     else if (val === "1:3") offset = 0.1;

//     const selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];

//     if (!selectedModel) {
//         console.error("No selected model found.");
//         return;
//     }

//     if (this.modelManager.currentDisplayedModels.length === 1) {
//         // Clone and add the helper model
//         this.helperModel = this.cloneModelWithUniqueMaterial(selectedModel);
//         this.scene.add(this.helperModel);
//         this.applyColorToModel(this.helperModel, "#A09F9D");

//         // Create clipping planes
//         const clippingPlaneRing1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), offset);
//         const clippingPlaneRing2 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offset);

    

//         // Apply clipping planes to the materials
//         selectedModel.traverse((child) => {
//             if (child.isMesh) {
//                 child.material.clippingPlanes = [clippingPlaneRing1];
//                 child.material.clipShadows = true;
//                 child.material.needsUpdate = true;
//             }
//         });

//         this.helperModel.traverse((child) => {
//             if (child.isMesh) {
//                 child.material.clippingPlanes = [clippingPlaneRing2];
//                 child.material.clipShadows = true;
//                 child.material.needsUpdate = true;
//             }
//         });

//         console.log("Clipping plane applied to the selected model and helper model.");
//     }
// }
biColorOneRing(val) {
  this.removeHelperModelAndClipping(); // Ensure no duplicate models or clipping planes.

  let offset = 0; // 0 for 1:1, 0.1 for 1:3
  if (val === "1:1") offset = 0;
  else if (val === "1:2") offset = 0.05;
  else if (val === "1:3") offset = 0.1;

  const selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];

  if (!selectedModel) {
      console.error("No selected model found.");
      return;
  }

  if (this.modelManager.currentDisplayedModels.length === 1) {
      // Clone and add the helper model
      this.helperModel = this.cloneModelWithUniqueMaterial(selectedModel);
      this.scene.add(this.helperModel);
      this.applyColorToModel(this.helperModel, "#A09F9D");

      // Create clipping planes
      const clippingPlaneRing1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), offset);
      const clippingPlaneRing2 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offset);

      // Apply clipping planes to the materials
      selectedModel.traverse((child) => {
          if (child.isMesh) {
              child.material.clippingPlanes = [clippingPlaneRing1];
              child.material.clipShadows = true;
              child.material.needsUpdate = true;
          }
      });

      this.helperModel.traverse((child) => {
          if (child.isMesh) {
              child.material.clippingPlanes = [clippingPlaneRing2];
              child.material.clipShadows = true;
              child.material.needsUpdate = true;
          }
      });
     // First model on the left
    //  selectedModel.position.set(-0.7, 0, 0); // First model on the left
    //  this.helperModel.position.set(-0.7, 0, 0); // First model on the left
    //  clippingPlaneRing1.constant = -0.7
    //  clippingPlaneRing2.constant = -0.7
      this.getClippingPlanePosition(clippingPlaneRing1)
      console.log("Clipping plane applied to the selected model and helper model.");
  }
}
biColorPair(val) {
  this.removeHelperModelAndClipping(); // Ensure no duplicate models or clipping planes.

  let offset = 0; // 0 for 1:1, 0.1 for 1:3
  if (val === "1:1") offset = 0;
  else if (val === "1:2") offset = 0.05;
  else if (val === "1:3") offset = 0.1;

  const selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];

  if (!selectedModel) {
      console.error("No selected model found.");
      return;
  }

  if (this.modelManager.currentDisplayedModels.length === 2) {
      // Clone and add the helper model
      this.helperModel = this.cloneModelWithUniqueMaterial(selectedModel);
      this.scene.add(this.helperModel);
      this.applyColorToModel(this.helperModel, "#A09F9D");

      // Create clipping planes
      const clippingPlaneRing1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), offset);
      const clippingPlaneRing2 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offset);

      // Apply clipping planes to the materials
      selectedModel.traverse((child) => {
          if (child.isMesh) {
              child.material.clippingPlanes = [clippingPlaneRing1];
              child.material.clipShadows = true;
              child.material.needsUpdate = true;
          }
      });

      this.helperModel.traverse((child) => {
          if (child.isMesh) {
              child.material.clippingPlanes = [clippingPlaneRing2];
              child.material.clipShadows = true;
              child.material.needsUpdate = true;
          }
      });
     // First model on the left

    
      console.log("Clipping plane applied to the selected model and helper model.");
  }
}



  getClippingPlanePosition(plane) {
    if (!plane || !(plane instanceof THREE.Plane)) {
      console.error("Invalid clipping plane.");
      return null;
    }
    // Calculate the position of the plane using its normal and constant
    const position = plane.normal.clone().multiplyScalar(plane.constant);
    console.log("aaa",position)
  
    return position;
  }
  
  getModelPosition(model) {
    if (!model) {
      console.error("No model provided.");
      return null;
    }
  
    // Ensure the position is updated based on the world matrix
    model.updateMatrixWorld(true);
  
    // Get the position from the world matrix
    const position = new THREE.Vector3();
    position.setFromMatrixPosition(model.matrixWorld);
  
    return position;
  }
  

  triColorOneRing(val) {
    this.removeHelperModelAndClipping()
    this.biColorOneRing(val);
    let offset = 0.1
    if (val === "1:1") {
      offset = 0.05;
  }
  else  if (val === "1:2") {
      offset = 0.07;
  }
  else if(val === "1:3"){
      offset = 0.1
  }
    const selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];
    let modelColor = this.getCurrentColor(selectedModel)
    this.helperModeltri = this.cloneModelWithUniqueMaterial(selectedModel);
    this.applyColorToModel(this.helperModel,"#"+modelColor)
    this.applyColorToModel(this.helperModeltri,"#A09F9D")

    this.scene.add(this.helperModeltri);
    const clippingPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), offset);

    const clippingPlane1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), offset);

    this.helperModeltri.traverse((child) => {
      if (child.isMesh) {
        child.material.clippingPlanes = [clippingPlane,clippingPlane1];
        child.material.clipShadows = true; // Enable shadow clipping if needed
        child.material.needsUpdate = true;
      }
    });
    console.log("hello tri",modelColor);
   
  }
  colorChangeBi(colorCode, modelSide){

    if(colorCode == "#E9D4A4"){
      colorCode = "#cd9d52"
    }
    const selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];
if(modelSide==1){

  this.applyColorToModel(this.helperModel,colorCode)
}
else if(modelSide==2){
  this.applyColorToModel(selectedModel,colorCode)
}
else if(modelSide==3){
  this.applyColorToModel(this.helperModeltri,colorCode)

}




  }

colorChangeTri(colorCode, modelSide){

console.log("tatti",colorCode)


}

  removeHelperModelAndClipping() {
    // Check if the helper model exists
    if (this.helperModel) {
      // Traverse the helper model and dispose of materials and geometry
      this.helperModel.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.dispose();
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        }
      });
  
      // Remove the helper model from the scene
      this.scene.remove(this.helperModel);
      this.helperModel = null;
      console.log("Helper model removed.");
    } else {
      console.warn("No helper model to remove.");
    }
    if (this.helperModeltri) {
      // Traverse the helper model and dispose of materials and geometry
      this.helperModeltri.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.dispose();
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        }
      });
  
      // Remove the helper model from the scene
      this.scene.remove(this.helperModeltri);
      this.helperModeltri = null;
      console.log("Helper model removed tri.");
    } else {
      console.warn("No helper model to remove.");
    }
    // Remove clipping planes from the selected model
    const selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];
    if (selectedModel) {
      selectedModel.traverse((child) => {
        if (child.isMesh) {
          child.material.clippingPlanes = []; // Remove clipping planes
          child.material.needsUpdate = true;
        }
      });
      console.log("Clipping planes removed from the selected model.");
    } else {
      console.warn("No selected model found to remove clipping planes from.");
    }
  
    // Clear the clipping planes array
    this.clippingPlanes = [];
    console.log("All clipping planes cleared.");
  }
  
  cloneModelWithUniqueMaterial(originalModel) {
    const clone = originalModel.clone(); // Clone the model
  
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone(); // Clone the material
        child.material.clippingPlanes = []; // Ensure no clipping planes are applied
        child.material.needsUpdate = true;
      }
    });
  
    return clone;
  }
   getCurrentColor(modelOrMaterial) {
    if (modelOrMaterial instanceof THREE.Material) {
      // Check if the material has a color property
      if (modelOrMaterial.color) {
        return modelOrMaterial.color.getHexString(); // Return color as a hex string
      } else {
        console.warn("Material does not have a color property.");
        return null;
      }
    }
  
    if (modelOrMaterial instanceof THREE.Object3D) {
      // Traverse the model to find the first mesh with a color
      let foundColor = null;
      modelOrMaterial.traverse((child) => {
        if (child.isMesh && child.material && child.material.color) {
          foundColor = child.material.color.getHexString(); // Get the first color found
        }
      });
  
      if (foundColor) {
        console.log("found color", foundColor)
        return foundColor; // Return the found color as a hex string
      } else {
        console.warn("No material with a color property found in the model.");
        return null;
      }
    }
  
    console.warn("Input is not a Material or Object3D.");
    return null;
  }
  
  // Example Usage

  
  applyColorToModel(model, color) {
    model.traverse((child) => {
      if (child.isMesh) {
        const material = child.material;
  
        // Check if the material supports color
        if (material && material.color) {
          material.color.set(color); // Automatically handles #fff, #ffffff, or named colors
          material.needsUpdate = true; // Ensure material updates
        }
      }
    });
  
    console.log(`Color ${color} applied to the model.`);}
}
