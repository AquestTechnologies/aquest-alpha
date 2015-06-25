import log from '../utils/logTailor.js';
import { 
  LOAD_UNIVERSE_REQUEST,
  LOAD_UNIVERSE_SUCCESS,
  LOAD_UNIVERSE_FAILURE,
  LOAD_UNIVERSES_REQUEST,
  LOAD_UNIVERSES_SUCCESS,
  LOAD_UNIVERSES_FAILURE,
  SET_UNIVERSE
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
  case LOAD_UNIVERSE_REQUEST:
    log('.R. LOAD_UNIVERSE_REQUEST');
    return {
      universe: state.universe,
      universes: state.universes,
      universeIsLoading: true,
      universesIsLoading: state.universesIsLoading
    };
  case LOAD_UNIVERSE_SUCCESS:
    log('.R. LOAD_UNIVERSE_SUCCESS');
    log(JSON.stringify(action.result));
    return {
      universe: action.result,
      universes: state.universes,
      universeIsLoading: false,
      universesIsLoading: state.universesIsLoading
    };
  case LOAD_UNIVERSES_REQUEST:
    log('.R. LOAD_UNIVERSES_REQUEST');
    return {
      universe: state.universe,
      universes: state.universes,
      universeIsLoading: state.universeIsLoading,
      universesIsLoading: true
    };
  case LOAD_UNIVERSES_SUCCESS:
    log('.R. LOAD_UNIVERSES_SUCCESS');
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
