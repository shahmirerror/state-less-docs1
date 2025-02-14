import './App.css';

import client, { localClient } from './lib/client';

import { StateProvider } from './provider/StateProvider';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import './App.css';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from './provider/ThemeProvider';
import { Layout } from './container/Layout';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useLocalStorage } from '@state-less/react-client';
import { Helmet } from "react-helmet"

function App() {
  const [cookieConsent] = useLocalStorage('cookie-consent', null);
  return (
    <div className="App">
            {cookieConsent === true && (
        <Helmet>
          <script src="https://www.googletagmanager.com/gtag/js?id=G-C3F4656WLD"></script>

          <script
            id="gtm-script"
           src='/gtag-1.js'
            
          ></script>
          <script
            id="test"
            type="application/javascript"
            src='/gtag-2.js'
          ></script>
        </Helmet>
      )}
      <ApolloProvider
        client={process.env.NODE_ENV === 'production' ? client : localClient}
      >
        <AuthProvider>
          <StateProvider>
            <ThemeProvider>
              <Router>
                <ScrollToTop />

                <Layout />
              </Router>
            </ThemeProvider>
          </StateProvider>
        </AuthProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
