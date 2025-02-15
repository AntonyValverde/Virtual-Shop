import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaSearch } from "react-icons/fa";
import './App.css';
import LoginModal from './components/LoginModal';
import ImageDetailsModal from './components/ImageDetailsModal';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import CartPage from './pages/CartPage';
import OffersPage from './pages/OffersPage';
import Ropa from './pages/Ropa'; // Ajusta la ruta si es necesario
import Colonia from './pages/Colonia';
import AdminPage from './pages/AdminPage';
import Gorras from './pages/GorraPage';

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
        setIsModalOpen(false);
      }
    });

    return () => unsubscribe();
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
    navigate('/cart');
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
      image: '/photos/ropa/ropa.jpeg',
      title: 'Ropa',
      price: '$20',
      sizes: ['S', 'M', 'L'],
      code: 'RO0001',
      description: 'Descripción de Ropa 1',
    },
    {
      id: 2,
      image: '/photos/ropa/ropa2.jpeg',
      title: 'Ropa',
      price: '$25',
      sizes: ['M', 'L', 'XL'],
      code: 'RO0002',
      description: 'Descripción de Ropa 2',
    },
    {
      id: 3,
      image: '/photos/ropa/ropa3.jpeg',
      title: 'Ropa',
      price: '$30',
      sizes: ['S', 'M'],
      code: 'RO0003',
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
      code: 'C0001',
      description: 'Descripción de Colonia 1',
    },
    {
      id: 2,
      image: '/photos/colonias/colonia2.jpg',
      title: 'Colonia 2',
      price: '$40',
      sizes: ['M', 'L', 'XL'],
      code: 'C0002',
      description: 'Descripción de Colonia 2',
    },
    {
      id: 3,
      image: '/photos/colonias/colonia3.jpg',
      title: 'Colonia 3',
      price: '$45',
      sizes: ['S', 'M'],
      code: 'C0003',
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
      code: 'CS0001',
      description: 'Descripción de Cosmético 1',
    },
    {
      id: 2,
      image: '/photos/cosmeticos/cos2.jpg',
      title: 'Cosmético 2',
      price: '$55',
      sizes: ['M', 'L', 'XL'],
      code: 'CS0002',
      description: 'Descripción de Cosmético 2',
    },
    {
      id: 3,
      image: '/photos/cosmeticos/cos3.jpg',
      title: 'Cosmético 3',
      price: '₡60',
      sizes: ['S', 'M'],
      code: 'CS0003',
      description: 'Descripción de Cosmético 3',
    },
  ];

  // Importamos las imágenes de manera dinámica desde el directorio `fotosMacho`
  const importAll = (r) => r.keys().map(r);
  const CA = importAll(require.context('/public/photos/gorras', false, /\.jpeg$/));
  //const ST = importAll(require.context('/public/photos/fotosST0001', false, /\.jpeg$/));

  const sortedCA = CA.sort((a, b) => a.localeCompare(b));
  //const sortedST = ST.sort((a, b) => a.localeCompare(b));

  const imagesGorras = sortedCA.map((image, index) => ({
    id: index + 1,
    image: image.default || image,
    title: 'Gorra',
    price: '₡10000',
    sizes: ['Ajustable'],
    code: `GO${String(index + 1).padStart(4, '0')}`,
    description: `Gorra ${index + 1}`,
  }));

  return (
    <div className="App">
      <header>
        <h1>StyLux</h1>
        <nav>
          <button className="hamburger-menu" onClick={toggleMenu}>
            <FaSearch className='icon-button' />
          </button>
          <nav>
            <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>

              <li><Link to="/ropa" onClick={closeMenu}>Ropa</Link></li>
              <li><Link to="/colonia" onClick={closeMenu}>Colonias</Link></li>
              <li><Link to="/gorras" onClick={closeMenu}>Gorras</Link></li>
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
              <section id="section4">
                <h2>Gorras</h2>
                <Slider {...settings}>
                  {imagesGorras.map((img) => (
                    <div key={img.id} className="carousel-slide" onClick={() => handleImageClick(img)}>
                      <img src={img.image} alt={img.title} />
                    </div>
                  ))}
                </Slider>
              </section>
            </>
          } />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/colonia" element={<Colonia />} />
          <Route path="/gorras" element={<Gorras />} />
          <Route path="/ropa" element={<Ropa />} /> {/* Asumiendo que tienes una página de inicio */}
          <Route path="/cart" element={<CartPage userEmail={user?.email} />} />
          <Route path="/offers" element={<OffersPage />} />
          {/* Ruta para la página del carrito */}
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>StyLux</h3>
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
            <div className="">
              <a href="https://www.instagram.com/choma__store?igsh=dTR0czBjaDFjcDN2" aria-label="Facebook" className="social-icon">Instagram</a>

            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 StyLux - Todos los derechos reservados.</p>
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

