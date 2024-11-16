import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import './CartPage.css';

const CartPage = ({ userEmail }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userEmail) {
        console.warn('No hay un correo de usuario proporcionado.');
        return;
      }
      try {
        const cartDocRef = doc(db, 'carrito', userEmail);
        const cartDoc = await getDoc(cartDocRef);

        if (cartDoc.exists()) {
          const data = cartDoc.data();
          console.log('Datos del carrito:', data); 
          setCartItems(data.items || []);
        } else {
          console.warn('El documento del carrito no existe.');
        }
      } catch (error) {
        console.error('Error al obtener los datos del carrito:', error);
      }
    };

    fetchCartItems();
  }, [userEmail]);

  const handleRemoveItem = async (item) => {
    if (!userEmail) return;
    try {
      const cartDocRef = doc(db, 'carrito', userEmail);
      await updateDoc(cartDocRef, {
        items: arrayRemove(item), 
      });
      setCartItems((prevItems) => prevItems.filter((i) => i.code !== item.code));
    } catch (error) {
      console.error('Error al eliminar el elemento:', error);
    }
  };

  const handleReturnToHome = () => {
    navigate('/');
  };

  const handleOrder = () => {
    if (cartItems.length === 0) return;

    // Construye el mensaje
    const baseUrl = 'https://wa.me/qr/CWKW2X7WZTXXP1?text='; // Tu enlace base de WhatsApp con el código QR
    let message = 'Hola, me gustaría hacer un pedido con los siguientes artículos:\n\n';
    cartItems.forEach((item, index) => {
      message += `Artículo ${index + 1}:\n`;
      message += `- Título: ${item.title}\n`;
      message += `- Precio: ${item.price}\n`;
      message += `- Talla: ${item.size}\n`;
      message += `- Cantidad: ${item.quantity}\n`;
      message += `- Código: ${item.code}\n\n`;
    });

    // Codifica el mensaje para la URL
    const encodedMessage = encodeURIComponent(message);
    const fullUrl = `${baseUrl}${encodedMessage}`;

    // Abre WhatsApp con el mensaje
    window.open(fullUrl, '_blank');
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <button className="return-button" onClick={handleReturnToHome}>
          <FaArrowLeft size={20} /> Volver
        </button>
        <div className="header-content">
          <FaShoppingCart size={30} className="cart-icon" />
          <h1>Mi Carrito</h1>
        </div>
      </header>

      <main className="cart-main">
        {cartItems.length > 0 ? (
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.imagen} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <h2>{item.title}</h2>
                  <p><strong>Precio:</strong> {item.price}</p>
                  <p><strong>Talla:</strong> {item.size}</p>
                  <p><strong>Cantidad:</strong> {item.quantity}</p>
                  <p><strong>Código:</strong> {item.code}</p>
                </div>
                <button className="remove-button" onClick={() => handleRemoveItem(item)}>
                  <FaTrashAlt className="remove-icon" /> Eliminar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-cart">Tu carrito está vacío.</p>
        )}
      </main>

      {cartItems.length > 0 && (
        <footer className="cart-footer">
          <button className="order-button" onClick={handleOrder}>
            Hacer Pedido
          </button>
        </footer>
      )}
    </div>
  );
};

export default CartPage;
