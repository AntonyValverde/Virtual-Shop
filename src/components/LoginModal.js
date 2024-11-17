import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc,setDoc, getDoc } from 'firebase/firestore'; // No necesitas setDoc aquí
import { FaTimes, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Verifica si el usuario está en la colección "inicio"
      const userDocRef = doc(db, 'inicio', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        console.log('El usuario tiene acceso. Redirigiendo a la página de Admin...');
        onClose();
        navigate('/admin'); // Redirige si el usuario tiene acceso
      }else if (!userDoc.exists()) {
        console.log(`El documento no existe para el UID: ${user.uid}`);
        setError(`No se encontró acceso para el usuario con UID: ${user.uid}`);
      } else {
        console.log('El usuario no tiene permisos. No se redirigirá.');
        setError('Acceso denegado. No tienes permisos para acceder.');
      }
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión');
    }
  };
  

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verifica si el usuario ya está en la colección "inicio"
      const userDocRef = doc(db, 'inicio', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Si el usuario no existe, lo agrega a la colección "inicio"
        await setDoc(userDocRef, {
          correo: user.email,
          uid: user.uid
        });
      }

      onClose();
      navigate('/'); // Redirige a la página de inicio después de iniciar sesión
    } catch (error) {
      setError('Error al iniciar sesión con Google: ' + error.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Iniciar Sesión</h2>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
        <p className="modal-footer">
          ¿No tienes una cuenta? Inicia con google.
        </p>
        <div className="social-login">
          <button className="google-login-button" onClick={handleGoogleLogin}>
            <FaGoogle /> Iniciar sesión con Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
