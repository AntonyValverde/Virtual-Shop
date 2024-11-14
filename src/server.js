const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000; // Puedes cambiar el puerto si lo prefieres

app.use(cors());
app.use(express.json()); // Para manejar solicitudes con JSON

// Conectar a MongoDB Atlas
mongoose.connect('mongodb+srv://antonyvalverde2003:Antony2525@cluster0.pjfhs.mongodb.net/StyLux?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB Atlas');
}).catch((err) => {
  console.error('Error al conectar a MongoDB:', err);
});

// Definir el esquema para el carrito
const cartSchema = new mongoose.Schema({
  userEmail: String,
  items: [
    {
      title: String,
      price: Number,
      size: String,
      quantity: Number,
      code: String,
      image: String
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);

// Ruta para obtener el carrito de un usuario
app.get('/api/cart/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const userCart = await Cart.findOne({ userEmail: email });
    if (!userCart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(userCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para agregar un artículo al carrito de un usuario
app.post('/api/cart', async (req, res) => {
  const { userEmail, item } = req.body;
  try {
    let userCart = await Cart.findOne({ userEmail });

    if (!userCart) {
      // Si no existe un carrito para el usuario, crea uno nuevo
      userCart = new Cart({
        userEmail,
        items: [item]
      });
    } else {
      // Si el carrito ya existe, agrega el nuevo artículo
      userCart.items.push(item);
    }

    await userCart.save();
    res.status(201).json({ message: 'Producto agregado al carrito', cart: userCart });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto al carrito', error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
