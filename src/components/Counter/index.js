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
