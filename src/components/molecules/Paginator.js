import React from 'react';
import ReactPaginate from 'react-paginate';

const Paginator = ({ currentPage, totalPages, handlePageClick, pagesRange, pagesAfterBreak, extraProps }) => {
    // after the break and before the next button, there was the last page, we want to hide it so that the user will navigate to one page after the other
    const lastPageSelector = 'li.break + li:not(.next)';
    if (!pagesAfterBreak || pagesAfterBreak === 0) {
        const lastPageElements = window.document.getElementsByClassName(lastPageSelector);
        if (Array.isArray(lastPageElements) && lastPageElements.length > 0) {
            lastPageElements.forEach(element => element.hide());
        }
    }

    return (
        <ReactPaginate
            activeClassName={'active'}
            breakLabel={<span>...</span>}
            containerClassName={'pagination'}
            disableInitialCallback={true}
            forcePage={currentPage}
            marginPagesDisplayed={pagesAfterBreak ? pagesAfterBreak : 0}
            nextLabel={'next'}
            onPageChange={handlePageClick}
            pageCount={totalPages}
            pageRangeDisplayed={pagesRange ? pagesRange : 7}
            previousLabel={'previous'}
            {...extraProps}
            subContainerClassName={'pages pagination'}
        />
    );
};

export default Paginator;
