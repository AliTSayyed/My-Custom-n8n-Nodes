import * as Handlebars from 'handlebars';

// Register custom Handlebars helpers
export const registerHelpers = () => {
	Handlebars.registerHelper('format', function (value) {
		if (typeof value === 'number') {
			return `$${value.toFixed(2)}`;
		}
		return `$${value}`;
	});

	Handlebars.registerHelper('and', function (value1, value2) {
		if (value1 && value2) {
			return true;
		} else {
			return false;
		}
	});

	Handlebars.registerHelper('equals', function (a, b) {
		return a === b;
	});

	Handlebars.registerHelper('notEquals', function (a, b) {
		return a !== b;
	});

	Handlebars.registerHelper('greaterThan', function (a, b) {
		return a > b;
	});

	Handlebars.registerHelper('sumTaxPercent', function (taxLines) {
		return taxLines.reduce((sum: any, line: any) => {
			return sum + line.TaxLineDetail.TaxPercent;
		}, 0);
	});
};
