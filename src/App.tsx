import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Cart from "./components/Cart";
import ClientView from "./views/ClientView";
import Payment from "./components/Payment";
import './App.css';
import {CartProvider} from "./contexts/CartContext";
import React from "react";

const App: React.FC = () => {
    return (
        <CartProvider>
            <Router>
                <nav className="mb-6 flex gap-4">
                    <Link to="/" className="text-blue-600 hover:underline">Płatność</Link>
                    <Link to="/cart" className="text-blue-600 hover:underline">Produkty</Link>
                    <Link to="/client" className="text-blue-600 hover:underline">Koszyk klienta</Link>
                </nav>
                <div className="min-h-screen bg-gray-100 p-4">
                    <Routes>
                        <Route path="/" element={<Payment/>}/>
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/client" element={<ClientView/>}/>
                    </Routes>
                </div>
            </Router>
        </CartProvider>

    );
};

export default App;