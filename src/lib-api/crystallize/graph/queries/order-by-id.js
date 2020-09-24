export default `
  query getOrder($id: ID!){
    order {
      get(id: $id) {
        id
        total {
          net
          gross
          currency
          tax {
            name
            percent
          }
        }
        payment {
          ... on StripePayment {
            paymentMethod
          }
          ... on CustomPayment {
            provider
            properties {
              property
              value
            }
          }
        }
        cart {
          sku
          name
          quantity
          price {
            net
            gross
            currency
          }
          imageUrl
        }
        customer {
          firstName
          lastName
          addresses {
            type
            email
            phone
            street
            postalCode
            city
            country
          }
        }
      }
    }
  }
`;
