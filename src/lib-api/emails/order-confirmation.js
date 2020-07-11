import mjml2html from '@nerdenough/mjml-ncc-bundle';

import { callOrdersApi } from 'lib-api/crystallize';
import QUERY_ORDER_BY_ID from 'lib-api/crystallize/graph/queries/order-by-id';
import { formatCurrency } from 'lib/currency';
import sgMail from '@sendgrid/mail';
// import { sendEmail } from './utils';

export default async function sendOrderConfirmation(orderId) {
  try {
    const response = await callOrdersApi({
      query: QUERY_ORDER_BY_ID,
      variables: {
        id: orderId
      },
      operationName: 'getOrder'
    });
    const order = response.data.orders.get;
    const { email } = order.customer.addresses[0];

    if (!email) {
      // Ideally an email address will always be provided, but if not...
      return;
    }

    const { html } = mjml2html(`
    <mjml>
    <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          <h1>Ordre bekreftelse</h1>
          <p>Takk for din ordre, vi har sendt en kopi til din epost.</p>
          <p>
            Ordre Nr.: <strong>#${order.id}</strong>
          </p>
          <p>
            Fornavn: <strong>${order.customer.firstName}</strong><br />
            Etternavn: <strong>${order.customer.lastName}</strong><br />
            Epost: <strong>${email}</strong>
           </p>
          <p>
            Totalt: <strong>${formatCurrency({
              amount: order.total.net,
              currency: order.total.currency
            })}</strong>
          </p>
        </mj-text>
        <mj-table>
          <tr style="border-bottom:1px solid #ecedee;text-align:left;">
            <th style="padding: 0 15px 0 0;">Navn</th>
            <th style="padding: 0 15px;">Antall</th>
            <th style="padding: 0 0 0 15px;">Totalt</th>
          </tr>
          ${order.cart.map(
            (item) => `<tr>
              <td style="padding: 0 15px 0 0;">${item.name} (${item.sku})</td>
              <td style="padding: 0 15px;">${item.quantity}</td>
              <td style="padding: 0 0 0 15px;">${formatCurrency({
                amount: item.price.net * item.quantity,
                currency: item.price.currency
              })}</td>
            </tr>`
          )}
        </mj-table>
      </mj-column>
    </mj-section>
    </mj-body>
  </mjml>
`);

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    if (SENDGRID_API_KEY) {
      sgMail.setApiKey(SENDGRID_API_KEY);
      await sgMail.send({
        to: email,
        from: 'webmaster@ornforlag.no',
        subject: 'Ordre kvitering fra ornforlag.no',
        html
      });
    }
  } catch (error) {
    Promise.resolve(error.stack);
  }
}
