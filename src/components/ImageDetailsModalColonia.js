import React, { useState } from 'react';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { auth, db } from '../firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import './ImageDetailsModal.css';

const ImageDetailsModalCo = ({ isOpen, onClose, imageDetails, openLoginModal }) => {
   
  const [quantity, setQuantity] = useState(1);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  if (!isOpen || !imageDetails) return null;

  const handleImageExpand = () => {
    setIsImageExpanded(true);
  };

  const handleImageClose = () => {
    setIsImageExpanded(false);
  };

  const handleAddToCart = async () => {
    const user = auth.currentUser;

    if (!user) {
      openLoginModal();
      return;
    }

     

    if (quantity < 1) {
      alert('Por favor, ingresa una cantidad válida.');
      return;
    }

    try {
      const userCartRef = doc(db, 'carrito', user.email);
      const userCartDoc = await getDoc(userCartRef);

      if (!userCartDoc.exists()) {
        await setDoc(userCartRef, {
          items: [
            {
              title: imageDetails.title,
              price: imageDetails.price,
               
              quantity: quantity,
              code: imageDetails.code,
              imagen: imageDetails.image,
              compra: "Espera"
            }
          ]
        });
      } else {
        const existingCart = userCartDoc.data().items || [];
        const updatedCart = [
          ...existingCart,
          {
            title: imageDetails.title,
            price: imageDetails.price,
             
            quantity: quantity,
            code: imageDetails.code,
            imagen: imageDetails.image,
            compra: "Espera"

          }
        ];

        await setDoc(userCartRef, { items: updatedCart }, { merge: true });
      }

      console.log('Producto agregado al carrito exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  return (
    <>
      <div className={`modal-overlay ${isImageExpanded ? 'expanded-overlay' : ''}`} onClick={handleImageClose}>
        <div className={`modal-content ${isImageExpanded ? 'hidden' : ''}`} onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <div className="image-details-container">
            <img
              src={imageDetails.image}
              alt={imageDetails.title}
              className="modal-image"
              onClick={handleImageExpand}
            />
            <div className="image-details">
              <h2>{imageDetails.title}</h2>
              <p><strong>Precio:</strong> {imageDetails.price}</p>
               
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
        {isImageExpanded && (
          <div className="expanded-image-container" onClick={handleImageClose}>
            <img src={imageDetails.image} alt={imageDetails.title} className="expanded-image" />
            <button className="expanded-close-button" onClick={handleImageClose}>
              <FaTimes />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageDetailsModalCo;
