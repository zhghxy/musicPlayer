/** @format */
import { StateType, SongItem } from "./type";
export const getSongList = (state: StateType) => {
	if (state.search_items && state.search_items.items)
		return state.search_items.items;
	return [];
};

export const getSearchParams = (state: StateType) => {
	if (state.search_items && state.search_items.params)
		return state.search_items.params;
	return {};
};

export const getSongCount = (state: StateType) => {
	if (state.search_items && state.search_items.songCount) {
		return state.search_items.songCount;
	}
	return 0;
};
