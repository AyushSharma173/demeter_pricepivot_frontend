const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// Used when generating any kind of tokens
// To set up environmental variables, see http://twil.io/secure
const twilioAccountSid = 'AC5e855e71dd73820a276ceb476fe794f3'
const twilioApiKey = 'SK3952176910324890cf612aec5d7185ee';
const twilioApiSecret = 'rR0ldEgiVs5j4wRcBEh7zLgZuip1ik44';

const identity = 'user';

// Create Video Grant
const videoGrant = new VideoGrant({
  //room: 'cool room',
});

// Create an access token which we will sign and return to the client,
// containing the grant we just created
const token = new AccessToken(
  twilioAccountSid,
  twilioApiKey,
  twilioApiSecret,
  {identity: identity}
);
token.addGrant(videoGrant);

// Serialize the token to a JWT string
console.log(token.toJwt());
