import * as THREE from 'three';
import { Lighting } from './threejsScripts/lighting.js';
import { Floor } from './threejsScripts/Floor.js';
import { Environment } from './threejsScripts/enviroment.js';
import { Camera } from './threejsScripts/camera.js';
import { Renderer } from './threejsScripts/renderer.js';
import { OrbitControlHandler } from './threejsScripts/OrbitControlManager.js'; // Import the new OrbitControlManager class
import { ModelManager } from './threejsScripts/ModelManager.js'; // Import the new ModelManager class
import { MessageHandler } from './threejsScripts/MessageHandler.js'; // Import MessageHandler
import {PreciousMetal} from "./threejsScripts/PreciousMetal.js";
import { PreciousMetalHelper } from './threejsScripts/PreciousMetalHelper.js';
import {EngagementRings} from "./threejsScripts/engagementRings/EngagementRings.js"



// var isPair = true;

class RotatingRingApp {
  constructor() {
    // Set up the scene, camera, and renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#FFFFFF'); // Light gray background
    this.scene.env = null;
    // this.modelManager = new ModelManager(this.scene);
    this.cameraInstance = new Camera(this.scene);
    this.camera = this.cameraInstance.getCamera(); // Get the camera instance
    this.rendererInstance = new Renderer();
    this.renderer = this.rendererInstance.getRenderer(); 
    this.renderer.localClippingEnabled = true;
    // this.PreciousMetalins = new PreciousMetal(this.scene,this.modelManager, this.renderer );
    

    this.PreciousMetalins = new PreciousMetal(this.scene, null,null, this.renderer);

    // Create ModelManager and pass PreciousMetal instance
    this.modelManager = new ModelManager(this.scene, this.PreciousMetalins);

    // Update PreciousMetal with ModelManager instance
    this.PreciousMetalins.modelManager = this.modelManager;
    
    this.PreciousMetalHelper = new PreciousMetalHelper(this.scene,this.PreciousMetalins,this.modelManager  )
    this.EngagementRings = new EngagementRings(this.scene,this.modelManager);
    this.modelManager.EngagementRingsins  = this.EngagementRings 
    this.PreciousMetalins.pmHelper = this.PreciousMetalHelper
    this.lighting = new Lighting(this.scene);
    this.floor = new Floor(this.scene, this.camera, this.renderer);
    this.environment = new Environment(this.scene, this.renderer);
    this.OrbitControlHandler = new OrbitControlHandler(this.camera, this.renderer.domElement);
    this.messageHandler = new MessageHandler(this.modelManager, this.PreciousMetalins);
    
    document.body.appendChild(this.renderer.domElement);

    // Load GLB models
    const modelData = [
      { glbPath: 'models/p2.glb', texturePath: 'path/to/texture2.jpg' },
      { glbPath: 'models/p3.glb', texturePath: 'path/to/texture3.jpg' },
      { glbPath: 'models/p1.glb', texturePath: 'path/to/texture1.jpg' },
      { glbPath: 'models/p4.glb' },
      { glbPath: 'models/p5.glb' },
      { glbPath: 'models/p6.glb' },
      { glbPath: 'models/p7.glb' },
      { glbPath: 'models/p8.glb' },
      { glbPath: 'models/p9.glb' },
      { glbPath: 'models/p10.glb' },
      { glbPath: 'models/p11.glb' },
      { glbPath: 'models/p12.glb' },
      { glbPath: 'models/p13.glb' },
      { glbPath: 'models/p14.glb' },
      { glbPath: 'models/p15.glb' },
    ];

  
    this.modelManager.loadModels(modelData);


    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Listen for key presses to switch models
    window.addEventListener('keydown', this.switchModelLocal.bind(this));

    // Start the render loop
    this.animate();
    console.log("loaded")
  }

  showCurrentModels() {
    this.modelManager.showCurrentModels(this.currentModelIndex);
  }

  hideCurrentModels() {
    this.modelManager.hideCurrentModels();
  }
  addSecondModel(type, selectedRing){
    this.modelManager.addSecondModel(type,selectedRing)
  }

  addThirdModel(type, selectedRing) {
    this.modelManager.addThirdModel(type, selectedRing);
  }

  addFourthModel(type, selectedRing) {
    this.modelManager.addFourthModel(type, selectedRing);
  }

  removeThirdModel() {
    this.modelManager.removeThirdModel();
  }

  removeFourthModel() {
    this.modelManager.removeFourthModel();
  }
  removeSecondModel(){
    this.modelManager.removeSecondModel();
  }

  
  switchModelLocal(event) {
    // this.camera.position.set(1, 1, 5);
    // if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
     
    // }
  }


  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.OrbitControlHandler.updateControls(); 
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate the app
new RotatingRingApp();
