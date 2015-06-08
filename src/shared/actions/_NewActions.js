import BaseActions from '../utils/BaseActions.js';

export default class NewActions extends BaseActions {
  
  // Pour info doc Flummox : 
  // [Dans une action] The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)
  
  async loadNew(stuffId) {
    console.log('.A. NewActions.loadNew ' + stuffId);
    try {
      return await this.fetch.stuff(stuffId);
    } catch (err) {
      console.log('!!! Error while NewActions.loadNew.');
      console.log(err);
    }
  }
  
}