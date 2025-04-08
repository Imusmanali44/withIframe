import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
export class GrooveManager {
    constructor(scene, modelManager) {
        this.scene = scene;
        // Initialize the camera variable
        this.midMesh = null
        this.loader = new GLTFLoader();
        // this.loadMidMesh();
        this.modelManager = modelManager
        // console.log( )
        this.grooveCountRing1 = 1
        this.grooveCountRing2 = 1
    }
    triGroovePair() {
        this.modelManager.midMeshTri = this.modelManager.midMesh.clone()
        this.modelManager.midMeshTri.position.x = -0.7;

        this.modelManager.midMeshTri2 = this.modelManager.midMesh2.clone()
        this.modelManager.midMeshTri2.position.x = 0.7;

        this.modelManager.midMesh.position.x = -0.65
        this.modelManager.midMeshTri.position.x = -0.75

        this.modelManager.midMesh2.position.x = 0.65
        this.modelManager.midMeshTri2.position.x = 0.75

        this.scene.add(this.modelManager.midMeshTri)
        this.scene.add(this.modelManager.midMeshTri2)




    }
    removeMidMeshes() {
        // Helper function to dispose and remove objects
        const disposeAndRemove = (mesh) => {
            if (!mesh) return;

            console.log("Removing mesh:", mesh);

            // Remove from scene
            this.scene.remove(mesh);

            // Dispose of geometry and materials
            mesh.traverse((child) => {
                if (child.isMesh) {
                    if (child.name = "") {
                        console.log("name AAAAAAA", child)
                    }
                    child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((material) => {
                                for (const key in material) {
                                    if (material[key] && material[key].isTexture) {
                                        material[key].dispose();
                                    }
                                }
                                material.dispose();
                            });
                        } else {
                            for (const key in child.material) {
                                if (child.material[key] && child.material[key].isTexture) {
                                    child.material[key].dispose();
                                }
                            }
                            child.material.dispose();
                        }
                    }
                }
            });

            // Hide and clear reference
            mesh.visible = false;
            return null;
        };

        // Remove midMesh objects
        this.modelManager.midMesh = disposeAndRemove(this.modelManager.midMesh);
        this.modelManager.midMesh2 = disposeAndRemove(this.modelManager.midMesh2);
        this.modelManager.midMeshTri = disposeAndRemove(this.modelManager.midMeshTri);
        this.modelManager.midMeshTri2 = disposeAndRemove(this.modelManager.midMeshTri2);

        // Remove any remaining midMeshes by traversing the scene
        let objectsToRemove = [];
        this.scene.traverse((child) => {
            // console.log("razi 333", child.userData);
            if (child.userData === "midMeshRing1" || child.userData === "midMeshRing2") {
                console.log("Removing from traverse:", child);
                objectsToRemove.push(child);
                if (child.name == '') {
                    console.log("name", child)
                    objectsToRemove.push(child);
                }
            }
        });

        // Remove collected objects from the scene
        objectsToRemove.forEach((obj) => {
            if (obj.parent) {
                obj.parent.remove(obj);
            } else {
                this.scene.remove(obj);
            }
        });

        console.log("Mid meshes removed from scene and set to null.", this.scene);
    }
    // setInitialOffsetGroove(val,ringNum,grooveId){
    //     if (this.modelManager.currentDisplayedModels.length == 2 ) {
    //         if(ringNum=="Ring 1" && grooveId==2){
    //             this.modelManager.midmeshGroove1Ring1.position.x = parseFloat(val)
    //             this.modelManager.midMesh.position.x = -0.75
    //           console.log("ring 1",this.modelManager.midmeshGroove1Ring1.position.x)
    //         }}
    //         if(ringNum=="Ring 1" && grooveId==3){
    //             this.modelManager.midmeshGroove3Ring1.position.x = parseFloat(val)
    //             console.log("ring 1",this.modelManager.midmeshGroove2Ring1.position.x)

    //         //   console.log("ring 1",this.clippingPlaneRing1.constant, this.clippingPlaneRing1helper.constant, this.modelManager.midMesh.position.x)
    //         }
    //         if(ringNum=="Ring 1" && grooveId==4){
    //             this.modelManager.midmeshGroove4Ring1.position.x = parseFloat(val)
    //             console.log("ring 1",this.modelManager.midmeshGroove2Ring1.position.x)

    //         //   console.log("ring 1",this.clippingPlaneRing1.constant, this.clippingPlaneRing1helper.constant, this.modelManager.midMesh.position.x)
    //         }


    // }
    setoffsetValueGroove(val,ringNum) {
        if (this.modelManager.currentDisplayedModels.length == 1 && this.biColorSingleBool) {
            // this.clippingPlaneRingSingleBi.constant = parseFloat(-val)
            // this.clippingPlaneRingHelperBi.constant = parseFloat(val)
          }
          if (this.modelManager.currentDisplayedModels.length == 2 ) {
            if(ringNum=="Ring 1"){
            //   this.clippingPlaneRing1.constant = parseFloat(-val)
            //   this.clippingPlaneRing1helper.constant = parseFloat(val)
              this.modelManager.midMesh.position.x = parseFloat(val)
        console.log("ring 1",this.modelManager.midMesh.position.x)

            //   console.log("ring 1",this.clippingPlaneRing1.constant, this.clippingPlaneRing1helper.constant, this.modelManager.midMesh.position.x)
            }
            
          // else if (this.modelManager.currentDisplayedModels.length == 2) {
            if(ringNum=="Ring 2"){
            // this.clippingPlaneRing2.constant = parseFloat(-val)
            // this.clippingPlaneRing2helper.constant = parseFloat(val)
            this.modelManager.midMesh2.position.x = parseFloat(val)
        console.log("ring 2",this.modelManager.midMesh2.position.x)

            //   console.log("ring 2",this.clippingPlaneRing2.constant,this.clippingPlaneRing2helper.constant,this.modelManager.midMesh2.position.x )
            }}


    }


    async toggleMilgrainGroove(midMesh,enable = true) {
        // Helper function to process a mesh
        const processMesh = (mesh) => {
          if (!mesh) return;
          
          mesh.traverse((child) => {
            if (child.isMesh && child.name === "Mesh001") {
              // Toggle visibility
              child.visible = enable;
              
              // Update material color if enabling the mesh
              if (enable) {
                // child.scale.set(1.02, 1.015, 1.015);
                // Create new material if it doesn't exist
                if (!child.material) {
                  child.material = new THREE.MeshStandardMaterial();
                }
                
                // Set the color to #ecc777  ,,,,,,,,,,,,,,,  #e4cd9d
                child.material.color.setStyle("#e4cd9d");
                
                // Preserve original material properties
                child.material.metalness = 1;
                child.material.roughness = 0;
              }
            }
          });
        };
      
        // Process both meshes
        processMesh(midMesh);
        // processMesh(this.midMesh2);
      }

    getScaleForModel(modelId, type) {
        let scale = { x: 0.37, y: 1.15, z: 1.15 }; // Default scale values

        switch (modelId) {
            case "P1":
            case "P4":
            case "P6":
            case "P9":
            case "P11":
                scale = { x: 0.37, y: 1.11, z: 1.11 };
                break;
            case "P7":
            case "P15":
                scale = { x: 0.37, y: 1.09, z: 1.09 };
                break;
            case "P8":
                scale = { x: 0.37, y: 1.06, z: 1.06 };
                break;
            case "P12":
            case "P13":
            case "P14":
                scale = { x: 0.37, y: 1.12, z: 1.12 };
                break;
            default:
                console.log("Using default scale for modelId:", modelId);
                break;
        }
        if (type == "U-groove") {
            scale.x = scale.x * 1.6
        }
        if (type == "Corner joint") {
            scale.x = scale.x * 2.1
        }
        if (type == "Milgrain") {
            scale.x = scale.x * 2.12
        }
        console.log("scale chk", scale)
        this.defaultValueWidth1 = scale.x
        this. defaultValueDepth1 = scale.y
        // this. defaultValueWidth2 = this.modelManager.midMesh2.scale.x
        // this. defaultValueDepth2 = this.modelManager.midMesh2.scale.y
        return scale;
    }
    removeMidMeshes() {
        // Helper function to dispose and remove objects
        const disposeAndRemove = (mesh) => {
            if (!mesh) return;

            console.log("Removing mesh:", mesh);

            // Remove from scene
            this.scene.remove(mesh);

            // Dispose of geometry and materials
            mesh.traverse((child) => {
                if (child.isMesh) {
                    if (child.name = "") {
                        console.log("name AAAAAAA", child)
                    }
                    child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((material) => {
                                for (const key in material) {
                                    if (material[key] && material[key].isTexture) {
                                        material[key].dispose();
                                    }
                                }
                                material.dispose();
                            });
                        } else {
                            for (const key in child.material) {
                                if (child.material[key] && child.material[key].isTexture) {
                                    child.material[key].dispose();
                                }
                            }
                            child.material.dispose();
                        }
                    }
                }
            });

            // Hide and clear reference
            mesh.visible = false;
            return null;
        };

        // Remove midMesh objects
        this.modelManager.midMesh = disposeAndRemove(this.modelManager.midMesh);
        this.modelManager.midMesh2 = disposeAndRemove(this.modelManager.midMesh2);
        this.modelManager.midMeshTri = disposeAndRemove(this.modelManager.midMeshTri);
        this.modelManager.midMeshTri2 = disposeAndRemove(this.modelManager.midMeshTri2);

        // Remove any remaining midMeshes by traversing the scene
        let objectsToRemove = [];
        this.scene.traverse((child) => {
            // console.log("razi 333", child.userData);
            if (child.userData === "midMeshRing1" || child.userData === "midMeshRing2") {
                console.log("Removing from traverse:", child);
                objectsToRemove.push(child);
                if (child.name == '') {
                    console.log("name", child)
                    objectsToRemove.push(child);
                }
            }
        });

        // Remove collected objects from the scene
        objectsToRemove.forEach((obj) => {
            if (obj.parent) {
                obj.parent.remove(obj);
            } else {
                this.scene.remove(obj);
            }
        });

        console.log("Mid meshes removed from scene and set to null.", this.scene);
    }
    adjustWidthAndDepth(ring = null, value, type) {
        ring = this.modelManager.selectedModel;
        console.log("razi work", ring, value, type);
        
        if (ring == 1) {
            // Ring 1 adjustments
            if (type == "width") {
                if (value == 0.20) {
                    this.modelManager.midMesh.scale.x = this.defaultValueWidth1;
                } else if (value == 0.30) {
                    this.modelManager.midMesh.scale.x = this.defaultValueWidth1 + 0.16;
                } else if (value == 0.40) {
                    this.modelManager.midMesh.scale.x = this.defaultValueWidth1 + 0.32;
                } else if (value == 0.50) {
                    this.modelManager.midMesh.scale.x = this.defaultValueWidth1 + 0.48;
                }
            } else if (type == "depth") {
                if (value == 0.20) {
                    this.modelManager.midMesh.scale.y = this.defaultValueDepth1;
                    this.modelManager.midMesh.scale.z = this.defaultValueDepth1;
                } else if (value == 0.30) {
                    this.modelManager.midMesh.scale.y = this.defaultValueDepth1 - 0.008;
                    this.modelManager.midMesh.scale.z = this.defaultValueDepth1 - 0.008;
                } else if (value == 0.40) {
                    this.modelManager.midMesh.scale.y = this.defaultValueDepth1 - 0.0125
                    this.modelManager.midMesh.scale.z = this.defaultValueDepth1 - 0.0125
                } else if (value == 0.50) {
                    this.modelManager.midMesh.scale.y = this.defaultValueDepth1 - 0.0145 ;
                    this.modelManager.midMesh.scale.z = this.defaultValueDepth1 - 0.0145 ;
                }
                else if (value == 0.60) {
                    this.modelManager.midMesh.scale.y = this.defaultValueDepth1 - 0.0165  ;
                    this.modelManager.midMesh.scale.z = this.defaultValueDepth1 - 0.0165  ;
                }
            }
        } else if (ring == 2) {
            // Ring 2 adjustments - base scale is 0.8 of ring 1
            const ring2BaseWidthScale = this.defaultValueWidth1 * 0.85;
            const ring2BaseDepthScale = this.defaultValueDepth1 * 0.85;
            
            if (type == "width") {
                if (value == 0.20) {
                    this.modelManager.midMesh2.scale.x = ring2BaseWidthScale;
                } else if (value == 0.30) {
                    this.modelManager.midMesh2.scale.x = ring2BaseWidthScale + 0.16 
                } else if (value == 0.40) {
                    this.modelManager.midMesh2.scale.x = ring2BaseWidthScale + 0.32 
                } else if (value == 0.50) {
                    this.modelManager.midMesh2.scale.x = ring2BaseWidthScale + 0.48 
                }
            } else if (type == "depth") {
                if (value == 0.20) {
                    this.modelManager.midMesh2.scale.y = ring2BaseDepthScale;
                    this.modelManager.midMesh2.scale.z = ring2BaseDepthScale;
                } else if (value == 0.30) {
                    this.modelManager.midMesh2.scale.y = ring2BaseDepthScale - 0.008 
                    this.modelManager.midMesh2.scale.z = ring2BaseDepthScale - 0.008 
                } else if (value == 0.40) {
                    this.modelManager.midMesh2.scale.y = ring2BaseDepthScale - 0.0125
                    this.modelManager.midMesh2.scale.z = ring2BaseDepthScale - 0.0125 
                } else if (value == 0.50) {
                    this.modelManager.midMesh2.scale.y = ring2BaseDepthScale - 0.0145 
                    this.modelManager.midMesh2.scale.z = ring2BaseDepthScale - 0.0145 
                }
             else if (value == 0.60) {
                this.modelManager.midMesh2.scale.y = ring2BaseDepthScale - 0.0165 
                this.modelManager.midMesh2.scale.z = ring2BaseDepthScale - 0.0165 
            }
            }
        }
    }

    addGroove(ring) {
        if (ring == "Ring 1") {

            if (this.grooveCountRing1 == 1) {
                this.modelManager.midmeshGroove1Ring1 = this.modelManager.midMesh.clone()
                this.modelManager.midmeshGroove1Ring1.userData = "Groove1Ring1"

                this.modelManager.midmeshGroove1Ring1.position.x = -0.7;



                this.modelManager.midMesh.position.x = -0.65
                this.modelManager.midmeshGroove1Ring1.position.x = -0.75



                this.scene.add(this.modelManager.midmeshGroove1Ring1)
                this.grooveCountRing1++;
                console.log("midMeshTri", this.modelManager.midMesh.position.x, this.modelManager.midmeshGroove1Ring1.position.x)
            }
            else if (this.grooveCountRing1 == 2) {
                this.modelManager.midmeshGroove2Ring1 = this.modelManager.midMesh.clone()
                this.modelManager.midmeshGroove2Ring1.userData = "Groove2Ring1"

                this.modelManager.midMesh.position.x = -0.62
                this.modelManager.midmeshGroove1Ring1.position.x = -0.7
                this.modelManager.midmeshGroove2Ring1.position.x = -0.78

                this.scene.add(this.modelManager.midmeshGroove2Ring1)
                this.grooveCountRing1++;

            }
            else if (this.grooveCountRing1 == 3) {
                this.modelManager.midmeshGroove3Ring1 = this.modelManager.midMesh.clone()
                this.modelManager.midmeshGroove3Ring1.userData = "Groove3Ring1"

                this.modelManager.midMesh.position.x = -0.58
                this.modelManager.midmeshGroove1Ring1.position.x = -0.66
                this.modelManager.midmeshGroove2Ring1.position.x = -0.74
                this.modelManager.midmeshGroove3Ring1.position.x = -0.82

                this.scene.add(this.modelManager.midmeshGroove3Ring1)
                this.grooveCountRing1++;

            }
        }
        if (ring == "Ring 2") {
            // this.modelManager.midMeshTri =   this.modelManager.midMesh.clone()
            // this.modelManager.midMeshTri.position.x = -0.7;
            if (this.grooveCountRing2 == 1) {
                this.modelManager.midmeshGroove1Ring2 = this.modelManager.midMesh2.clone()
                this.modelManager.midmeshGroove1Ring2.userData = "Groove1Ring2"

                // this.modelManager.midmeshGroove1Ring2.position.x = 0.7;



                this.modelManager.midMesh2.position.x = 0.65
                this.modelManager.midmeshGroove1Ring2.position.x = 0.75

                // this.scene.add(this.modelManager.midMeshTri)
                this.grooveCountRing2++;
                this.scene.add(this.modelManager.midmeshGroove1Ring2)
            }

            else if (this.grooveCountRing2 == 2) {
                this.modelManager.midmeshGroove2Ring2 = this.modelManager.midMesh2.clone()
                this.modelManager.midmeshGroove2Ring2.userData = "Groove2Ring2"

                this.modelManager.midMesh2.position.x = 0.62
                this.modelManager.midmeshGroove1Ring2.position.x = 0.7
                this.modelManager.midmeshGroove2Ring2.position.x = 0.78

                this.grooveCountRing2++;
                this.scene.add(this.modelManager.midmeshGroove2Ring2)



            }
            else if (this.grooveCountRing2 == 3) {
                this.modelManager.midmeshGroove3Ring2 = this.modelManager.midMesh2.clone()
                this.modelManager.midmeshGroove3Ring2.userData = "Groove3Ring2"

                this.modelManager.midMesh2.position.x = 0.58
                this.modelManager.midmeshGroove1Ring2.position.x = 0.66
                this.modelManager.midmeshGroove2Ring2.position.x = 0.74
                this.modelManager.midmeshGroove3Ring2.position.x = 0.82


                this.grooveCountRing2++;
                this.scene.add(this.modelManager.midmeshGroove3Ring2)



            }
        }
    }


    removeGroove(ring) {
        if (ring == "Ring 1") {
            if (this.grooveCountRing1 > 1) {
                // Determine which groove to remove based on counter
                let grooveToRemove;
                let userData;
                
                if (this.grooveCountRing1 == 4) {
                    grooveToRemove = this.modelManager.midmeshGroove3Ring1;
                    userData = "Groove3Ring1";
                    
                    // Reset positions for remaining grooves
                    this.modelManager.midMesh.position.x = -0.62;
                    this.modelManager.midmeshGroove1Ring1.position.x = -0.7;
                    this.modelManager.midmeshGroove2Ring1.position.x = -0.78;
                } 
                else if (this.grooveCountRing1 == 3) {
                    grooveToRemove = this.modelManager.midmeshGroove2Ring1;
                    userData = "Groove2Ring1";
                    
                    // Reset positions for remaining grooves
                    this.modelManager.midMesh.position.x = -0.65;
                    this.modelManager.midmeshGroove1Ring1.position.x = -0.75;
                } 
                else if (this.grooveCountRing1 == 2) {
                    grooveToRemove = this.modelManager.midmeshGroove1Ring1;
                    userData = "Groove1Ring1";
                    
                    // Reset position for original mesh
                    this.modelManager.midMesh.position.x = -0.7;
                }
    
                // Remove the specific groove
                let objectsToRemove = [];
                this.scene.traverse((child) => {
                    if (child.userData === userData) {
                        objectsToRemove.push(child);
                    }
                });
    
                objectsToRemove.forEach((obj) => {
                    if (obj.parent) {
                        obj.parent.remove(obj);
                    }
                    this.disposeAndRemove(obj);
                });
    
                // Decrement counter
                this.grooveCountRing1--;
            }
        }
        
        if (ring == "Ring 2") {
            if (this.grooveCountRing2 > 1) {
                // Determine which groove to remove based on counter
                let grooveToRemove;
                let userData;
                
                if (this.grooveCountRing2 == 4) {
                    grooveToRemove = this.modelManager.midmeshGroove3Ring2;
                    userData = "Groove3Ring2";
                    
                    // Reset positions for remaining grooves
                    this.modelManager.midMesh2.position.x = 0.62;
                    this.modelManager.midmeshGroove1Ring2.position.x = 0.7;
                    this.modelManager.midmeshGroove2Ring2.position.x = 0.78;
                } 
                else if (this.grooveCountRing2 == 3) {
                    grooveToRemove = this.modelManager.midmeshGroove2Ring2;
                    userData = "Groove2Ring2";
                    
                    // Reset positions for remaining grooves
                    this.modelManager.midMesh2.position.x = 0.65;
                    this.modelManager.midmeshGroove1Ring2.position.x = 0.75;
                } 
                else if (this.grooveCountRing2 == 2) {
                    grooveToRemove = this.modelManager.midmeshGroove1Ring2;
                    userData = "Groove1Ring2";
                    
                    // Reset position for original mesh
                    this.modelManager.midMesh2.position.x = 0.7;
                }
    
                // Remove the specific groove
                let objectsToRemove = [];
                this.scene.traverse((child) => {
                    if (child.userData === userData) {
                        objectsToRemove.push(child);
                    }
                });
    
                objectsToRemove.forEach((obj) => {
                    if (obj.parent) {
                        obj.parent.remove(obj);
                    }
                    this.disposeAndRemove(obj);
                });
    
                // Decrement counter
                this.grooveCountRing2--;
            }
        }
    }
    disposeAndRemove(mesh) {
        if (!mesh) return;

        console.log("Removing mesh:", mesh);

        // Remove from scene
        this.scene.remove(mesh);

        // Dispose of geometry and materials
        mesh.traverse((child) => {
            if (child.isMesh) {
                if (child.name = "") {
                    console.log("name AAAAAAA", child)
                }
                child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach((material) => {
                            for (const key in material) {
                                if (material[key] && material[key].isTexture) {
                                    material[key].dispose();
                                }
                            }
                            material.dispose();
                        });
                    } else {
                        for (const key in child.material) {
                            if (child.material[key] && child.material[key].isTexture) {
                                child.material[key].dispose();
                            }
                        }
                        child.material.dispose();
                    }
                }
            }
        });

        // Hide and clear reference
        mesh.visible = false;
        return null;
    };
}
