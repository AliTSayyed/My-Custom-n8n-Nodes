import * as Handlebars from 'handlebars';

// Register custom Handlebars helpers
export const registerHelpers = () => {
	Handlebars.registerHelper("format", function (value) {
		if (typeof value === "number") {
			const isNegative = value < 0;
			const absValue = Math.abs(value);
			return isNegative ? `-$${absValue.toFixed(2)}` : `$${value.toFixed(2)}`;
		}
		return `$${value}`;
	});
	
	Handlebars.registerHelper("and", function (value1, value2) {
		if (value1 && value2) {
			return true;
		} else {
			return false;
		}
	});
	
	Handlebars.registerHelper("tripleOr", function (value1, value2, value3) {
		if (value1 || value2 || value3) {
			return true;
		} else {
			return false;
		}
	});
	
	Handlebars.registerHelper("equals", function (a, b) {
		return a === b;
	});
	
	Handlebars.registerHelper("notEquals", function (a, b) {
		return a !== b;
	});
	
	Handlebars.registerHelper("greaterThan", function (a, b) {
		return a > b;
	});
	
	Handlebars.registerHelper("sumTaxPercent", function (taxLines) {
		return taxLines.reduce((sum: number, line:any) => {
			return sum + line.TaxLineDetail.TaxPercent;
		}, 0);
	});
	
	Handlebars.registerHelper("startsWith", function (str, prefix) {
		if (typeof str !== "string") return false;
		return str.startsWith(prefix);
	});
	
	Handlebars.registerHelper("sumBundleRates", function (groupLineDetail) {
		if (!groupLineDetail || !groupLineDetail.Line) return 0;
	
		return groupLineDetail.Line.reduce((sum: number, line:any) => {
			return sum + (line.Amount || 0);
		}, 0);
	});
	
	Handlebars.registerHelper("hasServiceDates", function (lineItems) {
		return lineItems.some((item:any) => {
			if (
				item.DetailType === "GroupLineDetail" &&
				item.GroupLineDetail.ServiceDate
			) {
				return true;
			}
			if (item.DetailType === "SalesItemLineDetail" && item.ServiceDate) {
				return true;
			}
			return false;
		});
	});
	
	Handlebars.registerHelper("formatDate", function (date) {
		if (!date) return "";
		return new Date(date).toLocaleDateString();
	});
};
