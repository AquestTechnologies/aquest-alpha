import log from '../utils/logTailor';
import {
  fetchInventory,
  fetchTopicByHandle,
  fetchTopicContent
} from '../utils/fetchers';
import { 
  SET_TOPIC,
  REQUEST_INVENTORY,
  SUCCESS_INVENTORY,
  FAILURE_INVENTORY,
  REQUEST_TOPIC_CONTENT,
  SUCCESS_TOPIC_CONTENT,
  FAILURE_TOPIC_CONTENT,
  REQUEST_TOPIC_BY_HANDLE,
  SUCCESS_TOPIC_BY_HANDLE,
  FAILURE_TOPIC_BY_HANDLE
} from '../constants/ActionTypes';

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
  log('.A. setTopic : ' + topic.id);
  return {
    type: SET_TOPIC,
    params: topic
  };
}