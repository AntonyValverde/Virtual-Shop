import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageDetailsModalCo from '../components/ImageDetailsModalColonia';
import './ropa.css';

// Importamos las imágenes de manera dinámica desde el directorio `fotosMacho`
const importAll = (r) => r.keys().map(r);
const CA = importAll(require.context('/public/photos/coloniaCO0001', false, /\.jpeg$/));
//const ST = importAll(require.context('/public/photos/fotosST0001', false, /\.jpeg$/));

const sortedCA = CA.sort((a, b) => a.localeCompare(b));
//const sortedST = ST.sort((a, b) => a.localeCompare(b));

const ropaDataCA = sortedCA.map((image, index) => ({
    id: index + 1,
    image: image.default || image,
    title: 'Colonia',
    price: '₡5000',
    code: `CA${String(index + 1).padStart(4, '0')}`,
    description: `Descripción de Camisa ${index + 1}`,
}));

/*const ropaDataST = sortedST.map((image, index) => ({
    id: index + 1,
    image: image.default || image,
    title: 'Short',
    price: '₡5000',
    sizes: ['S', 'M', 'L', 'XL'],
    code: `ST${String(index + 1).padStart(4, '0')}`,
    description: `Descripción de Short ${index + 1}`,
}));*/

function Colonia() {
    const [selectedRopa, setSelectedRopa] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); 
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleImageClick = (ropa) => {
        setSelectedRopa(ropa);
        setIsModalOpen(true);
    };

    const filteredRopaData = [...ropaDataCA].filter((ropa) =>
        ropa.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="ropa-page">
            <h1>Ropa</h1>
            <div className="top-bar">
                <button className="back-button" onClick={handleBackToHome}>Regresar a Inicio</button>
                <input
                    type="text"
                    placeholder="Buscar por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
            </div>
            <div className="offers-grid">
                {filteredRopaData.map((ropa) => (
                    <div
                        key={ropa.id}
                        className="offer-card"
                        onClick={() => handleImageClick(ropa)}
                    >
                        <img src={ropa.image} alt={ropa.title} />
                        <h3>{ropa.title}</h3>
                    </div>
                ))}
            </div>

            {selectedRopa && (
                <ImageDetailsModalCo
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    imageDetails={selectedRopa}
                />
            )}
        </div>
    );
}

export default Colonia;
