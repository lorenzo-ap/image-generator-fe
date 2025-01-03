import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Header, Page } from './components';
import { CreatePost, Home } from './pages';

const App = () => {
  return (
    <MantineProvider defaultColorScheme='light' withCssVariables>
      <BrowserRouter>
        <Header />

        <main className='min-h-[calc(100vh-77px)] w-full px-4 py-8 sm:px-8'>
          <Routes>
            <Route
              path='/'
              element={
                <Page title='AInterest'>
                  <Home />
                </Page>
              }
            />

            <Route
              path='/generate-image'
              element={
                <Page title='Generate image'>
                  <CreatePost />
                </Page>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;
