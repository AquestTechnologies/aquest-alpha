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
  postUniverse,
  postTopic,
  postUser
} from './utils/fetchers.new';
import { 
  SET_UNIVERSE, SET_TOPIC,
  CREATE_UNIVERSE, SUCCESS_CREATE_UNIVERSE, FAILURE_CREATE_UNIVERSE,
  CREATE_TOPIC, SUCCESS_CREATE_TOPIC, FAILURE_CREATE_TOPIC,
  REQUEST_UNIVERSE, SUCCESS_UNIVERSE, FAILURE_UNIVERSE,
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

export function createUniverse(universe) {
  log('.A. postniverse');
  
  return {
    types: [CREATE_UNIVERSE, SUCCESS_CREATE_UNIVERSE, FAILURE_CREATE_UNIVERSE],
    promise: postUniverse(universe),
    params: universe
  };
}

export function createTopic(topic) {
  log('.A. postTopic');
  
  return {
    types: [CREATE_TOPIC, SUCCESS_CREATE_TOPIC, FAILURE_CREATE_TOPIC],
    promise: postTopic(topic),
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


