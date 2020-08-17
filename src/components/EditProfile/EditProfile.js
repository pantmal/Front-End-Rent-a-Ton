import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'

import './editProfile.css'

class EditProfile extends Component{
    
    constructor(props){
        super(props)

        this.state = {
            username: '',
            password: '',
            validation_pswd: '',
            first_name: '',
            last_name:'',
            email:'',
            phone:'',
            picture: '',
            imagePreviewUrl:'',
            errors: {}
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleValidPasswordChange = this.handleValidPasswordChange.bind(this)
        this.handleFirstnameChange = this.handleFirstnameChange.bind(this)
        this.handleLastnameChange = this.handleLastnameChange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePhoneChange = this.handlePhoneChange.bind(this)
        this.handleImageChange = this.handleImageChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }

    pic_change = false;

    componentDidMount(){


        const {id} = this.props.match.params
        if (id != this.props.app_state.user_primary_key){
            alert('You can only edit your own profile')
            this.props.history.push("/")
        }
        axios.get(`users/userList/${id}`/*, {
            headers: {
              Authorization: `JWT ${localStorage.getItem('storage_token')}`
            }}*/).then( 
            response => {
                const res_user = response.data
                this.setState({
                    username: res_user.username,
                    first_name: res_user.first_name,
                    last_name: res_user.last_name,
                    email: res_user.email,
                    phone: res_user.telephone,
                    picture: res_user.picture,
                    imagePreviewUrl: res_user.picture
                })
            }
        )
    }

    handleUsernameChange = event => {
        const form_name = event.target.value
        this.setState({
            username: form_name
        })
    }

    handlePasswordChange = event => {
        const form_pswd = event.target.value
        this.setState({
            password: form_pswd
        })
    }

    handleValidPasswordChange = event => {
        const form_valid_pswd = event.target.value
        this.setState({
            validation_pswd: form_valid_pswd
        })
    }
    
    handleFirstnameChange = event => {
        const form_first_name = event.target.value
        this.setState({
            first_name: form_first_name
        })
    }

    handleLastnameChange = event => {
        const form_last_name = event.target.value
        this.setState({
            last_name: form_last_name
        })
    }
    
    handleEmailChange = event => {
        const form_email = event.target.value
        this.setState({
            email: form_email
        })
    }
    
    handlePhoneChange = event => {
        const form_phone = event.target.value
        this.setState({
            phone: form_phone
        })
    }

    handleImageChange = event => {
        event.preventDefault();

        this.pic_change = true;
    
        let f_reader = new FileReader();
        let file = event.target.files[0];
    
        f_reader.onloadend = () => {
          this.setState({
            picture: file,
            imagePreviewUrl: f_reader.result
          });
        }
        
        f_reader.readAsDataURL(file)
      }
    
    handleValidation(){
        let errors = {};
        let formIsValid = true;


        if(this.state.username == ''){
           formIsValid = false;
           errors["name"] = "\u2757Cannot be empty";
        }

        if(this.state.password != '' && this.state.validation_pswd != '' ){        
            if(this.state.password !== this.state.validation_pswd){
                formIsValid = false;
                errors["v_pswd"] = "\u2757The two password fields are not the same";
            }
        }

        
        if(this.state.first_name == ''){
            formIsValid = false;
            errors["f_name"] = "\u2757Cannot be empty";
        }

        if(this.state.first_name != ''){
            if(!this.state.first_name.match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["f_name"] = "\u2757Only letters";
            }        
        }
         
        if(this.state.last_name == ''){
            formIsValid = false;
            errors["l_name"] = "\u2757Cannot be empty";
        }

        if(this.state.last_name != ''){
            if(!this.state.last_name.match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["l_name"] = "\u2757Only letters";
            }
        }

        if(this.state.email == ''){
            formIsValid = false;
            errors["email"] = "\u2757Cannot be empty";
        }

        if(this.state.phone == ''){
            formIsValid = false;
            errors["name"] = "\u2757Cannot be empty";
        }

        if(this.state.phone != ''){
            if(!this.state.phone.match(/^[0-9]+$/)){
                formIsValid = false;
                errors["phone"] = "\u2757Only numbers";
            }
        }


        this.setState({errors: errors});

        return formIsValid;
    }

    
    handleFormSubmit = event => {
        event.preventDefault()

        if(this.handleValidation()){
            this.proceedSubmission()
        }

    }

    proceedSubmission(){

        const data = {
            username: this.state.username,
            password: this.state.password,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            telephone: this.state.phone,
            picture: this.state.picture
        }

        const formData = new FormData();

        formData.append("username", data.username);
        formData.append("password", data.password);
        formData.append("first_name", data.first_name);
        formData.append("last_name", data.last_name);
        formData.append("email", data.email);
        formData.append("telephone", data.telephone);


        if (this.pic_change){
            
            formData.append("picture", data.picture);            
        }

        /*axios.patch(`users/userList/${id_match}/`, JSON.stringify(data), {headers: {
            'Content-Type': 'application/json',
             Authorization: `JWT ${localStorage.getItem('storage_token')}`
                
          }}*/
        console.log(formData)
        axios.patch(`users/userList/${this.props.app_state.user_primary_key}/`, formData, {headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('storage_token')}`
                
          }}).then(response => {alert('Your changes have been saved. ');  
            }).catch(error => {
                console.log(error.response);   
                if(error.response.request.response.includes("A user with that username already exists")){
                    alert('A user with that username already exists. Please fill in the edit form again with another username.')
                }else{
                    alert('Some kind of error occured, please try again.')
                }
            })
    }

    render(){

        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} style={{width:500,height: 500}} />);
        }

        let login_check = this.props.app_state.isLoggedIn;
        if (login_check === true){
            return(

                <div>
                    <form onSubmit={this.handleFormSubmit}>
                        <h5 className="message-edit"> Update your username here:<input name="username" defaultValue={this.state.username} onChange={this.handleUsernameChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["name"]}</span>
                        <h5 className="message-edit"> Enter your new password here, or your previous one if you don't want to update it:<input name="pswd" type="password" onChange={this.handlePasswordChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["pswd"]}</span>
                        <h5 className="message-edit"> Please validate your password:<input name="valid_pswd" type="password" onChange={this.handleValidPasswordChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["v_pswd"]}</span>
                        <h5 className="message-edit"> Update your first name here:<input name="fist_name" defaultValue={this.state.first_name} onChange={this.handleFirstnameChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["f_name"]}</span>
                        <h5 className="message-edit"> Update your last name here:<input name="last_name" defaultValue={this.state.last_name} onChange={this.handleLastnameChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["l_name"]}</span>
                        <h5 className="message-edit"> Update your email here:<input type="email" name="email" size="30" defaultValue={this.state.email} onChange={this.handleEmailChange}/></h5> 
                        <span style={{color: "red"}}>{this.state.errors["email"]}</span>
                        <h5 className="message-edit"> Update your phone here:<input type="tel" name="phone" size="30" defaultValue={this.state.phone} onChange={this.handlePhoneChange}/></h5> 
                        <span style={{color: "red"}}>{this.state.errors["phone"]}</span>
                        {$imagePreview} <br/>
                        <h5 className="message-edit">Update your picture here: <input type="file" accept='image/*' onChange={this.handleImageChange} /> </h5> <br/> <br/>
                        <button className="apply"><span>Apply changes!</span></button>
                        <br/>
                    </form>
                </div>

            )
            
        }else{
            return(
                <h1 className="message" >You can't edit profile as an anonymous user!</h1>
            )
        }
    }

}

export default EditProfile