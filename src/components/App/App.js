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

//The App component will serve as the default-base component.
//The index.js file renders the App component, and the app renders all the other links of the website using the Route component which will be explained later.
class App extends Component {

  constructor(props){ //Constructor function initializes the state using the token and primary key of the user, if they exist.
    super(props);

    let login_check = false 
    if (localStorage.getItem('storage_token')){ //If there is a token in the local storage it means the user is logged in.
      login_check = true
    }

    let user_id = -1
    if (localStorage.getItem('storage_pk')){ //Here we will get the primary key of the user, if he is logged in.
      user_id = localStorage.getItem('storage_pk') 
    }
    
    this.state = { //This information will be used in all the other components rendered through the App.
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

  
  componentDidMount(){ //The following code is used when the user refreshes the page, or if he closes the tab and reopens it. If he is still logged in, we must set the state with his information.

    if (this.state.isLoggedIn === true){

      //If the user is logged in, we request the user item from the server.
      axios.get(`users/userList/${this.state.user_primary_key}`/*,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('storage_token')}`
        }}*/).then( response => { 
           
           //Setting the state with the information we retrieved.
           const user = response.data;
           this.setState({
             username: user.username
           })

          //Assigning the correct role.
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

  //Handling a login submission. This handling must be done in the App component because information such as whether the user is logged in or not is used in every other compoenent.
  handleLoginSubmission = (credentials) =>{

    //Making an axios post to authentication/login.
    axios.post('users/authentication/login/', JSON.stringify(credentials), {headers: {
      'Content-Type': 'application/json'
    }}
    ).then(response => { 
      
      //A successful response gives us the JSON web token and the user it located.
      const res_token = response.data.token;
      localStorage.setItem('storage_token',res_token);
      
      const res_user = response.data.user;
      localStorage.setItem('storage_pk',res_user.pk);

      //Updating the state.
      this.setState({
        isLoggedIn: true,
        user_primary_key: res_user.pk,
        username: res_user.username
      });

      //Getting from the server the user item we located
      axios.get(`users/userList/${this.state.user_primary_key}`/*,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('storage_token')}`
        }}*/).then(
        response => { 
          
          const user = response.data;

          //Assigning the correct role.
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

      //Redirecting to the home page.
      this.props.history.push("/")
    } 
      ).catch(error => {

        //Catching and handling errors.
        console.log(error.response);  
        alert('Some kind of error occured, please try again.')
        }
      )
        
  }

  //The default state, used for visitors.
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

  //Logging off clears the local storage, sets the user's state to a default one and redirects him to the home page.
  handleLogoutClick = () => {
    console.log('logout check')
    
    this.setDefaultState()

    localStorage.clear();
    
    this.props.history.push("/");
  }

  //Render function uses the Route and Switch components to switch between the different links of the website.
  render(){
    return (

      /* The Navigation bar is used by every link, so it is set at the top, before the Routes.  */
      /* Every link is rendered with the use of the Route component. Plus the state of the App is passed through the 'app_state' prop. */
      /* '/' is the root-deafult link which renders the Home page. */
      
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

//Exporting App with the 'withRouter' function so it can use the Route props (history for example).
//The wrapping around BrowserRouter which is necessary for the App to use the Router props is done in the index.js file.
export default withRouter(App)
