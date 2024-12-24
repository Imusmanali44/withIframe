import * as THREE from "three";

export class PreciousMetal {
  constructor(scene, modelManager,renderer) {
    this.scene = scene;
    // this.modelManager = modelManager;
    // this.volumeVisualization = new THREE.Group();
    // this.volumeVisualization.visible = true; // Initially hidden
    // this.scene.add(this.volumeVisualization);
    this.renderer = renderer
    renderer.localClippingEnabled = true;
    this.clippingPlanes = []; // Array to hold clipping planes
    this.isEnable = false
    this.currentVal = 0;
    // this.orignalColor = this.getCurrentColor(this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1])
  }


biColorOneRing(val) {
  this.removeHelperModelAndClipping(); // Ensure no duplicate models or clipping planes.
  this.isEnable = true
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

handlePair(ring1,ring2,val,triBool){
  this.currentVal = val;
  this.triBool = triBool
  let selectedModel = 0
 let offsetRing1 = 0.7
 let helperModelPosXring1 = -0.7
  if (val === "1:1") {
    // offsetRing1 += 0.05;
}
else  if (val === "1:2") {
  offsetRing1 += 0.05;
}
else if(val === "1:3"){
  offsetRing1 += 0.07
}


let offsetRing2 = -0.7
 let helperModelPosXring2 = 0.7
 let helperModelPosYring2 = -0.15
  if (val === "1:1") {
    // offsetRing2 -= 0.05;
  }
  else  if (val === "1:2") {
    offsetRing2 += 0.1;
  }
  else if(val === "1:3"){
    offsetRing2 += 0.07
    }
  
selectedModel = ring1

// this.removeHelperModelAndClipping(1); 
// offset = 0.7
helperModelPosXring1 = -0.7
let helperModelPosY = 0



  // Clone and add the helper model2w34
  this.helperModel = this.cloneModelWithUniqueMaterial(selectedModel);
  this.helperModel.position.set(helperModelPosXring1,helperModelPosY,0)
  this.scene.add(this.helperModel);
  this.applyColorToModel(this.helperModel, "#A09F9D");

  // Create clipping planes
  let clippingPlaneRing1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), offsetRing1);
  let clippingPlaneRing2 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offsetRing1);

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
  if(triBool==true){
  //  selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];
  let modelColor = this.getCurrentColor(selectedModel)
  this.helperModeltriRing1 = this.cloneModelWithUniqueMaterial(selectedModel);
  // this.applyColorToModel(this.helperModel,"#"+modelColor)
  this.helperModeltriRing1.position.set(helperModelPosXring1,0,0)

  // this.applyColorToModel(this.helperModeltriRing1,"#B76E79")

  this.applyColorToModel(selectedModel, "#cd9d52")
  this.applyColorToModel(this.helperModeltriRing1,"#A09F9D")
  this.applyColorToModel(this.helperModel, "#cd9d52")

  this.scene.add(this.helperModeltriRing1);
  const clippingPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -0.6);

  const clippingPlane1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.8);

  this.helperModeltriRing1.traverse((child) => {
    if (child.isMesh) {
      child.material.clippingPlanes = [clippingPlane,clippingPlane1];
      child.material.clipShadows = true; // Enable shadow clipping if needed
      child.material.needsUpdate = true;
    }
  });
}

selectedModel = ring2
  
helperModelPosXring2 = 0.7
 helperModelPosY = -0.15

 // Clone and add the helper model
 this.helperModelring2 = this.cloneModelWithUniqueMaterial(selectedModel);
 this.helperModelring2.position.set(helperModelPosXring2,helperModelPosY,0)
 this.scene.add(this.helperModelring2);


 
 this.applyColorToModel(this.helperModelring2, "#A09F9D");

 // Create clipping planes
  clippingPlaneRing1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), offsetRing2);
  clippingPlaneRing2 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offsetRing2);

 // Apply clipping planes to the materials
 selectedModel.traverse((child) => {
     if (child.isMesh) {
         child.material.clippingPlanes = [clippingPlaneRing1];
         child.material.clipShadows = true;
         child.material.needsUpdate = true;
     }
 });

 this.helperModelring2.traverse((child) => {
     if (child.isMesh) {
         child.material.clippingPlanes = [clippingPlaneRing2];
         child.material.clipShadows = true;
         child.material.needsUpdate = true;
     }
 });
 if(triBool==true){
 let modelColor = this.getCurrentColor(selectedModel)
 this.helperModeltriRing2 = this.cloneModelWithUniqueMaterial(selectedModel);
 // this.applyColorToModel(this.helperModel,"#"+modelColor)
 this.helperModeltriRing2.position.set(helperModelPosXring2,helperModelPosY,0)

 this.applyColorToModel(this.helperModeltriRing2,"#B76E79")


 this.applyColorToModel(selectedModel, "#cd9d52")
  this.applyColorToModel(this.helperModeltriRing2,"#A09F9D")
  this.applyColorToModel(this.helperModelring2, "#cd9d52")
 this.scene.add(this.helperModeltriRing2);
 const clippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -0.6);

 const clippingPlane1 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.8);

 this.helperModeltriRing2.traverse((child) => {
   if (child.isMesh) {
     child.material.clippingPlanes = [clippingPlane,clippingPlane1];
     child.material.clipShadows = true; // Enable shadow clipping if needed
     child.material.needsUpdate = true;
   }
 });
}

}

biTriPair(val,triBool=false) {          
  this.isEnable = true

  // this.removeHelperModelAndClipping(); // Ensure no duplicate models or clipping planes.
  let selectedModel;
  let offset = 0; // 0 for 1:1, 0.1 for 1:3|
  let helperModelPosX = 0.7 
  let helperModelPosY = 0
  

  const ring1 = this.modelManager.currentDisplayedModels[0];
  const ring2 = this.modelManager.currentDisplayedModels[1];
  if(this.modelManager.selectedModel==1){

 
    selectedModel = ring1
    offset = 0.7
    helperModelPosX = -0.7
    if (val === "1:1") {
      // offset += 0.05;
  }
  else  if (val === "1:2") {
      offset += 0.05;
  }
  else if(val === "1:3"){
      offset += 0.07
  }
  
}
else{
  selectedModel = ring2;
  offset = -0.7
  helperModelPosX = 0.7
  helperModelPosY = -0.15
  if (val === "1:1") {
    // offset -= 0.05;
  }
  else  if (val === "1:2") {
    offset += 0.1;
  }
  else if(val === "1:3"){
      offset += 0.07
    }
  }
  console.log("ring1", val,offset)
  

  if (!selectedModel) {
      console.error("No selected model found.");
      return;
  }
 
  if(this.modelManager.pair1==true){
    this.removeHelperModelAndClipping(1); 
    this.removeHelperModelAndClipping(2); 


    this.handlePair(ring1, ring2, val,triBool)
    return;
  }

  if (selectedModel == ring1) {
    this.removeHelperModelAndClipping(1); 
    // offset = 0.7
    helperModelPosX = -0.7
  let helperModelPosY = 0



      // Clone and add the helper model2w34
      this.helperModel = this.cloneModelWithUniqueMaterial(selectedModel);
      this.helperModel.position.set(helperModelPosX,helperModelPosY,0)
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
      if(triBool==true){
      //  selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];
      let modelColor = this.getCurrentColor(selectedModel)
      this.helperModeltriRing1 = this.cloneModelWithUniqueMaterial(selectedModel);
      // this.applyColorToModel(this.helperModel,"#"+modelColor)
      this.helperModeltriRing1.position.set(helperModelPosX,0,0)

      this.applyColorToModel(this.helperModeltriRing1,"#B76E79")
  
      this.scene.add(this.helperModeltriRing1);
      const clippingPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -0.6);
  
      const clippingPlane1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.8);
  
      this.helperModeltriRing1.traverse((child) => {
        if (child.isMesh) {
          child.material.clippingPlanes = [clippingPlane,clippingPlane1];
          child.material.clipShadows = true; // Enable shadow clipping if needed
          child.material.needsUpdate = true;
        }
      });
    }
     // First model on the left

      console.log("aaaa 1")


}
else if(selectedModel == ring2){
  this.removeHelperModelAndClipping(2); 

  console.log("aaaa 2")

  // offset = -0.7
  helperModelPosX = 0.7
let helperModelPosY = -0.15

    // Clone and add the helper model
    this.helperModelring2 = this.cloneModelWithUniqueMaterial(selectedModel);
    this.helperModelring2.position.set(helperModelPosX,helperModelPosY,0)
    this.scene.add(this.helperModelring2);
    this.applyColorToModel(this.helperModelring2, "#A09F9D");

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

    this.helperModelring2.traverse((child) => {
        if (child.isMesh) {
            child.material.clippingPlanes = [clippingPlaneRing2];
            child.material.clipShadows = true;
            child.material.needsUpdate = true;
        }
    });
    if(triBool==true){
    let modelColor = this.getCurrentColor(selectedModel)
    this.helperModeltriRing2 = this.cloneModelWithUniqueMaterial(selectedModel);
    // this.applyColorToModel(this.helperModel,"#"+modelColor)
    this.helperModeltriRing2.position.set(helperModelPosX,helperModelPosY,0)

    this.applyColorToModel(this.helperModeltriRing2,"#B76E79")

    this.scene.add(this.helperModeltriRing2);
    const clippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -0.6);

    const clippingPlane1 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.8);

    this.helperModeltriRing2.traverse((child) => {
      if (child.isMesh) {
        child.material.clippingPlanes = [clippingPlane,clippingPlane1];
        child.material.clipShadows = true; // Enable shadow clipping if needed
        child.material.needsUpdate = true;
      }
    });
  }
}
    
      console.log("Clipping plane applied to the selected model and helper model.");
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
  if(this.modelManager.selectedModel==1){
  this.applyColorToModel(this.helperModel,colorCode)
}
else if(this.modelManager.selectedModel==2){
  this.applyColorToModel(this.helperModelring2,colorCode)

}
}
else if(modelSide==2){
  this.applyColorToModel(selectedModel,colorCode)
}
else if(modelSide==3){
  if(this.helperModeltri){
  this.applyColorToModel(this.helperModeltri,colorCode)}
  if(this.helperModeltriRing1 && this.modelManager.selectedModel == 1 ){
    this.applyColorToModel(this.helperModeltriRing1,colorCode)
  }
  if(this.helperModeltriRing2 && this.modelManager.selectedModel == 2){
    this.applyColorToModel(this.helperModeltriRing2,colorCode)
  }
}




  }

colorChangeTri(colorCode, modelSide){

console.log("tatti",colorCode)


}

  removeHelperModelAndClipping(ringindex = 1) {
    // Check if the helper model exists
    let myModel;
    if (ringindex == 1){
       myModel = this.helperModel
    }
    else if(ringindex == 2){
      myModel = this.helperModelring2

    }
    if (myModel) {
      // Traverse the helper model and dispose of materials and geometry
      myModel.traverse((child) => {
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
      this.scene.remove(myModel);
      myModel = null;
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

    if (this.helperModeltriRing1 && this.modelManager.selectedModel == 1) {
      // Traverse the helper model and dispose of materials and geometry
      this.helperModeltriRing1.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.dispose();
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        }
      });
      this.scene.remove(this.helperModeltriRing1);
      this.helperModeltriRing1 = null;
    }
    if (this.helperModeltriRing2 && this.modelManager.selectedModel == 2) {
      // Traverse the helper model and dispose of materials and geometry
      this.helperModeltriRing2.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.dispose();
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        }
      });
      this.scene.remove(this.helperModeltriRing2);
      this.helperModeltriRing2 = null;
    }
    if(this.modelManager.pair1){
      console.log("aaaaaaaaaaaaaaaaaaaaaa")
      if(this.helperModeltriRing1){
      this.helperModeltriRing1.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.dispose();
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        }
      });
      this.scene.remove(this.helperModeltriRing1);
      this.helperModeltriRing1 = null;
    }
    if(this.helperModeltriRing2){
      this.helperModeltriRing2.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.dispose();
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        }
      });
      this.scene.remove(this.helperModeltriRing2);
      this.helperModeltriRing2 = null;
    }
    }



    // Remove clipping planes from the selected model
    const ring1 = this.modelManager.currentDisplayedModels[0];
    const ring2 = this.modelManager.currentDisplayedModels[1];
    let selectedModel = 0
    console.log("ring1", ring1, ring2,this.modelManager.currentDisplayedModels,this.modelManager.selectedModel)
    if(this.modelManager.selectedModel==1){
      selectedModel = ring1
      
    }
    else{
      selectedModel = ring2;
      // offset = -0.7
    
    }


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
