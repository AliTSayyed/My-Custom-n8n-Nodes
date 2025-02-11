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
		// credentials: [
		// 	{
		// 		name: 'noAuth',
		// 		required: false,
		// 	},
		// ],
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
				displayName: 'InitalMessage',
				name: 'initialMessage',
				type: 'boolean',
				default: false,
				required: false,
				description: 'Turn this on for the first email message.'
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'fixedCollection',
				default: {},
				description: 'Optional settings for a custom message and/or PDF button.',
				typeOptions: {
					multipleValues: false,
			},
				options: [
					// Add a custom message
					{
						displayName: 'Custom Message',
						name: 'messageOption',
						values: [
							{
								displayName: 'Custom Message (can use HTML if needed)',
								name: 'customMessage',
								type: 'string',
								default: '',
								placeholder: 'Include BODY ONLY of email message here',
								typeOptions: {editor: 'htmlEditor', rows: 5},
								description: 'A custom message to send with the invoice. SEND BODY ONLY, the salutation and sign off are already included. To delete this field you need to delete the entire node and restart (n8n bug).',
							},
						],
					},
					// Enable PDF Download Button
					{
						displayName: 'Add PDF Download Button',
						name: 'pdfOption',
						values: [
							{
								displayName: 'Generate PDF Button',
								name: 'pdfButton',
								type: 'boolean',
								default: true,
								description: 'Enable this to add a "Download PDF" button.',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// register all custom helper functions before compiling
		registerHelpers();

		for (let i = 0; i < items.length; i++) {
			const jsonData = this.getNodeParameter('data', i) as object;
			const initialMessage = this.getNodeParameter('initialMessage', i) as boolean;
			const options = this.getNodeParameter('options', i) as {
				messageOption?: { customMessage?: string };
				pdfOption?: { pdfButton?: boolean };
			};
			
			// check for optional message content
			let customMessage = options?.messageOption || false;
			const customMessageContent = options?.messageOption?.customMessage ?? '';
			if (customMessageContent === ''){
				customMessage = false; // if by accident message option is clicked but no content is input, then ignore the custom message.
			}
			// check for optional pdf button
			const pdfButton = options?.pdfOption?.pdfButton ?? false;

			// Merge all feilds into on object for handlebars tempalte
			const combinedData = { ...jsonData, initialMessage, customMessage, customMessageContent, pdfButton };

			// create the invoice template using handlebars
			try {
				const template = Handlebars.compile(handlebarsTemplate);
				const output = template(combinedData);
				returnData.push({ json: { output } });
			} catch (error) {
				throw new Error(`Handlebars rendering failed: ${error.message}`);
			}
		}
		return [returnData];
	}
}
