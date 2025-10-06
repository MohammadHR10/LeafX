// src/components/SupplyChainOptimizer.jsx
import { useEffect, useState } from 'react';
import './SupplyChainOptimizer.css';

const SupplyChainOptimizer = () => {
  const [step, setStep] = useState('upload'); // 'upload', 'alternatives', 'order', 'quote'
  const [loading, setLoading] = useState(false);
  const [extractedItems, setExtractedItems] = useState([]);
  const [alternatives, setAlternatives] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [order, setOrder] = useState(null);
  const [quote, setQuote] = useState(null);
  const [extractedSource, setExtractedSource] = useState(''); // Track whether data was dynamic or fallback

  // Auto-trigger alternatives search when items are extracted
  useEffect(() => {
    const isDynamic = extractedSource.toLowerCase().startsWith('dynamic');
    const shouldTrigger = extractedItems.length > 0 && step === 'alternatives' && alternatives.length === 0 && isDynamic;

    console.log('🔄 useEffect triggered:', {
      extractedItemsLength: extractedItems.length,
      currentStep: step,
      alternativesLength: alternatives.length,
      extractedSource,
      isDynamic,
      shouldTrigger
    });
    
    if (shouldTrigger) {
      console.log('✅ Auto-triggering findAlternatives (dynamic extraction confirmed)...');
      findAlternatives();
    } else {
      console.log('❌ Auto-trigger skipped (either not dynamic source or conditions unmet)');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractedItems, step, alternatives.length, extractedSource]);

    const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // For binary files (docx, pdf, xlsx), use base64
        if (file.type.includes('pdf') || file.type.includes('word') || file.type.includes('sheet')) {
          resolve(e.target.result); // This will be a data URL
        } else {
          // For text files, use text content
          resolve(e.target.result);
        }
      };
      reader.onerror = (e) => reject(e);
      
      // Read binary files as data URL, text files as text
      if (file.type.includes('pdf') || file.type.includes('word') || file.type.includes('sheet')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  // Step 1: Upload PDF and extract line items
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('📁 File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
    setLoading(true);
    
    try {
      // Read the actual file content
      const fileContent = await readFileContent(file);
      console.log('📄 File content preview:', fileContent.substring(0, 200) + '...');
      
      console.log('🚀 Sending to backend /api/mcp/upload-pdf...');
      const response = await fetch('/api/mcp/upload-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileContent: fileContent,
          filename: file.name 
        })
      });

      console.log('📡 Backend response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Backend response data:', data);
      
      if (data.success && data.line_items) {
        console.log('🎯 Setting extracted items:', data.line_items);
        setExtractedItems(data.line_items);
        setAlternatives([]); // Clear previous alternatives
        setSelectedItems([]); // Clear previous selections
        setOrder(null); // Clear previous order
        setQuote(null); // Clear previous quote
        setExtractedSource(data.extracted_from || '');
        setStep('alternatives');
      } else {
        throw new Error('Invalid response format or no items extracted');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      alert(`Error uploading file: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Find sustainable alternatives
  const findAlternatives = async () => {
    console.log('🔍 Finding alternatives for items:', extractedItems);
    setLoading(true);
    
    try {
      const response = await fetch('/api/mcp/find-alternatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: extractedItems })
      });

      console.log('📡 Alternatives response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Alternatives response data:', data);
      
      if (data.success && data.items) {
        console.log('🌱 Setting alternatives:', data.items);
        setAlternatives(data.items);
      } else {
        throw new Error('No alternatives found or invalid response format');
      }
    } catch (error) {
      console.error('❌ Alternatives error:', error);
      alert(`Error finding alternatives: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Select alternatives and create order
  const handleItemSelection = (originalIndex, alternativeIndex) => {
    const selected = alternatives[originalIndex].alternatives[alternativeIndex];
    const qty = extractedItems[originalIndex].qty;
    
    const item = {
      ...selected,
      qty: qty,
      original_desc: extractedItems[originalIndex].desc
    };

    setSelectedItems(prev => {
      const existing = prev.findIndex(p => p.alt_sku === selected.alt_sku);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = item;
        return updated;
      } else {
        return [...prev, item];
      }
    });
  };

  const createBulkOrder = async () => {
    if (selectedItems.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/mcp/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedItems })
      });

      const data = await response.json();
      if (data.success) {
        setOrder(data);
        setStep('order');
      }
    } catch (error) {
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Generate final quote
  const generateQuote = async () => {
    if (!order) return;

    setLoading(true);
    try {
      const response = await fetch('/api/mcp/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ po_id: order.po_id, orderData: order })
      });

      const data = await response.json();
      if (data.success) {
        setQuote(data.quote);
        setStep('quote');
        
        // Trigger voice briefing
        speakQuoteSummary(data.quote);
      }
    } catch (error) {
      console.error('Quote error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Voice briefing using ElevenLabs
  const speakQuoteSummary = async (quoteData) => {
    try {
      const text = `Procurement optimization complete. ${quoteData.sustainability_highlights.co2e_reduction}. ${quoteData.sustainability_highlights.cost_impact}. Sustainability score: ${quoteData.sustainability_highlights.sustainability_score}. Order ready for approval.`;
      
      const response = await fetch('/api/eleven/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('Voice briefing error:', error);
    }
  };

  const resetWorkflow = () => {
    setStep('upload');
    setExtractedItems([]);
    setAlternatives([]);
    setSelectedItems([]);
    setOrder(null);
    setQuote(null);
  };

  return (
    <div className="supply-chain-optimizer">
      <header className="optimizer-header">
        <h1>🌱 Sustainable Supply Chain Optimizer</h1>
        <p>Upload your procurement list → Get eco-friendly alternatives → Optimize costs & carbon footprint</p>
      </header>

      {/* Step Indicator */}
      <div className="step-indicator">
        <div className={`step ${step === 'upload' ? 'active' : step !== 'upload' ? 'completed' : ''}`}>
          <span>1</span> Upload
        </div>
        <div className={`step ${step === 'alternatives' ? 'active' : alternatives.length > 0 ? 'completed' : ''}`}>
          <span>2</span> Alternatives
        </div>
        <div className={`step ${step === 'order' ? 'active' : order ? 'completed' : ''}`}>
          <span>3</span> Order
        </div>
        <div className={`step ${step === 'quote' ? 'active' : ''}`}>
          <span>4</span> Quote
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div className="upload-section">
          <div className="upload-box">
            <div className="upload-icon">📄</div>
            <h3>Upload Procurement List</h3>
            <p>Upload your PDF or text file with supply requirements</p>
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              disabled={loading}
            />
            
            {loading && <div className="loading">Processing document...</div>}
          </div>
        </div>
      )}

      {/* Step 2: Alternatives */}
      {step === 'alternatives' && (
        <div className="alternatives-section">
          <div className="section-header">
            <div>
              <h3>📋 Extracted Items ({extractedItems.length})</h3>
              {extractedSource && (
                <div className={`extraction-source ${extractedSource.toLowerCase().startsWith('dynamic') ? 'ok' : 'fallback'}`}>
                  Source: {extractedSource}
                </div>
              )}
            </div>
            <button 
              onClick={findAlternatives} 
              disabled={loading || alternatives.length > 0 || !extractedSource.toLowerCase().startsWith('dynamic')}
              title={!extractedSource.toLowerCase().startsWith('dynamic') ? 'Dynamic items not detected – adjust document and re-upload' : 'Fetch sustainable options'}
            >
              {loading ? 'Finding Alternatives...' : 'Find Sustainable Options'}
            </button>
          </div>

          {!extractedSource.toLowerCase().startsWith('dynamic') && extractedItems.length > 0 && (
            <div className="fallback-warning">
              ⚠️ These look like inferred placeholder items (no structured quantities detected). Upload a clearer list (e.g. "- Item name (10 units)") to get truly dynamic alternatives.
            </div>
          )}

          {extractedItems.map((item, index) => (
            <div key={index} className="item-card">
              <div className="original-item">
                <h4>{item.desc}</h4>
                <span className="qty">Qty: {item.qty} {item.unit}</span>
              </div>

              {alternatives[index] && (
                <div className="alternatives-list">
                  <h5>🌱 Sustainable Alternatives:</h5>
                  {alternatives[index].alternatives.map((alt, altIndex) => (
                    <div key={altIndex} className="alternative-option">
                      <div className="alt-info">
                        <div className="alt-name">{alt.name}</div>
                        <div className="alt-details">
                          <span className="price">${alt.price}</span>
                          <span className="recycled">{alt.recycled_pct}% recycled</span>
                          <span className="co2e">{alt.co2e_per_unit} kg CO2e</span>
                          <div className="certs">
                            {alt.certs.map(cert => (
                              <span key={cert} className="cert-badge">{cert}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleItemSelection(index, altIndex)}
                        className="select-btn"
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {selectedItems.length > 0 && (
            <div className="selected-summary">
              <h4>✅ Selected Items ({selectedItems.length})</h4>
              <button onClick={createBulkOrder} disabled={loading}>
                {loading ? 'Creating Order...' : 'Create Bulk Order'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Order Summary */}
      {step === 'order' && order && (
        <div className="order-section">
          <div className="order-header">
            <h3>📦 Order Summary - {order.po_id}</h3>
            <div className="order-metrics">
              <div className="metric">
                <span className="value">${order.subtotal}</span>
                <span className="label">Total</span>
              </div>
              <div className="metric">
                <span className="value">{order.eta_days} days</span>
                <span className="label">ETA</span>
              </div>
              <div className="metric">
                <span className="value">{order.sustainability_score}/100</span>
                <span className="label">Sustainability</span>
              </div>
            </div>
          </div>

          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-name">{item.name}</div>
                <div className="item-details">
                  <span>Qty: {item.qty}</span>
                  <span>${item.unit_price} each</span>
                  <span>${item.total_price} total</span>
                </div>
              </div>
            ))}
          </div>

          <div className="environmental-impact">
            <h4>🌍 Environmental Impact</h4>
            <div className="impact-metrics">
              <div className="impact-item">
                <span className="impact-value">{order.total_co2e_savings} kg</span>
                <span className="impact-label">CO2e Reduction</span>
              </div>
              <div className="impact-item">
                <span className="impact-value">${order.total_cost_savings}</span>
                <span className="impact-label">Cost Impact</span>
              </div>
            </div>
          </div>

          <button onClick={generateQuote} disabled={loading} className="generate-quote-btn">
            {loading ? 'Generating Quote...' : '🎯 Generate Final Quote'}
          </button>
        </div>
      )}

      {/* Step 4: Final Quote */}
      {step === 'quote' && quote && (
        <div className="quote-section">
          <div className="quote-header">
            <h3>✅ Quote Generated - {quote.po_id}</h3>
            <div className="quote-timestamp">
              Generated: {new Date(quote.generated_at).toLocaleString()}
            </div>
          </div>

          <div className="quote-summary">
            <div className="summary-text">{quote.summary}</div>
          </div>

          <div className="sustainability-highlights">
            <h4>🏆 Sustainability Achievements</h4>
            <div className="highlights-grid">
              <div className="highlight">
                <span className="highlight-icon">🌱</span>
                <span className="highlight-value">{quote.sustainability_highlights.co2e_reduction}</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">💰</span>
                <span className="highlight-value">{quote.sustainability_highlights.cost_impact}</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">📜</span>
                <span className="highlight-value">{quote.sustainability_highlights.certifications.join(', ')}</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">⭐</span>
                <span className="highlight-value">{quote.sustainability_highlights.sustainability_score}</span>
              </div>
            </div>
          </div>

          <div className="quote-actions">
            <button onClick={resetWorkflow} className="new-quote-btn">
              📄 Start New Optimization
            </button>
            <button className="download-btn">
              📥 Download Quote PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyChainOptimizer;
