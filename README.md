# ORNFORLAG.NO - NEXTJS - ECOMMERCE WEBSITE W/ Vipps Hurtigkasse (expressCheckout)PAYMENTS.

### GraphQL, REACT, JAVASCRIPT, JAM-stack, HEADLESS, SERVERLESS, BACKENDLESS HOSTED ON VERCEL

Extra credits and a big big shout out for all the guidence and help, haakon and
stavros @ crystallize.com!

## Local dev

Grab the repo, extract it or "git clone (this url).git" and navigate to the
folder by

`cd next-ornforlag_no-website`

when in this folder, you are in the rootfolder and all commands that follow are
to be executed from this rootfolder.

1:

```sh
npm install
# or
yarn
```

2:

```sh
npm run dev
# or
yarn dev
```

This will start up the server on http://localhost:3000 for development.

## App Structure

### `src/pages/`

Put all your entry pages here. These are interpreted as separate routes by
Next.js.

### `src/pages/api/`

All your Vercel [serverless functions][18]. and Vipps API endpoints for express
Checkout

### `src/page-components/`

We use the `page-components/` directory to hold the actual component content
related to entries in the `pages/` directory.

### `src/components/`

All your shared React components.

### `src/ui/`

UI related components live here. Front end-centric

### `src/lib/`

Enable GraphQL and REST API communication,

### `src/lib-api/`

Serverless API functions related: Vipps-payments or ' Vipps Hurtigkasse'
(https://vipps.no/products):

- createAuthKey,
- fetch accessToken
- generateVippsProperties,
- vippsOrderId,
- vippsData,
- order-normalizers (prepping for data transfer betwen Vipps and PIM)

PIM 3rd party orders and products mangament service(crystallize)

- queries: order-by-id
- createOrder mutations,
- updateOrder mutations, quieries to email automation using sendgrid,
  cart-validations, host-identifier,

### `public/static/`

Public resources hosted as static files. icons, logo pictures, badges, svg files
and mainifest etc.

## Deploying The Project

There are multiple alternatives for deployments, two of them being [Vercel][20]
and netlify.com PS! I recomend vercel for nextjs projects as the creators of
nextjs is vercel and its hosting is optimized for nextjs.

### Deploying with Vercel

- Register a Vercel account
- Install vercel `yarn global add vercel` or `npm i -g vercel`
- Run `vercel`

[0]: https://img.shields.io/badge/react-latest-44cc11.svg?style=flat-square
[1]: https://github.com/facebook/react
[2]: https://img.shields.io/badge/next-latest-44cc11.svg?style=flat-square
[3]: https://github.com/zeit/next.js
[4]:
  https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[5]: https://github.com/prettier/prettier
[6]:
  https://img.shields.io/badge/code_linter-eslint-463fd4.svg?style=flat-square
[7]: https://github.com/prettier/prettier
[18]: https://vercel.com/docs/v2/serverless-functions/introduction
[19]: https://vercel.com/guides/deploying-nextjs-with-now/
[20]: https://vercel.com
