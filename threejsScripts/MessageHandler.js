// MessageHandler.js

export class MessageHandler {
    constructor(modelManager, orbitControlHandler) {
      this.modelManager = modelManager; 
      this.orbitControlHandler = orbitControlHandler;
  
      // Add the event listener for messages from the parent
      window.addEventListener('message', this.handleMessage.bind(this));
    }
  
    handleMessage(event) {
      const { action, modelId, type, id,selectedRing } = event.data;
      // console.log('Message received from parent:', event.data, action);
  
      switch (action) {
        case 'changeModel':
          this.changeModel(modelId);
          break;
  
        case 'addRing':
          this.addRing(type, selectedRing);
          break;
  
        case 'removeRing':
          this.removeRing();
          break;
  
        default:
          console.warn('Unknown action:', action);
          break;
      }
    }
  
    changeModel(modelId) {
      if (!modelId) {
        console.warn('No model ID provided');
        return;
      }
    //   this.modelManager.switchModel(modelId);
    this.iframeMsgToSwitchModel(modelId)
    }
  
    addRing(type, selectedRing) {
      // Check if only one model is displayed and add the second model
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
      if(this.modelManager.currentDisplayedModels.length === 2){
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
    iframeMsgToSwitchModel(str) {
        switch (str) {
          case "P1":
            this.modelManager.switchModel(0);
            break;
          case "P2":
            this.modelManager.switchModel(1);
            break;
          case "P3":
            this.modelManager.switchModel(2);
            break;
          case "P4":
            this.modelManager.switchModel(3);
            break;
          case "P5":
            this.modelManager.switchModel(4);
            break;
          case "P6":
            this.modelManager.switchModel(5);
            break;
          case "P7":
            this.modelManager.switchModel(6);
            break;
          case "P8":
            this.modelManager.switchModel(7);
            break;
          case "P9":
            this.modelManager.switchModel(8);
            break;
          case "P10":
            this.modelManager.switchModel(9);
            break;
          case "P11":
            this.modelManager.switchModel(10);
            break;
          case "P12":
            this.modelManager.switchModel(11);
            break;
          case "P13":
            this.modelManager.switchModel(12);
            break;
          case "P14":
            this.modelManager.switchModel(13);
            break;
          case "P15":
            this.modelManager.switchModel(14);
            break;
          default:
            console.warn("Unknown model identifier:", str);
            break;
        }
      }
  }
  