import { Flummox } from 'flummox';

import UniverseStore from './stores/UniverseStore.js'
import UniverseActions from './actions/UniverseActions.js'

import TopicStore from './stores/TopicStore.js'
import TopicActions from './actions/TopicActions.js'

import ChatStore from './stores/ChatStore.js'
import ChatActions from './actions/ChatActions.js'

export default class Flux extends Flummox {
  constructor() {
    super();
    
    //il faut declarer les actions avant les stores.
    //car this.createStore appelle le constructor du store en question
    //dans lequel se trouve une reference aux Actions
    this.createActions('universeActions', UniverseActions);
    // The extra argument(s) are passed to the UniverseStore constructor
    this.createStore('universeStore', UniverseStore, this);
    
    this.createActions('topicActions', TopicActions);
    this.createStore('topicStore', TopicStore, this);
    
    this.createActions('chatActions', ChatActions);
    this.createStore('chatStore', ChatStore, this);
    
    console.log('... Flux initialized');
  }
}