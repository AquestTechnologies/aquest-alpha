# aquest-alpha

Rock'n'Roll

Aquest Technologies © 2015

ça vaut le coup de 'use strict' ? https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Strict_mode

## Todo :
- ~~Base store~~ + loading bar
- Iso fetch
- Immutable
- ~~Websockets~~
- API
- Supprimer tous les async await et remplacer par des promises classiques
- ~~Flux state from server on client bootstrap~~
- Enlever this.state = {}; dans les stores ?

## Optimisation possible : 
- Serialisation des données en provenance de l'API https://github.com/gaearon/normalizr
- Pure rendering (performance) https://github.com/gaearon/react-pure-render

## Convention de nommage des console.log :
- !!! erreur
- ... App client ou index server
- +++ Fetcher
- ___ Websocket
- .S. Stores
- .A. Actions
- .c. Composant React
- -c- action utilisateur dans composant React