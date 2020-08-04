import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Layout, Space } from 'antd';

import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect, HashRouter } from 'react-router-dom';
import configureStore from './store';
import SearchBar from './search/input';
import SongTable from './search/SongTable';
import SongSlider from './play/PlayBoard';

/*
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
\*/
const store = configureStore({
  search_items: { isFetching: false, error: false, items: [] },
  song_items: { isFetching: false, error: false },
});
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Route path="/" exact>
          <Layout>
            <Layout.Header>
              音乐综合搜索
            </Layout.Header>
            <Layout.Content className="search-container">

              <SearchBar />
              <SongTable />

            </Layout.Content>
          </Layout>
        </Route>
        <Route path="/play/:id/:vendor" component={SongSlider}>

        </Route>
      </Router>

    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
