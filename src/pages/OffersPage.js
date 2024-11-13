import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageDetailsModal from '../components/ImageDetailsModal';
import './OffersPage.css';

const offersData = [
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
    {
        id: 4,
        image: '/photos/colonias/colonia1.jpg',
        title: 'Colonia 1',
        price: '$35',
        sizes: ['S', 'M', 'L'],
        code: 'C001',
        description: 'Descripción de Colonia 1',
    },
    {
        id: 5,
        image: '/photos/colonias/colonia2.jpg',
        title: 'Colonia 2',
        price: '$40',
        sizes: ['M', 'L', 'XL'],
        code: 'C002',
        description: 'Descripción de Colonia 2',
    },
    {
        id: 6,
        image: '/photos/colonias/colonia3.jpg',
        title: 'Colonia 3',
        price: '$45',
        sizes: ['S', 'M'],
        code: 'C003',
        description: 'Descripción de Colonia 3',
    },
];

function OffersPage() {
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleImageClick = (offer) => {
        setSelectedOffer(offer);
        setIsModalOpen(true);
    };

    return (
        <div className="offers-page">
            <h1>Ofertas Especiales</h1>
            <button className="back-button" onClick={handleBackToHome}>Regresar a Inicio</button>
            <div className="offers-grid">
                {offersData.map((offer) => (
                    <div
                        key={offer.id}
                        className="offer-card"
                        onClick={() => handleImageClick(offer)}
                    >
                        <img src={offer.image} alt={offer.title} />
                        <h3>{offer.title}</h3>
                    </div>
                ))}
            </div>

            {selectedOffer && (
                <ImageDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    imageDetails={selectedOffer}
                />
            )}
        </div>
    );
}

export default OffersPage;
