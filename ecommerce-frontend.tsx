import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';

// Placeholder SVG for product images
const ProductImage = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#f0f0f0" />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24">
      Product
    </text>
  </svg>
);

// Components
const Navbar = ({ user, onLogout }) => (
  <nav className="bg-blue-500 p-4 text-white">
    <ul className="flex justify-between">
      <li><Link to="/">Home</Link></li>
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
      <li><Link to="/cart">Cart</Link></li>
    </ul>
  </nav>
);

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd make an API call here
    onLogin({ username });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
    </form>
  );
};

const Signup = ({ onSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd make an API call here
    onSignup({ username });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">Signup</button>
    </form>
  );
};

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterSize, setFilterSize] = useState('');

  useEffect(() => {
    // In a real app, you'd fetch this data from an API
    setProducts([
      { id: 1, name: 'T-Shirt', price: 19.99, brand: 'BrandA', size: 'M', date: '2023-01-01' },
      { id: 2, name: 'Jeans', price: 49.99, brand: 'BrandB', size: 'L', date: '2023-02-15' },
      { id: 3, name: 'Sneakers', price: 79.99, brand: 'BrandC', size: '10', date: '2023-03-30' },
      { id: 4, name: 'Hat', price: 14.99, brand: 'BrandA', size: 'One Size', date: '2023-04-10' },
    ]);
  }, []);

  const sortedAndFilteredProducts = products
    .filter(product => !filterBrand || product.brand === filterBrand)
    .filter(product => !filterSize || product.size === filterSize)
    .sort((a, b) => {
      if (sortBy === 'priceLowToHigh') return a.price - b.price;
      if (sortBy === 'priceHighToLow') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      return 0;
    });

  return (
    <div className="container mx-auto mt-10">
      <div className="mb-4">
        <select onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded">
          <option value="">Sort By</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <select onChange={(e) => setFilterBrand(e.target.value)} className="p-2 border rounded ml-2">
          <option value="">All Brands</option>
          <option value="BrandA">Brand A</option>
          <option value="BrandB">Brand B</option>
          <option value="BrandC">Brand C</option>
        </select>
        <select onChange={(e) => setFilterSize(e.target.value)} className="p-2 border rounded ml-2">
          <option value="">All Sizes</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="10">10</option>
          <option value="One Size">One Size</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAndFilteredProducts.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <ProductImage />
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p>Price: ${product.price.toFixed(2)}</p>
            <p>Brand: {product.brand}</p>
            <p>Size: {product.size}</p>
            <button onClick={() => addToCart(product)} className="mt-2 p-2 bg-blue-500 text-white rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Cart = ({ cart, removeFromCart }) => (
  <div className="container mx-auto mt-10">
    <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
    {cart.length === 0 ? (
      <p>Your cart is empty.</p>
    ) : (
      <ul>
        {cart.map(item => (
          <li key={item.id} className="mb-2">
            {item.name} - ${item.price.toFixed(2)}
            <button onClick={() => removeFromCart(item.id)} className="ml-2 p-1 bg-red-500 text-white rounded">
              Remove
            </button>
          </li>
        ))}
      </ul>
    )}
    <p className="mt-4 font-bold">
      Total: ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
    </p>
  </div>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar user={user} onLogout={handleLogout} />
        <Switch>
          <Route exact path="/">
            <ProductList addToCart={addToCart} />
          </Route>
          <Route path="/login">
            {user ? <Redirect to="/" /> : <Login onLogin={handleLogin} />}
          </Route>
          <Route path="/signup">
            {user ? <Redirect to="/" /> : <Signup onSignup={handleSignup} />}
          </Route>
          <Route path="/cart">
            <Cart cart={cart} removeFromCart={removeFromCart} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
