import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class EngagementRings {
  constructor(scene,modelManager) {
    this.scene = scene;
    this.modelManager = modelManager
    this.modelData = [
        { glbPath: 'models/eng/VR001.glb', texturePath: 'path/to/texture2.jpg' },
        { glbPath: 'models/eng/VR001S-BD.glb', texturePath: 'path/to/texture3.jpg' },
        { glbPath: 'models/eng/VR002.glb', texturePath: 'path/to/texture1.jpg' },
        { glbPath: 'models/eng/VR002S-BD.glb' },
        { glbPath: 'models/eng/VR003.glb' },
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
        
      ];
    // this.initLighting();
  }

  loadEngRingById(id) {
    // Ensure the ID is within the range of modelData array
    if (id < 0 || id >= this.modelData.length) {
      console.error(`Invalid ID: ${id}. Please provide a valid model ID.`);
      return;
    }
  
    // Get the model data for the given ID
    const modelInfo = this.modelData[id];
  
    // Check if the model path exists
    if (!modelInfo.glbPath) {
      console.error(`Model path not found for ID: ${id}`);
      return;
    }
  
    // Load the GLTF model using GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
      modelInfo.glbPath,
      (gltf) => {
        // Add the loaded model to the scene
        const model = gltf.scene;
        model.position.x = 0.7;
        model.position.y = -0.2;

        model.scale.set(0.8,0.8,0.8)
        this.scene.add(model);
        this.modelManager.currentDisplayedModels.push(model);
        // this.modelManager.applyColorToModel(model,'#D8BC7E')
        this.applyColorExcludingMeshes(model, '#D8BC7E');
        console.log(`Model loaded successfully: ${modelInfo.glbPath}`);
      },
      (xhr) => {
        // Progress callback
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        // Error callback
        console.error(`Error loading model: ${modelInfo.glbPath}`, error);
      }
    );
  }
  applyColorExcludingMeshes(model, color) {
    model.traverse((child) => {
      // Check if the traversed object is a mesh
      if (child.isMesh) {
        // Skip meshes whose names contain "_1"
        if (child.name.includes("_1")) {
          console.warn("")
        }
        // Apply the color to the mesh material
        // if (Array.isArray(child.material)) {
        //   // If there are multiple materials, apply to each one
        //   child.material.forEach((mat) => {
        //     if (mat && mat.color) {
        //       mat.color.set(color);
        //     }
        //   });
         else if (child.material && child.material.color) {
          child.material.color.set(color);
        }
      }
    });
  }

}