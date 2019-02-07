(function () {

    var url;

    if (document.title.includes("House")) {
        url = "https://api.myjson.com/bins/j83do";
        //        url = "https://api.propublica.org/congress/v1/113/house/members.json";
    }

    if (document.title.includes("Senate")) {
        url = "https://api.myjson.com/bins/1eja30";
        //         url= "https://api.propublica.org/congress/v1/113/senate/members.json";
    }
    fetch(url)

        //    fetch(url, {
        //            headers: new Headers({
        //                'X-API-Key': 'JlFF4jpgMcRs9zuQsaUDjWkjbRE3KL1b3H2cs0Kl '
        //            })
        //        })
        .then(response => response.json())
        .then(realData => {



            main(realData);
        })




})()


function main(data) {

    let statistics = {
        "numR": 0,
        "numD": 0,
        "numI": 0,
        'numTotal': 0,
        "votedWithPartyR": 0,
        "votedWithPartyD": 0,
        "votedWithPartyI": 0,
        "votedWithPartyTotal": 0,
        "leastEngaged": [],
        "mostEngaged": [],
        "bestLoyal": [],
        "worstLoyal": []

    }


    let members = data.results[0].members;

    //Function Calls
    calculateStatistics();

    if (document.title.includes('Attendance')) {
        engaged("least");
        engaged("most");
    }
    if (document.title.includes('Loyalty')) {
        loyal("best");
        loyal("worst");
    }
    putElements();
    //console.log(statistics);





    function calculateStatistics() {
        for (var i = 0; i < members.length; i++) {

            statistics.numTotal++;

            let everyMember = data.results[0].members[i];

            //            console.log(typeof (everyMember));

            switch (everyMember.party) {
                case "R":
                    statistics.numR++;
                    break;
                case "D":
                    statistics.numD++;
                    break;
                case "I":
                    statistics.numI++;
                    break;
            }

        } // no we calculated the total amount - next we will calculate the votes with party 

        var Reps = [];
        var Dems = [];
        var Inds = [];
        var Total = [];
        for (var i = 0; i < members.length; i++) {

            let everyMember = data.results[0].members[i];


            Total.push(everyMember.votes_with_party_pct);


            switch (everyMember.party) {
                case "R":
                    Reps.push(everyMember.votes_with_party_pct); // basically we add all the percentages in an array, we build the sum and divide it by the amount of members 
                    break;
                case "D":
                    Dems.push(everyMember.votes_with_party_pct);
                    break;
                case "I":
                    Inds.push(everyMember.votes_with_party_pct);
                    break;

            }

        }

        statistics.votedWithPartyR = Math.round(addElements(Reps) / statistics.numR);
        statistics.votedWithPartyD = Math.round(addElements(Dems) / statistics.numD);
        statistics.votedWithPartyTotal = Math.round(addElements(Total) / statistics.numTotal);

        if (statistics.numI == 0) {
            statistics.votedWithPartyI = 0;
        } else {
            statistics.votedWithPartyI = Math.round(addElements(Inds) / statistics.numI);
        }
    }

    function addElements(recievedArray) {
        //    if (recievedArray.length != 0) {

        var sum = recievedArray.reduce((total, amount) => total + amount);
        //    console.log(sum);
        return sum;
        //    } else return 0;

    }

    function putElements() {

        document.getElementById('Rep').innerHTML = statistics.numR;
        document.getElementById('Dem').innerHTML = statistics.numD;
        document.getElementById('Ind').innerHTML = statistics.numI;
        document.getElementById('Total').innerHTML = statistics.numTotal;
        document.getElementById('Rep1').innerHTML = statistics.votedWithPartyR + "%";
        document.getElementById('Dem1').innerHTML = statistics.votedWithPartyD + "%";
        document.getElementById('Ind1').innerHTML = statistics.votedWithPartyI + "%";
        document.getElementById('Total1').innerHTML = statistics.votedWithPartyTotal + "%";

    }









    function engaged(direction) {

        if (direction == "least") {
            var sortedArray = members.sort(function (a, b) {
                return b.missed_votes - a.missed_votes //we sort the members based on how many votes they missed 
            });

        } else {
            var sortedArray = members.sort(function (a, b) {
                return a.missed_votes - b.missed_votes
            });
        }

        // take only 10% from sortedArray now we know how many are 10%
        var checkedPrecent = sortedArray.length / 10;

        checkedPrecent = checkedPrecent.toFixed(0); // in checkedPrecent we save the number that is 10%



        // save in statistics this 10%

        var tenPrcArray = [];
        for (i = 0; i < checkedPrecent; i++) {
            tenPrcArray.push(sortedArray[i]);
        }



        if (direction == "least") {
            statistics.leastEngaged = tenPrcArray;
            var leastTable = document.getElementById('leastTable');
            buildSmallTable(statistics.leastEngaged, leastTable);
        } else {
            statistics.mostEngaged = tenPrcArray;
            var mostTable = document.getElementById("mostTable");
            buildSmallTable(statistics.mostEngaged, mostTable);
        }


        function buildSmallTable(smallArray, whereToPut) {

            for (var k = 0; k < smallArray.length; k++) {
                var link = "<a href='" + smallArray[k].url + "'>" + smallArray[k].first_name + " " + smallArray[k].last_name + "</a>";
                var newRow = document.createElement("tr");
                newRow.insertCell().innerHTML = link;
                newRow.insertCell().innerHTML = smallArray[k].missed_votes;
                newRow.insertCell().innerHTML = smallArray[k].missed_votes_pct + "%";
                whereToPut.append(newRow);

            }
        }
    }



    function loyal(direction) {

        if (direction == "worst") {
            var sortedArray = members.sort(function (a, b) {
                return a.votes_with_party_pct - b.votes_with_party_pct //we sort the members based on how many votes they missed 
            });
        } else {
            var sortedArray = members.sort(function (a, b) {
                return b.votes_with_party_pct - a.votes_with_party_pct
            });
        }

        // take only 10% from sortedArray
        var checkedPrecent = sortedArray.length / 10;
        checkedPrecent = checkedPrecent.toFixed(0);
        // save in statistics this 10%

        var tenPrcArray = [];
        for (i = 0; i < checkedPrecent; i++) {
            tenPrcArray.push(members[i]);
        }

        if (direction == "worst") {
            statistics.worstLoyal = tenPrcArray;
            var worstTable = document.getElementById("worstTable");
            buildSmallTable(statistics.worstLoyal, worstTable);
        } else {
            statistics.bestLoyal = tenPrcArray;
            var bestTable = document.getElementById("bestTable");
            buildSmallTable(statistics.bestLoyal, bestTable);
        }

        function buildSmallTable(smallArray, whereToPut) {

            for (var k = 0; k < smallArray.length; k++) {
                var link = "<a href='" + smallArray[k].url + "'>" + smallArray[k].first_name + " " + smallArray[k].last_name + "</a>";
                var numberPartyVotes = ((smallArray[k].total_votes - smallArray[k].missed_votes) * smallArray[k].votes_with_party_pct) / 100;

                //                console.log(Math.round(numberPartyVotes));
                var newRow = document.createElement("tr");
                newRow.insertCell().innerHTML = link;
                newRow.insertCell().innerHTML = Math.round(numberPartyVotes);
                newRow.insertCell().innerHTML = smallArray[k].votes_with_party_pct + "%";
                whereToPut.append(newRow);
            }
        }
    }
}
