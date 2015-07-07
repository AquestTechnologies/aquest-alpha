import log from '../utils/logTailor';
import { 
  SET_UNIVERSE,
  REQUEST_UNIVERSE,
  SUCCESS_UNIVERSE,
  FAILURE_UNIVERSE,
  REQUEST_UNIVERSES,
  SUCCESS_UNIVERSES,
  FAILURE_UNIVERSES
} from '../constants/ActionTypes';
import simpleCopy from '../utils/simpleCopy';

export default function universes(state = {}, action) {
  let newState;
  switch (action.type) {
    
    case SUCCESS_UNIVERSE:
      newState = simpleCopy(state);
      newState[action.result.id] = action.result;
      return newState;
  
    case SUCCESS_UNIVERSES:
      newState = simpleCopy(state);
      action.results.forEach(universe => newState[universe.id] = universe);
      return newState;
    
    default:
      return state;
  }
}
