function getIcon(team, size) {
			str = "<img class=" + size +  " src='/img/" + team.replace(/-|\s/g,'') + ".png'></img>";
			return str;
}
		
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
		for (let key in mydata) {
			var teamElo = Math.round(JSON.parse(mydata[key]).currentRating);
			var hist = JSON.parse(mydata[key]).rankingHist;
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
				"</td><td>" +
				"</td></tr>";
			i++;
		}
		document.getElementById("teams-table").innerHTML += outstring;
		for (i = 1; i <= 4; i++) {
			var refTable = document.getElementById("teams-table");
			var topTable = document.getElementById("top-teams");
			if (i == 1) {
				document.getElementById("top-teams").innerHTML += '<tr></tr>'.repeat(4);
			}
			var team = refTable.rows[i].cells[1].innerHTML;
			team = team.replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g,"");
			var topElo = refTable.rows[i].cells[2].innerHTML;
			topTable.rows[1].innerHTML += "<td>" + getIcon(team, 'top-icon') + "</td>";
			topTable.rows[2].innerHTML += "<td class='top-team-rank'>#" + i + " </td>";
			topTable.rows[3].innerHTML += "<td class='top-team-name'>" + team + "<br>"  + topElo + "</td>";
			document.getElementsByClassName("table-elo-icon")[0].className = "top-elo-icon";
		}
	}
	}
};