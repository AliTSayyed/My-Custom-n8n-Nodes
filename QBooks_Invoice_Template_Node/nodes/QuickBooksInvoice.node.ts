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
				required: true,
				description: 'Processed QuickBooks JSON data for invoice generation',
			},
			{
				// Select an outreach message template
				displayName: 'Select an outreach message template',
				name: 'outReachMessage',
				type: 'options',
				options: [
					{
						name: 'None',
						value: ''
					},
					{
						name: 'Inital Outreach',
						value: 'initialMessage'
					},
					{
						name: 'Week Before Outreach',
						value: 'weekBeforeMessage'
					},
					{
						name: '3 Days Before Outreach',
						value: 'threeDaysBeforeMessage'
					},
					{
						name: 'Due Date Outreach',
						value: 'dueDayMessage'
					},
				],
				default: '',
				required: false,
				description: 'Select the out reach message to be included at the top of the AR invoice email',
			},
			// PDF Download Button
			{
				displayName: 'Add PDF Download Button',
				name: 'pdfButton',
				type: 'boolean',
				default: true,
				required: false,
				description: 'Enable this to add a "Download PDF" button.',
			},
			// Extra options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add option',
				default: {},
				description: 'Optional settings for a custom message and/or PDF button.',
				required: false,
				options: [
					// Add a custom message
					{
						displayName: 'Custom Message',
						description: 'A custom message to send with the invoice. You can use HTML for formatting.',
						name: 'customMessage',
						type: 'string',
						default: '',
						placeholder: 'Include a custom message here',
						typeOptions: {editor: 'htmlEditor', rows: 5},
					},
				],

			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];
		// register all custom helper functions before compiling
		registerHelpers();

		const items = this.getInputData();
		for (let i = 0; i < items.length; i++) {
			const jsonData = this.getNodeParameter('data', i) as object;
			const outReachMessage = this.getNodeParameter('outReachMessage', i) as string;
			const pdfButton = this.getNodeParameter('pdfButton', i) as boolean;
			const options = this.getNodeParameter('options', i) as {customMessage?: string};

			// check for custom message 
			const customMessage = options?.customMessage ?? '';
		
			// Merge all feilds into on object for handlebars tempalte
			const combinedData = { ...jsonData, outReachMessage, customMessage, pdfButton };

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
