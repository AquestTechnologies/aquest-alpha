import log from '../utils/logTailor.js';
import { 
  fetchUniverseByHandle,
  fetchUniverses
} from '../utils/fetchers.new.js'
import { 
  SET_UNIVERSE,
  LOAD_UNIVERSE_REQUEST,
  LOAD_UNIVERSE_SUCCESS,
  LOAD_UNIVERSE_FAILURE,
  LOAD_UNIVERSES_REQUEST,
  LOAD_UNIVERSES_SUCCESS,
  LOAD_UNIVERSES_FAILURE
} from '../constants/ActionTypes';



/*export function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}*/

/*export function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}*/

export function loadUniverseByHandle(handle) {
  log('.A. loadUniverseByHandle : ' + handle);
  return {
    types: [LOAD_UNIVERSE_REQUEST, LOAD_UNIVERSE_SUCCESS, LOAD_UNIVERSE_FAILURE],
    promise: fetchUniverseByHandle(handle),
    data: handle
  };
}

export function loadUniverses() {
  log('.A. loadUniverses');
  return {
    types: [LOAD_UNIVERSES_REQUEST, LOAD_UNIVERSES_SUCCESS, LOAD_UNIVERSES_FAILURE],
    promise: fetchUniverses(),
    data: null
  };
}

export function setUniverse(universe) {
  log('.A. setUniverse : ' + universe.name);
  return {
    type: SET_UNIVERSE,
    data: universe
  };
}