/** @format */

import { combineReducers } from "redux";
import {
	REQUEST_SEARCH,
	RECEIVE_SEARCH,
	ERROR_SEARCH,
	REQUEST_DETAIL,
	RECEIVE_DETAIL,
	ERROR_DETAIL,
} from "./action";

import { StateType } from "./type";

function getData(
	state: StateType = {
		search_items: { isFetching: false, error: false, items: [] },
		song_items: { isFetching: false, error: false },
	},
	action: any
): StateType {
	let new_search_items;
	switch (action.type) {
		case REQUEST_SEARCH:
			new_search_items = {
				...state.search_items,
				isFetching: true,
				params: action.params,
			};
			return {
				...state,
				search_items: new_search_items,
			};
		case REQUEST_DETAIL:
			return {
				...state,
				song_items: {
					isFetching: true,
					params: action.params,
				},
			};
		case ERROR_SEARCH:
			return {
				...state,
				search_items: {
					error: true,
				},
			};
		case ERROR_DETAIL:
			return {
				...state,
				song_items: {
					error: true,
				},
			};
		case RECEIVE_SEARCH:
			new_search_items = {
				...state.search_items,
				isFetching: false,
				error: false,
				items: action.data.songs,
				songCount: action.data.songCount,
			};
			return {
				...state,
				search_items: new_search_items,
			};
		case RECEIVE_DETAIL:
			return {
				...state,
				song_items: {
					isFetching: false,
					error: false,
					items: action.data,
				},
			};
		default:
			return state;
	}
}

export default getData;
