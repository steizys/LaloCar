import logo from './img/lalocarlogo.png';
import logoc from './img/Logo-centro.png';
import {db, auth, storage} from './firebaseConfig';
import { getFirestore, collection, getDocs,query, orderBy } from 'firebase/firestore';
import './App.css';
import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun, FaPhoneAlt, FaIdCardAlt, FaBuilding, FaHashtag, FaMoneyBillAlt } from 'react-icons/fa';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Importa los iconos de redes sociales

function Admin(props) {
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

  

  const dataProductos= async ()=> {
    const data=[]
    const id=[]
    const querySnapshot = await getDocs(collection(db, "Pagos"));
  
    querySnapshot.forEach((doc) => {
      console.log(doc.id, 'id')
      
      data.push([doc.id, doc.data()])
    });
    data.forEach((element) =>{
      element[1].id=element[0]
      id.push(element[1])
    });
    console.log(id, 'idddd')
    
  

    const img = []
    const querySnapshotImg = await getDocs(collection(db, "Imagenes"));
    querySnapshotImg.forEach((doc) => {
        img.push(doc.data())
    });
    console.log(img, 'imagen')
    let final = concatenarSesionesPorId(img)
    
    let lista = []
    final.forEach((element)=>{
        let obj ={
            id:element.id,
            file:base64ParaArchivo(element.sesion,'prueba.png',"image/png")
        }
        lista.push(obj)
    })

    id.forEach((element)=>{
      lista.forEach((element2)=>{
        if(element2.id == element.id){
          element.doc = element2.file
        }
      })
    })

    console.log(id,'siuuu')
    setDataProducto(id);
    
  }

  const  concatenarSesionesPorId = (arrayDeObjetos) => {
    const groupedById = arrayDeObjetos.reduce((acumulador, objeto) => {
      const { id, sesion, parte } = objeto;
      if (!acumulador[id]) {
        acumulador[id] = [];
      }
      acumulador[id].push({ sesion, parte });
      return acumulador;
    }, {});
  
    const resultado = Object.entries(groupedById).map(([id, grupo]) => {
      grupo.sort((a, b) => a.parte - b.parte);
      const sesionesConcatenadas = grupo.map(item => item.sesion).join('');
      return { id: id, sesion: sesionesConcatenadas };
    });
  
    return resultado;
  }

  const base64ParaArchivo = (base64String, nombreArchivo, tipoMIME) =>{
    const base64Limpia = base64String.split(',')[1] || base64String;
    const byteString = atob(base64Limpia);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    const archivoBlob = new Blob([arrayBuffer], { type: tipoMIME });

  // Crear un enlace de descarga (esto es lo que inicia la descarga)
  const enlaceDescarga = document.createElement('a');
  enlaceDescarga.href = URL.createObjectURL(archivoBlob);
  enlaceDescarga.download = nombreArchivo;

  // Agregar el enlace al body (temporalmente)
  document.body.appendChild(enlaceDescarga);

  // Simular un clic en el enlace para iniciar la descarga
  //enlaceDescarga.click();

  // Limpiar el enlace del body y revocar la URL del objeto
  //document.body.removeChild(enlaceDescarga);
  //URL.revokeObjectURL(enlaceDescarga.href);
   return new Blob([arrayBuffer], { type: tipoMIME });
  }

  const handleDownload = (element) => {
    if (element.doc) {
      // Crea una URL del objeto a partir del blob
      const url = URL.createObjectURL(element.doc);
      // Crea un elemento <a> invisible
      const a = document.createElement('a');
      a.href = url;
      // Define el nombre del archivo para la descarga
      a.download = element.id || 'comprobante.pdf'; // Usa un nombre de archivo si está disponible
      document.body.appendChild(a);
      a.click();
      // Limpia la URL del objeto después de la descarga
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      alert('No se encontró el archivo para descargar.');
    }
  };
 

  const darkModeStyles = {
    backgroundColor: darkMode ? '#212529' : '',
    color: darkMode ? '#f8f9fa' : '',
  };

useEffect (()=>{
  
    dataProductos()
  },[])
 
  return (
    <div style={darkModeStyles}>
       
      <div className="container-card-table">
        <h2>Pagos registrados</h2> 
        <table className="table-form">
          <thead className='thead-c'>
            <tr>
              <th >Nombre</th>
              <th >Email</th>
              <th >Telefono</th>
              <th >Pago</th>
              <th >Referencia</th>
              <th >Detalle</th>
              <th >Fecha</th>
              <th >Pago</th>
            </tr>
          </thead>
          <tbody>
            {dataProducto.map((element, index)=>
              <tr>
                <th >{element.nombre}</th>
                <td>{element.email}</td>
                <td>{element.telefono}</td>
                <td>{element.metodoPago}</td>
                <td>{element.referencia}</td>
                <td>{element.detalle}</td>
                <td>{element.fecha}</td>
                <td>
                  <button onClick={()=>handleDownload(element)}>comprobante</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      
    </div>
    
  );
}

export default Admin;