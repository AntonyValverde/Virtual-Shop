import React, { useState } from 'react';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { auth, db } from '../firebase'; // Importa auth y db
import { collection, doc, setDoc, getDoc } from 'firebase/firestore'; // Importa las funciones necesarias de Firestore
import './ImageDetailsModal.css';

const ImageDetailsModal = ({ isOpen, onClose, imageDetails, openLoginModal }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !imageDetails) return null;

  const handleAddToCart = async () => {
    const user = auth.currentUser;

    if (!user) {
      // Si no hay usuario autenticado, muestra el modal de inicio de sesión
      openLoginModal();
      return;
    }

    // Verifica que se haya seleccionado una talla
    if (!selectedSize) {
      alert('Por favor, selecciona una talla.');
      return;
    }

    // Verifica que la cantidad sea válida
    if (quantity < 1) {
      alert('Por favor, ingresa una cantidad válida.');
      return;
    }

    try {
      // Referencia al documento de carrito del usuario
      const userCartRef = doc(db, 'carrito', user.email);
      const userCartDoc = await getDoc(userCartRef);

      // Si el documento no existe, crea uno nuevo
      if (!userCartDoc.exists()) {
        await setDoc(userCartRef, {
          items: [
            {
              title: imageDetails.title,
              price: imageDetails.price,
              size: selectedSize,
              quantity: quantity,
              code: imageDetails.code,
              imagen: imageDetails.image
            }
          ]
        });
      } else {
        // Si el documento existe, actualiza los datos
        const existingCart = userCartDoc.data().items || [];
        const updatedCart = [
          ...existingCart,
          {
            title: imageDetails.title,
            price: imageDetails.price,
            size: selectedSize,
            quantity: quantity,
            code: imageDetails.code,
            imagen: imageDetails.image
          }
        ];

        await setDoc(userCartRef, { items: updatedCart }, { merge: true });
      }

      console.log('Producto agregado al carrito exitosamente');
      onClose(); // Cierra el modal después de agregar al carrito
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content enhanced-modal">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="image-details-container">
          <img src={imageDetails.image} alt={imageDetails.title} className="modal-image" />
          <div className="image-details">
            <h2>{imageDetails.title}</h2>
            <p><strong>Precio:</strong> {imageDetails.price}</p>
            <p><strong>Tallas disponibles:</strong></p>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              required
            >
              <option value="" disabled>Selecciona una talla</option>
              {imageDetails.sizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <p><strong>Cantidad:</strong></p>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, e.target.value))}
              min="1"
              className="quantity-input"
            />
            <p><strong>Código:</strong> {imageDetails.code}</p>
            <p><strong>Descripción:</strong> {imageDetails.description}</p>
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              <FaShoppingCart className="cart-icon" /> Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetailsModal;
