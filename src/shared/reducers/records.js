import log from '../utils/logTailor';

export default function records(state = [], action) {
  log('.R. ' + action.type);
  // log(action);
  state.push({
    action: action,
    date: new Date()
  });
  return state;
}