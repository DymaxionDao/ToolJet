import { BehaviorSubject } from 'rxjs';
import { history, handleResponse } from '@/_helpers';
import config from 'config';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
  login,
  ssoLogin,
  logout,
  signup,
  updateCurrentUserDetails,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
  signInViaOAuth,
};

function login(email, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  };

  return fetch(`${config.apiUrl}/authenticate`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      currentUserSubject.next(user);

      return user;
    });
}

function ssoLogin() {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };

  /**
   * Read Tokken from url and send sso login apiCall
   */

  const url = `${config.apiUrl}/ssologin?tokken=${window.location.href.split('tokken=')[1]}`;

  return fetch(url, requestOptions)
    .then(handleResponse)
    .then((user) => {
      if (user?.data?.message) {
        throw new Error(user.data.message);
      }
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      currentUserSubject.next(user);

      return { status: true, user };
    })
    .catch((e) => {
      return {
        status: false,
        message: e.message,
      };
    });
}

function updateCurrentUserDetails(details) {
  const currentUserDetails = JSON.parse(localStorage.getItem('currentUser'));
  const updatedUserDetails = Object.assign({}, currentUserDetails, details);
  localStorage.setItem('currentUser', JSON.stringify(updatedUserDetails));
  currentUserSubject.next(updatedUserDetails);
}

function signup(email) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  };

  return fetch(`${config.apiUrl}/signup`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      return user;
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
  currentUserSubject.next(null);
  history.push(`/login?redirectTo=${window.location.pathname}`);
}

function signInViaOAuth(ssoResponse) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ssoResponse),
  };

  return fetch(`${config.apiUrl}/oauth/sign-in`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      localStorage.setItem('currentUser', JSON.stringify(user));
      currentUserSubject.next(user);

      return user;
    });
}
