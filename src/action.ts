/** @format */

import { Dispatch } from "redux";
import { SearchParams, SongItem, DetailParams, SongDetail } from "./type";

const axios = require("axios");
export const REQUEST_SEARCH = "REQUEST_SEARCH";
export const RECEIVE_SEARCH = "RECEIVE_SEARCH";
export const ERROR_SEARCH = "ERROR_SEARCH";
export const REQUEST_DETAIL = "REQUEST_DETAIL";
export const RECEIVE_DETAIL = "RECEIVE_DETAIL";
export const ERROR_DETAIL = "ERROR_DETAIL";

function requestSearch(params: SearchParams) {
	return {
		type: REQUEST_SEARCH,
		params,
	};
}

function receiveSearch(data: Array<SongItem>) {
	return {
		type: RECEIVE_SEARCH,
		data,
	};
}

function errorSearch(error: Error) {
	return {
		type: ERROR_SEARCH,
		error,
	};
}

export function getSearch(params: SearchParams) {
	return (dispatch: Dispatch) => {
		dispatch(requestSearch(params));
		return axios
			.get("http://localhost:3200/getSearch", { params })
			.then((response: any) => {
				const data = response.data.result;
				dispatch(receiveSearch(data));
			})
			.catch((error: Error) => {
				dispatch(errorSearch(error));
			});
	};
}

function requestDetail(params: DetailParams) {
	return {
		type: REQUEST_DETAIL,
		params,
	};
}

function receiveDetail(data: SongDetail) {
	return {
		type: RECEIVE_DETAIL,
		data,
	};
}

function errorDetail(error: Error) {
	return {
		type: ERROR_DETAIL,
		error,
	};
}

export function getDetail(params: DetailParams) {
	return (dispatch: Dispatch) => {
		dispatch(requestDetail(params));
		return axios
			.get("http://localhost:3200/songInfo", { params })
			.then((response: any) => {
				const data = response.data.result;
				dispatch(receiveDetail(data));
			})
			.catch((error: Error) => {
				dispatch(errorDetail(error));
			});
	};
}
