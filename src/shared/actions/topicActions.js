import log from '../utils/logTailor.js';
import {
  fetchInventory,
  fetchTopicByHandle,
  fetchTopicContent
} from '../utils/fetchers.js';
import { 
  LOAD_INVENTORY_REQUEST,
  LOAD_INVENTORY_SUCCESS,
  LOAD_INVENTORY_FAILURE,
  LOAD_TOPIC_CONTENT_REQUEST,
  LOAD_TOPIC_CONTENT_SUCCESS,
  LOAD_TOPIC_CONTENT_FAILURE,
  LOAD_TOPIC_BY_HANDLE_REQUEST,
  LOAD_TOPIC_BY_HANDLE_SUCCESS,
  LOAD_TOPIC_BY_HANDLE_FAILURE,
  SET_TOPIC
} from '../constants/ActionTypes';

export function loadInventory(universeId) {
  log('.A. loadInventory : ' + universeId);
  return {
    types: [LOAD_INVENTORY_REQUEST, LOAD_INVENTORY_SUCCESS, LOAD_INVENTORY_FAILURE],
    promise: fetchInventory(universeId),
    data: universeId
  };
}

export function loadTopicByHandle(handle) {
  log('.A. loadTopicByHandle : ' + handle);
  return {
    types: [LOAD_TOPIC_BY_HANDLE_REQUEST, LOAD_TOPIC_BY_HANDLE_SUCCESS, LOAD_TOPIC_BY_HANDLE_FAILURE],
    promise: fetchTopicByHandle(handle),
    data: handle
  };
}

export function loadTopicContent(id) {
  log('.A. loadTopicContent : ' + id);
  return {
    types: [LOAD_TOPIC_CONTENT_REQUEST, LOAD_TOPIC_CONTENT_SUCCESS, LOAD_TOPIC_CONTENT_FAILURE],
    promise: fetchTopicContent(id),
    data: id
  };
}

export function setTopic(topic) {
  log('.A. setTopic : ' + topic.id);
  return {
    type: SET_TOPIC,
    data: topic
  };
}