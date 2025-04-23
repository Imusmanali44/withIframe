import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class MemoirRings {
  constructor(scene, modelManager) {
    this.scene = scene;
    this.modelManager = modelManager;
    this.ringPath = null;
    this.modelData = [
      { glbPath: 'models/memoir/01.glb', texturePath: 'path/to/texture1.jpg' },
      { glbPath: 'models/memoir/02.glb', texturePath: 'path/to/texture2.jpg' },
      { glbPath: 'models/memoir/03.glb' },
      { glbPath: 'models/memoir/04.glb' },
      { glbPath: 'models/memoir/05.glb' },
      { glbPath: 'models/memoir/06.glb' },
      { glbPath: 'models/memoir/07.glb' },
      { glbPath: 'models/memoir/08.glb' },
      { glbPath: 'models/memoir/09.glb' },
      { glbPath: 'models/memoir/10.glb' },
      { glbPath: 'models/memoir/11.glb' },
      { glbPath: 'models/memoir/12.glb' },
      { glbPath: 'models/memoir/13.glb' },
      { glbPath: 'models/memoir/14.glb' },
      { glbPath: 'models/memoir/15.glb' },
      { glbPath: 'models/memoir/16.glb' },
      { glbPath: 'models/memoir/17.glb' },
      { glbPath: 'models/memoir/18.glb' },
      { glbPath: 'models/memoir/19.glb' },
      { glbPath: 'models/memoir/20.glb' },
      { glbPath: 'models/memoir/21.glb' },
      { glbPath: 'models/memoir/22.glb' },
      { glbPath: 'models/memoir/23.glb' },
      { glbPath: 'models/memoir/24.glb' },
      { glbPath: 'models/memoir/25.glb' },
      { glbPath: 'models/memoir/26.glb' }, // Fixed numbering (was duplicated as 25.glb)
      { glbPath: 'models/memoir/27.glb' },
      { glbPath: 'models/memoir/28.glb' },
      { glbPath: 'models/memoir/29.glb' },
      { glbPath: 'models/memoir/30.glb' },
      { glbPath: 'models/memoir/31.glb' },
      { glbPath: 'models/memoir/32.glb' },
      { glbPath: 'models/memoir/33.glb' },
      { glbPath: 'models/memoir/34.glb' },
      { glbPath: 'models/memoir/35.glb' },
      { glbPath: 'models/memoir/36.glb' },
      { glbPath: 'models/memoir/37.glb' },
      { glbPath: 'models/memoir/38.glb' },
      { glbPath: 'models/memoir/39.glb' },
      { glbPath: 'models/memoir/40.glb' },
      { glbPath: 'models/memoir/41.glb' },
      { glbPath: 'models/memoir/42.glb' },
      { glbPath: 'models/memoir/43.glb' },
      { glbPath: 'models/memoir/44.glb' },
      { glbPath: 'models/memoir/45.glb' },
      { glbPath: 'models/memoir/46.glb' },
      { glbPath: 'models/memoir/47.glb' },
      { glbPath: 'models/memoir/48.glb' },
      { glbPath: 'models/memoir/49.glb' },
      { glbPath: 'models/memoir/50.glb' }
    ];
    // this.initLighting();
  }

  async loadMemoirRingById(id) {
    try {
      id = id - 1;
      const loaderOverlay = document.querySelector('.loader-overlay');
      if (loaderOverlay) {
        loaderOverlay.style.display = 'block';
      }
      
      console.log(`Loading memoir ring model with ID: ${id}`);
      
      // Ensure the ID is within the range of modelData array
      if (id < 0 || id > this.modelData.length) {
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
      model.position.y = -0.18;
      model.scale.set(0.85, 0.85, 0.85);
      
      this.scene.add(model);
      this.modelManager.currentDisplayedModels.push(model);
      
      // Commented code preserved from original
      // this.modelManager.applyColorToModel(model,'#D8BC7E')
      // this.applyDiamondTextureToRing(model);
      
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

        if (reverse == true && child.name.includes("ring")) {
          if (child.material && child.material.color) {
            child.material.color.set(color);
          }
          console.warn("aaaaaa", child.name)
        }

        // Skip meshes whose names contain "_1"
        if (child.name.includes("diamond") && !reverse) {
          // Do nothing
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


  applyDiamondTextureToRing(model) {
    const textureUrl = 'diamondm/dtext.jpg'; // Hard-coded texture URL
    
    // Default effects configuration
    const effects = {
      map: false,
      normalMap: true,
      roughnessMap: true,
      metalnessMap: false,
      emissiveMap: false,
      aoMap: false,
      envMap: false,
      displacementMap: false
    };
    
    // Create a texture loader for the new texture
    const textureLoader = new THREE.TextureLoader();
    
    // Load the texture
    textureLoader.load(
      textureUrl,
      (texture) => {
        // Configure texture
        texture.encoding = THREE.sRGBEncoding;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        
        // Find all meshes with "diamond" in their name and apply the texture
        model.traverse((child) => {
          if (child.isMesh && child.name.includes('diamond')) {
            console.log(`Applying diamond texture to: ${child.name}`);
            
            // Store material properties that might need to be preserved
            const originalColor = child.material ? child.material.color.clone() : null;
            
            // Ensure material is cloned to avoid affecting other instances
            if (child.material) {
              child.material = child.material.clone();
              
              // Apply texture to each enabled map type
              if (effects.map) {
                child.material.map = texture;
              }
              
              if (effects.normalMap) {
                child.material.normalMap = texture;
                child.material.normalScale = new THREE.Vector2(1, 1);
              }
              
              if (effects.roughnessMap) {
                child.material.roughnessMap = texture;
              }
              
              if (effects.metalnessMap) {
                child.material.metalnessMap = texture;
              }
              
              if (effects.emissiveMap) {
                child.material.emissiveMap = texture;
                child.material.emissive = new THREE.Color(1, 1, 1);
                child.material.emissiveIntensity = 0.5;
              }
              
              if (effects.aoMap) {
                child.material.aoMap = texture;
              }
              
              if (effects.envMap) {
                child.material.envMap = texture;
                child.material.envMapIntensity = 1.0;
              }
              
              if (effects.displacementMap) {
                child.material.displacementMap = texture;
                child.material.displacementScale = 0.1;
              }
              
              // Apply standard material properties for diamonds
              child.material.metalness = 0.8;
              child.material.roughness = 0;
              
              // Restore original color if it existed
              if (originalColor) {
                child.material.color.copy(originalColor);
              }
              
              // Update the material
              child.material.needsUpdate = true;
            }
          }
        });
        
        console.log(`Diamond textures applied successfully to memoir ring model`);
      },
      (xhr) => {
        // Progress callback
        console.log(`Diamond texture loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        // Error callback
        console.error('Error loading diamond texture for memoir ring:', error);
      }
    );
  }
}