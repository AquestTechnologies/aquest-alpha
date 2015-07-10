import log from './utils/logTailor';
import { 
  fetchUniverseByHandle,
  fetchUniverses,
  fetchInventory,
  fetchTopicByHandle,
  fetchTopicContent,
  fetchChat
} from './utils/fetchers';
import { 
  SET_UNIVERSE, SET_TOPIC,
  REQUEST_UNIVERSE, SUCCESS_UNIVERSE, FAILURE_UNIVERSE,
  REQUEST_UNIVERSES, SUCCESS_UNIVERSES, FAILURE_UNIVERSES,
  REQUEST_INVENTORY, SUCCESS_INVENTORY, FAILURE_INVENTORY,
  REQUEST_TOPIC_CONTENT, SUCCESS_TOPIC_CONTENT, FAILURE_TOPIC_CONTENT,
  REQUEST_TOPIC_BY_HANDLE, SUCCESS_TOPIC_BY_HANDLE, FAILURE_TOPIC_BY_HANDLE,
  REQUEST_CHAT, SUCCESS_CHAT, FAILURE_CHAT
} from './actionsTypes';


export function loadUniverseByHandle(handle) {
  log('.A. loadUniverseByHandle : ' + handle);
  return {
    types: [REQUEST_UNIVERSE, SUCCESS_UNIVERSE, FAILURE_UNIVERSE],
    promise: fetchUniverseByHandle(handle),
    params: handle
  };
}

export function loadUniverses() {
  log('.A. loadUniverses');
  return {
    types: [REQUEST_UNIVERSES, SUCCESS_UNIVERSES, FAILURE_UNIVERSES],
    promise: fetchUniverses()
  };
}

export function setUniverse(universe) {
  log('.A. setUniverse : ' + universe.handle);
  return {
    type: SET_UNIVERSE,
    payload: universe
  };
}

export function loadInventory(universeId) {
  log('.A. loadInventory : ' + universeId);
  return {
    types: [REQUEST_INVENTORY, SUCCESS_INVENTORY, FAILURE_INVENTORY],
    promise: fetchInventory(universeId),
    params: universeId
  };
}

export function loadTopicByHandle(handle) {
  log('.A. loadTopicByHandle : ' + handle);
  return {
    types: [REQUEST_TOPIC_BY_HANDLE, SUCCESS_TOPIC_BY_HANDLE, FAILURE_TOPIC_BY_HANDLE],
    promise: fetchTopicByHandle(handle),
    params: handle
  };
}

export function loadTopicContent(id) {
  log('.A. loadTopicContent : ' + id);
  return {
    types: [REQUEST_TOPIC_CONTENT, SUCCESS_TOPIC_CONTENT, FAILURE_TOPIC_CONTENT],
    promise: fetchTopicContent(id),
    params: id
  };
}

export function setTopic(topic) {
  log('.A. setTopic : ' + topic.handle);
  return {
    type: SET_TOPIC,
    payload: topic
  };
}

export function loadChat(chatId) {
  log('.A. loadChat : ' + chatId);
  return {
    types: [REQUEST_CHAT, SUCCESS_CHAT, FAILURE_CHAT],
    promise: fetchChat(chatId),
    params: chatId
  };
}

