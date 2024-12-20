import * as THREE from 'three';

export class Lighting {
  constructor(scene) {
    this.scene = scene;
    this.initLighting();
  }

  initLighting() {
    console.log("init lighting");
    const ambientLight = new THREE.AmbientLight("#FAF9F6", 0);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0);
    directionalLight.position.set(0, 10, 0);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.radius = 8;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 20;
    directionalLight.shadow.camera.top = 5;
    directionalLight.shadow.camera.bottom = -5;
    directionalLight.shadow.camera.left = -5;
    directionalLight.shadow.camera.right = 5;
    directionalLight.shadow.bias = -0.001;

    this.scene.add(directionalLight);
  }
}
