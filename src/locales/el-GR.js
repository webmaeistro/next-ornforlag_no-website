export default {
  translation: {
    common: {
      price: '{{value, currency}}',
      vat: 'Mva.: {{value, currency}}'
    },
    frontpage: {
      title: 'Hjem'
    },
    customer: {
      name: 'Navn',
      firstName: 'Fornavn',
      lastName: 'Etternavnn',
      streetAddress: 'Gate',
      postalCode: 'Postnr.',
      email: 'Epost',
      emailPlaceholder: 'deg@ditt.sted',
      login: {
        title: 'Logg inn',
        loggedIn: 'Du er logget inn',
        instructions:
          'Tast inn din epostaddresse og vi vil sende deg en passordfri innlogginslink',
        emailAddressInvalid: 'Vennligst oppgi en gyldig epostaddresse',
        sendMagicLink: 'Send meg innloggingslink på epost'
      }
    },
    product: {
      relatedProduct: 'Relatert produkt',
      relatedProduct_plural: 'Relaterte produkter',
      addToBasket: 'Legg i hurtigkurv',
      buy: 'KJØP',
      attributes: {
        color: 'Color',
        green: 'Green',
        blue: 'Blue',
        black: 'Black'
      }
    },
    basket: {
      title: 'Hurtigkurv',
      loading: 'Vennligst vent. Henter din hurtigkurv...',
      removeItem: 'Fjern {{name}} fra hurtigkurven',
      empty: 'Hurtigkurven din er tom',
      empty_inCheckout:
        'Her kommer alle bøkene du har valgt å putte i hurtigkurven. Den er foreløpig tom. Gå tilbake og prøv igjen!',
      remainingUntilFreeShipping:
        'Kjøp for {{amount, currency}} ekstra for å oppnå gratis frakt',
      totalPrice: 'Totalt',
      discount: 'Fratrekk',
      totalPriceAfterDiscount: 'Totalt etter fratrekk',
      shippingPrice: 'Frakt',
      vat: 'Mva.',
      totalToPay: 'Totalen i Vipps',
      goToCheckout: 'Gå til Vipps betaling'
    },
    checkout: {
      title: 'Betaling med Vipps',
      payNow: 'Betal med Vipps Hurtigkasse',
      choosePaymentMethod: 'Tast inn ditt Vipps nr',
      noPaymentProvidersConfigured: 'Ingen betalingstjenester er konfigurert',
      paymentProviderNotConfigured:
        'Betalingstjenesten {{name}} er ikke konfigurert',
      paymentProviderLogoAlt: 'Logo for {{name}}',
      loadingPaymentGateway: 'Ørn brer sine vinger mot Vipps...',
      loadingPaymentGatewayFailed:
        'Oisann. Betalingstjenesten {{name}} kan ikke lastes akkurat nå',
      confirmation: {
        title: 'Ordrebekreftelse',
        shortStatus: `Din ordre er bekreftet`,
        shortStatus_withEmail: `Din ordre er bekreftet. En kopi av ordren er send til {{email}}`
      }
    },
    order: {
      total: 'Totalt',
      item: 'Vare',
      item_plural: 'Varer'
    },
    layout: {
      menu: 'Meny',
      ecomBy: 'Nettbutikk av',
      loadingVideo: 'Laster video'
    }
  }
};
