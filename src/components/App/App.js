import React from 'react';
import './App.css';

import {Component} from 'react';
import {BrowserRouter, Switch, Route, withRouter } from 'react-router-dom';

import NavbarClass from '../Navbar/Navbar'
import Register from '../Register/Register'
import Login from '../Login/Login'
import Home from '../Home/Home'

import axios from '../AXIOS_conf'
import EditProfile from '../EditProfile/EditProfile';


class AppBase extends Component {

  constructor(props){
    super(props);

    let login_check = false
    if (localStorage.getItem('storage_token')){
      login_check = true
    }
    this.state = {
      username: '',
      user_primary_key: localStorage.getItem('storage_pk'),
      isLoggedIn: login_check,
      isAdmin: false,
      isHost: false,
      isRenter: false,
      handleLoginSubmission: this.handleLoginSubmission,
      handleLogoutClick: this.handleLogoutClick
    };

    this.handleLoginSubmission = this.handleLoginSubmission.bind(this)
    this.handleLogoutClick = this.handleLogoutClick.bind(this)

  }

  
  componentDidMount(){
    if (this.state.isLoggedIn === true){
      axios.get(`users/userList/${this.state.user_primary_key}`/*,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('storage_token')}`
        }}*/).then(
        response => { const user = response.data;
          this.setState({
            username: user.username
          })
          if (user.is_staff === true){ 
            this.setState({
              isAdmin: true,
              isHost: false,
              isRenter: false
            });
          }
          if (user.is_host && !user.is_renter ){
            this.setState({
              isAdmin: false,
              isHost: true,
              isRenter: false
            });
          }
          if (!user.is_host && user.is_renter ){
            this.setState({
              isAdmin: false,
              isHost: false,
              isRenter: true
            });
          }
          if (user.is_host && user.is_renter ){
            this.setState({
              isAdmin: false,
              isHost: true,
              isRenter: true
            });
          }
        }
      ).catch(error => {console.log(error.response);})
    }
  }

  handleLoginSubmission = (event, credentials) =>{
    axios.post('users/authentication/login/', JSON.stringify(credentials), {headers: {
      'Content-Type': 'application/json'
    }}
    ).then(response => { 
      const res_token = response.data.token;
      const res_user = response.data.user;
      localStorage.setItem('storage_token',res_token);
      localStorage.setItem('storage_pk',res_user.pk);
      this.setState({
        username: res_user.username,
        user_primary_key: res_user.pk,
        isLoggedIn: true,
      });
      axios.get(`users/userList/${this.state.user_primary_key}`/*,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('storage_token')}`
        }}*/).then(
        response => { const user = response.data;
          if (user.is_staff === true){ 
            this.setState({
              isAdmin: true,
              isHost: false,
              isRenter: false
            });
          }
          if (user.is_host && !user.is_renter ){
            this.setState({
              isAdmin: false,
              isHost: true,
              isRenter: false
            });
          }
          if (!user.is_host && user.is_renter ){
            this.setState({
              isAdmin: false,
              isHost: false,
              isRenter: true
            });
          }
          if (user.is_host && user.is_renter ){
            this.setState({
              isAdmin: false,
              isHost: true,
              isRenter: true
            });
          }
        }
      )
    } 
      ).catch(error => {console.log(error.response);  
        console.log("Yes, we have an error."); }
        ).finally( () => { 
          this.props.history.push("/");
        } )
  }

  handleLogoutClick = () => {
    console.log('logout check')
    localStorage.removeItem('storage_token');
    localStorage.removeItem('storage_pk');
    this.setState({
      username:'',
      user_primary_key: -1,
      isLoggedIn: false,
      isAdmin: false,
      isHost: false,
      isRenter: false
    })
    this.props.history.push("/");
  }

  
  render(){
    return (
      
        <div className = "App">
      
          <NavbarClass app_state={{...this.state}}/>
          <Switch>
          <Route path='/' exact render = {props => <Home {...props} app_state={{...this.state}}/>} /> 
          <Route path='/register/' render = {props => <Register {...props} app_state={{...this.state}} />} />
          <Route path='/login/' render = {props => <Login {...props} app_state={{...this.state}}/>} />
          <Route path='/editProfile/:id' render = {props => <EditProfile {...props} app_state={{...this.state}}/>} />
          </Switch>

        </div>
      
    )
  }
}

let AppBaseRouter = withRouter(AppBase)

class App extends Component{
  render(){
    return(
      <BrowserRouter>
        <AppBaseRouter />
      </BrowserRouter>
    )
  }
}

export default App;
