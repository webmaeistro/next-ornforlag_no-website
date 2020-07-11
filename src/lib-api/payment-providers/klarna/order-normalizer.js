import { getClient } from './index';

export default async function klarnaOrderNormalizer({ klarnaOrderId }) {
  const { order, success } = await getClient().getOrder(klarnaOrderId);

  if (!success) {
    throw new Error('Could not get Klarna order');
  }

  const lineItems = order.order_lines;

  const orderItemsArray = lineItems.map((lineItem) => {
    const productMetaData = lineItem.merchant_data
      ? JSON.parse(lineItem.merchant_data)
      : {};
    return {
      name: lineItem.name,
      sku: lineItem.reference,
      quantity: lineItem.quantity,
      productId: productMetaData.productId,
      productVariantId: productMetaData.productVariantId,
      imageUrl: lineItem.image_url,
      price: {
        gross: lineItem.unit_price / 100,
        net: lineItem.unit_price / 100,
        currency: order.purchase_currency,
        discounts: [
          {
            percent: 0,
          },
        ],
        tax: {
          name: productMetaData.taxGroup.name,
          percent: productMetaData.taxGroup.percent,
        },
      },
    };
  });

  const customerName = `${order.billing_address.given_name} ${order.billing_address.family_name}`.split(
    ' '
  );
  const customerShippingName = `${order.shipping_address.given_name} ${order.shipping_address.family_name}`.split(
    ' '
  );

  // TODO: review what happens to the General Order Vat Group on multiple tax groups on order (mult. items having diff vatTypes, is it a thing?)
  const vatGroup = orderItemsArray[0].price;

  return {
    customer: {
      identifier: '',
      firstName: customerName[0],
      middleName: customerName.slice(1, customerName.length - 1).join(),
      lastName: customerName[customerName.length - 1],
      birthDate: order.customer ? order.customer.date_of_birth : null,
      addresses: [
        {
          type: 'billing',
          firstName: customerName[0],
          middleName: customerName.slice(1, customerName.length - 1).join(),
          lastName: customerName[customerName.length - 1],
          street: order.billing_address.street_address,
          street2: order.billing_address.street_address2,
          postalCode: order.billing_address.postal_code,
          city: order.billing_address.city,
          state: order.billing_address.region,
          country: order.billing_address.country,
          phone: order.billing_address.phone,
          email: order.billing_address.receipt_email,
        },
        {
          type: 'delivery',
          firstName: customerShippingName[0],
          middleName: customerShippingName
            .slice(1, customerShippingName.length - 1)
            .join(),
          lastName: customerShippingName[customerShippingName.length - 1],
          street: order.shipping_address.street_address,
          street2: order.shipping_address.street_address2,
          postalCode: order.shipping_address.postal_code,
          city: order.shipping_address.city,
          state: order.shipping_address.region,
          country: order.shipping_address.country,
          phone: order.shipping_address.phone,
          email: order.shipping_address.receipt_email,
        },
      ],
    },
    cart: orderItemsArray,
    payment: [
      {
        provider: 'klarna',
        klarna: {
          klarna: '',
          orderId: order.order_id,
          recurringToken: order.recurring_token,
          metadata: JSON.stringify({
            status: order.status,
            tax_amount: order.order_tax_amount,
          }),
        },
      },
    ],
    total: {
      gross: order.order_amount / 100,
      net: order.order_amount / 100,
      currency: order.purchase_currency,
      discounts: [
        {
          percent: 0,
        },
      ],
      tax: {
        name: vatGroup.name,
        percent: vatGroup.percent,
      },
    },
    additionalInformation: order.merchant_data,
  };
}
