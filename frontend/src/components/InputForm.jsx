import { useState } from "react";
import { sendData } from "../api/api";

function InputForm({ setResult, setError }) {
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");

      const dataArray = input
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      const result = await sendData(dataArray);
      setResult(result);
    } catch (err) {
      setError("Failed to fetch API");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg border border-gray-200 p-6 rounded-2xl shadow-xl w-full max-w-xl transition hover:shadow-2xl">
      
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Enter Node Relationships
      </h2>

      <textarea
        className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        rows="4"
        placeholder="Example: A->B, B->C, C->D"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-medium shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
      >
        Analyze Hierarchy
      </button>
    </div>
  );
}

export default InputForm;