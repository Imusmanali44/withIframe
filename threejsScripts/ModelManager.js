import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ModelManager {
  constructor(scene) {
    this.scene = scene;
    this.models = [];
    this.currentDisplayedModels = [];
    this.currentModelIndex = 0;
    this.selectedModel = 1
    this.loader = new GLTFLoader();
  }

  // Load all models based on the provided modelData
  loadModels(modelData) {
    modelData.forEach((data, index) => {
      this.loader.load(data.glbPath, (gltf) => {
        const model = gltf.scene;
        this.models.push(model);

        model.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#FEEB75'),
              metalness: 0.8,
              roughness: 0,
              emissive: new THREE.Color(0x111111),
              emissiveIntensity: 0.5,
            });
            child.castShadow = true;
          }
        });

        model.scale.set(100, 100, 100);
        model.visible = false;
        this.scene.add(model);
        this.switchModel(0, 1,true,false);
      });
    });
  }

  changeRingWidth(selectedRingId, width, isPair = true) {
    const widthValue = parseFloat(width.replace(',', '.')); // Parse width from string to number
    if (isNaN(widthValue)) {
      console.warn('Invalid width value:', width);
      return;
    }

    const model = this.currentDisplayedModels[selectedRingId-1];
    if (!model) {
      console.warn('Model not found for selectedRingId:', selectedRingId);
      return;
    }

    // Set the width of the selected ring
    model.scale.setX(widthValue * 15); // Multiply by 10 to convert to model scale

    // If isPair is true, apply the same width to the second ring
    // if (isPair && this.currentDisplayedModels.length > 1) {
    //   const secondRing = this.currentDisplayedModels[1]; // Assuming the second ring is at index 1
    //   secondRing.scale.setX(widthValue * 10); // Apply the same width to the second ring
    // }

    console.log(`Ring ${selectedRingId} width changed to: ${widthValue}mm`);
  }

  // Existing methods (loadModels, switchModel, etc.) will remain unchanged...

  
  currentSelectedRing(id){
    console.log("id is ", id)
    this.selectedModel = id
  }

  // Switch to a new pair of models based on the current index
//   switchModel(index, selectedRingId = 1) {
//     if (index < 0 || index >= this.models.length) {
//       console.warn('Invalid model index:', index);
//       return;
//     }

//     // Determine which ring is currently selected for switching
//     if (selectedRingId === 1 || selectedRingId === 2) {
//         this.currentModelIndex = index;
//         this.showCurrentModels(index);
//     } else if (selectedRingId === 3 && this.currentDisplayedModels[2]) {
//         this.currentModelIndex = index;
//         this.showThirdModel(index);  // Add showThirdModel method
//     } else if (selectedRingId === 4 && this.currentDisplayedModels[3]) {
//         this.currentModelIndex = index;
//         this.showFourthModel(index);  // Add showFourthModel method
//     } else {
//         console.warn("Invalid ring selection for model switching.");
//     }
// }

switchModel(index, selectedRingId = 1, pair1 = false, pair2 = false) {
  if (index < 0 || index >= this.models.length) {
    console.warn('Invalid model index:', index);
    return;
  }
  console.log("what is happening 1")

  // Handle pairing logic
  if (pair1 && !pair2 && selectedRingId==1 || selectedRingId==2) {
  console.log("what is happening 2")

    // Change both 1st and 2nd rings
    this.showCurrentModels(index,pair1); // For 1st and 2nd rings
  } else if (pair2) {
  console.log("what is happening 3")

    // Change both 3rd and 4th rings
    this.showThirdModel(index,pair2);  // For 3rd ring
    this.showFourthModel(index,pair2); // For 4th ring
  } else {
    // Only change the selected ring
    console.log("what is happening 6")
    if (selectedRingId === 1 || selectedRingId === 2) {
      this.currentModelIndex = index;
      this.showCurrentModels(index);
    } else if (selectedRingId === 3 && this.currentDisplayedModels[2]) {
      this.currentModelIndex = index;
      console.log("what is happening 7",index)

      this.showThirdModel(index);
    } else if (selectedRingId === 4 && this.currentDisplayedModels[3]) {
      this.currentModelIndex = index;
      this.showFourthModel(index);
    } else {
      console.warn("Invalid ring selection for model switching.");
    }
  }
}

showThirdModel(index, pair2 = false) {
  const model = this.models[index].clone();
  const model3 = this.models[index].clone();
  const model4 = this.models[index].clone();
  console.log("hello ????",this.currentDisplayedModels[3] )

  // If pairing for 3rd and 4th models is active
  if (pair2) {
    console.log("hello pair",this.currentDisplayedModels[3] )

    this.scene.remove(this.currentDisplayedModels[2]);
    this.scene.remove(this.currentDisplayedModels[3]);

    model3.position.set(1.0, 0, 0); // Position the third model
    model4.position.set(1.5, 0, 0); // Position the fourth model
    model4.scale.set(85, 85, 85); // Scale down the fourth model

    this.scene.add(model3);
    this.scene.add(model4);
    model3.visible = true;
    model4.visible = true;
    this.currentDisplayedModels[2] = model3;
    this.currentDisplayedModels[3] = model4;
  } else {
    // Only switch the third model if no pair is active
    if(!this.currentDisplayedModels[3]){
      console.log("hello",this.currentDisplayedModels[3] )
    this.scene.remove(this.currentDisplayedModels[2]); // Remove old third model
    model3.position.set(1.0, 0, 0); // Position new third model 
    this.scene.add(model3);
    model3.visible = true;
    this.currentDisplayedModels[2] = model3;
    }
    else{
      console.log("hello 2",this.currentDisplayedModels[3] )

      this.scene.remove(this.currentDisplayedModels[2]); // Remove old third model
      model3.position.set(0.5, 0, 0); // Position new third model 
      this.scene.add(model3);
      model3.visible = true;
      this.currentDisplayedModels[2] = model3;  



    }

    
  }
}




showFourthModel(index, pair2 = false) {
  const model4 = this.models[index].clone();
  const model3 = this.models[index].clone();  // Also handle third model if pair2 is true

  if (pair2) {
    // Remove both third and fourth models
    this.scene.remove(this.currentDisplayedModels[2]);
    this.scene.remove(this.currentDisplayedModels[3]);
    console.log("pair yes 2")
    // Set positions for third and fourth models
    model3.position.set(0.5, 0, 0);  // Position third model
    model4.position.set(1.5, 0, 0);  // Position fourth model
    model4.scale.set(85, 85, 85);    // Scale down the fourth model

    // Add both models back to the scene
    this.scene.add(model3);
    this.scene.add(model4);
    model3.visible = true;
    model4.visible = true;

    // Update displayed models array
    this.currentDisplayedModels[2] = model3;
    this.currentDisplayedModels[3] = model4;
  } else {
    // If no pairing, just switch the fourth model
    console.log("pair no 2")

    this.scene.remove(this.currentDisplayedModels[3]);  // Remove the current fourth model
    model4.position.set(1.5, 0, 0);  // Set position for new fourth model
    model4.scale.set(100, 100, 100); // Reset scale
    this.scene.add(model4);
    model4.visible = true;

    // Update the fourth model in the array
    this.currentDisplayedModels[3] = model4;
  }
}

showCurrentModels(index, pair1 = false) {
  const model = this.models[index];
  const model1 = model.clone();
  const model2 = model.clone();

  if (pair1) {
    // Hide both models before showing new ones
    this.hideFirstTwoModels();

    // Set positions for both models
    model1.position.set(-0.7, 0, 0); // First model (left)
    model2.position.set(0.7, -0.15, 0); // Second model (right)
    model2.scale.set(85, 85, 85); // Scale down the second model

    // Add both models back to the scene
    this.scene.add(model1);
    model1.visible = true;
    this.currentDisplayedModels[0] = model1;

    this.scene.add(model2);
    model2.visible = true;
    this.currentDisplayedModels[1] = model2;
  } else {
    // Only hide and switch the selected model, keep the other intact
    if (this.selectedModel === 1) {
      this.scene.remove(this.currentDisplayedModels[0]); // Remove old first model
      model1.position.set(-0.7, 0, 0); // Place new model in the left position
      this.scene.add(model1);
      model1.visible = true;
      this.currentDisplayedModels[0] = model1; // Update the first model
    } else if (this.selectedModel === 2) {
      this.scene.remove(this.currentDisplayedModels[1]); // Remove old second model

      // Adjust positioning based on whether third and fourth models exist
      if (this.currentDisplayedModels.length > 3) {
        model2.position.set(-0.5, 0, 0); // Shift second model left if third and fourth exist
        this.currentDisplayedModels[2].position.set(0.5, 0, 0); // Adjust third model
      } else {
        model2.position.set(0.7, -0.15, 0); // Keep second model on the right if no third or fourth models
      }

      model2.scale.set(85, 85, 85); // Scale down the second model
      this.scene.add(model2);
      model2.visible = true;
      this.currentDisplayedModels[1] = model2; // Update the second model
    }
  }

  // Maintain third and fourth models if they exist
  if (this.currentDisplayedModels.length > 2) {
    this.scene.add(this.currentDisplayedModels[2]); // Re-add third model
  }
  if (this.currentDisplayedModels.length > 3) {
    this.scene.add(this.currentDisplayedModels[3]); // Re-add fourth model
  }
}

  
  
  
  
  // Hide only the first two models
  hideFirstTwoModels() {
    // Hide the first two models in currentDisplayedModels array
    if (this.currentDisplayedModels[0]) {
      this.scene.remove(this.currentDisplayedModels[0]);
    }
    if (this.currentDisplayedModels[1]) {
      this.scene.remove(this.currentDisplayedModels[1]);
    }
  }
  addSecondModel(type, selectedRing = null) {
    let model2;
  
    // Load the second model based on the selectedRing or type
    if (selectedRing && selectedRing.id >= 0 && selectedRing.id < this.models.length) {
      model2 = this.models[selectedRing.id].clone();
      model2.userData.modelId = selectedRing.id;  // Store model ID for tracking
    } else if (type === "Wedding") {
      model2 = this.currentDisplayedModels[0].clone(); // Clone the first model if no specific second model is selected
    } else {
      console.warn('Invalid type or selectedRing for second model');
      return;
    }
  
    // Position the first and second models correctly
    this.currentDisplayedModels[0].position.set(-0.7, 0, 0); // First model on the left
    model2.position.set(0.7, -0.15, 0);                       // Second model on the right
    model2.scale.set(85, 85, 85);                             // Scale down the second model
  
    // Add the second model to the scene
    this.scene.add(model2);
    model2.visible = true;
  
    // Store the second model in the currentDisplayedModels array
    this.currentDisplayedModels.push(model2);
  }
  

  // Add a third model
  addThirdModel(type, selectedRing = null) {
    let model3;

    if (selectedRing && selectedRing.id >= 0 && selectedRing.id < this.models.length) {
      model3 = this.models[selectedRing.id].clone();
      model3.userData.modelId = selectedRing.id;  // Store model ID for tracking
    } else if (type === "Wedding") {
      model3 = this.currentDisplayedModels[0].clone();
    } else {
      console.warn('Invalid type or selectedRing for third ring');
      return;
    }

    // Position the models
    this.currentDisplayedModels[0].position.set(-1.0, 0, 0); // First model
    this.currentDisplayedModels[1].position.set(0, 0, 0);    // Second model in center
    model3.position.set(1.0, 0, 0);                          // Third model on the right
    model3.scale.set(100, 100, 100);

    // Add the third model to the scene
    this.scene.add(model3);
    model3.visible = true;

    // Store the third model
    this.currentDisplayedModels.push(model3);
  }

  // Add a fourth model
  addFourthModel(type, selectedRing = null) {
    let model4;

    if (selectedRing && selectedRing.id >= 0 && selectedRing.id < this.models.length) {
      model4 = this.models[selectedRing.id].clone();
      model4.userData.modelId = selectedRing.id;  // Store model ID for tracking
    } else if (type === "Wedding") {
      model4 = this.currentDisplayedModels[0].clone();
    } else {
      console.warn('Invalid type or selectedRing for fourth ring');
      return;
    }

    // Position the models
    this.currentDisplayedModels[0].position.set(-1.5, 0, 0);  // First model left
    this.currentDisplayedModels[1].position.set(-0.5, 0, 0);  // Second model left-mid
    this.currentDisplayedModels[2].position.set(0.5, 0, 0);   // Third model right-mid
    model4.position.set(1.5, 0, 0);                           // Fourth model far right
    model4.scale.set(100, 100, 100);

    // Add the fourth model to the scene
    this.scene.add(model4);
    model4.visible = true;

    // Store the fourth model
    this.currentDisplayedModels.push(model4);
  }

  // Remove the third model
  removeThirdModel() {
    if (this.currentDisplayedModels.length < 3) {
      console.warn('No third model to remove');
      return;
    }
  
    // Remove the third model from the scene
    const model3 = this.currentDisplayedModels.pop();
    this.scene.remove(model3);
  
    // Re-position the first two models as needed
    this.currentDisplayedModels[0].position.set(-0.7, 0, 0);  // First model to the left
    this.currentDisplayedModels[1].position.set(0.7, 0, 0);   // Second model to the right
  }
  
  // Remove the fourth model and adjust the positions
  removeFourthModel() {
    if (this.currentDisplayedModels.length < 4) {
      console.warn('No fourth model to remove');
      return;
    }
  
    // Remove the fourth model from the scene
    const model4 = this.currentDisplayedModels.pop();
    this.scene.remove(model4);
  
    // If only the third model remains, adjust its position
    if (this.currentDisplayedModels.length === 3) {
      this.currentDisplayedModels[0].position.set(-1.0, 0, 0); // First model
    this.currentDisplayedModels[1].position.set(0, 0, 0);
      this.currentDisplayedModels[2].position.set(1.0, 0, 0); // Re-position third model to the far right
    }
    console.log("removeFourth", this.currentDisplayedModels, this.models)
  }
  removeSecondModel() {
    if (this.currentDisplayedModels.length < 2) {
      console.warn('No second model to remove');
      return;
    }
  
    // Remove the second model from the scene
    const model2 = this.currentDisplayedModels[1];
    this.scene.remove(model2);
  
    // Remove the second model from the array
    this.currentDisplayedModels.splice(1, 1);
  
    // Re-position the first model to the center
    this.currentDisplayedModels[0].position.set(0, 0, 0);
  }
  
}
