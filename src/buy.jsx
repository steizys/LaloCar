import logo from './img/lalocarlogo.png';
import logoc from './img/Logo-centro.png';
import {db, auth, storage} from './firebaseConfig';
import { getFirestore, collection, getDocs, addDoc  } from 'firebase/firestore';
import './App.css';
import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { FaMoon, FaSun, FaPhoneAlt, FaIdCardAlt, FaBuilding, FaHashtag, FaMoneyBillAlt } from 'react-icons/fa';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Importa los iconos de redes sociales

function Buy(props) {
  const [darkMode, setDarkMode] = useState(false);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState('');
  const [detallesPago, setDetallesPago] = useState(null);
  const [cantidad, setCantidad] = useState(2); // Estado para la cantidad
  const [dataProducto, setDataProducto] = useState([]);
  const [tasa, setTasa]= useState();
  const [precioDolar, setPrecioDolar]= useState();
  const [precioBolivar, setPrecioBolivar]= useState();
  const [mostrarOpcionesAdmin, setMostrarOpcionesAdmin] = useState(false);
  const [mostrarModalAdmin, setMostrarModalAdmin] = useState(false);

  const [nombre,setNombre] = useState('')
  const [email,setEmail] = useState('')
  const [telefono,setTelefono] = useState('')
  const [referencia,setReferencia] = useState('')
  const [detalle,setDetalle] = useState('')
  const [fecha,setFecha] = useState('')
  const [comprobante, setComprobante] = useState()



  const dataProductos= async ()=> {
    const data=[]
    const querySnapshot = await getDocs(collection(db, "Producto"));
    querySnapshot.forEach((doc) => {
      data.push(doc.data())
    });
    setDataProducto(data);
    console.log(data, 'data ')
    console.log(dataProducto)
  }

  const pave= async ()=> {
    const data=[]
    const querySnapshot = await getDocs(collection(db, "Pagos"));
    querySnapshot.forEach((doc) => {
      data.push(doc.data())
    });
    console.log(data, 'waooo ')
  }


  const toggleOpcionesAdmin = () => {
    setMostrarOpcionesAdmin(!mostrarOpcionesAdmin);
  };
  const iniciarComoAdmin = () => {
    // Aquí iría la lógica para redirigir o manejar el inicio de sesión como administrador
    console.log('Iniciar como Admin');
    // Por ejemplo, podrías usar window.location.href = '/admin'; para redirigir a una página de administración
  };


  const handleIniciarAdminClick = () => {
    setMostrarModalAdmin(true);
    setMostrarOpcionesAdmin(false); // Ocultar el menú desplegable si está abierto
  };

  const handleCerrarModalAdmin = () => {
    setMostrarModalAdmin(false);
  };

  const handleSubmitAdmin = (event) => {
    event.preventDefault();
    // Aquí iría la lógica para procesar el inicio de sesión del administrador
    console.log('Formulario de admin enviado');
    handleCerrarModalAdmin(); // Cerrar el modal después del intento de inicio de sesión
  };
  // Datos de los métodos de pago (simulado)
  const metodosDePagoData = {
    Zelle: {
      Id: 'No aplica',
      Alias: 'TuAliasZelle',
    },
    'Pago Móvil': {
      Id: '01023456789012345678',
      Alias: 'TuNúmeroDeTeléfono',
    },
    Paypal: {
      Id: 'TuCorreoPaypal@email.com',
      Alias: 'TuNombrePaypal',
    },
    'BINANCE-US': {
      Id: '828178208',
      Alias: 'Therex78',
    },
  };
  const Tasa =async (cant)=>{
    try{
        let dolar= await fetch('https://ve.dolarapi.com/v1/dolares/paralelo')
        dolar= await dolar.json()
        setTasa(dolar.promedio)
        const pDolar= props.producto.Precio
        setPrecioDolar(pDolar*cant)
        const pBoli= dolar.promedio*pDolar
        setPrecioBolivar(pBoli*cant)
    }catch{
        setTasa(0)
        setPrecioDolar(0)
        setPrecioBolivar(0)
    }

  }
  const handleIncrement = () => {
    setCantidad(cantidad + 1);
    Tasa(cantidad + 1)
  };

  const handleDecrement = () => {
    if (cantidad > 2) {
      setCantidad(cantidad - 1);
      Tasa(cantidad - 1)
    }
    
  };

  const handleChange = (event) => {
 
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 2) {
      setCantidad(value);
    }
    Tasa(value)
  };
  const handleChangeMetodoPago = (event) => {
    const metodo = event.target.value;
    setMetodoPagoSeleccionado(metodo);
    setDetallesPago(metodosDePagoData[metodo] || null);
  };


  function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  const dividirBase64EnPartes = (base64String) => {
    const partes = [];
    for (let i = 0; i < base64String.length; i += 800000) {
      partes.push(base64String.substring(i, i + 800000));
    }
    return partes;
  }

  const insertarPago = async () => {
    
    

    /* const nombreArchivo = comprobante.name;
    const storageRef = ref(storage, `imagenes/${nombreArchivo}`);
    const snapshot = await uploadBytes(storageRef, comprobante);
    console.log('Imagen subida exitosamente!', snapshot); */
    //snapshot es el ID

    if (nombre!='' && email!='' && telefono != '' && metodoPagoSeleccionado != '' && referencia!= ''&&detalle!=''&&fecha !=''&&comprobante!=null){
        const val = {
            nombre: nombre,
            email:email,
            telefono:telefono,
            metodoPago: metodoPagoSeleccionado,
            referencia: referencia,
            detalle: detalle,
            fecha:fecha
        }
        const coleccionRef = collection(db, 'Pagos');
        const docRef = await addDoc(coleccionRef, val);
       
        let valor = docRef.id

        let res = await convertirImagenABase64(comprobante)
        res = dividirBase64EnPartes(res)
        
        for (let i = 0;i < res.length;i++){
            let val2 = {id:valor, parte:i,sesion:res[i]}
            const coleccionRef = collection(db, 'Imagenes');
            const docRef = await addDoc(coleccionRef, val2);
        }


        limpiarVariables()
        window.alert('Se ha registrado exitosamente')
    }else{
        window.alert('Es necesario llenar todos los campos para registar el pago')
    }
    
  }
  // Ejemplo: Obtener todos los 'usuarios' de la colección 'usuarios'


 
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const darkModeStyles = {
    backgroundColor: darkMode ? '#212529' : '',
    color: darkMode ? '#f8f9fa' : '',
  };

  const navbarDarkModeStyles = {
    backgroundColor: darkMode ? '#000' : '',
  };
  
  const limpiarVariables = ()=>{
    setNombre('')
    setEmail('')
    setTelefono('')
    setReferencia('')
    setDetalle('')
    setFecha('')
    setComprobante()
  }



  const handleFileChange=  async (event) =>{
    const file = event.target.files[0];
    setComprobante(file)
  }
  
  
  useEffect (()=>{
    dataProductos()
    Tasa(cantidad)
    
  },[])
  return (
    <div style={darkModeStyles}>
        
    <button onClick={()=>{limpiarVariables()
        props.setNivel(1)}}>retrocede </button>
    <button onClick={()=>pave()}>info </button>
   
      <div className='container-card'>
        <div className='card-tickets'>
          <h3>{props.producto.Nombre}</h3>
          <div className='card-img'></div>
          <p></p>
          <div className="cantidad-input">
            <button className="cantidad-button decrement" onClick={handleDecrement}>
              -
            </button>
            <input
              type="number"
              className="cantidad-field"
              value={cantidad}
              onChange={handleChange}
              min="1"
            />
            <button className="cantidad-button increment" onClick={handleIncrement}>
              +
            </button>
          </div>
          <div className='tickets'>
              <div className='cuadros'>
                <p>USD</p>
                <h3>{precioDolar}</h3>
              </div>
              <div className='cuadros'>
                <p>Bolívares</p>
                <h3>{precioBolivar}</h3>
              </div>
          </div>
          
        </div>
        <div className='card-form'>
          
          <p className='form-title'>Información personal</p>
          
          <form className='form'>
            <input type="text"  className='input'placeholder="Nombre y Apellido" onChange={(e)=>setNombre(e.target.value)} required/>
            <input type="text" className='input' placeholder="Email" onChange={(e)=>setEmail(e.target.value)} required/>
            <input type="text" name="" id="" className='input'placeholder="Teléfono" onChange={(e)=>setTelefono(e.target.value)} required/>
          </form>
          <p className='form-title'>Datos del pago</p>
          <form className='form'>
            <label htmlFor="metodoPago" className='form-label'>Método de Pago</label>
            <select
              name="metodoPago"
              id="metodoPago"
              className='select'
              onChange={handleChangeMetodoPago}
              value={metodoPagoSeleccionado}
            >
              <option value="">Seleccionar método de pago</option>
              {Object.keys(metodosDePagoData).map((metodo) => (
                <option key={metodo} value={metodo}>
                  {metodo}
                </option>
              ))}
            </select>

            {detallesPago && (
              <div className={`detalles-pago ${detallesPago ? 'visible' : ''}`}>
                <div className='detalles-titulo'>Detalles de Pago:</div>
                {detallesPago.Id && <p>Id: {detallesPago.Id}</p>}
                {detallesPago.Alias && <p>Alias: {detallesPago.Alias}</p>}
                {/* Puedes añadir más detalles aquí según tus datos */}
              </div>
            )}
            <input type="number"  className='input'placeholder="Referencia" onChange={(e)=>setReferencia(e.target.value)} required/>
            <input type="text" className='input' placeholder="Detalle" onChange={(e)=>setDetalle(e.target.value)} required/>
            <input type="date" name="" id="" className='input'placeholder="Fecha" onChange={(e)=>setFecha(e.target.value)} required/>
            <div className='file-upload-container'>
              <input type="file" className='file-input' accept="image/*, application/pdf" id="comprobante" onChange={handleFileChange}/>
              <label htmlFor="comprobante" className='file-label'>Comprobante de Pago</label>
              <span className='file-message'>Ningún archivo seleccionado</span>
            </div>
            <div className='cont-boton-compra' onClick={()=>insertarPago()}>
              <label className='button-comprar'>Comprar</label>
            </div>
          </form>
        </div>
      </div>

     
    </div>
  );
}

export default Buy;