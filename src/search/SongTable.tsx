import React from 'react';
import { Table, } from 'antd';
import { connect } from 'react-redux';
import { getSongList, getSearchParams, getSongCount } from '../selector';
import { getSearch, getDetail } from '../action';
import { StateType, SongItem } from '../type';
import { PlayCircleFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import '../less/search.less';





class SongTable extends React.Component<any, any>{

    render() {
        const columns = [
            {
                title: '歌曲', dataIndex: 'name', key: 'name',

            },
            {
                title: '', dataIndex: 'id', key: 'id',
                render: (id: string | number, record: SongItem) => (
                    /*
                    <Button
                        icon={<PlayCircleFilled />}
                        onClick={() => {
                            window.open(`http://localhost:3000/play/${id}`);
                            this.props.getDetail({
                                id,
                                vendor: this.props.search_params.vendor
                            })
                        }} />
                        */
                    <Link to={`/play/${id}/${this.props.search_params.vendor}`}>
                        <PlayCircleFilled className={
                            classnames('play-link', {
                                'play-link-disabled': record.pay
                            })
                        } />
                    </Link>
                )
            },
            {
                title: '歌手', dataIndex: 'artists', key: 'artist',
                ellipsis: true, className: 'search-table-artists',
                render: (artists: [{ id: string | number, name: string }]) => (
                    <>
                        {
                            artists.map((artist, index) => {
                                if (index < artists.length - 1) {
                                    return (<><a key={artist.id}>{artist.name}</a>/</>)
                                } else {
                                    return (<a key={artist.id}>{artist.name}</a>)
                                }
                            })
                        }</>
                )
            },
            {
                title: '专辑', dataIndex: 'album', key: 'album',
                ellipsis: true, className: 'search-table-album',
                render: (album: { id: string | number, name: string }) => (
                    <a>{album.name}</a>
                )
            }

        ];
        /*
                if (this.props.isFetching) {
                    return (
                        <Spin tip='loading' />
                    )
                }
                */
        return (
            <Table className='search-table'
                columns={columns}
                dataSource={this.props.items}
                pagination={{
                    total: this.props.songCount,
                    /**
                     * 保持当前页面数与请求的一致，
                     * 否则切换数据来源不会回到首页
                     */
                    current: this.props.search_params.offset || 1,
                    showSizeChanger: false,
                    onChange: (page, pageSize) => {
                        this.props.getSearch(
                            Object.assign({}, this.props.search_params, { offset: page, limit: pageSize })

                        )
                    }
                }}

                loading={this.props.isFetching} />
        )
    }
}

export default connect(
    (state: StateType) => ({
        items: getSongList(state),
        search_params: getSearchParams(state),
        songCount: getSongCount(state),
        isFetching: state.search_items.isFetching
    }),
    { getSearch, getDetail })
    (SongTable)