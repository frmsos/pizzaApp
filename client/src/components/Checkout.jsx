import {React, useEffect, useState, useContext} from 'react';
import Navbar from './Navbar';
import { userAuth } from '../contexts/userAuth';
import axios from 'axios';
import { Button,  Box,  Typography, Alert, Stack, CardActions, CardContent} from '@mui/material';
import {useForm} from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {  useNavigate } from 'react-router-dom';
import config from './config';
import Address from './Address';



//FUNCTIONS DECLARATION

const Checkout = (props) => {
    //VARIABLES DECLARATION
    // eslint-disable-next-line
    const {isLoggedIn, setIsLoggedIn, setCartPressed, cart, setCart, setUserID, userID, totalCost} = useContext(userAuth);
    const [addresses, setAddresses] = useState({});
    // eslint-disable-next-line
    const states = [ {label: 'Alto Paraguay' }, {label: 'Alto Paraná'}, {label: 'Amambay'}, {label: 'Asunción - Capital'}, {label: 'Boquerón'} , 
    {label: 'Caaguazú'}  , {label: 'Caazapá'}, {label: 'Canindeyú'} ,  {label:'Central'},  {label:'Concepción'},  {label:'Cordillera'}, 
    {label:'Guairá'},  {label:'Itapúa'},  {label:'Misiones'},  {label:'Ñeembucú'},  {label:'Paraguarí'},  {label:'Presidente Hayes'},  {label:'San Pedro'} ];
    // eslint-disable-next-line
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [showAddr, setShowAddr] = useState("doNotShowAddr");
    const [opMode, setOpMode] = useState(null);
    const [addrID, setAddrID] = useState(0);
    const [vectorAddrIndex, setVectorAddrIndex] = useState(null);
    const [isAddr, setIsAddr] = useState(false);
    const [indexAddr, setIndexAddr] = useState();
    let isDelivery = true;
    const [open, setOpen] = useState(false);
    const [placeOrderOK, setPlaceOrderOK] = useState(false);
    const [placeOrderNotOK, setPlaceOrderNotOK] = useState(false);
    const [iniAddr, setIniAddr] = useState(false);
    const navigate = useNavigate();
    const [isChanged, setIsChanged] = useState(false);
    const [flag, setFlag] = useState(false);


    //funciones que manejan el cuadro de dialogo que se abre si es que no se completan los campos obligatorios.
    const handleClickOpen = () => {
        setOpen(true);
        };
    
        const handleClose = () => {
        setOpen(false);
        };

    //funcion que maneja los campos de direcciones, tiene dos metodos de trabajo, si se presiona agregar o editar la direccion
    //recibe el modo de operacion, id de la direccion que se recupera de la base de datos y el indice del map
    const handleClickAddAddress = (e, opMode, addressID, index) =>{
        e.preventDefault();
        //si se desea agregar, se coloca el modo de op en add

        setShowAddr("showAddr");
        if(opMode === 'add'){
            setOpMode('add');
        }
        else{
            //si se desea editar, se modifica el op mode, se guarda el id de la direccion y el indice del vector de direcciones para luego reemplazarlo.
            if(opMode === 'edit'){
                setOpMode('edit');
                setAddrID(addressID);
                setVectorAddrIndex(index);
                console.log('checkout compn addrid is',addrID)
            }
        }
        setFlag(false);

    }
    //funcion para comparar el indice del vector con la direccion seleccionada por el usuario contra el indice del vector iterando
    //retorna verdadero si coincide, es para marcar el rojo el cuadro cuando el user lo selecciona.

    const isChosenAddr = (index)=>{
        return indexAddr === index
    }
    
    //funcion handlePlaceOrder se encarga de hacer el POST con los datos de la orden realizada por el user.


    const handlePlaceOrder = ( e ) =>{
        //e.preventDefault();
        console.log('place order', cart, isDelivery)

        if(isAddr || !isDelivery){
            axios.post(`${config.url}/api/pizzapp/order`, 
            {
                userID: userID,
                typeOrder: cart.typeOrder,
                address: cart.address,
                items: cart.items
            },{withCredentials:true }
            )
            .then( (response) => {
                console.log('orden exitosa', response.data);
                window.localStorage.removeItem("itemCount");
                window.localStorage.removeItem("requestItem");
            // window.localStorage.setItem([]);
                //para desplegar o no las alertas de exito de carga de la orden
                setPlaceOrderOK(true);
                setPlaceOrderNotOK(false);
                //al hacer el pedido se limpia el local storage
                setTimeout(() => { navigate('/home');}, 2500);

            } )
            .catch( (errorMsg) =>{
                console.log('orden error', errorMsg);
                setPlaceOrderOK(false);
                setPlaceOrderNotOK(true);
            }  )
        }
        else{
            handleClickOpen();
        }
    }

    //funcion que maneja el boton elegir que presiona el user
    //recibe el evento, la direccion elegida y el indice del vector de direcciones donde se ubica.
    const handleChooseAddr = (e, chooseAddr, index) =>{
        e.preventDefault();
        console.log('choose addr', chooseAddr.street);
        if(chooseAddr.street !== undefined && chooseAddr.street !== null){
        //Formar vector final de orden
        setCart( {...cart, address: chooseAddr}  )
        console.log('cart is', cart)
        // se actualiza un estado para que indica que se eligio una direccion y se guarda el indice de la dir elegida.
        setIsAddr(true); //para validar que no se envie una orden con el campo de direcciones vacio
        setIndexAddr(index);
        }
        else{
            console.log('false is addr')
            setIsAddr(false);
        }
        
    }

    const handleDelAddr = (e, addrID) =>{
      //  e.preventDefault();
        console.log('handle del addr')
        axios.post(`${config.url}/api/pizzapp/users/del/address/${userID}/${addrID}`,{withCredentials : true}) 
        .then(response => setAddresses(response.data.user.addresses))
        .catch(error => console.log('error on edit page submit', error));
        setIsChanged(!isChanged);
    }

    const handleCancel = e =>{
        e.preventDefault();
        window.localStorage.removeItem("itemCount");
        window.localStorage.removeItem("requestItem");
        setTimeout(() => { navigate('/home');}, 2500);

    }


    // valida si la orden es del tipo delievery o carryout
    isDelivery = (cart.typeOrder === 'Delivery' )
    console.log('is del value', cart, isDelivery);
    useEffect( ()=> {
        console.log('use ef in checkout')
        if( userID !==0 ){
            axios.get(`${config.url}/api/pizzapp/users/${userID}`,{withCredentials : true}) 
            .then(response => {
                setAddresses(response.data.user.addresses)
                if( response.data.user.addresses.length !==0 && response.data.user.addresses[0].street !== undefined && response.data.user.addresses[0].street !== null ){
                    setIniAddr(true)
                }
                else{
                    setIniAddr(false);
                }
            })
            .catch(error => console.log('error on edit page submit', error));
            console.log( 'useeefecttt', addresses)


        }
        else{
            setUserID(JSON.parse(window.localStorage.getItem('userID')))
        }

         // eslint-disable-next-line
    },[userID,isDelivery, cart.type, isChanged]

    


    )
    return (
        <div>

        <Stack sx={{ width: '100%' }} spacing={2}>
            { placeOrderNotOK ?  <Alert severity="error">Error: verifique los datos introducidos y vuelva a probar</Alert> : null} 
            { placeOrderOK ? <Alert severity="success">Orden procesada, redirigiendo a la página principal</Alert> : null}
        </Stack>

        <Navbar itemCount={props.itemCount} setItemCount={props.setItemCount}/>

            <div>

            <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                    {"Complete los campos obligatorios"}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Debe seleccionar una de las direcciones de envío para proceder con su pedido.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        OK
                    </Button>
                    </DialogActions>
                </Dialog>

            </div>


            
                
                    <div>
                        <div className='containerPage'>
                        { isDelivery ?  
                        <div>
                        <div className='containerSides'>
                                <Box sx={{m:2}}>
                                    <Typography variant='h4' sx={{fontWeight:'bold', m:2} }> Dirección de envío </Typography>
                                    { iniAddr ?  <Typography variant='body1' sx={{fontWeight:'normal', m:4} }> Favor seleccionar una dirección de envío: </Typography> : <span style={{color: 'red'}}> Presione Editar para agregar una direcciòn de envío</span> }
                                    {   addresses.length > 0 ? 
                                            addresses.map(  (address, index) => {
                                                return(
                                                    <Box sx={{ minWidth: 275 }} id={ isChosenAddr(index) ? "addrChoose"  : 'notchoose' }>
                                                        <CardContent>
                                                            <Typography variant="h5" component="div">
                                                                {`Dirección ${index + 1}`}
                                                            </Typography>
                                                            
                                                            <Typography variant="body2">
                                                                Calle: {address.street}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardActions>
                                                            <Button size="small" onClick={e=> handleChooseAddr(e, address, index)}>Elegir</Button>
                                                            <Button size="small" onClick={e=> handleClickAddAddress(e, "edit", address._id, index)}>Editar</Button>
                                                            <Button size="small" onClick={e=> handleDelAddr(e, address._id)}>Quitar</Button>
                                                        </CardActions>
                                                    </Box>
                                                )
                                            } )
                                            
                                        : null  }
                                        {iniAddr ? <Button size="small" variant="contained" color="success" sx={{m:2}} onClick={ e=> handleClickAddAddress(e, "add")}>Añadir nueva</Button>  : null }
                                        
                                    </Box>
                            </div>
                        <div className='containerSides' id={showAddr}>
                            <Address  showAddr={showAddr} setShowAddr={setShowAddr} opMode={opMode} addrID={addrID} vectorAddrIndex={vectorAddrIndex} addresses={addresses} userID={userID} 
                            cart={cart} setCard={setCart} isChanged={isChanged} setIsChanged={setIsChanged} flag={flag} setFlag={setFlag}/>
                        </div>
                    </div>
                    : null}
                    <div className='containerSides'>
                        <Typography variant='h4' sx={{fontWeight:'bold', m:2} }> Carrito de Salida - Checkout </Typography>
                        <Typography variant='h5' sx={{fontWeight:'bold', m:2} }> {cart.typeOrder} </Typography>
                        { isDelivery  && cart.address ?
                            <Box sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {`Dirección seleccionada`}
                                </Typography>
                                <Typography variant="body2">
                                    Calle: {cart.address.street}
                                </Typography>
                            </CardContent>
                        </Box>
                        :null}
                        <Box sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {`Costo Total `}
                                </Typography>
                                <Typography variant="h5" sx={{color:'red'}}>
                                    Gs. {totalCost}
                                </Typography>
                            </CardContent>
                            <Button size="small" variant="contained" color="success" sx={{m:2, width: 150}} onClick={ e=> handlePlaceOrder(e)}>Pedir</Button>
                            <Button size="small" variant="contained" color="error" sx={{m:2, width: 150}} onClick={ e=> handleCancel(e)}>Cancelar pedido</Button>
                        </Box>

                    </div>
                </div>

            </div>            
        </div>
    )
}

export default Checkout