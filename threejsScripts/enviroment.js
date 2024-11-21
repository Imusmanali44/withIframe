import * as THREE from 'three';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.cubemapPaths = [
      './bg/cubemap/1.png', // Positive X (Right)
      './bg/cubemap/1.png', // Negative X (Left)
      './bg/cubemap/3.png', // Positive Y (Top)
      './bg/cubemap/3.png', // Negative Y (Bottom)
      './bg/cubemap/4.png', // Positive Z (Front)
      './bg/cubemap/4.png', // Negative Z (Back)
    ];
    this.loadEnvironment();
  }

  loadEnvironment() {
    const loader = new RGBELoader();
    loader.setDataType(THREE.FloatType);

    loader.load(`./bg/silver4.hdr`, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.needsUpdate = true;

      this.scene.environment = texture;
      this.scene.backgroundBlurriness = 1;
    });
  }
  // loadEnvironment() {
  //   // Check that cubemapPaths contains exactly 6 paths (one for each side of the cube)
  //   if (this.cubemapPaths.length !== 6) {
  //     console.warn("Cubemap requires 6 image paths (one for each side).");
  //     return;
  //   }

  //   // Load the cubemap texture
  //   const loader = new THREE.CubeTextureLoader();
  //   const textureCube = loader.load(this.cubemapPaths, () => {
  //     console.log("Cubemap loaded successfully");
  //   });

  //   // Set the loaded cubemap as the background
  //   // this.scene.background = textureCube;
  //    this.scene.environment = textureCube;

  //   this.scene.backgroundBlurriness = 1;
  // }
}
