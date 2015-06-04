//copié depuis https://github.com/vesparny/flux-immutable-example/blob/master/src/utils/BaseStore.js

import { Store } from 'flummox';

export default class BaseStore extends Store {
  constructor(flux, initialState) {
    super();
    this.state = initialState;
  }

  handleBeginAsyncRequest() {
    this.setState({ isLoading: true });
  }

  handleErrorAsyncRequest(err) {
    this.setState({ isLoading: false });
    console.log(err);
  }

  isLoading(){
    return this.state.isLoading;
  }
}