import React from 'react';
import {Component} from 'react';
import {Link} from 'react-router-dom';

import './navbar.css'

class NavbarClass extends Component{

    constructor(props){
        super(props)
    }

    handleClick = () => {
        this.props.app_state.handleLogoutClick();
    }

    render(){
        let login_check = this.props.app_state.isLoggedIn;
        if (login_check === true){
            let role;
            let admin_link
            let host_link
            let edit_link
            if (this.props.app_state.isAdmin){
                role = 'admin'
                admin_link = <button><span>Admin Page</span></button>
            }else if(this.props.app_state.isHost && !this.props.app_state.isRenter ){
                role = 'host'
                host_link = <button><span>Host Page</span></button>
            }else if(this.props.app_state.isRenter && !this.props.app_state.isHost){
                role = 'renter'
            }else if(this.props.app_state.isRenter && this.props.app_state.isHost){
                role = 'host and renter'
                host_link = <button><span>Host Page</span></button>
            }else{
                role = 'um...'
            }

            edit_link = <Link to={`/editProfile/${this.props.app_state.user_primary_key}`}> <button><span>Edit Profile</span></button> </Link>

            return(
        
                <nav className="nav">
                    <Link to="/"><h3>Logo</h3></Link> 
                    {admin_link}
                    {host_link}
                    {edit_link}
                    <button onClick={this.handleClick} ><span>Logout</span></button>
                    
                </nav>
    
            )
        }
        return(

            <nav className="nav">
                <Link to="/"><h3>Logo</h3></Link> 
                
                <Link to="/register"><span>Register</span></Link>
                <Link to="/login"><span>Login</span></Link>
                
            </nav>

        )
    }

}

export default NavbarClass