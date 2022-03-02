const axios = require("axios");

const baseUrl = "https://api.spotify.com/v1";

const searchTracks = async (http, { track, artist }) => {
  //Note : Headers are not required as already included in http instance
  const config = {
    method: "get",
    url: `${baseUrl}/search?q=track:${track}+artist:${artist}&type=track`,
  };

  return http(config).then((response) => response.data);
};

const getRecommendations = async (http, { artistId1,artistId2,artistId3 }) => {
  let config = {
    method: "get",
    url: `${baseUrl}/recommendations?seed_artists=${artistId1},${artistId2},${artistId3}`,
  };

  return http(config).then((response) => response.data);
};

const searchArtist = async (http, {artist}) => {
  //Note : Headers are not required as already included in http instance
  const config = {
    method: "get",
    url: `${baseUrl}/search?q=${artist}&type=artist`,
  };

  return http(config).then((response) => response.data);
};


module.exports = { searchTracks, getRecommendations ,searchArtist};
