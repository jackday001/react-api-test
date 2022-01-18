/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import Form from './Form';
import Section from './Section';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';
const axios = require('axios');
const baseUrl = 'https://api-pub.bitfinex.com/v2/';

const key = 'home';

export function HomePage({ username, loading, error, repos, onSubmitForm }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [tickers, setTickers] = useState([]);
  const [selectedTicker, setSeletedTicker] = useState();
  const [data, setData] = useState([]);
  const [trades, setTrades] = useState([]);
  const [candles, setCandles] = useState([]);

  const handleTickerChanage = e => {
    setSeletedTicker(e.target.value);
    if (e.target.value !== 'Select Ticker') {
      axios
        .get(`${baseUrl}/tickers?symbols=${e.target.value}`)
        .then(response => {
          setData(response.data[0]);
        });
      axios.get(`${baseUrl}/trades/${e.target.value}/hist`).then(response => {
        setTrades(response.data);
      });
      axios
        .get(`${baseUrl}/candles/trade:1m:${e.target.value}/hist`)
        .then(response => {
          setCandles(response.data);
        });
    }
  };

  useEffect(() => {
    // When initial state username is not null, submit the form to load repos
    if (username && username.trim().length > 0) onSubmitForm();

    const pathParams = 'tickers';
    const queryParams = 'symbols=ALL';
    axios.get(`${baseUrl}/${pathParams}?${queryParams}`).then(response => {
      setTickers(response.data);
    });
  }, []);

  const reposListProps = {
    loading,
    error,
    repos,
  };

  return (
    <article>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>
      <div>
        <Section>
          <H2>Select Ticker</H2>
          <Form onSubmit={onSubmitForm}>
            <span>Ticker:</span>
            <select value={selectedTicker} onChange={handleTickerChanage}>
              <option value="Select Ticker">Select Ticker</option>
              {tickers.map(ticker => (
                <option key={ticker[0]} value={ticker[0]}>
                  {ticker[0]}
                </option>
              ))}
            </select>
          </Form>
          <div>BID: {data[1]}</div>
          <div>BID_SIZE: {data[2]}</div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '100%' }}>
              <h2>Trades</h2>
              <table style={{ border: '1px solid black', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid black' }}>ID</th>
                    <th style={{ border: '1px solid black' }}>MST</th>
                    <th style={{ border: '1px solid black' }}>AMOUNT</th>
                    <th style={{ border: '1px solid black' }}>PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map(trade => (
                    <tr>
                      <td style={{ border: '1px solid black' }}>{trade[0]}</td>
                      <td style={{ border: '1px solid black' }}>{trade[1]}</td>
                      <td style={{ border: '1px solid black' }}>{trade[2]}</td>
                      <td style={{ border: '1px solid black' }}>{trade[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ width: '100%' }}>
              <h2>Candles</h2>
              <table style={{ border: '1px solid black', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid black' }}>MST</th>
                    <th style={{ border: '1px solid black' }}>OPEN</th>
                    <th style={{ border: '1px solid black' }}>CLOSE</th>
                    <th style={{ border: '1px solid black' }}>HIGH</th>
                    <th style={{ border: '1px solid black' }}>LOW</th>
                    <th style={{ border: '1px solid black' }}>VOLUME</th>
                  </tr>
                </thead>
                <tbody>
                  {candles.map(candle => (
                    <tr>
                      <td style={{ border: '1px solid black' }}>{candle[0]}</td>
                      <td style={{ border: '1px solid black' }}>{candle[1]}</td>
                      <td style={{ border: '1px solid black' }}>{candle[2]}</td>
                      <td style={{ border: '1px solid black' }}>{candle[3]}</td>
                      <td style={{ border: '1px solid black' }}>{candle[4]}</td>
                      <td style={{ border: '1px solid black' }}>{candle[5]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <ReposList {...reposListProps} />
        </Section>
      </div>
    </article>
  );
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HomePage);
