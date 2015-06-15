// Universe

static runPhidippides(routerState) {
  // peut etre refactoré
  let whichAction, correctValue;
  if (currentPath === '/') {
    whichAction = {
      actions: 'universeActions',
      creator: 'loadStartUniverse',
      args : [userId]
    };
    correctValue = null;
  } else {
    whichAction = {
      actions: 'universeActions',
      creator: 'loadUniverseByName',
      args : [routerState.params.universeName]
    };
    correctValue = {
      name: routerState.params.universeName
    };
  }
  
  return {
    id: 'universe',
    dependency: null,
    shouldBePresent: {
      store: 'universeStore',
      data: 'universe'
      shouldHaveValue: correctValue
    },
    ifNot: whichAction
  };
}

// Inventory

static runPhidippides(routerState) {
  
  if (routerState.c === 1) {
    return {
      id: 'inventory',
      dependency: 'universe',
      shouldBePresent: {
        store: 'topicStore',
        data: 'inventory'
        shouldHaveValue: null
      },
      ifNot:  {
        actions: 'topicActions',
        creator: 'loadInventory',
        args : ['dependency.id']
      }
    };
  } else {
    return;
  }
}

// Topic

static runPhidippides(routerState) {
  
  if (routerState.c === 1) {
    return {
      id: 'topic',
      dependency: null,
      shouldBePresent: {
        store: 'topicStore',
        data: 'topic'
        shouldHaveValue: null
      },
      ifNot:  {
        actions: 'topicActions',
        creator: 'loadTopic',
        args : [routerState.params.topicHandle]
      }
    };
  } else {
    return;
  }
}

// Chat

static runPhidippides(routerState) {
  
  if (routerState.c === 1) {
    let correctDependency = routerState.params.topicHandle ? 'topic' : 'universe';
    return {
      id: 'chat',
      dependency: correctDependency,
      shouldBePresent: {
        store: 'chatStore',
        data: 'chat'
        shouldHaveValue: null
      },
      ifNot:  {
        actions: 'chatActions',
        creator: 'loadChat',
        args : ['dependency.chatId']
      }
    };
  } else {
    return;
  }
}

