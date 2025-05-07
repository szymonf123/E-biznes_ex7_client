import React, {useEffect, useState, createContext, useContext} from "react";
import Product from "../components/Product";
import axios from "axios";

type CartContextType = {
    cartItems: number[];
    addToCart: (productId: number) => void;
    products: Product[];
    status: "idle" | "loading" | "success" | "error";
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [cartItems, setCartItems] = useState<number[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get<Product[]>("http://localhost:8080/products");
                setProducts(res.data);
            } catch (error) {
                console.error("Błąd ładowania produktów:", error);
                setStatus("error");
            }
        };

        fetchProducts().catch((err) => {
            console.error("Błąd w fetchProducts:", err);
        });
    }, []);


    const addToCart = async (productId: number) => {
        setStatus("loading");

        try {
            await axios.post("http://localhost:8080/cart", { id: productId }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setCartItems((prevItems) => [...prevItems, productId]);
            setStatus("success");

            setTimeout(() => setStatus("idle"), 3000);
        } catch (error) {
            console.error("Błąd dodawania do koszyka:", error);
            setStatus("error");
        }
    };


    return (
        <CartContext.Provider value={{cartItems, addToCart, products, status}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart musi być użyty wewnątrz CartProvider");
    }
    return context;
};
