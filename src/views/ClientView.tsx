import React, { useEffect, useState } from "react";
import Product from "../components/Product";
import axios from "axios";

type CartResponse = {
    products: number[];
};

const fetchCartData = async (): Promise<number[]> => {
    const response = await axios.get<CartResponse>("http://localhost:8080/cart");
    return response.data.products;
};

const fetchProductsData = async (): Promise<Product[]> => {
    const response = await axios.get<Product[]>("http://localhost:8080/products");
    return response.data;
};

const mapCartToProducts = (cartProductIds: number[], allProducts: Product[]): Product[] => {
    return cartProductIds
        .map((id) => allProducts.find((product) => product.id === id))
        .filter((product): product is Product => product !== undefined);
};

const ClientView: React.FC = () => {
    const [cartProducts, setCartProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [cartProductIds, allProducts] = await Promise.all([
                    fetchCartData(),
                    fetchProductsData(),
                ]);

                setCartProducts(mapCartToProducts(cartProductIds, allProducts));
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
