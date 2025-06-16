import * as THREE from 'three';

export class Renderer {
  constructor() {
    this.initRenderer();
  }

  initRenderer() {
    const params = {
      exposure: 1.2,
      toneMapping: 'ACESFilmic',
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
      Custom: THREE.CustomToneMapping,
    };

    // Optimize for mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio;

    this.renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile,
      stencil: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.toneMapping = toneMappingOptions[params.toneMapping];
    this.renderer.toneMappingExposure = params.exposure;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.localClippingEnabled = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    // Optimize for mobile
    if (isMobile) {
      this.renderer.shadowMap.enabled = false;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }

  getRenderer() {
    return this.renderer;
  }

  updateRendererOnResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
