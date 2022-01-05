import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { OrderDetails, OrderList, ServiceList, SignIn, SignUp, UsersList } from 'pages';
import React from 'react';
import { useCookies } from 'react-cookie';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { UserRoleUtils } from 'utils/user-role-utils';
import './App.css';

const theme = createTheme();

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['username', 'token', 'role']);
  const isLoggedIn = cookies.username && cookies.token;

  const navigate = useNavigate();

  React.useEffect(() => {
    if (cookies.token) {
      logOut();
      navigate('/sign-in');
    }
  }, []);

  const logOut = () => {
    removeCookie('username');
    removeCookie('token');
    removeCookie('role');
    removeCookie('id');
    navigate('/sign-in');
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
              UserRoleUtils.isAdmin(cookies.role) && <Button color='inherit' onClick={() => navigate('/services')} startIcon={<HomeRepairServiceIcon />}>Usługi</Button>,
              UserRoleUtils.isAdmin(cookies.role) && <Button color='inherit' onClick={() => navigate('/users')} startIcon={<SupervisedUserCircleIcon />}>Użytkownicy</Button>,
              <Button color='inherit' startIcon={<AccountCircleIcon />}>{cookies.username}</Button>,
              <Button color='inherit' startIcon={<LogoutIcon />} onClick={logOut}>Wyloguj</Button>
            ]) : ([
              <Button color='inherit' onClick={() => navigate('/sign-in')} startIcon={<LoginIcon />}>Zaloguj</Button>,
              <Button color='inherit' onClick={() => navigate('/sign-up')} startIcon={<PersonAddAltIcon />}>Zarejestruj</Button>
            ])
          }

        </Toolbar>
      </AppBar>
      <Routes>
        <Route path='sign-in' element={<SignIn />}/>
        <Route path='sign-up' element={<SignUp />}/>
        <Route path='/' element={<OrderList />} />
        <Route path='orders/:id' element={<OrderDetails />} />
        <Route path='services' element={<ServiceList />} />
        <Route path='users' element={<UsersList />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
