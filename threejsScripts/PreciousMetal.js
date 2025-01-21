import * as THREE from "three";

export class PreciousMetal {
  constructor(scene, modelManager,pMetalHelper, renderer) {
    this.scene = scene;
    // this.modelManager = modelManager;
    // this.volumeVisualization = new THREE.Group();
    // this.volumeVisualization.visible = true; // Initially hidden
    // this.scene.add(this.volumeVisualization);
    this.renderer = renderer
    renderer.localClippingEnabled = true;
    this.clippingPlanes = []; // Array to hold clipping planes
    this.isEnable = false
    this.triEnable = false;
    this.triBool = false
    this.currentVal = 0;
    this.biColorSingleBool = false
    this.triColorSingleBool = false

    this.helperModeltriRing1 = null
    this.helperModeltriRing2 = null


    // this.orignalColor = this.getCurrentColor(this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1])
  }
  removeClippingTriOneRing(){
    console.log("hell")
    //  if (this.modelManager.currentDisplayedModels.length ==1){
      console.log("hell 2")
      if(this.helperModeltriRing1!=null){
      this.helperModeltriRing1.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.dispose();
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        }
      });
      this.scene.remove(this.helperModeltriRing1);
      this.helperModeltriRing1 = null;
    }
    if(this.helperModeltriRing2!=null){
      this.helperModeltriRing2.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.dispose();
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        }
      });
      this.scene.remove(this.helperModeltriRing2);
      this.helperModeltriRing2 = null;
    }
    // }
  }

  biColorOneRing(val) {
    if(val=="Segment 1:1"){
      this.pmHelper.biColorSegmentOnering();
      return;
    }
    this.removeHelperModelAndClipping(); // Ensure no duplicate models or clipping planes.
    this.isEnable = true
    let offset = 0; // 0 for 1:1, 0.1 for 1:3
    if (val === "1:1") offset = 0;
    else if (val === "1:2") offset = 0.05;
    else if (val === "1:3") offset = 0.1;

    let selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];

    if (!selectedModel) {
      selectedModel = this.modelManager.currentDisplayedModels[0];
      // console.error("No selected model found.");
      // return;
    }

    if (this.modelManager.currentDisplayedModels.length === 1) {
      // Clone and add the helper model
      selectedModel.position.set(0,0,0);
      this.helperModel = this.cloneModelWithUniqueMaterial(selectedModel);
      this.scene.add(this.helperModel);
      this.applyColorToModel(this.helperModel, "#E3E3E2");

      // Create clipping planes
      this.clippingPlaneRingSingleBi = new THREE.Plane(new THREE.Vector3(1, 0, 0), offset);
      this.clippingPlaneRingHelperBi = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offset);

      // Apply clipping planes to the materials
      selectedModel.traverse((child) => {
        if (child.isMesh) {
          child.material.clippingPlanes = [this.clippingPlaneRingSingleBi];
          child.material.clipShadows = true;
          child.material.needsUpdate = true;
        }
      });

      this.helperModel.traverse((child) => {
        if (child.isMesh) {
          child.material.clippingPlanes = [this.clippingPlaneRingHelperBi];
          child.material.clipShadows = true;
          child.material.needsUpdate = true;
        }
      });
      // First model on the left
      //  selectedModel.position.set(-0.7, 0, 0); // First model on the left
      //  this.helperModel.position.set(-0.7, 0, 0); // First model on the left
      //  clippingPlaneRing1.constant = -0.7
      //  clippingPlaneRing2.constant = -0.7
      // this.getClippingPlanePosition(clippingPlaneRing1)
      this.biColorSingleBool = true
      console.log("Clipping plane applied to the selected model and helper model.");
    }
  }

  handlePair(ring1, ring2, val, triBool) {
    this.currentVal = val;
    this.triBool = triBool
    let selectedModel = 0
    let offsetRing1 = 0.7
    let helperModelPosXring1 = -0.7
    if (val === "1:1") {
      // offsetRing1 += 0.05;
    }
    else if (val === "1:2") {
      offsetRing1 += 0.05;
    }
    else if (val === "1:3") {
      offsetRing1 += 0.07
    }
    else if (val === "1:4") {
      offsetRing1 += 0.09
    }


    let offsetRing2 = -0.7
    let helperModelPosXring2 = 0.7
    let helperModelPosYring2 = -0.15
    if (val === "1:1") {
      // offsetRing2 -= 0.05;
    }
    else if (val === "1:2") {
      offsetRing2 += 0.1;
    }
    else if (val === "1:3") {
      offsetRing2 += 0.07
    }
    else if (val === "1:4") {
      offsetRing2 += 0.09
    }


    if (triBool == true) {
      offsetRing1 = 0.7
      offsetRing2 = -0.7

    }
    selectedModel = ring1

    // this.removeHelperModelAndClipping(1); 
    // offset = 0.7
    helperModelPosXring1 = -0.7
    let helperModelPosY = 0



    // Clone and add the helper model2w34
    this.helperModel = this.cloneModelWithUniqueMaterial(selectedModel);
    this.helperModel.position.set(helperModelPosXring1, helperModelPosY, 0)
    this.scene.add(this.helperModel);
    this.applyColorToModel(this.helperModel, "#E3E3E2");

    // Create clipping planes
    this.clippingPlaneRing1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), offsetRing1);
    this.clippingPlaneRing1helper = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offsetRing1);

    // Apply clipping planes to the materials
    selectedModel.traverse((child) => {
      if (child.isMesh) {
        child.material.clippingPlanes = [this.clippingPlaneRing1];
        child.material.clipShadows = true;
        child.material.needsUpdate = true;
      }
    });

    this.helperModel.traverse((child) => {
      if (child.isMesh) {
        child.material.clippingPlanes = [this.clippingPlaneRing1helper];
        child.material.clipShadows = true;
        child.material.needsUpdate = true;
      }
    });
    if (triBool == true) {


      let offsetTri2 = -0.65
      let offsetTri = 0.75

      if (val == "1:1:1") {

        offsetTri2 = -0.65
        offsetTri = 0.75
      }
      else if (val === "1:2:1") {
        // offset = 0.1;
        offsetTri2 = -0.63
        offsetTri = 0.78
      }
      else if (val === "1:3:1") {
        offsetTri2 = -0.6
        offsetTri = 0.8
      }
      else if (val === "1:4:1") {
        offsetTri2 = -0.57
        offsetTri = 0.83
      }
      else if (val === "2:1:2") {
        // offset = 0.1;
        offsetTri2 = -0.657
        offsetTri = 0.737
      }
      else if (val === "3:1:1") {
        // offset = 0.1;
        offsetTri2 = -0.575
        offsetTri = 0.665
      }
      else if (val === "2:1:1") {
        // offset = 0.1;
        offsetTri2 = -0.560
        offsetTri = 0.665
      }
      //  selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];
      let modelColor = this.getCurrentColor(selectedModel)
      this.helperModeltriRing1 = this.cloneModelWithUniqueMaterial(selectedModel);
      // this.applyColorToModel(this.helperModel,"#"+modelColor)
      this.helperModeltriRing1.position.set(helperModelPosXring1, 0, 0)

      // this.applyColorToModel(this.helperModeltriRing1,"#B76E79")

      this.applyColorToModel(selectedModel, "#D8BC7E")
      this.applyColorToModel(this.helperModeltriRing1, "#E3E3E2")
      this.applyColorToModel(this.helperModel, "#D8BC7E")

      this.scene.add(this.helperModeltriRing1);
      this.clippingPlaneRing1Tri = new THREE.Plane(new THREE.Vector3(1, 0, 0), offsetTri);

      this.clippingPlaneRing1TriHelper = new THREE.Plane(new THREE.Vector3(-1, 0, 0), offsetTri2);

      this.helperModeltriRing1.traverse((child) => {
        if (child.isMesh) {
          child.material.clippingPlanes = [this.clippingPlaneRing1Tri, this.clippingPlaneRing1TriHelper];
          child.material.clipShadows = true; // Enable shadow clipping if needed
          child.material.needsUpdate = true;
        }
      });
    }

    selectedModel = ring2

    helperModelPosXring2 = 0.7
    helperModelPosY = -0.15

    // Clone and add the helper model
    this.helperModelring2 = this.cloneModelWithUniqueMaterial(selectedModel);
    this.helperModelring2.position.set(helperModelPosXring2, helperModelPosY, 0)
    this.scene.add(this.helperModelring2);



    this.applyColorToModel(this.helperModelring2, "#E3E3E2");

    // Create clipping planes
    this.clippingPlaneRing2 = new THREE.Plane(new THREE.Vector3(1, 0, 0), offsetRing2);
    this.clippingPlaneRing2helper = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offsetRing2);

    // Apply clipping planes to the materials
    selectedModel.traverse((child) => {
      if (child.isMesh) {
        child.material.clippingPlanes = [this.clippingPlaneRing2];
        child.material.clipShadows = true;
        child.material.needsUpdate = true;
      }
    });

    this.helperModelring2.traverse((child) => {
      if (child.isMesh) {
        child.material.clippingPlanes = [this.clippingPlaneRing2helper];
        child.material.clipShadows = true;
        child.material.needsUpdate = true;
      }
    });
    if (triBool == true) {
      let offsetTri = -0.65
      let offsetTri2 = 0.75

      if (val == "1:1:1") {

        offsetTri = -0.65
        offsetTri2 = 0.75
      }
      else if (val === "1:2:1") {
        // offset = 0.1;
        offsetTri = -0.63
        offsetTri2 = 0.78
      }
      else if (val === "1:3:1") {
        offsetTri = -0.6
        offsetTri2 = 0.8
      }
      else if (val === "1:4:1") {
        offsetTri = -0.57
        offsetTri2 = 0.83
      }
      else if (val === "2:1:2") {
        // offset = 0.1;
        offsetTri = -0.657
        offsetTri2 = 0.737
      }
      else if (val === "3:1:1") {
        // offset = 0.1;
        offsetTri =-0.715
        offsetTri2 = 0.800
      }
      else if (val === "2:1:1") {
        // offset = 0.1;
        offsetTri =-0.715
        offsetTri2 = 0.810
      }
      console.log("val 0", val, offsetTri, offsetTri2)


      let modelColor = this.getCurrentColor(selectedModel)
      this.helperModeltriRing2 = this.cloneModelWithUniqueMaterial(selectedModel);
      // this.applyColorToModel(this.helperModel,"#"+modelColor)
      this.helperModeltriRing2.position.set(helperModelPosXring2, helperModelPosY, 0)

      this.applyColorToModel(this.helperModeltriRing2, "#B76E79")


      this.applyColorToModel(selectedModel, "#D8BC7E")
      this.applyColorToModel(this.helperModeltriRing2, "#E3E3E2")
      this.applyColorToModel(this.helperModelring2, "#D8BC7E")
      this.scene.add(this.helperModeltriRing2);
      this.clippingPlaneRing2Tri = new THREE.Plane(new THREE.Vector3(1, 0, 0), offsetTri);

      this.clippingPlaneRing2TriHelper = new THREE.Plane(new THREE.Vector3(-1, 0, 0), offsetTri2);

      this.helperModeltriRing2.traverse((child) => {
        if (child.isMesh) {
          child.material.clippingPlanes = [this.clippingPlaneRing2Tri, this.clippingPlaneRing2TriHelper];
          child.material.clipShadows = true; // Enable shadow clipping if needed
          child.material.needsUpdate = true;
        }
      });
    }

  }

  biTriPair(val, triBool = false) {
    this.isEnable = true
    this.currentVal = val;
    this.triBool = triBool
    // this.removeHelperModelAndClipping(); // Ensure no duplicate models or clipping planes.
    let selectedModel;
    let offset = 0; // 0 for 1:1, 0.1 for 1:3|
    let helperModelPosX = 0.7
    let helperModelPosY = 0

    if(val=="Segment 1:1"){
      this.pmHelper.biColorSegment();
      return;
    }

    const ring1 = this.modelManager.currentDisplayedModels[0];
    const ring2 = this.modelManager.currentDisplayedModels[1];
    if (this.modelManager.selectedModel == 1) {


      selectedModel = ring1
      offset = 0.7
      helperModelPosX = -0.7
      if (val === "1:1") {
        // offset += 0.05;
      }
      else if (val === "1:2") {
        offset += 0.05;
      }
      else if (val === "1:3") {
        offset += 0.07
      }
      else if (val === "1:4") {
        offset += 0.09
      }

    }
    else {
      selectedModel = ring2;
      offset = -0.7
      helperModelPosX = 0.7
      helperModelPosY = -0.15
      if (val === "1:1") {
        // offset -= 0.05;
      }
      else if (val === "1:2") {
        offset += 0.1;
      }
      else if (val === "1:3") {
        offset += 0.07
      }
      else if (val === "1:4") {
        offset += 0.09
      }

    }
    console.log("ring1", val, offset)


    if (!selectedModel) {
      console.error("No selected model found.");
      return;
    }

    if (this.modelManager.pair1 == true) {
      this.removeHelperModelAndClipping(1);
      this.removeHelperModelAndClipping(2);


      this.handlePair(ring1, ring2, val, triBool)
      return;
    }

    if (selectedModel == ring1) {
      this.removeHelperModelAndClipping(1);
      // offset = 0.7
      helperModelPosX = -0.7
      let helperModelPosY = 0



      // Clone and add the helper model2w34
      this.helperModel = this.cloneModelWithUniqueMaterial(selectedModel);
      this.helperModel.position.set(helperModelPosX, helperModelPosY, 0)
      this.scene.add(this.helperModel);


      this.applyColorToModel(this.helperModel, "#E3E3E2");

      // Create clipping planes
      this.clippingPlaneRing1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), offset);
      this.clippingPlaneRing1helper = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offset);

      // Apply clipping planes to the materials
      selectedModel.traverse((child) => {
        if (child.isMesh) {
          child.material.clippingPlanes = [this.clippingPlaneRing1];
          child.material.clipShadows = true;
          child.material.needsUpdate = true;
        }
      });

      this.helperModel.traverse((child) => {
        if (child.isMesh) {
          child.material.clippingPlanes = [this.clippingPlaneRing1helper];
          child.material.clipShadows = true;
          child.material.needsUpdate = true;
        }
      });
      if (triBool == true) {
   

        let offsetTri2 = -0.65
        let offsetTri = 0.75
  
        if (val == "1:1:1") {
  
          offsetTri2 = -0.65
          offsetTri = 0.75
        }
        else if (val === "1:2:1") {
          // offset = 0.1;
          offsetTri2 = -0.63
          offsetTri = 0.78
        }
        else if (val === "1:3:1") {
          offsetTri2 = -0.6
          offsetTri = 0.8
        }
        else if (val === "1:4:1") {
          offsetTri2 = -0.57
          offsetTri = 0.83
        }
        else if (val === "2:1:2") {
          // offset = 0.1;
          offsetTri2 = -0.657
          offsetTri = 0.737
        }
        else if (val === "3:1:1") {
          // offset = 0.1;
          offsetTri2 = -0.575
          offsetTri = 0.665
        }
        else if (val === "2:1:1") {
          // offset = 0.1;
          offsetTri2 = -0.560
          offsetTri = 0.665
        }
        //  selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];
        let modelColor = this.getCurrentColor(selectedModel)
        this.helperModeltriRing1 = this.cloneModelWithUniqueMaterial(selectedModel);
        // this.applyColorToModel(this.helperModel,"#"+modelColor)
        this.helperModeltriRing1.position.set(helperModelPosX, 0, 0)

        this.applyColorToModel(selectedModel, "#D8BC7E")
        this.applyColorToModel(this.helperModeltriRing1, "#E3E3E2")
        this.applyColorToModel(this.helperModel, "#D8BC7E")

        // this.applyColorToModel(this.helperModeltriRing1,"#B76E79")

        this.scene.add(this.helperModeltriRing1);
        this.clippingPlaneRing1Tri = new THREE.Plane(new THREE.Vector3(1, 0, 0), offsetTri);

        this.clippingPlaneRing1TriHelper = new THREE.Plane(new THREE.Vector3(-1, 0, 0), offsetTri2);
      console.log("aaaa 1",offsetTri,offsetTri2,val)

        this.helperModeltriRing1.traverse((child) => {
          if (child.isMesh) {
            child.material.clippingPlanes = [this.clippingPlaneRing1Tri, this.clippingPlaneRing1TriHelper];
            child.material.clipShadows = true; // Enable shadow clipping if needed
            child.material.needsUpdate = true;
          }
        });
      }
      // First model on the left
     


    }
    else if (selectedModel == ring2) {
      this.removeHelperModelAndClipping(2);

      console.log("aaaa 2")

      // offset = -0.7
      helperModelPosX = 0.7
      let helperModelPosY = -0.15

      // Clone and add the helper model
      this.helperModelring2 = this.cloneModelWithUniqueMaterial(selectedModel);
      this.helperModelring2.position.set(helperModelPosX, helperModelPosY, 0)
      this.scene.add(this.helperModelring2);
      this.applyColorToModel(this.helperModelring2, "#E3E3E2");

      // Create clipping planes
      this.clippingPlaneRing2 = new THREE.Plane(new THREE.Vector3(1, 0, 0), offset);
      this.clippingPlaneRing2helper = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offset);

      // Apply clipping planes to the materials
      selectedModel.traverse((child) => {
        if (child.isMesh) {
          child.material.clippingPlanes = [this.clippingPlaneRing2];
          child.material.clipShadows = true;
          child.material.needsUpdate = true;
        }
      });

      this.helperModelring2.traverse((child) => {
        if (child.isMesh) {
          child.material.clippingPlanes = [this.clippingPlaneRing2helper];
          child.material.clipShadows = true;
          child.material.needsUpdate = true;
        }
      });
      if (triBool == true) {
        let offsetTri = -0.65
        let offsetTri2 = 0.75

        if (val == "1:1:1") {

          offsetTri = -0.65
          offsetTri2 = 0.75
        }
        else if (val === "1:2:1") {
          // offset = 0.1;
          offsetTri = -0.63
          offsetTri2 = 0.78
        }
        else if (val === "1:3:1") {
          offsetTri = -0.6
          offsetTri2 = 0.8
        }
        else if (val === "1:4:1") {
          offsetTri = -0.57
          offsetTri2 = 0.83
        }
        else if (val === "2:1:2") {
          // offset = 0.1;
          offsetTri = -0.657
          offsetTri2 = 0.737
        }
        else if (val === "3:1:1") {
          // offset = 0.1;
          offsetTri =-0.715
          offsetTri2 = 0.800
        }
        else if (val === "2:1:1") {
          // offset = 0.1;
          offsetTri =-0.715
          offsetTri2 = 0.810
        }

        let modelColor = this.getCurrentColor(selectedModel)
        this.helperModeltriRing2 = this.cloneModelWithUniqueMaterial(selectedModel);
        // this.applyColorToModel(this.helperModel,"#"+modelColor)
        this.helperModeltriRing2.position.set(helperModelPosX, helperModelPosY, 0)

        // this.applyColorToModel(this.helperModeltriRing2,"#B76E79")
        this.applyColorToModel(selectedModel, "#D8BC7E")
        this.applyColorToModel(this.helperModeltriRing2, "#E3E3E2")
        this.applyColorToModel(this.helperModelring2, "#D8BC7E")

        this.scene.add(this.helperModeltriRing2);
        this.clippingPlaneRing2Tri = new THREE.Plane(new THREE.Vector3(1, 0, 0), offsetTri);

        this.clippingPlaneRing2TriHelper = new THREE.Plane(new THREE.Vector3(-1, 0, 0), offsetTri2);

        this.helperModeltriRing2.traverse((child) => {
          if (child.isMesh) {
            child.material.clippingPlanes = [this.clippingPlaneRing2Tri, this.clippingPlaneRing2TriHelper];
            child.material.clipShadows = true; // Enable shadow clipping if needed
            child.material.needsUpdate = true;
          }
        });
      }
    }

    console.log("Clipping plane applied to the selected model and helper model.");
  }




  getClippingPlanePosition(plane) {
    if (!plane || !(plane instanceof THREE.Plane)) {
      console.error("Invalid clipping plane.");
      return null;
    }
    // Calculate the position of the plane using its normal and constant
    const position = plane.normal.clone().multiplyScalar(plane.constant);
    console.log("aaa", position)

    return position;
  }

  getModelPosition(model) {
    if (!model) {
      console.error("No model provided.");
      return null;
    }

    // Ensure the position is updated based on the world matrix
    model.updateMatrixWorld(true);

    // Get the position from the world matrix
    const position = new THREE.Vector3();
    position.setFromMatrixPosition(model.matrixWorld);

    return position;
  }
  setoffsetValue(val,ringNum) {
    if (this.modelManager.currentDisplayedModels.length == 1 && this.biColorSingleBool) {
      this.clippingPlaneRingSingleBi.constant = parseFloat(-val)
      this.clippingPlaneRingHelperBi.constant = parseFloat(val)
    }
    console.log("this.modelManager.currentDisplayedModels.length", this.modelManager.currentDisplayedModels.length, this.modelManager.selectedModel)
    if (this.modelManager.currentDisplayedModels.length == 2 ) {
      if(ringNum=="Ring 1"){
      this.clippingPlaneRing1.constant = parseFloat(-val)
      this.clippingPlaneRing1helper.constant = parseFloat(val)}
    
    // else if (this.modelManager.currentDisplayedModels.length == 2) {
      if(ringNum=="Ring 2"){
      this.clippingPlaneRing2.constant = parseFloat(-val)
      this.clippingPlaneRing2helper.constant = parseFloat(val)
      }}
    // else if(this.modelManager.currentDisplayedModels.length == 2 && this.modelManager.pair1){
    //   // this.clippingPlaneRing1.constant = parseFloat(-val) 
    //   // this.clippingPlaneRing1helper.constant = parseFloat(val)
    //   // this.clippingPlaneRing2.constant = parseFloat(-val) 
    //   // this.clippingPlaneRing2helper.constant = parseFloat(val) 
    // }

  }
  setoffsetValueTri(val1, val2,ringNum) {

    if (this.modelManager.currentDisplayedModels.length == 1) {

      this.clippingPlaneSingleRingTri.constant = parseFloat(val2)
      this.clippingPlaneSingleRingTriHelper.constant = parseFloat(-val1)
    }
    // if (this.modelManager.currentDisplayedModels.length == 2 && this.modelManager.selectedModel == 1) {
      // val1 = Math.abs(val1)
      // console.log("this.clippingPlaneRing1Tri.constant",this.clippingPlaneRing1Tri.constant,this.clippingPlaneRing1TriHelper.constant)
      // this.clippingPlaneRing1Tri.constant = parseFloat(-val1)  // right side
      // this.clippingPlaneRing1TriHelper.constant = parseFloat(-val2) // left side
    // }
    // if (this.modelManager.currentDisplayedModels.length == 2 && this.modelManager.selectedModel == 2) {
    //   // val1 = Math.abs(val1)
    //   // console.log("this.clippingPlaneRing1Tri.constant",this.clippingPlaneRing2Tri.constant,this.clippingPlaneRing2TriHelper.constant)
    //   this.clippingPlaneRing2Tri.constant = parseFloat(val1)  // right side
    //   this.clippingPlaneRing2TriHelper.constant = parseFloat(val2) // left side
    // }
    if(this.modelManager.currentDisplayedModels.length == 2){
      if(ringNum=="Ring 1"){
        console.log("this.clippingPlaneRing1Tri.constant",this.clippingPlaneRing1Tri.constant,this.clippingPlaneRing1TriHelper.constant)
        this.clippingPlaneRing1Tri.constant = parseFloat(-val1)  // right side
        this.clippingPlaneRing1TriHelper.constant = parseFloat(-val2) 
    }
    if(ringNum=="Ring 2"){
       console.log("this.clippingPlaneRing1Tri.constant",this.clippingPlaneRing2Tri.constant,this.clippingPlaneRing2TriHelper.constant)
      this.clippingPlaneRing2Tri.constant = parseFloat(val1)  // right side
      this.clippingPlaneRing2TriHelper.constant = parseFloat(val2) // left side
  }
  }
  }

  triColorOneRing(val) {
    this.removeHelperModelAndClipping()
    this.biColorOneRing("1:1");
    let offset = 0.05
    // console.log("val",val)
    if (val == "1:1:1") {

      offset = 0.05
      console.log("val 0", val, offset)
    }
    else if (val === "1:2:1") {
      offset = 0.1;
    }
    else if (val === "1:3:1") {
      offset = 0.12
    }
    else if (val === "1:4:1") {
      offset = 0.14
    }
    // else if (val == "1:1:1") {

    //   offset = 0.07;
    //   console.log("val 0",val,offset)
    // }
    console.log("val", val, offset)
    const selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];
    let modelColor = this.getCurrentColor(selectedModel)
    this.helperModeltri = this.cloneModelWithUniqueMaterial(selectedModel);
    this.applyColorToModel(this.helperModel, "#" + modelColor)
    this.applyColorToModel(this.helperModeltri, "#E3E3E2")

    this.scene.add(this.helperModeltri);
    this.clippingPlaneSingleRingTri = new THREE.Plane(new THREE.Vector3(-1, 0, 0), offset);

    this.clippingPlaneSingleRingTriHelper = new THREE.Plane(new THREE.Vector3(1, 0, 0), offset);

    this.helperModeltri.traverse((child) => {
      if (child.isMesh) {
        child.material.clippingPlanes = [this.clippingPlaneSingleRingTri, this.clippingPlaneSingleRingTriHelper];
        child.material.clipShadows = true; // Enable shadow clipping if needed
        child.material.needsUpdate = true;
      }
    });
    // console.log("hello tri",modelColor);

  }
  colorChangeBi(colorCode, modelSide) {

    if (colorCode == "#E9D4A4") {
      colorCode = "#D8BC7E"
    }
    const selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];
    if (modelSide == 1) {
      if (this.modelManager.selectedModel == 1) {
        this.applyColorToModel(this.helperModel, colorCode)
      }
      else if (this.modelManager.selectedModel == 2) {
        this.applyColorToModel(this.helperModelring2, colorCode)

      }
    }
    else if (modelSide == 2) {
      this.applyColorToModel(selectedModel, colorCode)
    }
    else if (modelSide == 3) {
      if (this.helperModeltri) {
        this.applyColorToModel(this.helperModeltri, colorCode)
      }
      if (this.helperModeltriRing1 && this.modelManager.selectedModel == 1) {
        this.applyColorToModel(this.helperModeltriRing1, colorCode)
      }
      if (this.helperModeltriRing2 && this.modelManager.selectedModel == 2) {
        this.applyColorToModel(this.helperModeltriRing2, colorCode)
      }
    }




  }

  colorChangeTri(colorCode, modelSide) {




  }

  removeHelperModelAndClipping(ringindex = 1) {
    // Check if the helper model exists
    let myModel;
    if (ringindex == 1) {
      myModel = this.helperModel
    }
    else if (ringindex == 2) {
      myModel = this.helperModelring2

    }
    if (myModel) {
      // Traverse the helper model and dispose of materials and geometry
      myModel.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.dispose();
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        }
      });

      // Remove the helper model from the scene
      this.scene.remove(myModel);
      myModel = null;
      // console.log("Helper model removed.");
    } else {
      console.warn("No helper model to remove.");
    }
    if (this.helperModeltri) {
      // Traverse the helper model and dispose of materials and geometry
      this.helperModeltri.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.dispose();
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        }
      });








      // Remove the helper model from the scene
      this.scene.remove(this.helperModeltri);
      this.helperModeltri = null;
      // console.log("Helper model removed tri.");
    } else {
      console.warn("No helper model to remove.");
    }


    if (this.helperModeltriRing1 && this.modelManager.selectedModel == 1) {
      // Traverse the helper model and dispose of materials and geometry
      this.helperModeltriRing1.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.dispose();
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        }
      });
      this.scene.remove(this.helperModeltriRing1);
      this.helperModeltriRing1 = null;
    }
    if (this.helperModeltriRing2 && this.modelManager.selectedModel == 2) {
      // Traverse the helper model and dispose of materials and geometry
      this.helperModeltriRing2.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.dispose();
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        }
      });
      this.scene.remove(this.helperModeltriRing2);
      this.helperModeltriRing2 = null;
    }
    if (this.modelManager.pair1) {
      // console.log("aaaaaaaaaaaaaaaaaaaaaa")
      if (this.helperModeltriRing1) {
        this.helperModeltriRing1.traverse((child) => {
          if (child.isMesh) {
            if (child.material) {
              child.material.dispose();
            }
            if (child.geometry) {
              child.geometry.dispose();
            }
          }
        });
        this.scene.remove(this.helperModeltriRing1);
        this.helperModeltriRing1 = null;
      }
      if (this.helperModeltriRing2) {
        this.helperModeltriRing2.traverse((child) => {
          if (child.isMesh) {
            if (child.material) {
              child.material.dispose();
            }
            if (child.geometry) {
              child.geometry.dispose();
            }
          }
        });
        this.scene.remove(this.helperModeltriRing2);
        this.helperModeltriRing2 = null;
      }
    }



    // Remove clipping planes from the selected model
    const ring1 = this.modelManager.currentDisplayedModels[0];
    const ring2 = this.modelManager.currentDisplayedModels[1];
    let selectedModel = 0
    if (this.modelManager.selectedModel == 1 && !this.modelManager.pair1) {
      // console.log("ring1", ring1, ring2,this.modelManager.currentDisplayedModels,this.modelManager.selectedModel)
      selectedModel = ring1

    }
    else if (this.modelManager.selectedModel == 2 && !this.modelManager.pair1) {
      selectedModel = ring2;
      // offset = -0.7

    }

    if (selectedModel) {
      selectedModel.traverse((child) => {
        if (child.isMesh) {
          child.material.clippingPlanes = []; // Remove clipping planes
          child.material.needsUpdate = true;
        }
      });
      // console.log("Clipping planes removed from the selected model.");
    } else {
      console.warn("No selected model found to remove clipping planes from.");
    }

    // Clear the clipping planes array
    if (this.modelManager.pair1) {
      if (ring1) {
        ring1.traverse((child) => {
          if (child.isMesh) {
            child.material.clippingPlanes = []; // Remove clipping planes
            child.material.needsUpdate = true;
          }
        });
        // console.log("Clipping planes removed from the selected model.");
      } else {
        console.warn("No selected model found to remove clipping planes from.");
      }
      if (ring2) {
        ring2.traverse((child) => {
          if (child.isMesh) {
            child.material.clippingPlanes = []; // Remove clipping planes
            child.material.needsUpdate = true;
          }
        });
        // console.log("Clipping planes removed from the selected model.");
      } else {
        console.warn("No selected model found to remove clipping planes from.");
      }

    }
    this.clippingPlanes = [];



    // console.log("All clipping planes cleared.");
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
  getCurrentColor(modelOrMaterial) {
    if (modelOrMaterial instanceof THREE.Material) {
      // Check if the material has a color property
      if (modelOrMaterial.color) {
        return modelOrMaterial.color.getHexString(); // Return color as a hex string
      } else {
        console.warn("Material does not have a color property.");
        return null;
      }
    }

    if (modelOrMaterial instanceof THREE.Object3D) {
      // Traverse the model to find the first mesh with a color
      let foundColor = null;
      modelOrMaterial.traverse((child) => {
        if (child.isMesh && child.material && child.material.color) {
          foundColor = child.material.color.getHexString(); // Get the first color found
        }
      });

      if (foundColor) {
        // console.log("found color", foundColor)
        return foundColor; // Return the found color as a hex string
      } else {
        console.warn("No material with a color property found in the model.");
        return null;
      }
    }

    console.warn("Input is not a Material or Object3D.");
    return null;
  }

  // Example Usage


  applyColorToModel(model, colorValue) {
    console.log("colorvalue", colorValue)

    model.traverse((child) => {
      if (child.isMesh) {
        const material = child.material;

        // Check if the material supports color
        if (material && material.color) {
          material.color.set(colorValue); // Automatically handles #fff, #ffffff, or named colors
          material.needsUpdate = true; // Ensure material updates
        }
      }
    });
    // Function to determine color intensity based on the color
    const getColorIntensity = (color) => {
      // Define custom intensities for specific colors
      const intensityMap = {
        '#A09F9D': 2.0, // silver
        '#E9D4A4': 1.14, // Gold
        '#D99058': 1.8, // apricot gold
        '#B76E79': 1.2, //rose gold
        '#C2412D': 1.0, // red Gold
      };

      return intensityMap[color.toUpperCase()] || 2.0; // Default intensity if color not listed
    };

    // this.currentColor = colorValue;


//     const applyColorToShaderMaterial = (model, colorIntensity) => {
//       model.traverse((child) => {
//         if (child.isMesh) {

//           child.material = new THREE.ShaderMaterial({

//             uniforms: {
//               matcapTexture: { value: this.modelManager.matcapTexture },
//               highlightTexture: { value: this.modelManager.highlightTexture },
//               blendFactor: { value: 0.1 }, // Adjust to control blend between textures
//               color: { value: new THREE.Color(colorValue) }, // Apply dynamic color
//               colorIntensity: { value: colorIntensity } // Dynamic intensity
//             },
//             vertexShader: `
//                     #if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
// 	                   varying vec3 vViewPosition;
//                      #endif
//                       varying vec3 vNormal;
                      
//                       varying vec2 vUv;

//                       void main() {
                      
//                         vUv = uv;
//                         vNormal = normalize(normalMatrix * normal);
//                         vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                        
//                         #if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
// 	                    vViewPosition = - modelViewPosition.xyz;
//                         #endif
//                         gl_Position = projectionMatrix * modelViewPosition;
                      
//                       }
//                     `,
//             fragmentShader: `
//             #if NUM_CLIPPING_PLANES > 0

// 	#if ! defined( PHYSICAL ) && ! defined( PHONG )
// 		varying vec3 vViewPosition;
// 	#endif

// 	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];

// #endif
//                       uniform sampler2D matcapTexture;
//                       uniform sampler2D highlightTexture;
//                       uniform float blendFactor;
//                       uniform vec3 color;
//                       uniform float colorIntensity;

//                       varying vec3 vNormal;
                      
//                       varying vec2 vUv;

//                       void main() {

//                       #if NUM_CLIPPING_PLANES > 0

// 	for ( int i = 0; i < UNION_CLIPPING_PLANES; ++ i ) {

// 		vec4 plane = clippingPlanes[ i ];
// 		if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;

// 	}
		
// 	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES

// 		bool clipped = true;
// 		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; ++ i ) {
// 			vec4 plane = clippingPlanes[ i ];
// 			clipped = ( dot( vViewPosition, plane.xyz ) > plane.w ) && clipped;
// 		}

// 		if ( clipped ) discard;
	
// 	#endif

// #endif
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
//           }

//           );
//           child.material.clipping = true,
//             child.material.needsUpdate = true; // Ensure the material updates
//         }
//       });


// }
    //  

    // let colorIntensity = getColorIntensity(colorValue);
    // applyColorToShaderMaterial(model, colorIntensity);
    console.log(`Color ${colorValue} applied to the model.`);
    console.log("this", this.modelManager.currentDisplayedModels, model)

  }

  changeModelColor(model, colorValue) {
    console.log("colorvalue", colorValue)
    // Function to determine color intensity based on the color
    const getColorIntensity = (color) => {
      // Define custom intensities for specific colors
      const intensityMap = {
        '#A09F9D': 2.0, // silver
        '#E9D4A4': 1.14, // Gold
        '#D99058': 1.8, // apricot gold
        '#B76E79': 1.2, //rose gold
        '#C2412D': 1.0, // red Gold
      };

      return intensityMap[color.toUpperCase()] || 2.0; // Default intensity if color not listed
    };

    // this.currentColor = colorValue;
    const colorIntensity = getColorIntensity(colorValue);
    applyColorToShaderMaterial(model, colorIntensity);

    const applyColorToShaderMaterial = (model, colorIntensity) => {
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.ShaderMaterial({
            uniforms: {
              matcapTexture: { value: this.matcapTexture },
              highlightTexture: { value: this.highlightTexture },
              blendFactor: { value: 0.1 }, // Adjust to control blend between textures
              color: { value: new THREE.Color(colorValue) }, // Apply dynamic color
              colorIntensity: { value: colorIntensity } // Dynamic intensity
            },
            vertexShader: `
                      varying vec3 vNormal;
                      varying vec3 vViewPosition;
                      varying vec2 vUv;

                      void main() {
                        vUv = uv;
                        vNormal = normalize(normalMatrix * normal);
                        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                        vViewPosition = -modelViewPosition.xyz;
                        gl_Position = projectionMatrix * modelViewPosition;
                      }
                    `,
            fragmentShader: `
                      uniform sampler2D matcapTexture;
                      uniform sampler2D highlightTexture;
                      uniform float blendFactor;
                      uniform vec3 color;
                      uniform float colorIntensity;

                      varying vec3 vNormal;
                      varying vec3 vViewPosition;
                      varying vec2 vUv;

                      void main() {
                        vec3 viewDir = normalize(vViewPosition);
                        vec3 reflectedDir = reflect(viewDir, normalize(vNormal));
                        float m = 2.82842712474619 * sqrt(reflectedDir.z + 1.5);
                        vec2 uv = reflectedDir.xy / m + 0.7;

                        // Sample both MatCap textures and increase their brightness
                        vec4 matcapColor = texture2D(matcapTexture, uv) * 1.5;
                        vec4 highlightColor = texture2D(highlightTexture, uv) * 1.3;

                        // Blend the textures with an adjusted factor
                        vec4 blendedColor = mix(matcapColor, highlightColor, blendFactor);

                        // Apply the color tint with dynamic intensity
                        gl_FragColor = vec4(blendedColor.rgb * color * colorIntensity, blendedColor.a);
                      }
                    `,
          });

          child.material.needsUpdate = true; // Ensure the material updates
        }
      });
    }
  }
}