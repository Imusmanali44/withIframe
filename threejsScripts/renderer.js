import * as THREE from 'three';

export class Renderer {
  constructor() {
    this.renderer = null; // Initialize the renderer variable
    this.initRenderer();
  }

  initRenderer() {
     const params = {
      exposure: 2.4,
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

    this.renderer = new THREE.WebGLRenderer({ antialias: true,stencil:true ,alpha: true,
      
      preserveDrawingBuffer: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.toneMapping = toneMappingOptions[params.toneMapping];
    this.renderer.toneMappingExposure = params.exposure;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.localClippingEnabled = true;
    // this.renderer.preserveDrawingBuffer = true;
    // this.renderer.sortObjects = true;
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // Use LinearSRGBColorSpace if working with modern Three.js


    // THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
    //   'vec3 CustomToneMapping( vec3 color ) { return color; }',
    //   `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
    //   float toneMappingWhitePoint = 1.0;
    //   vec3 CustomToneMapping( vec3 color ) {
    //     color *= toneMappingExposure;
    //     return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
    //   }`
    // );
    // this.renderer.shadowMap.enabled = true;
  }

  getRenderer() {
    return this.renderer; // This allows access to the renderer instance outside of the class
  }

  updateRendererOnResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
