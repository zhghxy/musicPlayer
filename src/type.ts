/** @format */

export interface SearchParams {
	keywords: string;
	vendor?: number; //来源
	limit?: number; //获取的个数
	offset?: number; //偏移页数
}

export interface SongItem {
	id: string | number;
	name: string;
	pay: boolean;
	artists: Array<{
		id: string | number;
		name: string;
	}>;
	album: Array<{
		id: string | number;
		name: string;
	}>;
}

export interface DetailParams {
	id: string | number;
	vendor?: number;
}

export interface SongDetail {
	id: string | number;
	url: string;
	musicUrl: [string];
	name: string;
	album: { id: string | number; name: string; imgUrl: string };
	artists: [
		{
			id: string | number;
			name: string;
		}
	];
	lyric: [
		{
			time: number;
			txt: string;
		}
	];
}

export interface StateType {
	search_items: {
		isFetching?: boolean;
		error?: boolean;
		items?: [SongItem] | [];
		songCount?: number;
		params?: SearchParams;
	};
	song_items: {
		isFetching?: boolean;
		error?: boolean;
		items?: SongDetail | null;
		params?: DetailParams;
	};
}
