import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Enhanced Styles
const styles = `
  :root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --background-color: #f4f4f4;
    --text-color: #333;
    --card-background: #fff;
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    margin: 0;
    padding: 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  nav {
    background-color: var(--primary-color);
    padding: 15px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  nav .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  nav .logo {
    font-size: 24px;
    font-weight: bold;
    color: white;
    text-decoration: none;
  }

  nav ul {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  nav ul li {
    margin-left: 20px;
  }

  nav ul li a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
  }

  nav ul li a:hover {
    opacity: 0.8;
  }

  .hero {
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg');
    background-size: cover;
    background-position: center;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
  }

  .hero h1 {
    font-size: 48px;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }

  .hero p {
    font-size: 24px;
    max-width: 600px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 30px;
    padding: 40px 0;
  }

  .product-card {
    background-color: var(--card-background);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .product-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .product-info {
    padding: 20px;
  }

  .product-info h3 {
    margin: 0 0 10px 0;
    color: var(--primary-color);
  }

  .product-info p {
    margin: 0 0 15px 0;
    color: #666;
  }

  .product-info .price {
    font-weight: bold;
    color: var(--secondary-color);
    font-size: 1.2em;
  }

  button {
    background-color: var(--secondary-color);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s;
    font-weight: bold;
  }

  button:hover {
    background-color: #27ae60;
    transform: scale(1.05);
  }

  button:active {
    transform: scale(0.95);
  }

  h2 {
    color: var(--primary-color);
    margin-top: 40px;
    margin-bottom: 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 300px;
    margin: 0 auto;
  }

  input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--card-background);
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
    transition: background-color 0.3s;
  }

  .cart-item:hover {
    background-color: #f0f0f0;
  }

  .cart-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    margin-right: 15px;
  }

  .cart-item-info {
    flex-grow: 1;
  }

  .cart-total {
    font-size: 24px;
    font-weight: bold;
    margin-top: 30px;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .slide-in {
    animation: slideIn 0.5s ease-out;
  }

  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @media (max-width: 768px) {
    nav .container {
      flex-direction: column;
    }

    nav ul {
      margin-top: 15px;
    }

    nav ul li {
      margin: 0 10px;
    }

    .hero h1 {
      font-size: 36px;
    }

    .hero p {
      font-size: 18px;
    }
  }
`;

// Sample product data
const products = [
  { id: 1, name: "Smartphone X", category: "Electronics", price: 699.99, description: "Latest model with advanced features", image: "https://source.unsplash.com/random/300x200/?smartphone" },
  { id: 2, name: "Laptop Pro", category: "Electronics", price: 1299.99, description: "High-performance laptop for professionals", image: "https://source.unsplash.com/random/300x200/?laptop" },
  { id: 3, name: "Wireless Earbuds", category: "Electronics", price: 129.99, description: "True wireless with noise cancellation", image: "https://source.unsplash.com/random/300x200/?earbuds" },
  { id: 4, name: "Men's Casual Shirt", category: "Clothing", price: 39.99, description: "Comfortable cotton shirt for everyday wear", image: "https://source.unsplash.com/random/300x200/?mens-shirt" },
  { id: 5, name: "Women's Jeans", category: "Clothing", price: 59.99, description: "Classic fit denim jeans", image: "https://source.unsplash.com/random/300x200/?womens-jeans" },
  { id: 6, name: "Running Shoes", category: "Clothing", price: 89.99, description: "Lightweight shoes for avid runners", image: "https://source.unsplash.com/random/300x200/?running-shoes" },
];

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="loading-spinner"></div>
);

// Authentication Components
const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setUser({ username });
      navigate('/');
    } catch (error) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container fade-in">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : 'Login'}
        </button>
      </form>
    </div>
  );
};

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/signup', { username, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError('Username already exists');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container fade-in">
      <h2>Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Signup successful! Redirecting to login...</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : 'Signup'}
        </button>
      </form>
    </div>
  );
};

// Product Components
const ProductCard = ({ product, addToCart, user }) => (
  <div className="product-card slide-in">
    <img src={product.image} alt={product.name} />
    <div className="product-info">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      {user ? (
        <button onClick={() => addToCart(product)} className="pulse">Add to Cart</button>
      ) : (
        <p>Please login to add to cart</p>
      )}
    </div>
  </div>
);

const Home = ({ addToCart, user }) => (
  <div>
    <div className="hero fade-in">
      <div className="container">
        <h1>Welcome to ModernShop</h1>
        <p>Discover amazing products at unbeatable prices</p>
      </div>
    </div>
    <div className="container">
      <h2>Featured Products</h2>
      <div className="product-grid">
        {products.slice(0, 3).map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} user={user} />
        ))}
      </div>
    </div>
  </div>
);

const ProductList = ({ addToCart, user }) => (
  <div className="container">
    <h2>Our Products</h2>
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} addToCart={addToCart} user={user} />
      ))}
    </div>
  </div>
);

const Cart = ({ cart, removeFromCart, user }) => {
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
    } else {
      setIsCheckingOut(true);
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Checkout completed');
      setIsCheckingOut(false);
      // Here you would typically clear the cart and show a success message
    }
  };

  return (
    <div className="container fade-in">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item.id} className="cart-item slide-in">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
          <div className="cart-total">
            Total: ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
          </div>
          <button onClick={handleCheckout} disabled={isCheckingOut}>
            {isCheckingOut ? <LoadingSpinner /> : (user ? 'Proceed to Checkout' : 'Login to Checkout')}
          </button>
        </div>
      )}
    </div>
  );
};

// Navbar Component (moved outside of Cart component)
const Navbar = ({ user, onLogout, cartItemsCount }) => (
  <nav>
    <div className="container">
      <Link to="/" className="logo">ModernShop</Link>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/cart">Cart ({cartItemsCount})</Link></li>
        {user ? (
          <>
            <li>Welcome, {user.username}</li>
            <li><button onClick={onLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </div>
  </nav>
);

// Protected Route Component
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Main App Component

// Import all the components we've defined earlier
// Make sure these component definitions are above this App component in your file
// or in separate files that are imported at the top of your main file

const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user info
      axios.get('http://localhost:5000/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data.user);
        setIsLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router>
      <div className="fade-in">
        <Navbar user={user} onLogout={handleLogout} cartItemsCount={cart.length} />
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} user={user} />} />
          <Route path="/products" element={<ProductList addToCart={addToCart} user={user} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute user={user}>
                <div className="container fade-in">
                  <h2>Checkout</h2>
                  {/* Implement checkout form and logic here */}
                </div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
      <style>{styles}</style>
    </Router>
  );
};

export default App;
