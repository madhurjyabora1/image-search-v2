import React, { Component } from "react";

export default class Pagination extends Component {
  pages() {
    var pages = [];
    for (var i = this.rangeStart(); i <= this.rangeEnd(); i++) {
      pages.push(i);
    }
    return pages;
  }

  rangeStart() {
    var start = this.props.current - this.props.pageRange;
    return start > 0 ? start : 1;
  }

  rangeEnd() {
    var end = this.props.current + this.props.pageRange;
    var totalPages = this.totalPages();
    return end < totalPages ? end : totalPages;
  }

  totalPages() {
    return Math.ceil(this.props.total / this.props.perPage);
  }

  nextPage() {
    return this.props.current + 1;
  }

  prevPage() {
    return this.props.current - 1;
  }

  hasFirst() {
    return this.rangeStart() !== 1;
  }

  hasLast() {
    return this.rangeEnd() < this.totalPages();
  }

  hasPrev() {
    return this.props.current > 1;
  }

  hasNext() {
    return this.props.current < this.totalPages();
  }

  changePage(page) {
    this.props.onPageChanged(page);
  }

  render() {
    return (
      <div className="pagination">
      <div className="pagination__right">
        <button
          type="button"
          className={!this.hasNext() ? "hidden" : "loadMore"}
          onClick={e => this.changePage(this.nextPage())}
        >
          Load More
        </button>
      </div>
    </div>
    );
  }
}

Pagination.defaultProps = {
  pageRange: 2
};
