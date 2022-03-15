import React, { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { ChakraProvider, Spinner } from '@chakra-ui/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import theme from 'theme/theme';
import { AuthProvider } from 'contexts/AuthProvider';
import Router from 'router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const storageToken =
    localStorage.getItem('access_token') ?? sessionStorage.getItem('access_token');

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <ChakraProvider portalZIndex={40} theme={theme} resetCss={false}>
          <Suspense fallback={<Spinner />}>
            <AuthProvider token={storageToken}>
              <Router />
            </AuthProvider>
          </Suspense>
        </ChakraProvider>
      </HashRouter>
    </QueryClientProvider>
  );
};

export default App;
