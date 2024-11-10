// Importa las funciones que necesitas de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Importa Firestore

// Configuración de tu aplicación Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDqKE4mJDoZtiC5yfUqHbhZjbNDQ084ZXU",
  authDomain: "tienda-virtual-3ed78.firebaseapp.com",
  projectId: "tienda-virtual-3ed78",
  storageBucket: "tienda-virtual-3ed78.appspot.com",
  messagingSenderId: "493811977979",
  appId: "1:493811977979:web:6f46eb4350a3312d06ea5e",
  measurementId: "G-3M84FZ58HS"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la instancia de autenticación
export const auth = getAuth(app);

// Exporta la instancia de Firestore
export const db = getFirestore(app);
