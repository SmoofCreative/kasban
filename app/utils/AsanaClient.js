import Asana from 'asana';

let authCreds = {};
const access_token = localStorage.getItem('access_token') || false;

if (access_token) {
  authCreds = {
    credentials: access_token
  }
}

export default Asana.Client.create({
  clientId: process.env.CLIENT_ID,
  redirectUri: document.location['href']
}).useOauth(authCreds);
