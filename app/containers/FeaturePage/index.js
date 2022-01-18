/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import messages from './messages';
import List from './List';
import ListItem from './ListItem';
import ListItemTitle from './ListItemTitle';

export default function FeaturePage() {
  return (
    <div>
      <Helmet>
        <title>Requirement Page</title>
        <meta name="description" content="Requirement of API Test" />
      </Helmet>
      <H1>Requirement</H1>
      <List>
        {`You can find our react test here https://github.com/mintlayer/react_test
        The idea is to just build a simple UI to talk to the bitfinex API. A
        user should be able to select a ticker (fetchable via the API) and
        display the data (trades/candles minimum) for that ticker. It mentions
        in the README that we ask people to use the boilerplate, that's no
        longer the case as everyone moaned. Feel free to use TS, and anything
        else you need to finish the task. We don't mind how it looks, feel free
        to make it as pretty or as simple as you like. The key things we're
        after are the ability to use a public API and the ability to write easy
        to follow, maintainable code. I wouldn't overthink it too much or spend
        too much time.`}
      </List>
    </div>
  );
}
