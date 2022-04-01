import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Spinner from './components/@vuexy/spinner/Fallback-spinner'
import './index.scss'
// import 'antd/dist/antd.css'
import { store } from './redux/storeConfig/store'
import * as serviceWorker from './serviceWorker'
import { Layout } from './utility/context/Layout'

const LazyApp = lazy(() => import('./App'))

// configureDatabase()

ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback={<Spinner />}>
      <Layout>
        <LazyApp />
      </Layout>
    </Suspense>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
