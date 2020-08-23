import React from 'react';
import {Component} from 'react';

import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';

import axios from '../AXIOS_conf'


class MessageList extends Component{


    constructor(props) {
        super(props);

        let sender_mode = false
        
        let query = this.props.match.params
        if (query.parameters!=null){
            
        
            let split_params = query.parameters.split('=')
            if(split_params[1]==='sent'){
                sender_mode = true
            }else{
                sender_mode = false
            }
        }


        //sort by date
        this.state = {
            sender_mode: sender_mode,
            not_found: false,
            username: '',
            offset: 0,
            users: [],
            perPage: 10,
            currentPage: 0,
            receivedData: this.receivedData
        };

        
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleSentButton = this.handleSentButton.bind(this);
        this.handleReceivedButton = this.handleReceivedButton.bind(this);
    }

    receivedData() {


        let data
        if(this.state.sender_mode){
            data = {
                type: 'sent',
                id: this.props.app_state.user_primary_key
            }
            axios.post(
                'users/getMessages/', JSON.stringify(data), {headers: {
                    'Content-Type': 'application/json'/*,
                    Authorization: `JWT ${localStorage.getItem('storage_token')}`*/
                }}
            ).then( response => {
                if (response.data==='not found'){
                    this.setState({
                        not_found: true
                    })
                }else{
                    const data = response.data;
                    console.log(data)
                    const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)    
                
                    const postData = slice.map(pd =>
                    <React.Fragment>
                        <Link to={`/userMessageDetail/${pd.pk}`}> <p>Title: {pd.title}</p> </Link>
                        <p className="message">Sent to: {pd.receiver_name}</p>
                        <hr/> 
                    </React.Fragment>)
    
                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        postData
                    })
                }
            }).catch(error => {
                console.log(error.response)
                alert('Some kind of error occured...')
            })
        }else{
            data = {
                type: 'rec',
                id: this.props.app_state.user_primary_key
            }
            axios.post(
                'users/getMessages/', JSON.stringify(data), {headers: {
                    'Content-Type': 'application/json'/*,
                    Authorization: `JWT ${localStorage.getItem('storage_token')}`*/
                }}
            ).then( response => {
                if (response.data==='not found'){
                    this.setState({
                        not_found: true
                    })
                }else{
                    const data = response.data;
                    const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    const postData = slice.map(pd =>
                    <React.Fragment>
                        <Link to={`/userMessageDetail/${pd.pk}`}> <p>Title: {pd.title}</p> </Link>
                        <p className="message"> Sent by: {pd.sender_name}</p>
                        <hr/> 
                    </React.Fragment>)
    
                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        postData
                    })
                }
            }).catch(error => {
                console.log(error.response)
                alert('Some kind of error occured...')
            })
        }


    }


    handlePageClick = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset,
            receivedData: this.receivedData()
        });

    };

    componentDidMount() {
        this.receivedData()
    }

    handleSentButton = event =>{
        this.props.history.push({pathname:'/userMessages/type=sent'})
        window.location.reload();
    }

    handleReceivedButton = event =>{
        this.props.history.push({pathname:'/userMessages/type=rec'})
        window.location.reload();
    }
    
    render(){

        if(this.props.app_state.isRenter || this.props.app_state.isHost){

            let create_str = <h1 className="message">You may click  <Link to={'/createMessage/'}><span>here</span> </Link> to create a new message </h1>
            let sent = <button className="apply" onClick={this.handleSentButton}>Go to Sent</button>
            let received = <button className="apply" onClick={this.handleReceivedButton}>Go to Received</button>

            let not_found_msg 
            let paginate 
            let results
            if (this.state.not_found === false){
                
                paginate = 
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
            

            
                results =         
                    <div>
                        
                        {paginate}
                        {this.state.postData}
                        {paginate}
                    </div>
            

            }else{
                not_found_msg = <h1 className="message">Sorry, nothing found</h1>
            }

            return(
                <div>
                {create_str}
                {sent}
                {received}
                {results}
                {not_found_msg}
                </div>
            )

        }else{
            return(<h1 className="message" >You can't access this page!</h1>)
        }

        
    }

}

export default MessageList