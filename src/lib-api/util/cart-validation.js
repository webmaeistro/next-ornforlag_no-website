import { simplyFetchFromGraph } from 'lib/graph';

export async function validateItems({ lineItems, language }) {
  const uniqueLineItems = lineItems.reduce(
    (unique, val) =>
      unique.find((v) => val.path === v.path) ? unique : [...unique, val],
    []
  );

  const queries = uniqueLineItems.map(
    (item, i) => `
      query PRODUCT_${i} {
        catalogue (language: "${language}", path: "${item.path}") {
          ... on Product {
            variants {
              id
              price
            }
          }
        }
      }
    `
  );

  const requests = queries.map((query) => simplyFetchFromGraph({ query }));
  try {
    const data = await Promise.all(requests);

    return lineItems
      .map((item) => {
        return data
          .map(({ data: { catalogue } }) => {
            const variant = catalogue.variants.find((v) => v.id === item.id);
            if (!variant) return false;

            variant.quantity = item.quantity;
            return variant;
          })
          .filter((variant) => variant)[0];
      })
      .filter((i) => !!i);
  } catch (error) {
    console.error(error);
  }

  throw new Error('Basket is not validated');
}
