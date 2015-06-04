import React        from 'react';
import {Route, DefaultRoute, NotFoundRoute } from 'react-router';

import _Universe    from './components/_Universe.jsx';
import _NotFound    from './components/_NotFound.jsx';
import _Explore     from './components/_Explore.jsx';

//Seuls les components layouts (_truc.jsx) peuvent communiquer avec les stores
//Leur state devient alors les props de leurs enfants
//Les composants layouts sont les seuls à être appellés par le routeur.
let routes = (
  <Route name='root' path='/'> 
    <DefaultRoute handler={_Universe} />
    <Route name='home' path='/_:universe' handler={_Universe} />
    <Route name='explore' path='/Explore' handler={_Explore} />
    <NotFoundRoute handler={_NotFound}/>
  </Route>
);

export default routes;