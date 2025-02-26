import { IExecuteFunctions } from 'n8n-workflow';
import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

interface TextChunk {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class PdfTextExtractor implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'PDF Text Extractor',
    name: 'pdfTextExtractor',
    icon: 'file:brain.svg',
    group: ['transform'],
    version: 1,
    description: 'Extracts specific text from a base64-encoded PDF and returns the text with its coordinates',
    defaults: {
      name: 'PDF Text Extractor',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Base64 Encoded PDF',
        name: 'base64Pdf',
        type: 'string',
        default: '',
        placeholder: 'Paste your Base64 encoded PDF here',
        description: 'The PDF file encoded in base64 format',
        required: true,
      },
      {
        displayName: 'Search Text Array (JSON Array of Strings)',
        name: 'searchTextArray',
        type: 'string',
        default: '',
        placeholder: '["example", "text", "to", "search"]',
        description: 'A JSON array of strings to search for in the PDF',
        required: true,
      },
    ],
  };

  private static buildTextChunks(items: any[]): TextChunk[] {
    const chunks: TextChunk[] = [];
    let currentChunk: TextChunk | null = null;

    for (const item of items) {
      const [, , , scaleY, x, y] = item.transform;
      const height = Math.abs(scaleY); // Use the scale from transform for height

      if (!currentChunk ||
          Math.abs(currentChunk.y - y) > 2 ||
          Math.abs(currentChunk.x + currentChunk.width - x) > 10) {

        if (currentChunk) {
          const splitTexts = currentChunk.text.split('|').map(t => t.trim());
          let currentX = currentChunk.x;

          for (const text of splitTexts) {
            if (text) {
              const approxWidth = (text.length / currentChunk.text.length) * currentChunk.width;
              chunks.push({
                text,
                x: currentX,
                y: currentChunk.y,
                width: approxWidth,
                height: currentChunk.height
              });
              currentX += approxWidth;
            }
          }
        }

        currentChunk = {
          text: item.str,
          x,
          y,
          width: item.width || 0,
          height
        };
      } else {
        currentChunk.text += item.str;
        currentChunk.width += item.width || 0;
      }
    }

    if (currentChunk) {
      const splitTexts = currentChunk.text.split('|').map(t => t.trim());
      let currentX = currentChunk.x;

      for (const text of splitTexts) {
        if (text) {
          const approxWidth = (text.length / currentChunk.text.length) * currentChunk.width;
          chunks.push({
            text,
            x: currentX,
            y: currentChunk.y,
            width: approxWidth,
            height: currentChunk.height
          });
          currentX += approxWidth;
        }
      }
    }

    return chunks;
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const results: INodeExecutionData[] = [];

    try {
			const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
      pdfjsLib.GlobalWorkerOptions.workerSrc = false;

      for (let i = 0; i < items.length; i++) {
        const base64Pdf = this.getNodeParameter('base64Pdf', i) as string;
        const searchTextArrayStr = this.getNodeParameter('searchTextArray', i) as string;
        let searchTextArray: string[];

        try {
          searchTextArray = JSON.parse(searchTextArrayStr);
        } catch (error) {
          throw new NodeOperationError(this, `Invalid JSON array: ${error.message}`);
        }

        const pdfBuffer = Buffer.from(base64Pdf, 'base64');
        const pdfData = new Uint8Array(pdfBuffer);
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdfDocument = await loadingTask.promise;

        const matchedTexts: Array<TextChunk & { pageWidth: number; pageHeight: number }> = [];

        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
          const page = await pdfDocument.getPage(pageNum);
          const textContent = await page.getTextContent();
          const viewport = page.getViewport({ scale: 1.0 });

          const chunks = PdfTextExtractor.buildTextChunks(textContent.items);

          chunks.forEach(chunk => {
            if (searchTextArray.includes(chunk.text)) {
              matchedTexts.push({
                ...chunk,
                pageWidth: viewport.width,
                pageHeight: viewport.height,
              });
            }
          });
        }

        results.push({
          json: {
            matchedTexts,
          },
        });
      }
    } catch (error) {
      console.error('PDF processing error:', error);
      throw new NodeOperationError(this, `Error processing PDF: ${error.message}`);
    }

    return [results];
  }
}
