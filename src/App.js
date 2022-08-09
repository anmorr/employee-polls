import { Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import './App.css';
import { useContext } from 'react';

import AuthContext from './context/auth-context';

import Layout from './Layout/Layout';
import UserProfile from './auth/components/Profile/UserProfile';
import AuthPage from './auth/pages/AuthPage';
import HomePage from './auth/pages/HomePage';
import VerifyPage from './auth/pages/VerifyPage';
import PasswordResetPage from './auth/pages/PasswordResetPage';
import PasswordResetVerificationPage from './auth/pages/PasswordResetVerificationPage'
import Leaderboard from './features/users/Leaderboard'
import { SingleQuestionPage } from './features/questions/SingleQuestionPage';
import NewQuestion from './features/questions/NewQuestion';
import NotFound from './shared/components/NotFound';

function App() {

  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  return (
    <Layout>
      <Switch>
        {authCtx.isLoggedIn && <Route path='/' exact>
          <HomePage />
        </Route>
        }
        {!authCtx.isLoggedIn && (<Route path='/auth'>
          <AuthPage />
        </Route>
        )}
        <Route path='/profile'>
          {authCtx.isLoggedIn && (<UserProfile />)}
          {!authCtx.isLoggedIn && <Redirect to='/auth' />}
        </Route>
        {!isLoggedIn && <Route path='/password-reset'>
          <PasswordResetPage />
        </Route>}
        {!isLoggedIn && <Route path='/password-reset-verify'>
          <PasswordResetVerificationPage />
        </Route>}
        <Route path='/verify'>
          <VerifyPage />
        </Route>
        {isLoggedIn && <Route path='/leaderboard'>
          <Leaderboard />
        </Route>}
        {isLoggedIn && <Route path='/add'>
          <NewQuestion />
        </Route>}
        {authCtx.isLoggedIn && (<Route exact path="/questions/:questionId" component={SingleQuestionPage} />)}
        {!authCtx.isLoggedIn && <Route path='*'>
          {!authCtx.isLoggedIn && <Redirect to='/auth' />}
        </Route>}
        {authCtx.isLoggedIn && <Route path='*'>
          {<NotFound />}
        </Route>}
      </Switch>
    </Layout>
  );
}

export default App;
