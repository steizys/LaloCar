import logo from './img/lalocarlogo.png';
import logoc from './img/Logo-centro.png';
import {db, auth, storage} from './firebaseConfig';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './App.css';
import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun, FaPhoneAlt, FaIdCardAlt, FaBuilding, FaHashtag, FaMoneyBillAlt } from 'react-icons/fa';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Importa los iconos de redes sociales

function Cards(props) {
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

  const handleChangeMetodoPago = (event) => {
    const metodo = event.target.value;
    setMetodoPagoSeleccionado(metodo);
    setDetallesPago(metodosDePagoData[metodo] || null);
  };
  
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
  

 
  
  
  useEffect (()=>{
  
    dataProductos()
  },[])
  return (
    <div style={darkModeStyles}>
        
      <div className='container-img-bar'>
        <div className='logo' >
          <img className='yeii' src={logoc} alt="Logo Centrado" />
        </div>
      </div>
      <div className='container-card'>
        {dataProducto.map((element, index)=>
        
        <div className="card" style={darkModeStyles}>
          <div className="card-image" src={element.Imagen}></div>
          <p className="card-title" style={darkModeStyles}>{element.Nombre}</p>
          <p className='card-precio'>{element.Precio}$</p>
          <p className="card-body" style={darkModeStyles}>
          {element.Descripcion}
          </p>
          <div className='container-b'>
            <button onClick={()=>{props.setProducto(element)
                props.setNivel(2)}}>
              <span className='by-name'>Continuar</span>
              <div className="arrow-wrapper">
                <div className="arrow"></div>
              </div>
            </button>
          </div>
          </div>
        )}
       
      </div>
      

      
    </div>
  );
}

export default Cards;