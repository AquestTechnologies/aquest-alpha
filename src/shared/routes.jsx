import React        from 'react';
import Router       from 'react-router';  

import _App          from './components/_App.jsx';
import _Universe     from './components/_Universe.jsx';
import _NotFound     from './components/_NotFound.jsx';
import _Explore      from './components/_Explore.jsx';

var Route           = Router.Route;
var DefaultRoute    = Router.DefaultRoute;
var NotFoundRoute   = Router.NotFoundRoute;

//Seuls les components layouts (_truc.jsx) peuvent communiquer avec les stores
//Leur state devient alors les props de leurs enfants
//Les composants layouts sont les seuls à être appellés par le routeur.
var routes = (
  <Route path='/' handler={_App}>
    <DefaultRoute handler={_Universe} />
    <Route name='home' path='/_:universe' handler={_Universe} />
    <Route name='explore' path='/Explore' handler={_Explore} />
    <NotFoundRoute handler={_NotFound}/>
  </Route>
);

export default routes;