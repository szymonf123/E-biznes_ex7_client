import React, { useState } from "react";

type PaymentData = {
    cardNumber: string;
    amount: number;
};

const Payment: React.FC = () => {
    const [cardNumber, setCardNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            setStatus("error");
            return;
        }

        const paymentData: PaymentData = {
            cardNumber,
            amount: parsedAmount,
        };

        try {
            const res = await fetch("http://localhost:8080/payments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentData),
            });

            if (!res.ok) throw new Error("Błąd serwera");

            setStatus("success");
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 shadow-xl rounded-2xl bg-white">
            <h2 className="text-2xl font-bold mb-4">Płatność</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Numer karty</label>
                    <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md"
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Kwota (PLN)</label>
                    <input
                        type="number"
                        value={amount}
                        defaultValue={0}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md"
                        id="amount"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    disabled={status === "loading"}
                >
                    {status === "loading" ? "Przetwarzanie..." : "Zapłać"}
                </button>
            </form>
            {status === "success" && <p className="payment-info text-green-600 mt-4">Płatność zakończona sukcesem!</p>}
            {status === "error" && <p className="payment-info text-red-600 mt-4">Coś poszło nie tak. Spróbuj ponownie.</p>}
        </div>
    );
};

export default Payment;
