# Aquest alpha

*Rock'n'Roll*

Aquest Technologies © 2015
contact: bonjour@aquest.fr


### Liens utiles :
- [Redux](https://github.com/gaearon/redux)
- [Hapi](http://hapijs.com/api)
- [Emoji](http://www.emoji-cheat-sheet.com)


### En manque d'idées ?

- [ ] Pagination
- [ ] Interdire `null` ?
- [ ] Mesurer le temps entre les actions request et success et l'afficher dans le log
- [ ] loading bar
- [ ] Proptypes pour tous les composants
- [ ] verifier les escapes du state ( < > ' " SQL)
- [ ] verifier les escapes du put ( < > ' " SQL)
- [ ] mettre en place RabbitMQ
- [ ] faire les liens Hapijs <-> webSocket <-> rabbitMQ <-> postgres 
- [ ] liens comme sur [ce site](http://hugogiraudel.com/2014/02/06/calc-css-riddle/)
- [ ] responsive design
- [x] Passer les actions autrement
- [x] mettre en place un outil scrum, exemple : https://github.com/aliasaria/scrumblr
- [x] NextCSS
- [x] Implementer un fichier config (constantes, production, liens du bundle, etc...)
- [x] IsoFetch
- [x] Immutable ?
- [x] changer trucActions par trucsActions
- [x] Implementer Redux 1.0
- [x] Dans les requetes SQL : double quotes : remplace trucid par trucId
- [x] window.STATE\_FROM_SERVER
- [x] chalk --> https://github.com/sindresorhus/chalk
- [x] Correction logTailor


### Convention de nommage des log :
| Préfixe | Signification |
| :-----: | :------------ |
| !!! | erreur |
| ... | App |
| .A. | ActionCreators |
| .R. | Reducers |
| .E. | Side Effects |
| .P. | Phidippides |
| .X. | Authentication |
| +++ | Fetchers |
| _w_ | Websocket |
| .C. | Composants React |
| -C- | Action de l'utilisateur dans composants React |

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
