engraveTextOnModel(text, options = {}) {
  console.log("Engraving text on the inner mesh...");

  // Default configurations
  const fontConfigurations = {
    1: { size: 0.0026, height: 0.0005, rotation: { x: Math.PI, y: 0, z: 0 } },
    2: { size: 0.0024, height: 0.0005 },
    3: { size: 0.0024, height: 0.0005 },
    4: { size: 0.0024, height: 0.0005 },
  };

  const config = { ...fontConfigurations[this.fontIndex || 1], ...options };

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
        height: config.height,
        curveSegments: 12,
        bevelEnabled: false,
      });

      textGeometry.center();
      
      // Create text mesh
      const textMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.8,
        roughness: 0.5,
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      
      // Position text slightly above the inner surface
      textMesh.position.set(0.0, 0.00090, -0.0098);
      textMesh.rotation.set(0, 0, 0); // Align text along the ring's curvature
      const bender = new Bender();
      bender.bend(textGeometry, "x", 120);
      // Add the text mesh to the inner mesh
      innerMesh.add(textMesh);

      console.log("Engraving applied to the inner mesh." ,  boundingBox.min.y);
    };

    // Apply engraving on the selected model
    const model = this.currentDisplayedModels[this.selectedModel - 1];
    if (model) {
      createEngraving(model);
    } else {
      console.warn("Model not found for engraving.");
    }
  });
}
\




engraveTextOnModel(text, options = {}) {
  console.log("Engraving...");

  // Default configurations for each font based on this.fontIndex
  const fontConfigurations = {
    1: {
      size: 0.0026,
      height: 0.0007,
      depthOffset: 0.0025,
      color: this.currentColor,
      position: { x: 0, y: -0.005, z: -0.006 },
      rotation: { x: -0.6, y: 0.2, z: 1.5 },
    },
    2: {
      size: 0.0024,
      height: 0.0007,
      depthOffset: 0.0017,
      color: this.currentColor,
      position: { x: 0, y: -0.005, z: -0.006 },
      rotation: { x: -0.6, y: 0.2, z: 1.5 },
    },
    3: {
      size: 0.0024,
      height: 0.0007,
      depthOffset: 0.0017,
      color: this.currentColor,
      position: { x: 0, y: -0.005, z: -0.006 },
      rotation: { x: -0.6, y: 0.2, z: 1.5 },
    },
    4: {
      size: 0.0024,
      height: 0.0007,
      depthOffset: 0.0017,
      color: this.currentColor,
      position: { x: 0, y: -0.005, z: -0.006 },
      rotation: { x: -0.6, y: 0.2, z: 1.5 },
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

       // Bend the text geometry inward
      const bender = new Bender();
      const bendIntensity = Math.PI / 8; // Negative for inward bending
      bender.bend(textGeometry, "z", bendIntensity);
      console.log("Vertices after bending:", textGeometry.attributes.position);
      const textMaterial = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.8,
        roughness: 0.7,
      });

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // Set position and rotation on the model surface
      textMesh.position.set(
        position.x,
        position.y,
        position.z - depthOffset // Engrave slightly into the model
      );
      textMesh.rotation.set(rotation.x, rotation.y, rotation.z);

      // Add text mesh as a child to the model
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

biColorPair(val) {                                                    
  // this.removeHelperModelAndClipping(); // Ensure no duplicate models or clipping planes.
  let selectedModel;
  let offset = 0; // 0 for 1:1, 0.1 for 1:3|
  let helperModelPosX = 0.7 
  let helperModelPosY = 0
  

  const ring1 = this.modelManager.currentDisplayedModels[0];
  const ring2 = this.modelManager.currentDisplayedModels[1];
  if(this.modelManager.selectedModel==1){

 
    selectedModel = ring1
    offset = 0.7
    helperModelPosX = -0.7
    if (val === "1:1") {
      // offset += 0.05;
  }
  else  if (val === "1:2") {
      offset += 0.05;
  }
  else if(val === "1:3"){
      offset += 0.07
  }
  
}
else{
  selectedModel = ring2;
  offset = -0.7
  helperModelPosX = 0.7
  helperModelPosY = -0.15
  if (val === "1:1") {
    // offset -= 0.05;
  }
  else  if (val === "1:2") {
    offset += 0.1;
  }
  else if(val === "1:3"){
      offset += 0.07
    }
  }
  console.log("ring1", val,offset)
  

  if (!selectedModel) {
      console.error("No selected model found.");
      return;
  }
 


  if (selectedModel == ring1) {
    this.removeHelperModelAndClipping(1); 
    // offset = 0.7
    helperModelPosX = -0.7
  let helperModelPosY = 0

      // Clone and add the helper model2w34
      this.helperModel = this.cloneModelWithUniqueMaterial(selectedModel);
      this.helperModel.position.set(helperModelPosX,helperModelPosY,0)
      this.scene.add(this.helperModel);
      this.applyColorToModel(this.helperModel, "#A09F9D");

      // Create clipping planes
      const clippingPlaneRing1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), offset);
      const clippingPlaneRing2 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offset);

      // Apply clipping planes to the materials
      selectedModel.traverse((child) => {
          if (child.isMesh) {
              child.material.clippingPlanes = [clippingPlaneRing1];
              child.material.clipShadows = true;
              child.material.needsUpdate = true;
          }
      });

      this.helperModel.traverse((child) => {
          if (child.isMesh) {
              child.material.clippingPlanes = [clippingPlaneRing2];
              child.material.clipShadows = true;
              child.material.needsUpdate = true;
          }
      });
      
     // First model on the left

      console.log("aaaa 1")


}
else if(selectedModel == ring2){
  this.removeHelperModelAndClipping(2); 

  console.log("aaaa 2")

  // offset = -0.7
  helperModelPosX = 0.7
let helperModelPosY = -0.15

    // Clone and add the helper model
    this.helperModelring2 = this.cloneModelWithUniqueMaterial(selectedModel);
    this.helperModelring2.position.set(helperModelPosX,helperModelPosY,0)
    this.scene.add(this.helperModelring2);
    this.applyColorToModel(this.helperModelring2, "#A09F9D");

    // Create clipping planes
    const clippingPlaneRing1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), offset);
    const clippingPlaneRing2 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offset);

    // Apply clipping planes to the materials
    selectedModel.traverse((child) => {
        if (child.isMesh) {
            child.material.clippingPlanes = [clippingPlaneRing1];
            child.material.clipShadows = true;
            child.material.needsUpdate = true;
        }
    });

    this.helperModelring2.traverse((child) => {
        if (child.isMesh) {
            child.material.clippingPlanes = [clippingPlaneRing2];
            child.material.clipShadows = true;
            child.material.needsUpdate = true;
        }
    });


}
    
      console.log("Clipping plane applied to the selected model and helper model.");
  }

   // loadModels(modelData) {
    //   // Wait for both matcap and highlight textures to load
    //   Promise.all([this.matcapPromise, this.highlightPromise])
    //     .then(() => {
    //       console.log("Matcaps loaded. Loading models...");
    
    //       const modelLoadPromises = modelData.map((data, index) => {
    //         return new Promise((resolve, reject) => {
    //           this.loader.load(data.glbPath, (gltf) => {
    //             const model = gltf.scene;
    //             this.models.push(model);
    
    //             model.traverse((child) => {
    //               if (child.isMesh && child.material) {
    //                 const originalMaterial = child.material;
    
    //                 // Apply the same material logic as provided for the midMesh
    //                 child.material = new THREE.MeshStandardMaterial({
    //                   color: originalMaterial.color || "#D8BC7E",
    //                   metalness: 0.7, // Metalness for a metallic effect
    //                   roughness: 0.2, // Smooth surface
    //                   map: originalMaterial.map, // Retain the original map
    //                   normalMap: originalMaterial.normalMap, // Retain the normal map
    //                   metalnessMap: originalMaterial.metalnessMap, // Retain the metalness map
    //                   roughnessMap: originalMaterial.roughnessMap, // Retain the roughness map
    //                   emissiveMap: originalMaterial.emissiveMap, // Retain the emissive map
    //                   emissive: originalMaterial.emissive, // Retain the emissive color
    //                   stencilWrite: true, // Enable stencil writing
    //                   stencilRef: 1, // Stencil reference value
    //                   stencilFunc: THREE.AlwaysStencilFunc, // Always pass stencil function
    //                   stencilZPass: THREE.ReplaceStencilOp, // Replace stencil operation on z-pass
    //                 });
    
    //                 child.material.needsUpdate = true; // Ensure material updates
    //               }
    //             });
    
    //             model.visible = false; // Hide the model initially
    //             this.scene.add(model);
    //             resolve(model); // Resolve the promise when the model is loaded
    //           }, undefined, (err) => reject(err));
    //         });
    //       });
    
    //       // Wait for all models to load
    //       Promise.all(modelLoadPromises)
    //         .then((models) => {
    //           console.log("All models loaded.");
    //           this.currentColor = "#A09F9D";
    //           this.switchModel(0, 1, true, false); // Show the first model
    //           // this.loadMidMesh();
    //         })
    //         .catch((err) => {
    //           console.error("Error loading models:", err);
    //         });
    //     })
    //     .catch((err) => {
    //       console.error("Error loading matcaps:", err);
    //     });
    // }

    async addLeftStep(){
      if(this.modelManager.modelId == "P7" || this.modelManager.modelId == "P8" || this.modelManager.modelId == "P15"){
          alert("This ring does not support Steps")
          return;
      } 
     if(!this.modelManager.pair1 && this.modelManager.selectedModel == 1){
        await this.modelManager.loadMidMesh("Corner Joint",false)
  
        this.leftStep  = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
        this.leftStep.userData = "leftStepRing1"
        // this.rightStep = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
        // this.rightStep.userData = "leftStepRing1"
    
        this.grooveManager.removeMidMeshes();
        this.leftStep.position.x = -0.865
        this.leftStep.scale.y += -4
        this.leftStep.scale.z += -4
    
    
        // this.rightStep.position.x = -0.55
    
        // console.log("aa chk razi",this.modelManager.midMesh.position.x)
        this.scene.add(this.leftStep)
        // this.scene.add(this.rightStep)
  
  
  
      }
      if(!this.modelManager.pair1 && this.modelManager.selectedModel == 2){
        await this.modelManager.loadMidMesh("Corner Joint",false)
  
        this.leftStep2  = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh2)
        this.leftStep2.userData = "leftStepRing2"
        // this.rightStep = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
        // this.rightStep.userData = "leftStepRing1"
    
        this.grooveManager.removeMidMeshes();
        this.leftStep2.position.x = 0.565
        this.leftStep2.scale.y += -4
        this.leftStep2.scale.z += -4
    
    
        // this.rightStep.position.x = -0.55
    
        // console.log("aa chk razi",this.modelManager.midMesh.position.x)
        this.scene.add(this.leftStep2)
        // this.scene.add(this.rightStep)
  
  
  
      }
    if(this.modelManager.pair1){
      await this.modelManager.loadMidMesh("Corner Joint",false)
    
      this.leftStep  = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
      this.leftStep.userData = "leftStepRing1"
      // this.rightStep = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
      // this.rightStep.userData = "leftStepRing1"
  
     
      this.leftStep.position.x = -0.865
      console.log("scale check r1 0",this.modelManager.modelId )
  
      if(this.modelManager.modelId == "P1" || this.modelManager.modelId == "P4" || this.modelManager.modelId == "P6" || this.modelManager.modelId == "P9" || this.modelManager.modelId == "P12" || this.modelManager.modelId == "P13" || this.modelManager.modelId == "P14"){
          console.log("scale check r1")
          this.leftStep.scale.y += -4
          this.leftStep.scale.z += -4
  
      }
     else if(this.modelManager.modelId== "P2" || this.modelManager.modelId == "P5"){
      console.log("scale check r1  2")
  
      this.leftStep.scale.y += -4.5
      this.leftStep.scale.z += -4.5
      }
      else if(this.modelManager.modelId== "P3" || this.modelManager.modelId == "P10"){
          console.log("scale check r1 default")
          this.leftStep.scale.y += -4.7
          this.leftStep.scale.z += -4.7
          this.leftStep.position.x = -0.867
  
      }
      else{
          console.log("scale check r1 default")
          this.leftStep.scale.y += -4
          this.leftStep.scale.z += -4
          // this.leftStep.position.x = -0.867
  
      }
  
      // this.rightStep.position.x = -0.55
  
      // console.log("aa chk razi",this.modelManager.midMesh.position.x)
      this.scene.add(this.leftStep)
    
      this.leftStep2  = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh2)
        this.leftStep2.userData = "leftStepRing2"
        // this.rightStep = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
        // this.rightStep.userData = "leftStepRing1"
    
        // this.grooveManager.removeMidMeshes();
        this.leftStep2.position.x = 0.565
  
        if(this.modelManager.modelId == "P1" || this.modelManager.modelId == "P4" || this.modelManager.modelId == "P6" || this.modelManager.modelId == "P9" || this.modelManager.modelId == "P12" || this.modelManager.modelId == "P13" || this.modelManager.modelId == "P14"){
  
  
          this.leftStep2.scale.y += -4
        this.leftStep2.scale.z += -4
  
      }
        
       else if(this.modelManager.modelId== "P2" || this.modelManager.modelId == "P5"){
          this.leftStep2.scale.y += -4.5
          this.leftStep2.scale.z += -4.5
          }
          else if(this.modelManager.modelId== "P3" || this.modelManager.modelId == "P10"){
              console.log("scale check r1 left default")
              this.leftStep2.scale.y += -4.7
              this.leftStep2.scale.z += -4.7
              this.leftStep2.position.x =  0.567
      
          }
          else{
              console.log("scale check r1 left default")
              this.leftStep2.scale.y += -4
              this.leftStep2.scale.z += -4
              // this.leftStep2.position.x =  0.567
      
          }
    
        // this.rightStep.position.x = -0.55
        this.grooveManager.removeMidMeshes();
        // console.log("aa chk razi",this.modelManager.midMesh.position.x)
        this.scene.add(this.leftStep2)
        // this.scene.add(this.rightStep)
  
  
  
    
    }
  
  
    }
  // steps manager junk
    async addRightStep(){
      if(this.modelManager.modelId == "P7" || this.modelManager.modelId == "P8" || this.modelManager.modelId == "P15"){
          alert("This ring does not support Steps")
          return;
      } 
      await this.modelManager.loadMidMesh("U-groove",false)
      if(!this.modelManager.pair1 && this.modelManager.selectedModel == 1){
  
      // this.leftStep  = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
      // this.leftStep.userData = "leftStepRing1"
      this.rightStep = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
      this.rightStep.userData = "rightStepRing1"
  
      this.grooveManager.removeMidMeshes();
      // this.leftStep.position.x = -0.86
      this.rightStep.position.x = -0.52
      this.rightStep.scale.y += -4
      this.rightStep.scale.z += -4
      // console.log("aa chk razi",this.modelManager.midMesh.position.x)
      // this.scene.add(this.leftStep)
      this.scene.add(this.rightStep)
  
  
    }
    if(!this.modelManager.pair1 && this.modelManager.selectedModel == 2){
  
  // this.leftStep  = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
      // this.leftStep.userData = "leftStepRing1"
      this.rightStep2 = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh2)
      this.rightStep2.userData = "rightStepRing2"
  
      this.grooveManager.removeMidMeshes();
      // this.leftStep.position.x = -0.86
      this.rightStep2.position.x = 0.85
      this.rightStep2.scale.y += -4
      this.rightStep2.scale.z += -4
      // console.log("aa chk razi",this.modelManager.midMesh.position.x)
      // this.scene.add(this.leftStep)
      this.scene.add(this.rightStep2)
  
  
    }
    if(this.modelManager.pair1){
     
      this.rightStep = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
      this.rightStep.userData = "rightStepRing1"
  
      // this.leftStep.position.x = -0.86
      this.rightStep.position.x = -0.52
     
  
      if(this.modelManager.modelId == "P1" || this.modelManager.modelId == "P4" || this.modelManager.modelId == "P6" || this.modelManager.modelId == "P9" || this.modelManager.modelId == "P12" || this.modelManager.modelId == "P13" || this.modelManager.modelId == "P14"){
  
  
          this.rightStep.scale.y += -4
      this.rightStep.scale.z += -4
  
      }
    else  if(this.modelManager.modelId== "P2" || this.modelManager.modelId == "P5"){
   
          this.rightStep.scale.y += -4.5
      this.rightStep.scale.z += -4.5
      }
  
     
  
      else if(this.modelManager.modelId== "P3" || this.modelManager.modelId == "P10"){
          console.log("scale check r1 right real 1 default")
          this.rightStep.scale.y += -4.7
          this.rightStep.scale.z += -4.7
          this.rightStep.position.x = -0.504
  
      }
      else{
          this.rightStep.scale.y += -4
          this.rightStep.scale.z += -4
          // this.rightStep.position.x = -0.504
  
      }
      // console.log("aa chk razi",this.modelManager.midMesh.position.x)
      // this.scene.add(this.leftStep)
      this.scene.add(this.rightStep)
      
      this.rightStep2 = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh2)
      this.rightStep2.userData = "rightStepRing2"
      
      // this.grooveManager.removeMidMeshes();
      // this.leftStep.position.x = -0.86
      this.rightStep2.position.x = 0.85
      if(this.modelManager.modelId == "P1" || this.modelManager.modelId == "P4" || this.modelManager.modelId == "P6" || this.modelManager.modelId == "P9" || this.modelManager.modelId == "P12" || this.modelManager.modelId == "P13" || this.modelManager.modelId == "P14"){
  
  
          this.rightStep2.scale.y += -4
      this.rightStep2.scale.z += -4
  
      }
    else  if(this.modelManager.modelId== "P2" || this.modelManager.modelId == "P5"){
   
          this.rightStep2.scale.y += -4.5
      this.rightStep2.scale.z += -4.5
      }
      else if(this.modelManager.modelId== "P3" || this.modelManager.modelId == "P10"){
          console.log("scale check r1 right real 1 default")
          this.rightStep2.scale.y += -4.7
          this.rightStep2.scale.z += -4.7
          this.rightStep2.position.x = 0.848
  
  
      }
      else{
          console.log("scale check r1 right real 1 default")
          this.rightStep2.scale.y += -4
          this.rightStep2.scale.z += -4
          // this.rightStep2.position.x = 0.848
  
  
      }
      // console.log("aa chk razi",this.modelManager.midMesh.position.x)
      // this.scene.add(this.leftStep)
      this.grooveManager.removeMidMeshes();
      this.scene.add(this.rightStep2)
  
    }
  }