export default function phidippides(routerState, flux) {

  // Configuration
  const PLACEHOLDER = '__dependency.'; // Le placeholder pour les arguments des actions
  const VERBOSE = false;               // Affiche les console.log
  
  
  function logMeOrNot(message) {
    if (VERBOSE === true) console.log(message);
  }
  
  
  // Vérifie l'intégrité du markup des handlers
  function checkFormat(tasks) {
    let result = false;
    tasks.forEach(function(task) {
      if (task.hasOwnProperty('taskName') && task.hasOwnProperty('dependency') && task.hasOwnProperty('shouldBePresent') && task.hasOwnProperty('ifNot')) {
        let s = task.shouldBePresent;
        let i = task.ifNot;
        if (s.hasOwnProperty('store') && s.hasOwnProperty('data') && s.hasOwnProperty('shouldHaveValue') && i.hasOwnProperty('actions') && i.hasOwnProperty('creator') && i.hasOwnProperty('args')) {
          result = true;
        }
      }
    });
    if (result === false) logMeOrNot('*** ERROR ! Please check task format in component.');
    return result;
  }


  // Vérifie la présence de data dans store
  function checkPresence({store, data}) {
    return flux._stores[store].state[data] ? true : false;
  }
  
  
  // Vérifie que data de store possède la valeur demandée
  function checkValue({store, data, shouldHaveValue}) {
    if (shouldHaveValue === null ) return true;
    
    let whatToCheck = flux._stores[store].state[data];
    // Si shouldHaveValue est un object on vérifie que whatToCheck est identique
    if (shouldHaveValue instanceof Object) {
      for(let key in shouldHaveValue) {
        if (whatToCheck[key] === undefined) {
          return false;
        } else if (whatToCheck[key] !== shouldHaveValue[key]) {
          return false;
        }
      }
    // Sinon shouldHaveValue n'est pas un objet et on vérifie qu'il soit identique à shouldHaveValue
    } else {
      if (whatToCheck !== shouldHaveValue) return false;
    }
    return true;
  }
  
  
  // Parcours completedTask pour déterminer si une depndance est terminée
  function checkIfDependancyIsCompleted(dependency) {
    if (dependency === null) return true;
    
    let result = false;
    completedTasks.forEach(function(completedTask) {
      if (completedTask.task.taskName === dependency) result = true;
    });
    return result;
  }
  
  
  // Appel l'action associée à une task
  function callAction(task) {
    logMeOrNot('*** callAction ' + task.taskName + ' args are ' + task.ifNot.args);
    
    let {actions, creator, args} = task.ifNot;
    let a = flux.getActions(actions);
    let realArgs = [];
    
    // Traitement des arguments
    args.forEach(function(arg) {
      logMeOrNot('*** callAction processing arg ' + arg);
      // Si un argument ne possède pas PLACEHOLDER alors il est assimilable tel quel
      if (typeof arg !== 'string' || arg.search(PLACEHOLDER) === -1) {
        realArgs.push(arg);
      // Sinon il faut le traiter
      } else {
        logMeOrNot('*** callAction \'' + PLACEHOLDER + '\' found in arg ' + arg);
        // On ne garde que la partie sans PLACEHOLDER
        let attributeString = arg.replace(PLACEHOLDER, '');
        // Puis l'argument est potentiellement nesté (exemple : truc.machin.chose.id) 
        // Donc pour chaque niveau de nesting on extrait l'info utile avec la boucle A
        let attributes = attributeString.split('.');
        let realArg;
        // On compare cherche parmis les taches complétées la dependance de la tache actuelle
        completedTasks.forEach(function(completedTask) {
          if (completedTask.task.taskName === task.dependency) {
            // Quand on l'a trouvée on recupère le résultat de la tache pour le passer en argument à l'action
            let temp = completedTask.result;
            // Boucle A
            for (let i = 0, l = attributes.length; i < l; i++) {
              temp = temp[attributes[i]];
            }
            realArg = temp;
          }
        });
        logMeOrNot('*** callAction realArg is ' + realArg);
        realArgs.push(realArg);
      }
    });
    logMeOrNot('*** callAction real args are ' + realArgs);
    return new Promise(function(resolve, reject) {
      // Appel de l'action
      a[creator].apply(null, realArgs).then(function(data) {
        logMeOrNot('*** callAction exiting Promise ' + data);
        resolve(data);
      });
    });
  }
  
  
  // Complete une tache
  function clearOneTask(task) {
    logMeOrNot('*** clearOneTask ' + task.taskName);
    logMeOrNot(JSON.stringify(task));
    
    return new Promise(function(resolve, reject) {
      
      if (checkPresence(task.shouldBePresent)) { // Si la donnée est présente
        if (checkValue(task.shouldBePresent)) { // Si la donnée possède la bonne valeure
          logMeOrNot('*** clearOneTask ' + task.taskName + ' OK [present > correct value]');
          completedTasks.push({task: task, result: null});
          resolve();
        } else { // Si la donnée ne possède pas la bonne valeure
          if (checkIfDependancyIsCompleted(task.dependency)) { // Si la dépendances est résolue
            callAction(task).then(function(data) {
              completedTasks.push({task: task, result: data});
              logMeOrNot('*** clearOneTask ' + task.taskName + ' OK [present > wrong value > dependency complete]');
              resolve();
            });
          } else { // Si la dépendance n'est pas résolue
            failedTasks.push(task);
            logMeOrNot('*** clearOneTask ' + task.taskName + ' FAILED [present > wrong value > dependency failed]');
            resolve();
          }
        }
      } else { // Si la donnée est absente
        if (checkIfDependancyIsCompleted(task.dependency)) { // Si la dépendances est résolue
          callAction(task).then(function(data) {
            completedTasks.push({task: task, result: data});
            logMeOrNot('*** clearOneTask ' + task.taskName + ' OK [missing > dependency complete]');
            resolve();
          });
        } else { // Si la dépendance n'est pas résolue
          failedTasks.push(task);
          logMeOrNot('*** clearOneTask ' + task.taskName + ' FAILED [missing > dependency failed]');
          resolve();
        }
      }
    });
  }
  
  
  // Complete toutes les taches
  function clearTasks(tasks) {
    logMeOrNot('*** clearTasks ' + tasks);
    failedTasks = [];
    return new Promise(function(resolve, reject) {
      
      // Peuple la liste des taches (promises) à accomplir
      let waitForUs = [];
      for (let i=0, l=tasks.length; i<l; i++) {
        waitForUs.push(clearOneTask(tasks[i]));
      }
      // Attend que toutes les taches soient résolues
      Promise.all(waitForUs).then(function() {
        // Lorsque c'est le cas
        logMeOrNot('*** END');
        logMeOrNot('*** failedTasks ' + failedTasks);
        logMeOrNot('*** completedTasks ' + completedTasks);
        // Si aucune tache n'a échoué c'est terminé
        if (failedTasks.length === 0) {
          resolve();
        // Sinon on rappel les taches échouées (possible boucle infinie ici)
        } else {
          clearTasks(failedTasks).then(function() {
            resolve();
          });
        }
      });
    });
  }
    
  let whatToFetch = []; // Les taches à effectuer
  let completedTasks = []; // Les taches terminée
  let failedTasks = []; // Les taches non terminées car il manque les dépendances
  let displayOnConsole = []; // Permet d'afficher les taches à effectuer sur la console
  
  // Appel de runPhidippides dans chaque handler
  let runPhidippides = routerState.routes
  .map(route => route.handler['runPhidippides'])
  .filter(method => typeof method === 'function')
  .map(method => method(routerState))
  .filter(handlerReturn => handlerReturn instanceof Array);
  
  // Extraction des taches vers whatToFetch
  runPhidippides.forEach(function(handlerReturn) {
    handlerReturn.forEach(function(somethingToFetch) {
      whatToFetch.push(somethingToFetch);
    });
  });
  
  if (!checkFormat(whatToFetch)) return Promise.reject('*** Error, invalid markup found.');
  
  // Mieux vaut le faire après checkFormat
  whatToFetch.forEach(function(task) {
    displayOnConsole.push(task.taskName);
  });
  
  let howMany = whatToFetch.length;
  let speakEnglish = howMany > 1 ? ' tasks : ' : ' task : ';
  console.log('*** Resolving ' + howMany + speakEnglish + displayOnConsole.toString());
  
  return clearTasks(whatToFetch);
}
