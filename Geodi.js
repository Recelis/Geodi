 /* https://openweathermap.org/current#geo 
 get weather api call
 get geolocation
 input location if not too possible
api.openweathermap.org/data/2.5/weather?q={city name},{country code} 
 997b12fce3184c02353654296fdb1df5 weather key
 
 */
var goToSleepSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
var content = {
    weather:{
      clear:"http://lookingtothesky.com/wp-content/uploads/2011/02/Blue-Sky.jpg",
      clouds:"https://w-dog.net/wallpapers/10/17/335596661241855/nature-sea-water-night-sunset-sky-clouds-sea-sunset-sky-background-wallpaper-widescreen-full-screen-widescreen-hd-wallpapers-background-wallpaper.jpg",
      thunderstorm:"https://i.ytimg.com/vi/11Xug-gnCXU/maxresdefault.jpg",
      drizzle:"http://images2.fanpop.com/images/photos/7800000/Amazing-Nature-Wallpapers-national-geographic-7896953-1280-960.jpg",
      rain:"https://az616578.vo.msecnd.net/files/2016/05/28/636000076698153744-318535480_maxresdefault.jpg",
      snow:"http://wallup.net/wp-content/uploads/2015/12/63204-road-snow-trees-vintage-Tokyo.jpg",
      extreme:"https://fanart.tv/fanart/movies/331446/moviebackground/sharknado-3-oh-hell-no-559df0811ac24.jpg",
      additional:"http://wallarthd.com/wp-content/uploads/2015/04/Amazing-Double-Rainbow-Wallpaper-Desktop.jpg",
      atmosphere:"http://www.esa.int/var/esa/storage/images/esa_multimedia/images/2006/10/the_earth_s_atmosphere_seen_from_space/9239425-5-eng-GB/The_Earth_s_atmosphere_seen_from_space.jpg",
      fog:"https://upload.wikimedia.org/wikipedia/commons/3/39/Foggy_morning_at_Twin_Peaks_11.jpg",
      mist:"images/cloudy-sunset-over-the-sea-7209.jpg",
      default:"images/cloudy-sunset-over-the-sea-7209.jpg",
    },
    startUp:[
      ["humidity","Humidity outside is "],
      ["temperature", "Temperature is "],
      ["weather","Weather is "],
      ["location","You are in "],
      ["date","The date today is "],
      ["time","The time right now is "],
    ],
    chat:{
      morning:"Good Morning Jacky!",
      afternoon:"Good Afternoon Jacky!",
      evening:"Good Evening Jacky!",
      sleep: "Time to go to Sleep!",
      sleep2: "Darn it! Go to Sleep Jacky!",
      help:"Here are some things you can look at:",
    },
}

var dataStorage={
  city:[],
  country:[],
  location:[],
  time:[],
  date:[],
  temperature:[],
  humidity:[],
  weather:[],
  dateTime:[],
}

var menus = [
  ["My Promise", "https://protected-basin-62209.herokuapp.com/"],
  ["Gumption Tracker", "https://recelis.github.io/questionaire/"],
  ["Calendar","https://calendar.google.com/calendar/render#main_7"],
  ["Wikisearch","https://recelis.github.io/WikipediaViewer/"],
  ["Scorecard","#"],
  ["Pomodoro"," https://recelis.github.io/pomodoro/"],
  ["News",""],
  ["Portfolio","https://recelis.github.io/Portfolio/"],
  ["Emissions Calculator","#"],
]


var timeElapsed = 0;
var startSequence;
var clicked = false;
/****************************************** runCode functionality *******************************************************************/
document.addEventListener("DOMContentLoaded", function(event) {
  locationCalls();
  setTimeout(run,1500);
});

function run(){
  startSequence = setInterval(function(){startup()},1000); 
}

function startup(){
  if (timeElapsed <= 6){
    if (timeElapsed < 6) {
      startMessage();
    }
    pushPrevMessageToTop();
    timeElapsed++;
    var boxid = "box" + timeElapsed.toString();
    createBox(boxid);
  }
  else if (timeElapsed ==7){
    $('#box').animate({ 
        top: "35%",
      },950,startAI);
    updateAll();
    timeElapsed++;
  } else{
    updateAll();
  }
}

function createBox(boxid){
  var box = document.createElement('id')
  box.id = boxid;
  $(box).fadeIn(500);
  document.getElementById('setting').appendChild(box);
}

function startMessage(){
  var message = document.createElement('id');
  message.id = content.startUp[timeElapsed][0];
  message.classList.add("message");
  var dataFromStorage = dataStorage[content.startUp[timeElapsed][0]];
  var textMessage = content.startUp[timeElapsed][1] + dataFromStorage;
  if (message.id === "temperature") textMessage += 'C';
  if (message.id === "humidity") textMessage += '%';
  if (timeElapsed === 0) message.style.color = '#0d0316';
  var text = document.createTextNode(textMessage);
  message.appendChild(text);
  $(message).fadeOut(500);
  document.getElementById('statusBar').appendChild(message);
}

function pushPrevMessageToTop(){
  if (timeElapsed === 0) return;
  // remove element from message
  var element = document.getElementById(content.startUp[timeElapsed-1][0]);
  element.parentElement.removeChild(element);
  // add dataStorage values to header
  var list = document.createElement("id");
  list.id = content.startUp[timeElapsed-1][0];
  var newText = dataStorage[content.startUp[timeElapsed-1][0]];
  if (content.startUp[timeElapsed-1][0] === 'temperature') newText += 'C';
  if (content.startUp[timeElapsed-1][0] === 'humidity') newText += '%';
  var textNode = document.createTextNode(newText);
  list.appendChild(textNode);
  list.classList.add("col-xs-2");
  list.classList.add("headFormatting");
  document.getElementById("statusBar").appendChild(list);
}


function locationCalls(){
  var urlLoc = "https://ipapi.co/json/";
  var celsius = true;
  var temperature;
  $.ajax({
    type: "GET", 
    url: urlLoc,
    success: function(data){
      dataStorage.city = data["city"];
      dataStorage.country = data["country_name"];
      dataStorage.location = dataStorage.city + ", " +dataStorage.country;
      getWeatherData(data);
    },
    error:function(exception){console.log(exception);}
  });
}

function getDateTime(){
    var currentDate = new Date();
    var hour = currentDate.getHours();
    var minute = currentDate.getMinutes();
    var second = currentDate.getSeconds();
    var day = convertDayToText(currentDate.getUTCDay());
    var date = currentDate.getDate();
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    dataStorage.time = hour + ":" + minute + ":" + second;
    dataStorage.date = day + ", " +date+"/"+ month + "/" + year;
    dataStorage.dateTime = currentDate;
}

function convertDayToText(day){
  var textDay;
  switch(day){
    case 1:
      textDay = 'Mon';
      break;
    case 2:
      textDay = 'Tue';
      break;
    case 3: 
      textDay =  'Wed';
      break;
    case 4:
      textDay = 'Thu';
      break;
    case 5:
      textDay = 'Fri';
      break;
    case 6:
      textDay = 'Sat';
      break;
    case 0:
      textDay = 'Sun';
      break;
  }
  return textDay;
}


function updateWeather(){
  // get location  
  var urlLoc = "http://ip-api.com/json";
  $.ajax({
    type: "GET", 
    url: urlLoc,
    success: function(data){
      dataStorage.city = data["city"];
      dataStorage.country = data["country_name"];
      dataStorage.location = dataStorage.city + ", " +dataStorage.country; 
      getWeatherData(data); // update weather
    }
  });
}



 function getWeatherData(dataLoc){
   var url = "http://api.openweathermap.org/data/2.5/weather?lat=" +dataLoc["latitude"] + "&lon=" + dataLoc["longitude"] + "&APPID=997b12fce3184c02353654296fdb1df5";
   $.ajax({
     type: "GET",
     url: url,
     success: function(data){
       temperature = Math.floor(data["main"]["temp"] -272.150);
       dataStorage.temperature = temperature;
       dataStorage.humidity = data["main"]["humidity"];
       dataStorage.weather = data["weather"][0]["description"];
      // $(".toggle").click(function(){
      //   if (celsius == true){
      //     celsius = false;
      //     $(".toggle").html(Math.floor((temperature+32)*9/5)+ "&deg F");
      //   } else{
      //     celsius = true;
      //     $(".toggle").html(temperature+ "&deg C");
      //   } 
      // });
     },
     error:function(exception){console.log(exception);}
   });
  getDateTime();
 }

function updateAll(){
  setInterval(updateWeather,1200000);
  getDateTime();
  for (var ii =0; ii < content.startUp.length; ii++){
    newText = dataStorage[content.startUp[ii][0]];
    if (content.startUp[ii][0] === 'temperature') newText += 'C';
    if (content.startUp[ii][0] === 'humidity') newText += '%';
    $('#'+content.startUp[ii][0]).html(newText);
  }
}

/************************************ AI ***************************************************/

function startAI(){
  aiOn();
  aiControl();
  setInterval(aiOn,60000);
}

function aiOn(){
  var hour = dataStorage.dateTime.getHours();
  var greeting = document.getElementById('welcome');
  if (hour < 12 && hour >5)  greeting.innerHTML = content.chat.morning;
  else if (hour >= 12 && hour < 18) greeting.innerHTML = content.chat.afternoon;
  else if (hour >= 18 && hour < 22) greeting.innerHTML = content.chat.evening;
  else if (hour == 22) greeting.innerHTML = content.chat.sleep;
  else {
    goToSleepSound.play();
    greeting.innerHTML = content.chat.sleep2;
  }  
}

function aiControl(){
  $('#box').hover(function(){
    $(this).css("box-shadow","0px 0px 30px #ff80c3");
  },
  function(){
    $(this).css("box-shadow", "0px 0px 0px #ff80c3");
  });

  document.getElementById('box').onclick = function(){
    if (clicked == false){
      clicked = true;
      document.getElementById('welcome').innerHTML = content.chat.help;
      for (var ii =0; ii < menus.length; ii++){
        var button = document.createElement("id");
        button.id = menus[ii][0];
        button.classList.add('menuButton');
        button.alt = menus[ii][1];
        button.onclick = function(){
          window.open(this.alt, '_blank');
        }
        $(button).hover(
          function(){
            $(this).css("text-shadow","0px 0px 30px #ff80c3");
          },
          function(){
            $(this).css("text-shadow", "0px 0px 0px #ff80c3");
          }
        )
        var buttonText = document.createTextNode(menus[ii][0]);
        var br = document.createElement("br");
        button.appendChild(buttonText);
        button.appendChild(br);
        document.getElementById('menu').appendChild(button);
      }
    }
    else{
      clicked = false;
      var parent = document.getElementById('menu');
      for (var ii =0; ii < menus.length; ii++){
        var buttonToRemove = document.getElementById(menus[ii][0]);
        parent.removeChild(buttonToRemove);
      }
      aiOn();
    }
  };
  
}


 