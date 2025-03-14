import * as THREE from 'three';


import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js';

// import  CSG  from '/utils/CSGMesh.js'
import Bender from '/utils/bender.js'
import { TextureLoader } from 'three';
import { Target } from 'lucide-react';

export class StoneManager {
  constructor(scene,modelManager) {
    this.scene = scene;
    this.modelManager  = modelManager;


   
  }
  async loadDiamondToRing(options = {}) {
    // Default options with updated scale and rotation values from the UI image
    const defaultOptions = {
      ringIndex: 1, // 1 for first ring, 2 for second ring
      scale: { x: 19.70, y: 19.70, z: 37.00 }, // Default scales from the Diamond Controls UI
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: -0.2, y: 0, z: 0 }, // Default rotations from the UI
      textureUrl: 'diamondm/dtext.jpg',
      effects: {
        map: false,
        normalMap: true,
        roughnessMap: true,
        metalnessMap: false,
        emissiveMap: false,
        aoMap: false,
        envMap: false,
        displacementMap: false
      }
    };
  
    // Merge default options with provided options
    const config = { ...defaultOptions, ...options };
    config.effects = { ...defaultOptions.effects, ...options.effects };
    
    // Ensure scale is properly merged if the user only provided partial scale values
    if (options.scale && typeof options.scale !== 'object') {
      // If user passed a number instead of an object, convert to object format
      config.scale = { x: options.scale, y: options.scale, z: options.scale };
    } else if (options.scale) {
      // Merge with defaults if user provided a partial scale object
      config.scale = { 
        x: options.scale.x !== undefined ? options.scale.x : defaultOptions.scale.x,
        y: options.scale.y !== undefined ? options.scale.y : defaultOptions.scale.y,
        z: options.scale.z !== undefined ? options.scale.z : defaultOptions.scale.z
      };
    }
  
    // Ensure rotation is properly merged if the user provided rotation values
    if (options.rotation && typeof options.rotation !== 'object') {
      // If user passed a number, use it for all rotations (unlikely scenario)
      config.rotation = { x: options.rotation, y: options.rotation, z: options.rotation };
    } else if (options.rotation) {
      // Merge with defaults if user provided a partial rotation object
      config.rotation = {
        x: options.rotation.x !== undefined ? options.rotation.x : defaultOptions.rotation.x,
        y: options.rotation.y !== undefined ? options.rotation.y : defaultOptions.rotation.y,
        z: options.rotation.z !== undefined ? options.rotation.z : defaultOptions.rotation.z
      };
    }
  
    // Convert ringIndex to array index (0-based)
    const ringArrayIndex = config.ringIndex - 1;
    
    // Get the specified ring model
    if (ringArrayIndex < 0 || ringArrayIndex >= this.modelManager.currentDisplayedModels.length) {
      console.error(`Ring ${config.ringIndex} not found. Available rings: ${this.modelManager.currentDisplayedModels.length}`);
      return Promise.reject(new Error(`Ring ${config.ringIndex} not found`));
    }
    
    const targetRing = this.modelManager.currentDisplayedModels[ringArrayIndex];
    if (!targetRing) {
      console.error(`Ring ${config.ringIndex} model not found`);
      return Promise.reject(new Error(`Ring ${config.ringIndex} model not found`));
    }
  
    // Create a holder for diamond to easily position it relative to the ring
    const diamondHolder = new THREE.Object3D();
    diamondHolder.name = "diamondHolder";
    targetRing.add(diamondHolder);
  
    try {
      // Load the diamond model
      const gltf = await new Promise((resolve, reject) => {
        this.modelManager.loader.load(
          'diamondm/Square Diamond.glb', // Path to diamond model
          (gltf) => resolve(gltf),
          (xhr) => console.log(`Diamond loading: ${(xhr.loaded / xhr.total) * 100}% loaded`),
          (error) => reject(error)
        );
      });
  
      const diamondModel = gltf.scene;
      diamondModel.name = "diamond";
      
      // Apply the different scale values for x, y and z
      diamondModel.scale.set(
        config.scale.x,
        config.scale.y,
        config.scale.z
      );
      
      // Apply rotation values in radians
      diamondModel.rotation.set(
        config.rotation.x * Math.PI, // Convert to radians
        config.rotation.y * Math.PI,
        config.rotation.z * Math.PI
      );
      
      // Position the diamond holder on the ring
      diamondHolder.position.set(
        config.position.x,
        config.position.y,
        config.position.z
      );
      
      // Add the diamond to the holder
      diamondHolder.add(diamondModel);
      
      // Set materials for the diamond
      diamondModel.traverse((child) => {
        if (child.isMesh && child.material) {
          // Clone the material to avoid affecting other instances
          child.material = child.material.clone();
          
          // Apply standard material properties
          child.material.metalness = 0.7;
          child.material.roughness = 0.1;
          
          // Apply texture if provided
          if (config.textureUrl) {
            this.applyDiamondTexture(
              diamondModel, 
              config.textureUrl, 
              config.effects
            );
          }
          
          child.material.needsUpdate = true;
        }
      });
      
      console.log(`Diamond successfully added to ring ${config.ringIndex} with scale: ${JSON.stringify(config.scale)} and rotation: ${JSON.stringify(config.rotation)}`);
      return diamondModel;
    } catch (error) {
      console.error('Error loading diamond model:', error);
      // Clean up if there was an error
      if (diamondHolder) {
        targetRing.remove(diamondHolder);
      }
      return Promise.reject(error);
    }
  }
  
  /**
   * Change the rotation of the diamond on a specific ring
   * @param {Object} rotation The rotation values { x, y, z }
   * @param {Number} ringIndex Which ring to modify (1 or 2, default: currently selected model)
   */
  changeDiamondRotation(rotation, ringIndex = null) {
    // If no ringIndex is provided, use the currently selected model
    const targetRingIndex = ringIndex || this.modelManager.selectedModel;
    
    // Convert to array index (0-based)
    const ringArrayIndex = targetRingIndex - 1;
    
    // Verify ring exists
    if (ringArrayIndex < 0 || ringArrayIndex >= this.modelManager.currentDisplayedModels.length) {
      console.error(`Ring ${targetRingIndex} not found for changing diamond rotation.`);
      return;
    }
    
    const targetRing = this.modelManager.currentDisplayedModels[ringArrayIndex];
    if (!targetRing) {
      console.error(`Ring model ${targetRingIndex} not found for changing diamond rotation.`);
      return;
    }
    
    // Find the diamond holder
    const diamondHolder = targetRing.getObjectByName("diamondHolder");
    if (!diamondHolder) {
      console.log(`No diamond found on ring ${targetRingIndex} to rotate.`);
      return;
    }
    
    // Find the diamond model inside the holder
    let diamondModel = null;
    diamondHolder.traverse((child) => {
      if (child.name === "diamond") {
        diamondModel = child;
      }
    });
    
    if (!diamondModel) {
      console.error(`Diamond model not found inside holder on ring ${targetRingIndex}.`);
      return;
    }
    
    // Apply the rotation (converting to radians if needed)
    if (rotation.x !== undefined) {
      diamondModel.rotation.x = rotation.x * Math.PI;
    }
    
    if (rotation.y !== undefined) {
      diamondModel.rotation.y = rotation.y * Math.PI;
    }
    
    if (rotation.z !== undefined) {
      diamondModel.rotation.z = rotation.z * Math.PI;
    }
    
    console.log(`Changed diamond rotation on ring ${targetRingIndex} to:`, rotation);
  }
  async applyDiamondTexture(diamondModel, textureUrl, effects) {
    if (!textureUrl) return Promise.resolve();
    
    // First, remove all existing textures from the model
    diamondModel.traverse((child) => {
      if (child.isMesh && child.material) {
        // Store material properties that might need to be preserved
        const originalColor = child.material.color ? child.material.color.clone() : null;
        
        // Remove all texture maps
        if (child.material.map) {
          child.material.map.dispose();
          child.material.map = null;
        }
        if (child.material.normalMap) {
          child.material.normalMap.dispose();
          child.material.normalMap = null;
        }
        if (child.material.roughnessMap) {
          child.material.roughnessMap.dispose();
          child.material.roughnessMap = null;
        }
        if (child.material.metalnessMap) {
          child.material.metalnessMap.dispose();
          child.material.metalnessMap = null;
        }
        if (child.material.emissiveMap) {
          child.material.emissiveMap.dispose();
          child.material.emissiveMap = null;
        }
        if (child.material.aoMap) {
          child.material.aoMap.dispose();
          child.material.aoMap = null;
        }
        if (child.material.envMap) {
          child.material.envMap.dispose();
          child.material.envMap = null;
        }
        if (child.material.displacementMap) {
          child.material.displacementMap.dispose();
          child.material.displacementMap = null;
        }
        
        // Reset other texture-related properties
        if (child.material.normalScale) {
          child.material.normalScale.set(1, 1);
        }
        if (child.material.emissive) {
          child.material.emissive.set(0, 0, 0);
          child.material.emissiveIntensity = 0;
        }
        child.material.displacementScale = 0;
        child.material.envMapIntensity = 1.0;
        
        // Restore original color if it existed
        if (originalColor) {
          child.material.color.copy(originalColor);
        }
        
        // Mark material for update
        child.material.needsUpdate = true;
      }
    });
    
    // If no new texture should be applied, we're done
    if (!textureUrl) return Promise.resolve();
    
    // Create a texture loader for the new texture
    const textureLoader = new THREE.TextureLoader();
    
    try {
      // Load the new texture
      const texture = await new Promise((resolve, reject) => {
        textureLoader.load(
          textureUrl,
          (texture) => resolve(texture),
          undefined,
          (error) => reject(error)
        );
      });
      
      // Configure texture
      texture.encoding = THREE.sRGBEncoding;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      
      // Apply texture to all meshes in the diamond model based on enabled effects
      diamondModel.traverse((child) => {
        if (child.isMesh && child.material) {
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
          
          // Update the material
          child.material.needsUpdate = true;
        }
      });
      
      console.log(`Texture applied to diamond with effects:`, effects);
      return Promise.resolve();
    } catch (error) {
      console.error('Error applying texture to diamond:', error);
      return Promise.reject(error);
    }
  }

/**
 * Remove diamond from a specific ring
 * @param {Number} ringIndex Which ring to remove the diamond from (1 or 2, default: 1)
 */
removeDiamondFromRing(ringIndex = 1) {
  // Convert ringIndex to array index (0-based)
  const ringArrayIndex = ringIndex - 1;
  
  if (ringArrayIndex < 0 || ringArrayIndex >= this.modelManager.currentDisplayedModels.length) {
    console.error(`Ring ${ringIndex} not found. Available rings: ${this.modelManager.currentDisplayedModels.length}`);
    return;
  }
  
  const targetRing = this.modelManager.currentDisplayedModels[ringArrayIndex];
  if (!targetRing) {
    console.error(`Ring ${ringIndex} model not found`);
    return;
  }
  
  const diamondHolder = targetRing.getObjectByName("diamondHolder");
  console.log(diamondHolder, "diamondHolder",targetRing, "targetRing")
  if (diamondHolder) {
    // Remove all children (diamond) from the holder
    while (diamondHolder.children.length > 0) {
      const child = diamondHolder.children[0];
      diamondHolder.remove(child);
      
      // Dispose of geometries and materials to free memory
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          // Handle array of materials
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    }
    
    // Remove the diamond holder from the model
    targetRing.remove(diamondHolder);
    console.log(`Diamond removed from ring ${ringIndex}`);
  } else {
    console.log(`No diamond found on ring ${ringIndex}`);
  }
}
changeStoneSize(value, ringIndex = null) {
  // If no ringIndex is provided, use the currently selected model
  const targetRingIndex = ringIndex || this.modelManager.selectedModel;
  
  // Convert to array index (0-based)
  const ringArrayIndex = targetRingIndex - 1;
  
  // Verify ring exists
  if (ringArrayIndex < 0 || ringArrayIndex >= this.modelManager.currentDisplayedModels.length) {
    console.error(`Ring ${targetRingIndex} not found for resizing diamond.`);
    return;
  }
  
  const targetRing = this.modelManager.currentDisplayedModels[ringArrayIndex];
  if (!targetRing) {
    console.error(`Ring model ${targetRingIndex} not found for resizing diamond.`);
    return;
  }
  
  // Find the diamond holder
  const diamondHolder = targetRing.getObjectByName("diamondHolder");
  if (!diamondHolder) {
    console.log(`No diamond found on ring ${targetRingIndex} to resize.`);
    return;
  }
  
  // Find the diamond model inside the holder
  let diamondModel = null;
  diamondHolder.traverse((child) => {
    if (child.name === "diamond") {
      diamondModel = child;
    }
  });
  
  if (!diamondModel) {
    console.error(`Diamond model not found inside holder on ring ${targetRingIndex}.`);
    return;
  }
  
  // Get the current scale (we assume it's uniform in all dimensions)
  const currentScale = diamondModel.scale.z;
  
  // Default base scale factor (for 1.0 mm)
  const baseScale = 19.7;
  
  // Calculate new scale based on the value
  let newScale;
  let xyScale;
  let zScale;
  
  if (value.includes("1.3")) {
    console.log("1.3")
    // Increase by 30% on XY for 1.3 mm
    xyScale = baseScale * 1.15;
    zScale = currentScale; // Keep Z scale the same
  } else if (value.includes("1.5")) {
    console.log("1.5")
    // Increase by 50% on XY for 1.5 mm
    xyScale = baseScale * 1.2;
    zScale = currentScale; // Keep Z scale the same
  } else {
    // Default size (1.0 mm)
    xyScale = baseScale;
    zScale = currentScale;
  }
  
  // Apply new scale to the diamond model
  // Scale only X and Y dimensions, keeping Z the same to maintain proportions
  diamondModel.scale.set(xyScale, xyScale, zScale);
  
  console.log(`Changed diamond size on ring ${targetRingIndex} to ${value} (Scale: ${xyScale} , ${zScale})`);
}

/**
 * Change the position of the diamond on a specific ring (left, middle, right)
 * @param {String} position The position value ('Left', 'Middle', 'Right', or 'Free')
 * @param {Number} ringIndex Optional: Which ring to modify (defaults to currently selected model)
 * @param {Object} customPosition Optional: Custom position for 'Free' position type {x, y, z}
 */
changeStonePosition(position, ringIndex = null, customPosition = null) {
  // If no ringIndex is provided, use the currently selected model
  const targetRingIndex = ringIndex || this.modelManager.selectedModel;
  
  // Convert to array index (0-based)
  const ringArrayIndex = targetRingIndex - 1;
  
  // Verify ring exists
  if (ringArrayIndex < 0 || ringArrayIndex >= this.modelManager.currentDisplayedModels.length) {
    console.error(`Ring ${targetRingIndex} not found for repositioning diamond.`);
    return;
  }
  
  const targetRing = this.modelManager.currentDisplayedModels[ringArrayIndex];
  if (!targetRing) {
    console.error(`Ring model ${targetRingIndex} not found for repositioning diamond.`);
    return;
  }
  
  // Find the diamond holder
  const diamondHolder = targetRing.getObjectByName("diamondHolder");
  if (!diamondHolder) {
    console.log(`No diamond found on ring ${targetRingIndex} to reposition.`);
    return;
  }
  
  // Store current y and z positions to maintain them
  const currentX = diamondHolder.position.x;
  const currentY = diamondHolder.position.y;
  const currentZ = diamondHolder.position.z;
  
  // Set new position based on selected option
  let newX = 0; // Default (Middle)
  
  switch (position) {
    case 'Left':
      newX = -0.05;
      break;
    case 'Right':
      newX = 0.05;
      break;
    case 'Middle':
      newX = 0;
      break;
    case 'Free':
      // // If customPosition is provided and it's a Free position type, use the custom values
      // if (customPosition) {
      //   newX = customPosition.x !== undefined ? customPosition.x : diamondHolder.position.x;
        
      //   // Update Y and Z if provided in custom position
      //   if (customPosition.y !== undefined) {
      //     diamondHolder.position.y = customPosition.y;
      //   }
        
      //   if (customPosition.z !== undefined) {
      //     diamondHolder.position.z = customPosition.z;
      //   }
      // }
      console.log("free not available")
      break;
    default:
      console.warn(`Unknown position: ${position}. Using 'Middle' as default.`);
      newX = 0;
  }
  
  // Apply the new X position, keeping Y and Z unchanged for standard positions
  diamondHolder.position.x = newX;
  
  // Only log the position that was actually changed
  if (position === 'Free' && customPosition) {
    console.log(`Changed diamond position on ring ${targetRingIndex} to custom position:`, 
      {x: diamondHolder.position.x, y: diamondHolder.position.y, z: diamondHolder.position.z});
  } else {
    console.log(`Changed diamond position on ring ${targetRingIndex} to ${position} (X: ${newX})`);
  }
}

handleStonePositionSlider(positionValue, selectedRing = null) {
  // If no selectedRing is provided, use the currently selected model
  const targetRingIndex = selectedRing ? 
    (selectedRing.includes('2') ? 2 : 1) : 
    this.modelManager.selectedModel;
  
  // Convert to array index (0-based)
  const ringArrayIndex = targetRingIndex - 1;
  
  // Verify ring exists
  if (ringArrayIndex < 0 || ringArrayIndex >= this.modelManager.currentDisplayedModels.length) {
    console.error(`Ring ${targetRingIndex} not found for repositioning stone.`);
    return;
  }
  
  const targetRing = this.modelManager.currentDisplayedModels[ringArrayIndex];
  if (!targetRing) {
    console.error(`Ring model ${targetRingIndex} not found for repositioning stone.`);
    return;
  }
  
  // Find the diamond holder
  const diamondHolder = targetRing.getObjectByName("diamondHolder");
  if (!diamondHolder) {
    console.log(`No stone found on ring ${targetRingIndex} to reposition.`);
    return;
  }
  
  // Store current y and z positions to maintain them
  const currentY = diamondHolder.position.y;
  const currentZ = diamondHolder.position.z;
  
  // Apply the new X position, keeping Y and Z unchanged
  diamondHolder.position.x = positionValue;
  
  // For user feedback, determine the position name
  let positionName = "Center";
  if (positionValue < -0.05) positionName = "Left";
  else if (positionValue > 0.05) positionName = "Right";
  
  console.log(`Changed stone position on ring ${targetRingIndex} to ${positionName} (X: ${positionValue.toFixed(3)})`);
}
}