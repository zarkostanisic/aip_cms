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

class Users extends Component {
  
  state = {
    users: [],
    page: 1,
    total: 0,
    perPage: 12,
    pageRragneDisplayed: 3,
    loading: false
  };
  
  getUsers = (page = 1) => {
    this.setState({loading: true});
    
    var results = API.get('api/users?page=' + page + '&per_page=' + this.state.perPage)
      .then(results => {
        
        this.setState({
          users: results.data.data
        });
        
        this.setState({
          total: results.data.meta.total
        });
        
        this.setState({loading: false});
      });
  }
  
  componentDidMount(){
    
    this.getUsers();
  }
  
  handlePageClick = (event) => {
    const page = event.selected + 1;
    
    this.setState({page: page});

    this.getUsers(page);
  }
  
  handleDelete(id){
    if (window.confirm("Da li ste sigurni da želite da obrišete korisnika?") == true) {
      var results = API.delete('api/users/' + id)
        .then(results => {
          this.getUsers(1);
        });
    }
  }
  
  render(){
    const users = this.state.users.map((user) => {
      return (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.first_name}</td>
          <td>{user.last_name}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>{user.role.name}</td>
          <td>
            <Button to={'/admin/users/edit/' + user.id} color="warning" className="ml-2 mt-1 mb-1" tag={Link}>Izmeni</Button>
            <Button color="danger" className="ml-2 mt-1 mb-1" onClick={() => this.handleDelete(user.id)}>Obriši</Button>
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
                    Korisnici
                  </CardTitle>
                  <Button to="/admin/users/new" tag={Link} color="primary">Novi korisnik</Button>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Id</th>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Korisničko ime</th>
                        <th>Email</th>
                        <th>Uloga</th>
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
                        users
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

export default Users;
