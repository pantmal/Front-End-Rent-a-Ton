import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'


class Register extends Component{
    
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
            host: false,
            renter: false
            //MUST ADD PHOTO AS WELL
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleValidPasswordChange = this.handleValidPasswordChange.bind(this)
        this.handleFirstnameChange = this.handleFirstnameChange.bind(this)
        this.handleLastnameChange = this.handleLastnameChange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePhoneChange = this.handlePhoneChange.bind(this)
        this.handleHostChange = this.handleHostChange.bind(this)
        this.handleRenterChange = this.handleRenterChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
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
    
    handleHostChange = event => {
        this.setState(prevState => {return{
            host: !prevState.host
        }})
    }

    handleRenterChange = event => {
        this.setState(prevState => {return{
            renter: !prevState.renter
        }})
    }

    Password_check = (password, valid_pswd) => {
        let isValid = true
        if (password !== valid_pswd) {
            isValid = false
        }
        return isValid;
    }
    
    handleFormSubmit = event => {
        event.preventDefault()
        let valid_check = this.Password_check(this.state.password, this.state.validation_pswd)
        if (valid_check === false){
            alert('wrong passwords')
        }

        let approval = true
        if(this.state.host){
            approval = false
        }

        const data = {
            username: this.state.username,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password,
            is_staff: false,
            telephone: this.state.phone,
            approved: approval,
            is_host: this.state.host,
            is_renter: this.state.renter
        }
        //"{\"username\":[\"A user with that username already exists.\"]}"
        console.log(data)
        axios.post('users/userList/', JSON.stringify(data), {headers: {
            'Content-Type': 'application/json'
          }}).then(response => {alert('You have successfully registered! Now proceed to log in at the navigation bar to continue using the application.');
          if (data.is_host){
            alert('Since you have chosen the role of the host you will have to wait until further notice. The admin will activate your account someday')
          }  
            }).catch(error => {console.log(error.response);  
                if(error.response.request.response.includes("A user with that username already exists")){
                    alert('A user with that username already exists. Please fill in the register form again with another username.')
                }else{
                    alert('Some kind of error occured, please try again.')
                }
            }).finally(() => { 
                this.props.history.push("/");
            })
    }

    render(){

        let login_check = this.props.app_state.isLoggedIn;
        if (login_check === true){
            return(
                <h1>You are already logged in!</h1>
            )
        }else{
            return(

                <div>
                    <form onSubmit={this.handleFormSubmit}>
                        <h5> Enter your name here:<input name="username" onChange={this.handleUsernameChange} /></h5> <br/>
                        <h5> Enter your password here:<input name="pswd" type="password" onChange={this.handlePasswordChange} /></h5>
                        <h5> Please validate your password:<input name="valid_pswd" type="password" onChange={this.handleValidPasswordChange} /></h5>
                        <h5> Enter your first name here:<input name="fist_name" onChange={this.handleFirstnameChange} /></h5> <br/>
                        <h5> Enter your last name here:<input name="last_name" onChange={this.handleLastnameChange} /></h5> <br/>
                        <h5> Enter your email here:<input type="email" name="email" size="30" onChange={this.handleEmailChange}/></h5> <br/>
                        <h5> Enter your phone here:<input type="tel" name="phone" size="30" onChange={this.handlePhoneChange}/></h5> <br/>
                        <h5>Choose your role here. You may choose host or renter or both</h5>
                        <h5> Host:<input type="checkbox" name="host" onChange={this.handleHostChange}/></h5> <br/>
                        <h5> Renter:<input type="checkbox" name="renter" onChange={this.handleRenterChange}/></h5> <br/>
                        <button>Submit!</button>
                    </form>
                </div>

            )
        }
    }

}

export default Register