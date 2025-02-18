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
    const { action, modelId, type, id, selectedRing, value, pair, isEngraving,isBiCol,isTriCol,isMetal,field } = event.data;
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
        // console.log("value aaaaaaa",isBiCol.name, value.colorCode, field)
        if(isBiCol==null && isTriCol==null){
        this.modelManager.changeModelColor(value.colorCode)
        console.log("value", value.colorCode, value.value)
      return;}
        if(isBiCol.name=="Two tone" && field=="single"){ 
          this.pMetalManager.colorChangeBi(value.colorCode,1)
        }
        else  if(isBiCol.name=="Two tone" && field=="twoTone"){
          this.pMetalManager.colorChangeBi(value.colorCode,2)
          
        }
        else  if(isBiCol.name=="Two tone" && field=="triColored"){
          this.pMetalManager.colorChangeBi(value.colorCode,3)
          
        }

        if(isBiCol.name=="Tri Colored"){
          if(field=="single"){
            this.pMetalManager.colorChangeBi(value.colorCode,1)

          }
          else if(field=="twoTone"){
          this.pMetalManager.colorChangeBi(value.colorCode,3)
            
          }
          else if(field=="triColored"){
          this.pMetalManager.colorChangeBi(value.colorCode,2)
            
          }

        }
        // else if(isTriCol!=null ){
        //   if(field=="single"){  // single means first field
        //   this.pMetalManager.coloChangeTri(value.colorCode,1) }
        // }
        // else  if(field=="twoTone"){ // second color field
        //   this.pMetalManager.coloChangeTri(value.colorCode,2) 
        // }
        // else  if(field=="triColored"){ // // third color field
        //   this.pMetalManager.coloChangeTri(value.colorCode,3) 
        // }
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
        console.log("calss groove", type, value)
        if(type=="defaultAdd"){
          
          this.modelManager.GrooveManagerIns.addGroove(selectedRing);
          break;
        }
        if(type=="defaultDelete"){
          
          this.modelManager.GrooveManagerIns.removeGroove(selectedRing);
          break;
        }
        if(type=="Without"){
          this.modelManager.GrooveManagerIns.removeMidMeshes();
          this.modelManager.GrooveBool = false; 
        }
        else{

          this.modelManager.loadMidMesh(type,false);

        }
        break;  
        case "addStep":
          console.log("calss groove step", value,type)
          
          if(value=="left"){
            if(type=="Without"){
              this.modelManager.StepsManagerIns.removeLeftSteps();
              break;
            }
            else{
              if(type=="Milgrain"){
            this.modelManager.StepsManagerIns.addLeftStep(true)
               }
              else{
                this.modelManager.StepsManagerIns.addLeftStep(false)

              } }
          }
          if(value=="right"){
            if(type=="Without"){
              this.modelManager.StepsManagerIns.removeRightSteps();
              break;
            }
            else{

              if(type=="Milgrain"){
                this.modelManager.StepsManagerIns.addRightStep(true)
                   }
                  else{
                    this.modelManager.StepsManagerIns.addRightStep(false)
    
                  }

            }

          }
          break;  
      case "changeSlider":
        // console.log("calss", value, selectedRing)
        this.pMetalManager.setoffsetValue(value, selectedRing)
        break;
      case "changeMultiSlider":
        console.log("calss tri", value, this.pMetalManager.isEnable,selectedRing)
        
        this.pMetalManager.setoffsetValueTri(value.left,value.right,selectedRing)
        
        break;
      
      case "PreciousMetal":
        console.log("cal", value,isBiCol,isTriCol)
     let  lengthModels= this.modelManager.currentDisplayedModels.length
        if(value==0){
          this.pMetalManager.removeHelperModelAndClipping(1)
          this.pMetalManager.removeHelperModelAndClipping(2)
          this.pMetalManager.removeClippingTriOneRing()
          this.modelManager.GrooveManagerIns.removeMidMeshes();
          
          this.pMetalManager.isEnable = false
          return;

        }
          if(lengthModels==1 && isBiCol){
            this.pMetalManager.biColorOneRing(value);
        }
        else if(lengthModels==1 && (!isBiCol || isBiCol == null)){
          this.pMetalManager.triColorOneRing(value);

        }
        else if(lengthModels==2 && isBiCol){
          this.pMetalManager.biTriPair(value);
        console.log("cal 1", value,isBiCol,isTriCol)

        }
        else if(lengthModels==2 && (!isBiCol || isBiCol == null)){
        console.log("cal 2", value,isBiCol,isTriCol)
          
          this.pMetalManager.biTriPair(value,true);
        }
        break;
      case "FontChange":
        if(value=="svnfont00"){
          this.modelManager.changeFont(1); 

        }
        else  if(value=="svnfont01"){
          this.modelManager.changeFont(2); 

        }
        else  if(value=="svnfont02"){
          this.modelManager.changeFont(5); 

        }
        else  if(value=="svnfont03"){
          this.modelManager.changeFont(4); 

        }
        else  if(value=="svnfont04"){
          this.modelManager.changeFont(5); 

        }
        else{
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


  addRing(type, selectedRing) {
    console.log("type", type,selectedRing)
    // Check if only one model is displayed and add the second model
    if(type==undefined && selectedRing.name.toLowerCase().includes("engage")){
      this.modelManager.addSecondModel("engagement", selectedRing);
      
    }
    if (this.modelManager.currentDisplayedModels.length === 1 && type) {
      this.modelManager.addSecondModel(type, selectedRing); // Function to add the second ring
    } else if (this.modelManager.currentDisplayedModels.length === 1 && selectedRing) {
      this.modelManager.addSecondModel(null, selectedRing); // Use selectedRing if no type provided
    }

    // If two models are displayed, add the third model
    else if (this.modelManager.currentDisplayedModels.length === 2 && type) {
      this.modelManager.addThirdModel(type, selectedRing);
    } else if (this.modelManager.currentDisplayedModels.length === 2 && selectedRing) {
      this.modelManager.addThirdModel(null, selectedRing);
    }

    // If three models are displayed, add the fourth model
    else if (this.modelManager.currentDisplayedModels.length === 3 && type) {
      this.modelManager.addFourthModel(type, selectedRing);
    } else if (this.modelManager.currentDisplayedModels.length === 3 && selectedRing) {
      this.modelManager.addFourthModel(null, selectedRing);
    } else {
      console.warn('Cannot add a ring at this stage');
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
    if(this.modelManager.GrooveBool==true ){
      // this.modelManager.loadMidMesh();
    }
  }

}
