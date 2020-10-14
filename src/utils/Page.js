import React, {Component} from "react";
import PropTypes from 'prop-types';

class Page extends Component {


    handleClick(e) {
        const {isDisabled, pageNumber} = this.props;
        e.preventDefault();
        if (isDisabled) {
            return;
        }
        this.props.onClick(pageNumber);
    }

    render() {
        let {
            pageText,
            pageNumber,
            className,
            isActive,
            isDisabled,
        } = this.props;

        if (!isActive)
            return (
                <a href="#" className={className} onClick={(e) => this.handleClick(e)} aria-disabled={isDisabled}
                   dangerouslySetInnerHTML={{__html: pageText}}></a>
            );
        else
            return (
                <em className={className} dangerouslySetInnerHTML={{__html: pageText}}></em>
            );
    }
}

export default Page;
