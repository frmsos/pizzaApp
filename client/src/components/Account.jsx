import {useState, useEffect} from 'react';
import Navbar from './Navbar';
import { useForm } from 'react-hook-form';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useContext } from 'react';
import { userAuth } from '../contexts/userAuth';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {IconButton} from '@mui/material';
import config from './config';
import { Button,  Box,  Typography, Alert, Stack, CardActions, CardContent} from '@mui/material';
import Address from './Address';



const Account = (props) => {
    const { userID, setUserID } = useContext(userAuth);
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [accountData, setAccountData] = useState({firstName: "", lastName:"", email:"", password:"", addresses: []  });
    const [isPassChanged, setIsPassChanged] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [iniAddr, setIniAddr] = useState(false);
    const [showAddr, setShowAddr] = useState("doNotShowAddr");
    const [opMode, setOpMode] = useState(null);
    const [addrID, setAddrID] = useState(0);
    const [vectorAddrIndex, setVectorAddrIndex] = useState(null);
    const [isChanged, setIsChanged] = useState(false);
    const [addresses, setAddresses] = useState({});
    const [flag, setFlag] = useState(false);
    

    //Funcion onsubmit: se llama al presionar el boton de modificar

    const onSubmit = () => {
        console.log('is pass changed', isPassChanged)
        console.log('data to be modified to account', accountData);

        //si no se actuailizo el pass
        if( !isPassChanged || accountData.password === ""  )
        {
            axios.put(`${config.url}/api/pizzapp/user/refactor/${userID}`, 
            {
                firstName: accountData.firstName,
                lastName: accountData.lastName,
                email: accountData.email,
                addresses: accountData.addresses,
            }, {withCredentials:true }
            )
            .then( (response) => {
                console.log('ok updating all with no pass', response)
            } )
            .catch( (errorMsg) =>{
                console.log('not ok updating all with no pass', errorMsg)
            }  )
        }
         //si se actualizo el pass
        else{
            if(isPassChanged){
                axios.put(`${config.url}/api/pizzapp/user/update/${userID}`, 
                {
                    firstName: accountData.firstName,
                    lastName: accountData.lastName,
                    email: accountData.email,
                    password: accountData.password,
                    addresses: accountData.addresses,
                }, {withCredentials:true }
                )
                .then( (response) => {
                    console.log('ok updating with pass', response)
                } )
                .catch( (errorMsg) =>{
                    console.log('not ok updating with pass', errorMsg)
                }  )
            }

        }
        
    }
    //funcion updateaddrvalue: actualiza los valores del objecto address que contiene tres parametros (calle, ciudad, estado)
    //recibe el valor a cambiar, el indice del vector para modificarlo y el parametro a modificar
    //actualiza el estado accountdata que contiene el objeto con los datos que deben estar actualizados
    const updateAddrValue = ( value, index, field) => {
        let items = {...accountData};
        let item = items.addresses[index];
        switch(field){
            case 'street':
                item.street = value;
                break;
            case 'city':
                item.city = value;
                break;
            case 'state':
                item.state = value;
                break;
            default:
                return null;
        }
        
        items.addresses[index] = item;
        console.log('esto es update addr', items);
        setAccountData(items);
    }
    //funcion checkErrorsArryForm: se verifica que el campo ciudad deba tener como minimo 4 caracteres
    const checkErrorsArryForm = (field, index) => {
        if( field=== 'street') {
            return(accountData.addresses[index].street.length < 4 )    
        }
        else {
            return( accountData.addresses[index].city.length < 4 )
        }
    }

    //funcion que se encarga de cambiar el estado showpassword asociado al boton que muestra el contenido de la contrasena
    const handleClickPassword = () => setShowPassword(!showPassword);
    const updatePass = (e) =>{
        setAccountData({...accountData, password: e.target.value});
        setIsPassChanged(true);
    }


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
        setFlag(false)

    }
    const handleDelAddr = (e, addrID) =>{
        //  e.preventDefault();
        console.log('handle del addr')
        axios.post(`${config.url}/api/pizzapp/users/del/address/${userID}/${addrID}`,{withCredentials : true}) 
        .then(response => setAddresses(response.data.user.addresses))
        .catch(error => console.log('error on edit page submit', error));
        setIsChanged(!isChanged);
    }



    // obtenemos la info del user

    useEffect( () => {
        if( userID !==0 && userID !== null && userID !== undefined){
            axios.get(`${config.url}/api/pizzapp/users/${userID}`,{withCredentials : true})
            .then(response => {
                console.log('user account info get by id', response.data.user);
                setAccountData(response.data.user);
                if( response.data.user.addresses.length !==0 && response.data.user.addresses[0].street !== undefined && response.data.user.addresses[0].street !== null ){
                    setIniAddr(true)
                }
                else{
                    setIniAddr(false);
                }
            })
            .catch( errMsg => {
                console.log('error getting order history' , errMsg)
        })}
        else{
            setUserID(JSON.parse(window.localStorage.getItem('userID')));
        }
        
    },[userID, setUserID, flag, isChanged ]);



    return (
        <div>
            <Navbar itemCount={props.itemCount} setItemCount={props.setItemCount}/>
            <Box component="form" noValidate  sx={{ mt: 3 }}>
                <Typography variant="h3" sx={{m:2, fontWeight:'bold'}}> <ManageAccountsIcon fontSize='large'/> Datos de la Cuenta</Typography>
            </Box>
            <div id='account-page-container'>
            <form id="formModifData"  onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="firstName" className='labelForm'>Nombre</label>
                        <input type="text" value={accountData.firstName} 
                        className="inputFields"
                        {...register("firstName", {onChange :  e=> setAccountData({...accountData, firstName: e.target.value}),   required: true, minLength: 2, maxLength: 25 })}
                        />
                        {errors.firstName && <span style={{color:'red'}}>Ingrese un nombre válido, como mínimo de 2 caracteres</span>}
                    </div>
                    <div>
                        <label htmlFor="lastName" className='labelForm'>Apellido</label>
                        <input type="text" value={accountData.lastName}
                        className="inputFields"
                        {...register("lastName", {onChange :  e=> setAccountData({...accountData, lastName: e.target.value}),   required: true, minLength: 2, maxLength: 25 })}
                        />
                        {errors.lastName && <span style={{color:'red'}}>Ingrese un apellido válido, como mínimo de 2 caracteres</span>}
                    </div>
                    <div>
                        <label htmlFor="email" className='labelForm'>Email</label>
                        <input type="text" value={accountData.email} 
                        className="inputFields"  
                        {...register("email", {required: true, onChange :  e=> setAccountData({...accountData, email: e.target.value}) ,pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,}})}
                        />
                        {errors.email && <span style={{color:'red'}}>Ingrese una dirección de correo válida</span>}
                    </div>
                    <div>
                        <label htmlFor="password"  className='labelForm'>Contraseña</label>
                        <input autoComplete='false' type= {showPassword ? "text" : "password"} placeholder='Ingrese la nueva contraseña' onChange = { e=>  updatePass(e)} className="inputFields"  
                        
                        />
                        <IconButton onClick={handleClickPassword}>                                   
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        <div><small id="emailHelp" className="form-text text-muted">Deje en blanco si no desea modificar.</small></div>
                    </div>  
                    <button type="submit" className="btn btn-primary" style={{margin:25, backgroundColor: "#FFBD33", border:'none'}}>Modificar</button>
                    </form>
                    <div className='addr-component' id={showAddr} style={{marginLeft:60}}>
                    <div className='containerSides'>
                    <Box sx={{m:2}}>
                        <Typography variant='h4' sx={{fontWeight:'bold', m:2} }> Dirección de envío </Typography>
                        { iniAddr ?  <Typography variant='body1' sx={{fontWeight:'normal', m:4} }> Favor seleccionar una dirección de envío: </Typography> : <span style={{color: 'red'}}> Presione Editar para agregar una direcciòn de envío</span> }
                        {   accountData.addresses.length > 0 ? 
                                    accountData.addresses.map(  (address, index) => {
                                    return(
                                        <Box sx={{ minWidth: 275 }}>
                                            <CardContent>
                                                <Typography variant="h5" component="div">
                                                    {`Dirección ${index + 1}`}
                                                </Typography>
                                                
                                                <Typography variant="body2">
                                                    Calle: {address.street}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
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
                    <Address showAddr={showAddr} setShowAddr={setShowAddr} opMode={opMode} addrID={addrID} vectorAddrIndex={vectorAddrIndex} 
                        addresses={ accountData.addresses} userID={userID} isChanged={isChanged} setIsChanged={setIsChanged} flag={flag} setFlag={setFlag}/>
                </div>
            </div>


        </div>
    );
}

export default Account
