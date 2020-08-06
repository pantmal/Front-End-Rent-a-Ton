import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'


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
            errors: {}
            //MUST ADD PHOTO AS WELL
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleValidPasswordChange = this.handleValidPasswordChange.bind(this)
        this.handleFirstnameChange = this.handleFirstnameChange.bind(this)
        this.handleLastnameChange = this.handleLastnameChange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePhoneChange = this.handlePhoneChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }

    _isMounted = false;

    componentDidMount(){

        this._isMounted = true;

        const {id} = this.props.match.params
        if (id != this.props.app_state.user_primary_key){
            alert('You can only edit your own profile')
            this.props.history.push("/")
        }
        axios.get(`users/userList/${id}`, {
            headers: {
              Authorization: `JWT ${localStorage.getItem('storage_token')}`
            }}).then( 
            response => {
                const res_user = response.data
                //if (this._isMounted){
                this.setState({
                    username: res_user.username,
                    first_name: res_user.first_name,
                    last_name: res_user.last_name,
                    email: res_user.email,
                    phone: res_user.telephone
                    //MUST ADD PHOTO AS WELL
                })
            }
        )
    }

    //componentWillUnmount(){
    //    this._isMounted = false;
    //}

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
    
    proceedSubmission(){
        const data = {
            username: this.state.username,
            password: this.state.password,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            telephone: this.state.phone
        }
        /*axios.patch(`users/userList/${id_match}/`, JSON.stringify(data), {headers: {
            'Content-Type': 'application/json',
             Authorization: `JWT ${localStorage.getItem('storage_token')}`
                
          }}*/
        console.log(data)
        axios.patch(`users/userList/${this.props.app_state.user_primary_key}/`, JSON.stringify(data), {headers: {
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

    handleValidation(){
        let errors = {};
        let formIsValid = true;

        //Name
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

        console.log(this.state.first_name)
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

       
        if(!this.state.phone.match(/^[0-9]+$/)){
            formIsValid = false;
            errors["phone"] = "\u2757Only numbers";
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

    render(){

        let login_check = this.props.app_state.isLoggedIn;
        if (login_check === true){
            return(

                <div>
                    <form onSubmit={this.handleFormSubmit}>
                        <h5> Update your username here:<input name="username" defaultValue={this.state.username} onChange={this.handleUsernameChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["name"]}</span>
                        <h5> Enter your new password here, or your previous one if you don't want to update it:<input name="pswd" type="password" onChange={this.handlePasswordChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["pswd"]}</span>
                        <h5> Please validate your password:<input name="valid_pswd" type="password" onChange={this.handleValidPasswordChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["v_pswd"]}</span>
                        <h5> Update your first name here:<input name="fist_name" defaultValue={this.state.first_name} onChange={this.handleFirstnameChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["f_name"]}</span>
                        <h5> Update your last name here:<input name="last_name" defaultValue={this.state.last_name} onChange={this.handleLastnameChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["l_name"]}</span>
                        <h5> Update your email here:<input type="email" name="email" size="30" defaultValue={this.state.email} onChange={this.handleEmailChange}/></h5> 
                        <span style={{color: "red"}}>{this.state.errors["email"]}</span>
                        <h5> Update your phone here:<input type="tel" name="phone" size="30" defaultValue={this.state.phone} onChange={this.handlePhoneChange}/></h5> 
                        <span style={{color: "red"}}>{this.state.errors["phone"]}</span>
                        <button>Apply changes!</button>
                    </form>
                </div>

            )
            
        }else{
            return(
                <h1>You can't edit profile as an anonymous user!</h1>
            )
        }
    }

}

export default EditProfile