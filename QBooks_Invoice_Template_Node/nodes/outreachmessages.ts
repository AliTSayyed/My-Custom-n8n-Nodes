const greeting = `
    <div style="margin-bottom: 40px; padding: 24px; background-color: white; border-radius: 8px; color: #4b5563; font-family: Arial, Helvetica, sans-serif;">
    <!-- Message Section -->
        <p style="margin: 0 0 16px 0; font-size: 1rem; font-weight: 500;">Hello {{#if CustomerName}}{{CustomerName}}{{/if}},</p>
         `;

const signOff = `
        <p style="margin: 0; font-size: 1rem;">
            Best regards,<br>
            <span style="font-weight: 500;">{{CompanyName}} - Billing Team</span>
        </p>
    </div>
`

export const initialMessage = `
    ${greeting}
        <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
            I hope you're doing well! Please find attached <span style="font-weight: 600; color: #374151;">Invoice #{{DocNumber}}</span> for your records. <br>
            This invoice is due on <span style="font-weight: 600; color: #374151;">{{DueDate}}</span>. Let me know if you have any questions—we're happy to help.
        </p>
        
        <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
            Thank you for your business!
        </p>
    ${signOff}
`;

export const fiveDaysBeforeMessage = `
    ${greeting}
    <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
        Just a friendly reminder that <span style="font-weight: 600; color: #374151;">Invoice #{{DocNumber}}</span> is due soon on <span style="font-weight: 600; color: #374151;">{{DueDate}}</span>. <br>
        Please let us know if you need any assistance or have any questions regarding the payment.
    </p>
   
    <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
        Thank you for your business!
    </p>
    ${signOff}
`;

export const threeDaysBeforeMessage = `
    ${greeting}
    <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
        We wanted to follow up as <span style="font-weight: 600; color: #374151;">Invoice #{{DocNumber}}</span> is due in just a few business days on <span style="font-weight: 600; color: #374151;">{{DueDate}}</span>. <br> 
        Please ensure payment is arranged by the due date to avoid any delays. Let us know if you need any assistance.
    </p>
   
    <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
        Thank you for your business!
    </p>
    ${signOff}
`;

export const dueDayMessage = `
    ${greeting}
    <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
        This is a final reminder that <span style="font-weight: 600; color: #374151;">Invoice #{{DocNumber}}</span> is due today. Please process the payment at your earliest convenience. <br>
        If the payment has already been made, kindly disregard this message.
    </p>
   
    <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
        Thank you for your business!
    </p>
    ${signOff}
`;

export const recentlyOverdueMessage = `
    ${greeting}
    <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
        We wanted to follow up as <span style="font-weight: 600; color: #374151;">Invoice #{{DocNumber}}</span> was recently due on <span style="font-weight: 600; color: #374151;">{{DueDate}}</span> and appears to be outstanding.<br>
        Please arrange payment as soon as possible to bring your account up to date. Let us know if there's anything we need to be aware of regarding this payment.<br>
        If the payment has already been made, kindly disregard this message.
    </p>
   
    <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
        Thank you for your business!
    </p>
    ${signOff}
`;


