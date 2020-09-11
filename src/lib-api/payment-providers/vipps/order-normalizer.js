function generateVippsProperties(vippsData) {
  const propertiesArray = [
    {
      property: 'vipps_bankIdVerified',
      value: vippsData.userDetails.bankIdVerified
    },
    {
      property: 'vipps_ssn',
      value: vippsData.userDetails.ssn
    },
    {
      property: 'vipps_userId',
      value: vippsData.userDetails.userId
    }
  ];

  for (const key in vippsData.transactionInfo) {
    propertiesArray.push({
      property: `vipps_${key}`,
      value: vippsData.transactionInfo[key]?.toString()
    });
  }

  return propertiesArray;
}

export default function VippsOrderNormalizer({ vippsOrderId, vippsData }) {
  // if !vippsOrderId we set to create an order in Crystallize
  const {
    lineItems,
    currency,
    personalDetails,
    shippingDetails,
    userDetails
  } = vippsData;

  const total = {
    net: 0,
    gross: 0
  };

  if (vippsOrderId) {
    return {
      customer: {
        identifier: userDetails.ssn,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        // birthDate: new Date(userDetails.dateOfBirth),
        addresses: [
          {
            type: 'delivery',
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            street: shippingDetails.address.addressLine1,
            street2: shippingDetails.address.addressLine2,
            postalCode: shippingDetails.address.postCode,
            city: shippingDetails.address.city,
            country: shippingDetails.address.country,
            phone: userDetails.mobileNumber,
            email: userDetails.email
          }
        ]
      },
      payment: [
        {
          provider: 'custom',
          custom: {
            properties: generateVippsProperties(vippsData)
          }
        }
      ],
      id: vippsOrderId,
      additionalInformation: JSON.stringify({
        status: vippsData.transactionInfo.status
      })
    };
  } else {
    const orderItemsArray = lineItems.map((lineItem) => {
      total.gross += lineItem.gross * lineItem.quantity;
      total.net += lineItem.net * lineItem.quantity;

      return {
        name: lineItem.name,
        sku: lineItem.sku,
        quantity: lineItem.quantity,
        subscription: lineItem.subscription,
        productId: lineItem.productId,
        productVariantId: lineItem.productVariantId,
        imageUrl: lineItem.image_url,
        price: {
          gross: lineItem.gross,
          net: lineItem.net,
          currency,
          discounts: [
            {
              percent: 0
            }
          ],
          tax: {
            name: lineItem.tax_group.name,
            percent: lineItem.tax_group.percent
          }
        }
      };
    });

    return {
      customer: {
        firstName: personalDetails.firstName,
        lastName: personalDetails.lastName
      },
      cart: orderItemsArray,

      total: {
        gross: total.gross,
        net: total.net,
        currency,
        discounts: [
          {
            percent: 0
          }
        ],
        tax: {
          name: lineItems[0].tax_group.name,
          percent: lineItems[0].tax_group.percent
        }
      },
      additionalInformation: JSON.stringify({ status: 'initiated' })
    };
  }
}
