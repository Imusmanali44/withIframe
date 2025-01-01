import * as THREE from 'three';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export class Environment {
  constructor(scene,renderer) {
    this.scene = scene;
    this.renderer  = renderer;
    this.cubemapPaths = [
      './bg/cubemap/1.png', // Positive X (Right)
      './bg/cubemap/1.png', // Negative X (Left)
      './bg/cubemap/3.png', // Positive Y (Top)
      './bg/cubemap/3.png', // Negative Y (Bottom)
      './bg/cubemap/4.png', // Positive Z (Front)
      './bg/cubemap/4.png', // Negative Z (Back)
    ];

   this.init()
  }
 async init(){
 await this.loadEnvironment()
    .then((envMap) => {
      console.log('Environment map loaded:', envMap);
      // Further processing after the environment map is loaded
      this.scene.environment = envMap;
    })
    .catch((error) => {
      console.error('Failed to load environment map:', error);
    });
 }

// loadEnvironment() {
//   const loader = new RGBELoader();
//   loader.setDataType(THREE.FloatType);

//   loader.load(`./bg/brown_photostudio_04_2k.hdr`, (texture) => {
//     const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
//     pmremGenerator.compileEquirectangularShader();

//     const envMap = pmremGenerator.fromEquirectangular(texture).texture;

//     texture.dispose(); // Dispose of the original texture
//     pmremGenerator.dispose(); // Dispose of the PMREMGenerator
//     this.scene.env = envMap;
//     // this.scene.environment = this.scene.env;
//     // this.scene.background = envMap;

//     // Uncomment if you want blurred background
//     // this.scene.backgroundBlurriness = 1;
//   });
// }
loadEnvironment() {
  return new Promise((resolve, reject) => {
    const loader = new RGBELoader();
    loader.setDataType(THREE.FloatType);

    loader.load(
      './bg/brown_photostudio_04_2k.hdr',
      (texture) => {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();

        const envMap = pmremGenerator.fromEquirectangular(texture).texture;

        texture.dispose(); // Dispose of the original texture
        pmremGenerator.dispose(); // Dispose of the PMREMGenerator

        this.scene.env = envMap;
        // this.scene.environment = this.scene.env;
        // this.scene.background = envMap;

        resolve(envMap); // Resolve the promise with the environment map
      },
      undefined, // onProgress (optional)
      (error) => {
        console.error('An error occurred while loading the environment texture', error);
        reject(error); // Reject the promise if an error occurs
      }
    );
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
