import React, {Component} from "react";
import ReactPaginate from 'react-paginate';

class Pagination extends Component{
  render(){
    return <>
    <ReactPaginate
       breakLabel="..."
       nextLabel="next"
       onPageChange={this.props.handlePageClick}
       pageRangeDisplayed={this.props.pageRragneDisplayed}
       pageCount={Math.ceil(this.props.total / this.props.perPage)}
       previousLabel="previous"
       renderOnZeroPageCount={null}
       className="pagination justify-content-center"
       pageClassName="page-item"
       pageLinkClassName="page-link"
       activeClassName="active"
       activeLinkClassName="active"
       previousClassName="page-item"
       nextClassName="page-item"
       previousLinkClassName="page-link"
       nextLinkClassName="page-link"
     />
    </>;
  }
}

export default Pagination;
