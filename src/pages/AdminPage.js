import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './AdminPage.css';

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'carrito'));
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'inicio')); // Ajusta la colección a la que contiene tus usuarios registrados
        const fetchedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error al obtener los usuarios registrados:', error);
      }
    };

    fetchOrders();
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirige al usuario a la página de inicio después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleUserExpansion = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Bienvenido a la Página de Administradores</h1>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Buscar usuario por correo..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>
      <main className="admin-main">
        <h2>Pedidos de Usuarios</h2>
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="user-folder">
              <div
                className="folder-header"
                onClick={() => toggleUserExpansion(order.id)}
              >
                <span>{order.id}</span> {/* Muestra el correo o identificador del usuario */}
              </div>
              {expandedUser === order.id && (
                <div className="folder-content">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <p><strong>Título:</strong> {item.title}</p>
                        <p><strong>Precio:</strong> {item.price}</p>
                        <p><strong>Cantidad:</strong> {item.quantity}</p>
                        <p><strong>Código:</strong> {item.code}</p>
                        <p><strong>Estado de compra:</strong> {item.compra}</p>
                        {item.imagen && <img src={item.imagen} alt={item.title} />}
                      </div>
                    ))
                  ) : (
                    <p>No hay artículos en el carrito.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay pedidos disponibles.</p>
        )}

        <h2>Usuarios Registrados</h2>
        {users.length > 0 ? (
          <div className="users-list">
            {users.map(user => (
              <div key={user.id} className="user-item">
                <p>{user.correo}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay usuarios registrados.</p>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
