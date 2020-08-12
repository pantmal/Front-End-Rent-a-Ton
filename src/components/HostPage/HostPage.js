import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'


class HostPage extends Component{

    constructor(props){
        super(props)

        this.state = {
            approved: false,
            name: '',
            street: '',
            hood: '',
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
            errors: {}
        }

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleAddressChange = this.handleAddressChange.bind(this)
        this.handleHoodChange = this.handleHoodChange.bind(this)
        this.handleTransitChange = this.handleTransitChange.bind(this)
        this.handleStartDateChange = this.handleStartDateChange.bind(this) 
        this.handleEndDateChange = this.handleEndDateChange.bind(this)
        this.handlePeopleChange = this.handlePeopleChange.bind(this)
        this.handlePriceChange = this.handlePriceChange.bind(this)
        this.handleExtraPriceChange = this.handleExtraPriceChange.bind(this)
        this.handleRadioChange = this.handleRadioChange.bind(this)
        this._handleImageChange = this._handleImageChange.bind(this)
        this.handleBedsChange = this.handleBedsChange.bind(this)
        this.handleBedroomsChange = this.handleBedroomsChange.bind(this)
        this.handleBathroomsChange = this.handleBathroomsChange.bind(this)
        this.handleFeetChange = this.handleFeetChange.bind(this)
        this.handleDescChange = this.handleDescChange.bind(this)
        this.handleWiFiChange = this.handleWiFiChange.bind(this)
        this.handleFreezerChange = this.handleFreezerChange.bind(this)
        this.handleHeatingChange = this.handleHeatingChange.bind(this)
        this.handleKitchenChange = this.handleKitchenChange.bind(this)
        this.handleTVChange = this.handleTVChange.bind(this)
        this.handleParkingChange = this.handleParkingChange.bind(this)
        this.handleElevatorChange = this.handleElevatorChange.bind(this)
        this.handleLivingRoomChange = this.handleLivingRoomChange.bind(this)
        this.handleSmokingChange = this.handleSmokingChange.bind(this)
        this.handlePetsChange = this.handlePetsChange.bind(this)
        this.handleEventsChange = this.handleEventsChange.bind(this)
        this.handleMinNightsChange = this.handleMinNightsChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)


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
          })}).catch(error => {console.log(error.response);})
    }

    handleNameChange = event => {
        const form_name = event.target.value
        this.setState({
            name: form_name
        })
    }

    handleAddressChange = event => {
        const form_street = event.target.value
        this.setState({
            street: form_street
        })
    }

    handleHoodChange = event => {
        const form_hood = event.target.value
        this.setState({
            hood: form_hood
        })
    }

    handleTransitChange = event => {
        const form_trans = event.target.value
        this.setState({
            transit: form_trans
        })
    }

    handleStartDateChange = event => {
        const form_s_date = event.target.value
        this.setState({
            s_date: form_s_date
        })
    }

    handleEndDateChange = event => {
        const form_e_date = event.target.value
        this.setState({
            e_date: form_e_date
        })
    }

    handlePeopleChange = event => {
        const form_people = event.target.value
        this.setState({
            max_people: form_people
        })
    }

    handlePriceChange = event => {
        const form_price = event.target.value
        this.setState({
            price: form_price
        })
    }

    handleExtraPriceChange = event => {
        const form_extra = event.target.value
        this.setState({
            extra_price: form_extra
        })
    }

    handleRadioChange = (event) => {
        this.setState({
          room_type: event.target.value
        });
    }

    _handleImageChange(e) {
        e.preventDefault();
    
        let reader = new FileReader();
        let file = e.target.files[0];
    
        reader.onloadend = () => {
          this.setState({
            picture: file,
            imagePreviewUrl: reader.result
          });
        }
        
        console.log(reader.result)
        reader.readAsDataURL(file)
      }

    handleBedsChange = event => {
        const form_beds = event.target.value
        this.setState({
            beds: form_beds
        })
    }

    handleBedroomsChange = event => {
        const form_bedrooms = event.target.value
        this.setState({
            bedrooms: form_bedrooms
        })
    }

    handleBathroomsChange = event => {
        const form_bathrooms = event.target.value
        this.setState({
            bathrooms: form_bathrooms
        })
    }

    handleFeetChange = event => {
        const form_feet = event.target.value
        this.setState({
            feet: form_feet
        })
    }

    handleDescChange = event => {
        const form_desc = event.target.value
        this.setState({
            desc: form_desc
        })
    }

    handleWiFiChange = event => {
        this.setState(prevState => {return{
            wifi: !prevState.wifi
        }})
    }

    handleFreezerChange = event => {
        this.setState(prevState => {return{
            freezer: !prevState.freezer
        }})
    }

    handleHeatingChange = event => {
        this.setState(prevState => {return{
            heating: !prevState.heating
        }})
    }
    
    handleKitchenChange = event => {
        this.setState(prevState => {return{
            kitchen: !prevState.kitchen
        }})
    }

    handleTVChange = event => {
        this.setState(prevState => {return{
            TV: !prevState.TV
        }})
    }

    handleParkingChange = event => {
        this.setState(prevState => {return{
            parking: !prevState.parking
        }})
    }
    
    handleElevatorChange = event => {
        this.setState(prevState => {return{
            elevator: !prevState.elevator
        }})
    }

    handleLivingRoomChange = event => {
        this.setState(prevState => {return{
            living_room: !prevState.living_room
        }})
    }

    handleSmokingChange = event => {
        this.setState(prevState => {return{
            smoking: !prevState.smoking
        }})
    }

    handlePetsChange = event => {
        this.setState(prevState => {return{
            pets: !prevState.pets
        }})
    }

    handleEventsChange = event => {
        this.setState(prevState => {return{
            events: !prevState.events
        }})
    }

    handleMinNightsChange = event => {
        const form_min = event.target.value
        this.setState({
            min_nights: form_min
        })
    }

    handleValidation(){
        
        return true
    }

    handleFormSubmit = event => {
        event.preventDefault()

        if(this.handleValidation()){
            this.proceedSubmission()
        }

    }

    proceedSubmission(){
        console.log(this.state)
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

        let disapproved_msg
        let approved_msg
        let denial
    
        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){

            if(this.props.app_state.isHost){
                if(this.state.approved){
                    approved_msg = 
                    <div>
                    <h1 className="message">You may click here to manage your existing rooms, or </h1>
                    <h1 className="message"> You may add a new room by filling in the form below: </h1>
                    <form onSubmit={this.handleFormSubmit}>
                        <h5 className="message" > Name:<input name="name" onChange={this.handleNameChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["name"]}</span>
                        <h5 className="message" > Address (make sure to specify city and country too):<input name="address" onChange={this.handleAddressChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["address"]}</span>
                        <h5 className="message" > Neighborhood:<input name="hood" onChange={this.handleHoodChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["hood"]}</span>
                        <h5 className="message" > Transit:<input name="transit" onChange={this.handleTransitChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["transit"]}</span>
                        <h2 className="message"> Enter starting date here:<input type="date" name="start_date" onChange={this.handleStartDateChange} /></h2>
                        <span style={{color: "red"}}>{this.state.errors["s_date"]}</span>
                        <h2 className="message"> Enter ending date here:<input type="date" name="end_date" onChange={this.handleEndDateChange} /></h2>
                        <span style={{color: "red"}}>{this.state.errors["e_date"]}</span>
                        <h5 className="message" > Max number of people:<input name="max_people" onChange={this.handlePeopleChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["max_people"]}</span>
                        <h5 className="message" > Starting price:<input name="price" onChange={this.handlePriceChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["price"]}</span>
                        <h5 className="message" > Price per extra people:<input name="ext_price" onChange={this.handleExtraPriceChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["ext_price"]}</span>
                        <h5 className="message">Choose room type here:</h5> 
                        <h5 className="message">Private Room<input type="radio" value="Private_room" name="room_type" checked={this.state.room_type === "Private_room"} onChange={this.handleRadioChange}/>  </h5>
                        <h5 className="message">Shared Room<input type="radio" value="Shared_room" name="room_type"  checked={this.state.room_type === "Shared_room"} onChange={this.handleRadioChange}/> </h5>
                        <h5 className="message">Entire home/apt<input type="radio" value="Entire_home/apt" name="room_type" checked={this.state.room_type === "Entire_home/apt"} onChange={this.handleRadioChange} /> </h5>
                        {$imagePreview} <br/>
                        <h5 className="message" >Choose at least one picture that represents your property: <input type="file" onChange={this._handleImageChange} /> </h5> <br/>
                        <h5 className="message" > Number of beds:<input name="beds" onChange={this.handleBedsChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["beds"]}</span>
                        <h5 className="message" > Number of bedrooms:<input name="bedrooms" onChange={this.handleBedroomsChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["bedrooms"]}</span>
                        <h5 className="message" > Number of bathrooms:<input name="bathrooms" onChange={this.handleBathroomsChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["bathrooms"]}</span>
                        <h5 className="message" > Square feet:<input name="feet" onChange={this.handleFeetChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["feet"]}</span>
                        <h5 className="message" > Description:<input name="desc" onChange={this.handleDescChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["desc"]}</span>
                        <h5 className="message">Amenities this room provides:</h5> 
                        <h5 className="message" > WiFi:<input type="checkbox" name="WiFi" onChange={this.handleWiFiChange}/></h5> 
                        <h5 className="message" > Freezer:<input type="checkbox" name="Freezer" onChange={this.handleFreezerChange}/></h5> 
                        <h5 className="message" > Heating:<input type="checkbox" name="Heating" onChange={this.handleHeatingChange}/></h5> 
                        <h5 className="message" > Kitchen:<input type="checkbox" name="Kitchen" onChange={this.handleKitchenChange}/></h5> 
                        <h5 className="message" > TV:<input type="checkbox" name="TV"  onChange={this.handleTVChange}/></h5> 
                        <h5 className="message" > Parking:<input type="checkbox" name="Parking" onChange={this.handleParkingChange}/></h5> 
                        <h5 className="message" > Elevator:<input type="checkbox" name="Elevator" onChange={this.handleElevatorChange}/></h5> 
                        <h5 className="message" > Living room:<input type="checkbox" name="LivingRoom" onChange={this.handleLivingRoomChange}/></h5> 
                        <h5 className="message">Specify rules:</h5> 
                        <h5 className="message" > Smoking:<input type="checkbox" name="Smoking"  onChange={this.handleSmokingChange}/></h5> 
                        <h5 className="message" > Pets:<input type="checkbox" name="Pets"  onChange={this.handlePetsChange}/></h5> 
                        <h5 className="message" > Events:<input type="checkbox" name="Events"  onChange={this.handleEventsChange}/></h5> 
                        <h5 className="message" > Minimum nights:<input name="min_nights" onChange={this.handleMinNightsChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["min_nights"]}</span>
                        <button className="apply">Add a room</button>
                    </form>
                    </div>
                }else{
                    disapproved_msg = <h1 className="message">You don't have permission to access this page yet, please be patient</h1>
                }
            }


        }

        if(login_check === false || !this.props.app_state.isHost){
            denial = <h1 className="message">You can't access this page!</h1>
        }

        return(
            <div>
                {approved_msg}
                {disapproved_msg}
                {denial}
                
            </div>
        )
    }

}

export default HostPage