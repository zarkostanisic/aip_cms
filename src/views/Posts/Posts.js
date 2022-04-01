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

class Posts extends Component {
  
  state = {
    posts: [],
    page: 1,
    total: 0,
    perPage: 12,
    pageRragneDisplayed: 3,
    loading: false
  };
  
  getPosts = (page = 1) => {
    this.setState({loading: true});
    
    var results = API.get('api/posts?page=' + page + '&per_page=' + this.state.perPage)
      .then(results => {
        
        this.setState({
          posts: results.data.data
        });
        
        this.setState({
          total: results.data.meta.total
        });
        
        this.setState({loading: false});
      });
  }
  
  componentDidMount(){
    
    this.getPosts();
  }
  
  handlePageClick = (event) => {
    const page = event.selected + 1;
    
    this.setState({page: page});

    this.getPosts(page);
  }
  
  handleDelete(id){
    if (window.confirm("Da li ste sigurni da želite da obrišete objavu?") == true) {
      var results = API.delete('api/posts/' + id)
        .then(results => {
          this.getPosts(1);
        });
    }
  }
  
  render(){
    const posts = this.state.posts.map((post) => {
      return (
        <tr key={post.id}>
          <td>{post.id}</td>
          <td>{post.title}</td>
          <td>{post.subtitle}</td>
          <td>{post.category.name}</td>
          <td>{post.user.username}</td>
          <td>{post.created_at}</td>
          <td>
            <Button to={'/admin/posts/edit/' + post.id} color="warning" className="ml-2 mt-1 mb-1" tag={Link}>Izmeni</Button>
            <Button color="danger" className="ml-2 mt-1 mb-1" onClick={() => this.handleDelete(post.id)}>Obriši</Button>
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
                    Objave
                  </CardTitle>
                  <Button to="/admin/posts/new" tag={Link} color="primary">Nova objava</Button>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Id</th>
                        <th>Naslov</th>
                        <th>Podnaslov</th>
                        <th>Kategorija</th>
                        <th>Korisnik</th>
                        <th>Datum</th>
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
                        posts
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

export default Posts;
