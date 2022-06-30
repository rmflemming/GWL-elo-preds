// makes it easier to convert the team name to the team's image file
function getIcon(team, size) {
	str = "<img class=" + size +  " src='/img/" + team.replace(/-|\s/g,'') + ".png'></img>";
	return str;
}

function getBackground(team) {
	str = "<img class='top-icon-bg' src='/img/" + team.replace(/-|\s/g,'') + "BG.png'></img>";
	return str;
}

// we can use the appropriate picture based on the team elo		
function getRankIcon(elo, size) {
	var pic;
	if (elo >= 4000) {
		pic = 'Grandmaster';
	} else if (elo >= 3500) {
		pic = 'Master';
	} else if (elo >= 3000) {
		pic = 'Diamond';
	} else if (elo >= 2500) {
		pic = 'Platinum';
	} else if (elo >= 2000) {
		pic = 'Gold';
	} else if (elo >= 1500) {
		pic = 'Silver';
	} else {
		pic = 'Bronze';
	}
			
	str = "<img class=" + size +  " src='/img/" + pic + ".png'></img>";
	return str;
}

// we use this to calculate the changes from last week to this week
// based on the change, we have an up arrow or down arrow on the site
function getTrend(hist) {
	var change = hist.at(-2) - hist.at(-1);
	var icon = '';
	var formatter = new Intl.NumberFormat("en-GB", { style: "decimal",  signDisplay: 'always' });
	if (change > 0) {
	icon = ' <span class="trendUp"><i class="bi-caret-up-fill"></i>' + formatter.format(change) + '</span>';
	} else if (change < 0) {
		icon = ' <span class="trendDown"> <i class="bi-caret-down-fill"></i> ' + formatter.format(change) + '</span>';
	}
	return icon;
}	

function colorRows() {
	var table = document.getElementById("teams-table");
	for (i = 0; i < table.rows.length; i++) {
		if (i == 0) {
			table.rows[i].style.setProperty("background-color", "#800000", "important");
			table.rows[i].style.color = "#FFD700";
		}
		else {
			if (i % 2 == 0) {
				table.rows[i].style.backgroundColor = "rgba(128, 0, 0, 0.2)";
			} else {
				table.rows[i].style.backgroundColor = "#fff";
			}
		}
	}
}

window.onload = function() {
	var xmlhttp = new XMLHttpRequest();
	var url = "/getRankings";
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
	xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		var mydata = JSON.parse(xmlhttp.responseText);
		var outstring = '';
		var i = 1;
		// looping through each key (team name) in the json file
		var week = 0;
		for (let key in mydata) {
			var teamElo = Math.round(JSON.parse(mydata[key]).currentRating);
			// we need to parse the information inside that key's entry since it's string type
			var hist = JSON.parse(mydata[key]).rankingHist;
			// we create an outstring by each row
			if (week == 0) {
				week = hist.length;
			}
			outstring +=
				"<tr><td class='teamRank'>" +
				i +
				getTrend(hist) +
				"</td><td>" +
				getIcon(key,'table-team-icon') +
				' ' +
				key +
				"</td><td>" +
				getRankIcon(teamElo, 'table-elo-icon')+
				' ' +
				teamElo +
				"</td></tr>";
			i++;
		}
		document.getElementById("gwlWeek").innerHTML += "Week " + week;
		document.getElementById("teams-table").innerHTML += outstring;
		// using loop to input data into top gopherwatch league teams table
		// we use the data from the "general" teams table
		for (i = 1; i <= 4; i++) {
			var refTable = document.getElementById("teams-table");
			var topTable = document.getElementsByClassName("gwl-top-teams")[0];
			if (i == 1) {
				topTable.innerHTML += "<div class='teamContainer'></div>".repeat(4);
			}
			var teams = document.getElementsByClassName("teamContainer");
			var teamName = refTable.rows[i].cells[1].innerHTML;
			// regex to get the team name by removing the img element from the html line
			teamName = teamName.replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g,"");
			var topElo = refTable.rows[i].cells[2].innerHTML;
			topElo = topElo.replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g,"");
			// adding team info for each row
			teams[i-1].innerHTML += 
				"<div class='iconContainer'>" + getIcon(teamName, 'top-icon') + getBackground(teamName) + "</div>" +
				"<div class='rankContainer'><h2 class='top-team-rank'>#" + i + "</h2></div>" + 
				"<div class='infoContainer'><p class='top-team-name'>" + teamName + "</p><p class='top-elo'>" + 
				getRankIcon(topElo, 'top-elo-icon') + topElo + "</p></div>";
		}
		colorRows();
	}
	}
};