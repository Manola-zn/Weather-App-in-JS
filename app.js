const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i"),
      
//You will need to create your own credential on Open Weather Map
api_key= `your_api_key`;

let api;

//Adding event listener key press of enter
inputField.addEventListener("keyup", e =>{

    //If user pressed enter btn and input value is not empty
    if(e.key == "Enter" && inputField.value != "")
    {
        requestApi(inputField.value);

    }
});

//Adding event listener to click the location
locationBtn.addEventListener("click", () =>{

    if(navigator.geolocation)
    {
        //If browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else
    {
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city)
{

    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;
    fetchData();
}

function onSuccess(position)
{

    //Getting lat and lon of the user device from coords obj
    const {latitude, longitude} = position.coords; 
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`;
    fetchData();
}

//If any error occur while getting user location then we'll show it in infoText
function onError(error)
{
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData()
{

    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");

    //Getting api response and returning it with parsing into js obj and in another 
    //Then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

//Getting the details of a particular weather  
function weatherDetails(info)
{

    if(info.cod == "404")
    {
        //If user entered city name isn't valid
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }
    else
    {
        //Getting required properties value from the whole weather information
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity, temp_min, temp_max} = info.main;
        const sunrise = info.sys.sunrise;
        const sunset = info.sys.sunset;
        const timezone = 3600;

        let now = new Date();

        //Using custom weather icon according to the id which api gives to us
        if(id == 800)
        {
            wIcon.src = "images/clear.svg";
        }
        else if(id >= 200 && id <= 232)
        {
            wIcon.src = "images/storm.svg";  
        }else if(id >= 600 && id <= 622)
        {
            wIcon.src = "images/snow.svg";

        }else if(id >= 701 && id <= 781)
        {
            wIcon.src = "images/haze.svg";

        }else if(id >= 801 && id <= 804)
        {
            wIcon.src = "images/cloud.svg";

        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321))
        {
            wIcon.src = "images/rain.svg";

        }

        //Passing a particular weather info to a particular element
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".date").innerText = dateBuilder(now);
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        weatherPart.querySelector(".min span").innerText = Math.floor(temp_min);
        weatherPart.querySelector(".max span").innerText = Math.floor(temp_max);
        weatherPart.querySelector(".sunrise span").innerText = `${new Date((sunrise + timezone) * 1000).toUTCString().slice(-11, -7)}`;
        weatherPart.querySelector(".sunset span").innerText = `${new Date((sunset + timezone) * 1000).toUTCString().slice(-11, -7)}`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

//Returns today's date
function dateBuilder(d) {

    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});
