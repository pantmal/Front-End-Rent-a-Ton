import React from 'react';
import './App.css';

import {Component} from 'react';
import {Switch, Route, withRouter } from 'react-router-dom';

import NavbarClass from '../Navbar/Navbar'
import Register from '../Register/Register'
import Login from '../Login/Login'
import Home from '../Home/Home'
import EditProfile from '../EditProfile/EditProfile';
import HostPage from '../HostPage/HostPage';
import HostRooms from '../HostRooms/HostRooms';
import HostRoomDetail from '../HostRooms/HostRoomDetail';
import RenterRooms from '../RenterRooms/RenterRooms';
import RenterRoomDetail from '../RenterRooms/RenterRoomDetail';
import RoomImages from '../RoomImages/RoomImages';
import RoomImageDetail from '../RoomImages/RoomImageDetail';
import AdminPage from '../AdminPage/AdminPage';
import UserList from '../UserList/UserList';
import UserDetail from '../UserList/UserDetail';
import Search from '../Search/Search';
import MessageList from '../Messages/MessageList';
import MessageDetail from '../Messages/MessageDetail';
import CreateMessage from '../Messages/CreateMessage';

import axios from '../AXIOS_conf'


class App extends Component {

  constructor(props){
    super(props);

    let login_check = false
    if (localStorage.getItem('storage_token')){
      login_check = true
    }

    let user_id = -1
    if (localStorage.getItem('storage_pk')){
      user_id = localStorage.getItem('storage_pk') 
    }
    
    this.state = {
      username: '',
      user_primary_key: user_id,
      isLoggedIn: login_check,
      isAdmin: false,
      isHost: false,
      isRenter: false,
      handleLoginSubmission: this.handleLoginSubmission,
      handleLogoutClick: this.handleLogoutClick
    };

    this.handleLoginSubmission = this.handleLoginSubmission.bind(this)
    this.handleLogoutClick = this.handleLogoutClick.bind(this)
    this.setDefaultState = this.setDefaultState.bind(this)

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

  handleLoginSubmission = (credentials) =>{
    axios.post('users/authentication/login/', JSON.stringify(credentials), {headers: {
      'Content-Type': 'application/json'
    }}
    ).then(response => { 
      
      const res_token = response.data.token;
      localStorage.setItem('storage_token',res_token);
      
      const res_user = response.data.user;
      localStorage.setItem('storage_pk',res_user.pk);

      this.setState({
        isLoggedIn: true,
        user_primary_key: res_user.pk,
        username: res_user.username
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
        console.log("Yes, we have a login error.");
        alert('Some kind of error occured, please try again.')
       }
        ).finally( () => { 
          this.props.history.push("/");
        } )
  }

  setDefaultState = () =>{
    this.setState({
      username:'',
      user_primary_key: -1,
      isLoggedIn: false,
      isAdmin: false,
      isHost: false,
      isRenter: false
    })
  }

  handleLogoutClick = () => {
    console.log('logout check')
    
    this.setDefaultState()

    localStorage.clear();
    
    this.props.history.push("/");
  }

  
  render(){
    return (
      
        <div className = "App">
      
          <NavbarClass {...this.props} app_state={{...this.state}}/>
          <Switch>
          <Route path='/' exact render = {props => <Home {...props} app_state={{...this.state}}/>} /> 
          <Route path='/register/' render = {props => <Register {...props} app_state={{...this.state}} />} />
          <Route path='/login/' render = {props => <Login {...props} app_state={{...this.state}}/>} />
          <Route path='/editProfile/:id' render = {props => <EditProfile {...props} app_state={{...this.state}}/>} />
          <Route path='/adminPage/' render = {props => <AdminPage {...props} app_state={{...this.state}}/>} />
          <Route path='/userList/' exact render = {props => <UserList {...props} app_state={{...this.state}}/>} />
          <Route path='/userList/:id' render = {props => <UserDetail {...props} app_state={{...this.state}}/>} />
          <Route path='/hostPage/' render = {props => <HostPage {...props} app_state={{...this.state}}/>} />
          <Route path='/search/:parameters?' render = {props => <Search {...props} app_state={{...this.state}}/>} />
          <Route path='/hostRooms/' exact render = {props => <HostRooms {...props} app_state={{...this.state}}/>} />
          <Route path='/hostRooms/:id' render = {props => <HostRoomDetail {...props} app_state={{...this.state}}/>} />
          <Route path='/renterRooms/' exact render = {props => <RenterRooms {...props} app_state={{...this.state}}/>} />
          <Route path='/renterRooms/:id/:parameters?' render = {props => <RenterRoomDetail {...props} app_state={{...this.state}}/>} />
          <Route path='/roomImages/:id' render = {props => <RoomImages {...props} app_state={{...this.state}}/>} /> 
          <Route path='/roomImageDetail/:id' render = {props => <RoomImageDetail {...props} app_state={{...this.state}}/>} /> 
          <Route path='/userMessages/:parameters?' render = {props => <MessageList {...props} app_state ={{...this.state}}/>} />          
          <Route path='/userMessageDetail/:id' render = {props => <MessageDetail {...props} app_state ={{...this.state}}/>} />          
          <Route path='/createMessage/:parameters?' render = {props => <CreateMessage {...props} app_state ={{...this.state}}/>} />          
          </Switch>

        </div>
      
    )
  }
}

/*let AppRouter = withRouter(AppBase)

class App extends Component{
  
  render(){
    return(<BrowserRouter>
            <AppRouter />
      </BrowserRouter>)
  }
  
}*/

export default withRouter(App)
