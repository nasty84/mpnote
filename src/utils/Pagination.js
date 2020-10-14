import React, { Component } from "react";
import PropTypes from 'prop-types';
import paginator from "paginator";
import Page from "./Page";

class Pagination extends Component {



    buildPages() {
        const pages = [];
        let {
            itemsCountPerPage,
            pageRangeDisplayed,
            activePage,
            totalItemsCount,
            onChange,
            hideDisabled
        } = this.props;

        const paginationInfo = new paginator(itemsCountPerPage, pageRangeDisplayed)
            .build(totalItemsCount, activePage);


        if (paginationInfo.first_page === paginationInfo.last_page) {
            // return pages;
        }

        for(let i = paginationInfo.first_page; i <= paginationInfo.last_page; i++) {
            pages.push(
                <Page
                    isActive={i === activePage}
                    key={i}
                    pageNumber={i}
                    pageText={i + ""}
                    className="num_g link_page"
                    onClick={onChange}
                />
            );
        }

        (hideDisabled && !paginationInfo.has_previous_page) || pages.unshift(
            <Page
                key={"prev" + paginationInfo.previous_page}
                pageNumber={paginationInfo.previous_page}
                onClick={onChange}
                className={"link_page btn_prev"}
                pageText={`&lt;`}
                isDisabled={!paginationInfo.has_previous_page}
            />
        );

        (hideDisabled && !paginationInfo.has_previous_page) || pages.unshift(
            <Page
                key={"first"}
                pageNumber={1}
                onClick={onChange}
                className={"link_page btn_prev2"}
                pageText={`&lt;&lt;`}
                isDisabled={paginationInfo.current_page === paginationInfo.first_page}
            />
        );

        (hideDisabled && !paginationInfo.has_next_page) || pages.push(
            <Page
                key={"next" + paginationInfo.next_page}
                pageNumber={paginationInfo.next_page}
                onClick={onChange}
                className={"link_page btn_next"}
                pageText={`&gt;`}
                isDisabled={!paginationInfo.has_next_page}
            />
        );

        (hideDisabled && !paginationInfo.has_next_page) || pages.push(
            <Page
                key={"last"}
                pageNumber={paginationInfo.total_pages}
                onClick={onChange}
                className={"link_page btn_next2"}
                pageText={`&gt;&gt;`}
                isDisabled={paginationInfo.current_page === paginationInfo.total_pages}
            />
        );

        return pages;
    }

    render() {
        const pages = this.buildPages();
        return (
            <div className="wrap_paging">{pages}</div>
        );
    }
}

export default Pagination;
