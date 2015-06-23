# Aquest alpha

*Rock'n'Roll*

Aquest Technologies © 2015

### Liens utiles :
[Redux](https://github.com/gaearon/redux)
[Emoji](http://www.emoji-cheat-sheet.com)

### Todo :
- API
- Iso fetch
- Immutable ?
- Loading bar
- ~~Supprimer tous les async await et remplacer par des promises classiques~~
- ~~Websockets~~
- ~~Flux state from server on client bootstrap~~
- ~~BaseStore et BaseAction~~

### Convention de nommage des log :
| Préfixe | Signification |
| :-----: | :------------ | |
| !!! | erreur |
| ... | App client ou server |
| *** | Phidippides |
| +++ | Fetcher |
| ___ | Websocket |
| .R. | Reducers |
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
