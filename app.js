import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

class RotatingRingApp {
  constructor() {
    // Set up the scene, camera, and renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#FAF9F6'); // Light gray background

     // Closer position
     this.setupCamera();
   this.setupRenderer() // Enable shadow
   this.addLighting();
    this.addFloor();
    this.laodEnviroment();
    document.body.appendChild(this.renderer.domElement);

    window.addEventListener('message', (event) => {
      console.log('Message received from parent:', event.data);
      this.iframeMsgToSwitchModel(event.data);
    });

    // Add lighting
    
    this.models = [];
    this.currentModelIndex = 0; // Track current model index

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

    modelData.forEach((data, index) => {
      this.loadGLBModel2(data.glbPath, data.texturePath, index);
    });

    // Add orbit controls for rotation with the mouse
    this.setupOrbitControls();


    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Listen for key presses to switch models
    window.addEventListener('keydown', this.switchModelLocal.bind(this));

    // Start the render loop
    this.animate();
  }

  setupCamera(){
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(1, 1, 4.5);
  }

  setupRenderer(){
    const params = {
      exposure: 2,
      toneMapping: 'AgX',
      blurriness: 0.3,
      intensity: 1.0,
    };

    const toneMappingOptions = {
      None: THREE.NoToneMapping,
      Linear: THREE.LinearToneMapping,
      Reinhard: THREE.ReinhardToneMapping,
      Cineon: THREE.CineonToneMapping,
      ACESFilmic: THREE.ACESFilmicToneMapping,
      AgX: THREE.AgXToneMapping,
      Neutral: THREE.NeutralToneMapping,
      Custom: THREE.CustomToneMapping
    };
    
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.toneMapping = toneMappingOptions[ params.NeutralToneMapping ];
			this.renderer.toneMappingExposure = params.exposure;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(

      'vec3 CustomToneMapping( vec3 color ) { return color; }',

      `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )

      float toneMappingWhitePoint = 1.0;

      vec3 CustomToneMapping( vec3 color ) {
        color *= toneMappingExposure;
        return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );

      }`

    );
    this.renderer.shadowMap.enabled = true;


  }
  laodEnviroment(resolution = '2k', type = 'HalfFloatType' ){
    let loader = new RGBELoader();
				loader.setDataType( THREE.FloatType );

      loader.setDataType( THREE[ type ] );

      loader.load( `bg/moonless_golf_1k.hdr`,  ( texture ) => {

        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.needsUpdate = true;

        // this.scene.background = texture;
        this.scene.environment = texture;
        this.scene.backgroundBlurriness = 1

      } );

    


  }
  setupOrbitControls(){
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2.1;
    this.controls.enableZoom = false
  }

  iframeMsgToSwitchModel(str) {
    switch (str) {
      case "P1":
        this.switchModel(0);
        break;
      case "P2":
        this.switchModel(1);
        break;
      case "P3":
        this.switchModel(2);
        break;
      case "P4":
        this.switchModel(3);
        break;
      case "P5":
        this.switchModel(4);
        break;
      case "P6":
        this.switchModel(5);
        break;
      case "P7":
        this.switchModel(6);
        break;
      case "P8":
        this.switchModel(7);
        break;
      case "P9":
        this.switchModel(8);
        break;
      case "P10":
        this.switchModel(9);
        break;
      case "P11":
        this.switchModel(10);
        break;
      case "P12":
        this.switchModel(11);
        break;
      case "P13":
        this.switchModel(12);
        break;
      case "P14":
        this.switchModel(13);
        break;
      case "P15":
        this.switchModel(14);
        break;
      default:
        console.warn("Unknown model identifier:", str);
        break;
    }
  }

  addFloor() {
    const floorGeometry = new THREE.PlaneGeometry(100, 100); // Large floor
    const floorMaterial = new THREE.ShadowMaterial({
      color: "black", // Blue for watery effect
      opacity: 0.05,
      metalness: 0.8,    // High metalness for reflectivity
      roughness: 0.5,  // Low roughness for smoother reflections
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to make it flat horizontally
    floor.position.y = -1.3; // Set the floor at y=0
    floor.receiveShadow = true; // Allow the floor to receive shadows
    this.scene.add(floor);
  }

  addLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft ambient light
    this.scene.add(ambientLight);

    // Directional light directly from above
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 0); // Positioned directly above the object
    directionalLight.castShadow = true;

    // Soft shadow settings
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.radius = 8; // Soft shadow radius
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 20;
    directionalLight.shadow.camera.top = 5;
    directionalLight.shadow.camera.bottom = -5;
    directionalLight.shadow.camera.left = -5;
    directionalLight.shadow.camera.right = 5;

    // Slight bias to avoid shadow artifacts
    directionalLight.shadow.bias = -0.001;

    this.scene.add(directionalLight);
}

  // Load a GLB model into the scene
  loadGLBModel2(glbPath, texturePath, index) {
    const loader = new GLTFLoader();
    loader.load(glbPath, (gltf) => {
      const model = gltf.scene;
      this.models.push(model);

      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#FEEB75"),
            metalness: 0.8,
            roughness: 0,
            emissive: new THREE.Color(0x111111),
            emissiveIntensity: 0.5,
          });
          child.castShadow = true;
        }
      });

      if (index !== 0) {
        model.visible = false; // Hide all models except the first one initially
      }
      model.scale.set(100, 100, 100);
      this.scene.add(model);
      this.controls.target.copy(model.position);
    });
  }

  // Switch between models
  switchModelLocal(event) {
    this.camera.position.set(1, 1, 4.5);
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      this.models[this.currentModelIndex].visible = false;

      if (event.key === 'ArrowRight') {
        this.currentModelIndex = (this.currentModelIndex + 1) % this.models.length;
      } else if (event.key === 'ArrowLeft') {
        this.currentModelIndex = (this.currentModelIndex - 1 + this.models.length) % this.models.length;
      }

      this.models[this.currentModelIndex].visible = true;
      this.controls.target.copy(this.models[this.currentModelIndex].position);
      this.controls.update();
    }
  }

  switchModel(index) {
    if (index < 0 || index >= this.models.length) {
      console.warn("Invalid model index:", index);
      return;
    }

    this.models[this.currentModelIndex].visible = false;
    this.currentModelIndex = index;
    this.models[this.currentModelIndex].visible = true;
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
