# Aquest alpha

*Rock'n'Roll*

Aquest Technologies © 2015

### Liens utiles :
- [Redux](https://github.com/gaearon/redux)
- [Hapi](http://hapijs.com/api)
- [Emoji](http://www.emoji-cheat-sheet.com)


### ToDoList 23/06 --> 26/06
              
- [ ] IsoFetch
- [ ] Dans la DB : remplace trucid par trucId
- [x] Correction logTailor
- [ ] window.STATE\_FROM_SERVER
- [ ] chalk --> https://github.com/sindresorhus/chalk
- [ ] loading bar
- [ ] Immutable ?
- [ ] Implementer Redux 1.0
- [ ] Implementer un fichier config (constantes, production, liens du bundle, etc...)
- [ ] verifier les escapes du state ( < > ' " SQL)
- [ ] verifier les escapes du put ( < > ' " SQL)
- [ ] mettre en place un outil scrum, exemple : https://github.com/aliasaria/scrumblr
- [ ] mettre en place RabbitMQ
- [ ] faire les liens Hapijs <-> webSocket <-> rabbitMQ <-> postgres 


### Convention de nommage des log :
| Préfixe | Signification |
| :-----: | :------------ | |
| !!! | erreur |
| ... | App client ou server |
| *** | Phidippides |
| +++ | Fetchers |
| ___ | Websocket |
| .R. | Reducers |
| .A. | ActionCreators |
| .c. | Composants React |
| -c- | Action de l'utilisateur dans composants React |

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
- 
