/**
 * This file is used when we deal with an unknown url, e.g.:
 * /teddy-bears/fluffy-teddy
 * We need to check on the Crystallize end if this is a valid
 * url, typically by querying the catalogue to see if there is
 * an item with this url as path.
 * If we get nothing back from Crystallize, it's a 404
 */

import React from 'react';

import { simplyFetchFromGraph } from 'lib/graph';
import appConfig, {
  getLocaleFromContext,
  isMultilingual,
  defaultLocale
} from 'lib/app-config';

import DocPage, { getData as getDataDoc } from 'page-components/document';
import FolderPage, { getData as getDataFolder } from 'page-components/folder';
import ProdPage, { getData as getDataProd } from 'page-components/product';

const typesMap = {
  document: {
    component: DocPage,
    getData: getDataDoc
  },
  folder: {
    component: FolderPage,
    getData: getDataFolder
  },
  product: {
    component: ProdPage,
    getData: getDataProd
  }
};

export async function getStaticProps({ params }) {
  const { catalogue } = params;
  const locale = getLocaleFromContext(params);
  const asPath = `/${catalogue.join('/')}`;

  try {
    // Get the item type
    const getItemType = await simplyFetchFromGraph({
      query: `
        query ITEM_TYPE($language: String!, $path: String!) {
          catalogue(language: $language, path: $path) {
            type
            language
          }
        }
      `,
      variables: {
        language: locale.crystallizeCatalogueLanguage,
        path: asPath
      }
    });
    const { type } = getItemType.data.catalogue;

    const renderer = typesMap[type] || typesMap.folder;

    const data = await renderer.getData({
      asPath,
      language: locale.crystallizeCatalogueLanguage
    });

    return {
      props: {
        ...data,
        type
      },
      unstable_revalidate: 1
    };
  } catch (error) {
    console.error(error);
    console.warn(`Could not get data for ${asPath}`);
  }

  return {
    props: {},
    unstable_revalidate: 1
  };
}

export async function getStaticPaths() {
  const paths = [];

  if (isMultilingual) {
    await Promise.all(appConfig.locales.map(handleLocale));
  } else {
    await handleLocale(defaultLocale);
  }

  async function handleLocale(locale) {
    function handleItem({ path, name, children }) {
      if (path !== '/index' && !name?.startsWith('_')) {
        if (isMultilingual) {
          paths.push(`/${locale.urlPrefix}${path}`);
        } else {
          paths.push(path);
        }
      }

      children?.forEach(handleItem);
    }

    try {
      const allCatalogueItems = await simplyFetchFromGraph({
        query: `
          query GET_ALL_CATALOGUE_ITEMS($language: String!) {
            catalogue(language: $language, path: "/") {
              path
              name
              children {
                path
                name
                children {
                  path
                  name
                  children {
                    path
                    name
                    children {
                      path
                      name
                      children {
                        path
                        name
                        children {
                          path
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          language: locale.crystallizeCatalogueLanguage
        }
      });

      allCatalogueItems.data.catalogue.children.forEach(handleItem);
    } catch (error) {
      console.error(
        'Could not get all catalogue items for ',
        JSON.stringify(locale, null, 3)
      );
      console.log(error);
    }
  }

  return {
    paths,
    fallback: false
  };
}

export default function GenericCatalogueItem({ type, ...rest }) {
  const renderer = typesMap[type] || typesMap.folder;
  const Component = renderer.component;

  return <Component {...rest} />;
}
