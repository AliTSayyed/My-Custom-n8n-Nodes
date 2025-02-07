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
				typeOptions: { alwaysOpenEditWindow: false, rows: 1,},
				placeholder: '{"DocNumber": "12345", "TxnDate": 2025-01-08"}',
				description: 'Processed QuickBooks JSON data for invoice generation',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'fixedCollection',
				default: {},
				description: 'Optional settings for additional message and PDF button.',
				typeOptions: {
					multipleValues: false,
				},
				options: [
					// Add a custom message
					{
						displayName: 'Add Message',
						name: 'messageOption',
						values: [
							{
								displayName: 'Message',
								name: 'message',
								type: 'string',
								default: '',
								placeholder: 'Include message here',
								description: 'A custom message to include in the template.',
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
			const options = this.getNodeParameter('options', i) as {
				messageOption?: { message?: string };
				pdfOption?: { pdfButton?: boolean };
			};

			// check for optional message content
			const message = options?.messageOption?.message ?? '';
			// check for optional pdf button
			const pdfButton = options?.pdfOption?.pdfButton ?? false;

			// Merge all feilds into on object for handlebars tempalte
			const combinedData = { ...jsonData, message, pdfButton };

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
