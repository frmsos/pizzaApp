import {React, useEffect, useState} from 'react';
import {Avatar, Button, CssBaseline, TextField, Paper, Box, Autocomplete, Grid, Typography, IconButton, Alert, Stack} from '@mui/material';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import config from './config';
import Gmap from './Gmap';





const Address = (props) => {


    const [isEditMode, setIsEditMode] = useState(null);
    const [finalAddr, setFinalAddr] = useState('tete');
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [flag, setFlag] = useState(false);


    const onClick = (e) =>{
        e.preventDefault();
        console.log('onsubmit');
        // if( !isEditMode){
        //     axios.post(`${config.url}/api/pizzapp/users/addresses/${props.userID}`, 
        //     {
        //         addresses: {
        //             street: data.street,
        //             city: data.city,
        //             state: data.state
        //         },
        //     }, {withCredentials:true }
        //     )
        //     .then( (response) => {
        //         console.log('onsub', response.data);
        //         props.setShowAddr("doNotShowAddr")
        //         //alert('afae')

        //     } )
        //     .catch( (errorMsg) =>{
        //         console.log('errrrorrr log', errorMsg)
        //     }  )
        // }
        // else{
        //     axios.put(`${config.url}/api/pizzapp/users/address/63fab4f8fb63ef81fd959442/${props.addrID}`, 
        //     {
        //         addresses: {
        //             street: data.street,
        //             city: data.city,
        //             state: data.state
        //         },
        //     }, {withCredentials:true }
        //     )
        //     .then( (response) => {
        //         console.log('onsub', response.data);
        //         props.setShowAddr("doNotShowAddr")
        //         //alert('afae')

        //     } )
        //     .catch( (errorMsg) =>{
        //         console.log('errrrorrr log', errorMsg)
        //     }  )
        // }
    }

    
    //console.log('addr id is:' , props.addrID, props.addresses[props.vectorAddrIndex].street);
    
    useEffect ( () =>{
        console.log('herjeee')
        setIsEditMode(props.opMode === 'edit')
        console.log('bool', isEditMode)
  },[ props.opMode, props.addrID, isEditMode]

    )

    return (
        <div>
            <Gmap finalAddr={finalAddr} setFinalAddr={setFinalAddr} setLat={setLat} setLng={setLng} isEditMode={isEditMode} userID={props.userId} addrID={props.addrID} vectorAddrIndex={props.vectorAddrIndex} addresses={props.addresses} flag={flag} setFlag={setFlag}/>
        </div>
    )
}

export default Address