import React from 'react';
import {Component} from 'react';
import {Link} from 'react-router-dom';

import './navbar.css'

class NavbarClass extends Component{


    handleNavLogOffClick = () => {
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
                admin_link = <Link to={'/adminPage/'}><button className="admin-host"><span>Admin Page</span></button> </Link>
            }else if(this.props.app_state.isHost && !this.props.app_state.isRenter ){
                role = 'host'
                host_link = <Link to={'/hostPage/'}> <button className="admin-host"><span>Host Page</span></button> </Link>
            }else if(this.props.app_state.isRenter && !this.props.app_state.isHost){
                role = 'renter'
            }else if(this.props.app_state.isRenter && this.props.app_state.isHost){
                role = 'host and renter'
                host_link = <Link to={'/hostPage/'}> <button className="admin-host"><span>Host Page</span></button> </Link>
            }else{
                role = 'um...'
            }

            edit_link = <Link to={`/editProfile/${this.props.app_state.user_primary_key}`}> <button className="edit" ><span>Edit Profile</span></button> </Link>

            return(
        
                <nav className="nav">
                    <Link to="/"><h3><span className="logo">Rent-a-Ton</span></h3></Link> 
                    {admin_link}
                    {host_link}
                    {edit_link}
                    <button className="logout" onClick={this.handleNavLogOffClick} ><span>Logout</span></button>
                    
                </nav>
    
            )
        }
        return(

            <nav className="nav">
                <Link to="/"><h3><span className="logo">Rent-a-Ton</span></h3></Link> 
                
                <Link to="/register"><button className="register"><span >Register</span></button></Link>
                <Link to="/login"><button className="login" ><span >Login</span></button></Link>
                
            </nav>

        )
    }

}

export default NavbarClass