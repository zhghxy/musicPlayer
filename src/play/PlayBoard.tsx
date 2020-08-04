import React, { createRef, RefObject } from 'react';
import classnames from 'classnames';
import { Tooltip, Button, Spin, Layout } from 'antd';
import { PlayCircleFilled, PauseCircleFilled } from '@ant-design/icons';
import { connect } from 'react-redux';
import { StateType } from '../type';
import { getDetail } from '../action';
import { useParams } from 'react-router-dom'
import '../less/play.less';

/*
function useTimer(count: number, interval: number = 500) {
    const [timeValue, setTime] = useState(count);

    useEffect(() => {
        const clearTime = setTimeout(() => setTime(timeValue + interval), interval);
        return () => clearTimeout(clearTime)
    })

    return timeValue;
}
*/

const LyricProgress: React.FC<any> = props => {
    const { lyric, currentValue } = props;
    let currentLine = 0;
    // const currentTime = useTimer(props.currentTime);
    for (let i = 0; i < lyric.length; i++) {
        if (lyric[i].time <= currentValue) {
            currentLine = i;
        }
    }
    const lyricArr = lyric.map(
        (el: { time: number, txt: string }, index: number) =>
            (<li
                key={el.time}
                className={classnames({ 'lyric-active': index === currentLine })
                }>{el.txt}</li>)
    );
    const topOffset = -25 * (currentLine > 3 ? currentLine - 3 : 0);
    return (
        <div className="lyric-container">
            <ul style={{ top: `${topOffset}px`, position: "absolute" }}>
                {lyricArr}
            </ul>
        </div>
    )

}
const formatter = (seconds: number /*毫秒*/) => {
    const formatNumber = (num: number, n: number) => {
        return (Array(n).join('0') + num).slice(-n);
    }
    seconds = Math.floor(seconds / 1000);
    let minute = formatNumber(Math.floor(seconds / 60), 2);
    let second = formatNumber(Math.round(seconds % 60), 2);
    return `${minute}:${second}`;
}


const computeLeft = (el: HTMLElement | null) => {
    console.log(el);
    let left = 0;
    while (el) {
        left += el.offsetLeft;
        el = el.offsetParent as HTMLElement | null;
    }

    console.log(left);
    return left;
}

class SongSlider extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            playStatus: false,
            timeValue: 0,//毫秒数
            mouseMove: false,
            moveValue: 0 //偏移长度
        }
        //console.log(props);
        props.getDetail({
            id: props.match.params.id,
            //vendor: props.search_params && props.search_params.vendor || 0
            vendor: props.match.params.vendor || 0
        })

    }
    myAudio!: HTMLAudioElement;
    progressContainer = React.createRef();
    totalLength = 500;
    progressContainerLeft = 50;

    componentDidMount() {
        this.progressContainerLeft = computeLeft(this.progressContainer.current as HTMLDivElement);
        console.log(this.progressContainerLeft)
    }


    setPos = (totalValue: number) => {
        //const { , totalValue } = this.props;
        const { moveValue, mouseMove, timeValue: currentValue } = this.state;

        //console.log(moveValue);
        if (mouseMove) {
            return moveValue / this.totalLength * totalValue;
        } else {
            return currentValue;
        }

    }
    /**
     * @description
     * @author zhghxy
     * @date 2020-07-29
     * @param {number} totalValue
     * @returns 
     * @memberof SongSlider
     */
    renderProgress(totalValue: number) {
        const currentLength = this.setPos(totalValue);
        console.log(this.state);
        /**
         * 避免首次渲染时尚未绑定
         */
        if (this.progressContainer.current)
            /**
             * 要使得拖动时鼠标位于按钮中心，
             * 所以按钮开始中心应于进度条对齐，
             * 否则会出现只能前进不能后退的现象
             */
            this.progressContainerLeft = computeLeft(this.progressContainer.current as HTMLDivElement) + 5;
        return (
            /** 
             * 将mouseMove,mouseUp事件绑定在父元素上，
             * 可使得拖动更容易，不必一直跟着鼠标，
             * 甚至可以绑定到body上
             */

            <div className='progress-btn-container'
                ref={this.progressContainer as RefObject<HTMLDivElement>}
                onMouseMove={
                    (e: React.MouseEvent<HTMLDivElement>) => {
                        if (this.state.mouseMove) {
                            this.setState({
                                /** 
                                 * 跟踪clientX为鼠标的实时位置，
                                 * 此时button的位置尚未改变，
                                 * 跟踪button的OffsetLeft属性无效
                                 */
                                moveValue: e.clientX - this.progressContainerLeft
                            })
                            // console.log('clientX:' + e.clientX);
                        }

                    }
                }
                onMouseUp={
                    (e: React.MouseEvent<HTMLDivElement>) => {
                        this.setState({
                            mouseMove: false,
                            moveValue: e.clientX - this.progressContainerLeft
                        });
                        this.handleMouseDown(
                            (e.clientX - this.progressContainerLeft) / this.totalLength * totalValue);
                    }
                }>
                <progress
                    max={totalValue}
                    value={currentLength}
                />
                <Tooltip
                    title={() => {
                        return formatter(this.state.moveValue / this.totalLength * totalValue)
                    }}
                    trigger={['hover', 'focus']}
                    //arrowPointAtCenter={true}
                    getPopupContainer={() => this.progressContainer.current as HTMLDivElement}
                    overlayStyle={{
                        position: 'absolute',
                        left: `calc(${currentLength / totalValue * 100}% - 19.5px)`
                    }}
                >
                    <button
                        style={{
                            position: 'absolute',
                            left: `calc(${currentLength / totalValue * 100}% )`
                        }}
                        onMouseDown={
                            (e: React.MouseEvent<HTMLButtonElement>) => {
                                console.log(this.progressContainerLeft);
                                this.setState({
                                    mouseMove: true,
                                    moveValue: e.clientX - this.progressContainerLeft
                                })

                            }
                        }
                    /></Tooltip>
            </div>
        )
    }


    handlePlayClick = () => {
        if (this.state.playStatus) {
            this.myAudio.pause();
        } else {
            this.myAudio.play();
        }
        this.setState({
            playStatus: !this.state.playStatus
        })

    }

    startPlay = () => {
        this.myAudio.play();
        this.setState({
            playStatus: true
        })
    }

    pausePlay = () => {
        this.myAudio.pause();
        this.setState({
            playStatus: false
        })
    }
    renderPlayBtn = () => (
        <Button
            shape="circle"
            icon={this.state.playStatus ? <PauseCircleFilled /> : <PlayCircleFilled />}
            onClick={this.handlePlayClick} />
    );

    saveAudio = (el: HTMLAudioElement) => {
        this.myAudio = el
    }

    /*
    saveProgressContainer = (el: HTMLDivElement) => {
        this.progressContainer = el;
    }
    */

    handleMouseDown = (mousePos: number) => {

        this.myAudio.currentTime = mousePos / 1000;
        /**
         * 直接setState使得timeValue在这一轮任务中能改变，
         * 若依赖于audio的ontimeupdate事件，
         * 则该事件中的异步任务会在下一轮执行，
         * 导致需要两次渲染，
         * 出现进度条闪退、闪进的现象
         */
        this.setState({
            timeValue: this.myAudio.currentTime * 1000
        })
    }


    render() {
        if (!this.props.items || this.props.isFetching) {
            return <Spin tip="loading" />
        }
        const { lyric, album, artists, musicUrl, name } = this.props.items;
        let totalValue = lyric[lyric.length - 1].time;
        if (this.myAudio && this.myAudio.duration) {
            totalValue = this.myAudio.duration * 1000;
        }
        const renderArtists = artists.map((artist: { id: number | string, name: string }, index: number) => {
            if (index < artists.length - 1) {
                return (<><a key={artist.id}>{artist.name}</a>/</>)
            } else {
                return (<a key={artist.id}>{artist.name}</a>)
            }
        })

        return (
            <Layout>
                <Layout.Content className="detail-content">
                    <div className="img-container">
                        <img src={album.imgUrl} />
                    </div>
                    <div className="detail-container">
                        <h1>{name}</h1>
                        <h3>专辑：<a>{album.name}</a></h3>
                        <h3>歌手：{renderArtists}</h3>

                        <LyricProgress
                            lyric={lyric}
                            currentValue={this.state.timeValue} />
                    </div>
                </Layout.Content>
                <Layout.Footer className="play-control">
                    {this.renderPlayBtn()}
                    {this.renderProgress(totalValue)}
                    <span>
                        {`${formatter(this.state.timeValue)}/${formatter(totalValue)}`}
                    </span>
                </Layout.Footer>
                <audio
                    ref={this.saveAudio}
                    onCanPlay={this.startPlay}
                    onTimeUpdate={() => {
                        this.setState({ timeValue: this.myAudio.currentTime * 1000 })
                    }}
                    onWaiting={this.pausePlay}
                    onEnded={() => this.setState({ playStatus: false })}
                >
                    {
                        musicUrl.map((url: string) => (
                            <source src={url} type="audio/mpeg" />
                        ))
                    }


                </audio>

            </Layout>
        )
    }
}

export default connect(
    (state: StateType) => ({
        search_params: state.search_items.params,
        items: state.song_items.items,
        isFetching: state.song_items.isFetching
    }),
    { getDetail }
)(SongSlider);