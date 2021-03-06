import React, {Component} from "react";
import {Link} from "react-router-dom";
import API from '../../api/api';
import validation from '../../lang/sr/validation';
import SimpleReactValidator from 'simple-react-validator';
import { fileToBase64 } from '../../components/Functions/Functions';
import classnames from 'classnames';

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
  CardBody,
  Form,
  TabContent,
  TabPane,
  Nav,
  NavLink,
  NavItem
} from "reactstrap";

import {Button} from "reactstrap";

class FormUser extends Component {
  state = {
    roles: [],
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    role_id: '',
    image: [],
    team: false,
    about: '',
    social_networks: {},
    social_network_list: [],
    activeTab: 'info'
  }
  
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }
  
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  
  getRoles = () => {
    
    let result = API.get('api/app/roles')
      .then(result => {
        this.setState({
          roles: result.data.data
        });
      });
  }
  
  getSocialNetworks = () => {
    
    let result = API.get('api/app/socialNetworks')
      .then(result => {
        this.setState({
          social_network_list: result.data.data
        });
      });
  }
  
  handleSave = () => {
    if (this.validator.allValid()) {
      const data = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        role_id: this.state.role_id,
        image: this.state.image,
        team: this.state.team ? 1 : 0,
        about: this.state.about,
        social_networks: JSON.stringify(this.state.social_networks)
      };
      
      let results;
      if(this.props.action == 'edit'){
        results = API.patch('api/users/' + this.props.match.params.id, data);
      }else{
        results = API.post('api/users', data);
      }
      
      results.then(result => {
          this.props.history.push('/admin/users');
        }).catch((error) => {
          if(error.response.status == 422){
            const errors = error.response.data.errors;
            
            for(let i in errors){
              if(errors[i] !== undefined){
                this.setState({[`error_message_${i}`]: errors[i][0]});
              }
            }
            
            const keys = ['first_name','last_name','username','email','password','role_id','image','team','about'];
            
            for(let i in keys){
              if(errors[keys[i]] === undefined){
                this.setState({[`error_message_${keys[i]}`]: ''});
              }
            }
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
  
  handleCheckbox=(event)=>{
    let value = !this.state.team;
    this.setState({team: value})
  }  
  
  fileSelectedHandler = event => {
      const image = event.target.files[0];
      const extensions = ['image/png', 'image/jpg', 'image/jpeg'];
      
      if(extensions.includes(image.type)){
        fileToBase64(image).then(result => {
            const newFiles = [...this.state.image, result];
            this.setState({ image: newFiles});
        });
      }else{
        event.target.value = '';
        this.setState({image: []});
        alert('Format slike mora biti jpg,jpeg ili png!');
      }
  };
  
  getUser = () => {
    
    if(this.props.match.params.id){
      let result = API.get('api/users/' + this.props.match.params.id)
        .then(result => {
          let social_networks = JSON.parse(result.data.data.social_networks);
          if(!social_networks) social_networks = {};
          
          this.setState({
            first_name: result.data.data.first_name,
            last_name: result.data.data.last_name,
            username: result.data.data.username,
            email: result.data.data.email,
            role_id: result.data.data.role.id,
            team: Boolean(result.data.data.team),
            about: result.data.data.about,
            social_networks: social_networks
          });
        });
    }
  }
  
  handleSocialNetworksChange=(event)=>{
      let social_networks = this.state.social_networks;
      const name = event.target.name;
      const value =  event.target.value;
      social_networks[name] = value;
      
      this.setState({social_networks: social_networks});

      if(value == ''){
        delete social_networks[name];
      }
      
      this.setState({social_networks: social_networks});
  }
  
  componentWillMount() {
    // Serbian
    SimpleReactValidator.addLocale('sr', validation);
    this.validator = new SimpleReactValidator({locale: 'sr'});
  }
  
  componentDidMount(){
     
     this.getRoles();
     this.getSocialNetworks();
     
     if(this.props.action == 'edit'){
       this.getUser();
     }
  }
  
  render(){
    const roles = this.state.roles.map((role) => {
      return (
        <option value={role.id} key={role.id}>{role.name}</option>
      );
    });
    
    const social = this.state.social_network_list.map((network) => {
      return (
        <Col md="6" key={network.id}>
          <FormGroup>
            <Label for={network.slug}>{network.name}</Label>
            <Input
              type="text"
              name={network.slug}
              value={this.state.social_networks ? (this.state.social_networks[network.slug] ? this.state.social_networks[network.slug] : '') : ''} 
              onChange={this.handleSocialNetworksChange}
              placeholder={network.placeholder}
            />
          </FormGroup>
        </Col>
      );
    });
    
    return (
      <>
        <div className="content">
          <Row>
            <Col md="8">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5">{this.props.action == 'edit' ? 'Izmena korisnika' : 'Novi korisnik'}</CardTitle>
                </CardHeader>
                <CardBody>
                <Nav tabs>
                   <NavItem>
                     <NavLink
                       className={classnames({ active: this.state.activeTab === 'info' })}
                       onClick={() => { this.toggle('info'); }}
                     >
                       Osnovno
                     </NavLink>
                  </NavItem>
                  <NavItem>
                     <NavLink
                       className={classnames({ active: this.state.activeTab === 'social_networks' })}
                       onClick={() => { this.toggle('social_networks'); }}
                     >
                       Dru??tvene mre??e 
                     </NavLink>
                   </NavItem>
                   
                 </Nav>
                 <TabContent activeTab={this.state.activeTab}>
                   <TabPane tabId="info">
                     <Row>
                       <Col md="12" className="pt-5">
                        <Form>
                          <Row>
                            <Col md="6">
                            <FormGroup>
                              <Label for="first_name">Ime</Label>
                              <Input
                                type="first_name"
                                name="first_name"
                                value={this.state.first_name} 
                                onChange={this.handleChange}
                              />
                              <FormText color="danger">
                                {this.validator.message('ime', this.state.first_name, 'required|string')}
                                {this.state?.error_message_first_name}
                              </FormText>
                            </FormGroup>
                            </Col>
                            <Col md="6">
                              <FormGroup>
                                <Label for="last_name">Prezime</Label>
                                <Input
                                  type="text"
                                  name="last_name"
                                  value={this.state.last_name} 
                                  onChange={this.handleChange}
                                />
                                <FormText color="danger">
                                  {this.validator.message('prezime', this.state.last_name, 'required|string')}
                                  {this.state?.error_message_last_name}
                                </FormText>
                              </FormGroup>
                            </Col>
                          </Row>
                          
                          <Row>
                            <Col md="6">
                              <FormGroup>
                                <Label for="username">Korisni??ko ime</Label>
                                <Input
                                  type="text"
                                  name="username"
                                  value={this.state.username} 
                                  onChange={this.handleChange}
                                />
                                <FormText color="danger">
                                  {this.validator.message('korisni??ko ime', this.state.username, 'required|alpha_num')}
                                  {this.state?.error_message_username}
                                </FormText>
                              </FormGroup>
                            </Col>
                            
                            <Col md="6">
                              <FormGroup>
                                <Label for="email">Email</Label>
                                <Input
                                  type="text"
                                  name="email"
                                  value={this.state.email} 
                                  onChange={this.handleChange}
                                />
                                <FormText color="danger">
                                  {this.validator.message('email', this.state.email, 'required|email')}
                                  {this.state?.error_message_email}
                                </FormText>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="6">
                              <FormGroup>
                                <Label for="password">Lozinka</Label>
                                <Input
                                  type="password"
                                  name="password"
                                  value={this.state.password} 
                                  onChange={this.handleChange}
                                />
                                <FormText color="danger">
                                  {
                                    this.props.action == 'edit' 
                                    ?
                                      this.validator.message('lozinka', this.state.username, 'alpha_num')
                                    :
                                      this.validator.message('lozinka', this.state.username, 'required|alpha_num')
                                  }
                                  {this.state?.error_message_password}
                                </FormText>
                              </FormGroup>
                            </Col>
                            <Col md="6">
                              <FormGroup>
                                <Label for="role_id">Uloga</Label>
                                <Input type="select"
                                  name="role_id" value={this.state.role_id} 
                                  onChange={this.handleChange}
                                >
                                  {
                                    this.props.action == 'create'
                                      ?
                                      <option value="">Izaberi</option>
                                      : null
                                  }
                                  {roles}
                                </Input>
                                <FormText color="danger">
                                  {this.validator.message('uloga', this.state.role_id, 'required')}
                                  {this.state?.error_message_role_id}
                                </FormText>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="10">
                              <FormGroup>
                                <Label for="image">Avatar</Label>
                                <Input type="file"
                                  name="image" 
                                  id="image"
                                  onChange={this.fileSelectedHandler}
                                  accept="image/png,image/jpg,image/jpeg"
                                ></Input>
                                <FormText color="danger">
                                  {this.props.action == 'create' ? this.validator.message('slika', this.state.image, 'required') : null}
                                  {this.state?.error_message_image}
                                </FormText>
                              </FormGroup>
                            </Col>
                          
                            <Col className="pt-4" md="2">
                              <FormGroup check>
                                <Label check>
                                  <Input type="checkbox" id="team" name="team" onChange={this.handleCheckbox} checked={this.state.team}/>{' '}
                                  Tim
                                  <span className="form-check-sign">
                                    <span className="check"></span>
                                  </span>
                                </Label>
                                {this.validator.message('tim', this.state.team, 'required|boolean')}
                                {this.state?.error_message_team}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <Label for="text">Tekst</Label>
                                <Input type="textarea" name="about" 
                                  value={this.state.about} 
                                  onChange={this.handleChange} 
                                />
                                <FormText color="danger">
                                  {this.validator.message('tekst', this.state.about, 'required')}
                                  {this.state?.error_message_about}
                                </FormText>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <div className="update ml-auto mr-auto">
                              
                              <Button color="primary" type="button" onClick={() => this.handleSave()}>
                                Sa??uvaj
                              </Button>
                            </div>
                          </Row>
                        </Form>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                  
                  <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="social_networks">
                      <Row>
                        <Col md="12" className="pt-5">
                          {
                            this.state.activeTab === 'social_networks' 
                            ?
                                <Form>
                                  <Row>
                                    {social}
                                  </Row>
                                </Form>                            
                            :
                              null
                          }
                         
                         </Col>
                       </Row>
                     </TabPane>
                   </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
};

export default FormUser;
