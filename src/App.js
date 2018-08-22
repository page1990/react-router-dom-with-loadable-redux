import React from 'react'
import Loadable from 'react-loadable'
import { Link, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import { ConnectedRouter } from 'connected-react-router'
import { history } from './Store'
// import createBrowserHistory from 'history/createBrowserHistory'

import Dashboard from './components/Dashboard'

import store from './Store'

// const history = createBrowserHistory()

const liStyle = {
  display: 'inline-block',
  margin: '10px 20px'
}

function Loading({ error }) {
  if (error) {
    console.log(error)
    return 'Oh nooess!';
  } else {
    return <h3>Loading...</h3>;
  }
}

const Settings = Loadable({
  loader: () => import('./components/Settings'),
  loading: Loading
});

const AddUser = Loadable({
  loader: () => import('./components/AddUser'),
  loading: Loading
});

const Counter = Loadable({
  loader: () => import('./components/Counter'),
  loading: Loading
})

const Weather = Loadable({
  loader: () => import('./components/Weather'),
  loading: Loading
})


const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <ul>
          <li style={liStyle}><Link to="/">Dashboard</Link></li>
          <li style={liStyle}><Link to="/settings">Settings</Link></li>
          <li style={liStyle}><Link to="/add-user">Add User</Link></li>
          <li style={liStyle}><Link to="/counter">Counter</Link></li>
          <li style={liStyle}><Link to="/weather">Weather</Link></li>
        </ul>
        <Route exact path="/" component={Dashboard} />
        <Route path="/settings" component={Settings} />
        <Route path="/add-user" component={AddUser} />
        <Route path="/counter" component={Counter} />
        <Route path="/weather" component={Weather} />
      </div>
    </ConnectedRouter>
  </Provider>
)

export default App