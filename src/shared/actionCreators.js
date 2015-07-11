import log from './utils/logTailor';
import { 
  fetchUniverse,
  fetchUniverses,
  fetchInventory,
  fetchTopic,
  fetchTopicContent,
  fetchChat
} from './utils/fetchers';
import { 
  SET_UNIVERSE, SET_TOPIC,
  REQUEST_UNIVERSE, SUCCESS_UNIVERSE, FAILURE_UNIVERSE,
  REQUEST_UNIVERSES, SUCCESS_UNIVERSES, FAILURE_UNIVERSES,
  REQUEST_INVENTORY, SUCCESS_INVENTORY, FAILURE_INVENTORY,
  REQUEST_TOPIC_CONTENT, SUCCESS_TOPIC_CONTENT, FAILURE_TOPIC_CONTENT,
  REQUEST_TOPIC, SUCCESS_TOPIC, FAILURE_TOPIC,
  REQUEST_CHAT, SUCCESS_CHAT, FAILURE_CHAT
} from './actionsTypes';


export function loadUniverse(id) {
  log(`.A. loadUniverse : ${id}`);
  return {
    types: [REQUEST_UNIVERSE, SUCCESS_UNIVERSE, FAILURE_UNIVERSE],
    promise: fetchUniverse(id),
    params: id
  };
}

export function loadUniverses() {
  log('.A. loadUniverses');
  return {
    types: [REQUEST_UNIVERSES, SUCCESS_UNIVERSES, FAILURE_UNIVERSES],
    promise: fetchUniverses()
  };
}


export function loadInventory(universeId) {
  log(`.A. loadInventory : ${universeId}`);
  return {
    types: [REQUEST_INVENTORY, SUCCESS_INVENTORY, FAILURE_INVENTORY],
    promise: fetchInventory(universeId),
    params: universeId
  };
}

export function loadTopic(id) {
  log(`.A. loadTopic ${id}`);
  return {
    types: [REQUEST_TOPIC, SUCCESS_TOPIC, FAILURE_TOPIC],
    promise: fetchTopic(id),
    params: id
  };
}

export function loadTopicContent(id) {
  log(`.A. loadTopicContent : ${id}`);
  return {
    types: [REQUEST_TOPIC_CONTENT, SUCCESS_TOPIC_CONTENT, FAILURE_TOPIC_CONTENT],
    promise: fetchTopicContent(id),
    params: id
  };
}


export function loadChat(id) {
  log(`.A. loadChat : ${id}`);
  return {
    types: [REQUEST_CHAT, SUCCESS_CHAT, FAILURE_CHAT],
    promise: fetchChat(id),
    params: id
  };
}

/*export function setUniverse(universe) {
  log('.A. setUniverse : ' + universe.handle);
  return {
    type: SET_UNIVERSE,
    payload: universe
  };
}*/

/*export function setTopic(topic) {
  log('.A. setTopic : ' + topic.handle);
  return {
    type: SET_TOPIC,
    payload: topic
  };
}*/