import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/auth-context';
import {useContext} from 'react';
import classes from './MainNavigation.module.css';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';
import { selectUserById } from '../features/users/usersSlice';


const MainNavigation = () => {

  const authCtx = useContext(AuthContext);

  let currentUser
  
  if (authCtx.userPool.getCurrentUser()) {
    currentUser = authCtx.userPool.getCurrentUser().username
  }

  const currentUserObject = useSelector(state => {
    return selectUserById(state, currentUser)
  })


  const isLoggedIn = authCtx.isLoggedIn;

  const location = useLocation();

  const logoutHandler = () => {
    
    authCtx.logout();

    // Could redirect if we wanted to...but we are going to use navigation guards
    
  }

  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>Employee Polls</div>
      </Link>
      <nav>
        <ul>
          {isLoggedIn && <li>
            <Link to="/">Home</Link>
          </li>}
          {isLoggedIn && <li>
            <Link to="/add">New</Link>
          </li>}
          {isLoggedIn && <li>
            <Link to="/leaderboard">Leaderboard</Link>
          </li>}
          {(!isLoggedIn) && (location.pathname !== '/auth') &&(
          <li>
            <Link to='/auth'>Login</Link>
          </li>
          )}
          {(isLoggedIn && currentUserObject) && (
            <li style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            
          }}>
              <Link to='/profile'>{
                <Avatar src={currentUserObject.avatarURL} alt={currentUserObject.name} />
              }</Link>
              {/* {
                <Avatar src={currentUserObject.avatarURL} alt={currentUserObject.name} />
              } */}
              <span style={{
                paddingLeft: '1em',
                color: '#1465C0',
              }}>{currentUserObject.id}</span>
          </li>
          )}
          
          {isLoggedIn && (
            <li>
            <button onClick={logoutHandler}>Logout</button>
          </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
