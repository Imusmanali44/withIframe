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
import { GrooveManager } from './threejsScripts/grooveManager/GrooveManager.js';
import { StepsManager } from './threejsScripts/grooveManager/StepsManager.js';
import { StoneManager } from './threejsScripts/stoneManager/stoneManager.js';
import { MemoirRings } from './threejsScripts/memoirRings/MemoirRings.js';



// var isPair = true;

class RotatingRingApp {
  constructor() {
    // Set up the scene, camera, and renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#FFFFFF'); // Light gray background
    this.scene.env = null;
    
    this.cameraInstance = new Camera(this.scene);
    this.camera = this.cameraInstance.getCamera();
    this.rendererInstance = new Renderer();
    this.renderer = this.rendererInstance.getRenderer(); 
    this.renderer.localClippingEnabled = true;

    this.PreciousMetalins = new PreciousMetal(this.scene, null, null, this.renderer);
    this.modelManager = new ModelManager(this.scene, this.PreciousMetalins, this.renderer);
    this.PreciousMetalins.modelManager = this.modelManager;
    
    this.PreciousMetalHelper = new PreciousMetalHelper(this.scene, this.PreciousMetalins, this.modelManager);
    this.EngagementRings = new EngagementRings(this.scene, this.modelManager, this.renderer);
    this.MemoirRings = new MemoirRings(this.scene, this.modelManager, this.renderer);

    this.GrooveManager = new GrooveManager(this.scene, this.modelManager);
    this.StepsManager = new StepsManager(this.scene, this.modelManager, this.GrooveManager);
    this.StoneManager = new StoneManager(this.scene, this.modelManager, this.renderer);
    
    this.modelManager.StoneManagerIns = this.StoneManager;
    this.modelManager.EngagementRingsins = this.EngagementRings;
    this.modelManager.MemoirRingsins = this.MemoirRings;
    this.modelManager.GrooveManagerIns = this.GrooveManager;
    this.modelManager.StepsManagerIns = this.StepsManager;

    this.PreciousMetalins.pmHelper = this.PreciousMetalHelper;
    this.lighting = new Lighting(this.scene);
    this.floor = new Floor(this.scene, this.camera, this.renderer);
    this.environment = new Environment(this.scene, this.renderer);
    this.OrbitControlHandler = new OrbitControlHandler(this.camera, this.renderer.domElement);
    this.messageHandler = new MessageHandler(this.modelManager, this.PreciousMetalins);
    
    document.body.appendChild(this.renderer.domElement);

    // Wait for environment to load before loading models
    document.addEventListener('environmentLoaded', () => {
      // Load GLB models
      const modelData = [
        { glbPath: 'models/p1.glb', texturePath: 'path/to/texture2.jpg' },
        { glbPath: 'models/p2.glb', texturePath: 'path/to/texture3.jpg' },
        { glbPath: 'models/p3.glb', texturePath: 'path/to/texture1.jpg' },
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
      console.log("Models loaded after environment");
    });

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Start the render loop
    this.animate();
    console.log("App initialized");
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
window.app = new RotatingRingApp();



// Simulate loading process
// setTimeout(() => {
//     // Hide the loader after loading is complete
//     document.getElementById('loader').style.display = 'none';
    
//     // Your existing code to initialize Three.js or other operations
//     // ...existing code...
// }, 9000); 
