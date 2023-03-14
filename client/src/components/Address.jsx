import {React, useEffect, useState} from 'react';
import Gmap from './Gmap';



const Address = (props) => {


    const [isEditMode, setIsEditMode] = useState(null);
    const [finalAddr, setFinalAddr] = useState('tete');
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [flag, setFlag] = useState(false);
    

    
    useEffect ( () =>{
        setIsEditMode(props.opMode === 'edit')
    },[ props.opMode, props.addrID, isEditMode, props.isChanged]

    )

    return (
        <div>
            <Gmap finalAddr={finalAddr} setFinalAddr={setFinalAddr} setLat={setLat} setLng={setLng} isEditMode={isEditMode} userID={props.userId} addrID={props.addrID} 
            vectorAddrIndex={props.vectorAddrIndex} addresses={props.addresses} flag={flag} setFlag={setFlag} isChanged={props.isChanged}  setIsChanged={props.setIsChanged}/>
        </div>
    )
}

export default Address