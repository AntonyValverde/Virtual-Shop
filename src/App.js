import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';
import LoginModal from './components/LoginModal';
import ImageDetailsModal from './components/ImageDetailsModal';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import CartPage from './pages/CartPage';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageDetails, setSelectedImageDetails] = useState(null);
  const [user, setUser] = useState(null);

  // Hook de navegación debe estar dentro de la función del componente
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsModalOpen(false); // Cierra el modal si hay un usuario autenticado
      }
    });

    return () => unsubscribe(); // Limpia la suscripción cuando el componente se desmonta
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  };

  const handleImageClick = (imageDetails) => {
    setSelectedImageDetails(imageDetails);
    setIsImageModalOpen(true);
  };

  const handleCartClick = () => {
    navigate('/cart'); // Redirige a la página del carrito
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: window.innerWidth < 768 ? 1 : 3,
    slidesToScroll: 1,
    centerMode: window.innerWidth >= 768,
    centerPadding: '0',
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const imagesRopa = [
    {
      id: 1,
      image: '/photos/ropa/ropa.jpg',
      title: 'Ropa 1',
      price: '$20',
      sizes: ['S', 'M', 'L'],
      code: 'R001',
      description: 'Descripción de Ropa 1',
    },
    {
      id: 2,
      image: '/photos/ropa/ropa2.jpg',
      title: 'Ropa 2',
      price: '$25',
      sizes: ['M', 'L', 'XL'],
      code: 'R002',
      description: 'Descripción de Ropa 2',
    },
    {
      id: 3,
      image: '/photos/ropa/ropa3.jpg',
      title: 'Ropa 3',
      price: '$30',
      sizes: ['S', 'M'],
      code: 'R003',
      description: 'Descripción de Ropa 3',
    },
  ];
  const imagesColonias = [
    {
      id: 1,
      image: '/photos/colonias/colonia1.jpg',
      title: 'Colonia 1',
      price: '$35',
      sizes: ['S', 'M', 'L'],
      code: 'C001',
      description: 'Descripción de Colonia 1',
    },
    {
      id: 2,
      image: '/photos/colonias/colonia2.jpg',
      title: 'Colonia 2',
      price: '$40',
      sizes: ['M', 'L', 'XL'],
      code: 'C002',
      description: 'Descripción de Colonia 2',
    },
    {
      id: 3,
      image: '/photos/colonias/colonia3.jpg',
      title: 'Colonia 3',
      price: '$45',
      sizes: ['S', 'M'],
      code: 'C003',
      description: 'Descripción de Colonia 3',
    },
  ];
  const imagesCosmeticos = [
    {
      id: 1,
      image: '/photos/cosmeticos/cos1.jpg',
      title: 'Cosmético 1',
      price: '$50',
      sizes: ['S', 'M', 'L'],
      code: 'CS001',
      description: 'Descripción de Cosmético 1',
    },
    {
      id: 2,
      image: '/photos/cosmeticos/cos2.jpg',
      title: 'Cosmético 2',
      price: '$55',
      sizes: ['M', 'L', 'XL'],
      code: 'CS002',
      description: 'Descripción de Cosmético 2',
    },
    {
      id: 3,
      image: '/photos/cosmeticos/cos3.jpg',
      title: 'Cosmético 3',
      price: '$60',
      sizes: ['S', 'M'],
      code: 'CS003',
      description: 'Descripción de Cosmético 3',
    },
  ];

  return (
    <div className="App">
      <header>
        <h1>Virtual Shop</h1>
        <nav>
          <ul>
            <li><a href="#section1">Ropa</a></li>
            <li><a href="#section2">Colonias</a></li>
            <li><a href="#section3">Cosméticos</a></li>
          </ul>
          <div className="nav-buttons">
            <button className="icon-button" onClick={handleCartClick}>
              <FaShoppingCart size={24} />
            </button>
            {user ? (
              <div className="user-profile">
                <img
                  src={user.photoURL || 'https://via.placeholder.com/40'}
                  alt="User Profile"
                  className="user-image"
                  onClick={handleLogout}
                />
              </div>
            ) : (
              <button className="icon-button" onClick={() => setIsModalOpen(true)}>
                <FaUserCircle size={24} />
              </button>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <section id="section1">
                <h2>Ropa</h2>
                <Slider {...settings}>
                  {imagesRopa.map((img) => (
                    <div key={img.id} className="carousel-slide" onClick={() => handleImageClick(img)}>
                      <img src={img.image} alt={img.title} />
                    </div>
                  ))}
                </Slider>
              </section>

              <section id="section2">
                <h2>Colonias</h2>
                <Slider {...settings}>
                  {imagesColonias.map((img) => (
                    <div key={img.id} className="carousel-slide" onClick={() => handleImageClick(img)}>
                      <img src={img.image} alt={img.title} />
                    </div>
                  ))}
                </Slider>
              </section>

              <section id="section3">
                <h2>Cosméticos</h2>
                <Slider {...settings}>
                  {imagesCosmeticos.map((img) => (
                    <div key={img.id} className="carousel-slide" onClick={() => handleImageClick(img)}>
                      <img src={img.image} alt={img.title} />
                    </div>
                  ))}
                </Slider>
              </section>
            </>
          } />
          <Route path="/cart" element={<CartPage userEmail={user?.email} />} />
          {/* Ruta para la página del carrito */}
        </Routes>
      </main>

      <footer>
        <p>© 2024 Mi Aplicación</p>
      </footer>

      {/* Modales */}
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ImageDetailsModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageDetails={selectedImageDetails}
        openLoginModal={() => setIsModalOpen(true)}
      />
    </div>
  );
}

export default App;

