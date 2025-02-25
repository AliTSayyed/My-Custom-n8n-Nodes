import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as Handlebars from 'handlebars';

import { handlebarsTemplate } from './template';

import { registerHelpers } from './helpers';

export class QuickBooksInvoice implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'QuickBooks Invoice Template',
		name: 'qBooksInvoiceNode',
		icon: 'file:brain.svg',
		group: ['transform'],
		version: 1,
		description: 'Generates an Invoice from QuickBooks API data',
		defaults: {
			name: 'QuickBooks Invoice Template',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				// Input QuickBooks API Data
				displayName: 'QuickBooks Data',
				name: 'data',
				type: 'json',
				default: '',
				required: false,
				description: 'Processed QuickBooks JSON data for invoice generation',
			},
			{
				displayName: 'Inital Outreach',
				name: 'initialMessage',
				type: 'boolean',
				default: false,
				required: false,
				description: 'Turn this on for the first email message.'
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add option',
				default: {},
				description: 'Optional settings for a custom message and/or PDF button.',
				options: [
					// Add a custom message
					{
						displayName: 'Custom Message',
						description: 'A custom message to send with the invoice. SEND BODY ONLY, the salutation and sign off are already included. To delete this field you may have to delete the entire node and restart (n8n bug).',
						name: 'customMessage',
						type: 'string',
						default: '',
						placeholder: 'Include BODY ONLY of email message here',
						typeOptions: {editor: 'htmlEditor', rows: 5},
					},
					// Enable PDF Download Button
					{
						displayName: 'Add PDF Download Button',
						description: 'Enable this to add a "Download PDF" button.',
						name: 'pdfButton',
						type: 'boolean',
						default: true,
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];

		// register all custom helper functions before compiling
		registerHelpers();

		this.getInputData().forEach((_, itemIndex) => {
			const jsonData = this.getNodeParameter('data', itemIndex) as object;
			const initialMessage = this.getNodeParameter('initialMessage', itemIndex) as boolean;
			const options = this.getNodeParameter('options', itemIndex) as {
				customMessage?: string ;
				pdfButton?: boolean ;
		}

			// check for custom message 
			const customMessage = options?.customMessage ?? '';
		
			// check for optional pdf button
			const pdfButton = options?.pdfButton ?? false;

			// Merge all feilds into on object for handlebars tempalte
			const combinedData = { ...jsonData, initialMessage, customMessage, pdfButton };

			// create the invoice template using handlebars
			try {
				const template = Handlebars.compile(handlebarsTemplate);
				const output = template(combinedData);
				returnData.push({ json: { output } });
			} catch (error) {
				throw new Error(`Handlebars rendering failed: ${error.message}`);
			}
		});

		return [returnData];
	}
}
