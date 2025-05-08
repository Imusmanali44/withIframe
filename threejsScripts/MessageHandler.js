// MessageHandler.js



export class MessageHandler {
  constructor(modelManager, metalManager) {
    this.pMetalManager = metalManager;
    this.modelManager = modelManager;
    // this.orbitControlHandler = orbitControlHandler;

    // Add the event listener for messages from the parent
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  handleMessage(event) {
    const { action, modelId, type, id, selectedRing, value, pair, isEngraving, isBiCol, isTriCol, isMetal, field, grooveId, stoneDist, position, ringIdentifier } = event.data;
    // console.log('Message received from parent:', event.data, action);

    switch (action) {
      case 'changeModel':
        this.changeModel(modelId, selectedRing.id, pair.pair1, pair.pair2);  // Pass selectedRing.id for model switching
        break;

      case 'addRing':
        this.addRing(type, selectedRing);
        break;

      case 'removeRing':
        this.removeRing();
        break;
      case 'selectModel':
        this.currentSelectedRing(modelId)
        // console.log("current selected model",modelId)
        break;
      case "addStone":
        if (type == "Number") {
          console.log("add stone aa", value, stoneDist)
          this.modelManager.StoneManagerIns.removeDiamondsFromRing(this.modelManager.selectedModel)
          this.modelManager.StoneManagerIns.addDiamondsToRingFront({
            // this.modelManager.StoneManagerIns.loadDiamondToRing({

            diamondCount: value,
            ringIndex: this.modelManager.selectedModel,
            distribution: stoneDist,
            // rotation: { x: -0.13, y: 0.00, z: 0.25 }, 
            // modelUrl: "diamondm/d2.glb"
            // scale: { x: 19.70, y: 19.70, z: 37.00 }
          });

        }
        if (value == "Smooth conversion") {
          this.modelManager.StoneManagerIns.removeDiamondsFromRing(this.modelManager.selectedModel)
          this.modelManager.StoneManagerIns.loadDiamondToRing({
            ringIndex: this.modelManager.selectedModel,
            // scale: { x: 19.70, y: 19.70, z: 37.00 }
          }, value);
          console.log("smooth conversion", this.modelManager.selectedModel)
    this.modelManager.fixRenderingOrder();

        }
        if (value == "Pavé") {
          this.modelManager.StoneManagerIns.removeDiamondsFromRing(this.modelManager.selectedModel)
          // this.modelManager.StoneManagerIns.addDiamondsToRingFront({
          this.modelManager.StoneManagerIns.loadDiamondToRing({

            // diamondCount: 10,
            ringIndex: this.modelManager.selectedModel,
            modelUrl: "diamondm/d2.glb"
            // scale: { x: 19.70, y: 19.70, z: 37.00 }
          }, value);
        }
        if (value == "Rail setting") {
          console.log("rail setting", this.modelManager.selectedModel)
          this.modelManager.StoneManagerIns.removeDiamondsFromRing(this.modelManager.selectedModel)
          this.modelManager.StoneManagerIns.loadDiamondToRing({
            ringIndex: this.modelManager.selectedModel,
            modelUrl: "diamondm/d1.glb",
            rotation: { x: -0.13, y: 0.00, z: 0.25 }, // Default rotations from Image 1

            // scale: { x: 19.70, y: 19.70, z: 37.00 }
          }, value);
        }
        if (value == "Smooth Stone") { 
          this.modelManager.StoneManagerIns.removeDiamondsFromRing(this.modelManager.selectedModel)
          // this.modelManager.StoneManagerIns.addDiamondsToRingFront({
          this.modelManager.StoneManagerIns.loadDiamondToRing({

            // diamondCount: 10,
            ringIndex: this.modelManager.selectedModel,
            modelUrl: "diamondm/d3.glb"
            // scale: { x: 19.70, y: 19.70, z: 37.00 }
          }, value);

        }
        if (value == "Rail setting Across") { 
          console.log("rail setting across", this.modelManager.selectedModel)

          this.modelManager.StoneManagerIns.removeDiamondsFromRing(this.modelManager.selectedModel)
          // this.modelManager.StoneManagerIns.addDiamondsToRingFront({
          this.modelManager.StoneManagerIns.loadDiamondToRing({

            // diamondCount: 10,
            ringIndex: this.modelManager.selectedModel,
            modelUrl: "diamondm/d1a.glb"
            // scale: { x: 19.70, y: 19.70, z: 37.00 }
          }, value);

        }
        if (value == "Smooth setting Across") { 
          console.log("Smooth setting Across", this.modelManager.selectedModel)

          this.modelManager.StoneManagerIns.removeDiamondsFromRing(this.modelManager.selectedModel)
          // this.modelManager.StoneManagerIns.addDiamondsToRingFront({
          this.modelManager.StoneManagerIns.loadDiamondToRing({

            // diamondCount: 10,
            ringIndex: this.modelManager.selectedModel,
            modelUrl: "diamondm/d2a.glb"
            // scale: { x: 19.70, y: 19.70, z: 37.00 }
          }, value);

        }


        if (value == "Without") {
          console.log("remove diamond", this.modelManager.selectedModel)
          this.modelManager.StoneManagerIns.removeDiamondsFromRing(this.modelManager.selectedModel)

        }
        break;
      case "stoneSize":
        this.modelManager.StoneManagerIns.changeStoneSize(value)
        break;
      case "stonePosition":
        if (typeof value === 'string' || value instanceof String) {
          this.modelManager.StoneManagerIns.changeStonePosition(value)
        }
        else {
          this.modelManager.StoneManagerIns.handleStonePositionSlider(value)

        }
        break;

      case 'updatePairStatus':
        console.log("ipair", value)
        this.modelManager.currentPairUpdate(value)
        break;
      case 'changeWidth':
        // console.log("change size called",value, selectedRing) 
        console.log('changeWidth action received:', value, selectedRing.id);
        this.modelManager.changeRingWidth(selectedRing.id, value);
        break;
      case 'changeHeight':
        // console.log("change size called",value, selectedRing) 
        console.log('Height action received:', value, selectedRing.id);
        this.modelManager.changeRingThickness(selectedRing.id, value);
        break;
      case 'optimalHeight':
        // console.log('optimalHeight checked ?:', value);
        this.modelManager.optimalThicknessBool(value);
      case 'countrySize':
        this.modelManager.setSizeCountryWise(value);
        // console.log("value",value)
        break;
      case 'changeColor':
        // Handle case when both isBiCol and isTriCol are null (single color)
        if (isBiCol == null && isTriCol == null) {
          this.modelManager.changeModelColor(value.colorCode)
          console.log("value", value.colorCode, value.value)
          return;
        }

        // Handle two-tone coloring
        if (isBiCol && isBiCol.name === "Two tone") {
          // Handle different field positions for two-tone
          if (field === "single" || field === "triColored1") {
            this.pMetalManager.colorChangeBi(value.colorCode, 1);
          }
          else if (field === "twoTone" || field === "triColored2") {
            this.pMetalManager.colorChangeBi(value.colorCode, 2);
          }
          else if (field === "triColored" || field === "triColored3") {
            this.pMetalManager.colorChangeBi(value.colorCode, 3);
          }
        }
        // Handle tri-colored
        else if (isBiCol && isBiCol.name === "Tri Colored") {
          // Handle different field positions for tri-colored
          if (field === "single" || field === "triColored1") {
            this.pMetalManager.colorChangeBi(value.colorCode, 1);
          }
          else if (field === "twoTone" || field === "triColored3") {
            this.pMetalManager.colorChangeBi(value.colorCode, 3);
          }
          else if (field === "triColored" || field === "triColored2") {
            this.pMetalManager.colorChangeBi(value.colorCode, 2);
          }
        }
        // Use position parameter if present (new format)
        else if (position) {
          // Position is a string - "1", "2", or "3"
          const positionNum = parseInt(position);
          if (!isNaN(positionNum) && positionNum >= 1 && positionNum <= 3) {
            this.pMetalManager.colorChangeBi(value.colorCode, positionNum);
          }
        }
        break;
      case 'EngraveSymbol':
        console.log("hello", value)
        this.modelManager.removeEngraving()

        this.modelManager.changeFont(-1);
        if (value.value == "double-heart") {
          this.modelManager.engraveTextOnModel("GG")

        }
        else if (value.value == "heart") {
          this.modelManager.engraveTextOnModel("G")
        }
        else if (value.value == "double-ring") {
          this.modelManager.engraveTextOnModel("MGN")
        }
        else if (value.value == "infinity") {
          this.modelManager.engraveTextOnModel("gSg")
        }
        this.modelManager.changeFont(1);


        break;
      case "EngraveText":
        console.log("hello frm text", isEngraving)
        // if (isEngraving == "") {

        this.modelManager.removeEngraving()
        // }
        // else {
        // this.modelManager.changeFont(2);
        this.modelManager.engraveTextOnModel(isEngraving)
        // }
        break;
      case "addGroove":
        console.log("calss groove", type, value, selectedRing)
        if (type == "defaultAdd") {

          this.modelManager.GrooveManagerIns.addGroove(selectedRing);
          break;
        }
        if (type == "defaultDelete") {

          this.modelManager.GrooveManagerIns.removeGroove(selectedRing);
          break;
        }
        if (type == "Without") {
          this.modelManager.GrooveManagerIns.removeMidMeshes();
          this.modelManager.GrooveBool = false;
          break;
        }
        if (type == "width" || type == "depth") {
          this.modelManager.GrooveManagerIns.adjustWidthAndDepth(selectedRing, value, type);
          // this.modelManager.GrooveBool = true; 
          break;
        }
        else {

          this.modelManager.loadMidMesh(type, false);

        }
        break;
      case "addStep":
        console.log("calss groove step", value, type)

        if (value == "left") {
          if (type == "Without") {
            this.modelManager.StepsManagerIns.removeLeftSteps();
            break;
          }
          else {
            if (type == "Milgrain") {
              this.modelManager.StepsManagerIns.addLeftStep(true)
            }
            else {
              this.modelManager.StepsManagerIns.addLeftStep(false)

            }
          }
        }
        if (value == "right") {
          if (type == "Without") {
            this.modelManager.StepsManagerIns.removeRightSteps();
            break;
          }
          else {

            if (type == "Milgrain") {
              this.modelManager.StepsManagerIns.addRightStep(true)
            }
            else {
              this.modelManager.StepsManagerIns.addRightStep(false)

            }

          }

        }
        break;
      case "changeGrooveSlider":
        console.log("calss groove f", value, selectedRing, grooveId)
        if (type == "initial") {
          // this.modelManager.GrooveManagerIns.setInitialOffsetGroove(value, selectedRing, grooveId);

        }
        else {
          this.modelManager.GrooveManagerIns.setoffsetValueGroove(value, selectedRing);
          // break;

        }
        break;
      case "changeSlider":
        console.log("calss", value, selectedRing)
        this.pMetalManager.setoffsetValue(value, selectedRing)
        break;
      case "changeMultiSlider":
        console.log("calss tri", value, this.pMetalManager.isEnable, selectedRing)

        this.pMetalManager.setoffsetValueTri(value.left, value.right, selectedRing)

        break;

      case "PreciousMetal":
        console.log("PreciousMetal change", value, isBiCol, isTriCol, ringIdentifier);
        let lengthModels = this.modelManager.currentDisplayedModels.length;
        
        if (value === 0) {
          this.pMetalManager.removeHelperModelAndClipping(1);
          this.pMetalManager.removeHelperModelAndClipping(2);
          this.pMetalManager.removeClippingTriOneRing();
          this.modelManager.GrooveManagerIns.removeMidMeshes();

          this.pMetalManager.isEnable = false;
          return;
        }
        
        // Check if isBiCol is true or has a name property
        const isTwoTone = isBiCol === true || (isBiCol && isBiCol.name === "Two tone");
        const isTriColored = !isTwoTone && (isTriCol === true || (isBiCol && isBiCol.name === "Tri Colored"));
        
        if (lengthModels === 1 && isTwoTone) {
          this.pMetalManager.biColorOneRing(value);
        }
        else if (lengthModels === 1 && isTriColored) {
          this.pMetalManager.triColorOneRing(value);
        }
        else if (lengthModels === 1) {
          // Default to tri-color if we don't have enough info
          this.pMetalManager.triColorOneRing(value);
        }
        else if (lengthModels === 2 && isTwoTone) {
          this.pMetalManager.biTriPair(value);
        }
        else if (lengthModels === 2) {
          // For tri-colored or default
          this.pMetalManager.biTriPair(value, true);
        }
        break;
      case "FontChange":
        if (value == "svnfont00") {
          this.modelManager.changeFont(1);

        }
        else if (value == "svnfont01") {
          this.modelManager.changeFont(2);

        }
        else if (value == "svnfont02") {
          this.modelManager.changeFont(5);

        }
        else if (value == "svnfont03") {
          this.modelManager.changeFont(4);

        }
        else if (value == "svnfont04") {
          this.modelManager.changeFont(5);

        }
        else {
          console.log("unknown font value", value)
        }
        this.modelManager.removeEngraving()

        break;

      default:
        console.warn('Unknown action:', action);
        break;
    }
  }

  //   changeModel(modelId, selectedRingId) {
  //     if (!modelId) {
  //         console.warn('No model ID provided');
  //         return;
  //     }

  //     // Pass both modelId and selectedRingId to iframeMsgToSwitchModel
  //     this.iframeMsgToSwitchModel(modelId, selectedRingId);
  // }
  changeModel(modelId, selectedRingId, pair1, pair2) {
    if (!modelId) {
      console.warn('No model ID provided');
      return;
    }
    this.iframeMsgToSwitchModel(modelId, selectedRingId, pair1, pair2);
  }


 async addRing(type, selectedRing) {
  console.log("Adding ring - type:", type, "selectedRing:", selectedRing);
  
  try {
    // Check if only one model is displayed and add the second model
    if (this.modelManager.currentDisplayedModels.length === 1) {
      if (selectedRing && selectedRing.name && selectedRing.name.toLowerCase().includes("engage")) {
        await this.modelManager.addSecondModel("engagement", selectedRing);
      }
      else if (selectedRing && selectedRing.name && selectedRing.name.toLowerCase().includes("memoir")) {
        await this.modelManager.addSecondModel("memoir", selectedRing);
      }
      else if (type) {
        await this.modelManager.addSecondModel(type, selectedRing);
      }
      else if (selectedRing) {
        await this.modelManager.addSecondModel(null, selectedRing);
      }
    }
    // If two models are displayed, add the third model
    else if (this.modelManager.currentDisplayedModels.length === 2) {
      if (selectedRing && selectedRing.name && selectedRing.name.toLowerCase().includes("engage")) {
        await this.modelManager.addThirdModel("engagement", selectedRing);
      }
      else if (selectedRing && selectedRing.name && selectedRing.name.toLowerCase().includes("memoir")) {
        await this.modelManager.addThirdModel("memoir", selectedRing);
      }
      else if (type) {
        await this.modelManager.addThirdModel(type, selectedRing);
      }
      else if (selectedRing) {
        await this.modelManager.addThirdModel(null, selectedRing);
      }
    }
    // If three models are displayed, add the fourth model
    else if (this.modelManager.currentDisplayedModels.length === 3) {
      if (selectedRing && selectedRing.name && selectedRing.name.toLowerCase().includes("engage")) {
        await this.modelManager.addFourthModel("engagement", selectedRing);
      }
      else if (selectedRing && selectedRing.name && selectedRing.name.toLowerCase().includes("memoir")) {
        await this.modelManager.addFourthModel("memoir", selectedRing);
      }
      else if (type) {
        await this.modelManager.addFourthModel(type, selectedRing);
      }
      else if (selectedRing) {
        await this.modelManager.addFourthModel(null, selectedRing);
      }
    } 
    else {
      console.warn('Cannot add a ring at this stage');
    }
  } catch (error) {
    console.error("Error adding ring:", error);
  }
}


  removeRing() {
    if (this.modelManager.currentDisplayedModels.length === 2) {
      this.modelManager.removeSecondModel();
    }
    else if (this.modelManager.currentDisplayedModels.length === 3) {
      this.modelManager.removeThirdModel();
    } else if (this.modelManager.currentDisplayedModels.length === 4) {
      this.modelManager.removeFourthModel();
    } else {
      console.warn('No ring to remove or invalid ID');
    }
  }
  currentSelectedRing(id) {
    this.modelManager.currentSelectedRing(id)


  }

  iframeMsgToSwitchModel(modelId, selectedRingId, pair1 = false, pair2 = false) {
    this.modelManager.modelId = modelId

    switch (modelId) {
      case "P1":
        this.modelManager.switchModel(0, selectedRingId, pair1, pair2);
        break;
      case "P2":
        this.modelManager.switchModel(1, selectedRingId, pair1, pair2);
        break;
      case "P3":
        this.modelManager.switchModel(2, selectedRingId, pair1, pair2);
        break;
      case "P4":
        this.modelManager.switchModel(3, selectedRingId, pair1, pair2);
        break;
      case "P5":
        this.modelManager.switchModel(4, selectedRingId, pair1, pair2);
        break;
      case "P6":
        this.modelManager.switchModel(5, selectedRingId, pair1, pair2);
        break;
      case "P7":
        this.modelManager.switchModel(6, selectedRingId, pair1, pair2);
        break;
      case "P8":
        this.modelManager.switchModel(7, selectedRingId, pair1, pair2);
        break;
      case "P9":
        this.modelManager.switchModel(8, selectedRingId, pair1, pair2);
        break;
      case "P10":
        this.modelManager.switchModel(9, selectedRingId, pair1, pair2);
        break;
      case "P11":
        this.modelManager.switchModel(10, selectedRingId, pair1, pair2);
        break;
      case "P12":
        this.modelManager.switchModel(11, selectedRingId, pair1, pair2);
        break;
      case "P13":
        this.modelManager.switchModel(12, selectedRingId, pair1, pair2);
        break;
      case "P14":
        this.modelManager.switchModel(13, selectedRingId, pair1, pair2);
        break;
      case "P15":
        this.modelManager.switchModel(14, selectedRingId, pair1, pair2);
        break;
      default:
        console.warn("Unknown model identifier:", modelId);
        break;
    }
    this.modelManager.setCurrentModelName(modelId)
    if (this.modelManager.GrooveBool == true) {
      // this.modelManager.loadMidMesh();
    }
  }

}

