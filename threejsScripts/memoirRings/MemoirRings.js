import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DiamondMaterialManager } from '../stoneManager/DiamondMaterialManager.js';

export class MemoirRings {
  constructor(scene, modelManager, renderer) {
    this.scene = scene;
    this.modelManager = modelManager;
    this.renderer = renderer;
    this.ringPath = null;
    
    // Initialize diamond material manager
    this.diamondMaterialManager = new DiamondMaterialManager(renderer);
    
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
    console.log("model apply diamond texture to ring", model)

      this.applyDiamondTextureToRing(model);
      
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
    // Use the same effects configuration as in StoneManager

    const effects = {
      map: false, // Clear Diamond preset - no base color map
      normalMap: true, // Clear Diamond preset - only normal map
      roughnessMap: false, // Clear Diamond preset - no roughness map
      metalnessMap: false, // Clear Diamond preset - no metalness map
      emissiveMap: false, // Clear Diamond preset - no emissive map
      aoMap: false,
      envMap: true, // Clear Diamond preset - use cubemap
      displacementMap: false
    };
    
    const textureUrl = 'diamondMap/1b.jpg'; // Use the same texture as StoneManager
    // Find all meshes with "diamond" in their name and apply the diamond material
    model.traverse((child) => {
      if (child.isMesh && child.name.includes('diamon') || child.name.includes('_1')) {
        console.log(`Applying diamond material to: ${child.name}`);
        
        // Dispose of the old material and its textures first
        if (child.material) {
          if (child.material.map) child.material.map.dispose();
          if (child.material.normalMap) child.material.normalMap.dispose();
          if (child.material.roughnessMap) child.material.roughnessMap.dispose();
          if (child.material.metalnessMap) child.material.metalnessMap.dispose();
          if (child.material.emissiveMap) child.material.emissiveMap.dispose();
          if (child.material.aoMap) child.material.aoMap.dispose();
          if (child.material.envMap) child.material.envMap.dispose();
          if (child.material.displacementMap) child.material.displacementMap.dispose();
          child.material.dispose();
        }
        
        // Create new diamond material with cubemap (same as StoneManager)
        child.material = this.diamondMaterialManager.createDiamondMaterial();
        
        // Set renderOrder for proper rendering
        child.renderOrder = 4;
        
        // Ensure environment map is applied
        const applyEnvMap = () => {
          if (this.diamondMaterialManager.envMapPMREM) {
            console.log("applyEnvMap",this.diamondMaterialManager.envMapPMREM)
            child.material.metalness = 0.6;
            child.material.roughness = 0;
            child.material.envMapIntensity = 1.5; // Increased for better reflections
            child.material.transmission = 1;  // Add transmission for glass-like effect
            child.material.ior = 1.2;          // Index of refraction - more realistic diamond value
            child.material.reflectivity = 1.2;
            child.material.clearcoat = 1;
            child.material.clearcoatRoughness = 0; // Ensure clear coat is perfectly smooth
            child.material.thickness = 2.0; // simulate refraction
            child.material.transparent = true;
            child.material.opacity = 0.9;
            child.material.depthWrite = true;
            child.material.depthTest = true;
            child.material.polygonOffset = false;
            // Enhanced properties from HTML version
            child.material.specularIntensity = 1;
            child.material.specularColor = new THREE.Color(1, 1, 1);
            // Ensure proper side rendering for transparency
            child.material.side = THREE.DoubleSide;
            child.material.envMap = this.diamondMaterialManager.envMapPMREM;
            child.material.needsUpdate = true;
          }
        };
        
        // Apply environment map immediately if ready, otherwise wait
        if (this.diamondMaterialManager.envMapPMREM) {
          console.log("applyEnvMap",this.diamondMaterialManager.envMapPMREM)

          applyEnvMap();
        } else {
          // Wait for environment map to load
          const checkEnvMap = () => {
            if (this.diamondMaterialManager.envMapPMREM) {
            console.log("applyEnvMap",this.diamondMaterialManager.envMapPMREM)

              applyEnvMap();
            } else {
              setTimeout(checkEnvMap, 100);
            }
          };
          checkEnvMap();
        }
        
        // Apply textures using the diamond material manager (same as StoneManager)
        this.diamondMaterialManager.applyDiamondTextures(
          child.material,
          textureUrl,
          effects
        ).then(() => {
          console.log(`Diamond material applied successfully to: ${child.name}`);
        }).catch((error) => {
          console.warn(`Failed to apply diamond textures to ${child.name}:`, error);
        });
      }
    });
    
    console.log(`Diamond materials applied successfully to memoir ring model`,model);
    
  }

  // Clean up resources when disposing
  dispose() {
    if (this.diamondMaterialManager) {
      this.diamondMaterialManager.dispose();
    }
  }
}