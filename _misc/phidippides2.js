export default function phidippides(routerState, fluxState, dispatch) {
  return Promise.all(routerState.routes
    .map(route => route.handler['runPhidippides'])
    .filter(method => typeof method === 'function')
    .map(method => method(routerState, fluxState, dispatch))
  );
}