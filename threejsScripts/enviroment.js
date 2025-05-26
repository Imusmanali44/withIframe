import * as THREE from 'three';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export class Environment {
  constructor(scene,renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.envMapLoaded = false;
    this.init();
  }

  async init() {
    try {
      const envMap = await this.loadEnvironment();
      console.log('Environment map loaded:', envMap);
      this.scene.environment = envMap;
      // this.scene.background = envMap;
      this.envMapLoaded = true;
      
      // Dispatch an event to notify that environment is loaded
      const event = new CustomEvent('environmentLoaded');
      document.dispatchEvent(event);
      
      const loaderOverlay = document.querySelector('.loader-overlay');
      if (loaderOverlay) {
        loaderOverlay.style.display = 'none';
      }
    } catch (error) {
      console.error('Failed to load environment map:', error);
    }
  }

  loadEnvironment() {
    return new Promise((resolve, reject) => {
      const loader = new RGBELoader();
      loader.setDataType(THREE.FloatType);
      
      // Add error handling for mobile devices
      loader.setCrossOrigin('anonymous');
      
      // Check if user is on mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Choose HDR file based on device
      const hdrPath = isMobile 
        ? './bg/brown_photostudio_04_2k.hdr'  // Mobile HDR
        : './bg/Jewelry-HDRI-Studio-Light-Beel-v5-gray.hdr';        // Desktop HDR
      
      console.log('Loading HDR for device:', isMobile ? 'mobile' : 'desktop');
      
      loader.load(
        hdrPath,
        (texture) => {
          const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
          pmremGenerator.compileEquirectangularShader();
          
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          
          // Clean up
          texture.dispose();
          pmremGenerator.dispose();
          
          resolve(envMap);
        },
        undefined,
        (error) => {
          console.error('Error loading HDR texture:', error);
          reject(error);
        }
      );
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
