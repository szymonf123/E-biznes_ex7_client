import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";

const Cart: React.FC = () => {
    const { products, addToCart, status } = useCart();
    const [productIdToAdd, setProductIdToAdd] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const parsedId = Number(productIdToAdd);
        if (!Number.isInteger(parsedId) || parsedId <= 0) return;

        addToCart(parsedId);
        setProductIdToAdd("");
    };

    return (
        <div className="p-4">
            <div>
                <h2 className="text-xl font-semibold mb-4">Produkty</h2>
                <ol className="space-y-2">
                    {products.map((product) => (
                        <li key={product.id} className="border p-2 rounded">
                            <strong>{product.name}</strong> – {product.price.toFixed(2)} zł
                        </li>
                    ))}
                </ol>
            </div>
            <form onSubmit={handleSubmit} className="space-y-2">
                <label>
                    Podaj ID produktu do dodania:
                    <input type="number" value={productIdToAdd} onChange={(e) => setProductIdToAdd(e.target.value)} className="border p-1 ml-2" id="product-id" required/>
                </label>
                <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded" disabled={status === "loading"}>
                    {status === "loading" ? "Dodawanie..." : "Dodaj do koszyka"}
                </button>
                {status === "success" && <p className="text-green-600">Dodano do koszyka!</p>}
                {status === "error" && <p className="text-red-600">Wystąpił błąd.</p>}
            </form>
        </div>
    );
};

export default Cart;
