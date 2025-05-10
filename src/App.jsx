import logo from './img/lalocarlogo.png';
import logoc from './img/Logo-centro.png';
import {db, auth, storage} from './firebaseConfig';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './App.css';
import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun, FaPhoneAlt, FaIdCardAlt, FaBuilding, FaHashtag, FaMoneyBillAlt } from 'react-icons/fa';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Importa los iconos de redes sociales
import Cards from './cards'
import Buy from './buy'
import Admin from './admin'

function App() {
  const [nivel,setNivel] = useState(1)
  const [producto, setProducto] = useState(null)
  const [darkMode, setDarkMode] = useState(false);
  const [cantidad, setCantidad] = useState(2); // Estado para la cantidad
  const [dataProducto, setDataProducto] = useState([]);
  const [tasa, setTasa]= useState();
  const [precioDolar, setPrecioDolar]= useState();
  const [precioBolivar, setPrecioBolivar]= useState();
  const [mostrarOpcionesAdmin, setMostrarOpcionesAdmin] = useState(false);
  const [mostrarModalAdmin, setMostrarModalAdmin] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
 

  const toggleOpcionesAdmin = () => {
    setMostrarOpcionesAdmin(!mostrarOpcionesAdmin);
  };
  const iniciarComoAdmin = () => {
      if (email == 'wi@gmail.com' && password=='papasfritas'){
        setNivel(3)
      }else{
        window.alert('Credencial Invalida')
      }
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
    handleCerrarModalAdmin(); 
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

  useEffect (()=>{
  
  },[nivel])
  return (
    <div style={darkModeStyles}>
        <nav className="navbar border-bottom border-body" style={{ backgroundColor: '#171717' }}>
          <div className="container-fluid" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={logo} width="60" height="58" className="d-inline-block align-text-top" alt="Logo Principal" />
              <h4 className='fw-bold text-white' style={{ marginTop: '0.5%', marginLeft: '1%' }}>LaloCar</h4>
            </div>
            <div className="dropdown" style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary dropdown-toggle"
                style={{ backgroundColor: '#333', color: 'white', border: 'none' }}
                type="button"
                id="dropdownAdminButton"
                onClick={toggleOpcionesAdmin}
                aria-expanded={mostrarOpcionesAdmin}
              >
                Admin
              </button>
              <ul
                className={`dropdown-menu ${mostrarOpcionesAdmin ? 'show' : ''}`}
                aria-labelledby="dropdownAdminButton"
                style={{ position: 'absolute', right: 0, left: 'auto', backgroundColor: '#444', color: 'white', borderColor: '#555' }}
              >
                <li>
                  <button
                    className="dropdown-item text-white"
                    style={{ backgroundColor: 'transparent', border: 'none', textAlign: 'left', padding: '10px' }}
                    onClick={handleIniciarAdminClick}
                  >
                    Iniciar como Admin
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
        </nav>
        {mostrarModalAdmin && (
            <div className='container-card-ini'>
              
              <form class="form-inicio"  onSubmit={handleSubmitAdmin}>
                <button className="modal-close-button" onClick={handleCerrarModalAdmin}>
                  &times;
                </button>
                <p class="form-title">Sign in to your account</p>
                <div class="input-container">
                  <input placeholder="Enter email" type="email" onChange={(e)=>setEmail(e.target.value)}/>
                  <span>
                    <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                    </svg>
                  </span>
                </div>
                <div class="input-container">
                  <input placeholder="Enter password" type="password" onChange={(e)=>setPassword(e.target.value)}/>
      
                  <span>
                    <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                    </svg>
                  </span>
                </div>
                <button class="submit" type="submit" onClick={()=>iniciarComoAdmin()}>
                  Sign in
                </button>
      
              </form>
            </div>
          )}

      {nivel==1?
      <Cards setNivel={setNivel} setProducto={setProducto}/>:
      nivel ==2?
      <Buy setNivel={setNivel} producto={producto} setProducto={setProducto}/>:
      <Admin />}

      {/* Footer Minimalista */}
      <footer className="minimal-footer" style={darkModeStyles}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
                <p className="copyright-text" style={darkModeStyles}>
                  ©{new Date().getFullYear()}</p> 
                  LaloCar
              
            </div>
            <div className="col-md-6">
              <ul className="social-icons">
                <li><a href="#" className="facebook"><FaFacebook /></a></li>
                <li><a href="#" className="twitter"><FaTwitter /></a></li>
                <li><a href="#" className="instagram"><FaInstagram /></a></li>
                {/* Añade más iconos de redes sociales según necesites */}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;