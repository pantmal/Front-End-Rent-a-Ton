import React from 'react';
import {Component} from 'react';


class Home extends Component{

    
    render(){

        let search 
        let anon_message  
        let user_message 

        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){
            let role;
            if (this.props.app_state.isAdmin){
                role = 'admin'
            }else if(this.props.app_state.isHost && !this.props.app_state.isRenter ){
                role = 'host'
            }else if(this.props.app_state.isRenter && !this.props.app_state.isHost){
                role = 'renter'
                
            }else if(this.props.app_state.isRenter && this.props.app_state.isHost){
                role = 'host and renter'
            }else{
                role = 'um...'
            } 

            user_message = <h1> Congrats you are loggin in as {role} </h1>       

        }else{
            anon_message = <h1> Welcome anon user </h1>
        }

        if(login_check === false || this.props.app_state.isRenter){
            search = <h1> Search form that is coming soon... </h1> 
        }

        return(
            <div>
                {user_message}
                {anon_message}
                {search}
            </div>
        )
    }

}

export default Home