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



export class ModelManager {
  constructor(scene,PreciousMetal) {
    this.scene = scene;
    this.PreciousMetal = PreciousMetal
    this.models = [];
    this.currentDisplayedModels = [];
    this.currentModelIndex = 0;
    this.selectedModel = 1
    this.pair1 = false
    this.pair2 = false
    this.loader = new GLTFLoader();
    this.tatt = new TextGeometry();
    this.fontLoader = new FontLoader(); 
    // this.PreciousMetalIns = new pre
    this.currentFont = "./src/assets/fonts/Roboto_Regular.json";
    this.currentColor = "";
    this.shadowEnable = true;
    this.loadMatCapTextures();
  }
  getCurrentDisplayedModels(){

    return this.currentDisplayedModels;

  }
  addShadowPair(){
    if(this.shadowEnable){
    const textureLoader = new TextureLoader();
    // Load the PNG texture for the shadow
const shadowTexture = textureLoader.load('./models/shadow.png', (texture) => {
  texture.flipY = true; // Correct orientation if needed
});

// Create a plane for the shadow
const shadowPlane = new THREE.Mesh(
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
shadowPlane.scale.set(0.7,1.3,1)
shadowPlane.rotation.x = -Math.PI / 2; // Rotate to lie flat on the ground
shadowPlane.position.y = -1.22; // Slightly below the model to avoid z-fighting
shadowPlane.position.x = -0.7; // Slightly below the model to avoid z-fighting

let shadowClone = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2), // Adjust size to fit your model
  new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    polygonOffset: true, // Enable polygon offset
    polygonOffsetFactor: -1, // Push the shadow further back
    polygonOffsetUnits: -1  // Ensure the shadow PNG's transparency works
  })
);
shadowClone.scale.set(0.7,1.3,1)

shadowClone.rotation.x = -Math.PI / 2; // Rotate to lie flat on the ground
shadowClone.position.y = -1.22;
shadowClone.position.x = 0.7
// Add the shadow plane to the scene
this.scene.add(shadowPlane);
this.scene.add(shadowClone);
this.shadowEnable = false;

    }
  }
  loadMatCapTextures() {
    const textureLoader = new THREE.TextureLoader();
  
    // Create promises for matcap and highlight textures
    this.matcapPromise = new Promise((resolve, reject) => {
      textureLoader.load('./models/mat/MatCap.jpg', (texture) => {
        this.matcapTexture = texture;
        this.matcapTexture.needsUpdate = true;
        resolve();
      }, undefined, (err) => reject(err));
    });
  
    this.highlightPromise = new Promise((resolve, reject) => {
      textureLoader.load('./models/mat/MatCap2.jpg', (texture) => {
        this.highlightTexture = texture;
        this.highlightTexture.needsUpdate = true;
        resolve();
      }, undefined, (err) => reject(err));
    });
  
    console.log("Loading matcaps...");
  }
  
  // Load models only after textures are loaded
  loadModels(modelData) {
    // Wait for both matcap and highlight textures to load
    Promise.all([this.matcapPromise, this.highlightPromise])
      .then(() => {
        console.log("Matcaps loaded. Loading models...");
  
        const modelLoadPromises = modelData.map((data, index) => {
          return new Promise((resolve, reject) => {
            this.loader.load(data.glbPath, (gltf) => {
              const model = gltf.scene;
              this.models.push(model);
              model.traverse((child) => {
                if (child.isMesh) {
                  const material = child.material;
          
                  // Ensure the material is a MeshStandardMaterial or similar
                  if (material && material.metalness !== undefined) {
                    material.metalness = 0.8; // Full metal effect
                    material.roughness = 0.1;
                     // Smooth surface
                    material.envMap = this.scene.env;
                    material.envMapIntensity = 1;
    // child.material.needsUpdate = true
                    material.needsUpdate = true;
                  }
                  
                }
              });
  
              // model.traverse((child) => {
              //   if (child.isMesh) {
              //     // Apply custom shader material combining both MatCaps
              //     child.material = new THREE.ShaderMaterial({
              //       uniforms: {
              //         matcapTexture: { value: this.matcapTexture },
              //         highlightTexture: { value: this.highlightTexture },
              //         blendFactor: { value: 0.1 }, // Adjust to control blend between textures
              //         color: { value: new THREE.Color('#A09F9D') },
              //       },
              //       vertexShader: `
              //         varying vec3 vNormal;
              //         varying vec3 vViewPosition;
              //         varying vec2 vUv;
  
              //         void main() {
              //           vUv = uv;
              //           vNormal = normalize(normalMatrix * normal);
              //           vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
              //           vViewPosition = -modelViewPosition.xyz;
              //           gl_Position = projectionMatrix * modelViewPosition;
              //         }
              //       `,
              //       fragmentShader: `
              //         uniform sampler2D matcapTexture;
              //         uniform sampler2D highlightTexture;
              //         uniform float blendFactor;
              //         uniform vec3 color; // Color uniform
  
              //         varying vec3 vNormal;
              //         varying vec3 vViewPosition;
              //         varying vec2 vUv;
  
              //         void main() {
              //           vec3 viewDir = normalize(vViewPosition);
              //           vec3 reflectedDir = reflect(viewDir, normalize(vNormal));
              //           float m = 2.82842712474619 * sqrt(reflectedDir.z + 1.5);
              //           vec2 uv = reflectedDir.xy / m + 0.7;
  
              //           // Sample both MatCap textures and increase their brightness
              //           vec4 matcapColor = texture2D(matcapTexture, uv) * 1.3;
              //           vec4 highlightColor = texture2D(highlightTexture, uv) * 1.3;
  
              //           // Blend the textures with an adjusted factor
              //           vec4 blendedColor = mix(matcapColor, highlightColor, blendFactor);
  
              //           // Apply the color tint with increased intensity
              //           gl_FragColor = vec4(blendedColor.rgb * color * 2.0, blendedColor.a);
              //         }
              //       `,
              //       // transparent: true,
              //     });
              //   }
              // });
  
              model.scale.set(100, 100, 100);
              model.visible = false;
              this.scene.add(model);
              resolve(model); // Resolve the promise when the model is loaded
            }, undefined, (err) => reject(err));
          });
        });
  
        // Wait for all models to load
        Promise.all(modelLoadPromises)
          .then((models) => {
            console.log("All models loaded.");
            this.currentColor = "#A09F9D";
            this.switchModel(0, 1, true, false); // Show the first model
          })
          .catch((err) => {
            console.error("Error loading models:", err);
          });
      })
      .catch((err) => {
        console.error("Error loading matcaps:", err);
      });
  }
  
  optimalThicknessBool(value){
    if (value){
    this.optimalThickness = true
    console.log(this.optimalThickness)
    }
    else{
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
    model.scale.setX(widthValue * 15); // Multiply by a factor to convert to model scale
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
    const thicknessValue = parseFloat(thickness.replace(',', '.'));
    if (isNaN(thicknessValue)) {
      console.warn('Invalid thickness value:', thickness);
      return;
    }

    const minThickness = 1.0;  // Define the minimum thickness (based on UI options)
    const maxThickness = 12.0; // Define the maximum thickness (based on UI options)

    // Normalize thickness scaling based on a factor (adjust the factor as necessary for your model)
    let thicknessFactor;
    if (selectedRingId == 2) { thicknessFactor = 80; }
    else {
      thicknessFactor = 100;
    }
    // const thicknessFactor = 100; // Adjust this based on the visual difference you want
    const normalizedThickness = (thicknessValue - minThickness) / (maxThickness - minThickness) + 1;

    // Retrieve the current model for the selected ring
    const model = this.currentDisplayedModels[selectedRingId - 1];
    if (!model) {
      console.warn('Model not found for selectedRingId:', selectedRingId);
      return;
    }
    // console.log("model", normalizedThickness);
    // Apply thickness scaling based on normalized thickness
    model.scale.setY(normalizedThickness * thicknessFactor); // Adjust for Y axis
    model.scale.setZ(normalizedThickness * thicknessFactor); // Adjust for Z axis
    const applyThicknessScaling = (mesh) => {
      if (mesh.name.includes('Sides')) {
        // Sides mesh: Increase height vertically (Y-axis)
        mesh.scale.y = normalizedThickness;
      } else if ( mesh.name.includes('Outer')) {
     
        mesh.scale.y = normalizedThickness ;
        // mesh.scale.z = normalizedThickness;
      }
      else if ( mesh.name.includes('Inner')) {
  
        mesh.scale.y += 0.1 ;
        // mesh.scale.z = normalizedThickness;
      }
    };
  
    // Traverse the model and apply scaling
    model.traverse((child) => {
      if (child.isMesh) {
        applyThicknessScaling(child);
      }
    });
    // If pairing is enabled, apply the same scaling to the second ring in the pair
    // if (isPair && this.currentDisplayedModels.length > selectedRingId) {
    //   const secondRing = this.currentDisplayedModels[selectedRingId]; // Assuming the next ring in the pair
    //   secondRing.scale.setY(normalizedThickness * thicknessFactor); // Adjust Y axis for second ring
    //   secondRing.scale.setZ(normalizedThickness * thicknessFactor); // Adjust Z axis for second ring
    // }

    console.log(`Ring ${selectedRingId} thickness changed to: ${thicknessValue}mm`);
  }
  setSizeCountryWise(value){
    if(value == 'F'){
      this.changeRingThickness(this.selectedModel,'1,20 mm')
    }
    else   if(value == 'F½'){
      this.changeRingThickness(this.selectedModel,'1,40 mm')
    }
    else   if(value == 'G'){
      this.changeRingThickness(this.selectedModel,'1,60 mm')
    }
    else   if(value == 'G½'){
      this.changeRingThickness(this.selectedModel,'1,80 mm')
    }
    else   if(value == 'H'){
      this.changeRingThickness(this.selectedModel,'2,00 mm')
    }
    else   if(value == 'H½'){
      this.changeRingThickness(this.selectedModel,'2,20 mm')
    }
    else   if(value == 'I'){
      this.changeRingThickness(this.selectedModel,'2,40 mm')
    }
    else   if(value == 'I½'){
      this.changeRingThickness(this.selectedModel,'2,50 mm')
    }
    else   if(value == 'J'){
      this.changeRingThickness(this.selectedModel,'2,70 mm')
    }
    else   if(value == 'J½'){
      this.changeRingThickness(this.selectedModel,'2,70 mm')
    }
   

  }



  currentSelectedRing(id) {
    console.log("id is ", id)
    this.selectedModel = id
  }
  currentPairUpdate(value){

    this.pair1 = value.pair1
    this.pair2 = value.pair2
    console.log("this.pap", this.pair1,this.pair2)
  }





  switchModel(index, selectedRingId = 1, pair1 = false, pair2 = false) {
    this.currentColor = "#A09F9D";
    if(this.PreciousMetal.isEnable == true){
      this.PreciousMetal.removeHelperModelAndClipping(1);
      // this.PreciousMetal.removeHelperModelAndClipping(2);

    }
    else{
      this.PreciousMetal.isEnable == false
    }
    if (index < 0 || index >= this.models.length) {
      console.warn('Invalid model index:', index);
      return;
    }
    // this.engraveTextOnModel("GG")
    // Handle pairing logic
    if (pair1 && !pair2 && selectedRingId == 1 || selectedRingId == 2) {

      // Change both 1st and 2nd rings
      this.showCurrentModels(index, pair1); // For 1st and 2nd rings
      console.log("chk")
      let prevVal = 0
      if(this.PreciousMetal.isEnable == true){ 
        let ring1 = this.currentDisplayedModels[0]
        let ring2 = this.currentDisplayedModels[1]
        let triBool
        if(this.PreciousMetal.currentVal){
         prevVal = this.PreciousMetal.currentVal 
      }
      else{
        prevVal = "1:1"
      }
      if(this.PreciousMetal.triBool){
        triBool = this.PreciousMetal.triBool  
      }
      console.log("aa",prevVal,triBool)
      this.PreciousMetal.removeHelperModelAndClipping(1);
      this.PreciousMetal.removeHelperModelAndClipping(2);
      this.PreciousMetal.handlePair(ring1,ring2,prevVal,triBool,)

      
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
      model4.scale.set(85, 85, 85); // Scale down the fourth model

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
      // console.log("pair no 2")

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
    const model1 = this.cloneModelWithUniqueMaterial(model);
    const model2 = this.cloneModelWithUniqueMaterial(model);

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
      this.applyColorToModel(model1, "#D8BC7E")
      this.applyColorToModel(model2, "#D8BC7E")
      this.addShadowPair()

    } else {
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

  cloneModelWithUniqueMaterial(originalModel){
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
    let model2;
  
    // Load the second model based on the selectedRing or type
    if (selectedRing && selectedRing.id >= 0 && selectedRing.id < this.models.length) {
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
    model2.scale.set(85, 85, 85); // Scale down the second model
  
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
  setCurrentModelName(model){
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
  
    console.log(`Color ${color} applied to the model.`);}

//   changeModelColor(colorValue, isPair = false) {
//     console.log("colorvalue",colorValue)
//     // Function to determine color intensity based on the color
//     const getColorIntensity = (color) => {
//         // Define custom intensities for specific colors
//         const intensityMap = {
//             '#A09F9D': 2.0, // silver
//             '#E9D4A4': 1.14, // Gold
//             '#D99058': 1.8, // apricot gold
//             '#B76E79': 1.2, //rose gold
//             '#C2412D': 1.0, // red Gold
//         };

//         return intensityMap[color.toUpperCase()] || 2.0; // Default intensity if color not listed
//     };

//     this.currentColor = colorValue;

//     const applyColorToShaderMaterial = (model, colorIntensity) => {
//         model.traverse((child) => {
//             if (child.isMesh) {
//                 child.material = new THREE.ShaderMaterial({
//                     uniforms: {
//                         matcapTexture: { value: this.matcapTexture },
//                         highlightTexture: { value: this.highlightTexture },
//                         blendFactor: { value: 0.1 }, // Adjust to control blend between textures
//                         color: { value: new THREE.Color(colorValue) }, // Apply dynamic color
//                         colorIntensity: { value: colorIntensity } // Dynamic intensity
//                     },
//                     vertexShader: `
//                       varying vec3 vNormal;
//                       varying vec3 vViewPosition;
//                       varying vec2 vUv;

//                       void main() {
//                         vUv = uv;
//                         vNormal = normalize(normalMatrix * normal);
//                         vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
//                         vViewPosition = -modelViewPosition.xyz;
//                         gl_Position = projectionMatrix * modelViewPosition;
//                       }
//                     `,
//                     fragmentShader: `
//                       uniform sampler2D matcapTexture;
//                       uniform sampler2D highlightTexture;
//                       uniform float blendFactor;
//                       uniform vec3 color;
//                       uniform float colorIntensity;

//                       varying vec3 vNormal;
//                       varying vec3 vViewPosition;
//                       varying vec2 vUv;

//                       void main() {
//                         vec3 viewDir = normalize(vViewPosition);
//                         vec3 reflectedDir = reflect(viewDir, normalize(vNormal));
//                         float m = 2.82842712474619 * sqrt(reflectedDir.z + 1.5);
//                         vec2 uv = reflectedDir.xy / m + 0.7;

//                         // Sample both MatCap textures and increase their brightness
//                         vec4 matcapColor = texture2D(matcapTexture, uv) * 1.5;
//                         vec4 highlightColor = texture2D(highlightTexture, uv) * 1.3;

//                         // Blend the textures with an adjusted factor
//                         vec4 blendedColor = mix(matcapColor, highlightColor, blendFactor);

//                         // Apply the color tint with dynamic intensity
//                         gl_FragColor = vec4(blendedColor.rgb * color * colorIntensity, blendedColor.a);
//                       }
//                     `,
//                     clipping: true
//                 });
//                 child.material.clipping = true,
//                 child.material.needsUpdate = true; // Ensure the material updates
//             }
//         });
//     };

//     // Determine intensity for the selected color
//     const colorIntensity = getColorIntensity(colorValue);

//     // Apply color to the selected model
//     const model = this.currentDisplayedModels[this.selectedModel - 1];
//     if (!model) {
//         console.warn('Model not found for selectedRingId:', this.selectedModel);
//         return;
//     }
//     applyColorToShaderMaterial(model, colorIntensity);
//     console.log(`Color changed for ring ${this.selectedModel} to: ${colorValue} with intensity ${colorIntensity}`);

//     // If pair1 is active and isPair is true, change color for both ring 1 and ring 2
//     if (this.pair1 && this.currentDisplayedModels.length > 1) {
//         const ring1 = this.currentDisplayedModels[0]; // Ring 1
//         const ring2 = this.currentDisplayedModels[1]; // Ring 2
//         applyColorToShaderMaterial(ring1, colorIntensity);
//         applyColorToShaderMaterial(ring2, colorIntensity);
//         console.log(`Color changed for pair1 (ring 1 and ring 2) to: ${colorValue} with intensity ${colorIntensity}`);
//     }

//     // If pair2 is active and isPair is true, change color for both ring 3 and ring 4
//     if (this.pair2 && this.currentDisplayedModels.length > 3) {
//         const ring3 = this.currentDisplayedModels[2]; // Ring 3
//         const ring4 = this.currentDisplayedModels[3]; // Ring 4
//         applyColorToShaderMaterial(ring3, colorIntensity);
//         applyColorToShaderMaterial(ring4, colorIntensity);
//         console.log(`Color changed for pair2 (ring 3 and ring 4) to: ${colorValue} with intensity ${colorIntensity}`);
//     }
// }

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
  console.log("Engraving text on the inner mesh...");
  let sValue = 0.0005
  this.tempPos = -0.0098

  // if(this.currentModel=="P1"){
  //     sValue = 0.0005
  // }
  // if( this.currentModel=="P2" || this.currentModel=="P3" ){
  //   sValue = 0.0003

  // }
  // if( this.currentModel=="P4"){
  //   sValue = 0.0004
  //   this.tempPos = -0.0087
  // }
  // if( this.currentModel=="P5"){
  //   sValue = 0.0004

  // }
  // Default configurations
  const fontConfigurations = {
    1: { size: 0.0009, height: sValue, rotation: { x: 0, y: 0, z: 0 } },
    2: { size: 0.0009, height: sValue },
    3: { size: 0.0009, height: sValue },
    4: { size: 0.0009, height: sValue },
    5: { size: 0.0009, height: sValue },
  };

  const config = { ...fontConfigurations[this.fontIndex || 1], ...options };

  console.log("hello 22", this.fontIndex, this.currentFont)

  // Load font
  this.fontLoader.load(this.currentFont, (font) => {
    const createEngraving = (model) => {
      let innerMesh = null;

      // Locate the Inner mesh
      model.traverse((child) => {
        if (child.isMesh && child.name.includes("Inner")) {
          innerMesh = child;
        }
      });

      if (!innerMesh) {
        console.error("Inner mesh not found.");
        return;
      }

      // Compute bounding box of the Inner mesh
      innerMesh.geometry.computeBoundingBox();
      const boundingBox = innerMesh.geometry.boundingBox;

      const innerRadius = (boundingBox.max.x - boundingBox.min.x) / 2; // Approximate radius
      const depthOffset = 0.0002; // Slight offset to make it visible on top of the surface

      // Create the text geometry
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: config.size,
        depth: config.height,
        curveSegments: 12,
        bevelEnabled: false,
      });

      textGeometry.center();

      const bender = new Bender();
      // Apply bending if needed
      // bender.bend(textGeometry, "x", Math.PI / 16);

      // Create text mesh
      const textMaterial = new THREE.MeshStandardMaterial({
        color: this.currentColor,
        metalness: 0.8,
        roughness: 0.5,
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.name = "test"
      // Position text slightly above the inner surface
      textMesh.position.set(0, 0.00020,   this.tempPos);
      textMesh.rotation.set(0, 0, 0); // Align text along the ring's curvature

      // Add the text mesh to the inner mesh
      innerMesh.add(textMesh);

      console.log("Engraving applied to the inner mesh.", boundingBox.min.y);
    };

    const engraveOnModels = (models) => {
      models.forEach((model) => {
        if (model) {
          createEngraving(model);
        } else {
          console.warn("Model not found for engraving.");
        }
      });
    };

    // Check if pair1 is active and engrave on both rings
    if (this.pair1 && this.currentDisplayedModels.length > 1) {
      const ring1 = this.currentDisplayedModels[0];
      const ring2 = this.currentDisplayedModels[1];
      engraveOnModels([ring1, ring2]);
      console.log(`Engraved text "${text}" on both pair1 rings.`);
    } else {
      // Engrave only on the selected model
      const model = this.currentDisplayedModels[this.selectedModel - 1];
      engraveOnModels([model]);
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



}