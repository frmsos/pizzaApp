

import { useState, useMemo } from "react";
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
import Navbar from './Navbar';
import {Avatar, Button, CssBaseline, TextField,  Paper, Box, Grid, Typography, IconButton, Alert, Stack, Card, CardContent} from '@mui/material';

export default function Places() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBDFQYW8P-FqcBBtncBaqwP8V8nKy5Ysf8",
        libraries: ["places"],
    });
    
    const PlacesAutocomplete = ({ setSelected, setCenter, setAddr, addr } ) => {
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
            setAddr(address)
            console.log('address is: ', addr, lat, lng)
        };
    
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
            const [center,setCenter] = useState({lat:-25.282508980118497, lng:-57.566180347549604});
            const [selected, setSelected] = useState(null);
            const [addr, setAddr] = useState(null);
        
            return (
                
                <div id="map-page-container">
                    <div style={{padding:20, margin:15}}>
                        <h1>
                            Seleccionar dirección
                        </h1>
                        <div>
                            <div className="places-container" style={{display:'block'}}>
                                <PlacesAutocomplete setSelected={setSelected} setCenter={setCenter}  setAddr={setAddr} addr={addr} />
                            </div>
                            <GoogleMap
                                zoom={15}
                                center={center}
                                mapContainerClassName="map-container"
                            >
                                {selected && <Marker position={selected} />}
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
                    </div>
                </div>
            );
            }
        



    

    if (!isLoaded) return <div>Loading...</div>;
    return <Map />;
    }



