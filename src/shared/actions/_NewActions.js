import BaseActions from '../utils/BaseActions.js';

export default class _NewActions extends BaseActions {
  
  // Pour info doc Flummox : 
  // [Dans une action] The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)
  
  async loadStuff(stuffId) {
    console.log('.A. _NewActions.loadStuff ' + stuffId);
    try {
      return await this.fetch.universe(stuffId);
    } catch (err) {
      console.log('!!! Error while _NewActions.loadStuff.');
      console.log(err);
    }
  }
  
}