import * as THREE from 'three';


import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js';

// import  CSG  from '/utils/CSGMesh.js'
// import Bender from '/utils/bender.js'
import { TextureLoader } from 'three';
import { Pi } from 'lucide-react';
// import { Target } from 'lucide-react';

export class StoneManager {
  constructor(scene, modelManager, renderer) {
    this.scene = scene;
    this.modelManager = modelManager;
    this.renderer = renderer;



  }
  async loadDiamondToRing(options = {}, value) {
    // Default options based on the UI controls in the images
    // let x = value 

    const defaultOptions = {
      ringIndex: 1, // 1 for first ring, 2 for second ring
      scale: { x: 17.20, y: 17.20, z: 21.50 }, // Default scales from Image 2
      position: { x: 0, y: 0.50, z: 1.05 }, // Default positions from Image 1 & 2
      rotation: { x: -0.13, y: 0.00, z: 0.00 }, // Default rotations from Image 1
      textureUrl: 'diamondm/dtext.jpg',
      textureUrlfire: 'diamondm/diamond_fire.jpg',

      modelUrl: 'diamondm/d1.glb',
      effects: {
        map: true, // Base Color is unchecked
        normalMap: true, // Normal Map is checked
        roughnessMap: true, // Roughness is checked
        metalnessMap: true, // Metallic is unchecked
        emissiveMap: true,
        aoMap: false,
        envMap: true,
        displacementMap: false
      }
    };

    // Merge default options with provided options
    const config = { ...defaultOptions, ...options };
    config.effects = { ...defaultOptions.effects, ...options.effects };

    // Handle uniform scale if provided (from Image 2)
    if (options.uniformScale) {
      const scale = options.uniformScale;
      config.scale = { x: scale, y: scale, z: scale };
    }

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

    // Ensure position is properly merged if the user provided position values
    if (options.position && typeof options.position !== 'object') {
      // Unlikely case, but handle it anyway
      config.position = { x: options.position, y: options.position, z: options.position };
    } else if (options.position) {
      // Merge with defaults if user provided a partial position object
      config.position = {
        x: options.position.x !== undefined ? options.position.x : defaultOptions.position.x,
        y: options.position.y !== undefined ? options.position.y : defaultOptions.position.y,
        z: options.position.z !== undefined ? options.position.z : defaultOptions.position.z
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
    targetRing.userData.StoneType = value;
    diamondHolder.renderOrder = 1000;
    targetRing.add(diamondHolder);
    console.log("diamondHolder", diamondHolder)

    try {
      // Load the diamond model
      const gltf = await new Promise((resolve, reject) => {
        this.modelManager.loader.load(
          config.modelUrl, // Path to diamond model
          (gltf) => resolve(gltf),
          (xhr) => console.log(`Diamond loading: ${(xhr.loaded / xhr.total) * 100}% loaded`),
          (error) => reject(error)
        );
      });

      const diamondModel = gltf.scene;
      diamondModel.name = "diamond";
      diamondModel.renderOrder = 1000; // Ensure diamond is rendered on top of the ring
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
          child.material.depthWrite = true;
          child.material.depthTest = true;
          child.material.transparent = false; // Make sure it's not transparent
          child.material.polygonOffset = false; // Disable polygon offset for diamonds
          child.material.stencilWrite = true,
            child.material.stencilRef = 2,  // Use a different value than both main model and midMesh
            child.material.stencilFunc = THREE.AlwaysStencilFunc,  // Always pass the stencil test
            child.material.stencilZPass = THREE.ReplaceStencilOp,

            // Set renderOrder at the mesh level (higher than midMesh)
            child.renderOrder = 4; // Increase to 4 from 3

          // child.material.needsUpdate = true;
          child.material.needsUpdate = true;
        }
      });

      console.log(`Diamond successfully added to ring ${config.ringIndex} with scale: ${JSON.stringify(config.scale)}, position: ${JSON.stringify(config.position)}, and rotation: ${JSON.stringify(config.rotation)}`);
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

  async addDiamondsToRingFront(options = {}) {
    // Default configurations
    const defaultOptions = {
      ringIndex: 1, // Target ring (1 for first ring, 2 for second ring)
      diamondCount: 3, // Number of diamonds to place around the ring
      coverage: 0.1, // Default coverage (will be overridden by distribution option)
      distribution: 'Together', // Default distribution type
      baseScale: 4.0, // Base scale factor for all diamonds
      individualScale: { x: 3.5, y: 3.5, z: 4.0 }, // Individual diamond scale
      rotation: { x: 0, y: 0, z: 0 }, // Default rotation (will be overridden by options)
      baseRadius: 1.15, // Distance from center of ring (radius)
      startAngle: -Math.PI/4, // Starting angle in radians
      zOffset: 0.25, // Z-axis offset (front face positioning)
      // Default diamond model - will be overridden based on stone type
      modelUrl: 'diamondm/d1.glb',
      textureUrl: 'diamondm/dtext.jpg', // Texture for diamonds
      textureUrlfire: 'diamondm/diamond_fire.jpg',
      effects: {
        map: true,
        normalMap: true,
        roughnessMap: true,
        metalnessMap: true,
        emissiveMap: true,
        aoMap: false,
        envMap: true,
        displacementMap: false
      }
    };

    // Merge default options with provided options
    const config = { ...defaultOptions, ...options };
    config.effects = { ...defaultOptions.effects, ...options.effects };

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
    console.log("targetRing razi", targetRing);

    // Check stone type in targetRing's userData and select appropriate model
    if (targetRing.userData && targetRing.userData.StoneType) {
      const stoneType = targetRing.userData.StoneType;
      this.stoneTypeNumber = stoneType;
      console.log(`Stone type detected: ${stoneType}`);

      // Select model based on stone type
      switch (stoneType) {
        case "Smooth conversion":
          config.modelUrl = "diamondm/s11.glb";
          break;
        case "Pavé":
          config.modelUrl = "diamondm/d2.glb";
          break;
        case "Rail setting":
          config.modelUrl = "diamondm/d1.glb";
          break;
        case "Smooth Stone":
          config.modelUrl = "diamondm/c.glb";
          break;
        case "Rail setting Across":
          config.modelUrl = "diamondm/d1a.glb";
          break;
        case "Smooth setting Across":
          config.modelUrl = "diamondm/d2a.glb";
          break;  
        default:
          // Keep the default model url if stone type doesn't match
          console.log(`Using default diamond model for unknown stone type: ${stoneType}`);
      }
    } else {
      console.log("No stone type found in userData, using default diamond model");
    }

    // Handle scale options
    if (options.individualScale) {
      config.individualScale = {
        x: options.individualScale.x !== undefined ? options.individualScale.x : defaultOptions.individualScale.x,
        y: options.individualScale.y !== undefined ? options.individualScale.y : defaultOptions.individualScale.y,
        z: options.individualScale.z !== undefined ? options.individualScale.z : defaultOptions.individualScale.z
      };
    }

    // Adjust for uniform scale if provided
    if (options.uniformScale) {
      const scale = options.uniformScale;
      config.individualScale = { x: scale, y: scale, z: scale };
    }

    // Automatic scaling based on diamond count and base scale
    // More diamonds = smaller individual diamonds
    const sizeAdjustmentFactor = Math.max(0.9, 1 - (config.diamondCount / 40)); // Reduce size as count increases
    const adjustedScale = {
      x: config.individualScale.x * config.baseScale * sizeAdjustmentFactor,
      y: config.individualScale.y * config.baseScale * sizeAdjustmentFactor,
      z: config.individualScale.z * config.baseScale * sizeAdjustmentFactor * 0.6 // Reduce depth more to embed in ring
    };

    // Create a holder for all diamonds
    const diamondsHolder = new THREE.Object3D();
    diamondsHolder.name = "diamondsHolder";
    diamondsHolder.renderOrder = 1000; // Ensure diamonds are rendered on top
    targetRing.add(diamondsHolder);

    // Process distribution option
    let distributionSpacing = 1.0; // Default spacing multiplier
    let effectiveCoverage = config.coverage; // Default to the provided coverage

    // Update coverage based on distribution type
    switch (config.distribution) {
      case 'Together':
        // Stones are placed close together
        effectiveCoverage = 0.1; // Small portion of the ring
        distributionSpacing = 1.0;
        break;
      case 'Half stone distance':
        // Half-spaced stones
        effectiveCoverage = 0.25;
        distributionSpacing = 1.5;
        break;
      case 'Whole stone distance':
        // Normal spaced stones
        effectiveCoverage = 0.33;
        distributionSpacing = 2.0;
        break;
      case 'Double stone spacing':
        // Double-spaced stones
        effectiveCoverage = 0.5;
        distributionSpacing = 3.0;
        break;
      case 'A third ring':
        // Cover 1/3 of the ring 
        effectiveCoverage = 0.33;
        break;
      case 'Half ring':
        // Cover half of the ring
        effectiveCoverage = 0.5;
        break;
      case 'Whole ring':
        // Cover the entire ring
        effectiveCoverage = 1.0;
        break;
      default:
        // Use provided coverage if distribution option is not recognized
        console.log(`Unknown distribution type: ${config.distribution}, using default coverage`);
    }

    console.log(`Distribution: ${config.distribution}, Effective coverage: ${effectiveCoverage}`);

    // Calculate angles for diamond placement with proper coverage
    // For full coverage (coverage = 1), we need to distribute around 360 degrees (2*PI)
    // For half coverage (coverage = 0.5), we need 180 degrees (PI)
    const totalAngle = 2 * Math.PI * effectiveCoverage; // Total angle coverage based on distribution

    // Calculate angle step based on diamond count and distribution spacing
    const maxDiamondCounts = {
      'Together': 8,
      'Half stone distance': 12,
      'Whole stone distance': 15,
      'Double stone spacing': 20,
      'A third ring': 30,
      'Half ring': 50,
      'Whole ring': 69
    };

    // Get the maximum allowed for the current distribution type
    let maxAllowedDiamonds;
    if (config.distribution in maxDiamondCounts) {
      maxAllowedDiamonds = maxDiamondCounts[config.distribution];
    } else {
      // Default fallback if the distribution is not in our predefined list
      maxAllowedDiamonds = 4;
    }

    // Check if the provided diamond count exceeds the maximum allowed
    if (config.diamondCount > maxAllowedDiamonds) {
      // Create warning message with helpful information
      const warningMessage = `Too many diamonds (${config.diamondCount}) for "${config.distribution}" distribution.
      Maximum allowed: ${maxAllowedDiamonds}.
      Proceeding with ${maxAllowedDiamonds} diamonds instead.`;

      console.warn(warningMessage);

      // Show alert to user
      if (typeof alert === 'function') {
        alert(warningMessage);
      }

      // Adjust the diamond count to the maximum allowed
      config.diamondCount = maxAllowedDiamonds;
    }

    let angleStep = 0;
    if (config.diamondCount > 1) {
      // For "Together" and specific spacing options, adjust the angle step
      if (['Together', 'Half stone distance', 'Whole stone distance', 'Double stone spacing'].includes(config.distribution)) {
        // Calculate a base step and then apply spacing multiplier
        const baseStep = totalAngle / (config.diamondCount * distributionSpacing);
        angleStep = baseStep * distributionSpacing;
      } else {
        // For ring coverage options (third, half, whole), distribute evenly
        angleStep = totalAngle / config.diamondCount;
      }
    }


    const startAngle = config.startAngle - (totalAngle / 2);

    console.log(`Loading diamond model: ${config.modelUrl}`);
    console.log(`Diamond placement: count=${config.diamondCount}, coverage=${effectiveCoverage}, totalAngle=${totalAngle}, angleStep=${angleStep}`);

    // Load the diamond model once to reuse
    try {
      const gltf = await new Promise((resolve, reject) => {
        this.modelManager.loader.load(
          config.modelUrl,
          (gltf) => resolve(gltf),
          (xhr) => console.log(`Diamond loading: ${(xhr.loaded / xhr.total) * 100}% loaded`),
          (error) => reject(error)
        );
      });

      // Create and position each diamond
      const diamondModels = [];
      for (let i = 0; i < config.diamondCount; i++) {
        // Clone the original diamond model
        const diamondModel = gltf.scene.clone();
        diamondModel.name = `diamond_${i}`;
        diamondModel.renderOrder = 3; // Ensure diamond is rendered on top of the ring
        // Calculate the angle for this diamond
        const angle = startAngle + (i * angleStep);

        // Create individual holder for each diamond to manage its position
        const diamondHolder = new THREE.Object3D();
        diamondHolder.name = `diamondHolder_${i}`;
        diamondHolder.renderOrder = 3; // Ensure diamond is rendered on top of the ring
        // Position around the ring properly based on angle
        diamondHolder.position.set(
          Math.sin(angle) * config.baseRadius,  // X position around the circle
          Math.cos(angle) * config.baseRadius,  // Y position around the circle
          config.zOffset                        // Z offset to place on front face
        );

        // Apply scale consistently to all diamonds
        diamondModel.scale.set(
          adjustedScale.x,
          adjustedScale.y,
          adjustedScale.z
        );
       

        // Apply material properties
        diamondModel.traverse((child) => {
          if (child.isMesh && child.material) {
            // Clone the material to avoid affecting other instances
            child.material = child.material.clone();

            // Apply standard material properties
            child.material.metalness = 0.8;
            child.material.roughness = 0;

            // Apply texture if provided
            if (config.textureUrl && this.applyDiamondTexture) {
              this.applyDiamondTexture(
                diamondModel,
                config.textureUrl,
                config.effects
              );
            }
            child.material.depthWrite = true;
            child.material.depthTest = true;
            child.material.polygonOffset = false;
            child.material.stencilWrite = true;
            child.material.stencilRef = 2;
            child.material.stencilFunc = THREE.AlwaysStencilFunc;
            child.material.stencilZPass = THREE.ReplaceStencilOp;
            // Set renderOrder at the mesh level (higher than midMesh)
            child.renderOrder = 3;
            child.material.needsUpdate = true;
          }
        });
        diamondsHolder.renderOrder = 3;
        diamondHolder.renderOrder = 3
        diamondModels.renderOrder = 3// Ensure diamond is rendered on top of the ring
        // Add diamond to its holder, then add holder to the main holder
        diamondHolder.add(diamondModel);
        diamondsHolder.add(diamondHolder);
        diamondModels.push(diamondModel);
      }

      // Apply global adjustments to the entire diamond holder
      // diamondsHolder.rotation.x = Math.PI / 2;
      diamondsHolder.rotation.y = Math.PI / 2;
      diamondsHolder.position.x = -0.25;
      diamondsHolder.position.y = 0;
      console.log("diamondHolder numbeer", diamondsHolder.position)

      // Apply model-specific Z position adjustments
      const modelIndex = targetRing.userData?.modelIndex;
      if (modelIndex === 0) {
        // diamondsHolder.position.z += 0.011;
        diamondsHolder.scale.x += 0.013;
        diamondsHolder.scale.y += 0.013;
      }
      else if (modelIndex === 1) {
        // diamondsHolder.position.z += 0.02;
        // diamondsHolder.scale.z += 0.045;
        diamondsHolder.scale.x += 0.042;
        diamondsHolder.scale.y += 0.042;



      }
      else if (modelIndex == 2) {
        // diamondsHolder.scale.z += 0.045;
        diamondsHolder.scale.x += 0.042;
        diamondsHolder.scale.y += 0.042;
      }
      else if (modelIndex == 4) {
        // diamondsHolder.scale.z += 0.045;
        diamondsHolder.scale.x += 0.035;
        diamondsHolder.scale.y += 0.035;
      }
      else if (modelIndex == 5) {
        // diamondsHolder.scale.z += 0.045;
        diamondsHolder.scale.x += 0.005;
        diamondsHolder.scale.y += 0.005;
      }
      else if (modelIndex == 6) {
        // diamondsHolder.scale.z += 0.045;
        diamondsHolder.scale.x -= 0.027;
        diamondsHolder.scale.y -= 0.027;
      }
      else if (modelIndex == 7) {
        // diamondsHolder.scale.z += 0.045;
        // diamondsHolder.scale.x -= 0.05;
        // diamondsHolder.scale.y -= 0.05;
      }
      else if (modelIndex == 8) {
        // diamondsHolder.scale.z += 0.045;
        // diamondsHolder.scale.x -= 0.05;
        // diamondsHolder.scale.y -= 0.05;
      }
      else if (modelIndex == 9) {
        // diamondsHolder.scale.z += 0.045;
        diamondsHolder.scale.x += 0.035;
        diamondsHolder.scale.y += 0.035;
      }
      else if (modelIndex == 10) {
        // diamondsHolder.scale.z += 0.045;
        // diamondsHolder.scale.x += 0.035;
        // diamondsHolder.scale.y += 0.035;
      }
      else if (modelIndex == 11) {
        // diamondsHolder.scale.z += 0.045;
        diamondsHolder.scale.x += 0.023;
        diamondsHolder.scale.y += 0.023;
      }
      else if (modelIndex == 12) {
        // diamondsHolder.scale.z += 0.045;
        // diamondsHolder.scale.x += 0.035;
        // diamondsHolder.scale.y += 0.035;
      }
      else if (modelIndex == 13) {
        // diamondsHolder.scale.z += 0.045;
        // diamondsHolder.scale.x += 0.035;
        // diamondsHolder.scale.y += 0.035;
      }
      else if (modelIndex == 14) {
        // diamondsHolder.scale.z += 0.045;
        diamondsHolder.scale.x -= 0.027;
        diamondsHolder.scale.y -= 0.027;
      }
      // else if (modelIndex >= 6 && modelIndex <= 10) {
      //   diamondsHolder.position.z = 0.12;
      // }
      else {
        diamondsHolder.position.z = 0.14; // Default
      }

      diamondsHolder.children.forEach((holder, index) => {
        // Get the angle for this diamond
        const angle = startAngle + (index * angleStep);
      
        // Apply rotation to make diamond face outward correctly
        if (holder.children.length > 0) {
          const diamond = holder.children[0];
      
          // Reset rotation first to avoid compound rotations
          diamond.rotation.set(0, 0, 0);
          
          // For Rail setting Across, apply special rotation
          if (this.stoneTypeNumber == "Rail setting Across") {
            // Keep diamonds horizontal (like in first image)
            diamond.rotateX(-Math.PI / 2);
            diamond.rotateY(angle); // This makes diamonds follow the ring curvature
            diamond.rotateZ(-Math.PI / 2); // This keeps them horizontally aligned
          }
          // if(this.stoneTypeNumber == "Smooth setting Across") { 

          //   diamond.rotateX(-Math.PI / 2);
          //   diamond.rotateY(angle); // This makes diamonds follow the ring curvature
          //   diamond.rotateZ(Math.PI / 2); 
          // }
          else {
            // Standard rotation for other stone types
            diamond.rotateX(-Math.PI / 2);
            diamond.rotateY(angle); // This makes diamonds follow the ring
            diamond.rotateZ(Math.PI / 2); // Add this to keep diamonds horizontal
          }
        }
      });
      // this.applyStencilSettingsToAllDiamonds();


      console.log(`Added ${config.diamondCount} diamonds to the front of ring ${config.ringIndex}`);
      return diamondModels;
    } catch (error) {
      console.error('Error loading diamond models:', error);
      // Clean up if there was an error
      if (diamondsHolder) {
        targetRing.remove(diamondsHolder);
      }
      return Promise.reject(error);

    }

  }
  /**
   * Change the rotation of the diamond on a specific ring
   * @param {Object} rotation The rotation values { x, y, z }
   * @param {Number} ringIndex Which ring to modify (1 or 2, default: currently selected model)
   */
  applyStencilSettingsToAllDiamonds() {
    this.scene.traverse((object) => {
      if (object.name && (object.name.includes("diamond") || object.name.includes("diamondHolder"))) {
        object.renderOrder = 1000;

        object.traverse((child) => {
          if (child.isMesh && child.material) {
            // Apply stencil settings
            child.material.stencilWrite = true;
            child.material.stencilRef = 2;
            child.material.stencilFunc = THREE.AlwaysStencilFunc;
            child.material.stencilZPass = THREE.ReplaceStencilOp;

            child.material.depthTest = true;
            child.material.depthWrite = true;
            child.material.needsUpdate = true;
          }
        });
      }
    });
  }

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
    // Load the first texture (diamond texture)
    const texture = await new Promise((resolve, reject) => {
      textureLoader.load(
        textureUrl,
        (texture) => resolve(texture),
        undefined,
        (error) => reject(error)
      );
    });
  
    // Load the fire texture
    let textureUrlFire = 'diamondMap/diamond_fire.jpg';
    const textureFire = await new Promise((resolve, reject) => {
      textureLoader.load(
        textureUrlFire,
        (texture) => resolve(texture),
        undefined,
        (error) => reject(error)
      );
    });

    // Load the sparkle texture
    let textureUrlSparkle = 'diamondMap/diamond_sparkle.jpg';
    const textureSparkle = await new Promise((resolve, reject) => {
      textureLoader.load(
        textureUrlSparkle,
        (texture) => resolve(texture),
        undefined,
        (error) => reject(error)
      );
    });
    let textureUrlTriTop = 'diamondMap/diamond_top_triangles.png';
    const textureTriTop = await new Promise((resolve, reject) => {
      textureLoader.load(
        textureUrlTriTop,
        (texture) => resolve(texture),
        undefined,
        (error) => reject(error)
      );
    });
  
    // Configure textures with modern Three.js properties
    // Replace deprecated encoding with colorSpace
    texture.colorSpace = THREE.SRGBColorSpace;  
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    textureFire.colorSpace = THREE.SRGBColorSpace;
    textureFire.wrapS = THREE.RepeatWrapping;
    textureFire.wrapT = THREE.RepeatWrapping;
    // Make sure fire texture is not filtered too much
    textureFire.minFilter = THREE.LinearFilter;
    textureFire.magFilter = THREE.LinearFilter;
    
    textureSparkle.colorSpace = THREE.SRGBColorSpace;
    textureSparkle.wrapS = THREE.RepeatWrapping;
    textureSparkle.wrapT = THREE.RepeatWrapping;
  
    textureTriTop.colorSpace = THREE.SRGBColorSpace;
    textureTriTop.wrapS = THREE.RepeatWrapping;
    textureTriTop.wrapT = THREE.RepeatWrapping;
    // Make sure fire texture is not filtered too much
    textureTriTop.minFilter = THREE.LinearFilter; 
    textureTriTop.magFilter = THREE.LinearFilter;

    // Apply textures to all meshes in the diamond model
    diamondModel.traverse((child) => {
      if (child.isMesh && child.material) {
        // Create a new material or clone the existing one to ensure proper settings
        if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
          // Apply main texture to most map types
          if (effects.map) {
            // child.material.map = texture;
          }
    
          if (effects.normalMap) {
            child.material.normalMap = texture;
            // Children.material.alphaMap = textureSparkle; // Apply alpha map for transparency
            child.material.normalScale = new THREE.Vector2(1, 1);

          }
    
          if (effects.roughnessMap) {
            child.material.roughnessMap = textureTriTop;
            // Lower roughness for more shininess
            child.material.roughness = 0.1;
          }
    
          if (effects.metalnessMap) {
            // Use the sparkle texture for metallness to enhance the sparkle effect
            child.material.metalnessMap = textureSparkle;
            child.material.metalness = 0.7; // Higher metalness for better reflection
          }
    
          // Apply fire texture specifically to the emissive map with enhanced settings
          if (effects.emissiveMap) {
            child.material.emissiveMap = textureFire;
            child.material.emissive = new THREE.Color(1, 1, 1); // Full white for maximum color from texture
            child.material.emissiveIntensity = 1.2; // Increase intensity to make it more visible
          }
    
          if (effects.aoMap) {
            child.material.aoMap = texture;
            child.material.aoMapIntensity = 0.5; // Moderate AO effect
          }
    
          if (effects.envMap) {
            // child.material.envMap = texture;
            // child.material.envMapIntensity = 1.5; // Stronger environment mapping
          }
    
          if (effects.displacementMap) {
            child.material.displacementMap = texture;
            child.material.displacementScale = 0.05; // More subtle displacement
            child.material.displacementBias = 0;
          }
        }
  
        // Update the material properties
        child.material.depthWrite = true;
        child.material.depthTest = true;
        child.material.transparent = false;
        child.material.polygonOffset = false;
        child.renderOrder = 1000;
        
        // Make sure to update the material
        child.material.needsUpdate = true;
      }
    });

    // Log success message with detailed info
    console.log('Successfully applied textures to diamond model:', {
      mainTexture: textureUrl,
      fireTexture: textureUrlFire,
      sparkleTexture: textureUrlSparkle,
      effectsApplied: effects
    });
  
    return Promise.resolve();
  } catch (error) {
    // Improved error logging
    console.error('Error applying textures to diamond:', error);
    console.error('Context:', {
      mainTextureURL: textureUrl,
      fireTextureURL: 'diamondMap/diamond_fire.jpg',
      sparkleTextureURL: 'diamondMap/diamond_sparkle.jpg'
    });
    return Promise.reject(error);
  }
}

  /**
   * Remove diamond from a specific ring
   * @param {Number} ringIndex Which ring to remove the diamond from (1 or 2, default: 1)
   */
  removeDiamondsFromRing(ringIndex = 1) {
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

    // Try to find the diamondsHolder (with 's' - for multiple diamonds)
    let diamondsHolder = targetRing.getObjectByName("diamondsHolder");

    // If not found, try the original name (for backward compatibility)
    if (!diamondsHolder) {
      diamondsHolder = targetRing.getObjectByName("diamondHolder");
    }

    console.log(diamondsHolder, "diamondsHolder", targetRing, "targetRing");

    if (diamondsHolder) {
      // Recursively dispose of all children and their materials/geometries
      const disposeObject = (obj) => {
        // First dispose of all children
        while (obj.children.length > 0) {
          disposeObject(obj.children[0]);
          obj.remove(obj.children[0]);
        }

        // Then dispose of the object's geometry and materials
        if (obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            // Handle array of materials
            if (Array.isArray(obj.material)) {
              obj.material.forEach(material => material.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
      };

      // Dispose of all children in the diamonds holder
      disposeObject(diamondsHolder);

      // Remove the diamonds holder from the ring
      targetRing.remove(diamondsHolder);
      console.log(`Diamonds removed from ring ${ringIndex}`);
    } else {
      console.log(`No diamonds found on ring ${ringIndex}`);
    }
  }
  /**
   * Change the size of all diamonds on a ring
   * @param {String} value Size value (e.g., '1.0', '1.3', '1.5')
   * @param {Number} ringIndex Optional: Which ring to modify (defaults to currently selected model)
   */
  changeStoneSize(value, ringIndex = null) {
    // If no ringIndex is provided, use the currently selected model
    const targetRingIndex = ringIndex || this.modelManager.selectedModel;

    // Convert to array index (0-based)
    const ringArrayIndex = targetRingIndex - 1;

    // Verify ring exists
    if (ringArrayIndex < 0 || ringArrayIndex >= this.modelManager.currentDisplayedModels.length) {
      console.error(`Ring ${targetRingIndex} not found for resizing diamonds.`);
      return;
    }

    const targetRing = this.modelManager.currentDisplayedModels[ringArrayIndex];
    if (!targetRing) {
      console.error(`Ring model ${targetRingIndex} not found for resizing diamonds.`);
      return;
    }

    // Find the diamonds holder (with 's' for multiple diamonds)
    let diamondsHolder = targetRing.getObjectByName("diamondsHolder");

    // If not found, try the original name (for backward compatibility)
    if (!diamondsHolder) {
      diamondsHolder = targetRing.getObjectByName("diamondHolder");

      // If still not found, no diamonds to resize
      if (!diamondsHolder) {
        console.log(`No diamonds found on ring ${targetRingIndex} to resize.`);
        return;
      }
    }

    // Default base scale factor (for 1.0 mm)
    const baseScale = 19.7;

    // Calculate new scale based on the value
    let xyScale;

    if (value.includes("1.3")) {
      console.log("Setting diamond size to 1.3mm");
      // Increase by 30% on XY for 1.3 mm
      xyScale = baseScale * 1.15;
    } else if (value.includes("1.5")) {
      console.log("Setting diamond size to 1.5mm");
      // Increase by 50% on XY for 1.5 mm
      xyScale = baseScale * 1.2;
    } else {
      // Default size (1.0 mm)
      console.log("Setting diamond size to 1.0mm");
      xyScale = baseScale;
    }

    // Count how many diamonds were resized
    let diamondCount = 0;

    // For multi-diamond setup (diamondsHolder)
    if (diamondsHolder.name === "diamondsHolder") {
      // Iterate through all diamond holders
      diamondsHolder.children.forEach((holder, index) => {
        // Find the diamond model in each holder
        if (holder.children.length > 0) {
          const diamondModel = holder.children[0];

          // Get current Z scale to maintain proportions
          const currentZScale = diamondModel.scale.z;

          // Apply new scale to the diamond model (keep Z scale the same)
          diamondModel.scale.set(xyScale, xyScale, currentZScale);
          diamondCount++;
        }
      });
    }
    // For single diamond setup (original method)
    else {
      // Find the diamond model inside the holder
      let diamondModel = null;
      diamondsHolder.traverse((child) => {
        if (child.name === "diamond") {
          diamondModel = child;
        }
      });

      if (diamondModel) {
        // Get current Z scale to maintain proportions
        const currentZScale = diamondModel.scale.z;

        // Apply new scale to the diamond model
        diamondModel.scale.set(xyScale, xyScale, currentZScale);
        diamondCount = 1;
      }
    }

    console.log(`Changed ${diamondCount} diamond(s) size on ring ${targetRingIndex} to ${value} (Scale: ${xyScale})`);
  }

  /**
   * Change the position of all diamonds on a specific ring (left, middle, right)
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
      console.error(`Ring ${targetRingIndex} not found for repositioning diamonds.`);
      return;
    }

    const targetRing = this.modelManager.currentDisplayedModels[ringArrayIndex];
    if (!targetRing) {
      console.error(`Ring model ${targetRingIndex} not found for repositioning diamonds.`);
      return;
    }

    // Find the diamonds holder (with 's' for multiple diamonds)
    let diamondsHolder = targetRing.getObjectByName("diamondsHolder");
    // If not found, try the original name (for backward compatibility)
    if (!diamondsHolder) {
      diamondsHolder = targetRing.getObjectByName("diamondHolder");
      console.log("helo", diamondsHolder)

      // If still not found, no diamonds to reposition
      if (!diamondsHolder) {
        console.log(`No diamonds found on ring ${targetRingIndex} to reposition.`);
        return;
      }
    }

    // Set new position based on selected option
    let newX = 0; // Default (Middle)
    if (targetRing.getObjectByName("diamondHolder")) {
      switch (position) {
        case 'Left':
          newX += -0.05;
          break;
        case 'Right':
          newX += 0.05;
          break;
        case 'Middle':
          newX += 0;
          break;
        case 'Free':
          console.log("Free position not available");
          return;
        default:
          console.warn(`Unknown position: ${position}. Using 'Middle' as default.`);
          newX = 0;
      }
    }
    else {
      switch (position) {
        case 'Left':
          newX += -0.05;
          newX += -0.25;
          break;
        case 'Right':
          newX += 0.05;
          newX += -0.25;

          break;
        case 'Middle':
          newX += 0;
          newX = -0.25;

          break;
        case 'Free':
          console.log("Free position not available");
          return;
        default:
          console.warn(`Unknown position: ${position}. Using 'Middle' as default.`);
          newX = 0;
          newX = -0.25;

      }
    }
    // Current position of the diamond holder for offset calculation
    const currentX = diamondsHolder.position.x;

    // Calculate the offset to apply
    const offsetX = newX - currentX;

    // Apply the new X position to the entire diamond holder
    diamondsHolder.position.x = newX;

    console.log(`Changed diamond position on ring ${targetRingIndex} to ${position} (X: ${newX})`);
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
      console.error(`Ring ${targetRingIndex} not found for repositioning stones.`);
      return;
    }

    const targetRing = this.modelManager.currentDisplayedModels[ringArrayIndex];
    if (!targetRing) {
      console.error(`Ring model ${targetRingIndex} not found for repositioning stones.`);
      return;
    }

    // Find the diamonds holder (with 's' for multiple diamonds)
    let diamondsHolder = targetRing.getObjectByName("diamondsHolder");
    let isSingleDiamond = false;

    // If not found, try the original name (for backward compatibility)
    if (!diamondsHolder) {
      diamondsHolder = targetRing.getObjectByName("diamondHolder");
      isSingleDiamond = true;

      // If still not found, no diamonds to reposition
      if (!diamondsHolder) {
        console.log(`No stones found on ring ${targetRingIndex} to reposition.`);
        return;
      }
    }

    // Apply the new X position with offset adjustment
    // For diamondsHolder (multiple), adjust based on default offset of -0.25
    // For diamondHolder (single), use the position value directly
    const adjustedPositionValue = isSingleDiamond ? positionValue : positionValue - 0.25;
    diamondsHolder.position.x = adjustedPositionValue;

    // For user feedback, determine the position name based on the visual position
    // (same thresholds for both single and multiple cases)
    let positionName = "Center";
    if (positionValue < -0.03) positionName = "Left";
    else if (positionValue > 0.03) positionName = "Right";

    console.log(`Changed stone position on ring ${targetRingIndex} to ${positionName} (X: ${adjustedPositionValue.toFixed(3)})`);
  }
}