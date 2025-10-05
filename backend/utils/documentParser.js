// utils/documentParser.js
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

class DocumentParser {
  
  // Parse different document types and extract text content
  async parseDocument(fileContent, fileType) {
    try {
      let extractedText = '';
      
      console.log('\n=== PARSE DOCUMENT DEBUG ===');
      console.log('File type to parse:', fileType);
      console.log('Content length:', fileContent ? fileContent.length : 'null');
      
      switch (fileType.toLowerCase()) {
        case 'docx':
          console.log('Parsing as DOCX...');
          extractedText = await this.parseDocx(fileContent);
          break;
        case 'xlsx':
        case 'xls':
          console.log('Parsing as Excel...');
          extractedText = await this.parseExcel(fileContent);
          break;
        case 'pdf':
          console.log('Parsing as PDF...');
          extractedText = await this.parsePdf(fileContent);
          break;
        case 'txt':
        default:
          console.log('Processing as plain text...');
          // Plain text - already readable
          extractedText = fileContent;
          break;
      }
      
      console.log('Extracted text length:', extractedText ? extractedText.length : 'null');
      console.log('Extracted text (first 200 chars):', extractedText ? extractedText.substring(0, 200) : 'null');
      console.log('=== END PARSE DOCUMENT DEBUG ===\n');
      return extractedText;
      
    } catch (error) {
      console.error('Document parsing error:', error);
      // Fallback to treating as plain text
      return fileContent;
    }
  }
  
  // Extract text from data URL for simple cases
  extractTextFromDataUrl(dataUrl) {
    if (dataUrl.startsWith('data:')) {
      // For simple text extraction, we'll just return a placeholder
      // In a real implementation, you'd use a proper PDF parser
      return "PDF content detected - please convert to text file for full processing";
    }
    return dataUrl;
  }
  
  // Parse DOCX files
  async parseDocx(fileContent) {
    try {
      console.log('\n=== PARSE DOCX DEBUG ===');
      console.log('Input content type:', typeof fileContent);
      console.log('Input content length:', fileContent ? fileContent.length : 'null');
      console.log('Starts with data URL:', fileContent ? fileContent.startsWith('data:') : false);
      
      // Convert base64 or binary content to buffer
      let buffer;
      if (typeof fileContent === 'string') {
        // If it's base64 encoded
        if (fileContent.startsWith('data:')) {
          console.log('Processing data URL...');
          const base64Data = fileContent.split(',')[1];
          console.log('Base64 data length:', base64Data ? base64Data.length : 'null');
          buffer = Buffer.from(base64Data, 'base64');
          console.log('Buffer created, length:', buffer.length);
        } else {
          console.log('Processing as binary string...');
          // Try to parse as binary string
          buffer = Buffer.from(fileContent, 'binary');
        }
      } else {
        buffer = fileContent;
      }
      
      console.log('Calling mammoth.extractRawText...');
      const result = await mammoth.extractRawText({ buffer });
      console.log('Mammoth result success:', !!result);
      console.log('Extracted text length:', result.value ? result.value.length : 'null');
      console.log('Extracted text preview:', result.value ? result.value.substring(0, 200) : 'null');
      console.log('=== END PARSE DOCX DEBUG ===\n');
      
      return result.value;
    } catch (error) {
      console.error('DOCX parsing error:', error);
      console.log('Falling back to treating as plain text...');
      // Fallback - return original content as text
      return fileContent;
    }
  }
  
  // Parse PDF files
  async parsePdf(fileContent) {
    try {
      console.log('\n=== PARSE PDF DEBUG ===');
      console.log('Input content type:', typeof fileContent);
      console.log('Input content length:', fileContent ? fileContent.length : 'null');
      console.log('Starts with data URL:', fileContent ? fileContent.startsWith('data:') : false);
      
      // Convert base64 or binary content to buffer
      let buffer;
      if (typeof fileContent === 'string') {
        // If it's base64 encoded
        if (fileContent.startsWith('data:')) {
          console.log('Processing data URL...');
          const base64Data = fileContent.split(',')[1];
          console.log('Base64 data length:', base64Data ? base64Data.length : 'null');
          buffer = Buffer.from(base64Data, 'base64');
          console.log('Buffer created, length:', buffer.length);
        } else {
          console.log('Processing as binary string...');
          // Try to parse as binary string
          buffer = Buffer.from(fileContent, 'binary');
        }
      } else {
        buffer = fileContent;
      }
      
      console.log('Calling pdfParse...');
      const data = await pdfParse(buffer);
      console.log('PDF parsing result success:', !!data);
      console.log('Extracted text length:', data.text ? data.text.length : 'null');
      console.log('Extracted text preview:', data.text ? data.text.substring(0, 200) : 'null');
      console.log('=== END PARSE PDF DEBUG ===\n');
      
      return data.text;
    } catch (error) {
      console.error('PDF parsing error:', error);
      console.log('Falling back to treating as plain text...');
      // Fallback - return original content as text
      return fileContent;
    }
  }
  
  // Parse Excel files
  async parseExcel(fileContent) {
    try {
      let buffer;
      if (typeof fileContent === 'string') {
        if (fileContent.startsWith('data:')) {
          const base64Data = fileContent.split(',')[1];
          buffer = Buffer.from(base64Data, 'base64');
        } else {
          buffer = Buffer.from(fileContent, 'binary');
        }
      } else {
        buffer = fileContent;
      }
      
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      let allText = '';
      
      // Extract text from all sheets
      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        // Convert all cells to text
        jsonData.forEach(row => {
          row.forEach(cell => {
            if (cell) {
              allText += cell.toString() + ' ';
            }
          });
          allText += '\n';
        });
      });
      
      return allText;
    } catch (error) {
      console.error('Excel parsing error:', error);
      throw error;
    }
  }
  
  // Detect file type from filename or content
  detectFileType(filename, content) {
    console.log('\n=== DOCUMENT PARSER DEBUG ===');
    console.log('Filename:', filename);
    console.log('Content type:', typeof content);
    console.log('Content length:', content ? content.length : 'null');
    console.log('Content preview:', content ? content.substring(0, 100) : 'null');
    
    if (filename) {
      const extension = filename.split('.').pop().toLowerCase();
      console.log('File extension detected:', extension);
      if (['docx', 'pdf', 'xlsx', 'xls', 'txt'].includes(extension)) {
        console.log('File type from extension:', extension);
        return extension;
      }
    }
    
    // Try to detect from content signatures
    if (typeof content === 'string') {
      if (content.startsWith('PK')) {
        console.log('File type from content: docx (ZIP signature)');
        return 'docx'; // ZIP-based format
      }
      if (content.startsWith('%PDF')) {
        console.log('File type from content: pdf');
        return 'pdf';
      }
      if (content.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        console.log('File type from content: docx (data URL)');
        return 'docx';
      }
      if (content.startsWith('data:application/pdf')) {
        console.log('File type from content: pdf (data URL)');
        return 'pdf';
      }
      if (content.startsWith('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        console.log('File type from content: xlsx (data URL)');
        return 'xlsx';
      }
    }
    
    console.log('File type defaulting to: txt');
    console.log('=== END DOCUMENT PARSER DEBUG ===\n');
    return 'txt'; // Default to text
  }
}

export default new DocumentParser();
