class Fetch {
  
  oneUniverse() {
    // returning a Promise because that is what fetch does.
    return new Promise(function (resolve, reject) {
      // simulate an asynchronous action where data is fetched on
      // a remote server somewhere.
      setTimeout(function () {
        // resolve with some mock data
        resolve();
      }, 250);
    });
  }
  
  allUniverses() {
    // returning a Promise because that is what fetch does.
    return new Promise(function (resolve, reject) {
      // simulate an asynchronous action where data is fetched on
      // a remote server somewhere.
      setTimeout(function () {
        // resolve with some mock data
        resolve([
          {
            "id": "1",
            "name": "Startups",
            "description": "This is a place where stuff gets done."
          },
          {
            "id": "2",
            "name": "Design",
            "description": "This is a place where stuff gets designed."
          },
          {
            "id": "3",
            "name": "Dev",
            "description": "This is a place where stuff gets developped."
          }
        ]);
      }, 500);
    });
  }
}

export default Fetch;