/*!

=========================================================
* Paper Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {Component} from "react";
import Pagination from '../../components/Pagination/Pagination';
import API from '../../api/api';
import {Link} from "react-router-dom";

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
    pageRragneDisplayed: 3
  };
  
  getCategories = (page = 1) => {
    
    var results = API.get('api/categories?page=' + page + '&per_page=' + this.state.perPage)
      .then(results => {
        
        this.setState({
          categories: results.data.data
        });
        
        this.setState({
          total: results.data.meta.total
        });
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
      var results = API.delete('api/categories/' + id)
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
            <Button to={'/admin/categories/edit/' + category.id} color="info" className="ml-2" tag={Link}>Izmeni</Button>
            <Button color="danger" className="ml-2" onClick={() => this.handleDelete(category.id)}>Obriši</Button>
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
                      {categories}
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
