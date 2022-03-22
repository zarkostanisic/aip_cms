import React, {Component} from "react";
import {Link} from "react-router-dom";
import API from '../../api/api';
import validation from '../../lang/sr/validation';
import SimpleReactValidator from 'simple-react-validator';

import {
  FormGroup,
  Label,
  Input,
  FormText,
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody
} from "reactstrap";

import {Button} from "reactstrap";

class EditCategory extends Component {
  state = {
    roles: [],
    first_name: '',
    last_name: '',
    username: '',
    error_message_username: '',
    email: '',
    error_message_email: '',
    password: '',
    error_message_password: '',
    role_id: 0
  }
  
  getRoles = () => {
    
    var result = API.get('api/app/roles')
      .then(result => {
        this.setState({
          roles: result.data.data
        });
      });
  }
  
  handleUpdate = () => {
    if (this.validator.allValid()) {
      var results = API.patch('api/users/' + this.props.match.params.id, {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        role_id: this.state.role_id,
      })
        .then(result => {
          this.props.history.push('/admin/users');
        }).catch((error) => {
          if(error.response.status == 422){
            const errors = error.response.data.errors;
            
            (errors['username'] !== undefined) ?
              this.setState({ error_message_username: errors['username'][0] }) :
              this.setState({ error_message_username: '' });
              
            (errors['email'] !== undefined) ?
              this.setState({ error_message_email: errors['email'][0] }) :
              this.setState({ error_message_email: '' });
                
            (errors['password'] !== undefined) ?
              this.setState({ error_message_password: errors['password'][0] }) :
              this.setState({ error_message_password: '' });
          }
        });
    } else {
      this.validator.showMessages();
    
      this.forceUpdate();
    }
  }
  
  handleChange=(event)=>{
    this.setState({[event.target.name]:event.target.value });
  } 
  
  getUser = () => {
    
    if(this.props.match.params.id){
      var result = API.get('api/users/' + this.props.match.params.id)
        .then(result => {
          this.setState({
            first_name: result.data.data.first_name,
            last_name: result.data.data.last_name,
            username: result.data.data.username,
            email: result.data.data.email,
            role_id: result.data.data.role.id,
          });
        });
    }
  }
  
  componentWillMount() {
    // Serbian
    SimpleReactValidator.addLocale('sr', validation);
    this.validator = new SimpleReactValidator({locale: 'sr'});
  }
  
  componentDidMount(){
     this.getUser();
     
     this.getRoles();
  }
  
  render(){
    const roles = this.state.roles.map((role) => {
      return (
        <option value={role.id} key={role.id}>{role.name}</option>
      );
    });
    return (
      <>
        <div className="content">
          <Row>
            <Col md="6">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    Izmena korisnika
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <FormGroup>
                    <Label for="first_name">Ime</Label>
                    <Input
                      type="first_name"
                      name="first_name"
                      value={this.state.first_name} 
                      onChange={this.handleChange}
                    />
                    <FormText color="muted">
                      {this.validator.message('ime', this.state.first_name, 'required|alpha')}
                      {this.state.error_message_first_name}
                    </FormText>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label for="last_name">Prezime</Label>
                    <Input
                      type="text"
                      name="last_name"
                      value={this.state.last_name} 
                      onChange={this.handleChange}
                    />
                    <FormText color="muted">
                      {this.validator.message('prezime', this.state.last_name, 'required|alpha')}
                    </FormText>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label for="username">Korisničko ime</Label>
                    <Input
                      type="text"
                      name="username"
                      value={this.state.username} 
                      onChange={this.handleChange}
                    />
                    <FormText color="muted">
                      {this.validator.message('korisničko ime', this.state.username, 'required|alpha')}
                      {this.state.error_message_username}
                    </FormText>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      type="text"
                      name="email"
                      value={this.state.email} 
                      onChange={this.handleChange}
                    />
                    <FormText color="muted">
                      {this.validator.message('email', this.state.email, 'required|email')}
                      {this.state.error_message_email}
                    </FormText>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label for="password">Lozinka</Label>
                    <Input
                      type="text"
                      name="password"
                      value={this.state.password} 
                      onChange={this.handleChange}
                    />
                    <FormText color="muted">
                      {this.state.error_message_password}
                    </FormText>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label for="role_id">Uloga</Label>
                    <Input type="select"
                      name="role_id" value={this.state.role_id} 
                      onChange={this.handleChange}
                    >
                      {roles}
                    </Input>
                  </FormGroup>
                  
                  <Button color="primary" type="button" onClick={() => this.handleUpdate()}>
                    Sačuvaj
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
};

export default EditCategory;
