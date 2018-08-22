import React from 'react'
import { connect } from 'react-redux'

import * as Status from './status'

const Weather = ({ status, city, weather, temp1, temp2 }) => {
	switch(status) {
		case Status.LOADING:
			return <div>天气信息请求中...</div>
		case Status.SUCCESS:
			return (
				<div>
					{city} {weather} 最低气温 {temp1} 最高气温 {temp2}
				</div>
			)
		case Status.FAILURE:
			return <div>天气信息加载失败</div>
		default:
			return <div>天气组件加载中</div>
	}
}

const mapState = (state) => {
	const weatherData = state.weather

	return {
		status: weatherData.status,
		city: weatherData.city,
		weather: weatherData.weather,
		temp1: weatherData.temp1,
		temp2: weatherData.temp2
	}
}

export default connect(mapState)(Weather)