 diamondModel.traverse((child) => {
      if (child.isMesh && child.material) {
        // Create a new material or clone the existing one to ensure proper settings
        if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
          // Apply main texture to most map types
          if (effects.map) {
            child.material.map = texture;
          }
    
          if (effects.normalMap) {
            child.material.normalMap = texture;
            child.material.normalScale = new THREE.Vector2(1, 1);
          }
    
          if (effects.roughnessMap) {
            child.material.roughnessMap = texture;
            // Lower roughness for more shininess
            child.material.roughness = 0.2;
          }
    
          if (effects.metalnessMap) {
            // Use the sparkle texture for metallness to enhance the sparkle effect
            child.material.metalnessMap = textureSparkle;
            child.material.metalness = 0.9; // Higher metalness for better reflection
          }
    
          // Apply fire texture specifically to the emissive map with enhanced settings
          if (effects.emissiveMap) {
            // child.material.emissiveMap = textureFire;
            // child.material.emissive = new THREE.Color(1, 1, 1); // Full white for maximum color from texture
            // child.material.emissiveIntensity = 0.5; // Increase intensity to make it more visible
          }
    
          if (effects.aoMap) {
            child.material.aoMap = texture;
            child.material.aoMapIntensity = 0.5; // Moderate AO effect
          }
    
          if (effects.envMap) {
            child.material.envMap = texture;
            child.material.envMapIntensity = 1.5; // Stronger environment mapping
          }
    
          if (effects.displacementMap) {
            child.material.displacementMap = texture;
            child.material.displacementScale = 0.05; // More subtle displacement
            child.material.displacementBias = 0;
          }
        }
  
        // Update the material properties
        child.material.depthWrite = true;
        child.material.depthTest = true;
        child.material.transparent = false;
        child.material.polygonOffset = false;
        child.renderOrder = 1000;
        
        // Make sure to update the material
        child.material.needsUpdate = true;
      }
    });
    ///////type  2 abobe









    /////// type 3 below

  diamondModel.traverse((child) => {
      if (child.isMesh && child.material) {
        // Create a new material or clone the existing one to ensure proper settings
        if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
          // Apply main texture to most map types
          if (effects.map) {
            // child.material.map = texture;
          }
    
          if (effects.normalMap) {
            child.material.normalMap = texture;
            // Children.material.alphaMap = textureSparkle; // Apply alpha map for transparency
            child.material.normalScale = new THREE.Vector2(1, 1);

          }
    
          if (effects.roughnessMap) {
            child.material.roughnessMap = textureTriTop;
            // Lower roughness for more shininess
            child.material.roughness = 0.1;
          }
    
          if (effects.metalnessMap) {
            // Use the sparkle texture for metallness to enhance the sparkle effect
            child.material.metalnessMap = textureSparkle;
            child.material.metalness = 0.7; // Higher metalness for better reflection
          }
    
          // Apply fire texture specifically to the emissive map with enhanced settings
          if (effects.emissiveMap) {
            child.material.emissiveMap = textureFire;
            child.material.emissive = new THREE.Color(1, 1, 1); // Full white for maximum color from texture
            child.material.emissiveIntensity = 1.2; // Increase intensity to make it more visible
          }
    
          if (effects.aoMap) {
            child.material.aoMap = texture;
            child.material.aoMapIntensity = 0.5; // Moderate AO effect
          }
    
          if (effects.envMap) {
            // child.material.envMap = texture;
            // child.material.envMapIntensity = 1.5; // Stronger environment mapping
          }
    
          if (effects.displacementMap) {
            child.material.displacementMap = texture;
            child.material.displacementScale = 0.05; // More subtle displacement
            child.material.displacementBias = 0;
          }
        }
  
        // Update the material properties
        child.material.depthWrite = true;
        child.material.depthTest = true;
        child.material.transparent = false;
        child.material.polygonOffset = false;
        child.renderOrder = 1000;
        
        // Make sure to update the material
        child.material.needsUpdate = true;
      }
    });