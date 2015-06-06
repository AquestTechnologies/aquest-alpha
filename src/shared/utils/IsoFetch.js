export default class IsoFetch {
  
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
            name: "Startups",
            description: "This is a place where stuff gets done."
          });
          break;
          case 2:
           resolve({
            id: 2,
            name: "Design",
            description: "This is a place where stuff gets designed."
          });
          break;
          case 3:
           resolve({
            id: 3,
            name: "Dev",
            description: "This is a place where stuff gets developped."
          });
          break;
        default:
          resolve({
            id: 1,
            name: "Startups",
            description: "This is a place where stuff gets done."
          });
        }
      }, 250);
    });
  }
  startUniverse() {
    console.log('+++ Fetching startUniverse');
    // returning a Promise because that is what fetch does.
    return new Promise(function (resolve, reject) {
      // simulate an asynchronous action where data is fetched on
      // a remote server somewhere.
      setTimeout(function () {
        // resolve with some mock data
        resolve({
          id: 1,
          name: "Startups",
          description: "This is a place where stuff gets done."
        });
      }, 700);
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
            name: "Startups",
            description: "This is a place where stuff gets done."
          },
          {
            id: 2,
            name: "Design",
            description: "This is a place where stuff gets designed."
          },
          {
            id: 3,
            name: "Dev",
            description: "This is a place where stuff gets developped."
          }
        ]);
      }, 700);
    });
  }
  
  currentTopics(universeId) {
    console.log('+++ Fetching currentTopics for universe ' + universeId);
    
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve([
          {
            id: 1,
            title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "img/image1.png",
            timestamp:"a long time"
          },
          {
            id: 2,
            title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "",
            timestamp:"a long time"
          },
          {
            id: 3,
            title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "",
            timestamp:"a long time"
          },
          {
            id: 4,
            title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "img/image2.png",
            timestamp:"a long time"
          },
          {
            id: 5,
            title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "",
            timestamp:"a long time"
          },
          {
            id: 6,
            title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "",
            timestamp:"a long time"
          },
          {
            id: 7,
            title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
            author: "Cicero",
            desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
            imgPath: "img/image1.png",
            timestamp:"a long time"
          }
        ]);
      }, 700);
    });
  }
}