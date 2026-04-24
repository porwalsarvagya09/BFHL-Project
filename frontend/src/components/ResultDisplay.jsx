function ResultDisplay({ result }) {
  if (!result) return null;

  return (
    <div className="mt-6 w-full max-w-3xl bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200">
      
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        📊 API Response
      </h2>

      <div className="bg-gray-900 text-green-400 text-sm p-4 rounded-lg overflow-x-auto">
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  );
}

export default ResultDisplay;