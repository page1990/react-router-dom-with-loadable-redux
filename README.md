react关于实现SPA和code-splitting的一些总结
================

`react`学习了也很有一阵子了，从之前最简单的`react`应用，到使用`redux`管理状态，然后使用`中间件`和`storeEnhancer`，接着学习了`react-router`，从v3版本到v4版本的变化，以及使用`react-loadable`来进行**异步加载**。到这里，`code-splitting`就基本完成。

但是，接下来的又要考虑一个非常重要的问题，每个页面的使用的`reducer`和`state`都是不同的，比如我刚开始有一个页面A，他有自己的`reducer`和`state`，我也有另外一个页面B，他也有自己的`reducer`和`state`。接下来要处理的问题就是，当我访问页面A，需要对`store`进行`replceReducer`的操作，然后初始化页面A的`state`。当访问页面B的时候，也要对store进行`replaceReducer`的操作，然后重新初始化页面B的`state`。

还有一个问题，就是如果我们有一些公共的`reducer`，比如路由`router`，这个是`connected-react-router`提供的，在页面A和页面B都需要，应该如何处理呢？

### 最终想要实现的效果

我们最终想要实现的效果应该是这个样子的: 有一个类似于导航栏的链接，上面有几个链接指向不同的页面，每个页面都有自己的内容，并且有些页面还有自己的`state`和`reducer`，当然，这些都是需要同`redux`结合起来的。

最终效果图如下：

![image](https://ws1.sinaimg.cn/large/005B3DIrgy1fui8ptuas2j30jz068746.jpg)

![image](https://ws1.sinaimg.cn/large/005B3DIrgy1fui8qd5bifj30mu087gli.jpg)

![image](https://ws1.sinaimg.cn/large/005B3DIrgy1fui8r6ftivj30nv072dfs.jpg)



其中，**Couter**和**Weather**的页面有自己的`state`和`reducer`，并且**Weather**页面使用了api去**中国天气网**获取一些城市的天气信息。关于这两个页面，其实之前的例子都有，这里不会着重讲解，我们要讲解的关键是关于**code-splitting**

### Store

这里使用到了`connected-react-router`和`history`并结合`redux-devtools`进行时光旅行

`vim src/Store.js`

```
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import createBrowserHistory from 'history/createBrowserHistory'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'

import resetEnhancer from './enhancer/reset'

const history = createBrowserHistory()

const reducer = combineReducers({
})

const middlewares = [routerMiddleware(history), thunk]

const win = window
const storeEnhancers = compose(
	resetEnhancer,
	applyMiddleware(...middlewares),
	(win && win.devToolsExtension) ? win.devToolsExtension() : (f) => f,
)

const initialState = {}

// console.log('in init store.js')
const store =  createStore(connectRouter(history)(reducer), initialState, storeEnhancers)
export default store

export { history }
```

我们使用了一个`resetEnhancer`的store增强器，这个增强器的作用就是用来重置`state`和`replaceReducer`的

### resetEnhancer

`vim src/enhancer/reset.js`

```
import { history } from '../Store'
import { connectRouter } from 'connected-react-router'

const RESET_ACTION_TYPE = '@@RESET'

const resetReducerCreator = (reducer, resetState) => (state, action) => {
	if (action.type === RESET_ACTION_TYPE) {
		return resetState
	}
	return reducer(state, action)
}

const reset = (createStore) => (reducer, preloadedState, enhancer) => {
	const store = createStore(reducer, preloadedState, enhancer)

	const reset = (resetReducer, resetState) => {
		const newReducer = resetReducerCreator(resetReducer, resetState)
		store.replaceReducer(connectRouter(history)(newReducer))
		store.dispatch({type: RESET_ACTION_TYPE, state: resetState})
	}

	return {
		...store,
		reset
	}
}

export default reset
```

在`replaceReducer`的函数中，我们使用到了`connected-react-router`提供的API，这里是一个需要注意的地方

### Counter

`vim src/components/Counter/index.js`

```
import React from 'react'
import reducer from './reducer.js'
import Counter, { stateKey } from './page.js'
import store from '../../Store.js'
import { combineReducers } from 'redux'

const initialState = 20

const routerCounter = () => {
	const state = store.getState()
	store.reset(combineReducers({
    counter: reducer
  }), {
    ...state,
    [stateKey]: initialState
  })

	return (
		<div>
			<div>Counter</div>
			<Counter />
		</div>
	)
}

export default routerCounter

```

在返回`Counter`组件之前，我们使用`store.reset`来重置，这里是很关键的地方

### Weather

`vim src/components/Weather/index.js`

```
import React from 'react'
import weatherReducers from './weather/reducers'
import Weather from './weather/views'
import CitySelector from './city_selector'
import store from '../../Store.js'
import { combineReducers } from 'redux'

const initState = {}

const stateKey = 'weather'

const routeWeather = () => {
	const state = store.getState()
	store.reset(combineReducers({
    [stateKey]: weatherReducers
  }), {
    ...state,
    [stateKey]: initState
  })

  return (
  	<div>
  		<CitySelector />
  		<Weather />
  	</div>
  )
}

export default routeWeather
```

### Router
使用`react-router` **v4**来做路由控制

`vim src/App.js`

```
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
```
