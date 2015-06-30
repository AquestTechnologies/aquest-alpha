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

const initialState = {
  // universe: {},
  // universes: [],
  universeIsLoading: false,
  universesIsLoading: false
};

export default function universe(state = initialState, action) {
  switch (action.type) {
  case SET_UNIVERSE:
    log('.R. SET_UNIVERSE');
    return {
      universe: action.data,
      universes: state.universes,
      universeIsLoading: state.universeIsLoading,
      universesIsLoading: state.universesIsLoading
    };
  case REQUEST_UNIVERSE:
    log('.R. REQUEST_UNIVERSE');
    return {
      universe: state.universe,
      universes: state.universes,
      universeIsLoading: true,
      universesIsLoading: state.universesIsLoading
    };
  case SUCCESS_UNIVERSE:
    log('.R. SUCCESS_UNIVERSE');
    return {
      universe: action.result,
      universes: state.universes,
      universeIsLoading: false,
      universesIsLoading: state.universesIsLoading
    };
  case REQUEST_UNIVERSES:
    log('.R. REQUEST_UNIVERSES');
    return {
      universe: state.universe,
      universes: state.universes,
      universeIsLoading: state.universeIsLoading,
      universesIsLoading: true
    };
  case SUCCESS_UNIVERSES:
    log('.R. SUCCESS_UNIVERSES');
    return {
      universe: state.universe,
      universes: action.result,
      universeIsLoading: state.universeIsLoading,
      universesIsLoading: false
    };
  default:
    return state;
  }
}
