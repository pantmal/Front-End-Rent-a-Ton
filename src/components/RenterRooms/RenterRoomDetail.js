import React from 'react';
import {Component} from 'react';
import {Link} from 'react-router-dom';

import axios from '../AXIOS_conf'

import queryString from 'query-string'

import ViewMap from './ViewMap.js'


class RenterRoomDetail extends Component{

    constructor(props){
        super(props)

        let date_mode = false
        
        let query = this.props.match.params
        let start_date = '';
        let end_date = '';
        if (query.parameters!=null){
            date_mode = true

            let split_params = query.parameters.split('&')
            let s_date_param = split_params[0]
            let e_date_param = split_params[1]

            let s_date_param_med = s_date_param.split('=')
            start_date = s_date_param_med[1]

            let e_date_param_med = e_date_param.split('=')
            end_date = e_date_param_med[1]

        }

        this.state = {
            approved: false,
            date_mode: date_mode,
            date_free: false,
            start_date: start_date,
            end_date: end_date,
            room_id: '',
            name: '',
            street: '',
            hood: '',
            city:'',
            country:'',
            transit: '',
            s_date: '',
            e_date: '',
            price:'',
            extra_price:'',
            max_people:'',
            beds:'',
            bedrooms:'',
            bathrooms:'',
            picture: '',
            imagePreviewUrl: '',
            room_type:'',
            wifi: false,
            heating: false,
            freezer: false,
            kitchen: false,
            TV: false,
            parking: false,
            elevator: false,
            living_room: false,
            feet: '',
            desc:'',
            smoking: false,
            pets: false,
            events: false,
            min_nights: '',
            host_id:'',
            lat: '',
            lng: '',
            files: [],
            imagesPreviewUrls: [],
            host_username:'' ,
            host_picture:'' ,
            host_email:'' ,
        }

        this.handleRentChange = this.handleRentChange.bind(this)

    }


    componentDidMount(){

                
        const id = this.props.app_state.user_primary_key
        axios.get(`users/userList/${id}`/*,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('storage_token')}`
        }}*/).then(response => { const user = response.data;
          this.setState({
            approved: user.approved
          })
           if(this.state.approved){
            const {id} = this.props.match.params
            axios.get(`rooms/roomList/${id}`/*, {
                headers: {
                  Authorization: `JWT ${localStorage.getItem('storage_token')}`
                }}*/).then( 
                    response => {
                    const res_room = response.data
                    this.setState({
                        room_id: res_room.pk,
                        name: res_room.name,
                        street: res_room.street,
                        hood: res_room.neighborhood,
                        city: res_room.city,
                        country: res_room.country,
                        transit: res_room.transit,
                        s_date: res_room.start_date,
                        e_date: res_room.end_date,
                        price: res_room.price,
                        extra_price: res_room.price_per_person,
                        max_people: res_room.max_people,
                        beds: res_room.beds,
                        bedrooms: res_room.bedrooms,
                        bathrooms: res_room.bathrooms,
                        picture: res_room.rep_photo,
                        imagePreviewUrl: res_room.rep_photo,
                        room_type: res_room.room_type,
                        wifi: res_room.has_wifi,
                        heating: res_room.has_heating,
                        freezer: res_room.has_freezer,
                        kitchen: res_room.has_kitchen,
                        TV: res_room.has_TV,
                        parking: res_room.has_parking,
                        elevator: res_room.has_elevator,
                        living_room: res_room.has_living_room,
                        feet: res_room.square_feet,
                        desc: res_room.description,
                        smoking: res_room.smoking,
                        pets: res_room.pets,
                        events: res_room.events,
                        min_nights: res_room.minimum_nights,
                        host_id: res_room.host_id
                    })

                    let location = res_room.geolocation.split(' ')
                    let lng = location[1].replace('(','')
                    let lat = location[2].replace(')','')
                    this.setState({
                        lat: lat,
                        lng: lng
                    })

                    const data = {room_id_img: this.state.room_id}
            
                    axios.post('/rooms/getImages/', JSON.stringify(data), {headers: { 
                        'Content-Type': 'application/json'
                    }})
                    .then(res => {

                        if (res.data!=='not found'){

                            let new_arr = []
                            res.data.forEach(function(value, index, array) {
                                
                                new_arr.push("http://localhost:8000"+value.picture)
                                
                            })
                               
                            this.setState({
                                files: new_arr,
                                imagesPreviewUrls: new_arr
                            })
                        }
                    })

                    //check retrieve permission
                    const id = this.state.host_id
                    axios.get(`users/userList/${id}`/*, {
                        headers: {
                        Authorization: `JWT ${localStorage.getItem('storage_token')}`
                        }}*/).then( 
                        response => {
                            const res_user = response.data
                            this.setState({
                                host_username: res_user.username,
                                host_picture: res_user.picture,
                                host_email: res_user.email
                            })
                        }
                    )

                    //++critics here

                    if(this.props.app_state.isHost && this.props.app_state.isRenter){
                        if (this.state.host_id == this.props.app_state.user_primary_key){
                            alert('You can\'t make a reservation on your own rooms')
                            this.props.history.push("/")
                        }
                    }

                        const formData = new FormData();
                        formData.append("click", 'click');
                        formData.append("room_id_click", this.state.room_id);
                        formData.append("renter_id_click", this.props.app_state.user_primary_key);
                        axios.post('rooms/addSearchesClicks/',formData, {headers: {
                        'Content-Type': 'application/json'
                        }}).then(response => {console.log('click ok')}).catch(error => {console.log(error.response);})

                        if (this.state.date_mode){
                            const dateData = new FormData();
                            dateData.append("room_id", this.state.room_id);
                            dateData.append("start_date", this.state.start_date);
                            dateData.append("end_date", this.state.end_date);
                            axios.post('rooms/resCheck/',dateData, {headers: {
                            'Content-Type': 'application/json'
                            }}).then(response => {console.log(response.data)
                                if(response.data==='free'){
                                    this.setState({
                                        date_free: true
                                    })
                                }else{
                                    this.setState({
                                        date_free: false
                                    })
                                }
                            }).catch(error => {console.log(error.response);})

                            

                        }
                        


                }
            )
           }   
        }).catch(error => {console.log(error.response);})


    }

    handleRentChange = event =>{
        const resData = new FormData();
        resData.append("room_id_res", this.state.room_id);
        resData.append("renter_id_res", this.props.app_state.user_primary_key);
        resData.append("start_date", this.state.start_date);
        resData.append("end_date", this.state.end_date);
        axios.post('rooms/reservations/',resData, {headers: {
        'Content-Type': 'application/json'
        }}).then(response => {console.log(response.data)
            this.setState({
                date_free: false
            })
            alert(`You have successfully rented the current room from ${this.state.start_date} to ${this.state.start_date}.\n You may see your reservations at the reservation list in the navigation bar and click on their details to contact the host for more information.`)
            window.location.reload();
        }).catch(error => {console.log(error.response);})
    }

    render(){

        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} style={{width:500,height: 500}} />);
        }
        //CAN'T BE NULL
        //ALSO HE CAN ADD EXTRA PHOTOS
        //PLUS: CHANGE DESC TO TEXT AREA

        let {imagesPreviewUrls} = this.state;     
        
        let button_obj
        if (this.state.date_mode && this.state.date_free && this.props.app_state.isRenter){
            button_obj = <button className="apply" onClick={this.handleRentChange}>Make a reservation!</button>
        }
        
        if(this.props.app_state.isRenter || !this.props.app_state.isLoggedIn){
                return(
                <div>
                <h5 className="message"> Room information:</h5> 
                <h5 className="message" > Name: {this.state.name} </h5> 
                <h5 className="message" > Room type:{this.state.room_type} </h5> 
                <h5 className="message" > Number of beds:{this.state.beds} </h5> 
                <h5 className="message" > Number of bedrooms:{this.state.bedrooms} </h5> 
                <h5 className="message" > Number of bathrooms:{this.state.bathrooms} </h5>     
                <h5 className="message" > Living room: {this.state.living_room ? '\u2705':'\u274c' } </h5>
                <h5 className="message" > Square feet: {this.state.feet}</h5>     
                <br/>
                <h5 className="message" > Description: {this.state.desc} </h5>    
                <br/>
                <h5 className="message"> Rules:</h5> 
                <h5 className="message" > Smoking: {this.state.smoking ? '\u2705':'\u274c' } </h5>
                <h5 className="message" > Pets: {this.state.pets ? '\u2705':'\u274c' } </h5>
                <h5 className="message" > Events: {this.state.events ? '\u2705':'\u274c' } </h5>
                <h5 className="message" > Minimum nights:{this.state.min_nights}</h5>     
                <br/>
                <h5 className="message"> Location:</h5> 
                <h5 className="message"> Move the mouse on the map to see the location of this room:</h5> 
                <ViewMap form_state={{...this.state}}/>
                <h5 className="message"> Address:{this.state.street} </h5> 
                <h5 className="message" > Neighborhood: {this.state.hood} </h5> 
                <h5 className="message"> City:{this.state.city} </h5>
                <h5 className="message"> Country:{this.state.country}</h5>
                <h5 className="message" > Transit:{this.state.transit}</h5> 
                <br/>
                <h5 className="message"> Price:</h5> 
                <h5 className="message" > Starting price: {this.state.price} </h5> 
                <h5 className="message" > Price per extra people:{this.state.extra_price}</h5> 
                <br/>
                <h5 className="message"> Photos:</h5> 
                {$imagePreview} <br/>
                {imagesPreviewUrls.map(function(imagePreviewUrl, i){
                        return <div> <img key={i} src={imagePreviewUrl} style={{width:100,height: 100}} /> <br/> </div>
                })}
                <br/>
                <h5 className="message">Amenities this room provides:</h5> 
                <h5 className="message" > WiFi: {this.state.wifi ? '\u2705':'\u274c' } </h5> 
                <h5 className="message" > Freezer: {this.state.freezer ? '\u2705':'\u274c' }</h5> 
                <h5 className="message" > Heating: {this.state.heating ? '\u2705':'\u274c' }</h5> 
                <h5 className="message" > Kitchen: {this.state.kitchen ? '\u2705':'\u274c' }</h5> 
                <h5 className="message" > TV: {this.state.TV ? '\u2705':'\u274c' }</h5> 
                <h5 className="message" > Parking: {this.state.parking ? '\u2705':'\u274c' }</h5> 
                <h5 className="message" > Elevator: {this.state.elevator ? '\u2705':'\u274c' }</h5> 
                
                <br/>
                <h5 className="message">Host information (click on the host to get to contact him!):</h5> 
                <h5 className="message" > Host name: {this.state.host_username} </h5> 
                <h5 className="message" > Host picture: <img src={this.state.host_picture} style={{width:100,height: 100}}/> </h5> 

                {button_obj}
                </div>
                )
            }else{
                return( <h1 className="message">You can't access this page!</h1>)
            }
    
        // return(
        //     <div>
                
        //         {approved_msg}
        //         {wrap}
        //         {disapproved_msg}
        //         {denial}
                
        //     </div>
        // )
    }


}

export default RenterRoomDetail