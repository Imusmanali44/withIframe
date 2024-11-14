loadModels(modelData) {
    modelData.forEach((data, index) => {
      this.loader.load(data.glbPath, (gltf) => {
        const model = gltf.scene;
        this.models.push(model);

        model.traverse((child) => {
          if (child.isMesh) {
            // Apply custom shader material combining both MatCaps
            child.material = new THREE.ShaderMaterial({
              uniforms: {
                matcapTexture: { value: this.matcapTexture },
                highlightTexture: { value: this.highlightTexture },
                blendFactor: { value: 0.1 }, // Adjust to control blend between textures
                color: { value: new THREE.Color('#CAA964') }
              },
              vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec2 vUv;

                void main() {
                  vUv = uv;
                  vNormal = normalize(normalMatrix * normal);
                  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                  vViewPosition = -modelViewPosition.xyz;
                  gl_Position = projectionMatrix * modelViewPosition;
                }
              `,
              fragmentShader: `
              uniform sampler2D matcapTexture;
              uniform sampler2D highlightTexture;
              uniform float blendFactor;
              uniform vec3 color; // Color uniform
              
              varying vec3 vNormal;
              varying vec3 vViewPosition;
              varying vec2 vUv;
              
              void main() {
                vec3 viewDir = normalize(vViewPosition);
                vec3 reflectedDir = reflect(viewDir, normalize(vNormal));
                float m = 2.82842712474619 * sqrt(reflectedDir.z + 1.0);
                vec2 uv = reflectedDir.xy / m + 0.5;
              
                // Sample both MatCap textures and increase their brightness
                vec4 matcapColor = texture2D(matcapTexture, uv)  * 1.1;
                vec4 highlightColor = texture2D(highlightTexture, uv) * 1.1;
              
                // Blend the textures with an adjusted factor
                vec4 blendedColor = mix(matcapColor, highlightColor, blendFactor);
              
                // Apply the color tint with increased intensity
                gl_FragColor = vec4(blendedColor.rgb * color * 2.0, blendedColor.a);
              }
            `,
              // transparent: true,
            });
          }
        });

        model.scale.set(100, 100, 100);
        model.visible = false;
        this.scene.add(model);
        this.switchModel(0, 1, true, false);
      });
    });
  }