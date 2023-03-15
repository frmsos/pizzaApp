import {React, useEffect, useState} from 'react';
import Gmap from './Gmap';



const Address = (props) => {


    const [isEditMode, setIsEditMode] = useState(null);
    const [finalAddr, setFinalAddr] = useState('tete');
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    

    
    useEffect ( () =>{
        setIsEditMode(props.opMode === 'edit')
        console.log('useeff in address comp flag', props.flag)
    },[ props.opMode, props.addrID, isEditMode, props.isChanged]

    )

    return (
        <div>
            <Gmap finalAddr={finalAddr} setFinalAddr={setFinalAddr} setLat={setLat} setLng={setLng} isEditMode={isEditMode} userID={props.userId} addrID={props.addrID} 
            vectorAddrIndex={props.vectorAddrIndex} addresses={props.addresses} flag={props.flag} setFlag={props.setFlag} isChanged={props.isChanged}  setIsChanged={props.setIsChanged}/>
        </div>
    )
}

export default Address