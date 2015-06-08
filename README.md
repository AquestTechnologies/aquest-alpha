# Aquest alpha

*Rock'n'Roll*

Aquest Technologies © 2015

ça vaut le coup de 'use strict' ? https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Strict_mode

### Todo :
- API
- Iso fetch
- Immutable
- Loading bar
- Supprimer tous les async await et remplacer par des promises classiques
- Enlever `this.state = {};` dans les stores ?
- Empecher que FluxComponent fasse des get* lorsque isLoading change ou lorsque le router s'apprete à render
- FluxComponent refetch tout le state flux a chaque changement dans les stores. Il faudrait qu'il ne fetch que celui qui a changé
- L'implementation actuelle de IsoFetch cree une instance de la classe par Action, l'instance devrait être partagée.
- ~~Websockets~~
- ~~Flux state from server on client bootstrap~~
- ~~BaseStore et BaseAction~~

### Optimisations possibles : 
- Serialisation des données en provenance de l'API https://github.com/gaearon/normalizr
- Pure rendering (performance) https://github.com/gaearon/react-pure-render

### Convention de nommage des console.log :
| Préfixe | Signification |
| :-----: | :------------ | |
| !!! | erreur |
| ... | App client ou index server |
| +++ | Fetcher |
| ___ | Websocket |
| .S. | Stores |
| .A. | Actions |
| .c. | Composant React |
| -c- | Action de l'utilisateur dans composant React |

### Informations sur la base de données
- Groupe administrateur : admin, Utilisateur : aquest
- Groupe Utilisateur : users, Utilisateur : aquestuser
- Base de données : aquestdb

### Créer la base de données
- cd /home/aquest/createDB
- psql posgres < create_aquestdb.sql  (l'idéale serai un seul fichier, j'y travaille)
- psql aquestdb < create_tables.sql

### Visualiser les tables de la base de données
- psql aquestdb
- \dt aquest_schema.*
