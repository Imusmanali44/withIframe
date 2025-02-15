import * as THREE from 'three';



export class PreciousMetalHelper {
  constructor(scene, pMetalMain, modelManager) {
    this.scene = scene;
    this.pMetalMain = pMetalMain
    this.modelManager = modelManager
    
    // this.initFloor();
  }
biColorSegmentOnering(){
 if (this.modelManager.currentDisplayedModels.length === 1) {
      // Clone and add the helper model
    const selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];

      this.pMetalMain.helperModel = this.pMetalMain.cloneModelWithUniqueMaterial(selectedModel);
      this.scene.add(this.pMetalMain.helperModel);
      this.pMetalMain.applyColorToModel(this.pMetalMain.helperModel, "#A09F9D");

      // Create clipping planes
      this.pMetalMain.clippingPlaneRingSingleBi = new THREE.Plane(new THREE.Vector3(0, -1, 0.3), 0);
      this.pMetalMain.clippingPlaneRingHelperBi = new THREE.Plane(new THREE.Vector3(0, 1, -0.3), 0);

      // Apply clipping planes to the materials
      selectedModel.traverse((child) => {
        if (child.isMesh) {
          child.material.clippingPlanes = [this.pMetalMain.clippingPlaneRingSingleBi];
          child.material.clipShadows = true;
          child.material.needsUpdate = true;
        }
      });

      this.pMetalMain.helperModel.traverse((child) => {
        if (child.isMesh) {
          child.material.clippingPlanes = [this.pMetalMain.clippingPlaneRingHelperBi];
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
      this.pMetalMain.biColorSingleBool = true
      console.log("Clipping plane applied to the selected model and helper model.");
    }
   
}

biColorSegment(){
  this.modelManager.GrooveManagerIns.removeMidMeshes();
  if(this.modelManager.selectedModel == 1 && this.modelManager.pair1==false){
    this.biColorSegmentRing1();

  }
  if(this.modelManager.selectedModel == 2 && this.modelManager.pair1==false){
    this.biColorSegmentRing2();

  }
  if(this.modelManager.pair1){
    this.biColorSegmentRing1();
    this.biColorSegmentRing2();

  }


}
 biColorSegmentRing1(){
    const selectedModel = this.modelManager.currentDisplayedModels[this.modelManager.selectedModel - 1];
    if (selectedModel) {
        this.pMetalMain.removeHelperModelAndClipping(1);
         let offset = -0.7
         let helperModelPosX = -0.7
          let helperModelPosY = 0
    
    
    
          // Clone and add the helper model2w34
          this.pMetalMain.helperModel = this.pMetalMain.cloneModelWithUniqueMaterial(selectedModel);
          this.pMetalMain.helperModel.position.set(helperModelPosX, helperModelPosY, 0)
          this.scene.add(this.pMetalMain.helperModel);
    
    
          this.pMetalMain.applyColorToModel(this.pMetalMain.helperModel, "#A09F9D");
    
          // Create clipping planes
          this.pMetalMain.clippingPlaneRing1 = new THREE.Plane(new THREE.Vector3(0, -1, 0.3), 0);
          this.pMetalMain.clippingPlaneRing1helper = new THREE.Plane(new THREE.Vector3(0, 1, -0.3), 0);
    
          // Apply clipping planes to the materials
          selectedModel.traverse((child) => {
            if (child.isMesh) {
              child.material.clippingPlanes = [this.pMetalMain.clippingPlaneRing1];
              child.material.clipShadows = true;
              child.material.needsUpdate = true;
            }
          });
    
          this.pMetalMain.helperModel.traverse((child) => {
            if (child.isMesh) {
              child.material.clippingPlanes = [this.pMetalMain.clippingPlaneRing1helper];
              child.material.clipShadows = true;
              child.material.needsUpdate = true;
            }
          });}
    

 }
 biColorSegmentRing2(){

    const selectedModel = this.modelManager.currentDisplayedModels[1];
    if (selectedModel) {
        this.pMetalMain.removeHelperModelAndClipping(2);
         let offset = -0.7
         let helperModelPosX = 0.7
          let helperModelPosY = -0.15
    
    
    
          // Clone and add the helper model2w34
          this.pMetalMain.helperModelring2 = this.pMetalMain.cloneModelWithUniqueMaterial(selectedModel);
          this.pMetalMain.helperModelring2.position.set(helperModelPosX, helperModelPosY, 0)
          this.scene.add(this.pMetalMain.helperModelring2);
    
    
          this.pMetalMain.applyColorToModel(this.pMetalMain.helperModelring2, "#A09F9D");
    
          // Create clipping planes
          this.pMetalMain.clippingPlaneRing2  = new THREE.Plane(new THREE.Vector3(0, -1, 0.3), 0.1);
          this.pMetalMain.clippingPlaneRing2helper = new THREE.Plane(new THREE.Vector3(0, 1, -0.3), 0.1);
    
          // Apply clipping planes to the materials
          selectedModel.traverse((child) => {
            if (child.isMesh) {
              child.material.clippingPlanes = [this.pMetalMain.clippingPlaneRing2];
              child.material.clipShadows = true;
              child.material.needsUpdate = true;
            }
          });
    
          this.pMetalMain.helperModelring2.traverse((child) => {
            if (child.isMesh) {
              child.material.clippingPlanes = [this.pMetalMain.clippingPlaneRing2helper];
              child.material.clipShadows = true;
              child.material.needsUpdate = true;
            }
          });}


 }

 setoffsetValueGroove(val,tribool){
  if(this.modelManager.selectedModel==1 && !this.modelManager.pair1){
   if(tribool==true){
    if (val == "1:1:1") {

      // offsetTri2 = -0.65
      // offsetTri = 0.75
    }
    else if (val === "1:2:1") {
      // offset = 0.1;
      // offsetTri2 = -0.63
      this.modelManager.midMesh.position.x = -0.63
      this.modelManager.midMeshTri.position.x = -0.78
      this.modelManager.midMesh2.position.x = 0.63
      this.modelManager.midMeshTri2.position.x = 0.78


     
      // offsetTri = 0.78
    }
    else if (val === "1:3:1") {
      
      this.modelManager.midMesh.position.x = -0.6
      this.modelManager.midMeshTri.position.x = -0.8
      this.modelManager.midMesh2.position.x = 0.6
      this.modelManager.midMeshTri2.position.x = 0.8
    }
    else if (val === "1:4:1") {
   
      this.modelManager.midMesh.position.x = -0.57
      this.modelManager.midMeshTri.position.x = -0.83
      this.modelManager.midMesh2.position.x = 0.57
      this.modelManager.midMeshTri2.position.x = 0.83
    }
    else if (val === "2:1:2") {
      // offset = 0.1;
    
      this.modelManager.midMesh.position.x =  -0.657
      this.modelManager.midMeshTri.position.x = -0.737
      this.modelManager.midMesh2.position.x =  0.657
      this.modelManager.midMeshTri2.position.x = 0.737

    }
    else if (val === "3:1:1") {
      // offset = 0.1;
     
      this.modelManager.midMesh.position.x =  -0.575
      this.modelManager.midMeshTri.position.x = -0.665
      this.modelManager.midMesh2.position.x =  0.715
      this.modelManager.midMeshTri2.position.x = 0.800
    }
    else if (val === "2:1:1") {
      // offset = 0.1;
    
      this.modelManager.midMesh.position.x =  -0.560
      this.modelManager.midMeshTri.position.x = -0.665
      this.modelManager.midMesh2.position.x =  0.715
      this.modelManager.midMeshTri2.position.x = 0.810
    }
return;
  }
    if (val === "1:1") {
      // offsetRing1 += 0.05;
    }
    else if (val === "1:2") {
      // offsetRing1 += 0.05;
      this.modelManager.midMesh.position.x -= 0.05;
  
  
    }
    else if (val === "1:3") {
      // offsetRing1 += 0.07
      this.modelManager.midMesh.position.x -= 0.07;
  
      
    }
    else if (val === "1:4") {
      // offsetRing1 += 0.09
      this.modelManager.midMesh.position.x -= 0.09;
  
  
    }


  }
  if(this.modelManager.selectedModel==2 && !this.modelManager.pair1){

    if (val === "1:1") {
      // offsetRing1 += 0.05;
    }
    else if (val === "1:2") {
      // offsetRing1 += 0.05;
      // this.modelManager.midMesh.position.x -= 0.05;
    this.modelManager.midMesh2.position.x -= 0.1;

  
  
    }
    else if (val === "1:3") {
      // offsetRing1 += 0.07
    this.modelManager.midMesh2.position.x -= 0.7;

  
      
    }
    else if (val === "1:4") {
      // offsetRing1 += 0.09
      this.modelManager.midMesh2.position.x -= 0.09;

  
  
    }


  }
 else if(this.modelManager.pair1){
  if(tribool==true){
    if (val == "1:1:1") {

      // offsetTri2 = -0.65
      // offsetTri = 0.75
    }
    else if (val === "1:2:1") {
      // offset = 0.1;
      // offsetTri2 = -0.63
      this.modelManager.midMesh.position.x = -0.63
      this.modelManager.midMeshTri.position.x = -0.78
      this.modelManager.midMesh2.position.x = 0.63
      this.modelManager.midMeshTri2.position.x = 0.78


     
      // offsetTri = 0.78
    }
    else if (val === "1:3:1") {
      
      this.modelManager.midMesh.position.x = -0.6
      this.modelManager.midMeshTri.position.x = -0.8
      this.modelManager.midMesh2.position.x = 0.6
      this.modelManager.midMeshTri2.position.x = 0.8
    }
    else if (val === "1:4:1") {
   
      this.modelManager.midMesh.position.x = -0.57
      this.modelManager.midMeshTri.position.x = -0.83
      this.modelManager.midMesh2.position.x = 0.57
      this.modelManager.midMeshTri2.position.x = 0.83
    }
    else if (val === "2:1:2") {
      // offset = 0.1;
    
      this.modelManager.midMesh.position.x =  -0.657
      this.modelManager.midMeshTri.position.x = -0.737
      this.modelManager.midMesh2.position.x =  0.657
      this.modelManager.midMeshTri2.position.x = 0.737

    }
    else if (val === "3:1:1") {
      // offset = 0.1;
     
      this.modelManager.midMesh.position.x =  -0.575
      this.modelManager.midMeshTri.position.x = -0.665
      this.modelManager.midMesh2.position.x =  0.715
      this.modelManager.midMeshTri2.position.x = 0.800
    }
    else if (val === "2:1:1") {
      // offset = 0.1;
    
      this.modelManager.midMesh.position.x =  -0.560
      this.modelManager.midMeshTri.position.x = -0.665
      this.modelManager.midMesh2.position.x =  0.715
      this.modelManager.midMeshTri2.position.x = 0.810
    }
return;
  }
  
  if (val === "1:1") {
    // offsetRing1 += 0.05;
  }
  else if (val === "1:2") {
    // offsetRing1 += 0.05;
    this.modelManager.midMesh.position.x -= 0.05;
    this.modelManager.midMesh2.position.x -= 0.05;


  }
  else if (val === "1:3") {
    // offsetRing1 += 0.07
    this.modelManager.midMesh.position.x -= 0.07;
    this.modelManager.midMesh2.position.x -= 0.07;

    
  }
  else if (val === "1:4") {
    // offsetRing1 += 0.09
    this.modelManager.midMesh.position.x -= 0.09;
    this.modelManager.midMesh2.position.x -= 0.09;


  }

  // this.pMetalMain
  }
  

 }
}
