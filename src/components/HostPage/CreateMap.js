// @flow
import React from 'react';
import {Component} from 'react';

//import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styled from 'styled-components'


const Wrapper = styled.div`width: ${props => props.width}; height: ${props => props.height}`

class CreateMap extends Component{

    constructor(props){
        super(props)

        this.onMapClick = this.onMapClick.bind(this)
    }

    onMapClick(e) {
         console.log(e.latlng.lat)
         console.log(e.latlng.lng) 
         
          let popup = L.popup();

          popup
         .setLatLng(e.latlng)
         .setContent("You have specified the coordinates of this room at " + e.latlng.toString())
         .openOn(this.map);
         
         this.props.form_state.handleGeoChange(e.latlng) 
    }
    

    componentDidMount(){

        this.map = L.map('map',{center:[37.98,23.72],zoom:6,zoomControl:false})
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map)

        this.map.on('click', this.onMapClick);
        
    }

    render(){
        return(<Wrapper width="600px" height="400px" id="map" />  )
    }


}

export default CreateMap