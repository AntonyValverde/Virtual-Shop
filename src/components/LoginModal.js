import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase'; // Importa la instancia de Firestore
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Importa las funciones necesarias de Firestore
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
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
      navigate('/');
    } catch (error) {
      setError('Error al iniciar sesión: ' + error.message);
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
        console.log('Usuario agregado a la colección "inicio"');
      } else {
        console.log('El usuario ya existe en la colección "inicio"');
      }

      onClose();
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión con Google', error);
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
          ¿No tienes una cuenta? <a href="/register">Regístrate</a>
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
