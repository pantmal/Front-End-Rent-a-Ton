// @flow
import React from 'react';
import {Component} from 'react';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import L from 'leaflet'
import 'leaflet-defaulticon-compatibility';
import styled from 'styled-components'


const Wrapper = styled.div`width: ${props => props.width}; height: ${props => props.height}`

class ViewMap extends Component{

    constructor(props){
        super(props)

        this.popupPop = this.popupPop.bind(this)
    }

    popupPop(e){

        let marker = L.marker([this.props.form_state.lat, this.props.form_state.lng]).addTo(this.map);
        marker.bindPopup("This is the room's location.").openPopup();

    }
    

    componentDidMount(){

        
        this.map = L.map('map',{center:[58,16],zoom:6,zoomControl:false})
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map)


        //let marker = L.marker([this.props.form_state.lat, this.props.form_state.lng]).addTo(this.map);
        //marker.bindPopup("This is your original location.").openPopup()
        this.map.on('mouseover', this.popupPop);

        
    }

    render(){
        return(<Wrapper width="600px" height="400px" id="map" />  )
    }


}

export default ViewMap