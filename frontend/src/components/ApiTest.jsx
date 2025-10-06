// Quick API test component
import { useState } from 'react';

const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testUploadApi = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mcp/upload-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileContent: 'test content',
          filename: 'test.txt' 
        })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAlternativesApi = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mcp/find-alternatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: [
            { desc: 'office supplies', qty: 10, unit: 'units' },
            { desc: 'paper', qty: 5, unit: 'reams' }
          ]
        })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🧪 API Test Panel</h2>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testUploadApi} disabled={loading} style={{ marginRight: '10px' }}>
          Test Upload API
        </button>
        <button onClick={testAlternativesApi} disabled={loading}>
          Test Alternatives API
        </button>
      </div>
      {loading && <p>Loading...</p>}
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        fontSize: '12px',
        overflow: 'auto',
        maxHeight: '400px'
      }}>
        {result || 'Click a button to test API endpoints'}
      </pre>
    </div>
  );
};

export default ApiTest;