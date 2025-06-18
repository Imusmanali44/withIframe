import * as THREE from 'three';
import { TextureLoader } from 'three';

// Class to handle diamond materials with cubemap
export class DiamondMaterialManager {
  constructor(renderer) {
    this.renderer = renderer;
    this.envMap = null;
    this.envMapPMREM = null;
    this.pmremGenerator = null;
    this.textureLoader = new TextureLoader();
    this.initializeCubemap();
  }

  initializeCubemap() {
    // Create cubemap loader
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    
    // Load cubemap textures (same order as in your HTML file)
    this.envMap = cubeTextureLoader.load([
      'diamondMap/2r.jpg',  // positive X
      'diamondMap/1r.jpg',  // negative X  
      'diamondMap/2r.jpg',  // positive Y
      'diamondMap/2r.jpg',  // negative Y
      'diamondMap/1r.jpg',  // positive Z
      'diamondMap/1r.jpg',  // negative Z
    ], 
    // onLoad callback
    () => {
      console.log('Cubemap textures loaded successfully');
      // Create PMREM generator for better environment mapping
      this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      this.pmremGenerator.compileEquirectangularShader();
      
      // Convert cubemap to PMREM format
      this.envMapPMREM = this.pmremGenerator.fromCubemap(this.envMap).texture;
      
      console.log('Diamond cubemap initialized and converted to PMREM');
    },
    // onProgress callback
    (xhr) => {
      console.log('Cubemap loading progress:', xhr);
    },
    // onError callback
    (error) => {
      console.error('Error loading cubemap textures:', error);
      console.error('Make sure diamondMap/2r.jpg and diamondMap/1r.jpg exist in your public folder');
    });

    // Load big diamond cubemap textures
    this.envMapBigDiamond = cubeTextureLoader.load([
      'diamondMap/2rb.jpg',  // positive X
      'diamondMap/1rb.jpg',  // negative X  
      'diamondMap/2rb.jpg',  // positive Y
      'diamondMap/2rb.jpg',  // negative Y
      'diamondMap/1rb.jpg',  // positive Z
      'diamondMap/1r.jpg',  // negative Z
    ], 
    // onLoad callback
    (texture) => {
      texture.encoding = THREE.sRGBEncoding;
      if (this.pmremGenerator) {
        this.envMapPMREMbigDiamond = this.pmremGenerator.fromCubemap(texture).texture;
      } else {
        // Create PMREM generator if not already created
        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.pmremGenerator.compileEquirectangularShader();
        this.envMapPMREMbigDiamond = this.pmremGenerator.fromCubemap(texture).texture;
      }
      console.log('Big diamond cubemap initialized and converted to PMREM');
    },
    // onProgress callback
    (xhr) => {
      console.log('Big diamond cubemap loading progress:', xhr);
    },
    // onError callback
    (error) => {
      console.error('Error loading big diamond cubemap textures:', error);
    });
  }

  createDiamondMaterial(baseColor = new THREE.Color(0xffffff)) {
    // Create realistic diamond material using "Clear Diamond" settings from the preset
    console.log("createDiamondMaterial")
    const material = new THREE.MeshPhysicalMaterial({
      // Ensure white base color for diamond
      color: new THREE.Color(0xffffff),
      // Clear Diamond preset material settings
      metalness: 0.55,
      roughness: 0,
      envMapIntensity: 2.0, // Increased for better reflections
      transmission: 1,  // Add transmission for glass-like effect
      ior: 2.4,          // Index of refraction - more realistic diamond value
      reflectivity: 1.2,
      clearcoat: 1,
      clearcoatRoughness: 0, // Ensure clear coat is perfectly smooth
      thickness: 4.0, // simulate refraction
      transparent: true,
      opacity: 0.9,
      depthWrite: true,
      depthTest: true,
      polygonOffset: false,
      // Enhanced properties from HTML version
      specularIntensity: 1,
      specularColor: new THREE.Color(1, 1, 1),
      // Ensure proper side rendering for transparency
      side: THREE.DoubleSide,
    });

    // Apply the cubemap environment - wait for it to be ready
    if (this.envMapPMREM) {
      material.envMap = this.envMapPMREM;
    } else {
      // If not ready yet, apply when ready
      const checkEnvMap = () => {
        if (this.envMapPMREM) {
          material.envMap = this.envMapPMREM;
          material.needsUpdate = true;
        } else {
          setTimeout(checkEnvMap, 100);
        }
      };
      checkEnvMap();
    }
    
    // Set stencil properties for proper rendering order
    material.stencilWrite = true;
    material.stencilRef = 2;
    material.stencilFunc = THREE.AlwaysStencilFunc;
    material.stencilZPass = THREE.ReplaceStencilOp;

    return material;
  }

  createDiamondMaterialBigDiamond(baseColor = new THREE.Color(0xffffff)) {
    // Create realistic diamond material using "Clear Diamond" settings from the preset
    console.log("createDiamondMaterialBigDiamond")
    const material = new THREE.MeshPhysicalMaterial({
      // Ensure white base color for diamond
      color: new THREE.Color(0xffffff),
      // Clear Diamond preset material settings
      metalness: 0.6,
      roughness: 0,
      envMapIntensity: 1.5, // Adjusted for big diamond
      transmission: 1,  // Add transmission for glass-like effect
      ior: 1.2,          // Adjusted index of refraction
      reflectivity: 1.2,
      clearcoat: 1,
      clearcoatRoughness: 0, // Ensure clear coat is perfectly smooth
      thickness: 2.0, // Adjusted thickness
      transparent: true,
      opacity: 0.9,
      depthWrite: true,
      depthTest: true,
      polygonOffset: false,
      // Enhanced properties from HTML version
      specularIntensity: 1,
      specularColor: new THREE.Color(1, 1, 1),
      // Ensure proper side rendering for transparency
      side: THREE.DoubleSide,
    });

    // Apply the big diamond cubemap environment - wait for it to be ready
    if (this.envMapPMREMbigDiamond) {
      material.envMap = this.envMapPMREMbigDiamond;
    } else {
      // If not ready yet, apply when ready
      const checkEnvMap = () => {
        if (this.envMapPMREMbigDiamond) {
          material.envMap = this.envMapPMREMbigDiamond;
          material.needsUpdate = true;
        } else {
          setTimeout(checkEnvMap, 100);
        }
      };
      checkEnvMap();
    }
    
    // Set stencil properties for proper rendering order
    material.stencilWrite = true;
    material.stencilRef = 2;
    material.stencilFunc = THREE.AlwaysStencilFunc;
    material.stencilZPass = THREE.ReplaceStencilOp;

    return material;
  }

  applyDiamondTextures(material, textureUrl, effects) {
    if (!effects) return Promise.resolve();

    // Only apply normal map from Clear Diamond preset settings
    const promises = [];

    // Apply normal map only (as per Clear Diamond preset)
    if (effects.normalMap) {
      console.log("applyDiamondTextures normalMap")
      const promise = new Promise((resolve, reject) => {
        this.textureLoader.load(
          './diamondMap/1b.jpg', // Clear Diamond preset normal map
          (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            // Set proper encoding for normal map (linear encoding for normal maps)
            texture.encoding = THREE.LinearEncoding;
            material.normalMap = texture;
            material.normalScale = new THREE.Vector2(2, 2); // Clear Diamond preset normal scale
            material.needsUpdate = true;
            resolve();
          },
          undefined,
          reject
        );
      });
      promises.push(promise);
    }

    return Promise.all(promises);
  }

  dispose() {
    if (this.pmremGenerator) {
      this.pmremGenerator.dispose();
    }
    if (this.envMapPMREM) {
      this.envMapPMREM.dispose();
    }
    if (this.envMap) {
      this.envMap.dispose();
    }
    if (this.envMapPMREMbigDiamond) {
      this.envMapPMREMbigDiamond.dispose();
    }
    if (this.envMapBigDiamond) {
      this.envMapBigDiamond.dispose();
    }
  }
} 