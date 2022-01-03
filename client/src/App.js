import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import { Home, SignIn, SignUp, OrderList, OrderDetails } from 'pages';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useCookies } from 'react-cookie';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const theme = createTheme();

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['username', 'token']);
  const isLoggedIn = cookies.username && cookies.token;

  const navigate = useNavigate();

  const logOut = () => {
    removeCookie('username');
    removeCookie('token');
    removeCookie('role');
    navigate('/');
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
              <Button color='inherit' startIcon={<ShoppingCartIcon />}><Link to='orders'>Zamówienia</Link></Button>,
              <Button color='inherit' startIcon={<AccountCircleIcon />}>{cookies.username}</Button>,
              <Button color='inherit' startIcon={<LogoutIcon />} onClick={logOut}>Wyloguj</Button>
            ]) : ([
              <Button color='inherit' startIcon={<LoginIcon />}><Link to='sign-in'>Zaloguj</Link></Button>,
              <Button color='inherit' startIcon={<PersonAddAltIcon />}><Link to='sign-up'>Zarejestruj</Link></Button>
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
