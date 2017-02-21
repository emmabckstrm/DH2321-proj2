var continentColor = [
  "#ccc",
  "#da4480",
  "#5ab449",
  "#7f5acd",
  "#45c0bc",
  "#ce5929",
  "#CEBE29"
]
var continents = ["africa", "south america", "europe", "oceania", "asia", "north america"];
var continentsCountries = [
  {
    "name": "europe", 
    "countries": ["Armenia","Azerbaijan","Belarus","Cyprus","Estonia","Georgia","Germany","Netherlands","Sweden"]
  }, 
  {
    "name": "south america",
    "countries": ["Argentina","Brazil","Colombia","Chile","Ecuador"]
  }, 
  {
    "name": "africa",
    "countries": ["Algeria","Egypt","Ghana","Libya","Morocco"]
  }, 
  {
    "name": "oceania",
    "countries": ["Australia"]
  }, 
  {
    "name":"asia",
    "countries": ["Bahrain","China","Hong Kong","HongKong","India","Iraq","Japan","Jordan","Kazakhstan","Kuwait","Lebanon","Malaysia"]
  }, 
  {
    "name": "north america",
    "countries": ["Mexico"]
  }
]
var continentKeys = {
  "Algeria": "africa",
  "Argentina": "south america",
  "Armenia": "europe",
  "Australia": "oceania",
  "Azerbaijan": "europe",
  "Bahrain": "asia",
  "Belarus": "europe",
  "Brazil": "south america",
  "Colombia": "south america",
  "Cyprus": "europe",
  "Chile": "south america",
  "China": "asia",
  "Ecuador": "south america",
  "Egypt": "africa",
  "Estonia": "europe",
  "Georgia": "europe",
  "Germany": "europe",
  "Ghana": "africa",
  "Hong Kong": "asia",
  "HongKong": "asia",
  "India": "asia",
  "Iraq": "asia",
  "Japan": "asia",
  "Jordan": "asia",
  "Kazakhstan": "asia",
  "Kuwait": "asia",
  "Kyrgyzstan": "asia",
  "Lebanon": "asia",
  "Libya": "africa",
  "Malaysia": "asia",
  "Mexico": "north america",
  "Morocco": "africa",
  "Netherlands": "europe",
  "Sweden": "europe"
}

var countries = [
  "Algeria",
  "Argentina",
  "Armenia",
  "Australia",
  "Azerbaijan",
  "Bahrain",
  "Belarus",
  "Brazil",
  "Colombia",
  "Cyprus",
  "Chile",
  "China",
  "Ecuador",
  "Egypt",
  "Estonia",
  "Georgia",
  "Germany",
  "Ghana",
  "Hong Kong",
  "HongKong",
  "India",
  "Iraq",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kuwait",
  "Kyrgyzstan",
  "Lebanon",
  "Libya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "Sweden"
]
var values = [
  {
    "title": "Confidence in churches",
    "id": "v108"
  },
  {
    "title": "Confidence in the press",
    "id": "v110"
  },
  {
    "title": "Confidence in the police",
    "id": "v113"
  },
  {
    "title": "Confidence in the courts",
    "id": "v114"
  },
  {
    "title": "Confidence in the government",
    "id": "v115"
  },
  {
    "title": "Confidence in banks",
    "id": "v121"
  },
  {
    "title": "Confidence in environmental organisations",
    "id": "v122"
  },
  {
    "title": "Confidence in women's organisations",
    "id": "v123"
  },
]
var alternatives = [
  "A great deal",
  "DK",
  "NA",
  "None at all",
  "Not very much",
  "Quite a lot"
]
var alternativesId = [
  "great",
  "Dunno",
  "Noanswer",
  "None",
  "Not",
  "Quite"
]


function getTheJSON(file) {
  $.getJSON(file, function(data) {
      //console.log("HELLO", data);

      var newData = {
        "name": "root",
        "children": []
      }

      for (var i = 0; i<continentsCountries.length; i++) {  // each continent
        var newContinent = {
          "children": [],
          "name": continentsCountries[i].name
        }

        for (var j=0; j<continentsCountries[i].countries.length; j++) { // each country in each contient
          var newCountry = { 
            "children": [],
            "name": continentsCountries[i].countries[j]
           }

          for (var k=0; k<values.length; k++) { // for each value
            var newValue = {
              "name": values[k].id,
              //"id": values[k].id,
              "title": values[k].title,
              "children": []
            }

            for (var l=0; l<alternatives.length; l++) { // for each answer alternative
              var newAlt = {
                "name": String(alternatives[l]),
                //"id": alternativesId[l],
                //"title": alternatives[l],
                "size": 1
              }
              //find correct size
              try {
                  var size = data[values[k].id][alternatives[l]][continentsCountries[i].countries[j]];
                  newAlt.size = size;
              }
              catch(err) {
                  newAlt.size = 0;
              }

              // push alternatives to value
              newValue.children.push(newAlt);
            }
            // push value to country
            newCountry.children.push(newValue);
          }
          // push the country to the contitnent
          newContinent.children.push(newCountry); 
        }
      newData.children.push(newContinent);
      }

      //console.log("FINISHED:",newData);
      //document.getElementById("output").innerHTML = JSON.stringify(newData);
  });
}
//getTheJSON("w9598.json");




