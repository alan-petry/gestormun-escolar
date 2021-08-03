import React from 'react';
import Routes from 'components/routes/routes';
import {GlobalProvider} from 'contexts/context';

export function App() {
  return (
    <GlobalProvider>
      <Routes />
    </GlobalProvider>
  );
}