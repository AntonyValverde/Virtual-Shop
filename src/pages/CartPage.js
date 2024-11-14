import React, { useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

// Configura tu cliente MSAL
const msalConfig = {
  auth: {
    clientId: 'TU_CLIENT_ID', // Reemplaza con tu clientId de Azure AD
    authority: 'https://login.microsoftonline.com/common', // Configuración por defecto
    redirectUri: window.location.origin, // Cambiar si es necesario
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const CartPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Iniciar sesión y obtener el token
  const handleLogin = async () => {
    try {
      const loginResponse = await msalInstance.loginPopup({
        scopes: ['Files.ReadWrite'],
      });
      setAccessToken(loginResponse.accessToken);
      console.log('Inicio de sesión exitoso');
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
    }
  };

  // Manejar la selección de archivos
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Subir archivo a OneDrive
  const uploadFileToOneDrive = async () => {
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo primero.');
      return;
    }
    if (!accessToken) {
      alert('Primero necesitas iniciar sesión.');
      return;
    }

    const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/MiCarpeta/${selectedFile.name}:/content`;

    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': selectedFile.type,
        },
        body: selectedFile,
      });

      if (response.ok) {
        console.log('Archivo cargado exitosamente');
        alert('Archivo cargado exitosamente');
      } else {
        console.error('Error al cargar el archivo:', response.statusText);
        alert('Error al cargar el archivo');
      }
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      alert('Error al cargar el archivo');
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Iniciar sesión en OneDrive</button>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFileToOneDrive}>Cargar Imagen a OneDrive</button>
    </div>
  );
};

export default CartPage;
