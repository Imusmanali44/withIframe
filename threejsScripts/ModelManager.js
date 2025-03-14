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
import {  Brush, Evaluator, SUBTRACTION  } from 'three-bvh-csg';




export class ModelManager {
  constructor(scene, PreciousMetal) {
    this.scene = scene;
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

    this.loadMatCapTextures();
  }
  getCurrentDisplayedModels() {

    return this.currentDisplayedModels;

  }
  addShadowPair() {
    if (this.shadowEnable) {
      const textureLoader = new TextureLoader();
      // Load the PNG texture for the shadow
      const shadowTexture = textureLoader.load('./models/shadow.png', (texture) => {
        texture.flipY = true; // Correct orientation if needed
      });

      // Create a plane for the shadow
      this.shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2), // Adjust size to fit your model
        new THREE.MeshBasicMaterial({
          map: shadowTexture,
          transparent: true,
          polygonOffset: true, // Enable polygon offset
          polygonOffsetFactor: -1, // Push the shadow further back
          polygonOffsetUnits: -1  // Ensure the shadow PNG's transparency works
        })
      );

      // Position the plane below the model
      this.shadowPlane.scale.set(0.7, 1.3, 1)
      this.shadowPlane.rotation.x = -Math.PI / 2; // Rotate to lie flat on the ground
      this.shadowPlane.position.y = -1.22; // Slightly below the model to avoid z-fighting
      this.shadowPlane.position.x = -0.7; // Slightly below the model to avoid z-fighting

      this.shadowClone = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2), // Adjust size to fit your model
        new THREE.MeshBasicMaterial({
          map: shadowTexture,
          transparent: true,
          polygonOffset: true, // Enable polygon offset
          polygonOffsetFactor: -1, // Push the shadow further back
          polygonOffsetUnits: -1  // Ensure the shadow PNG's transparency works
        })
      );
      this.shadowClone.scale.set(0.7, 1.3, 1)

      this.shadowClone.rotation.x = -Math.PI / 2; // Rotate to lie flat on the ground
      this.shadowClone.position.y = -1.22;
      this.shadowClone.position.x = 0.7
      // Add the shadow plane to the scene
      this.scene.add(this.shadowPlane);
      this.scene.add(this.shadowClone);
      this.shadowEnable = false;

    }
  }
  loadMatCapTextures() {
    // const textureLoader = new THREE.TextureLoader();

    // // Create promises for matcap and highlight textures
    // this.matcapPromise = new Promise((resolve, reject) => {
    //   textureLoader.load('./models/mat/MatCap.jpg', (texture) => {
    //     this.matcapTexture = texture;
    //     this.matcapTexture.needsUpdate = true;
    //     resolve();
    //   }, undefined, (err) => reject(err));
    // });

    // this.highlightPromise = new Promise((resolve, reject) => {
    //   textureLoader.load('./models/mat/MatCap2.jpg', (texture) => {
    //     this.highlightTexture = texture;
    //     this.highlightTexture.needsUpdate = true;
    //     resolve();
    //   }, undefined, (err) => reject(err));
    // });

    // console.log("Loading matcaps...");
  }
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
    
    // Reset transformations before adding to the scene
    this.midMesh.scale.set(1, 1, 1);
    this.midMesh.position.set(0, 0, 0);

    // Get scaling values for the current model
    const { x, y, z } = this.GrooveManagerIns.getScaleForModel(this.modelId, type);
    this.midMesh.scale.set(x, y, z);
    this.midMesh.position.x = -0.7;
    
    this.scene.add(this.midMesh);

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
          polygonOffsetFactor: -14,
          polygonOffsetUnits: -14,
        });
      }
    });

    // Get scaling values for the current model
    const { x, y, z } = this.GrooveManagerIns.getScaleForModel(this.modelId, type);
    this.midMesh.scale.set(x, y, z);
    this.midMesh.position.x = -0.7;

    // Add the first mesh to the scene
    this.scene.add(this.midMesh);
    this.midMesh.userData = "midMeshRing1";

    // Clone the model with unique material
    this.midMesh2 = this.cloneModelWithUniqueMaterial(this.midMesh);
    this.midMesh2.userData = "midMeshRing2";
    this.midMesh2.scale.set(x * 0.85, y * 0.85, z * 0.85);
    this.midMesh2.position.set(0.7, -0.15, 0);

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
    // const applyThicknessScaling = (mesh) => {
    //   if (mesh.name.includes('Sides')) {
    //     // Sides mesh: Increase height vertically (Y-axis)
    //     mesh.scale.y = normalizedThickness;
    //   } else if ( mesh.name.includes('Outer')) {
    //     // Inner and outer meshes: Scale X and Z to expand radius proportionally
    //     // const radiusScale = 1 + (thicknessValue - minThickness) * radiusScaleFactor;
    //     mesh.scale.y = normalizedThickness ;
    //     // mesh.scale.z = normalizedThickness;
    //   }
    //   else if ( mesh.name.includes('Inner')) {
    //     // Inner and outer meshes: Scale X and Z to expand radius proportionally
    //     // const radiusScale = 1 + (thicknessValue - minThickness) * radiusScaleFactor;
    //     mesh.scale.y += 0.1 ;
    //     // mesh.scale.z = normalizedThickness;
    //   }
    // };

    // // Traverse the model and apply scaling
    // model.traverse((child) => {
    //   if (child.isMesh) {
    //     applyThicknessScaling(child);
    //   }
    // });
    // If pairing is enabled, apply the same scaling to the second ring in the pair
    // if (isPair && this.currentDisplayedModels.length > selectedRingId) {
    //   const secondRing = this.currentDisplayedModels[selectedRingId]; // Assuming the next ring in the pair
    //   secondRing.scale.setY(normalizedThickness * thicknessFactor); // Adjust Y axis for second ring
    //   secondRing.scale.setZ(normalizedThickness * thicknessFactor); // Adjust Z axis for second ring
    // }

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
    console.log("chk 0", pair1, selectedRingId, this.pair1)

    if (selectedRingId == 1 || selectedRingId == 2) {

      // Change both 1st and 2nd rings
      this.showCurrentModels(index, this.pair1); // For 1st and 2nd rings
      // this.loadDiamondToRing({
      //   scale: 100
      // });
      console.log("chk 1")
      let prevVal = 0
      if (this.PreciousMetal.isEnable == true) {
        console.log("chk 2")

        let ring1 = this.currentDisplayedModels[0]
        let ring2 = this.currentDisplayedModels[1]
        let triBool
        if (this.PreciousMetal.currentVal) {
          prevVal = this.PreciousMetal.currentVal
        }
        else {
          prevVal = "1:1"
        }
        if (this.PreciousMetal.triBool) {
          triBool = this.PreciousMetal.triBool
        }
        console.log("chk aa", prevVal, triBool)
        if (prevVal == "Segment 1:1") {
          this.PreciousMetal.biTriPair(prevVal, false)
        }
        else {
          console.log("chk 3", selectedRingId, ring1, ring2)
          if (selectedRingId == 1) {

            this.PreciousMetal.removeHelperModelAndClipping(1);

          }
          else {

            this.PreciousMetal.removeHelperModelAndClipping(2);

          }

          this.PreciousMetal.biTriPair(prevVal, triBool)
        }

      }
    } else if (pair2) {

      // Change both 3rd and 4th rings
      this.showThirdModel(index, pair2);  // For 3rd ring
      this.showFourthModel(index, pair2); // For 4th ring
    } else {
      // Only change the selected ring
      if (selectedRingId === 1 || selectedRingId === 2) {
        this.currentModelIndex = index;
        this.showCurrentModels(index);
        // this.applyColorToModel(this.currentDisplayedModels[0], "#D8BC7E")

        // this.applyColorToModel(this.currentDisplayedModels[1], "#D8BC7E")

      } else if (selectedRingId === 3 && this.currentDisplayedModels[2]) {
        this.currentModelIndex = index;

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

    // If pairing for 3rd and 4th models is active
    if (pair2) {

      this.scene.remove(this.currentDisplayedModels[2]);
      this.scene.remove(this.currentDisplayedModels[3]);

      model3.position.set(1.0, 0, 0); // Position the third model
      model4.position.set(1.5, 0, 0); // Position the fourth model
      model4.scale.set(0.85, 0.85, 0.85); // Scale down the fourth model

      this.scene.add(model3);
      this.scene.add(model4);
      model3.visible = true;
      model4.visible = true;
      this.currentDisplayedModels[2] = model3;
      this.currentDisplayedModels[3] = model4;
    } else {
      // Only switch the third model if no pair is active
      if (!this.currentDisplayedModels[3]) {
        // console.log("hello", this.currentDisplayedModels[3])
        this.scene.remove(this.currentDisplayedModels[2]); // Remove old third model
        model3.position.set(1.0, 0, 0); // Position new third model 
        this.scene.add(model3);
        model3.visible = true;
        this.currentDisplayedModels[2] = model3;
      }
      else {
        // console.log("hello 2", this.currentDisplayedModels[3])

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
      // console.log("pair yes 2")
      // Set positions for third and fourth models
      model3.position.set(0.5, 0, 0);  // Position third model
      model4.position.set(1.5, 0, 0);  // Position fourth model
      model4.scale.set(0.85, 0.85, 0.85);    // Scale down the fourth model

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
      // console.log("pair no 2")

      this.scene.remove(this.currentDisplayedModels[3]);  // Remove the current fourth model
      model4.position.set(1.5, 0, 0);  // Set position for new fourth model
      model4.scale.set(1, 1, 1); // Reset scale
      this.scene.add(model4);
      model4.visible = true;

      // Update the fourth model in the array
      this.currentDisplayedModels[3] = model4;
    }
  }

  showCurrentModels(index, pair1 = false) {
    const model = this.models[index];
    const model1 = this.cloneModelWithUniqueMaterial(model);
    const model2 = this.cloneModelWithUniqueMaterial(model);

    if (this.pair1) {
      // Hide both models before showing new ones
      // console.log("razi 1", this.pair1)
      this.hideFirstTwoModels();

      // Set positions for both models
      model1.position.set(-0.7, 0, 0); // First model (left)
      model2.position.set(0.7, -0.15, 0); // Second model (right)
      model2.scale.set(0.85, 0.85, 0.85); // Scale down the second model

      // Add both models back to the scene
      this.scene.add(model1);
      model1.visible = true;
      this.currentDisplayedModels[0] = model1;

      this.scene.add(model2);
      model2.visible = true;
      this.currentDisplayedModels[1] = model2;
      this.applyColorToModel(model1, "#D8BC7E")
      this.applyColorToModel(model2, "#D8BC7E")
      this.addShadowPair()

    } else {
      console.log("razi 2", this.pair1, this.currentDisplayedModels.length, this.PreciousMetal.isEnable)
      // if(this.currentDisplayedModels.length==1){
      //       this.hideFirstTwoModels();
      //       this.currentDisplayedModels[0] = model1;

      //       model1.position.set(0, 0, 0);
      //       this.scene.add(model1);
      //       model1.visible = true;
      //     this.PreciousMetal.removeHelperModelAndClipping(1);
      //   this.PreciousMetal.removeHelperModelAndClipping(2);
      //   this.scene.remove(this.currentDisplayedModels[0]); 
      //   if(this.PreciousMetal.isEnable){

      //   this.PreciousMetal.biColorOneRing("1:1")


      // }  
      // return;

      //   }
      // Only hide and switch the selected model, keep the other intact
      if (this.selectedModel === 1) {
        this.scene.remove(this.currentDisplayedModels[0]); // Remove old first model
        model1.position.set(-0.7, 0, 0); // Place new model in the left position
        this.scene.add(model1);
        this.applyColorToModel(model1, "#D8BC7E")

        model1.visible = true;
        this.currentDisplayedModels[0] = model1; // Update the first model
      } else if (this.selectedModel === 2) {
        this.scene.remove(this.currentDisplayedModels[1]);
        this.applyColorToModel(model2, "#D8BC7E")
        // Remove old second model

        // Adjust positioning based on whether third and fourth models exist
        if (this.currentDisplayedModels.length > 3) {
          model2.position.set(-0.5, 0, 0); // Shift second model left if third and fourth exist
          this.currentDisplayedModels[2].position.set(0.5, 0, 0); // Adjust third model
        } else {
          model2.position.set(0.7, -0.15, 0); // Keep second model on the right if no third or fourth models
        }

        model2.scale.set(0.85, 0.85, 0.85); // Scale down the second model
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

  // // Clone the model with unique materials
  // const clonedModel = cloneModelWithUniqueMaterial(selectedModel);

  // // Add the cloned model to the scene
  // scene.add(clonedModel);

  // console.log("Cloned model with unique materials added to the scene.");




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

  addSecondModel(type, selectedRing = null) {
    this.PreciousMetal.removeHelperModelAndClipping(1);
    this.PreciousMetal.removeHelperModelAndClipping(2);
    let model2;
    // console.log("loraaaaa",selectedRing)
    if (type == "engagement") {
      console.log("loraaaaa", this.EngagementRingsins)
      this.EngagementRingsins.loadEngRingById(selectedRing.id);
      this.currentDisplayedModels[0].position.x = -0.7;
      if (this.shadowPlane != undefined) {
        this.shadowPlane.position.x = -0.7
      }
      if (this.shadowClone != undefined) {
        this.shadowClone.visible = true;
        this.shadowClone.position.x = 0.7
      }
      return;
    }
    // Load the second model based on the selectedRing or type
    if (type == "Wedding" && selectedRing && selectedRing.id >= 0 && selectedRing.id < this.models.length) {
      console.log("aaaaa")
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
    model2.scale.set(0.85, 0.85, 0.85); // Scale down the second model
    if (this.PreciousMetal.helperModel) {
      this.PreciousMetal.helperModel.position.x = -0.7
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
    model3.scale.set(1, 1, 1);

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
    model4.scale.set(1, 1, 1);

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
  setCurrentModelName(model) {
    this.currentModel = model;
    console.log("current model name", model)

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
    this.pair1 = false;
    this.PreciousMetal.removeHelperModelAndClipping(1);
    this.PreciousMetal.removeHelperModelAndClipping(2);
    this.PreciousMetal.removeClippingTriOneRing();
    this.PreciousMetal.isEnable = false
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
    this.shadowPlane.position.x = 0;
    this.shadowClone.visible = false;
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

  // engraveTextOnModelss(text, options = {}) {
  //   console.log("Engraving text on the inner mesh...", text);
  //   let sValue = 0.0005
  //   this.tempPos = -0.85

  //   // if(this.currentModel=="P1"){
  //   //     sValue = 0.0005
  //   // }
  //   // if( this.currentModel=="P2" || this.currentModel=="P3" ){
  //   //   sValue = 0.0003

  //   // }
  //   // if( this.currentModel=="P4"){
  //   //   sValue = 0.0004
  //   //   this.tempPos = -0.0087
  //   // }
  //   // if( this.currentModel=="P5"){
  //   //   sValue = 0.0004

  //   // }
  //   // Default configurations
  //   const fontConfigurations = {
  //     1: { size: 0.5, height: sValue, rotation: { x: 0, y: 0, z: 0 } },
  //     2: { size: 0.5, height: sValue },
  //     3: { size: 0.5, height: sValue },
  //     4: { size: 0.5, height: sValue },
  //     5: { size: 0.5, height: sValue },
  //   };

  //   const config = { ...fontConfigurations[this.fontIndex || 1], ...options };

  //   console.log("hello 22", this.fontIndex, this.currentFont)

  //   // Load font
  //   this.fontLoader.load(this.currentFont, (font) => {
  //     const createEngraving = (model) => {
  //       let innerMesh = null;

  //       // Locate the Inner mesh
  //       model.traverse((child) => {
  //         if (child.isMesh && child.name.includes("Inner")) {
  //           innerMesh = child;
  //         }
  //       });

  //       if (!innerMesh) {
  //         console.error("Inner mesh not found.");
  //         return;
  //       }

  //       // Compute bounding box of the Inner mesh
  //       innerMesh.geometry.computeBoundingBox();
  //       const boundingBox = innerMesh.geometry.boundingBox;

  //       const innerRadius = (boundingBox.max.x - boundingBox.min.x) / 2; // Approximate radius
  //       const depthOffset = 0.0002; // Slight offset to make it visible on top of the surface

  //       // Create the text geometry
  //       const textGeometry = new TextGeometry(text, {
  //         font: font,
  //         size: config.size,
  //         depth: 0.3,
  //         curveSegments: 12,
  //         bevelEnabled: false,
  //       });

  //       textGeometry.center();

  //       const bender = new Bender();
  //       // Apply bending if needed
  //       bender.bend(textGeometry, "y", Math.PI/9 );
  //       console.log("bender")
  //       // Create text mesh
  //       const textMaterial = new THREE.MeshStandardMaterial({
  //         color: this.currentColor,
  //         metalness: 0.8,
  //         roughness: 0.5,
  //       });
  //       const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  //       textMesh.name = "test"
  //       // Position text slightly above the inner surface
  //       textMesh.position.set(0, -0.005, -0.005);
  //       // x: 0, y: -0.005, z: -0.005 
  //       textMesh.rotation.set(-0.6,  0.2,  1.5 ); // Align text along the ring's curvature
  //       textMesh.scale.set(0.03, 0.03, 0.03); // Scale the text
  //       // Add the text mesh to the inner mesh
  //       innerMesh.add(textMesh);
  //       // console.log("innerMesh", model,innerMesh)
  //       // this.scene.add(textMesh);

  //       console.log("Engraving applied to the inner mesh.", boundingBox.min.y);
  //     };

  //     const engraveOnModels = (models) => {
  //       models.forEach((model) => {
  //         if (model) {
  //           createEngraving(model);
  //         } else {
  //           console.warn("Model not found for engraving.");
  //         }
  //       });
  //     };

  //     // Check if pair1 is active and engrave on both rings
  //     if (this.pair1 && this.currentDisplayedModels.length > 1) {
  //       const ring1 = this.currentDisplayedModels[0];
  //       const ring2 = this.currentDisplayedModels[1];
  //       engraveOnModels([ring1, ring2]);
  //       console.log(`Engraved text "${text}" on both pair1 rings.`);
  //     } else {
  //       // Engrave only on the selected model
  //       const model = this.currentDisplayedModels[this.selectedModel - 1];
  //       engraveOnModels([model]);
  //       console.log(`Engraved text "${text}" on model ${this.selectedModel}`);
  //     }
  //   });
  // }






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



}