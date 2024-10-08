import * as THREE from 'three';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.loadEnvironment();
  }

  loadEnvironment() {
    const loader = new RGBELoader();
    loader.setDataType(THREE.FloatType);

    loader.load(`./bg/moonless_golf_1k.hdr`, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.needsUpdate = true;

      this.scene.environment = texture;
      this.scene.backgroundBlurriness = 1;
    });
  }
}
