import React, {Component} from "react";
import API from '../../api/api';
import {Link} from "react-router-dom";

import Pagination from '../../components/Pagination/Pagination';
import Spinner from '../../components/Spinner/Spinner';

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button
} from "reactstrap";

class Categories extends Component {
  
  state = {
    categories: [],
    page: 1,
    total: 0,
    perPage: 12,
    pageRragneDisplayed: 3,
    loading: false
  };
  
  getCategories = (page = 1) => {
    this.setState({loading: true});
    
    let results = API.get('api/categories?page=' + page + '&per_page=' + this.state.perPage)
      .then(results => {
        
        this.setState({
          categories: results.data.data
        });
        
        this.setState({
          total: results.data.meta.total
        });
        
        this.setState({loading:false});
      });
  }
  
  componentDidMount(){
    
    this.getCategories();
  }
  
  handlePageClick = (event) => {
    const page = event.selected + 1;
    
    this.setState({page: page});

    this.getCategories(page);
  }
  
  handleDelete(id){
    if (window.confirm("Da li ste sigurni da želite da obrišete kategoriju?") == true) {
      let results = API.delete('api/categories/' + id)
        .then(results => {
          this.getCategories(1);
        });
    }
  }
  
  render(){
    const categories = this.state.categories.map((category) => {
      return (
        <tr key={category.id}>
          <td>{category.id}</td>
          <td>{category.name}</td>
          <td>
            <Button to={'/admin/categories/edit/' + category.id} color="warning" className="ml-2 mt-1 mb-1" tag={Link}>Izmeni</Button>
            <Button color="danger" className="ml-2 mt-1 mb-1" onClick={() => this.handleDelete(category.id)}>Obriši</Button>
          </td>
        </tr>
      );
    });
    
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    Kategorije
                  </CardTitle>
                  <Button to="/admin/categories/new" tag={Link} color="primary">Nova kategorija</Button>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Id</th>
                        <th>Naziv</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                      this.state.loading ?
                        <tr>
                          <td colSpan="7">
                            <Spinner/>
                          </td>
                        </tr> 
                      :
                        categories
                    }
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            
            <Col md="12">
              <Pagination 
                handlePageClick={this.handlePageClick} 
                pageRragneDisplayed={this.state.pageRragneDisplayed}
                total={this.state.total}
                perPage={this.state.perPage}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Categories;
