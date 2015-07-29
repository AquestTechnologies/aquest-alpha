import key from '../vendor/keymaster';

export default function registerShortcuts(getState) {
  const getCurrentParams = () => getState().router.params;
  key('ctrl+shift+1', () => console.log('state :', getState()));
  
  key('ctrl+shift+2', () => console.log('universes :', getState().universes.toJS()));
  
  key('ctrl+shift+3', () => console.log('universe :', getState().universes.toJS()[getCurrentParams().universeId]));
  
  key('ctrl+shift+4', () => console.log('topics :', getState().topics.toJS()));
  
  key('ctrl+shift+5', () => console.log('topic :', getState().topics.toJS()[getCurrentParams().topicId]));
  
  key('ctrl+shift+6', () => console.log('chats :', getState().chats.toJS()));
  
  key('ctrl+shift+7', () => {
    const {universes, topics, chats} = getState();
    const {universeId, topicId} = getCurrentParams();
    const topic = topics.toJS()[topicId];
    const universe = universes.toJS()[universeId];
    console.log('chat : ', universe ? chats.toJS()[topicId ? topic.chatId : universe.chatId] : undefined);
  });
  
  key('ctrl+shift+8', () => console.log('users :', getState().users.toJS()));
  
  key('ctrl+shift+9', () => console.log('records :', getState().records));
  
  key('ctrl+shift+0', () => console.log('session :', getState().session));
}