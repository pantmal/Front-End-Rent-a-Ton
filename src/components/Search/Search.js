import React from 'react';
import {Component} from 'react';
import ReactPaginate from 'react-paginate';

import queryString from 'query-string'

import axios from '../AXIOS_conf'

import './search.css'

class Search extends Component{

    constructor(props){
        super(props)

        const search_values = queryString.parse(this.props.location.search)
        

        this.state = {
            hood: search_values.hood,
            city: search_values.city,
            country: search_values.country,
            s_date: search_values.start_date,
            e_date: search_values.end_date,
            people: search_values.people,
            offset: 0,
            users: [],
            perPage: 1,
            currentPage: 0,
            not_found: false,
            room_type: '',
            max_price: '',
            wifi: false,
            freezer: false,
            heating: false,
            kitchen: false,
            TV: false,
            parking: false,
            elevator: false,
            receivedData: this.receivedData
        }

        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleMaxPriceChange = this.handleMaxPriceChange.bind(this);
        this.handleWiFiChange = this.handleWiFiChange.bind(this);
        this.handleFreezerChange = this.handleFreezerChange.bind(this);
        this.handleHeatingChange = this.handleHeatingChange.bind(this);
        this.handleKitchenChange = this.handleKitchenChange.bind(this);
        this.handleTVChange = this.handleTVChange.bind(this);
        this.handleParkingChange = this.handleParkingChange.bind(this);
        this.handleElevatorChange = this.handleElevatorChange.bind(this);
    }

    handleRadioChange = (event) => {
        this.setState({
          room_type: event.target.value
        });
    }

    handleMaxPriceChange = event => {
        const form_price = event.target.value
        this.setState({
            max_price: form_price
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

    
    receivedData() {
        axios.post('/rooms/search/',JSON.stringify(this.state), {headers: { //change the data being sent
            'Content-Type': 'application/json'
          }})
            .then(res => {

                if (res.data==='not found'){
                    this.setState({
                        not_found: true
                    })
                }else{
                

                //check results if picture is null
                const data = res.data;
                let count = 0
                const price_data = data.map(d =>
                    ({ ...d,
                    total_price: d.price + ((this.state.people-1) * d.price_per_person)})
                    )
                
                
                price_data.sort( (a, b) => parseFloat(a.total_price) - parseFloat(b.total_price) )
                console.log(price_data)
                const slice = price_data.slice(this.state.offset, this.state.offset + this.state.perPage)
                console.log(slice)
                const postData = slice.map(pd =>
                //add a message if it's him!
                //this url shit will change hopefully
                <React.Fragment>
                    <p className="message">Name: {pd.name}</p> 
                    <img src={"http://localhost:8000"+pd.rep_photo} style={{width:250,height: 250}} alt=""/> 
                    <p className="message">Type: {pd.room_type}</p>
                    <p className="message">Beds: {pd.beds}</p>
                    <hr/>
                </React.Fragment>)

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    postData
                })
                
            }
        })
    }

    componentDidMount(){
        this.receivedData()
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset,
            receivedData: this.receivedData()
        });

    };

    handleExtraFormSubmit = event => {
        event.preventDefault()

        let search_values
        search_values = `${this.props.location.search}`

        if(this.state.room_type !== ''){
            search_values += `&type=${this.state.room_type}`
        }

        if(this.state.max_price !== ''){
            search_values += `&max_price=${this.state.max_price}`
        }

        if(this.state.wifi !== false){
            search_values += `&wifi=${this.state.wifi}`
        }

        if(this.state.freezer !== false){
            search_values += `&freezer=${this.state.freezer}`
        }

        if(this.state.heating !== false){
            search_values += `&heating=${this.state.heating}`
        }

        if(this.state.kitchen !== false){
            search_values += `&kitchen=${this.state.kitchen}`
        }

        if(this.state.TV !== false){
            search_values += `&TV=${this.state.TV}`
        }

        if(this.state.parking !== false){
            search_values += `&max_price=${this.state.parking}`
        }

        if(this.state.elevator !== false){
            search_values += `&elevator=${this.state.elevator}`
        }

        console.log(search_values)
    }


    render(){
        let paginate = 
                
                <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                            forcePage={this.state.currentPage}
                />

        
        let not_found_msg = <h1 className="message">Sorry, nothing found</h1>

        let permission = false
        if (this.props.app_state.isRenter || !this.props.app_state.isLoggedIn){
            permission = true
        }

        if(!permission){
            return(
                <h1 className="message">You can't access this page!</h1>
            )
        }else{

            if (this.state.not_found === false){
                
                return(
                    <div>
                        <h1 className="message"> You may include additional filters here: </h1>
                            
                            <form onSubmit={this.handleExtraFormSubmit}>
                            <div className="radio">
                            <h5 className="message"> Choose room type here:</h5> 
                            <h5 className="message">Private Room<input type="radio" value="Private_room" name="room_type" checked={this.state.room_type === "Private_room"} onChange={this.handleRadioChange}/>  </h5>
                            <h5 className="message">Shared Room <input type="radio" value="Shared_room" name="room_type"  checked={this.state.room_type === "Shared_room"} onChange={this.handleRadioChange}/> </h5>
                            <h5 className="message">Entire home/apt <input type="radio" value="Entire_home/apt" name="room_type" checked={this.state.room_type === "Entire_home/apt"} onChange={this.handleRadioChange} /> </h5>
                            </div>
                            <div className="price">
                            <h5 className="message"> Enter max price here:<input name="max_price" onChange={this.handleMaxPriceChange} /></h5>
                            </div>
                            <div className="wifi">
                            <h5 className="message" > WiFi:<input type="checkbox" name="WiFi" onChange={this.handleWiFiChange}/></h5> 
                            </div>
                            <div className="freezer">
                            <h5 className="message" > Freezer:<input type="checkbox" name="Freezer" onChange={this.handleFreezerChange}/></h5> 
                            </div>
                            <div className="heating">
                            <h5 className="message" > Heating:<input type="checkbox" name="Heating" onChange={this.handleHeatingChange}/></h5> 
                            </div>
                            <div className="kitchen">
                            <h5 className="message" > Kitchen:<input type="checkbox" name="Kitchen" onChange={this.handleKitchenChange}/></h5> 
                            </div>
                            <div className="tv">
                            <h5 className="message" > TV:<input type="checkbox" name="TV" onChange={this.handleTVChange}/></h5> 
                            </div>
                            <div className="parking">
                            <h5 className="message" > Parking:<input type="checkbox" name="Parking" onChange={this.handleParkingChange}/></h5> 
                            </div>
                            <div className="elevator">
                            <h5 className="message" > Elevator:<input type="checkbox" name="Elevator" onChange={this.handleElevatorChange}/></h5> 
                            </div>
                            <br/>
                            
                            <button className="apply-with">Search with additional filters</button>
                    </form>

                        {paginate}
                        {this.state.postData}
                        {paginate}
                    </div>
                )

            
            }else{
                
                return(
                    <div>
                    {not_found_msg}
                    </div>
                )

            }
        }

        
        
        
    }



}

export default Search