import log from './utils/logTailor';
import {
  getUniverse,
  getUniverses,
  getInventory,
  getTopic,
  getTopicContent,
  getChat,
  postUniverse,
  postTopic,
  postUser
} from './utils/APIMiddleware';
import { 
  REQUEST_READ_UNIVERSE, SUCCESS_READ_UNIVERSE, FAILURE_READ_UNIVERSE,
  REQUEST_READ_UNIVERSES, SUCCESS_READ_UNIVERSES, FAILURE_READ_UNIVERSES,
  REQUEST_READ_INVENTORY, SUCCESS_READ_INVENTORY, FAILURE_READ_INVENTORY,
  REQUEST_READ_TOPIC_CONTENT, SUCCESS_READ_TOPIC_CONTENT, FAILURE_READ_TOPIC_CONTENT,
  REQUEST_READ_TOPIC, SUCCESS_READ_TOPIC, FAILURE_READ_TOPIC,
  REQUEST_READ_CHAT, SUCCESS_READ_CHAT, FAILURE_READ_CHAT,
  REQUEST_CREATE_UNIVERSE, SUCCESS_CREATE_UNIVERSE, FAILURE_CREATE_UNIVERSE,
  REQUEST_CREATE_TOPIC, SUCCESS_CREATE_TOPIC, FAILURE_CREATE_TOPIC,
  REQUEST_CREATE_USER, SUCCESS_CREATE_USER, FAILURE_CREATE_USER
} from './actionsTypes';


export function readUniverse(id) {
  log(`.A. readUniverse : ${id}`);
  return {
    types: [REQUEST_READ_UNIVERSE, SUCCESS_READ_UNIVERSE, FAILURE_READ_UNIVERSE],
    promise: getUniverse(id),
    params: id
  };
}

export function readUniverses() {
  log('.A. readUniverses');
  return {
    types: [REQUEST_READ_UNIVERSES, SUCCESS_READ_UNIVERSES, FAILURE_READ_UNIVERSES],
    promise: getUniverses()
  };
}


export function readInventory(universeId) {
  log(`.A. readInventory : ${universeId}`);
  return {
    types: [REQUEST_READ_INVENTORY, SUCCESS_READ_INVENTORY, FAILURE_READ_INVENTORY],
    promise: getInventory(universeId),
    params: universeId
  };
}

export function readTopic(id) {
  log(`.A. readTopic ${id}`);
  return {
    types: [REQUEST_READ_TOPIC, SUCCESS_READ_TOPIC, FAILURE_READ_TOPIC],
    promise: getTopic(id),
    params: id
  };
}

export function readTopicContent(id) {
  log(`.A. readTopicContent : ${id}`);
  return {
    types: [REQUEST_READ_TOPIC_CONTENT, SUCCESS_READ_TOPIC_CONTENT, FAILURE_READ_TOPIC_CONTENT],
    promise: getTopicContent(id),
    params: id
  };
}


export function readChat(id) {
  log(`.A. readChat : ${id}`);
  return {
    types: [REQUEST_READ_CHAT, SUCCESS_READ_CHAT, FAILURE_READ_CHAT],
    promise: getChat(id),
    params: id
  };
}

export function createUniverse(universe) {
  log('.A. createUniverse');
  
  return {
    types: [REQUEST_CREATE_UNIVERSE, SUCCESS_CREATE_UNIVERSE, FAILURE_CREATE_UNIVERSE],
    promise: postUniverse(universe),
    params: universe
  };
}

export function createTopic(topic) {
  log('.A. createTopic');
  
  return {
    types: [REQUEST_CREATE_TOPIC, SUCCESS_CREATE_TOPIC, FAILURE_CREATE_TOPIC],
    promise: postTopic(topic),
    params: topic
  };
}

export function createUser(user) {
  log('.A. createUser');
  const {pseudo, email, password} = user; // Évince user.redirect
  
  return {
    types: [REQUEST_CREATE_USER, SUCCESS_CREATE_USER, FAILURE_CREATE_USER],
    promise: postUser({pseudo, email, password}),
    params: user
  };
}


