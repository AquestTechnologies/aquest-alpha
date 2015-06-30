import log from '../utils/logTailor';
import { 
  fetchUniverseByHandle,
  fetchUniverses
} from '../utils/fetchers';
import { 
  SET_UNIVERSE,
  REQUEST_UNIVERSE,
  SUCCESS_UNIVERSE,
  FAILURE_UNIVERSE,
  REQUEST_UNIVERSES,
  SUCCESS_UNIVERSES,
  FAILURE_UNIVERSES
} from '../constants/ActionTypes';


export function loadUniverseByHandle(handle) {
  log('.A. loadUniverseByHandle : ' + handle);
  return {
    types: [REQUEST_UNIVERSE, SUCCESS_UNIVERSE, FAILURE_UNIVERSE],
    promise: fetchUniverseByHandle(handle),
    data: handle
  };
}

export function loadUniverses() {
  log('.A. loadUniverses');
  return {
    types: [REQUEST_UNIVERSES, SUCCESS_UNIVERSES, FAILURE_UNIVERSES],
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