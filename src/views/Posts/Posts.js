import React, {Component} from "react";
import API from '../../api/api';
import {Link} from "react-router-dom";

import Pagination from '../../components/Pagination/Pagination';
import Spinner from '../../components/Spinner/Spinner';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

import { formatDateHandler } from '../../components/Functions/Functions';

class Posts extends Component {
  
  state = {
    posts: [],
    page: 1,
    total: 0,
    perPage: 12,
    pageRragneDisplayed: 3,
    loading: false,
    category_id: '',
    date_from: '',
    date_to: '',
    categories: []
  };
  
  getPosts = (page = 1) => {
    this.setState({loading: true});
    
    let path = 'api/posts?page=' + page + '&per_page=' + this.state.perPage;
    
    if(this.state.category_id){
      path += '&category_id=' +  this.state.category_id;
    }
    
    if(this.state.date_from){
      path += '&date_from=' +  formatDateHandler(this.state.date_from);
    }
    
    if(this.state.date_to){
      path += '&date_to=' +  formatDateHandler(this.state.date_to);
    }
    
    var results = API.get(path)
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
    this.getCategories();
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
  
  getCategories = () => {
    
    let result = API.get('api/app/categories')
      .then(result => {
        this.setState({
          categories: result.data.data
        });
      });
  }
  
  handleChange=(event)=>{
    this.setState({[event.target.name]:event.target.value });
  }
  
  componentDidUpdate = (prevProps, prevState) => {
    console.log(this.state.date_from);
    let load = false;
    
    if(prevState.category_id !== this.state.category_id){
      load = true;
    }
    
    if(prevState.date_from !== this.state.date_from){
      load = true;
    }
    
    if(prevState.date_to !== this.state.date_to){
      load = true;
    }
    
    if(load === true){
      this.getPosts();
    }
  };
  
  setDate = (date, name) => {
    this.setState({[name]: date});
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
    
    const categories = this.state.categories.map((category) => {
      return (
        <option value={category.id} key={category.id}>{category.name}</option>
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
                <Row>
                  <Col md="12">
                    <Form>
                      <Row>
                        <Col md="4">
                          <FormGroup>
                            <Label for="category_id">Kategorija</Label>
                            <Input type="select"
                              name="category_id" value={this.state.category_id} 
                              onChange={this.handleChange}
                            >
                              <option value=''>Izaberi</option>
                              {categories}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label for="date_from">Datum od</Label>
                            <DatePicker name="date_from" className="form-control" selected={this.state.date_from} onChange={(date:Date) => this.setDate(date, 'date_from')} />
                          </FormGroup>
                        </Col>
                        
                        <Col md="4">
                          <FormGroup>
                            <Label for="date_to">Datum do</Label>
                            <DatePicker name="date_to" className="form-control" selected={this.state.date_to} onChange={(date:Date) => this.setDate(date, 'date_to')} />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
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
