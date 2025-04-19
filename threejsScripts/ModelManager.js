import * as THREE from 'three';
import { CatmullRomCurve3 } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js';
import { PreciousMetal } from "./PreciousMetal";
// import  CSG  from '/utils/CSGMesh.js'
import Bender from '/utils/bender.js'
import { TextureLoader } from 'three';
// import { CSG } from 'three-bvh-csg';
// import { Brush, Evaluator, SUBTRACTION }  from 'three-bvh-csg';
// import {  Brush, Evaluator, SUBTRACTION  } from 'three-bvh-csg';




export class ModelManager {
  constructor(scene, PreciousMetal,renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.PreciousMetal = PreciousMetal
    this.models = [];
    this.currentDisplayedModels = [];
    this.currentModelIndex = 0;
    this.selectedModel = 1
    this.pair1 = true
    this.pair2 = false
    this.loader = new GLTFLoader();
    this.tatt = new TextGeometry();
    this.fontLoader = new FontLoader();
    // this.PreciousMetalIns = new pre
    this.currentFont = "./src/assets/fonts/Roboto_Regular.json";
    this.currentColor = "";
    this.shadowEnable = true;
    this.modelGroupRing1 = new THREE.Group();
    this.modelGroupRing2 = new THREE.Group();
    this.GrooveBool = true
    this.modelId = "P1";
    this.midMesh = null
    this.midMeshTri = null

    this.midMesh2 = null
    this.midMesh2Tri = null

    this.midmeshGroove1Ring1 = null
    this.midmeshGroove2Ring1 = null
    this.midmeshGroove3Ring1 = null
    this.midmeshGroove4Ring1 = null

    this.midmeshGroove1Ring2 = null
    this.midmeshGroove2Ring2 = null
    this.midmeshGroove3Ring2 = null
    this.midmeshGroove4Ring2 = null

    // this.scene.add(this.modelGroupRing1);
    // this.scene.add(this.modelGroupRing2);

    // this.loadMatCapTextures();
  }
  getCurrentDisplayedModels() {

    return this.currentDisplayedModels;

  }
  addShadowPair() {
    if (this.shadowEnable) {
      const textureLoader = new THREE.TextureLoader();
      // Load the PNG texture for the shadow
      const shadowTexture = textureLoader.load('./models/shadow.png', (texture) => {
        texture.flipY = true; // Correct orientation if needed
      });
  
      // Create materials with renderOrder to prevent z-fighting
      const shadowMaterial = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
      });
  
      // Create a plane for the first shadow
      this.shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        shadowMaterial.clone()
      );
  
      // Position the plane below the model
      this.shadowPlane.scale.set(0.7, 1.3, 1);
      this.shadowPlane.rotation.x = -Math.PI / 2; // Rotate to lie flat on the ground
      this.shadowPlane.position.y = -1.22; // Slightly below the model
      this.shadowPlane.renderOrder = 1;
  
      // Create second shadow
      this.shadowClone = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        shadowMaterial.clone()
      );
      this.shadowClone.scale.set(0.7, 1.3, 1);
      this.shadowClone.rotation.x = -Math.PI / 2;
      this.shadowClone.position.y = -1.221; // Slight offset to prevent z-fighting
      this.shadowClone.renderOrder = 2;
  
      // Create third shadow
      this.shadowCloneRing3 = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        shadowMaterial.clone()
      );
      this.shadowCloneRing3.scale.set(0.7, 1.3, 1);
      this.shadowCloneRing3.rotation.x = -Math.PI / 2;
      this.shadowCloneRing3.position.y = -1.222; // Slight offset to prevent z-fighting
      this.shadowCloneRing3.renderOrder = 3;
  
      // Create fourth shadow
      this.shadowCloneRing4 = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        shadowMaterial.clone()
      );
      this.shadowCloneRing4.scale.set(0.7, 1.3, 1);
      this.shadowCloneRing4.rotation.x = -Math.PI / 2;
      this.shadowCloneRing4.position.y = -1.223; // Slight offset to prevent z-fighting
      this.shadowCloneRing4.renderOrder = 4;
  
      // Add all shadows to the scene
      this.scene.add(this.shadowPlane);
      this.scene.add(this.shadowClone);
      this.scene.add(this.shadowCloneRing3);
      this.scene.add(this.shadowCloneRing4);
      
      // Initially hide all shadows
      this.shadowPlane.visible = false;
      this.shadowClone.visible = false;
      this.shadowCloneRing3.visible = false;
      this.shadowCloneRing4.visible = false;
      
      // Update shadow visibility based on ring visibility
      this.updateShadowPositions();
      
      this.shadowEnable = false;
    } }

  async loadModels(modelData) {
    this.modelLoadQueue = [...modelData]; // Keep track of original order
    this.models = new Array(modelData.length).fill(null); // Pre-allocate array with nulls
  
    return Promise.all([this.matcapPromise, this.highlightPromise])
      .then(() => {
        console.log("Matcaps loaded. Loading models...");
        
        const modelLoadPromises = modelData.map((data, index) => {
          return new Promise((resolve, reject) => {
            this.loader.load(data.glbPath, (gltf) => {
              const model = gltf.scene;
    // this.loadMidMesh();
              
              // Store model in the correct index position
              this.models[index] = model;
              
              model.traverse((child) => {
                if (child.isMesh && child.material) {
                  const originalMaterial = child.material;
  
                  // Apply the same material logic as provided for the midMesh
                  child.material = new THREE.MeshStandardMaterial({
                    color: originalMaterial.color || "#D8BC7E",
                    metalness: 0.7, // Metalness for a metallic effect
                    roughness: 0.1, // Smooth surface
                    map: originalMaterial.map, // Retain the original map
                    normalMap: originalMaterial.normalMap, // Retain the normal map
                    metalnessMap: originalMaterial.metalnessMap, // Retain the metalness map
                    roughnessMap: originalMaterial.roughnessMap, // Retain the roughness map
                    emissiveMap: originalMaterial.emissiveMap, // Retain the emissive map
                    emissive: originalMaterial.emissive, // Retain the emissive color
                    stencilWrite: true, // Enable stencil writing
                    stencilRef: 1, // Stencil reference value
                    stencilFunc: THREE.AlwaysStencilFunc, // Always pass stencil function
                    stencilZPass: THREE.ReplaceStencilOp, //
                  });
                  child.material.needsUpdate = true;
                }
              });
  
              model.visible = false;
              model.userData.modelIndex = index; // Store index for verification
              this.scene.add(model);
              resolve(model);
            }, undefined, (err) => reject(err));
          });
        });
  
        return Promise.all(modelLoadPromises);
      })
      .then( async (models) => {
        console.log("All models loaded.");
        // await this.loadStepMesh();
        // Verify models array is complete and in order
        const missingModels = this.models.findIndex(model => model === null);
        if (missingModels !== -1) {
          throw new Error(`Model loading incomplete or out of order at index ${missingModels}`);
        }
        
        this.currentColor = "#D8BC7E";
        this.switchModel(0, 1, true, false);
       
      })
      .catch((err) => {
        console.error("Error in model loading:", err);
      });
  }
  // Load models only after textures are loaded
 
  
 // Function to handle model-specific scaling



// Updated loadMidMesh function
async loadMidMesh(type, isTri) {
  if (type==undefined){
    type = "V-groove"
  }
  this.GrooveType = type;
  this.GrooveBoolTri = isTri;
  console.log("type", type);

  // Check if the midMesh is already loaded, reuse it instead of loading again
  if (this.midMesh) {
    console.log("Using cached midMesh");
    // this.midMesh.renderOrder = -1000;
    // Reset transformations before adding to the scene
    this.midMesh.scale.set(1, 1, 1);
    this.midMesh.position.set(0, 0, 0);

    // Get scaling values for the current model
    const { x, y, z } = this.GrooveManagerIns.getScaleForModel(this.modelId, type);
    this.midMesh.scale.set(x, y, z);
    this.midMesh.position.x = -0.7;
    
    this.scene.add(this.midMesh);
    // const targetRing = this.currentDisplayedModels[0];
    // targetRing.add(this.midMesh);
        this.midMesh.userData = "midMeshRing1";
    // Clone midMesh for the second ring
    if (!this.midMesh2) {
      this.midMesh2 = this.cloneModelWithUniqueMaterial(this.midMesh);
    }

    this.midMesh2.scale.set(x * 0.85, y * 0.85, z * 0.85);
    this.midMesh2.position.set(0.7, -0.15, 0);
    this.scene.add(this.midMesh2);

    if (isTri) {
      this.GrooveManagerIns.triGroovePair();
    }
    if(type=="Milgrain"){
      this.GrooveManagerIns.toggleMilgrainGroove(this.midMesh,true)
      this.GrooveManagerIns.toggleMilgrainGroove(this.midMesh2,true)

    }
    else{
      this.GrooveManagerIns.toggleMilgrainGroove(this.midMesh,false)
      this.GrooveManagerIns.toggleMilgrainGroove(this.midMesh2,false)

    }
    return { midMesh: this.midMesh, midMesh2: this.midMesh2 };
  }

  // If midMesh is not loaded, load it from file
  try {
    const gltf = await new Promise((resolve, reject) => {
      this.loader.load(
        "models/midMesh/DmidMesh.glb",
        (gltf) => resolve(gltf),
        undefined,
        (error) => reject(error)
      );
    });

    this.midMesh = gltf.scene;
    this.midMesh.renderOrder = 1;


    // Traverse and update material
    this.midMesh.traverse((child) => {
      if (child.isMesh && child.material) {
        const originalMaterial = child.material;
        child.material = new THREE.MeshStandardMaterial({
          color: "#D8BC7E",
          metalness: 0.9,
          roughness: 0.2,
          map: originalMaterial.map,
          normalMap: originalMaterial.normalMap,
          metalnessMap: originalMaterial.metalnessMap,
          roughnessMap: originalMaterial.roughnessMap,
          emissiveMap: originalMaterial.emissiveMap,
          emissive: originalMaterial.emissive,
          stencilWrite: true,
          stencilRef: 0,
          stencilFunc: THREE.NotEqualStencilFunc,
          stencilZPass: THREE.KeepStencilOp,
          depthWrite: true,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        });
        child.renderOrder = 1;
      }
    });

    // Get scaling values for the current model
    const { x, y, z } = this.GrooveManagerIns.getScaleForModel(this.modelId, type);
    this.midMesh.scale.set(x, y, z);
    this.midMesh.position.x = -0.7;

    // Add the first mesh to the scene
    this.scene.add(this.midMesh);
    // const targetRing = this.currentDisplayedModels[0];
// targetRing.add(this.midMesh);
    this.midMesh.userData = "midMeshRing1";

    // Clone the model with unique material
    this.midMesh2 = this.cloneModelWithUniqueMaterial(this.midMesh);
    this.midMesh2.userData = "midMeshRing2";
    this.midMesh2.scale.set(x * 0.85, y * 0.85, z * 0.85);
    this.midMesh2.position.set(0.7, -0.15, 0);
    this.midMesh2.renderOrder = 1


    // Add the second mesh to the scene
    this.scene.add(this.midMesh2);

    if (isTri) {
      this.GrooveManagerIns.triGroovePair();
    }
    if(type=="Milgrain"){
      this.GrooveManagerIns.toggleMilgrainGroove(this.midMesh,true)
      this.GrooveManagerIns.toggleMilgrainGroove(this.midMesh2,true)

    }
    else{
      this.GrooveManagerIns.toggleMilgrainGroove(this.midMesh,false)
      this.GrooveManagerIns.toggleMilgrainGroove(this.midMesh2,false)

    }
    // this.defaultValueWidth1 = this.midMesh.scale.x
    // this. defaultValueDepth1 = this.midMesh.scale.y
    // this. defaultValueWidth2 = this.midMesh2.scale.x
    // this. defaultValueDepth2 = this.midMesh2.scale.y

    console.log("Loaded and stored midMesh");

    return { midMesh: this.midMesh, midMesh2: this.midMesh2 };
  } catch (error) {
    console.error("Error loading midMesh:", error);
    throw error;
  }
}
async loadStepMesh(type, isTri) {

  try {
    const gltf = await new Promise((resolve, reject) => {
      this.loader.load(
        "models/midMesh/DmidMesh.glb",
        (gltf) => resolve(gltf),
        undefined,
        (error) => reject(error)
      );
    });

    this.stepMesh = gltf.scene;

    // Traverse and update material
    this.stepMesh.traverse((child) => {
      if (child.isMesh && child.material) {
        const originalMaterial = child.material;
        child.material = new THREE.MeshStandardMaterial({
          color: "#D8BC7E",
          metalness: 0.9,
          roughness: 0.2,
          map: originalMaterial.map,
          normalMap: originalMaterial.normalMap,
          metalnessMap: originalMaterial.metalnessMap,
          roughnessMap: originalMaterial.roughnessMap,
          emissiveMap: originalMaterial.emissiveMap,
          emissive: originalMaterial.emissive,
          stencilWrite: true,
          stencilRef: 0,
          stencilFunc: THREE.NotEqualStencilFunc,
          stencilZPass: THREE.KeepStencilOp,
          depthWrite: true,
          polygonOffset: true,
          polygonOffsetFactor: -14,
          polygonOffsetUnits: -14,
        });
      }
    });

    // Get scaling values for the current model
    const { x, y, z } = this.GrooveManagerIns.getScaleForModel(this.modelId, "Milgrain");
    this.stepMesh.scale.set(x, y, z);
    // this.stepMesh.position.x = -0.7;
    this.stepMesh2 = this.cloneModelWithUniqueMaterial(this.stepMesh);
    this.stepMesh2.scale.set(x * 0.85, y * 0.85, z * 0.85);
    this.stepMesh2.position.set(0.7, -0.15, 0);

    // Add the first mesh to the scene
    // this.scene.add(this.stepMesh);

}
catch (error) {
  console.error("Error loading midMeshStep:", error);
  throw error;
}

}

  
  optimalThicknessBool(value) {
    if (value) {
      this.optimalThickness = true
      console.log(this.optimalThickness)
    }
    else {
      this.optimalThickness = false
      console.log(this.optimalThickness)

    }

  }

  setOptimalThickness(selectedRingId, widthValue) {
    // Adjust the factor based on the width
    const minWidth = 1.0;
    const maxWidth = 12.0;

    // Normalize the width between a specific range
    const normalizedWidth = (widthValue - minWidth) / (maxWidth - minWidth) + 1;

    // Set optimal thickness based on width (you can adjust the logic here)
    const optimalThickness = normalizedWidth * 1.5; // Scale factor can be customized

    // Call the changeRingThickness function with the optimal thickness
    this.changeRingThickness(selectedRingId, optimalThickness.toFixed(2), false);

    console.log(`Optimal thickness set to ${optimalThickness.toFixed(2)} based on width ${widthValue}`);
  }

  changeRingWidth(selectedRingId, width, isPair = true) {
    if (selectedRingId == 1) {

      this.PreciousMetal.removeHelperModelAndClipping(1);

    }
    if (selectedRingId == 2) {

      this.PreciousMetal.removeHelperModelAndClipping(2);

    }
    const widthValue = parseFloat(width.replace(',', '.')); // Parse width from string to number
    if (isNaN(widthValue)) {
      console.warn('Invalid width value:', width);
      return;
    }

    const model = this.currentDisplayedModels[selectedRingId - 1];
    if (!model) {
      console.warn('Model not found for selectedRingId:', selectedRingId);
      return;
    }

    // Set the width of the selected ring
    model.scale.setX(widthValue * 0.15); // Multiply by a factor to convert to model scale
    console.log(`Ring ${selectedRingId} width changed to: ${widthValue}mm`);

    // If this.optimalThickness is true, set optimal thickness based on the width
    if (this.optimalThickness) {
      this.setOptimalThickness(selectedRingId, widthValue);
    }

    // If isPair is true, apply the same width to the second ring
    // if (isPair && this.currentDisplayedModels.length > 1) {
    //   const secondRing = this.currentDisplayedModels[1]; // Assuming the second ring is at index 1
    //   secondRing.scale.setX(widthValue * 10); // Apply the same width to the second ring
    // }
  }


  // Existing methods (loadModels, switchModel, etc.) will remain unchanged...
  changeRingThickness(selectedRingId, thickness, isPair = false) {
    // Convert thickness value to a float
    if (selectedRingId == 1) {

      this.PreciousMetal.removeHelperModelAndClipping(1);

    }
    if (selectedRingId == 2) {

      this.PreciousMetal.removeHelperModelAndClipping(2);

    }

    const thicknessValue = parseFloat(thickness.replace(',', '.'));
    if (isNaN(thicknessValue)) {
      console.warn('Invalid thickness value:', thickness);
      return;
    }

    const minThickness = 1.0;  // Define the minimum thickness (based on UI options)
    const maxThickness = 12.0; // Define the maximum thickness (based on UI options)

    // Normalize thickness scaling based on a factor (adjust the factor as necessary for your model)
    let thicknessFactor;
    if (selectedRingId == 2) { thicknessFactor = 0.8; }
    else {
      thicknessFactor = 1;
    }
    // const thicknessFactor = 100; // Adjust this based on the visual difference you want
    const normalizedThickness = (thicknessValue - minThickness) / (maxThickness - minThickness) + 1;

    // Retrieve the current model for the selected ring
    const model = this.currentDisplayedModels[selectedRingId - 1];
    if (!model) {
      console.warn('Model not found for selectedRingId:', selectedRingId);
      return;
    }
    console.log("model", normalizedThickness);
    // Apply thickness scaling based on normalized thickness
    model.scale.setY(normalizedThickness * thicknessFactor); // Adjust for Y axis
    model.scale.setZ(normalizedThickness * thicknessFactor); // Adjust for Z axis
   

    console.log(`Ring ${selectedRingId} thickness changed to: ${thicknessValue}mm`);
  }
  setSizeCountryWise(value) {
    if (value == 'F') {
      this.changeRingThickness(this.selectedModel, '1,20 mm')
    }
    else if (value == 'F½') {
      this.changeRingThickness(this.selectedModel, '1,40 mm')
    }
    else if (value == 'G') {
      this.changeRingThickness(this.selectedModel, '1,60 mm')
    }
    else if (value == 'G½') {
      this.changeRingThickness(this.selectedModel, '1,80 mm')
    }
    else if (value == 'H') {
      this.changeRingThickness(this.selectedModel, '2,00 mm')
    }
    else if (value == 'H½') {
      this.changeRingThickness(this.selectedModel, '2,20 mm')
    }
    else if (value == 'I') {
      this.changeRingThickness(this.selectedModel, '2,40 mm')
    }
    else if (value == 'I½') {
      this.changeRingThickness(this.selectedModel, '2,50 mm')
    }
    else if (value == 'J') {
      this.changeRingThickness(this.selectedModel, '2,70 mm')
    }
    else if (value == 'J½') {
      this.changeRingThickness(this.selectedModel, '2,70 mm')
    }


  }



  currentSelectedRing(id) {
    console.log("id is ", id)
    this.selectedModel = id
  }
  currentPairUpdate(value) {

    this.pair1 = value.pair1
    this.pair2 = value.pair2
    console.log("this.pap", this.pair1, this.pair2)
  }




  switchModel(index, selectedRingId = 1, pair1 = true, pair2 = false) {
    this.currentColor = "#D8BC7E";
    // this.GrooveManagerIns.removeMidMeshes();
  
    if (this.PreciousMetal.isEnable == true) {
      // this.PreciousMetal.removeHelperModelAndClipping(1);
      // this.PreciousMetal.removeHelperModelAndClipping(2);
    }
    else {
      // this.PreciousMetal.isEnable == false
    }
    
    if (index < 0 || index >= this.models.length) {
      console.warn('Invalid model index:', index);
      return;
    }
    
    // this.engraveTextOnModel("GGGGG")
    // Handle pairing logic
    console.log("chk 0", pair1, selectedRingId, this.pair1);
  
    this.selectedModel = selectedRingId; // Store which ring is selected
  
    if (selectedRingId == 1 || selectedRingId == 2) {
      // Change both 1st and 2nd rings
      this.showCurrentModels(index, this.pair1); // For 1st and 2nd rings
      // this.loadDiamondToRing({
      //   scale: 100
      // });
      console.log("chk 1");
      let prevVal = 0;
      if (this.PreciousMetal.isEnable == true) {
        console.log("chk 2");
  
        let ring1 = this.currentDisplayedModels[0];
        let ring2 = this.currentDisplayedModels[1];
        let triBool;
        if (this.PreciousMetal.currentVal) {
          prevVal = this.PreciousMetal.currentVal;
        }
        else {
          prevVal = "1:1";
        }
        if (this.PreciousMetal.triBool) {
          triBool = this.PreciousMetal.triBool;
        }
        console.log("chk aa", prevVal, triBool);
        if (prevVal == "Segment 1:1") {
          this.PreciousMetal.biTriPair(prevVal, false);
        }
        else {
          console.log("chk 3", selectedRingId, ring1, ring2);
          if (selectedRingId == 1) {
            this.PreciousMetal.removeHelperModelAndClipping(1);
          }
          else {
            this.PreciousMetal.removeHelperModelAndClipping(2);
          }
          this.PreciousMetal.biTriPair(prevVal, triBool);
        }
      }
    } else if (pair2) {
      // Change both 3rd and 4th rings
      this.showThirdModel(index, pair2);  // For 3rd ring
      this.showFourthModel(index, pair2); // For 4th ring
    } else {
      // Only change the selected ring
      if (selectedRingId === 1) {
        this.currentModelIndex = index;
        this.showCurrentModels(index, false); // Only update first ring
        // this.applyColorToModel(this.currentDisplayedModels[0], "#D8BC7E")
      } else if (selectedRingId === 2) {
        this.currentModelIndex = index;
        this.showSecondModel(index); // Use our new function for the second ring
        // this.applyColorToModel(this.currentDisplayedModels[1], "#D8BC7E")
      } else if (selectedRingId === 3 && this.currentDisplayedModels[2]) {
        this.currentModelIndex = index;
        this.showThirdModel(index, false);
      } else if (selectedRingId === 4 && this.currentDisplayedModels[3]) {
        this.currentModelIndex = index;
        this.showFourthModel(index, false);
      } else {
        console.warn("Invalid ring selection for model switching.");
      }
    }
    
    // Ensure proper positions for all rings
    this.updateRingPositions();
  }

  showCurrentModels(index, pair1 = false) {
    const model = this.models[index];
    const model1 = this.cloneModelWithUniqueMaterial(model);
    
    if (this.pair1 && pair1) {
      // Create and set up second model when showing as a pair
      const model2 = this.cloneModelWithUniqueMaterial(model);
      
      // Hide both models before showing new ones
      this.hideFirstTwoModels();
  
      // Add both models back to the scene
      this.scene.add(model1);
      model1.visible = true;
      this.currentDisplayedModels[0] = model1;
  
      // Set scale to exactly 0.85 for the second model
      model2.scale.set(0.85, 0.85, 0.85); 
      this.scene.add(model2);
      model2.visible = true;
      this.currentDisplayedModels[1] = model2;
      
      this.applyColorToModel(model1, "#D8BC7E");
      this.applyColorToModel(model2, "#D8BC7E");
      this.addShadowPair();
    } else {
      // Only replace the first model
      if (this.currentDisplayedModels[0]) {
        this.scene.remove(this.currentDisplayedModels[0]);
      }
      
      this.scene.add(model1);
      this.applyColorToModel(model1, "#D8BC7E");
      model1.visible = true;
      this.currentDisplayedModels[0] = model1;
    }
  
    // Update all ring positions based on how many are visible
    this.updateRingPositions();
  }
  showSecondModel(index) {
    // Remove the old second model if it exists
    if (this.currentDisplayedModels[1]) {
      this.scene.remove(this.currentDisplayedModels[1]);
    }
    
    // Clone the model and ensure it has a unique material
    const model2 = this.cloneModelWithUniqueMaterial(this.models[index]);
    
    // Set the scale to exactly 0.85
    model2.scale.set(0.85, 0.85, 0.85);
    
    // Make it visible and add to scene
    model2.visible = true;
    this.scene.add(model2);
    
    // Store in the array and apply color
    this.currentDisplayedModels[1] = model2;
    this.applyColorToModel(model2, "#D8BC7E");
    
    // Update positions of all rings
    this.updateRingPositions();
  }
  /**
   * Shows the third model
   * @param {number} index - The model index to display
   * @param {boolean} pair2 - Whether to show as a pair with fourth model
   */
  showThirdModel(index, pair2 = false) {
    const model3 = this.models[index].clone();
    
    // If pairing for 3rd and 4th models is active
    if (pair2) {
      const model4 = this.models[index].clone();
      
      if (this.currentDisplayedModels[2]) {
        this.scene.remove(this.currentDisplayedModels[2]);
      }
      if (this.currentDisplayedModels[3]) {
        this.scene.remove(this.currentDisplayedModels[3]);
      }
  
      // Set the scale to exactly 0.85
      model3.scale.set(0.85, 0.85, 0.85);
      model4.scale.set(0.85, 0.85, 0.85);
      
      this.scene.add(model3);
      model3.visible = true;
      this.currentDisplayedModels[2] = model3;
  
      this.scene.add(model4);
      model4.visible = true;
      this.currentDisplayedModels[3] = model4;
      
      this.applyColorToModel(model3, "#D8BC7E");
      this.applyColorToModel(model4, "#D8BC7E");
    } else {
      // Only switch the third model
      if (this.currentDisplayedModels[2]) {
        this.scene.remove(this.currentDisplayedModels[2]);
      }
      
      // Set the scale to exactly 0.85
      model3.scale.set(0.85, 0.85, 0.85);
      
      this.scene.add(model3);
      model3.visible = true;
      this.currentDisplayedModels[2] = model3;
      this.applyColorToModel(model3, "#D8BC7E");
    }
    
    // Update all ring positions based on how many are visible
    this.updateRingPositions();
  }
  
  /**
   * Shows the fourth model
   * @param {number} index - The model index to display
   * @param {boolean} pair2 - Whether to show as a pair with third model
   */
  showFourthModel(index, pair2 = false) {
    const model4 = this.models[index].clone();
    
    if (pair2) {
      const model3 = this.models[index].clone();
      
      // Remove both third and fourth models if they exist
      if (this.currentDisplayedModels[2]) {
        this.scene.remove(this.currentDisplayedModels[2]);
      }
      if (this.currentDisplayedModels[3]) {
        this.scene.remove(this.currentDisplayedModels[3]);
      }
      
      // Set the scale to exactly 0.85
      model3.scale.set(0.85, 0.85, 0.85);
      model4.scale.set(0.85, 0.85, 0.85);
      
      this.scene.add(model3);
      model3.visible = true;
      this.currentDisplayedModels[2] = model3;
      
      this.scene.add(model4);
      model4.visible = true;
      this.currentDisplayedModels[3] = model4;
      
      this.applyColorToModel(model3, "#D8BC7E");
      this.applyColorToModel(model4, "#D8BC7E");
    } else {
      // Just switch the fourth model
      if (this.currentDisplayedModels[3]) {
        this.scene.remove(this.currentDisplayedModels[3]);
      }
      
      // Set the scale to exactly 0.85
      model4.scale.set(0.85, 0.85, 0.85);
      
      this.scene.add(model4);
      model4.visible = true;
      this.currentDisplayedModels[3] = model4;
      this.applyColorToModel(model4, "#D8BC7E");
    }
    
    // Update all ring positions based on how many are visible
    this.updateRingPositions();
  }
  
  /**
   * Helper method to count visible models
   * @returns {number} - Number of visible models
   */
  countVisibleModels() {
    return this.currentDisplayedModels.filter(m => m && m.visible).length;
  }
  
  /**
   * Updates positions of all rings based on how many are visible
   */
  updateRingPositions() {
    const numVisible = this.countVisibleModels();
  
    // Position rings based on how many are visible
    switch (numVisible) {
      case 1:
        // Single ring centered
        if (this.currentDisplayedModels[0] && this.currentDisplayedModels[0].visible) {
          this.currentDisplayedModels[0].position.set(0, 0, 0);
        } else if (this.currentDisplayedModels[1] && this.currentDisplayedModels[1].visible) {
          this.currentDisplayedModels[1].position.set(0, -0.15, 0);
          this.currentDisplayedModels[1].scale.set(0.85, 0.85, 0.85);
        } else if (this.currentDisplayedModels[2] && this.currentDisplayedModels[2].visible) {
          this.currentDisplayedModels[2].position.set(0, -0.15, 0);
          this.currentDisplayedModels[2].scale.set(0.85, 0.85, 0.85);
        } else if (this.currentDisplayedModels[3] && this.currentDisplayedModels[3].visible) {
          this.currentDisplayedModels[3].position.set(0, -0.15, 0);
          this.currentDisplayedModels[3].scale.set(0.85, 0.85, 0.85);
        }
        break;
  
      case 2:
        // Two rings positioned left and right
        let leftIndex = -1, rightIndex = -1;
        
        // Find the first two visible models
        for (let i = 0; i < this.currentDisplayedModels.length; i++) {
          if (this.currentDisplayedModels[i] && this.currentDisplayedModels[i].visible) {
            if (leftIndex === -1) {
              leftIndex = i;
            } else {
              rightIndex = i;
              break;
            }
          }
        }
        
        // Position the two visible models
        if (leftIndex !== -1) {
          // First ring at y=0, others at y=-0.15
          this.currentDisplayedModels[leftIndex].position.set(-0.7, leftIndex === 0 ? 0 : -0.15, 0);
          if (leftIndex > 0) { // Apply scale to non-first rings
            this.currentDisplayedModels[leftIndex].scale.set(0.85, 0.85, 0.85);
          }
        }
        if (rightIndex !== -1) {
          // First ring at y=0, others at y=-0.15
          this.currentDisplayedModels[rightIndex].position.set(0.7, rightIndex === 0 ? 0 : -0.15, 0);
          if (rightIndex > 0) { // Apply scale to non-first rings
            this.currentDisplayedModels[rightIndex].scale.set(0.85, 0.85, 0.85);
          }
        }
        break;
  
      case 3:
        // Three rings - special arrangement
        let first = -1, second = -1, third = -1;
        
        // Find the three visible models
        for (let i = 0; i < this.currentDisplayedModels.length; i++) {
          if (this.currentDisplayedModels[i] && this.currentDisplayedModels[i].visible) {
            if (first === -1) {
              first = i;
            } else if (second === -1) {
              second = i;
            } else {
              third = i;
              break;
            }
          }
        }
        
        // Position the three visible models
        if (first !== -1) {
          // First ring at y=0, others at y=-0.15
          this.currentDisplayedModels[first].position.set(-1.1, first === 0 ? 0 : -0.15, 0);
          if (first > 0) { // Apply scale to non-first rings
            this.currentDisplayedModels[first].scale.set(0.85, 0.85, 0.85);
          }
        }
        if (second !== -1) {
          // First ring at y=0, others at y=-0.15
          this.currentDisplayedModels[second].position.set(0, second === 0 ? 0 : -0.15, 0);
          if (second > 0) { // Apply scale to non-first rings
            this.currentDisplayedModels[second].scale.set(0.85, 0.85, 0.85);
          }
        }
        if (third !== -1) {
          // First ring at y=0, others at y=-0.15
          this.currentDisplayedModels[third].position.set(1.1, third === 0 ? 0 : -0.15, 0);
          if (third > 0) { // Apply scale to non-first rings
            this.currentDisplayedModels[third].scale.set(0.85, 0.85, 0.85);
          }
        }
        break;
  
      case 4:
        // Four rings - evenly spaced
        // Position all four rings with even spacing
        if (this.currentDisplayedModels[0] && this.currentDisplayedModels[0].visible) {
          this.currentDisplayedModels[0].position.set(-1.5, 0, 0); // First ring at y=0
        }
        if (this.currentDisplayedModels[1] && this.currentDisplayedModels[1].visible) {
          this.currentDisplayedModels[1].position.set(-0.5, -0.15, 0); // Lower position for scaled ring
          this.currentDisplayedModels[1].scale.set(0.85, 0.85, 0.85);
        }
        if (this.currentDisplayedModels[2] && this.currentDisplayedModels[2].visible) {
          this.currentDisplayedModels[2].position.set(0.5, -0.15, 0); // Lower position for scaled ring
          this.currentDisplayedModels[2].scale.set(0.85, 0.85, 0.85);
        }
        if (this.currentDisplayedModels[3] && this.currentDisplayedModels[3].visible) {
          this.currentDisplayedModels[3].position.set(1.5, -0.15, 0); // Lower position for scaled ring
          this.currentDisplayedModels[3].scale.set(0.85, 0.85, 0.85);
        }
        break;
    }
    
    // Update shadow positions to match ring positions
    this.updateShadowPositions();
  }
  
  /**
   * Updates shadow positions to match ring positions
   */
  updateShadowPositions() {
    if (!this.shadowPlane) return;
  
    const numVisible = this.countVisibleModels();
    
    // Hide all shadows first
    if (this.shadowPlane) this.shadowPlane.visible = false;
    if (this.shadowClone) this.shadowClone.visible = false;
    if (this.shadowCloneRing3) this.shadowCloneRing3.visible = false;
    if (this.shadowCloneRing4) this.shadowCloneRing4.visible = false;
    
    // Then show and position only the shadows for visible rings
    let shadowIndex = 0;
    
    for (let i = 0; i < this.currentDisplayedModels.length; i++) {
      if (this.currentDisplayedModels[i] && this.currentDisplayedModels[i].visible) {
        const position = this.currentDisplayedModels[i].position.x;
        
        // Assign position to the appropriate shadow
        if (shadowIndex === 0 && this.shadowPlane) {
          this.shadowPlane.position.x = position;
          this.shadowPlane.position.y = -1.22;
          this.shadowPlane.visible = true;
        } else if (shadowIndex === 1 && this.shadowClone) {
          this.shadowClone.position.x = position;
          this.shadowClone.position.y = -1.221;
          this.shadowClone.visible = true;
        } else if (shadowIndex === 2 && this.shadowCloneRing3) {
          this.shadowCloneRing3.position.x = position;
          this.shadowCloneRing3.position.y = -1.222;
          this.shadowCloneRing3.visible = true;
        } else if (shadowIndex === 3 && this.shadowCloneRing4) {
          this.shadowCloneRing4.position.x = position;
          this.shadowCloneRing4.position.y = -1.223;
          this.shadowCloneRing4.visible = true;
        }
        
        shadowIndex++;
      }
    }
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
  };

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

  // * Adds a second model to the scene
  // * @param {string} type - The type of ring to add (Wedding, engagement, memoir)
  // * @param {Object} selectedRing - The ring selection information
  // */
 addSecondModel(type, selectedRing = null) {
   this.PreciousMetal.removeHelperModelAndClipping(1);
   this.PreciousMetal.removeHelperModelAndClipping(2);
   let model2;
   // console.log("loraaaaa",selectedRing)
   
   if (type == "engagement") {
     console.log("aaaaa", this.EngagementRingsins);
     this.EngagementRingsins.loadEngRingById(selectedRing.id);
     this.currentDisplayedModels[0].position.x = -0.7;
     if (this.shadowPlane != undefined) {
       this.shadowPlane.position.x = -0.7;
     }
     if (this.shadowClone != undefined) {
       this.shadowClone.visible = true;
       this.shadowClone.position.x = 0.7;
     }
     return;
   }
   
   if (type == "memoir") {
     console.log("raaaaa memoir", this.MemoirRingsins);
     this.MemoirRingsins.loadMemoirRingById(selectedRing.id);
     this.currentDisplayedModels[0].position.x = -0.7;
     if (this.shadowPlane != undefined) {
       this.shadowPlane.position.x = -0.7;
     }
     if (this.shadowClone != undefined) {
       this.shadowClone.visible = true;
       this.shadowClone.position.x = 0.7;
     }
     return;
   }
   
   // Load the second model based on the selectedRing or type
   if (type == "Wedding" && selectedRing && selectedRing.id >= 0 && selectedRing.id < this.models.length) {
     console.log("aaaaa");
     model2 = this.cloneModelWithUniqueMaterial(this.models[selectedRing.id]);
     model2.userData.modelId = selectedRing.id; // Store model ID for tracking
   } else if (type === "Wedding") {
     model2 = this.cloneModelWithUniqueMaterial(this.currentDisplayedModels[0]); // Clone the first model
   } else {
     console.warn("Invalid type or selectedRing for second model");
     return;
   }
 
   // Position the first and second models correctly
   this.currentDisplayedModels[0].position.set(-0.7, 0, 0); // First model on the left
 
   model2.position.set(0.7, -0.15, 0); // Second model on the right
   model2.scale.set(0.85, 0.85, 0.85); // Scale down the second model - Ensure it's exactly 0.85
   
   if (this.PreciousMetal.helperModel) {
     this.PreciousMetal.helperModel.position.x = -0.7;
   }
   
   //set shadow
   this.shadowPlane.position.x = -0.7;
   this.shadowClone.visible = true;
   
   // Add the second model to the scene
   this.scene.add(model2);
   model2.visible = true;
 
   // Store the second model in the currentDisplayedModels array
   this.currentDisplayedModels.push(model2);
 }
 
 /**
  * Adds a third model to the scene
  * @param {string} type - The type of ring to add
  * @param {Object} selectedRing - The ring selection information
  */
 async addThirdModel(type, selectedRing = null) {
   let model3;
   console.log("type 15", type, selectedRing);
 
   if (type.toLowerCase().includes("engage")) {
     console.log("aaaaa", this.EngagementRingsins);
     await this.EngagementRingsins.loadEngRingById(selectedRing.id);
     
     // Position all models for 3 rings
     this.currentDisplayedModels[0].position.set(-1.1, 0, 0); // First model left
     this.currentDisplayedModels[1].position.set(0, -0.15, 0); // Second model center, with lower y
     
     // Ensure third model is properly scaled if it exists
     if (this.currentDisplayedModels[2]) {
       this.currentDisplayedModels[2].position.set(1.1, -0.15, 0); // Third model right
       this.currentDisplayedModels[2].scale.set(0.85, 0.85, 0.85); // Ensure proper scale
     }
     
     // Position shadows
     this.shadowPlane.position.x = -1.1;
     this.shadowClone.position.x = 0;
     this.shadowCloneRing3.position.x = 1.1;
     this.shadowCloneRing3.visible = true;
     
     return;
   }
   
   if (type.toLowerCase().includes("memoir")) {
     console.log("raaaaa memoir", this.MemoirRingsins);
     await this.MemoirRingsins.loadMemoirRingById(selectedRing.id);
     
     // Position all models for 3 rings
     this.currentDisplayedModels[0].position.set(-1.1, 0, 0); // First model left
     this.currentDisplayedModels[1].position.set(0, -0.15, 0); // Second model center, with lower y
     
     // Ensure third model is properly scaled if it exists
     if (this.currentDisplayedModels[2]) {
       this.currentDisplayedModels[2].position.set(1.1, -0.15, 0); // Third model right
       this.currentDisplayedModels[2].scale.set(0.85, 0.85, 0.85); // Ensure proper scale
     }
     
     // Position shadows
     this.shadowPlane.position.x = -1.1;
     this.shadowClone.position.x = 0;
     this.shadowCloneRing3.position.x = 1.1;
     this.shadowCloneRing3.visible = true;
     
     return;
   }
   else {
     if (selectedRing && selectedRing.id >= 0 && selectedRing.id < this.models.length) {
       model3 = this.models[selectedRing.id].clone();
       model3.userData.modelId = selectedRing.id;  // Store model ID for tracking
     } else if (type === "Wedding") {
       model3 = this.currentDisplayedModels[0].clone();
     } else {
       console.warn('Invalid type or selectedRing for third ring');
       return;
     }
     console.warn('daasdasdassdInvalid tdasdasdsaype or selectedRing for third ring');
 
     // Position the models for 3 rings
     this.currentDisplayedModels[0].position.set(-1.1, 0, 0); // First model left
     this.currentDisplayedModels[1].position.set(0, -0.15, 0); // Second model center, with lower y
     
     // Position and scale third model
     model3.position.set(1.1, -0.15, 0); // Third model right, with lower y
     model3.scale.set(0.85, 0.85, 0.85); // Ensure proper scale of 0.85
     
     // Position shadows
     this.shadowPlane.position.x = -1.1;
     this.shadowClone.position.x = 0;
     this.shadowCloneRing3.position.x = 1.1;
     this.shadowCloneRing3.visible = true;
     
     // Add the third model to the scene
     this.scene.add(model3);
     model3.visible = true;
 
     // Store the third model
     this.currentDisplayedModels.push(model3);
   }
 }
 
 /**
  * Adds a fourth model to the scene
  * @param {string} type - The type of ring to add
  * @param {Object} selectedRing - The ring selection information
  */
 async addFourthModel(type, selectedRing = null) {
   try {
     console.log("Adding fourth model - type:", type, "selectedRing:", selectedRing);
     
     if (type && type.toLowerCase().includes("engage") || 
         (selectedRing && selectedRing.name && selectedRing.name.toLowerCase().includes("engage"))) {
       console.log("Adding fourth model as Engagement ring");
       await this.EngagementRingsins.loadEngRingById(selectedRing.id);
       
       // Position all models for 4 rings
       this.currentDisplayedModels[0].position.set(-1.5, 0, 0);  // First model far left
       this.currentDisplayedModels[1].position.set(-0.5, -0.15, 0);  // Second model left-mid, with lower y
       this.currentDisplayedModels[2].position.set(0.5, -0.15, 0);   // Third model right-mid, with lower y
       
       // Ensure fourth model is properly scaled if it exists
       if (this.currentDisplayedModels[3]) {
         this.currentDisplayedModels[3].position.set(1.5, -0.15, 0);   // Fourth model far right, with lower y
         this.currentDisplayedModels[3].scale.set(0.85, 0.85, 0.85); // Ensure proper scale
       }
       
       // Position shadows
       this.shadowPlane.position.x = -1.5;
       this.shadowClone.position.x = -0.5;
       this.shadowCloneRing3.position.x = 0.5;
       this.shadowCloneRing3.visible = true;
       this.shadowCloneRing4.position.x = 1.5;
       this.shadowCloneRing4.visible = true;
       
       return;
     } 
     else if (type && type.toLowerCase().includes("memoir") || 
             (selectedRing && selectedRing.name && selectedRing.name.toLowerCase().includes("memoir"))) {
       console.log("Adding fourth model as Memoir ring");
       await this.MemoirRingsins.loadMemoirRingById(selectedRing.id);
       
       // Position all models for 4 rings
       this.currentDisplayedModels[0].position.set(-1.5, 0, 0);  // First model far left
       this.currentDisplayedModels[1].position.set(-0.5, -0.15, 0);  // Second model left-mid, with lower y
       this.currentDisplayedModels[2].position.set(0.5, -0.15, 0);   // Third model right-mid, with lower y
       
       // Ensure fourth model is properly scaled if it exists
       if (this.currentDisplayedModels[3]) {
         this.currentDisplayedModels[3].position.set(1.5, -0.15, 0);   // Fourth model far right, with lower y
         this.currentDisplayedModels[3].scale.set(0.85, 0.85, 0.85); // Ensure proper scale
       }
       
       // Position shadows
       this.shadowPlane.position.x = -1.5;
       this.shadowClone.position.x = -0.5;
       this.shadowCloneRing3.position.x = 0.5;
       this.shadowCloneRing3.visible = true;
       this.shadowCloneRing4.position.x = 1.5;
       this.shadowCloneRing4.visible = true;
       
       return;
     }
     else {
       // Original logic for standard models
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
 
       // Position the models for 4 rings
       this.currentDisplayedModels[0].position.set(-1.5, 0, 0);  // First model far left
       this.currentDisplayedModels[1].position.set(-0.5, -0.15, 0);  // Second model left-mid, with lower y
       this.currentDisplayedModels[2].position.set(0.5, -0.15, 0);   // Third model right-mid, with lower y
       
       // Position and scale fourth model
       model4.position.set(1.5, -0.15, 0);  // Fourth model far right, with lower y
       model4.scale.set(0.85, 0.85, 0.85);  // Ensure proper scale of 0.85
       
       // Position shadows
       this.shadowPlane.position.x = -1.5;
       this.shadowClone.position.x = -0.5;
       this.shadowCloneRing3.position.x = 0.5;
       this.shadowCloneRing3.visible = true;
       this.shadowCloneRing4.position.x = 1.5;
       this.shadowCloneRing4.visible = true;
 
       // Add the fourth model to the scene
       this.scene.add(model4);
       model4.visible = true;
 
       // Store the fourth model
       this.currentDisplayedModels.push(model4);
     }
   } catch (error) {
     console.error("Error adding fourth model:", error);
   }
 }
  // Remove the third model
  // * Removes the third model and repositions the remaining rings
  // */
 removeThirdModel() {
   if (this.currentDisplayedModels.length < 3) {
     console.warn('No third model to remove');
     return;
   }
 
   // Remove the third model from the scene
   const model3 = this.currentDisplayedModels.pop();
   this.scene.remove(model3);
 
   // Re-position the first two models
   this.currentDisplayedModels[0].position.set(-0.7, 0, 0);  // First model to the left
   this.currentDisplayedModels[1].position.set(0.7, -0.15, 0);   // Second model to the right, at y=-0.15
   
   // Ensure second model has correct scale
   this.currentDisplayedModels[1].scale.set(0.85, 0.85, 0.85);
   
   // Update shadows
   if (this.shadowPlane) this.shadowPlane.position.x = -0.7;
   if (this.shadowClone) {
     this.shadowClone.position.x = 0.7;
     this.shadowClone.visible = true;
   }
   if (this.shadowCloneRing3) this.shadowCloneRing3.visible = false;
 }
 
 /**
  * Sets the current model name
  * @param {string} model - The model name
  */
 setCurrentModelName(model) {
   this.currentModel = model;
   console.log("current model name", model);
 }
 
 /**
  * Removes the fourth model and adjusts positions
  */
 removeFourthModel() {
   if (this.currentDisplayedModels.length < 4) {
     console.warn('No fourth model to remove');
     return;
   }
 
   // Remove the fourth model from the scene
   const model4 = this.currentDisplayedModels.pop();
   this.scene.remove(model4);
 
   // Adjust positions for three models
   this.currentDisplayedModels[0].position.set(-1.1, 0, 0); // First model
   this.currentDisplayedModels[1].position.set(0, -0.15, 0); // Second model with y offset
   this.currentDisplayedModels[2].position.set(1.1, -0.15, 0); // Third model with y offset
   
   // Ensure proper scale for second and third models
   this.currentDisplayedModels[1].scale.set(0.85, 0.85, 0.85);
   this.currentDisplayedModels[2].scale.set(0.85, 0.85, 0.85);
   
   // Update shadows
   if (this.shadowPlane) this.shadowPlane.position.x = -1.1;
   if (this.shadowClone) {
     this.shadowClone.position.x = 0;
     this.shadowClone.visible = true;
   }
   if (this.shadowCloneRing3) {
     this.shadowCloneRing3.position.x = 1.1;
     this.shadowCloneRing3.visible = true;
   }
   if (this.shadowCloneRing4) this.shadowCloneRing4.visible = false;
   
   console.log("removeFourth", this.currentDisplayedModels, this.models);
 }
 
 /**
  * Removes the second model and resets to a single model
  */
 removeSecondModel() {
   this.pair1 = false;
   this.PreciousMetal.removeHelperModelAndClipping(1);
   this.PreciousMetal.removeHelperModelAndClipping(2);
   this.PreciousMetal.removeClippingTriOneRing();
   this.PreciousMetal.isEnable = false;
   
   window.parent.postMessage(
     {
       action: "removeSecondModel",
       payload: {
         pair1: this.pair1,
       },
     },
     "*"
   );
   
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
   
   // Update shadows
   if (this.shadowPlane) this.shadowPlane.position.x = 0;
   if (this.shadowClone) this.shadowClone.visible = false;
 }
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

    console.log(`Color ${color} applied to the model.`);
  }

  

  changeModelColor(colorValue, isPair = false) {
    console.log("colorvalue", colorValue);
    // Function to determine color intensity based on the color
    const getColorIntensity = (color) => {
      // Define custom intensities for specific colors
      const intensityMap = {
        '#A09F9D': 2.0, // silver
        '#E9D4A4': 2.14, // Gold
        '#D99058': 1.8, // apricot gold
        '#B76E79': 1.2, //rose gold
        '#C2412D': 1.0, // red Gold
      };

      return intensityMap[color.toUpperCase()] || 2.0; // Default intensity if color not listed
    };

    this.currentColor = colorValue;

    const applyColorToMaterial = (model, colorIntensity) => {
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.color = new THREE.Color(colorValue); // Set the color normally
          child.material.needsUpdate = true; // Ensure the material updates
        }
      });
    };

    // Determine intensity for the selected color (not used here but kept for consistency)
    const colorIntensity = getColorIntensity(colorValue);

    // Apply color to the selected model
    const model = this.currentDisplayedModels[this.selectedModel - 1];
    if (!model) {
      console.warn('Model not found for selectedRingId:', this.selectedModel);
      return;
    }
    applyColorToMaterial(model, colorIntensity);
    console.log(`Color changed for ring ${this.selectedModel} to: ${colorValue} with intensity ${colorIntensity}`);

    // If pair1 is active and isPair is true, change color for both ring 1 and ring 2
    if (this.pair1 && this.currentDisplayedModels.length > 1) {
      const ring1 = this.currentDisplayedModels[0]; // Ring 1
      const ring2 = this.currentDisplayedModels[1]; // Ring 2
      applyColorToMaterial(ring1, colorIntensity);
      applyColorToMaterial(ring2, colorIntensity);
      console.log(`Color changed for pair1 (ring 1 and ring 2) to: ${colorValue} with intensity ${colorIntensity}`);
    }

    // If pair2 is active and isPair is true, change color for both ring 3 and ring 4
    if (this.pair2 && this.currentDisplayedModels.length > 3) {
      const ring3 = this.currentDisplayedModels[2]; // Ring 3
      const ring4 = this.currentDisplayedModels[3]; // Ring 4
      applyColorToMaterial(ring3, colorIntensity);
      applyColorToMaterial(ring4, colorIntensity);
      console.log(`Color changed for pair2 (ring 3 and ring 4) to: ${colorValue} with intensity ${colorIntensity}`);
    }
  }



  engraveTextOnModel(text, options = {}) {
    console.log("Engraving...");
    
    // Default configurations for each font based on this.fontIndex
    const fontConfigurations = {
      1: {
        size: 0.45,

        height: 0.05,
        depthOffset: 0.34,
        color: this.currentColor,
        position: { x: 0, y: -0.5, z: -0.6 },
        rotation: { x: -0.5, y: 0, z: 1.55 },
      },
      2: {
        size: 0.45,

        height: 0.05,
        depthOffset: 0.34,
        color: this.currentColor,
        position: { x: 0, y: -0.5, z: -0.6 },
        rotation: { x: -0.5, y: 0, z: 1.55 },
      },
      3: {
        size: 0.45,

        height: 0.05,
        depthOffset: 0.34,
        color: this.currentColor,
        position: { x: 0, y: -0.5, z: -0.6 },
        rotation: { x: -0.5, y: 0, z: 1.55 },
      },
      4: {
        size: 0.45,
        height: 0.05,
        depthOffset: 0.34,
        color: this.currentColor,
        position: { x: 0, y: -0.5, z: -0.6 },
        rotation: { x: -0.5, y: 0, z: 1.55 },
      },
    };
  
    // Select the configuration for the current font index or use defaults
    const config = fontConfigurations[this.fontIndex] || fontConfigurations[1];
  
    // Overwrite configuration with options if provided
    const {
      size = config.size,
      height = config.height,
      depthOffset = config.depthOffset,
      color = config.color,
      position = config.position,
      rotation = config.rotation,
    } = options;
  
    // Load the font based on the currentFont path
    this.fontLoader.load(this.currentFont, (font) => {
      const createEngraving = (model) => {
        const textGeometry = new TextGeometry(text, {
          font: font,
          size: size,
          height: height
        });
  
        // Center the text geometry
        textGeometry.computeBoundingBox();
        textGeometry.center();
        const bender = new Bender();
        // Apply bending if needed
        console.log("model", model)
        if(model.userData.modelIndex==0 ){   

            bender.bend(textGeometry, "y", Math.PI/10.7);

          }
          else if (model.userData.modelIndex==1){

            bender.bend(textGeometry, "y", Math.PI/10.75);
          }
          else if (model.userData.modelIndex==2){

            bender.bend(textGeometry, "y", Math.PI/10.75);


          }
          else if (model.userData.modelIndex==3){

            bender.bend(textGeometry, "y", Math.PI/10.75);



          }
          else if (model.userData.modelIndex==4){

            bender.bend(textGeometry, "y", Math.PI/11.5);


          }
          else if (model.userData.modelIndex==5){

            bender.bend(textGeometry, "y", Math.PI/11); 


          }
          else if (model.userData.modelIndex==6){

            bender.bend(textGeometry, "y", Math.PI/10.8);


          }
          else if (model.userData.modelIndex==7){

            bender.bend(textGeometry, "y", Math.PI/11);
          }
          else if (model.userData.modelIndex==8){

            bender.bend(textGeometry, "y", Math.PI/11);
          }
          else if (model.userData.modelIndex==9){

            bender.bend(textGeometry, "y", Math.PI/11); 

          }
        else if (model.userData.modelIndex==10){
          
          bender.bend(textGeometry, "y", Math.PI/11);


          }
          else if (model.userData.modelIndex==11){
            bender.bend(textGeometry, "y", Math.PI/11);


          }
        else if (model.userData.modelIndex==12){
          bender.bend(textGeometry, "y", Math.PI/10.75); 
        }
        else if (model.userData.modelIndex==13){
          bender.bend(textGeometry, "y", Math.PI/10.65);
        }
        else if (model.userData.modelIndex==14){    
          bender.bend(textGeometry, "y", Math.PI/10.8);


        }
          else{
            bender.bend(textGeometry, "y", Math.PI/10.75);

          }
      

        

  
        // Instead of using CSG operations (which aren't working),
        // we'll modify our approach to create an engraved appearance:
        
        // 1. First, create the text mesh
        const textMaterial = new THREE.MeshStandardMaterial({
          color: color,
          metalness: 0.5,
          roughness: 0.7,
          // Make the material slightly transparent to give depth
          transparent: true,
          opacity: 0.4,
          // Use depthWrite: false to prevent z-fighting
          depthWrite: false,
          side: THREE.FrontSide 
        });
  
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.name = "engravingText";
  
        // 2. Position the text correctly on the ring
        textMesh.position.set(
          position.x,
          position.y,
          position.z - depthOffset // Position it slightly inset into the model
        );
        textMesh.rotation.set(rotation.x, rotation.y, rotation.z);
        textMesh.scale.set(0.3, 0.3, 0.3);
        
        // 3. Create a slightly larger backing mesh with the ring's material color but darker
        // This creates the illusion of depth
        const backingGeometry = textGeometry.clone();
        const backingMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color).multiplyScalar(0.3), // Darker version of the same color
          metalness: 0.5,
          roughness: 0.7,
        depthWrite: true,
          // polygonOffset: true,
          // polygonOffsetFactor: -1.1,
          // polygonOffsetUnits: 1,   
          side: THREE.FrontSide 
             });
        
        const backingMesh = new THREE.Mesh(backingGeometry, backingMaterial);
        // backingMesh.name = "engravingBackground";
        backingMesh.position.copy(textMesh.position);

        if(model.userData.modelIndex==0 ){   
console.log("model 1")

          backingMesh.position.z += 0.0585; // Slightly behind the text
          backingMesh.position.y += 0.0193;

        }
        else if (model.userData.modelIndex==1){
          console.log("model 2",model.userData.modelIndex)

          backingMesh.position.z += 0.058; // Slightly behind the text
          backingMesh.position.y += 0.019

        }
        else if(model.userData.modelIndex==2){
console.log("model 3")
          backingMesh.position.z += 0.0385; // Slightly behind the text
          backingMesh.position.y += 0.0098;
        }
        else if(model.userData.modelIndex==3){
          console.log("model 4")
          backingMesh.position.z += 0.03; // Slightly behind the text
          backingMesh.position.y += 0.005;
                  }
        else if (model.userData.modelIndex==4){

          backingMesh.position.z += 0.033; // Slightly behind the text
          backingMesh.position.y += 0.005;

        }
        else if (model.userData.modelIndex==5){

          backingMesh.position.z += 0.025; // Slightly behind the text
          backingMesh.position.y += 0.005;

        }
        else if (model.userData.modelIndex==6){

          backingMesh.position.z += 0.06; // Slightly behind the text
          backingMesh.position.y += 0.02;

        }
        else if (model.userData.modelIndex==7){

          backingMesh.position.z += 0.025; // Slightly behind the text
          backingMesh.position.y += 0.005;

        }
        else if (model.userData.modelIndex==8){
          backingMesh.position.z += 0.02; // Slightly behind the text
          // backingMesh.position.y += 0.015

        }
        else if (model.userData.modelIndex==9){
          backingMesh.position.z -= 0.0037; // Slightly behind the text
          backingMesh.position.y -= 0.004;

        }
        else if (model.userData.modelIndex==10){
          backingMesh.position.z += 0.02; // Slightly behind the text
          // backingMesh.position.y += 0.015

        }
        else if (model.userData.modelIndex==11){
          backingMesh.position.z += 0.035; // Slightly behind the text
          backingMesh.position.y += 0.008;

        }
        else if (model.userData.modelIndex==12){
          backingMesh.position.z += 0.0385; // Slightly behind the text
          backingMesh.position.y += 0.006;

        }
        else if (model.userData.modelIndex==13){
          backingMesh.position.z += 0.018; // Slightly behind the text
          // backingMesh.position.y += 0.015

        }
        else if (model.userData.modelIndex==14){
          backingMesh.position.z += 0.06; // Slightly behind the text
          backingMesh.position.y += 0.02;

        }
        else{
          backingMesh.position.z += 0.06; // Slightly behind the text
          backingMesh.position.y += 0.02;

        }
        // Slightly behind the text

        backingMesh.rotation.copy(textMesh.rotation);
        backingMesh.scale.copy(textMesh.scale);
        backingMesh.scale.multiplyScalar(1); // Slightly larger
        
        // Add both meshes to the model
        backingMesh.name = "test"
        textMesh.name = "test"
        model.add(backingMesh);
        model.add(textMesh);
        
        console.log(`Engraved text "${text}" on the model`, this.currentFont);
      };
  
      // Handle engraving for the selected model or both models in the pair
      if (this.pair1 && this.currentDisplayedModels.length > 1) {
        // Engrave on both ring 1 and ring 2 if pair1 is active
        const ring1 = this.currentDisplayedModels[0];
        const ring2 = this.currentDisplayedModels[1];
  
        if (ring1) createEngraving(ring1);
        if (ring2) createEngraving(ring2);
  
        console.log(`Engraved text "${text}" on both pair1 rings.`);
      } else {
        // Engrave only on the selected model
        const model = this.currentDisplayedModels[this.selectedModel - 1];
        if (!model) {
          console.warn('Model not found for selectedRingId:', this.selectedModel);
          return;
        }
        createEngraving(model);
        console.log(`Engraved text "${text}" on model ${this.selectedModel}`);
      }
    });
  }

  
  removeEngraving() {
    console.log("Removing engraving...");

    const removeTextFromModel = (model) => {
      const childrenToRemove = [];
      model.traverse((child) => {
        if (child.isMesh && child.name === "test") {
          childrenToRemove.push(child);

        }
      });

      // Remove the identified children
      childrenToRemove.forEach((child) => {
        // console.log("Removing engraving...2",child);
        model.remove(child);
        child.geometry.dispose();
        child.material.dispose();
        child.visible = false;
        // console.log("Removing engraving...3",child);

      });

      // console.log("All meshes named 'test' removed from model.");
    };

    // Handle removal for both models in the pair if `pair1` is active
    if (this.pair1 && this.currentDisplayedModels.length > 1) {
      const ring1 = this.currentDisplayedModels[0];
      const ring2 = this.currentDisplayedModels[1];

      if (ring1) removeTextFromModel(ring1);
      if (ring2) removeTextFromModel(ring2);

      console.log("Engraving removed from both pair1 rings.");
    } else {
      // Remove engraving from the selected model
      const model = this.currentDisplayedModels[this.selectedModel - 1];
      if (!model) {
        console.warn("Model not found for selectedRingId:", this.selectedModel);
        return;
      }
      removeTextFromModel(model);
      console.log(`Engraving removed from model ${this.selectedModel}`);
    }
  }




  changeFont(fontIndex) {
    const fontPaths = [
      './src/assets/fonts/Roboto_Regular.json', // Font 1
      './src/assets/fonts/optimer_regular.typeface.json', // Font 2
      './src/assets/fonts/gentilis.json', // Font 3
      './src/assets/fonts/optimer_regular.typeface.json', // Font 4
      './src/assets/fonts/helvetiker_regular.typeface.json', // Font 5
      './src/assets/fonts/droid_serif_regular.json', // Font 6
    ];

    if (fontIndex === -1) {
      this.currentFont = './src/assets/fonts/Love_Romance_Regular.json';
      console.log(`Font changed to: ${this.currentFont}`);
      return Promise.resolve(); // Resolve immediately for special case
    }

    // Validate the font index
    if (fontIndex < 1 || fontIndex > fontPaths.length) {
      console.warn(
        `Invalid font index: ${fontIndex}. Please choose a number between 1 and ${fontPaths.length}.`
      );
      return Promise.reject(new Error("Invalid font index."));
    }

    // Set the current font path
    const selectedFontPath = fontPaths[fontIndex - 1];
    this.currentFont = selectedFontPath;
    this.fontIndex = fontIndex;

    console.log(`Attempting to load font: ${this.currentFont}`);

    // Load the font using fetch
    return new Promise((resolve, reject) => {
      fetch(this.currentFont)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to load font: ${this.currentFont}, Status: ${response.status}`
            );
          }
          return response.json(); // Ensure the response is valid JSON
        })
        .then((data) => {
          console.log(`Font loaded successfully: ${this.currentFont}`);
          resolve(data);
        })
        .catch((error) => {
          console.error(`Error loading font: ${this.currentFont}`, error.message);
          reject(error);
        });
    });
  }
  fixRenderingOrder() {
    // First, set proper render order on scene level
    this.scene.traverse((object) => {
      // Get all diamonds (assuming they have "diamond" in their name)
      if (object.name && (object.name.includes("diamond") || object.name.includes("diamondHolder"))) {
        object.renderOrder = 4;
        
        // Also traverse the diamond meshes to set individual renderers
        object.traverse((child) => {
          if (child.isMesh) {
            child.renderOrder = 4;
            
            // Ensure diamond materials have proper settings
            if (child.material) {
              child.material.depthWrite = true;
              child.material.depthTest = true;
              child.material.transparent = false;
              child.material.polygonOffset = false;
              child.material.needsUpdate = true;
            }
          }
        });
      }
      
      // Set midMesh render order
      if (object.userData === "midMeshRing1" || object.userData === "midMeshRing2") {
        object.renderOrder = 1;
        
        // Also traverse the midMesh to set individual renderers
        object.traverse((child) => {
          if (child.isMesh) {
            child.renderOrder = 1;
          }
        });
      }
    });
    
    // Force a render update
    if (this.renderer) {
      this.renderer.clearDepth();
      this.renderer.render(this.scene, this.camera);
    }
  }


}