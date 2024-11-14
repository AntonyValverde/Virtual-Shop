import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
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
import OffersPage from './pages/OffersPage';
import Ropa from './pages/Ropa'; // Ajusta la ruta si es necesario
import Colonia from './pages/Colonia';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageDetails, setSelectedImageDetails] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
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

  const offers = [
    {
      image: '/photos/ofertas/oferta1.jpg',
      title: 'Mega Rebajas',
      description: 'Aprovecha más de 1000 ofertas, todas aquí!',
      link: '/ofertas',
    },
    {
      image: '/photos/ofertas/oferta2.jpg',
      title: 'Descuento Especial',
      description: 'Descuentos de hasta el 50% en productos seleccionados.',
      link: '/descuentos',
    },
    {
      image: '/photos/ofertas/oferta3.jpg',
      title: 'Descuento Especial',
      description: 'Descuentos de hasta el 50% en productos seleccionados.',
      link: '/descuentos',
    },
  ];

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
        <h1>StyLux</h1>
        <nav>
          <button className="hamburger-menu" onClick={toggleMenu}>
            ☰
          </button>
          <nav>
            <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
              <li><Link to="/ropa" onClick={closeMenu}>Ropa</Link></li>
              <li><Link to="/colonia" onClick={closeMenu}>Colonias</Link></li>
              <li><a href="#section3" onClick={closeMenu}>Cosméticos</a></li>
            </ul>
          </nav>

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
              <section className="offers-section">
                <Slider {...settings}>
                  {offers.map((offer, index) => (
                    <div key={index} className="offer-slide">
                      <img src={offer.image} alt={offer.title} className="offer-image" />
                      <div className="offer-overlay">
                        <h2>{offer.title}</h2>
                        <p>{offer.description}</p>
                        <button onClick={() => navigate('/offers')}>¡Ver más!</button>
                      </div>
                    </div>
                  ))}
                </Slider>
              </section>
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
          <Route path="/colonia" element={<Colonia />} />
          <Route path="/ropa" element={<Ropa />} /> {/* Asumiendo que tienes una página de inicio */}
          <Route path="/cart" element={<CartPage userEmail={user?.email} />} />
          <Route path="/offers" element={<OffersPage />} />
          {/* Ruta para la página del carrito */}
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>StiloLux</h3>
            <p>La mejor tienda virtual para todas tus necesidades.</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Política de Privacidad</a></li>
              <li><a href="#">Términos y Condiciones</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Síguenos</h4>
            <div className="social-icons">
              <a href="https://www.instagram.com/choma__store?igsh=dTR0czBjaDFjcDN2" aria-label="Facebook" className="social-icon">Instagram</a>
              <a href="#" aria-label="Twitter" className="social-icon">🔗</a>
              <a href="#" aria-label="Instagram" className="social-icon">🔗</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 StiloLux - Todos los derechos reservados.</p>
        </div>
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

