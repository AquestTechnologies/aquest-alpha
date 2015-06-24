import log from '../utils/logTailor.js';
import {
  fetchInventory,
  fetchTopicByHandle
} from '../utils/fetchers.js';
import { 
  LOAD_INVENTORY_REQUEST,
  LOAD_INVENTORY_SUCCESS,
  LOAD_INVENTORY_FAILURE,
  LOAD_TOPIC_CONTENT_REQUEST,
  LOAD_TOPIC_CONTENT_SUCCESS,
  LOAD_TOPIC_CONTENT_FAILURE,
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

export function loadTopicContent(topicId) {
  log('.A. loadTopicContent : ' + topicId);
  return {
    types: [LOAD_TOPIC_CONTENT_REQUEST, LOAD_TOPIC_CONTENT_SUCCESS, LOAD_TOPIC_CONTENT_FAILURE],
    promise: loadTopicContent(topicId),
    data: topicId
  };
}

export function setTopic(topic) {
  log('.A. setTopic : ' + topic.id);
  return {
    type: SET_TOPIC,
    data: topic
  };
}