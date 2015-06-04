import { Actions } from 'flummox';
import IsoFetch from '../utils/IsoFetch.js';

class BaseActions extends Actions {
  
  constructor() {
    super();
    this.fetch = new IsoFetch(); 
  }

}

export default BaseActions;