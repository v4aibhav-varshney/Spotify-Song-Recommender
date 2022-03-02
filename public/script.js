// Client-side js, loaded by index.html. Runs when web page is loaded
// Any console.log in this file will appear the browser console

// console.log("Hello from script.js!")

const axios = window.axios;
const handlebars = window.Handlebars;

const output = document.getElementById("recommendations-output");
const button = document.getElementById("submitButton");

const submitForm = async (event) => {
  //It is an asynchronous event as axios is promise based
  try {
    disableButton();
    event.preventDefault(); //Prevent the form from refreshing immediately

    const elements = event.target.elements; //Alternative : const {elements} = events.target
    const artist1 = elements.artist1.value;
    const artist2 = elements.artist2.value;
    const artist3 = elements.artist3.value;
    
    // console.log(track);
    // console.log(artist);

    let result;

    try {
      //Send data to backend
      //Also await is required for asynchronous operation
      result = await axios.post("/recommendations", { artist1, artist2,artist3 }); //Since await is used , then is not required

      // console.log(result);
    } catch (err) { //For error handling
      let errorMessage = "Something went wrong";
      if (err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      return alert(err.message);
    }

    const recommendations = result.data.tracks;
    // const topThreeRecs = recommendations.slice(0, 3);
    const topFiveRecs = recommendations.slice(0,5) ;

    const template = handlebars.compile(rawTemplate);
    const html = template({ artist1,artist2,artist3, topFiveRecs });
    output.innerHTML = html;
  } catch (err) {
    console.error(err)
  } finally{ //It will be executed no matter the operation is successfull or not 
    enableButton()
  }
};

//Note : Handlebars.js is being used !
//Note : Easy way to make HTTP requests is via axios

const enableButton = () => {
  button.disabled = false;
  button.value = "Get Recommendations";
};

const disableButton = () => {
  button.disabled = true;
  button.value = "Loading..";
};

const rawTemplate = `
  <p>If you like {{artist1}} , {{artist2}} and {{artist3}} , you will love : <p>
  <ul>
    {{#each topFiveRecs}}
    <li> {{name}} - <a href="{{external_urls.spotify}}">Play</a> </li>
    {{/each}}
  </ul>
`;
