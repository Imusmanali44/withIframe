import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
export class StepsManager {
  constructor(scene,modelManager,grooveManager) {
    this.scene = scene;
    // Initialize the camera variable
   
    // this.loadMidMesh();
    this.modelManager = modelManager
    this.grooveManager = grooveManager
    // console.log( )
  }

 async addLeftStep(){
    await this.modelManager.loadMidMesh("U-groove",false)
    this.leftStep  = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
    this.leftStep.userData = "leftStepRing1"
    // this.rightStep = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
    // this.rightStep.userData = "leftStepRing1"

    this.grooveManager.removeMidMeshes();
    this.leftStep.position.x = -0.88
    // this.rightStep.position.x = -0.55

    // console.log("aa chk razi",this.modelManager.midMesh.position.x)
    this.scene.add(this.leftStep)
    // this.scene.add(this.rightStep)


  }

  async addRightStep(){
    await this.modelManager.loadMidMesh("U-groove",false)
    // this.leftStep  = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
    // this.leftStep.userData = "leftStepRing1"
    this.rightStep = this.modelManager.cloneModelWithUniqueMaterial(this.modelManager.midMesh)
    this.rightStep.userData = "rightStepRing1"

    this.grooveManager.removeMidMeshes();
    // this.leftStep.position.x = -0.86
    this.rightStep.position.x = -0.52

    // console.log("aa chk razi",this.modelManager.midMesh.position.x)
    // this.scene.add(this.leftStep)
    this.scene.add(this.rightStep)


  }

}