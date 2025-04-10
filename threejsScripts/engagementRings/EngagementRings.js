import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class EngagementRings {
  constructor(scene, modelManager) {
    this.scene = scene;
    this.modelManager = modelManager
    this.ringPath = null;
    this.modelData = [
      { glbPath: 'models/eng/VR001.glb', texturePath: 'path/to/texture2.jpg' },
      { glbPath: 'models/eng/VR001S-BD.glb', texturePath: 'path/to/texture3.jpg' },
      { glbPath: 'models/eng/VR002.glb', texturePath: 'path/to/texture1.jpg' },
      { glbPath: 'models/eng/VR002S-BD.glb' },
      { glbPath: 'models/eng/VR003.glb' },
      { glbPath: 'models/eng/VR003S-BD.glb' },
      { glbPath: 'models/eng/VR003S-BD.glb' },
      { glbPath: 'models/eng/VR004.glb' },
      { glbPath: 'models/eng/VR005.glb' },
      { glbPath: 'models/eng/VR005S-BD.glb' },
      { glbPath: 'models/eng/VR006.glb' },
      { glbPath: 'models/eng/VR006S-BD.glb' },
      { glbPath: 'models/eng/VR007.glb' },
      { glbPath: 'models/eng/VR008.glb' },
      { glbPath: 'models/eng/VR009.glb' },
      { glbPath: 'models/eng/VR010.glb' },
      { glbPath: 'models/eng/VR011.glb' },
      { glbPath: 'models/eng/VR101.glb' },
      { glbPath: 'models/eng/VR102.glb' },
      { glbPath: 'models/eng/VR103.glb' },
      { glbPath: 'models/eng/VR104.glb' },
      { glbPath: 'models/eng/VR104S-BD.glb' },
      { glbPath: 'models/eng/VR105.glb' },
      { glbPath: 'models/eng/VR201.glb' },
      { glbPath: 'models/eng/VR202.glb' },
      { glbPath: 'models/eng/VR203.glb' },
      { glbPath: 'models/eng/VR301.glb' },
      { glbPath: 'models/eng/VR302.glb' },
      { glbPath: 'models/eng/VR401.glb' },
      { glbPath: 'models/eng/VR401S-BD.glb' },
      { glbPath: 'models/eng/VR402.glb' },
      { glbPath: 'models/eng/VR402S-BD.glb' },
      { glbPath: 'models/eng/VR403.glb' },
      { glbPath: 'models/eng/VR403S-BD.glb' },
      { glbPath: 'models/eng/VR404.glb' },
      // Added models from the image
      { glbPath: 'models/eng/VR411SC.glb' },
      { glbPath: 'models/eng/VR410SC.glb' },
      { glbPath: 'models/eng/VR409PL.glb' },
      { glbPath: 'models/eng/VR409BD.glb' },
      { glbPath: 'models/eng/VR408SC.glb' },
      { glbPath: 'models/eng/VR305PL.glb' },
      { glbPath: 'models/eng/VR305SC.glb' },
      { glbPath: 'models/eng/VR304PL.glb' },
      { glbPath: 'models/eng/VR303PL.glb' },
      { glbPath: 'models/eng/VR021BD.glb' },
      { glbPath: 'models/eng/VR021PL.glb' },
      { glbPath: 'models/eng/VR020BD.glb' },
      { glbPath: 'models/eng/VR019BD.glb' },
      { glbPath: 'models/eng/VR018PS.glb' },
      { glbPath: 'models/eng/VR016SH.glb' },
      { glbPath: 'models/eng/VR016CH.glb' },
      { glbPath: 'models/eng/VR016BD.glb' },
      { glbPath: 'models/eng/VR016PL.glb' },
      { glbPath: 'models/eng/VR015CH.glb' },
      { glbPath: 'models/eng/VR015PL.glb' },
      { glbPath: 'models/eng/VR015BD.glb' },
      { glbPath: 'models/eng/VR015SC.glb' },
      { glbPath: 'models/eng/VR014SC.glb' },
      { glbPath: 'models/eng/VR014PL.glb' },
      { glbPath: 'models/eng/VR014CH.glb' },
      { glbPath: 'models/eng/VR014BD.glb' },
      { glbPath: 'models/eng/VR013SC.glb' },
      { glbPath: 'models/eng/VR013PL.glb' },
      { glbPath: 'models/eng/VR013CH.glb' },
      { glbPath: 'models/eng/VR013BD.glb' },
      { glbPath: 'models/eng/VR403S-BD.glb' },
      { glbPath: 'models/eng/VR402.glb' },
      { glbPath: 'models/eng/VR402S-BD.glb' },
      { glbPath: 'models/eng/VR401S-BD.glb' },
      { glbPath: 'models/eng/VR401.glb' }

    ];
    // this.initLighting();
  }

  async loadEngRingById(id) {
    try {
      const loaderOverlay = document.querySelector('.loader-overlay');
      if (loaderOverlay) {
        loaderOverlay.style.display = 'block';
      }
      
      // Ensure the ID is within the range of modelData array
      if (id < 0 || id >= this.modelData.length) {
        throw new Error(`Invalid ID: ${id}. Please provide a valid model ID.`);
      }
  
      // Get the model data for the given ID
      const modelInfo = this.modelData[id];
  
      // Check if the model path exists
      if (!modelInfo.glbPath) {
        throw new Error(`Model path not found for ID: ${id}`);
      }
  
      // Load the GLTF model using GLTFLoader with promise
      const loader = new GLTFLoader();
      
      // Create a promise for the loading process
      const gltf = await new Promise((resolve, reject) => {
        loader.load(
          modelInfo.glbPath,
          // Success callback
          (gltf) => resolve(gltf),
          // Progress callback
          (xhr) => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
          // Error callback
          (error) => reject(new Error(`Error loading model: ${modelInfo.glbPath} - ${error}`))
        );
      });
      
      // Add the loaded model to the scene
      const model = gltf.scene;
      model.position.x = 0.7;
      model.position.y = -0.2;
      model.scale.set(0.8, 0.8, 0.8);
      
      this.scene.add(model);
      this.modelManager.currentDisplayedModels.push(model);
      
      // Commented code preserved from original
      // this.modelManager.applyColorToModel(model,'#D8BC7E')
      if (modelInfo.glbPath == "models/eng/VR002.glb" || modelInfo.glbPath == "models/eng/VR003S-BD.glb") {
        // this.applyColorExcludingMeshes(model, '#D8BC7E', true);
      }
      else {
        // this.applyColorExcludingMeshes(model, '#D8BC7E', false);
      }
      
      console.log(`Model loaded successfully: ${modelInfo.glbPath}`, model);
      
      if (loaderOverlay) {
        loaderOverlay.style.display = 'none';
      }
      
      // this.scene.ringPath = modelInfo.glbPath
      
      return model; // Return the loaded model for further use if needed
    } catch (error) {
      console.error(error.message);
      
      const loaderOverlay = document.querySelector('.loader-overlay');
      if (loaderOverlay) {
        loaderOverlay.style.display = 'none';
      }
      
      return null;
    }
  }
  applyColorExcludingMeshes(model, color, reverse = false) {
    model.traverse((child) => {
      // Check if the traversed object is a mesh
      if (child.isMesh) {

        if (reverse == true && child.name.includes("_")) {
          if (child.material && child.material.color) {
            child.material.color.set(color);
          }
          console.warn("aaaaaa", child.name)

        }


        // Skip meshes whose names contain "_1"
        if (child.name.includes("_1") && !reverse) {


        }
        // Apply the color to the mesh material
        // if (Array.isArray(child.material)) {
        //   // If there are multiple materials, apply to each one
        //   child.material.forEach((mat) => {
        //     if (mat && mat.color) {
        //       mat.color.set(color);
        //     }
        //   });
        else if (child.material && child.material.color && !reverse) {
          console.warn("aaaaaa 2")

          child.material.color.set(color);
        }
      }
    });
  }

}