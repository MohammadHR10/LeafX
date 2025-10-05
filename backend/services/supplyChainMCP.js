// services/supplyChainMCP.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import documentParser from '../utils/documentParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SupplyChainMCPService {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data');
    this.samplesPath = path.join(__dirname, '../../samples');
    this.loadData();
  }

  loadData() {
    // Load marketplace data
    const marketplaceData = JSON.parse(
      fs.readFileSync(path.join(this.dataPath, 'marketplace.json'), 'utf8')
    );
    this.products = marketplaceData.products;

    // Load inventory data
    const inventoryCSV = fs.readFileSync(
      path.join(this.dataPath, 'inventory.csv'), 'utf8'
    );
    this.inventory = this.parseCSV(inventoryCSV);
  }

  parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });
  }

  // MCP Tool 1: Extract line items from PDF/text with DYNAMIC EXTRACTION
  async uploadPdfAndExtractLines(fileContent, filename = '') {
    try {
      console.log('\n=== UPLOAD PDF DEBUG ===');
      console.log('Filename received:', filename);
      console.log('Content type:', typeof fileContent);
      console.log('Content length:', fileContent ? fileContent.length : 'null');
      
      // Parse document content based on file type
      const fileType = documentParser.detectFileType(filename, fileContent);
      console.log('Detected file type:', fileType);
      
      let extractedText;
      if (fileType === 'txt' || typeof fileContent === 'string' && !fileContent.startsWith('data:')) {
        // Plain text content
        extractedText = fileContent;
        console.log('Processing as plain text');
      } else {
        // Parse binary document
        console.log('Processing as binary document, using parser...');
        extractedText = await documentParser.parseDocument(fileContent, fileType);
      }
      
      console.log('Extracted text length:', extractedText ? extractedText.length : 'null');
      console.log('Extracted text (first 200 chars):', extractedText ? extractedText.substring(0, 200) : 'null');
      
      // DYNAMIC EXTRACTION - Parse actual content for procurement items
      let extractedItems = [];
      let extractedFrom = "Dynamic Content Extraction";
      
      console.log('🔍 STARTING DYNAMIC EXTRACTION...');
      const lines = extractedText.split('\n');
      console.log('📄 Processing', lines.length, 'lines of content');
      
      for (let line of lines) {
        // Skip empty lines
        if (!line.trim()) continue;
        
        console.log('📝 Processing line:', line.trim());
        
        // Pattern 1: "Item - Quantity: X units" format  
        const itemQtyMatch = line.match(/^(.+?)\s*-\s*(?:quantity|qty):\s*(\d+)\s*(\w+)/i);
        if (itemQtyMatch) {
          const desc = itemQtyMatch[1];
          const qty = parseInt(itemQtyMatch[2]);
          const unit = itemQtyMatch[3];
          
          if (qty > 0 && desc.length > 2) {
            extractedItems.push({
              desc: desc.toLowerCase().replace(/[^\w\s]/g, ' ').trim().substring(0, 50),
              qty: qty,
              unit: unit
            });
            console.log(`✅ Pattern 1 - Extracted: ${desc} (${qty} ${unit})`);
          }
        }
        
        // Pattern 2: "- Item name (quantity units)" format (common in bullet lists)
        const bulletMatch = line.match(/^-\s*(.+?)\s*\((\d+)\s*(\w+)\)/i);
        if (bulletMatch) {
          const desc = bulletMatch[1];
          const qty = parseInt(bulletMatch[2]);
          const unit = bulletMatch[3];
          
          if (qty > 0 && desc.length > 2) {
            extractedItems.push({
              desc: desc.toLowerCase().replace(/[^\w\s]/g, ' ').trim().substring(0, 50),
              qty: qty,
              unit: unit
            });
            console.log(`✅ Pattern 2 (Bullet) - Extracted: ${desc} (${qty} ${unit})`);
          }
        }
        
        // Pattern 3: "Number. Item Name - Quantity: X units" format
        const numberedMatch = line.match(/^\d+\.\s*(.+?)\s*-\s*(?:quantity|qty):\s*(\d+)\s*(\w+)/i);
        if (numberedMatch) {
          const desc = numberedMatch[1];
          const qty = parseInt(numberedMatch[2]);
          const unit = numberedMatch[3];
          
          if (qty > 0 && desc.length > 2) {
            extractedItems.push({
              desc: desc.toLowerCase().replace(/[^\w\s]/g, ' ').trim().substring(0, 50),
              qty: qty,
              unit: unit
            });
            console.log(`✅ Pattern 3 - Extracted: ${desc} (${qty} ${unit})`);
          }
        }
        
        // Pattern 4: Simple format "Item Name - Quantity" 
        const simpleDashMatch = line.match(/^(.+?)\s*-\s*(\d+)\s*$/);
        if (simpleDashMatch) {
          const desc = simpleDashMatch[1];
          const qty = parseInt(simpleDashMatch[2]);
          
          if (qty > 0 && desc.length > 3) {
            extractedItems.push({
              desc: desc.toLowerCase().trim().substring(0, 50),
              qty: qty,
              unit: 'units'
            });
            console.log(`✅ Pattern 3 - Extracted: ${desc} (${qty} units)`);
          }
        }
      }
      
      // Remove duplicates
      const uniqueItems = [];
      const seen = new Set();
      for (const item of extractedItems) {
        const key = `${item.desc}-${item.qty}-${item.unit}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueItems.push(item);
        }
      }
      extractedItems = uniqueItems;
      
      console.log(`🔍 Dynamic extraction found ${extractedItems.length} unique items`);
      
      // Use fallback only if absolutely no items found
      if (extractedItems.length === 0) {
        console.log('🔄 FALLBACK: No dynamic items found, using content-based inference...');
        if (extractedText.toLowerCase().includes('paper') || extractedText.toLowerCase().includes('office')) {
          extractedItems = [
            { desc: "office paper", qty: 100, unit: "ream" },
            { desc: "writing pens", qty: 50, unit: "box" }
          ];
          extractedFrom = "Office Supplies (Inferred)";
        } else {
          extractedItems = [
            { desc: "general office supplies", qty: 50, unit: "units" },
            { desc: "miscellaneous items", qty: 25, unit: "pieces" }
          ];
          extractedFrom = "General Supplies (Inferred)";
        }
      }

      console.log('📤 FINAL RESULT:');
      console.log('- Extracted items count:', extractedItems.length);
      console.log('- Extracted from:', extractedFrom);
      console.log('- Items:', extractedItems.map(item => `${item.desc} (${item.qty} ${item.unit})`));
      console.log('=== END UPLOAD PDF DEBUG ===\n');

      return {
        success: true,
        line_items: extractedItems,
        extracted_from: extractedFrom
      };
    } catch (error) {
      console.error('Error extracting items:', error);
      // Fallback to sample data on error
      return {
        success: true,
        line_items: [
          { desc: "general office supplies", qty: 50, unit: "units" },
          { desc: "miscellaneous items", qty: 25, unit: "pieces" }
        ],
        extracted_from: "Error Fallback"
      };
    }
  }

  // MCP Tool 2: Find sustainable alternatives
  findSustainableAlternatives(items) {
    const results = items.map(item => {
      const alternatives = this.findAlternativesForItem(item);
      return {
        original: item,
        alternatives: alternatives
      };
    });

    return {
      success: true,
      items: results
    };
  }

  findAlternativesForItem(item) {
    const desc = item.desc.toLowerCase();
    let matchedProducts = [];

    console.log(`🔍 Finding alternatives for: "${desc}"`);

    // Keyword → category map
    const keywordCategoryMap = [
      { keywords: ['paper','folder','notebook'], categories: ['office_supplies'] },
      { keywords: ['towel'], categories: ['janitorial'] },
      { keywords: ['pen'], categories: ['office_supplies'] },
      { keywords: ['cleaner','cleaning','solution'], categories: ['janitorial'] },
      { keywords: ['ethernet','cat6','network cable'], categories: ['it_hardware'] },
      { keywords: ['thermal paste','thermal'], categories: ['it_hardware'] },
      { keywords: ['label'], categories: ['it_supplies'] },
      { keywords: ['wrist','anti static','esd'], categories: ['it_hardware'] }
    ];

    for (const entry of keywordCategoryMap) {
      if (entry.keywords.some(k => desc.includes(k))) {
        matchedProducts = this.products.filter(p => entry.categories.includes(p.category));
        console.log(`🗂️ Category match (${entry.categories.join(', ')}): ${matchedProducts.length} products`);
        break;
      }
    }

    // Narrow further by keyword in product name to improve relevance
    if (matchedProducts.length > 0) {
      const nameFiltered = matchedProducts.filter(p => p.name.toLowerCase().includes(desc.split(' ')[0]));
      if (nameFiltered.length > 0) matchedProducts = nameFiltered;
    }

    if (matchedProducts.length === 0) {
      // Fallback: Create mock sustainable alternatives for common office items
      console.log(`🔄 Creating mock alternatives for: ${desc}`);
      
      if (desc.includes('welcome') || desc.includes('handbook') || desc.includes('folder')) {
        matchedProducts = [
          {
            sku: "FOLDER-STD-LEGAL",
            name: "Presentation Folder Standard",
            price: 1.25,
            category: "office_supplies",
            certs: [],
            recycled_pct: 0,
            co2e_per_unit: 0.15,
            lead_time_days: 3,
            moq: 50
          },
          {
            sku: "FOLDER-RCY-LEGAL",
            name: "Presentation Folder Recycled",
            price: 1.45,
            category: "office_supplies",
            certs: ["FSC Recycled", "Post-Consumer"],
            recycled_pct: 75,
            co2e_per_unit: 0.08,
            lead_time_days: 5,
            moq: 50
          }
        ];
      } else if (desc.includes('badge') || desc.includes('lanyard')) {
        matchedProducts = [
          {
            sku: "BADGE-STD-PLASTIC",
            name: "Name Badge Plastic Standard",
            price: 0.85,
            category: "office_supplies",
            certs: [],
            recycled_pct: 0,
            co2e_per_unit: 0.25,
            lead_time_days: 2,
            moq: 25
          },
          {
            sku: "BADGE-ECO-BAMBOO",
            name: "Name Badge Eco-Bamboo",
            price: 1.15,
            category: "office_supplies",
            certs: ["Sustainable Materials"],
            recycled_pct: 0,
            co2e_per_unit: 0.12,
            lead_time_days: 7,
            moq: 25
          }
        ];
      } else if (desc.includes('water') || desc.includes('bottle')) {
        matchedProducts = [
          {
            sku: "BOTTLE-STD-500ML",
            name: "Water Bottle 500ml Standard",
            price: 3.50,
            category: "office_supplies",
            certs: [],
            recycled_pct: 0,
            co2e_per_unit: 1.80,
            lead_time_days: 5,
            moq: 12
          },
          {
            sku: "BOTTLE-ECO-500ML",
            name: "Water Bottle 500ml Recycled Steel",
            price: 8.50,
            category: "office_supplies",
            certs: ["Recycled Content", "BPA-Free"],
            recycled_pct: 85,
            co2e_per_unit: 0.95,
            lead_time_days: 10,
            moq: 12
          }
        ];
      } else if (desc.includes('notebook') || desc.includes('note')) {
        matchedProducts = [
          {
            sku: "NOTE-STD-SPIRAL",
            name: "Spiral Notebook Standard",
            price: 3.50,
            category: "office_supplies",
            certs: [],
            recycled_pct: 0,
            co2e_per_unit: 0.45,
            lead_time_days: 2,
            moq: 25
          },
          {
            sku: "NOTE-RCY-SPIRAL",
            name: "Spiral Notebook Recycled Paper",
            price: 4.20,
            category: "office_supplies",
            certs: ["FSC Recycled", "Post-Consumer"],
            recycled_pct: 80,
            co2e_per_unit: 0.30,
            lead_time_days: 3,
            moq: 25
          }
        ];
      } else {
        // Default fallback for any unmatched items
        // Provide more varied generic fallback with differing recycled % values
        matchedProducts = [
          { sku: "GEN-STD-OFFICE", name: `${item.desc} standard`, price: 5.00, category: "office_supplies", certs: [], recycled_pct: 0, co2e_per_unit: 1.20, lead_time_days: 3, moq: 10 },
          { sku: "GEN-RCY-40", name: `${item.desc} partial recycled`, price: 5.60, category: "office_supplies", certs: ["Recycled Content"], recycled_pct: 40, co2e_per_unit: 0.95, lead_time_days: 5, moq: 10 },
          { sku: "GEN-RCY-80", name: `${item.desc} high recycled`, price: 6.10, category: "office_supplies", certs: ["Recycled Content","Low Carbon"], recycled_pct: 80, co2e_per_unit: 0.70, lead_time_days: 6, moq: 10 }
        ];
      }
  console.log(`🆕 Created ${matchedProducts.length} mock alternatives`);
    }

    // Return sustainable alternatives (higher recycled_pct, lower co2e)
    const sustainableAlternatives = matchedProducts
      .filter(p => p.recycled_pct > 0 || p.co2e_per_unit < 1.5)
      .map(p => ({
        alt_sku: p.sku,
        name: p.name,
        price: p.price,
        certs: p.certs,
        recycled_pct: p.recycled_pct,
        co2e_per_unit: p.co2e_per_unit,
        lead_time_days: p.lead_time_days,
        price_delta: this.calculatePriceDelta(item, p),
        co2e_delta: this.calculateCO2Delta(item, p)
      }));
    
    console.log(`✅ Returning ${sustainableAlternatives.length} sustainable alternatives for "${desc}"`);
    return sustainableAlternatives;
  }

  calculatePriceDelta(originalItem, altProduct) {
    // Find original product for comparison
    const original = this.findOriginalProduct(originalItem);
    if (!original) return { absolute: "0.00", percentage: "0.0%", savings: false };
    
    const delta = altProduct.price - original.price;
    const percentage = ((delta / original.price) * 100).toFixed(1);
    return {
      absolute: delta.toFixed(2),
      percentage: percentage + '%',
      savings: delta < 0
    };
  }

  calculateCO2Delta(originalItem, altProduct) {
    const original = this.findOriginalProduct(originalItem);
    if (!original) return { absolute: "0.00", percentage: "0.0%", reduction: false };

    const delta = altProduct.co2e_per_unit - original.co2e_per_unit;
    const percentage = ((delta / original.co2e_per_unit) * 100).toFixed(1);
    return {
      absolute: delta.toFixed(2),
      percentage: percentage + '%',
      reduction: delta < 0
    };
  }

  findOriginalProduct(item) {
    const desc = item.desc.toLowerCase();
    
    if (desc.includes('paper') || desc.includes('folder')) {
      return this.products.find(p => p.sku === 'PAPER-STD-80');
    } else if (desc.includes('towel')) {
      return this.products.find(p => p.sku === 'TOWEL-STD-2P');
    } else if (desc.includes('pen')) {
      return this.products.find(p => p.sku === 'PEN-STD-BLK');
    } else if (desc.includes('cleaner') || desc.includes('cleaning')) {
      return this.products.find(p => p.sku === 'CLEAN-STD-ALL');
    }
    
    return null;
  }

  // MCP Tool 3: Check stock and pricing
  checkStockAndPrice(sku, qty) {
    const product = this.products.find(p => p.sku === sku);
    const inventory = this.inventory.find(i => i.sku === sku);
    
    if (!product) {
      return {
        success: false,
        error: "Product not found"
      };
    }

    const available = inventory ? parseInt(inventory.stock) : 0;
    const totalPrice = product.price * qty;

    return {
      success: true,
      sku: sku,
      name: product.name,
      price_per_unit: product.price,
      quantity_requested: qty,
      quantity_available: available,
      in_stock: available >= qty,
      total_price: totalPrice.toFixed(2),
      lead_time_days: product.lead_time_days
    };
  }

  // MCP Tool 4: Create bulk order
  createBulkOrder(items) {
    const orderItems = items.map(item => {
      const stockCheck = this.checkStockAndPrice(item.sku, item.qty);
      return {
        ...item,
        ...stockCheck
      };
    });

    const totalValue = orderItems.reduce((sum, item) => 
      sum + (item.success ? parseFloat(item.total_price) : 0), 0
    );

    return {
      success: true,
      order_id: `PO-${Date.now()}`,
      items: orderItems,
      total_value: totalValue.toFixed(2),
      status: "pending_approval"
    };
  }

  // MCP Tool 5: Generate quote
  emitQuote(orderId, orderData) {
    return {
      success: true,
      quote_id: `QT-${Date.now()}`,
      order_id: orderId,
      quote_date: new Date().toISOString().split('T')[0],
      valid_until: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      items: orderData.items,
      subtotal: orderData.total_value,
      tax: (parseFloat(orderData.total_value) * 0.08).toFixed(2),
      total: (parseFloat(orderData.total_value) * 1.08).toFixed(2)
    };
  }
}

export default SupplyChainMCPService;
