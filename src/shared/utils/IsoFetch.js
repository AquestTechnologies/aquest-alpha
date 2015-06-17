export default class IsoFetch {
  
  constructor() {
    this.messages = (function() {
      let messages = [];
      for (let i = 0; i < 100; i++) {
        messages.push({
          id: i,
          author: "Cicero",
          content: i + " Lorem ipsum dolor sit amet.",
        });
      }
      return messages;
    })();
  } 
  
  universe(universeId) {
    console.log('+++ Fetching universe ' + universeId);
    // returning a Promise because that is what fetch does.
    return new Promise(function (resolve, reject) {
      // simulate an asynchronous action where data is fetched on
      // a remote server somewhere.
      setTimeout(function () {
        // resolve with some mock data
        switch (universeId) {
          case 1:
           resolve({
            id: 1,
            chatId: 1,
            name: "Startups",
            description: "This is a place where stuff gets done.",
            picturePath: "http://130.211.68.244:8080/img/pillars_compressed.png"
          });
          break;
          case 2:
           resolve({
            id: 2,
            chatId: 2,
            name: "Design",
            description: "This is a place where stuff gets designed.",
            picturePath: "http://130.211.68.244:8080/img/designer_compressed.png"
          });
          break;
          case 3:
           resolve({
            id: 3,
            chatId: 3,
            name: "Dev",
            description: "This is a place where stuff gets developped.",
            picturePath: "http://130.211.68.244:8080/img/forest-compressed.png"
          });
          break;
        default:
          resolve({
            id: 1,
            chatId: 1,
            name: "Startups",
            description: "This is a place where stuff gets done.",
            picturePath: "http://130.211.68.244:8080/img/pillars_compressed.png"
          });
        }
      }, 250);
    });
  }
  
  universeByName(universeName) {
    console.log('+++ Fetching universeByName ' + universeName);
    // returning a Promise because that is what fetch does.
    return new Promise(function (resolve, reject) {
      // simulate an asynchronous action where data is fetched on
      // a remote server somewhere.
      setTimeout(function () {
        // resolve with some mock data
        switch (universeName) {
          case "Startups":
           resolve({
            id: 1,
            chatId: 1,
            name: "Startups",
            description: "This is a place where stuff gets done.",
            picturePath: "http://130.211.68.244:8080/img/pillars_compressed.png"
          });
          break;
          case "Design":
           resolve({
            id: 2,
            chatId: 2,
            name: "Design",
            description: "This is a place where stuff gets designed.",
            picturePath: "http://130.211.68.244:8080/img/designer_compressed.png"
          });
          break;
          case "Dev":
           resolve({
            id: 3,
            chatId: 3,
            name: "Dev",
            description: "This is a place where stuff gets developped.",
            picturePath: "http://130.211.68.244:8080/img/forest-compressed.png"
          });
          break;
        default:
          resolve({
            id: 1,
            chatId: 1,
            name: "Startups",
            description: "This is a place where stuff gets done.",
            picturePath: "http://130.211.68.244:8080/img/pillars_compressed.png"
          });
        }
      }, 250);
    });
  }
  
  allUniverses() {
    console.log('+++ Fetching allUniverses');
    // returning a Promise because that is what fetch does.
    return new Promise(function (resolve, reject) {
      // simulate an asynchronous action where data is fetched on
      // a remote server somewhere.
      setTimeout(function () {
        // resolve with some mock data
        resolve([
          {
            id: 1,
            chatId: 1,
            name: "Startups",
            description: "This is a place where stuff gets done.",
            picturePath: "http://130.211.68.244:8080/img/pillars_compressed.png"
          },
          {
            id: 2,
            chatId: 2,
            name: "Design",
            description: "This is a place where stuff gets designed.",
            picturePath: "http://130.211.68.244:8080/img/designer_compressed.png"
          },
          {
            id: 3,
            chatId: 3,
            name: "Dev",
            description: "This is a place where stuff gets developped.",
            picturePath: "http://130.211.68.244:8080/img/forest-compressed.png"
          }
        ]);
      }, 700);
    });
  }
  
  topics(universeId) {
    console.log('+++ Fetching topics for universe ' + universeId);
    
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        let pasCustom = [{
            id: 2,
            title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "",
            timestamp:"a long time",
            handle: '000-handle',
            chatId: 111
          },
          {
            id: 3,
            title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "",
            timestamp:"a long time",
            handle: '000-handle',
            chatId: 111
          },
          {
            id: 4,
            title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "http://130.211.68.244:8080/img/image2.png",
            timestamp:"a long time",
            handle: '000-handle',
            chatId: 111
          },
          {
            id: 5,
            title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "",
            timestamp:"a long time",
            handle: '000-handle',
            chatId: 111
          },
          {
            id: 6,
            title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "",
            timestamp:"a long time",
            handle: '000-handle',
            chatId: 111
          },
          {
            id: 7,
            title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "http://130.211.68.244:8080/img/image1.png",
            timestamp:"a long time",
            handle: '000-handle',
            chatId: 111
          }];
          
        resolve([
          {
            id: 1,
            title: universeId + " ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "http://130.211.68.244:8080/img/image1.png",
            timestamp:"a long time",
            handle: '000-handle',
            chatId: 111
          },
        ].concat(pasCustom));
      }, 750);
    });
  }
  
  chat(chatId) {
    console.log('+++ Fetching chat ' + chatId);
    let messages = this.messages;
    // returning a Promise because that is what fetch does.
    return new Promise(function (resolve, reject) {
      // simulate an asynchronous action where data is fetched on
      // a remote server somewhere.
      setTimeout(function () {
        // resolve with some mock data
        switch (chatId) {
          case 1:
           resolve({
            id: 1,
            name: "Global Startups chat",
            messages: messages
          });
          break;
          case 2:
           resolve({
            id: 2,
            name: "Global Design chat",
            messages: messages
          });
          break;
          case 3:
           resolve({
            id: 3,
            name: "Global Dev chat",
            messages: messages
          });
          break;
          case 111:
           resolve({
            id: 111,
            name: "Topic chat",
            messages: messages
          });
          break;
        default:
          resolve({
            id: 0,
            name: "Global Default chat",
            messages: messages
          });
        }
      }, 750);
    });
  }
  
  topicContent(id) {
    console.log('+++ Fetching topicContent ' + id);
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
  
  topicByHandle(handle) {
    console.log('+++ Fetching topicByHandle ' + handle);
    // returning a Promise because that is what fetch does.
    return new Promise(function (resolve, reject) {
      // simulate an asynchronous action where data is fetched on
      // a remote server somewhere.
      setTimeout(function () {
        // resolve with some mock data
        resolve(
          {
            id: 111,
            title: "topicByHandle ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "",
            timestamp:"a long time",
            handle: handle,
            content: "topicByHandle topicByHandle topicByHandle topicByHandle",
            chatId: 111
          }
        );
      }, 250);
    });
  }
  
}