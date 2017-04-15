console.log("HI");
document.getElementById('reset').onclick = function() {
	var query = document.getElementById('query').value, newQuery = "", charA = "", charB = "", uID = "", j = 0;
	var rows = [];
	for (key in rows) {
		console.log(key);
		console.log("SDSD");
	}
	for (var i = 0; i < query.length; i++) {
		if (query[i] == '\t') {
			if (uID == "") {
				uID = query.substring(0,i);
				query = query.substring(i+1,query.length);
			} else {
				charA = query.substring(0,i);
				query = query.substring(i+1,query.length);
			}
			i = 0;
		} else if (query[i] == '\n') {
			charB = query.substring(0,i);
			query = query.substring(i+1,query.length);
			i = 0;
			rows[parseInt(uID)] = {};
			rows[parseInt(uID)].uID = uID;
			rows[parseInt(uID)].name = charA;
			rows[parseInt(uID)].branch = charB;
			// newQuery += "insert into users (name, branch) values ('" + charB + "', '" + charA + "'); ";
			charA = "";
			charB = "";
			uID = "";
		}
	}
	console.log(rows);
	var flag = document.getElementById('ipfiles').files.length;
	if (flag == 0) {
	  	console.log(rows);
	  	var xhttp = new XMLHttpRequest();
	    xhttp.open("POST", "/reset", true);
	    xhttp.setRequestHeader('Content-Type', 'application/json');
	    console.log(JSON.stringify(rows));
	    xhttp.send(JSON.stringify(rows));
	  }
	for (var i = 0; i < document.getElementById('ipfiles').files.length; i++) {
		var file = document.getElementById('ipfiles').files[i];
		(function readFile(file) {
			for (var j = 0; j < file.name.length; j++) {
				if (file.name[j] == '.') {
					var uID = file.name.substr(0, j);
					// console.log(uID);
					var fileReader = new FileReader();
				    fileReader.onload = function(fileLoadedEvent) {
				      // rows[parseInt(uID)].file = this.result;
				      console.log("fdfffd");
				      console.log(this.result);
				      if (rows[parseInt(uID)]) {
				      	rows[parseInt(uID)].file = this.result;
				      	console.log(rows[parseInt(uID)]);
				      	flag--;
				      } else {
				      	rows[parseInt(uID)] = {uID: uID, file: this.result};
				      	flag--;
				      }
				      // console.log(this.result);
				      console.log(flag);
				      if (flag == 0) {
				      	console.log(rows);
				      	var xhttp = new XMLHttpRequest();
					    xhttp.open("POST", "/reset", true);
					    xhttp.setRequestHeader('Content-Type', 'application/json');
					    console.log(JSON.stringify(rows));
					    xhttp.send(JSON.stringify(rows));
				      }
				    };
				    fileReader.readAsDataURL(file);
				    break;
				}
			}
		})(file);
		// console.log(file.name);
	}
	// console.log(document.getElementById('ipfiles').files);
}