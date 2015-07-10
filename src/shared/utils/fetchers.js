import log from './logTailor.js';

export function fetchUniverse(id) {
  log('+++ Fetching universe ' + id);
  // returning a Promise because that is what fetch does.
  return new Promise(function (resolve, reject) {
    // simulate an asynchronous action where data is fetched on
    // a remote server somewhere.
    setTimeout(function () {
      // resolve with some mock data
      switch (id) {
        case '1':
         resolve({
          id: "Startups",
          chatId: '1',
          name: "Startups",
          descriptionription: "This is a place where stuff gets done.",
          picture: "/img/pillars_compressed.png",
        });
        break;
        case '2':
         resolve({
          id: "Design",
          chatId: '2',
          name: "Design",
          descriptionription: "This is a place where stuff gets designed.",
          picture: "/img/designer_compressed.png",
        });
        break;
        case '3':
         resolve({
          id: "Dev",
          chatId: '3',
          name: "Dev",
          descriptionription: "This is a place where stuff gets developped.",
          picture: "/img/forest-compressed.png",
        });
        break;
      default:
        resolve({
          id: "Startups",
          chatId: '1',
          name: "Startups",
          descriptionription: "This is a place where stuff gets done.",
          picture: "/img/pillars_compressed.png",
        });
      }
    }, 250);
  });
}

export function fetchUniverses() {
  log('+++ Fetching all universes');
  // returning a Promise because that is what fetch does.
  return new Promise(function (resolve, reject) {
    // simulate an asynchronous action where data is fetched on
    // a remote server somewhere.
    setTimeout(function () {
      // resolve with some mock data
      resolve([
        {
          id: "Startups",
          chatId: '1',
          name: "Startups",
          descriptionription: "This is a place where stuff gets done.",
          picture: "/img/pillars_compressed.png",
        },
        {
          id: "Design",
          chatId: '2',
          name: "Design",
          descriptionription: "This is a place where stuff gets designed.",
          picture: "/img/designer_compressed.png",
        },
        {
          id: "Dev",
          chatId: '3',
          name: "Dev",
          descriptionription: "This is a place where stuff gets developped.",
          picture: "/img/forest-compressed.png",
        }
      ]);
    }, 700);
  });
}

export function fetchInventory(universeId) {
  log('+++ Fetching inventory for universe ' + universeId);
  
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      let pasCustom = 
      [{
          id: 'Topic-Id-' + universeId + '-1',
          universeId,
          title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
          author: "Cicero"  + universeId + '1',
          description: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
          picture: "",
          timestamp:"a long time",
          chatId: "111"
        },
        {
          id: 'Topic-Id-' + universeId + '-2',
          universeId,
          title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
          author: "Cicero"  + universeId + '2',
          description: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
          picture: "",
          timestamp:"a long time",
          chatId: "111"
        },
        {
          id: 'Topic-Id-' + universeId + '-3',
          universeId,
          title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
          author: "Cicero"  + universeId + '3',
          description: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
          picture: "/img/image2.png",
          timestamp:"a long time",
          chatId: "111"
        },
        {
          id: 'Topic-Id-' + universeId + '-4',
          universeId,
          title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
          author: "Cicero"  + universeId + '4',
          description: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
          picture: "",
          timestamp:"a long time",
          chatId: "111"
        },
        {
          id: 'Topic-Id-' + universeId + '-5',
          universeId,
          title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
          author: "Cicero"  + universeId + '5',
          description: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
          picture: "",
          timestamp:"a long time",
          chatId: "111"
        },
        {
          id: 'Topic-Id-' + universeId + '-6',
          universeId,
          title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
          author: "Cicero"  + universeId + '6',
          description: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
          picture: "/img/image1.png",
          timestamp:"a long time",
          chatId: "111"
        }];
        
      resolve(
        [{
          id: 'Topic-Id-' + universeId + '-0000',
          universeId,
          title: universeId + " ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
          author: "Cicero",
          description: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
          picture: "/img/image1.png",
          timestamp:"a long time",
          chatId: "111"
        }].concat(pasCustom)
      );
    }, 750);
  });
}

export function fetchChat(id) {
  log('+++ Fetching chat ' + id);
  let messages = [];
  for (let i = 0; i < 100; i++) {
    messages.push({
      id: i,
      author: "Cicero",
      content: i + " Lorem ipsum dolor sit amet.",
    });
  }
  // returning a Promise because that is what fetch does.
  return new Promise(function (resolve, reject) {
    // simulate an asynchronous action where data is fetched on
    // a remote server somewhere.
    setTimeout(function () {
      // resolve with some mock data
      switch (id) {
        case '1':
         resolve({
          id: '1',
          name: "Global Startups chat",
          messages: messages
        });
        break;
        case '2':
         resolve({
          id: '2',
          name: "Global Design chat",
          messages: messages
        });
        break;
        case '3':
         resolve({
          id: '3',
          name: "Global Dev chat",
          messages: messages
        });
        break;
        case '111':
         resolve({
          id: '111',
          name: "Topic chat",
          messages: messages
        });
        break;
      default:
        resolve({
          id: '0',
          name: "Global Default chat",
          messages: messages
        });
      }
    }, 750);
  });
}

export function fetchTopicContent(id) {
  log('+++ Fetching topicContent ' + id);
  // returning a Promise because that is what fetch does.
  return new Promise(function (resolve, reject) {
    // simulate an asynchronous action where data is fetched on
    // a remote server somewhere.
    setTimeout(function () {
      // resolve with some mock data
      resolve('Content for topic ' + id);
    }, 1000);
  });
}

export function fetchTopic(id) {
  log('+++ Fetching topic ' + id);
  // returning a Promise because that is what fetch does.
  return new Promise(function (resolve, reject) {
    // simulate an asynchronous action where data is fetched on
    // a remote server somewhere.
    setTimeout(function () {
      // resolve with some mock data
      resolve(
        {
          id: 'handle-111',
          title: "topicByHandle ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
          author: "Cicero",
          description: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
          picture: "",
          timestamp:"a long time",
          content: "topicByHandle topicByHandle topicByHandle topicByHandle",
          chatId: '111'
        }
      );
    }, 250);
  });
}

// Obso
/*export function fetchUniverseByName(universeName) {
  log('+++ Fetching universeByName ' + universeName);
  // returning a Promise because that is what fetch does.
  return new Promise(function (resolve, reject) {
    // simulate an asynchronous action where data is fetched on
    // a remote server somewhere.
    setTimeout(function () {
      // resolve with some mock data
      switch (universeName) {
        case "Startups":
         resolve({
          id: '1',
          chatId: '1',
          name: "Startups",
          descriptionription: "This is a place where stuff gets done.",
          picture: "/img/pillars_compressed.png",
          handle: "Startups"
        });
        break;
        case "Design":
         resolve({
          id: '2',
          chatId: '2',
          name: "Design",
          descriptionription: "This is a place where stuff gets designed.",
          picture: "/img/designer_compressed.png",
          handle: "Design"
        });
        break;
        case "Dev":
         resolve({
          id: '3',
          chatId: '3',
          name: "Dev",
          descriptionription: "This is a place where stuff gets developped.",
          picture: "/img/forest-compressed.png",
          handle: "Dev"
        });
        break;
      default:
        resolve({
          id: '1',
          chatId: '1',
          name: "Startups",
          descriptionription: "This is a place where stuff gets done.",
          picture: "/img/pillars_compressed.png",
          handle: "Startups"
        });
      }
    }, 250);
  });
}*/

//Obso
/*export function fetchUniverseByHandle(handle) {
  log('+++ Fetching universeByHandle ' + handle);
  // returning a Promise because that is what fetch does.
  return new Promise(function (resolve, reject) {
    // simulate an asynchronous action where data is fetched on
    // a remote server somewhere.
    setTimeout(function () {
      // resolve with some mock data
      switch (handle) {
        case "Startups":
         resolve({
          id: '1',
          chatId: '1',
          name: "Startups",
          descriptionription: "This is a place where stuff gets done.",
          picture: "/img/pillars_compressed.png",
          handle: "Startups"
        });
        break;
        case "Design":
         resolve({
          id: '2',
          chatId: '2',
          name: "Design",
          descriptionription: "This is a place where stuff gets designed.",
          picture: "/img/designer_compressed.png",
          handle: "Design"
        });
        break;
        case "Dev":
         resolve({
          id: '3',
          chatId: '3',
          name: "Dev",
          descriptionription: "This is a place where stuff gets developped.",
          picture: "/img/forest-compressed.png",
          handle: "Dev"
        });
        break;
      default:
        resolve({
          id: '1',
          chatId: '1',
          name: "Startups",
          descriptionription: "This is a place where stuff gets done.",
          picture: "/img/pillars_compressed.png",
          handle: "Startups"
        });
      }
    }, 250);
  });
}*/
