import {
  IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {DateTime} from 'luxon';

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
				displayName: 'Days Offset (Saturdays will adjust to Fridays and Sundays will adjust to Mondays)',
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
				name: 'timeString',
				type: 'string',
				default: '',
				placeholder: 'HH:mm:ss',
				required: true,
				description: 'Specify the time you want with your date in a 24 Hour string format',
			},
			{
				// Enter the time zone
				displayName: 'Select a Time Zone',
				name: 'timeZone',
				type: 'options',
				options: [
					{
						name: 'Eastern Standard Time',
						value: 'America/New_York'
					},
					{
						name: 'Central Standard Time',
						value: 'America/Chicago'
					},
					{
						name: 'Pacific Standard Time',
						value: 'America/Los_Angeles'
					},
					{
						name: 'Mountain Standard Time',
						value: 'America/Denver'
					},
					{
						name: 'Alaska Standard Time',
						value: 'America/Anchorage'
					},
					{
						name: 'Hawaii-Aleutian Standard Time',
						value: 'Pacific/Honolulu'
					},
				],
				default: 'America/New_York',
				required: true,
				description: 'Select a time zone',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];
		const items = this.getInputData();

		for (let i = 0; i < items.length; i++) {
			const referenceDate = this.getNodeParameter('referenceDate', i) as string;
			const daysOffset = this.getNodeParameter('daysOffset', i) as number;
			const timeString = this.getNodeParameter('timeString', i) as string;
			const timezone = this.getNodeParameter('timeZone', i) as string;
			
			try {
				// create the new date with the offset applied
				const baseDate = DateTime.fromISO(referenceDate, { zone: timezone });
				if (!baseDate.isValid){
					throw new Error(`Invalid date or timezone entered, expected format is YYYY-MM-DD and time zone selected is ${timezone}`)
				}

				let newDate = baseDate.plus({days: daysOffset});
				
				// Check if the new date is a Saturday, if it is then change the date to a Friday
				if (newDate.weekday === 6) {
					newDate = newDate.plus({days: -1});
				} 

				// check if the new date is a Sunday, if it is then change it to a Monday
				if (newDate.weekday === 7){
					newDate = newDate.plus({days:1});
				}
				
				// Combine date and time in the specified timezone
				// Validate the time string format
				if (!/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeString)) {
					throw new Error(`Invalid time format: ${timeString}. Expected format: HH:mm:ss or HH:mm`);
				}
				const [hours, minutes, seconds = '00'] = timeString.split(':');
				
				 // Validate time components
				const hoursNum = parseInt(hours, 10);
				const minutesNum = parseInt(minutes, 10);
				const secondsNum = parseInt(seconds, 10);

				if (isNaN(hoursNum) || hoursNum < 0 || hoursNum > 23) {
					throw new Error(`Invalid hours value: ${hours}. Expected 0-23.`);
				}
				
				if (isNaN(minutesNum) || minutesNum < 0 || minutesNum > 59) {
					throw new Error(`Invalid minutes value: ${minutes}. Expected 0-59.`);
				}
				
				if (isNaN(secondsNum) || secondsNum < 0 || secondsNum > 59) {
					throw new Error(`Invalid seconds value: ${seconds}. Expected 0-59.`);
				}

				// Set timezone (with validation but extra check not really needed)
				// const withTimezone = newDate.setZone(timezone);
				// if (!withTimezone.isValid) {
				// 	throw new Error(`Invalid timezone: "${timezone}". ${withTimezone.invalidReason}`);
				// }
				
				// Set time components
				const localDateTime = newDate.set({
					hour: hoursNum,
					minute: minutesNum,
					second: secondsNum
				});
				
				// return the new date in UTC format
				const output = localDateTime.toUTC().toISO();
				returnData.push({ json:{ output }});

			} catch (error){
				throw new Error(`Date Conversion Failed: ${error.message}`);
			}
		};
		return [returnData];
	}
}