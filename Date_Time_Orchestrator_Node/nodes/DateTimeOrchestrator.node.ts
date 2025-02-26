import {
  IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class DateTimeOrchestrator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Date Time Orchestrator',
		name: 'dateTimeOrchestrator',
		icon: 'file:brain.svg',
		group: ['transform'],
		version: 1,
		description: 'Transform a date string into multiple customized datetime outputs with flexible offsets, times, and timezones.',
		defaults: {
			name: 'Date Time Orchestrator',
		},
		inputs: ['main'],
		outputs: ['main'],

		properties: [
			{
				// Enter the Reference Date
				displayName: 'Reference Date',
				name: 'referenceDate',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				required: true,
				description: 'Must use YYYY-MM-DD format',
			},
			{
				// Enter the number of days before or after for the new date
				displayName: 'Days Offset',
				name: 'daysOffset',
				type: 'number',
				default: '',
				placeholder: '0',
				required: true,
				description: 'Negative numbers are days before and positive numbers are days after the reference date',
			},
			{
				// Enter the time of the date
				displayName: 'Specify a Time (Military Time Format)',
				name: 'stringTime',
				type: 'string',
				default: 'HH:mm:ss',
				placeholder: 'HH:mm:ss',
				required: true,
				description: 'Specify the time you want with your date in a 24 Hour string format',
			},
			{
				// Enter the time zone
				displayName: 'Select a Time Zone',
				name: 'numberOfDays',
				type: 'options',
				options: [
					{
						name: 'Eastern Standard Time',
						value: 'EST'
					},
					{
						name: 'Central Standard Time',
						value: 'CST'
					},
					{
						name: 'Pacific Standard Time',
						value: 'PST'
					},
					{
						name: 'Mountain Standard Time',
						value: 'MST'
					},
				],
				default: '',
				placeholder: 'Add Time zone',
				required: true,
				description: 'Select a time zone',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return [];
	}
}