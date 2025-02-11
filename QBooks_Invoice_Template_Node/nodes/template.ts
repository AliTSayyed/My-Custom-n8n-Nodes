export const handlebarsTemplate = `<!DOCTYPE html>
<html lang="en">
<head> 
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Template</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 40px 20px; background-color: #f9fafb;">
 {{#if initialMessage }}
    <div style="background: white; margin-bottom: 40px; padding: 24px; border-radius: 8px; color: #4b5563; font-family: Arial, Helvetica, sans-serif;">
    <!-- Message Section -->
        <p style="margin: 0 0 16px 0; font-size: 1rem; font-weight: 500;">Hello {{#if CustomerName}}{{CustomerName}}{{/if}},</p>
        
        <p style="margin: 0 0 16px 0; font-size: 0.95rem; line-height: 1.6;">
            I hope you're doing well! Please find attached <span style="font-weight: 600; color: #374151;">Invoice #{{DocNumber}}</span> for your records. <br>
            This invoice is due on <span style="font-weight: 600; color: #374151;">{{DueDate}}</span>. Let me know if you have any questions—we're happy to help.
        </p>
        
        <p style="margin: 0 0 16px 0; font-size: 0.95rem; line-height: 1.6;">
            Thank you for your business!
        </p>
        
        <p style="margin: 0; font-size: 0.95rem;">
            Best regards,<br>
            <span style="font-weight: 500;">{{CompanyName}} - Billing Team</span>
        </p>
    </div>
    {{/if}}

    {{#if customMessage}}
    <div style="background: white; margin-bottom: 40px; padding: 24px; border-radius: 8px; color: #4b5563; font-family: Arial, Helvetica, sans-serif;">
      <!-- Custom Message Section -->
      <p style="margin: 0 0 16px 0; font-size: 1rem; font-weight: 500;">Hello {{#if CustomerName}}{{CustomerName}}{{/if}},</p>
      
      <p style="margin: 0 0 16px 0; font-size: 0.95rem; line-height: 1.6;">
        {{{customMessageContent}}}
      </p>
      
      <p style="margin: 0; font-size: 0.95rem;">
          Best regards,<br>
          <span style="font-weight: 500;">{{CompanyName}} - Billing Team</span>
      </p>
    </div>
    {{/if}}

    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden;">
        <!-- Company Info -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div style="font-size: 0.95rem; color: #4b5563;">
                {{#if CompanyName}}<div style="font-weight: 600; color: #374151;">{{CompanyName}}</div>{{/if}}
                {{#if CompanyAddress.Line1}}<div>{{CompanyAddress.Line1}}</div>{{/if}}
                {{#if (and CompanyAddress.City CompanyAddress.CountrySubDivisionCode)}}<div>{{CompanyAddress.City}}, {{CompanyAddress.CountrySubDivisionCode}} {{#if CompanyAddress.PostalCode}}{{CompanyAddress.PostalCode}}{{/if}}</div>{{/if}}
                {{#if CompanyEmailAddress}}<div>{{CompanyEmailAddress}}</div>{{/if}}
            </div>
        </div>

        <!-- Invoice Title -->
        <div style="color: #5BA4CF; font-size: 40px; font-weight: 700; margin: 0 0 40px 0; letter-spacing: -0.5px; position: relative; display: inline-block; padding-bottom: 10px; border-bottom: 3px solid #5BA4CF;">
            INVOICE
        </div>

        <!-- Billing Info -->
        <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 40px;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <div style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 12px; font-weight: 600;">BILL TO</div>
                    {{#if CustomerName}}<div style="font-weight: 600; color: #374151;">{{CustomerName}}</div>{{/if}}
                    {{#if CustomerCompanyName}} {{#if (notEquals CustomerCompanyName CustomerName)}}<div>{{CustomerCompanyName}}</div>{{/if}} {{/if}}
                    {{#if CustomerBillAddr.Line1}}<div>{{CustomerBillAddr.Line1}}</div>{{/if}}
                    {{#if (and CustomerBillAddr.City CustomerBillAddr.CountrySubDivisionCode)}}<div>{{CustomerBillAddr.City}}, {{CustomerBillAddr.CountrySubDivisionCode}} {{#if CustomerBillAddr.PostalCode}}{{CustomerBillAddr.PostalCode}}{{/if}}</div>{{/if}}
                </td>
                <td style="width: 50%; vertical-align: top; text-align: right;">
                    {{#if DocNumber}}<div><span style="font-weight: 600; color: #374151;">INVOICE #</span> {{DocNumber}}</div>{{/if}}
                    {{#if TxnDate}}<div><span style="font-weight: 600; color: #374151;">DATE</span> {{TxnDate}}</div>{{/if}}
                    {{#if DueDate}}<div><span style="font-weight: 600; color: #374151;">DUE DATE</span> {{DueDate}}</div>{{/if}}
                    {{#if SalesTerm}}<div><span style="font-weight: 600; color: #374151;">TERMS</span> {{SalesTerm}}</div>{{/if}}
                </td>
            </tr>
        </table>

        <!-- Invoice Table -->
        <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: separate; margin: 20px 0;">
            <thead>
                <tr>
                    <th style="background-color: #f3f4f6; padding: 12px 16px; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">PRODUCT/SERVICE</th>
                    <th style="background-color: #f3f4f6; padding: 12px 16px; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">DESCRIPTION</th>
                    <th style="background-color: #f3f4f6; padding: 12px 16px; text-align: center; font-size: 0.875rem; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">QTY</th>
                    <th style="background-color: #f3f4f6; padding: 12px 16px; text-align: right; font-size: 0.875rem; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">RATE</th>
                    <th style="background-color: #f3f4f6; padding: 12px 16px; text-align: right; font-size: 0.875rem; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">AMOUNT</th>
                </tr>
            </thead>
            <tbody>
              {{#each LineItems}}
                {{#if (equals DetailType 'SalesItemLineDetail')}}
                  <tr>
                    <td style="padding: 16px; border-bottom: 3px solid #e5e7eb; color: #4b5563;">{{SalesItemLineDetail.ItemRef.name}} Heads</td>
                    <td style="padding: 16px; border-bottom: 3px solid #e5e7eb; color: #4b5563;">{{Description}}</td>
                    <td style="padding: 16px; border-bottom: 3px solid #e5e7eb; color: #4b5563; text-align: center;">{{SalesItemLineDetail.Qty}}</td>
                    <td style="padding: 16px; border-bottom: 3px solid #e5e7eb; color: #4b5563; text-align: right;">{{format SalesItemLineDetail.UnitPrice}}</td>
                    <td style="padding: 16px; border-bottom: 3px solid #e5e7eb; color: #4b5563; text-align: right;"> <div>{{format Amount}}</div>
                    {{#if SalesItemLineDetail.DiscountAmt}}
                      <div style="font-size: 0.8rem">(after {{format SalesItemLineDetail.DiscountAmt}} discount)</div>
                    {{/if}}
                    </td>
                </tr>
                {{/if}}
              {{/each}}
            </tbody>
        </table>

        <!-- Totals Section -->
        <table cellpadding="0" cellspacing="0" style="width: 100%; margin-top: 30px;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    {{#if CustomerMemo}} <div style="color: #6b7280; font-size: 0.95rem; text-align: left; max-width: 300px;">
                        {{CustomerMemo}}
                    </div> {{/if}}
                </td>
            
                <td style="width: 50%; vertical-align: top;">
                    <table cellpadding="0" cellspacing="0" style="width: 100%; margin-left: auto;">
                      {{#if (greaterThan LineItems.length 2)}}
                        {{#each LineItems}}
                          {{#if (equals DetailType 'SubTotalLineDetail')}}
                            <tr>
                                <td style="padding: 8px 0; font-size: 0.95rem;">SUBTOTAL</td>
                                <td style="padding: 8px 0; font-size: 0.95rem; text-align: right;">{{format Amount}}</td>
                            </tr>
                          {{/if}}
                        {{/each}}
                      {{/if}}
                      {{#each LineItems}}
                        {{#if (equals DetailType 'DiscountLineDetail')}}
                        <tr>
                            <td style="padding: 8px 0; font-size: 0.95rem;">DISCOUNT ({{DiscountLineDetail.DiscountPercent}}%) </td>
                            <td style="padding: 8px 0; font-size: 0.95rem; text-align: right;">-{{format Amount}}</td>
                        </tr>
                        {{/if}}
                      {{/each}}
                        {{#if TaxDetails.TotalTax}}<tr>
                            <td style="padding: 8px 0; font-size: 0.95rem;">TAX {{#if TaxDetails.TaxLine}}({{sumTaxPercent TaxDetails.TaxLine}}%){{/if}} </td>
                            <td style="padding: 8px 0; font-size: 0.95rem; text-align: right;">{{format TaxDetails.TotalTax}}</td>
                        </tr>
                        {{/if}}
                        {{#if TotalAmount}}
                          <tr>
                              <td style="padding: 8px 0; font-size: 0.95rem;">TOTAL</td>
                              <td style="padding: 8px 0; font-size: 0.95rem; text-align: right;">{{format TotalAmount}}</td>
                          </tr>    
                        {{/if}}  
                        {{#if PreviousPayments}}      
                          <tr>
                              <td style="padding: 8px 0; font-size: 0.95rem;">PAYMENTS</td>
                              <td style="padding: 8px 0; font-size: 0.95rem; text-align: right;">-{{format PreviousPayments}}</td>
                          </tr> 
                        {{/if}}  
                        <tr>
                            <td colspan="2" style="padding-top: 20px; border-top: 3px solid #e5e7eb; font-size: 1.25rem; font-weight: 700; color: #5BA4CF; text-align: right;">
                                BALANCE DUE {{format Balance}}
                            </td>
                        </tr>
                    </table> 
                </td>
            </tr>
        </table>
       {{#if pdfButton}} 
        <!-- Download Button -->
        <div style="text-align: center; margin-top: 40px; padding-top: 20px;">
            <a href="http://localhost:5678/webhook-test/pdf-download?invoiceid={{InvoiceID}}&companyid={{CompanyID}}&customerid={{CustomerID}}" style="display: inline-block; background-color: #5BA4CF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                Download PDF
            </a>
        </div> 
        {{/if}}
    </div>
</body>
</html>`;