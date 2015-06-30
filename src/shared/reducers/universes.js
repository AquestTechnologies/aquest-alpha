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


export default function universes(state = {}, action) {
  switch (action.type) {
  case SET_UNIVERSE:
    return {
      universe: action.data,
      universes: state.universes
    };
  case SUCCESS_UNIVERSE:
    return {
      universe: action.result,
      universes: state.universes
    };
  case SUCCESS_UNIVERSES:
    return {
      universe: state.universe,
      universes: action.result
    };
  default:
    return state;
  }
}
