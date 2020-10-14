import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, IndexRoute, browserHistory} from 'react-router';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'


import reducer from './pages/reducers';
import App from './App';
import InvitationCard from './pages/invitation/InvitationCard';
import AdminList from './pages/admin/AdminList';
import NewAdminView from './pages/admin/NewAdminView';

let rootElement = document.getElementById('root');

const history = createHistory();
const middleware = routerMiddleware(history);

const logger = createLogger();

const store = createStore(
  combineReducers({
    reducer,
    router: routerReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk, promise, logger)
)

// ReactDOM.render(<App/>, rootElement);
render(
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      <div>
        <Route exact={true} path="/admin" component={AdminList} />
        <Route path="/admin/p/:page" component={AdminList} />
        <Route exact={true} path="/admin/view" component={NewAdminView} />
        <Route exact={true} path="/admin/view/:doc_id" component={NewAdminView} />
        <Route path="/card/:card_id" component={InvitationCard} />
      </div>
    </ConnectedRouter>
  </Provider>,
  rootElement
);
