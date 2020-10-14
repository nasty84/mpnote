import React, {Component} from "react";
import ReactDOM from "react-dom";
import querystring from 'query-string';

import Pagination from "./Pagination";
import {page} from './PaginationUtil'


class StaticPagination extends Component {

    onChange(pageIdx) {
        location.href = location.pathname + "?" + querystring.stringify({
            ...querystring.parse(location.search),
            page: pageIdx
        });
    }

    render() {
        return <Pagination onChange={this.onChange} totalItemsCount={this.props.pageInfo.totalElements}
                           activePage={this.props.pageInfo.number}
                           itemsCountPerPage={this.props.pageInfo.size}/>
    }
}

let container = document.querySelector("#paginationContainer");

let pageInfo = page({
    totalElements: container.getAttribute("data-totalElements"),
    number: container.getAttribute("data-number"),
    size: container.getAttribute("data-size")
});

ReactDOM.render(
    <StaticPagination pageInfo={pageInfo}/>,
    container
);
