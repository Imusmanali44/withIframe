import * as THREE from 'three';

export class Reflector extends THREE.Mesh {

    constructor(geometry, options = {}) {
        super(geometry);

        this.type = 'Reflector';

        const color = options.color !== undefined ? new THREE.Color(options.color) : new THREE.Color(0xFFFFFF); // Brighter color for reflection
        const textureWidth = options.textureWidth || 512;
        const textureHeight = options.textureHeight || 512;
        const clipBias = options.clipBias || 0.003;

        const reflectorPlane = new THREE.Plane();
        const normal = new THREE.Vector3();
        const reflectorWorldPosition = new THREE.Vector3();
        const cameraWorldPosition = new THREE.Vector3();
        const textureMatrix = new THREE.Matrix4();
        const virtualCamera = new THREE.PerspectiveCamera();

        const parameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            stencilBuffer: false
        };

        const renderTarget = new THREE.WebGLRenderTarget(textureWidth, textureHeight, parameters);
        renderTarget.depthBuffer = true;
        renderTarget.depthTexture = new THREE.DepthTexture();
        renderTarget.depthTexture.type = THREE.UnsignedShortType;

        if (!THREE.MathUtils.isPowerOfTwo(textureWidth) || !THREE.MathUtils.isPowerOfTwo(textureHeight)) {
            renderTarget.texture.generateMipmaps = false;
        }

        const material = new THREE.ShaderMaterial({
            uniforms: {
                'color': { value: color },
                'tDiffuse': { value: renderTarget.texture },
                'tDepth': { value: renderTarget.depthTexture },
                'textureMatrix': { value: textureMatrix },
                'cameraNear': { value: 0 },
                'cameraFar': { value: 0 }
            },
            vertexShader: `
                uniform mat4 textureMatrix;
                varying vec4 vUv;
                void main() {
                    vUv = textureMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                #include <packing>
                uniform vec3 color;
                uniform sampler2D tDiffuse;
                uniform sampler2D tDepth;
                uniform float cameraNear;
                uniform float cameraFar;
                varying vec4 vUv;
                float readDepth(sampler2D depthSampler, vec4 coord) {
                    float fragCoordZ = texture2DProj(depthSampler, coord).x;
                    float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
                    return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
                }
                void main() {
                    vec4 base = texture2DProj(tDiffuse, vUv);
                    float depth = readDepth(tDepth, vUv);

                    // Adjust reflection blending and brightness
                    vec3 reflection = base.rgb * color * 1.5; // Increase reflection brightness
                    float fadeFactor = 1.0 - depth * 3500.0;  // Reduce fading factor for more visibility

                    // Apply reflection with a smooth fade
                    gl_FragColor = vec4(reflection, fadeFactor);
                }
            `,
            transparent: true
        });

        this.material = material;

        this.onBeforeRender = function (renderer, scene, camera) {
            reflectorWorldPosition.setFromMatrixPosition(this.matrixWorld);
            cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
            normal.set(0, 0, 1).applyMatrix4(new THREE.Matrix4().extractRotation(this.matrixWorld));

            const view = reflectorWorldPosition.clone().sub(cameraWorldPosition).reflect(normal).negate();
            virtualCamera.position.copy(view.add(reflectorWorldPosition));
            virtualCamera.lookAt(reflectorWorldPosition);

            textureMatrix.set(
                0.5, 0.0, 0.0, 0.5,
                0.0, 0.5, 0.0, 0.5,
                0.0, 0.0, 0.5, 0.5,
                0.0, 0.0, 0.0, 1.0
            ).multiply(camera.projectionMatrix).multiply(camera.matrixWorldInverse).multiply(this.matrixWorld);

            // Temporarily hide the reflector during reflection rendering
            this.visible = false;

            // Set the render target to the reflection render target
            renderer.setRenderTarget(renderTarget);
            renderer.clear();
            renderer.render(scene, virtualCamera);

            // Restore the previous render target
            renderer.setRenderTarget(null);

            // Make the reflector visible again
            this.visible = true;
        };
    }
}
