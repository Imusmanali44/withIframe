import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ModelManager {
  constructor(scene) {
    this.scene = scene;
    this.models = [];
    this.currentDisplayedModels = [];
    this.currentModelIndex = 0;
    this.selectedModel = 0
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
        this.switchModel(0);
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
  }

  // Switch to a new pair of models based on the current index
  switchModel(index) {
    if (index < 0 || index >= this.models.length) {
      console.warn('Invalid model index:', index);
      return;
    }
    console.log("current ring selected", this.selectedModel)
    this.currentModelIndex = index;
    this.showCurrentModels(index);
  }

  // Show a pair of models based on the current index
  showCurrentModels(index) {
    const isSingleModel = this.currentDisplayedModels.length === 1; // Check if only one model is displayed
  
    // Hide the first two models if not switching only a single model
    if (!isSingleModel) {
      this.hideFirstTwoModels();
    }
  
    // Create the new models to display
    const model = this.models[index];
    const model1 = model.clone();
  
    if (isSingleModel) {
      // Case where only one model is displayed
      model1.position.set(0, 0, 0); // Center the single model
      this.scene.remove(this.currentDisplayedModels[0]); // Remove the old single model
      this.scene.add(model1);
      model1.visible = true;
      this.currentDisplayedModels[0] = model1; // Replace the single model in the array
    } else {
      // Case where two models are displayed
  
      // Create the second model
      const model2 = model.clone();
  
      // Position the first two models based on how many other models are displayed
      if (!this.currentDisplayedModels[2]) {
        // No third model is displayed
        model1.position.set(-0.7, 0, 0); // Position first model to the left
        model2.position.set(0.7, -0.15, 0); // Position second model to the right
        model2.scale.set(85, 85, 85); // Scale down the second model
      } else if (!this.currentDisplayedModels[3]) {
        // Third model exists but not the fourth
        model1.position.set(-1.0, 0, 0); // Position first model
        model2.position.set(0, -0.15, 0); // Position second model
        model2.scale.set(85, 85, 85); // Scale down the second model
      } else {
        // Both third and fourth models exist
        model1.position.set(-1.5, 0, 0); // First model left
        model2.position.set(-0.5, 0, 0); // Second model left-mid
        this.currentDisplayedModels[2].position.set(0.5, 0, 0); // Keep third model in position
      }
  
      // Add the new models to the scene
      this.scene.add(model1);
      this.scene.add(model2);
      model1.visible = true;
      model2.visible = true;
  
      // Update the displayed models array
      this.currentDisplayedModels[0] = model1;
      this.currentDisplayedModels[1] = model2;
    }
  
    // Maintain third and fourth models in their existing positions
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
