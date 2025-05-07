import React, { useEffect, useState } from "react";
import Product from "../components/Product";
import axios from "axios";

type CartResponse = {
    products: number[];
};

const ClientView: React.FC = () => {
    const [cartProducts, setCartProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCartDataFromServer = async () => {
            setLoading(true);
            setError(null);

            try {
                const [cartResponse, productsResponse] = await Promise.all([
                    axios.get<CartResponse>("http://localhost:8080/cart"),
                    axios.get<Product[]>("http://localhost:8080/products")
                ]);

                const cartData = cartResponse.data;
                const allProducts = productsResponse.data;

                const detailedCartProducts: Product[] = cartData.products.map(productId => {
                    return allProducts.find(product => product.id === productId);
                }).filter(product => product !== undefined) as Product[];

                setCartProducts(detailedCartProducts);
                setLoading(false);

            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchCartDataFromServer().catch((err) => {
            console.error("Błąd w fetchCartDataFromServer:", err);
        });
    }, []);

    if (loading) {
        return <p>Ładowanie koszyka...</p>;
    }

    if (error) {
        return <p>Wystąpił błąd podczas ładowania koszyka: {error}</p>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Twój koszyk</h2>
            {cartProducts.length === 0 ? (
                <p>Koszyk jest pusty.</p>
            ) : (
                <ul className="space-y-2">
                    {cartProducts.map((item) => (
                        <li key={item.id} className="border p-2 rounded">
                            <strong>{item.name}</strong> – {item.price.toFixed(2)} zł
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ClientView;
