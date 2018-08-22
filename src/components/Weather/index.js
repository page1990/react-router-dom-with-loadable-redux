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