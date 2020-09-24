/* eslint-disable react/display-name */
import React, { useState } from 'react';

import dynamic from 'next/dynamic';

import styled from 'styled-components';

import appConfig, { useLocale } from 'lib/app-config';

import { useT } from 'lib/i18n';
import { useBasket } from 'components/basket';
import {
  Input,
  InputGroup,
  Label,
  PaymentSelector,
  PaymentProviders,
  PaymentButton,
  PaymentProvider,
  SectionHeader
} from '../styles';

//const StripeCheckout = dynamic(() => import('./stripe'));
//const KlarnaCheckout = dynamic(() => import('./klarna'));
const VippsCheckout = dynamic(() => import('./vipps'));

const Row = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const Inner = styled.div``;

export default function Payment() {
  const t = useT();
  const locale = useLocale();

  const { cart, metadata } = useBasket();
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState(null);
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const { firstName, lastName, email } = state;

  // Define the shared payment model for all payment providers
  const paymentModel = {
    multilingualUrlPrefix: locale.urlPrefix ? `/${locale.urlPrefix}` : '',
    locale,
    cart,
    metadata,
    customer: {
      firstName,
      lastName,
      addresses: [
        {
          type: 'billing',
          email
        }
      ]
    }
  };
  const paymentProviders = [
    /*
    {
      name: 'stripe',
      color: '#6773E6',
      logo: '/static/stripe-logo.png',
      render: () => (
        <PaymentProvider>
          <Head>
            <script key="stripe-js" src="https://js.stripe.com/v3/" async />
          </Head>
          <StripeCheckout
            personalDetails={personalDetails}
            items={items}
            currency={currency}
            onSuccess={(orderId) => {
              if (locale.urlPrefix) {
                router.push(
                  '/[locale]/confirmation/stripe/[orderId]',
                  `/${locale.urlPrefix}/confirmation/stripe/${orderId}`
                );
              } else {
                router.push(
                  '/confirmation/stripe/[orderId]',
                  `/confirmation/stripe/${orderId}`
                );
              }
              scrollTo(0, 0);
            }}
          />
        </PaymentProvider>
      )
    },
    {
      name: 'klarna',
      color: '#F8AEC2',
      logo: '/static/klarna-logo.png',
      render: () => (
        <PaymentProvider>
          <KlarnaCheckout
            personalDetails={personalDetails}
            items={items}
            currency={currency}
          />
        </PaymentProvider>
      )
    },
    */
    {
      name: 'vipps',
      color: '#FF5B24',
      logo: '/static/pay_with_vipps_rect_210_NO@2x.png',
      render: () => (
        <PaymentProvider>
          <VippsCheckout
            paymentModel={paymentModel}
            onSuccess={(url) => {
              if (url) window.location = url;
            }}
          />
        </PaymentProvider>
      )
    }
  ];

  return (
    <Inner>
      <form noValidate>
        <Row>
          <InputGroup>
            <Label htmlFor="firstname">{t('customer.firstName')}</Label>
            <Input
              name="firstname"
              type="text"
              value={firstName}
              onChange={(e) =>
                setState({ ...state, firstName: e.target.value })
              }
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="lastname">{t('customer.lastName')}</Label>
            <Input
              name="lastname"
              type="text"
              value={lastName}
              onChange={(e) => setState({ ...state, lastName: e.target.value })}
              required
            />
          </InputGroup>
        </Row>
        <Row>
          <InputGroup>
            <Label htmlFor="email">{t('customer.email')}</Label>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setState({ ...state, email: e.target.value })}
              required
            />
          </InputGroup>
        </Row>
      </form>

      <div>
        <SectionHeader>{t('checkout.choosePaymentMethod')}</SectionHeader>
        {appConfig.paymentProviders.length === 0 ? (
          <i>{t('checkout.noPaymentProvidersConfigured')}</i>
        ) : (
          <PaymentProviders>
            <PaymentSelector>
              {appConfig.paymentProviders.map((paymentProviderFromConfig) => {
                const paymentProvider = paymentProviders.find(
                  (p) => p.name === paymentProviderFromConfig
                );
                if (!paymentProvider) {
                  return (
                    <small>
                      {t('checkout.paymentProviderNotConfigured', {
                        name: paymentProviderFromConfig
                      })}
                    </small>
                  );
                }

                return (
                  <PaymentButton
                    key={paymentProvider.name}
                    color={paymentProvider.color}
                    type="button"
                    selected={selectedPaymentProvider === paymentProvider.name}
                    onClick={() =>
                      setSelectedPaymentProvider(paymentProvider.name)
                    }
                  >
                    <img
                      src={paymentProvider.logo}
                      alt={t('checkout.paymentProviderLogoAlt', {
                        name: paymentProvider.name
                      })}
                    />
                  </PaymentButton>
                );
              })}
            </PaymentSelector>

            {paymentProviders
              .find((p) => p.name === selectedPaymentProvider)
              ?.render()}
          </PaymentProviders>
        )}
      </div>
    </Inner>
  );
}
