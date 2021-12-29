import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { Home, SignIn, SignUp, OrderList, OrderDetails } from 'pages';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useCookies } from 'react-cookie';

const theme = createTheme();

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['username', 'token']);
  const isLoggedIn = cookies.username && cookies.token;

  const logOut = () => {
    removeCookie('username');
    removeCookie('token');
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position='relative'>
        <Toolbar>
          <Typography variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
            <Link to='/'>Cleanny</Link>
          </Typography>
          {
            isLoggedIn ? ([
              <Button color='inherit'><Link to='orders'>Zamówienia</Link></Button>,
              <Button color='inherit' onClick={logOut}>Wyloguj</Button>
            ]) : ([
              <Button color='inherit'><Link to='sign-in'>Zaloguj</Link></Button>,
              <Button color='inherit'><Link to='sign-up'>Zarejestruj</Link></Button>
            ])
          }

        </Toolbar>
      </AppBar>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='sign-in' element={<SignIn />}/>
        <Route path='sign-up' element={<SignUp />}/>
        <Route path='orders' element={<OrderList />} />
        <Route path='orders/:id' element={<OrderDetails />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
