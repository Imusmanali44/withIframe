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
}
