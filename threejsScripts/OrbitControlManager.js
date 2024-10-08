import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class OrbitControlHandler {
  constructor(camera, rendererDomElement) {
    this.camera = camera;
    this.rendererDomElement = rendererDomElement;
    this.controls = null; // Initialize controls
    this.setupOrbitControls();
  }

  // Method to initialize orbit controls
  setupOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.rendererDomElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2.1;
    this.controls.enableZoom = false;
  }

  // Method to update the orbit controls target based on the number of models displayed
  updateOrbitControlsTarget(numModelsToShow) {
    if (numModelsToShow === 2) {
      // Target between the two models
      this.controls.target.set(0, 0, 0);
    } else if (numModelsToShow === 3) {
      // Target the middle model (2nd one)
      this.controls.target.set(0, 0, 0);
    } else if (numModelsToShow === 4) {
      // Target between the 2nd and 3rd models
      this.controls.target.set(0, 0, 0);
    }
    this.controls.update();
  }

  // Method to update the orbit controls per frame
  updateControls() {
    this.controls.update();
  }
}
