const qs = require("qs"); //Data (JSON) can be to converted to query strings via qs
const axios = require("axios"); //To make HTTP requests

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/api/token";

//Note : For client credentials , callback url settings are not required

const getAccessToken = () => {
  const data = qs.stringify({
    grant_type: "client_credentials",
  });

  const encodedToken =Buffer.from(process.env.SPOTIFY_CLIENT_ID+":"+process.env.SPOTIFY_CLIENT_SECRET).toString("base64")    

  // console.log(encodedToken) 
  
  const config = {
    method: "post",
    headers :{
      'Authorization' : `Basic ${encodedToken}` ,
      'Content-Type' : "application/x-www-form-urlencoded" 
    },
    url: SPOTIFY_AUTH_URL,
    data
    
  };

  return axios(config).then(res=>res.data.access_token)
};

module.exports = { getAccessToken }; //Enables the function to be imported by other files
