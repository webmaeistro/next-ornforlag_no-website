import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Pusher from 'pusher-js';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import TimeAgo from 'timeago-react';

import Layout from 'components/layout';
import { H1, H3, Outer, responsive } from 'ui';

const StyledOuter = styled(Outer)`
  --spacing: 2rem;
  ${responsive.smAndLess} {
    --spacing: 20px;
  }
  max-width: 800px;
  padding: 50px 0 !important;
`;

const List = styled.ul`
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
  > li {
    margin: 75px 0;
    padding: 0;
    ${H3} {
      &::first-letter {
        text-transform: uppercase;
      }
      margin: 0 var(--spacing) 15px;
      small {
        display: inline-block;
        font-size: 0.6em;
        margin-left: 15px;
        &:before {
          content: '(';
        }
        &:after {
          content: ')';
        }
      }
    }
    pre {
      padding: var(--spacing);
      font-size: 0.8em;
    }
  }
`;

const Header = styled.div`
  padding: 0 var(--spacing);
`;

const Actions = styled.ul`
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Action = styled.li`
  display: inline-block;
  padding: 15px;
  background: #f5f2f0;
  border-radius: 20px;
`;

const ActionTitle = styled(Action)`
  padding-left: var(--spacing);
  background: transparent;
`;

function byDate(a, b) {
  return b.date - a.date;
}

function Entry({ entry }) {
  const { payload, actions } = entry.data;

  return (
    <>
      <H3>
        <TimeAgo datetime={entry.date} />
        <small>{entry.date.toLocaleString()}</small>
      </H3>
      <Actions>
        {actions.length > 0 ? (
          <>
            <ActionTitle>Actions performed:</ActionTitle>
            {actions.map((action) => (
              <Action key={action}>{action}</Action>
            ))}
          </>
        ) : (
          <ActionTitle>No actions performed</ActionTitle>
        )}
      </Actions>
      <pre
        className="language-json"
        dangerouslySetInnerHTML={{
          __html: window.Prism.highlight(
            JSON.stringify(payload, null, 3),
            window.Prism.languages.json,
            'json'
          )
        }}
      />
    </>
  );
}

export default function Logger() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const channels = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: 'eu'
    });

    const channel = channels.subscribe('webhooks');
    channel.bind('incoming-webhook', (data) => {
      setEntries((entries) =>
        [{ date: new Date(), data }, ...entries].sort(byDate)
      );
    });

    return () => channel.unsubscribe('webhooks');
  });

  return (
    <Layout>
      <Head>
        <link rel="stylesheet" href="/static/prism.css" />
        <script src="/static/prism.js" />
      </Head>
      <StyledOuter>
        <Header>
          <H1>Webhook logs</H1>
          <p>
            This page displays the incoming webhooks from{' '}
            <a href="https://crystallize.com">Crystallize</a>
          </p>

          {entries.length === 0 && (
            <div>
              <i>No webhooks have been received just yet</i>
            </div>
          )}
        </Header>
        {entries.length > 0 && (
          <List>
            <AnimatePresence initial={false}>
              {entries.map((entry) => (
                <motion.li
                  key={entry.date}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Entry entry={entry} />
                </motion.li>
              ))}
            </AnimatePresence>
          </List>
        )}
      </StyledOuter>
    </Layout>
  );
}
