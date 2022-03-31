import React, {Component} from "react";
import {Link} from "react-router-dom";
import API from '../../api/api';
import validation from '../../lang/sr/validation';
import SimpleReactValidator from 'simple-react-validator';
import { fileToBase64 } from '../../components/Functions/Functions';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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

class NewPost extends Component {
  state = {
    categories: [],
    title: '',
    text: '',
    category_id: '',
    images: [],
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
  
  getCategories = () => {
    
    let result = API.get('api/app/categories')
      .then(result => {
        this.setState({
          categories: result.data.data
        });
      });
  }
  
  handleSave = () => {
    if (this.validator.allValid()) {
      
      let results = API.post('api/posts', {
        title: this.state.title,
        text: this.state.text,
        category_id: this.state.category_id,
        images: this.state.images
      })
        .then(result => {
          this.props.history.push('/admin/posts');
        }).catch((error) => {
          if(error.response.status == 422){
            const errors = error.response.data.errors;
            
            for(let i in errors){
              if(errors[i] !== undefined){
                this.setState({[`error_message_${i}`]: errors[i][0]});
              }
            }
            
            const keys = ['title', 'text'];
            
            for(let i in keys){
              if(errors[keys[i]] === undefined){
                this.setState({[`error_message_${keys[i]}`]: ''});
              }
            }
          }
          
          if(this.state.error_message_images !== undefined){
            this.toggle('images');
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
  
  fileSelectedHandler = event => {
      
      const images = event.target.files;
      const extensions = ['image/png', 'image/jpg', 'image/jpg'];

      for(let i=0;i<images.length;i++){
        let image = images[i];
        if(extensions.includes(image.type)){
          fileToBase64(image).then(result => {
              const newFiles = [...this.state.images, result];
              this.setState({ images: newFiles});
          });
        }
      }
      
      event.target.value = '';
  };
  
  componentWillMount() {
    // Serbian
    SimpleReactValidator.addLocale('sr', validation);
    this.validator = new SimpleReactValidator({locale: 'sr'});
  }
  
  componentDidMount(){
     
     this.getCategories();
  }
  
  handleRemoveImage = (type, key) => {
    let images = [...this.state.images]
    images.splice(key, 1);
    
    this.setState({images: images});
  }
  
  render(){
    const categories = this.state.categories.map((category) => {
      return (
        <option value={category.id} key={category.id}>{category.name}</option>
      );
    });
    
    const images = this.state.images.map((image, key) => {
      return (
        <Col md="2" key={key}>
          <Card >
            <CardBody>
              <div className="postImg" style={{ backgroundImage: `url('${image}')` }}></div>
              <Button color="primary" type="button" onClick={() => this.handleRemoveImage('new', key)}>
                Ukloni
              </Button>
            </CardBody>
          </Card>
        </Col>
      );
    });
  
    return (
      <>
        <div className="content">
        <Card className="card-post">
          <CardHeader>
            <CardTitle tag="h5">Nova objava</CardTitle>
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
                   className={classnames({ active: this.state.activeTab === 'images' })}
                   onClick={() => { this.toggle('images'); }}
                 >
                   Slike
                 </NavLink>
               </NavItem>
             </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="info">
                  <Row>
                    <Col md="12" className="pt-5">
                      <Form>
                        <Row>
                          <Col md="8">
                          <FormGroup>
                            <Label for="first_name">Naslov</Label>
                            <Input
                              type="title"
                              name="title"
                              value={this.state.title} 
                              onChange={this.handleChange}
                            />
                            <FormText color="muted">
                              {this.validator.message('naslov', this.state.title, 'required|alpha_space')}
                              {this.state?.error_message_title}
                            </FormText>
                          </FormGroup>
                          </Col>
                          
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
                              <FormText>
                                {this.state?.error_message_category_id}
                              </FormText>
                            </FormGroup>
                          </Col>
                        </Row>
                        
                        <Row>
                          <Col md="12">
                            <FormGroup>
                              <Label for="text">Tekst</Label>
                              <CKEditor
                                  name="text"
                                  config={ {
                                    toolbar: [ 'heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote', '|', 'Undo', 'Redo' ]
                                  } }
                                  editor={ ClassicEditor }
                                  data={this.state.text} 
                                  onChange={ ( event, editor ) => {
                                      const data = editor.getData();
                                      this.setState({text: data});
                                  } }
                              />
                              <FormText color="muted">
                                {this.validator.message('tekst', this.state.text, 'required')}
                                {this.state?.error_message_text}
                              </FormText>
                            </FormGroup>
                          </Col>
                        </Row>
                        
                        <Row>
                          <div className="update ml-auto mr-auto">
                            
                            <Button color="primary" type="button" onClick={() => this.handleSave()}>
                              Sačuvaj
                            </Button>
                          </div>
                        </Row>
                      </Form>
                    </Col>
                  </Row>
                </TabPane>
                
                <TabPane tabId="images">
                  <Row>
                    <Col md="12" className="pt-5">
      
                      <FormGroup>
                        <input style={{ display: 'none' }} 
                          type="file"
                          multiple
                          name="images" 
                          id="images"
                          onChange={this.fileSelectedHandler}
                          accept="image/png,image/jpg,image/jpeg"
                          ref={ref => this.fileInput = ref} 
                        />

                        <Button color="primary" onClick={() => { if (this.fileInput) this.fileInput.click() }}><i className="icon-plus icons font-xl"></i>Izaberi slike</Button>
                        <FormText color="muted">
                          {this.state?.error_message_images}
                        </FormText>
                      </FormGroup>
                    </Col>
                    {images}
                  </Row>
                </TabPane>
              </TabContent>
          </CardBody>
        </Card>
        </div>
      </>
    );
  }
};

export default NewPost;
