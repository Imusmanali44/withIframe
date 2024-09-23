import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Import GLTFLoader

class RotatingRingApp {
  constructor() {
    // Set up the scene, camera, and renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xC4C6C7); // White background

    this.camera = new THREE.PerspectiveCamera(1, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 1, 2); // Closer position

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true; // Enable shadow
    document.body.appendChild(this.renderer.domElement);

    window.addEventListener('message', (event) => {
      // Optional: Check the origin of the message for security
      // if (event.origin !== 'http://your-domain.com') return;
  
      // console.log('Message received from parent ffffffff:', event.data);
      this.iframeMsgToSwitchModel(event.data)
      // Optionally, send a response back to the parent
      // event.source.postMessage('Received your message! fffssss', event.origin);
    });

    // Add lighting
    this.addLighting();
    // this.addFloor();
    this.models = [];
    this.currentModelIndex = 0; // Track current model index

    // Load GLB models
    const modelData = [
      { glbPath: 'models/p2.glb', texturePath: 'path/to/texture2.jpg' },
      { glbPath: 'models/p3.glb', texturePath: 'path/to/texture3.jpg' },
      { glbPath: 'models/p1.glb', texturePath: 'path/to/texture1.jpg' },
    ];
    
    modelData.forEach((data, index) => {
      this.loadGLBModel2(data.glbPath, data.texturePath, index);
    });

    // Add orbit controls for rotation with the mouse
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2.1;

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Listen for key presses to switch models
    window.addEventListener('keydown', this.switchModelLocal.bind(this));

    // Start the render loop
    this.animate();
  }

  iframeMsgToSwitchModel(str) {
    // Determine which model to switch to based on the string
    switch (str) {
      case "P1":
        this.switchModel(0); // Assuming P1 corresponds to index 0
        break;
      case "P2":
        this.switchModel(1); // Assuming P2 corresponds to index 1
        break;
      case "P3":
        this.switchModel(2); // Assuming P3 corresponds to index 2
        break;
      default:
        // console.warn("Unknown model identifier:", str);
        break;
    }
  }




  


  addFloor() {
    const floorGeometry = new THREE.PlaneGeometry(1, 1); // Large floor
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080, // Gray floor
      // side: THREE.DoubleSide,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to make it flat horizontally
    floor.position.y = -0.1; // Set the floor at y=0
    floor.receiveShadow = true; // Allow the floor to receive shadows
    // floor.position.set(0, -4, 0);
    this.scene.add(floor);
  }


  // Add lighting to the scene
  addLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5); // Soft overall light
    this.scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    this.scene.add(hemisphereLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight1.position.set(5, 10, 10);
    directionalLight1.castShadow = true;
    this.scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight2.position.set(-5, 10, -10);
    directionalLight2.castShadow = true;
    this.scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight3.position.set(0, 10, 5);
    directionalLight3.castShadow = true;
    this.scene.add(directionalLight3);

    const pointLight = new THREE.PointLight(0xffffff, 2, 50);
    pointLight.position.set(0, 5, 5);
    this.scene.add(pointLight);
  }

  // Load a GLB model into the scene
  loadGLBModel2(glbPath, texturePath, index) {
    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    loader.load(glbPath, (gltf) => {
      const model = gltf.scene;
      this.models.push(model);

      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#FFD700"),
            metalness: 0.8,
            roughness: 0.2,
            emissive: new THREE.Color(0x111111),
            emissiveIntensity: 0.1,
          });
          child.castShadow = true;
        }
      });

      if (index !== 0) {
        model.visible = false; // Hide all models except the first one initially
      }

      this.scene.add(model);
      this.controls.target.copy(model.position);
    });
  }

  // Switch between models
  switchModelLocal(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      // Hide the current model
      this.models[this.currentModelIndex].visible = false;

      // Update index based on arrow key press
      if (event.key === 'ArrowRight') {
        this.currentModelIndex = (this.currentModelIndex + 1) % this.models.length;
      } else if (event.key === 'ArrowLeft') {
        this.currentModelIndex = (this.currentModelIndex - 1 + this.models.length) % this.models.length;
      }

      // Show the next model
      this.models[this.currentModelIndex].visible = true;

      // Update the camera target to the new model
      this.controls.target.copy(this.models[this.currentModelIndex].position);
      this.controls.update();
    }
  }
  switchModel(index) {
    // Ensure the index is within bounds
    if (index < 0 || index >= this.models.length) {
      // console.warn("Invalid model index:", index);
      return;
    }
  
    // Hide the current model
    this.models[this.currentModelIndex].visible = false;
  
    // Update the current model index
    this.currentModelIndex = index;
  
    // Show the new model
    this.models[this.currentModelIndex].visible = true;
  
    // Update the camera target to the new model's position
    this.controls.target.copy(this.models[this.currentModelIndex].position);
    this.controls.update();
  }

  // Handle window resizing
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Render loop
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate the app
new RotatingRingApp();
