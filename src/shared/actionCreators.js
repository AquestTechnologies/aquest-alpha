import log from './utils/logTailor';
// import { 
//   fetchUniverse,
//   fetchUniverses,
//   fetchInventory,
//   fetchTopic,
//   fetchTopicContent,
//   fetchChat
// } from './utils/fetchers';
import {
  fetchUniverse,
  fetchUniverses,
  fetchInventory,
  fetchTopic,
  fetchTopicContent,
  fetchChat,
  addUniverse,
  addTopic,
  postUser
} from './utils/fetchers.new';
import { 
  SET_UNIVERSE, SET_TOPIC,
  ADD_UNIVERSE, REQUEST_UNIVERSE, SUCCESS_UNIVERSE, FAILURE_UNIVERSE,
  REQUEST_UNIVERSES, SUCCESS_UNIVERSES, FAILURE_UNIVERSES,
  REQUEST_INVENTORY, SUCCESS_INVENTORY, FAILURE_INVENTORY,
  REQUEST_TOPIC_CONTENT, SUCCESS_TOPIC_CONTENT, FAILURE_TOPIC_CONTENT,
  REQUEST_TOPIC, SUCCESS_TOPIC, FAILURE_TOPIC,
  REQUEST_CHAT, SUCCESS_CHAT, FAILURE_CHAT,
  REQUEST_CREATE_USER, SUCCESS_CREATE_USER, FAILURE_CREATE_USER
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

export function newUniverse(universe) {
  log('.A. newUniverse');
  
  return {
    types: [ADD_UNIVERSE, SUCCESS_UNIVERSE, FAILURE_UNIVERSE],
    promise: addUniverse(universe),
    params: universe
  };
}

export function newTopic(topic) {
  log('.A. newTopic');
  
  return {
    types: [ADD_UNIVERSE, SUCCESS_UNIVERSE, FAILURE_UNIVERSE],
    promise: addTopic(topic),
    params: topic
  };
}

export function createUser(user) {
  log('.A. createUser');
  const {pseudo, email, password} = user; // Évince redirect
  
  return {
    types: [REQUEST_CREATE_USER, SUCCESS_CREATE_USER, FAILURE_CREATE_USER],
    promise: postUser({pseudo, email, password}),
    params: user
  };
}


