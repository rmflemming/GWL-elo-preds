function loadRankings(data) {
	var mydata = JSON.parse(data);
	var outstring = '';
	for (var i = 0; i < mydata.length; i++) {
		outstring +=
			"<tr><td>" +
            (i+1) +
            "</td><td>" +
            mydata[i] +
            "</td><td>" +
            mydata[i].currentRating +
            "</td><td>" +
            "</td></tr>";
	}
	document.getElementById("contactTable").innerHTML += outstring;
}