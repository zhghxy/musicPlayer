import React from 'react';
import { Input, Select, Col, Row } from 'antd'
import { getSearch } from '../action';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { SearchParams } from '../type';
import '../less/search.less'

const { Search } = Input;
const { Option } = Select;

interface PropsType {
    getSearch: (params: SearchParams) => (dispatch: Dispatch) => any
}

class SearchBar extends React.Component<PropsType, any>{
    constructor(props: PropsType) {
        super(props);
        this.state = {
            value: '',
            vendor: 0
        }
    }


    render() {
        const SelectBefore = (
            <Select defaultValue={0} className="select-before"
                onChange={(value: number) => this.setState({ vendor: value })}>
                <Option value={0}>QQ音乐</Option>
                <Option value={1}>网易云音乐</Option>
            </Select>
        )
        return (
            <Col span={12} className='search-input-container'>
                <Search placeholder="搜索音乐"
                    enterButton
                    addonBefore={SelectBefore}
                    onSearch={
                        (value: string) => this.props.getSearch({
                            keywords: value,
                            vendor: this.state.vendor
                        }
                        )} />
            </Col>
        )
    }
}

export default connect(null, { getSearch })(SearchBar)