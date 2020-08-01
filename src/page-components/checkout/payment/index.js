/* eslint-disable react/display-name */
import React, { useState } from 'react';
//import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
//import Head from 'next/head';
import styled from 'styled-components';

import appConfig from 'lib/app-config';
//              ^ , { useLocale }
import { useT } from 'lib/i18n';

import {
  Form,
  //Input,
  //InputGroup,
  //Label,
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

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border-radius: 0.2rem;
`;

export default function Payment({ items, currency }) {
  const t = useT();
  // const locale = useLocale();
  // const router = useRouter();
  const [paymentProvider, setPaymentProvider] = useState(null);
  const [state] = useState({
    //        ^ , setState
    firstName: '',
    lastName: '',
    email: ''
  });

  const { firstName, lastName, email } = state;

  const personalDetails = {
    firstName,
    lastName,
    email
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
            personalDetails={personalDetails}
            items={items}
            currency={currency}
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
      <Form noValidate>
        <Row>
          1. Vipps sin landingsside Hvis betalingen ble startet på en PC sendes
          kunden til Vipps sin landingsside. Der bekrefter de telefonnummeret
          sitt, og får beskjed om å logge inn i Vipps. Hvis betalingen ble
          startet på en mobil, vil appen automatisk bytte til Vipps.
          {/*
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
           */}
        </Row>

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
                    active={paymentProvider === paymentProvider.name}
                    onClick={() => setPaymentProvider(paymentProvider.name)}
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

            {paymentProviders.find((p) => p.name === paymentProvider)?.render()}
          </PaymentProviders>
        )}
      </Form>
    </Inner>
  );
}
