import { useState } from "react";
import InputForm from "./components/InputForm";
import ResultDisplay from "./components/ResultDisplay";

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center p-6">
      
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
        🌳 BFHL Hierarchy Analyzer
      </h1>

      <InputForm setResult={setResult} setError={setError} />

      {error && (
        <div className="mt-4 bg-red-100 text-red-600 px-4 py-2 rounded shadow">
          {error}
        </div>
      )}

      <ResultDisplay result={result} />
    </div>
  );
}

export default App;