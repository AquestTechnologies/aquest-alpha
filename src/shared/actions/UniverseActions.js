import { Actions } from 'flummox';

class UniverseActions extends Actions {

  /*createUniverse(messageContent) {
    return {
      content: messageContent,
      date: Date.now(),
    };
  }*/
  
  clickExplore() {
    return;
  }
  
  /*async createMessage(messageContent) {
    try {
      return await serverCreateMessage(messageContent);
    } catch (error) {
      // handle error somehow
    }
  }*/
  
  //The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)

}

export default UniverseActions;