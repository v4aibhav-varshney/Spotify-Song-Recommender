// This is where your node app starts

// We've started you off with Express (https://expressjs.com/)
// yYou can always use whatever libraries or frameworks you'd like through `package.json` > "Add package".
const express = require("express");
const axios = require("axios") ;
const {getAccessToken} = require("./spotify/auth");
const {searchTracks,getRecommendations,searchArtist} = require("./spotify/actions") ;

const app = express(); // Initialize an express instance called 'app'
app.use(express.json()); // Set up the app to parse JSON request bodies

// Make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// Return the public/index.html file when a GET request is made to the root path "/"
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/recommendations", async (req, res) => {
  // console.log(req.body)
  
  if(!req.body){
    return res.status(400).send({message:"Bad Request : Must provide a body with tracks and aritist"}) 
  }
  
  const {artist1,artist2,artist3} = req.body 
  
  // if(!artist || !track){
  //   return res.status(400).send({message:"Bad Request : Must provide a body with tracks and aritist"}) 
  // }


  let accessToken 
  
  try {
    accessToken = await getAccessToken();
  } catch (err) {
    console.error(err.message);
  }
  
  // console.log(accessToken)
  
  const http = axios.create({headers:{
    'Authorization' : `Bearer ${accessToken}`
  }}) //To attach access token to each requrest 
  
  //1. Get track/artist id
  
  // let trackId
  // console.log(artist) ;
  // console.log(track) ;
  
  let artistId1, artistId2,artistId3
  
  try{
    // const result = await searchTracks(http,{track,artist})
    
    const result1 = await searchArtist(http,{artist1})
    const result2 = await searchArtist(http,{artist2})
    const result3 = await searchArtist(http,{artist3})
        
    artistId1 = result1.artists.items[0].id
    artistId2 = result2.artists.items[0].id
    artistId3 = result3.artists.items[0].id

    // trackId = result.tracks.items[0].id
    // if(!trackId){
    //   return res.status(404).send({message:"No tracks found for song with name ${track} by ${artist}"})
    // }

  }catch(err){
    return res.status(500).send({message:"Internal Error - Something went wrong when searching tracks/artists"})
  }
  // console.log(trackId)

  
  
  //2. Get track recommendations
  
  try{
    // const recommendations = await getRecommendations(http,{trackId})
        const recommendations = await getRecommendations(http,{artistId1,artistId2,artistId3})

    // console.log(result)
    if(!recommendations.tracks.length){
      return res.status(404).send({message:"No recommendations found"})
    }

    return res.send(recommendations) 
    
  }catch(err){
    return res.status(500).send({message:"Internal Error - Something went wrong when getting recommendations"})
  }
  

  // res.send({ message: "OK" });
});

// console.log("Hello from sever.js") ;

// Start listening on a port provided by Glitch
app.listen(process.env.PORT, () => {
  console.log(`App listening at port ${process.env.PORT}`);
});
