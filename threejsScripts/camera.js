import * as THREE from 'three';

export class Camera {
  constructor(scene) {
    this.scene = scene;
    this.camera = null; // Initialize the camera variable
    this.initCamera();
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(1, 1, 3);
    
    // Add the camera to the scene if required
    this.scene.add(this.camera);
  }

  getCamera() {
    return this.camera; // This allows access to the camera instance outside of the class
  }

  updateCameraOnResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}
