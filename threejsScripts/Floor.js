import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { blur } from 'three/webgpu';

export class Floor {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.initFloor();
  }

  initFloor() {
    // Reflector configuration (reflective floor)
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const reflector = new Reflector(floorGeometry, {
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: "#424242", // Color of the reflective floor
      recursion: 1,
    });

    reflector.rotation.x = -Math.PI / 2; // Rotate to lie flat
    reflector.position.y = -1.10; // Set the floor height
    this.scene.add(reflector);

    // Optionally, you can add shadow support as well
    reflector.receiveShadow = true;

    // Semi-transparent plane above the reflector for the dimming effect
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: "#FAF9F6", // Dark blue
      transparent: true,
      opacity: 0.9,
      reflectivity: 1,
      blur: 0.5
    });
    
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Same rotation as the reflector
    plane.position.y = -1.05; // Slightly above the reflector
    this.scene.add(plane);
  }
}
