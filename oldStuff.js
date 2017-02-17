//console.log(d1014v108);

function jsonToCsv(data, val) {
  // input  { "headers":["Total","Algeria","Azerbaijan","Argentina", ....],
  //          "rows":[{"Total":"    A great deal","Algeria":"32,6","Azerbaijan":"40,5"..."undefined":"9\" "},
  //                  {"Total":"    Quite a lot","Algeria":"27,9","Azerbaijan":"27,3"..."undefined":26},
  //                  {"Total":"    Not very much","Algeria":"22,1",..."undefined":"1\" "},
  //                  {"Total":"    None at all","Algeria":"13,5","Azerbaijan":7,"Argentina":"23,7"
  //                  {"Total":"    No answer","Algeria":"0,7","Azerbaijan":"6,6",
  //                  {"Total":"    Don´t know","Algeria":"3,2","Azerbaijan":0,"Argentina":0,
  //                  ]
  //        }

  var output_data = [];
  var rows = data.rows;
  var headers = data.headers;

  for (var j=0; j<headers.length; j++) {
    var currRow = new Array(5);
    var cont;     // continent
    var country;  
    var alt;      // answer alternative
    var num;      // number value of the alternative

    var currKey = headers[j]; 
    currKey = currKey.replace(/\s+/g, '') // removes spaces

    if (j !== 0) {      
      cont = continents[currKey];
      country = currKey;
    
      currRow[0] = cont.trim();   // trims spaces in beginning and end
      currRow[1] = country.trim();
      currRow[2] = val.trim();

      for (var i=0; i<rows.length; i++) {
      
        alt = rows[i][headers[0]];
        num = String(rows[i][headers[j]]);

        currRow[3] = alt.trim();
        currRow[4] = num.trim();

        output_data.push(currRow);
      }

    
      
    }

    
  }
  return output_data;



  // ouput: europe-sweden-churches-a great deal deal,2.9
  //        europe-sweden-churches-quite a lot a lot,33.7
  //        europe-sweden-churches-not very much,47.9
  //        europe-sweden-churches-none at all,15.1
}

function loadData() {
	
	// https://docs.google.com/spreadsheets/d/17cgQvkG49StxEH0JAUkSlZYbJl8PeFMJz5lbX0vc4a4/pubhtml?gid=1150148407&single=true
	// https://docs.google.com/spreadsheets/d/17cgQvkG49StxEH0JAUkSlZYbJl8PeFMJz5lbX0vc4a4/pub?output=csv
	// https://docs.google.com/spreadsheets/d/17cgQvkG49StxEH0JAUkSlZYbJl8PeFMJz5lbX0vc4a4/pub?output=xlsx nooo



	// https://docs.google.com/spreadsheet/pub?key=p_aHW5nOrj0VO2ZHTRRtqTQ&single=true&gid=0&range=A1&output=csv
  var url="https://docs.google.com/spreadsheets/d/1rvc5xAR_KJAUtIU6_ShQyn3YndLv9bvKxnaJsCvc51o/pub?output=csv";
  xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if(xmlhttp.readyState == 4 && xmlhttp.status==200){
      document.getElementById("display").innerHTML = xmlhttp.responseText;
    }
  };
  xmlhttp.open("GET",url,true);
  xmlhttp.send(null);
}