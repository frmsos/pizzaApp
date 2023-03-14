

import { useState, useMemo, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
    } from "use-places-autocomplete";
    import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import {Button, Box, Card, CardContent} from '@mui/material';
import axios from "axios";
import config from "./config";

export default function Gmap(props) {
    const [center,setCenter] = useState({lat:-25.282508980118497, lng:-57.566180347549604});
    const [selected, setSelected] = useState(null);
    const [addr, setAddr] = useState(null);
    const {isEditMode} = props;
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBDFQYW8P-FqcBBtncBaqwP8V8nKy5Ysf8",
        libraries: ["places"],
    });




    const onClick = async(e) =>{
        e.preventDefault();
        const userID = await JSON.parse(window.localStorage.getItem('userID'));
        console.log('place selected', addr, selected, isEditMode, userID, props.addrID)
        if( !isEditMode){
            console.log('oi')
            axios.post(`${config.url}/api/pizzapp/users/addresses/${userID}`, 
            {
                addresses: {
                    street: addr,
                    lat: selected.lat,
                    lng: selected.lng
                },
            }, {withCredentials:true }
            )
            .then( (response) => {
                console.log('onsub', response.data);
                props.setShowAddr("doNotShowAddr")
                //alert('afae')

            } )
            .catch( (errorMsg) =>{
                console.log('errrrorrr log', errorMsg)
            }  )
        }
        else{
            axios.put(`${config.url}/api/pizzapp/users/address/${userID}/${props.addrID}`, 
            {
                addresses: {
                    street: addr,
                    lat: selected.lat,
                    lng: selected.lng
                },
            }, {withCredentials:true }
            )
            .then( (response) => {
                console.log('onsub', response.data);
                props.setShowAddr("doNotShowAddr")
                //alert('afae')

            } )
            .catch( (errorMsg) =>{
                console.log('errrrorrr log', errorMsg)
            }  )
        }
    }




    
    const PlacesAutocomplete = () => {
        const {
            ready,
            value,
            setValue,
            suggestions: { status, data },
            clearSuggestions,
        } = usePlacesAutocomplete();
    
        const handleSelect = async (address) => {
            setValue(address, false);
            clearSuggestions();
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            setSelected({ lat, lng });
            setCenter({lat:lat, lng:lng})
            setAddr(address);
            console.log('address is: ', selected);
        };

        useEffect( ()=>{
            console.log('in useff in gmap component', isEditMode)
            if(isEditMode){
                console.log('gmap is edit mode', isEditMode, (props.addresses[props.vectorAddrIndex].lat),  (props.addresses[props.vectorAddrIndex].lng));
                //setAddr(props.addresses[props.vectorAddrIndex].street)
               // 
                if(!props.flag){
                    setCenter({lat:props.addresses[props.vectorAddrIndex].lat, lng:props.addresses[props.vectorAddrIndex].lng});
                    setSelected({lat:props.addresses[props.vectorAddrIndex].lat, lng:props.addresses[props.vectorAddrIndex].lng});
                    setAddr(props.addresses[props.vectorAddrIndex].street)
                    props.setFlag(true);
                }

            }
        },[])
    
        return (
            <Combobox onSelect={handleSelect} style={{padding:10, display:'block'}}>
            <ComboboxInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready}
                className="combobox-input"
                placeholder="Ingrese una dirección"
                style={{width:550, height:50, padding:2, marginBottom:30}}
            />
            <ComboboxPopover>
                <ComboboxList>
                {status === "OK" &&
                    data.map(({ place_id, description }) => (
                    <ComboboxOption key={place_id} value={description} />
                    ))}
                </ComboboxList>
            </ComboboxPopover>
            </Combobox>
        );
        };


        function Map() {
            

            //props.setFinalAddr(addr)
        
            return (
                
                <div id="map-page-container">
                    <div style={{padding:20, margin:15}}>
                        <h1>
                            Seleccionar dirección
                        </h1>
                        <div>
                            <div className="places-container" style={{display:'block'}}>
                                <PlacesAutocomplete/>
                            </div>
                            <GoogleMap
                                zoom={15}
                                center={center}
                                mapContainerClassName="map-container"
                            >
                                
                            {selected && <Marker position={selected}  />}
                            
                            </GoogleMap>
                        </div>
                    </div>
                    <div style={{padding:20, margin:15}}>
                        <h1>
                            Dirección marcada
                        </h1>
                        <Box sx={{ maxWidth: 390, mt:4 }}>
                        <Card variant="outlined">
                            <CardContent>
                                Direccion: {addr}
                            </CardContent>
                        </Card>
                    </Box>
                    <Button  variant="contained" color="success" onClick={e=>onClick(e)} size="small" sx={{m:2}} > { isEditMode ? 'Modificar' : 'Añadir'  }</Button> 
                    </div>
                </div>
            );
            }
        
        



    

    if (!isLoaded) return <div>Loading...</div>;
    return <Map />;
    }



