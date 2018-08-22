import { FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE } from '../constants'
import * as STATUS from './status'

export default (state = {status: STATUS.LOADING}, action) => {
	switch(action.type) {
		case FETCH_STARTED:
			return {status: STATUS.LOADING}
		case FETCH_SUCCESS:
			return {status: STATUS.SUCCESS, ...action.result}
		case FETCH_FAILURE:
			return {status: STATUS.FAILURE}
		default:
			return state
	}
}