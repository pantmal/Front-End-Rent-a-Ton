import React from 'react';
import {Component} from 'react';

import './home.css'

class Home extends Component{

    constructor(props){
        super(props)

        this.state = {
            hood: '',
            city: '',
            country: '',
            s_date: '',
            e_date: '',
            people: '',
            errors: {}
        }

        this.handleHoodChange = this.handleHoodChange.bind(this)
        this.handleCityChange = this.handleCityChange.bind(this)
        this.handleCountryChange = this.handleCountryChange.bind(this)
        this.handleStartDateChange = this.handleStartDateChange.bind(this)
        this.handleEndDateChange = this.handleEndDateChange.bind(this)
        this.handlePeopleChange = this.handlePeopleChange.bind(this)
        this.handleSearchFormSubmit = this.handleSearchFormSubmit.bind(this)
    }

    handleHoodChange = event => {
        const form_hood = event.target.value
        this.setState({
            hood: form_hood
        })
    }

    handleCityChange = event => {
        const form_city = event.target.value
        this.setState({
            city: form_city
        })
    }

    handleCountryChange = event => {
        const form_country = event.target.value
        this.setState({
            country: form_country
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
            people: form_people
        })
    }

    handleValidation(){
        
        let errors = {};
        let formIsValid = true;

        if(this.state.hood == ''){
           formIsValid = false;
           errors["hood"] = "\u2757Cannot be empty";
        }

        if(this.state.hood != ''){
            if(!this.state.hood.match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["hood"] = "\u2757Only letters";
            }        
        }

        if(this.state.city == ''){
            formIsValid = false;
            errors["city"] = "\u2757Cannot be empty";
        }

        if(this.state.city != ''){
            if(!this.state.city.match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["city"] = "\u2757Only letters";
            }        
        }

        if(this.state.country == ''){
            formIsValid = false;
            errors["country"] = "\u2757Cannot be empty";
        }

        if(this.state.country != ''){
            if(!this.state.country.match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["country"] = "\u2757Only letters";
            }        
        }

        if(this.state.s_date == ''){
            formIsValid = false;
            errors["s_date"] = "\u2757Cannot be empty";
        }

        if(this.state.e_date == ''){
            formIsValid = false;
            errors["e_date"] = "\u2757Cannot be empty";
        }

        if (this.state.s_date != ''  && this.state.e_date != ''){
            let start_date = this.state.s_date
            let end_date = this.state.e_date

            let s_date_split = start_date.split("-");
            let e_date_split = end_date.split("-");

            let start_year = parseInt(s_date_split[0])
            let start_month = parseInt(s_date_split[1])
            let start_day = parseInt(s_date_split[2])

            let end_year = parseInt(e_date_split[0])
            let end_month = parseInt(e_date_split[1])
            let end_day = parseInt(e_date_split[2])
            
            if(start_year > end_year){
                formIsValid = false;
                errors["e_date"] = "\u2757End date must be after the starting date!";
            }

            if(start_year === end_year){
                if(start_month > end_month){
                    formIsValid = false;
                    errors["e_date"] = "\u2757End date must be after the starting date!";
                }
                if(start_month === end_month){
                    if(start_day > end_day){
                        formIsValid = false;
                        errors["e_date"] = "\u2757End date must be after the starting date!";
                    }
                }
            }

        }


        if(this.state.people == ''){
            formIsValid = false;
            errors["people"] = "\u2757Cannot be empty";
        }

        if(this.state.people != ''){
            if(!this.state.people.match(/^[0-9]+$/)){
                formIsValid = false;
                errors["people"] = "\u2757Only numbers";
            }        
        }

        this.setState({errors: errors});

        return formIsValid;
    }

    handleSearchFormSubmit = event => {
        event.preventDefault()

        if(this.handleValidation()){
            this.proceedSubmission()
        }

    }

    proceedSubmission(){
        console.log(this.state)

        let search_values
        search_values = `hood=${this.state.hood}&city=${this.state.city}&country=${this.state.country}&start_date=${this.state.s_date}&end_date=${this.state.e_date}&people=${this.state.people}`

        this.props.history.push({pathname:'/search/', search: search_values})
    }
    
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

            user_message = <h1 className="message"> <span> Congrats you are loggin in as {role} </span> </h1>       

        }else{
            anon_message = <h1 className="message"> Welcome anon user </h1>
        }

        if(login_check === false || this.props.app_state.isRenter){
            search = <div>
                <h1 className="message"> You may search for rooms by filling in the form: </h1>
                <form onSubmit={this.handleSearchFormSubmit}>
                        <h2 className="message"> Enter neighborhood name here:<input name="hood" onChange={this.handleHoodChange} /></h2> 
                        <span style={{color: "red"}}>{this.state.errors["hood"]}</span>
                        <h2 className="message"> Enter city name here:<input name="city" onChange={this.handleCityChange} /></h2>
                        <span style={{color: "red"}}>{this.state.errors["city"]}</span>
                        <h2 className="message"> Enter country name here:<input name="country" onChange={this.handleCountryChange} /></h2>
                        <span style={{color: "red"}}>{this.state.errors["country"]}</span>
                        <h2 className="message"> Enter starting date here:<input type="date" name="start_date" onChange={this.handleStartDateChange} /></h2>
                        <span style={{color: "red"}}>{this.state.errors["s_date"]}</span>
                        <h2 className="message"> Enter ending date here:<input type="date" name="end_date" onChange={this.handleEndDateChange} /></h2>
                        <span style={{color: "red"}}>{this.state.errors["e_date"]}</span>
                        <h2 className="message"> Enter number of people here:<input name="people" onChange={this.handlePeopleChange} /></h2>
                        <span style={{color: "red"}}>{this.state.errors["people"]}</span>
                        <br/>
                        <button className="apply">Search</button>
                    </form>
                    <h4 className="message">or</h4>
                    <button className="apply">Recommend me something</button>
                </div> 
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