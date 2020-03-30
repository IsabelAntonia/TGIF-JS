(function () {

    let url;

    if (document.title.includes("House")) {
        url = "https://api.myjson.com/bins/j83do";
    }

    if (document.title.includes("Senate")) {
        url = "https://api.myjson.com/bins/1eja30";
    }
    fetch(url)
        .then(response => response.json())
        .then(realData => {

            $('#loader').addClass("hide-loader");
            $('#content').addClass("show-content");
            main(realData);
        })
})()

function main(data) {

    let statisticsSmallTable = {

        "allRepublicans": 0,
        "allDemocrats": 0,
        "allIndependents": 0,
        "All": 0,
        "averageVotedWithPartyReps": 0,
        "averageVotedWithPartyDems": 0,
        "averageVotedWithPartyInds": 0,
        "averageVotedWithPartyTotal": 0

    }

    let statisticsBigTable = {

        "leastEngaged": 0,
        "mostEngaged": 0,
        "mostLoyal": 0,
        "leastLoyal": 0
    }

    let allPercentagesRep = [];
    let allPercentagesDem = [];
    let allPercentagesInd = [];
    let allPercentagesTotal = [];


    let allMembers = data.results[0].members

    // calculate the total
    for (let i = 0; i < allMembers.length; i++) {

        let everySingleMember = allMembers[i]

        statisticsSmallTable.All++;
        allPercentagesTotal.push(everySingleMember.votes_with_party_pct)

        switch (everySingleMember.party) {

            case "R":
                statisticsSmallTable.allRepublicans++;
                allPercentagesRep.push(everySingleMember.votes_with_party_pct);
                break;

            case "D":
                statisticsSmallTable.allDemocrats++;
                allPercentagesDem.push(everySingleMember.votes_with_party_pct);
                break;

            case "I":
                statisticsSmallTable.allIndependents++;
                allPercentagesInd.push(everySingleMember.votes_with_party_pct);

                break;
        }
    }

    statisticsSmallTable.averageVotedWithPartyReps = Math.round((addthePercentages(allPercentagesRep) / statisticsSmallTable.allRepublicans))
    statisticsSmallTable.averageVotedWithPartyDems = Math.round((addthePercentages(allPercentagesDem) / statisticsSmallTable.allDemocrats))


    if (statisticsSmallTable.allIndependents === 0) {
        statisticsSmallTable.averageVotedWithPartyInds = 0
    } else {
        statisticsSmallTable.averageVotedWithPartyInds = Math.round((addthePercentages(allPercentagesInd) / statisticsSmallTable.allIndependents))
    }

    statisticsSmallTable.averageVotedWithPartyTotal = Math.round((addthePercentages(allPercentagesTotal) / statisticsSmallTable.All))

    function addthePercentages(recievedArray) {

        let sum = recievedArray.reduce((acc, val) => {
            return acc + val
        })
        return sum;
    }

    document.getElementById('Rep').innerHTML = statisticsSmallTable.allRepublicans
    document.getElementById('Dem').innerHTML = statisticsSmallTable.allDemocrats
    document.getElementById('Ind').innerHTML = statisticsSmallTable.allIndependents
    document.getElementById('Total').innerHTML = statisticsSmallTable.All
    document.getElementById('Rep1').innerHTML = statisticsSmallTable.averageVotedWithPartyReps + "%";
    document.getElementById('Dem1').innerHTML = statisticsSmallTable.averageVotedWithPartyDems + "%";
    document.getElementById('Ind1').innerHTML = statisticsSmallTable.averageVotedWithPartyInds + "%";
    document.getElementById('Total1').innerHTML = statisticsSmallTable.averageVotedWithPartyTotal + "%";


    // function calls 

    if (document.title.includes('Attendance')) {
        engaged("least");
        engaged("most");
    }
    if (document.title.includes('Loyalty')) {
        loyal("least");
        loyal("most");
    }

    function engaged(direction) {
        
        if (direction == "least") {

            var sortedArray = allMembers.sort(function (a, b) {
                return b.missed_votes - a.missed_votes //we sort the members based on how many votes they missed 
            });


        } else {
            var sortedArray = allMembers.sort(function (a, b) {
                return a.missed_votes - b.missed_votes
            });
        }


        // next we calculate the number that is 10%

        var thisNumber = ((sortedArray.length / 10).toFixed(0))

        // no we take that number from the top of our sortedArray

        var finalArray = [];
        var oneArray = [];
        var restArray = [];

        // maybe there is one member who didn't make it into the list but has the same value as the last member int the list and therefore should also be included

        sortedArray.forEach(member => {

            if (finalArray.length < (thisNumber - 1)) {

                finalArray.push(member)
            } else if (finalArray.length == (thisNumber - 1)) {

                oneArray.push(member);
                finalArray.push(member);
            } else {

                restArray.push(member);
            }

        })

        restArray.forEach(item => {

            oneArray.forEach(element => {

                if (item.missed_votes == element.missed_votes) {

                    finalArray.push(item);
                }

            })
        })


        if (direction == "least") {
            statisticsBigTable.leastEngaged = finalArray;
            var leastTable = document.getElementById('leastTable');
            buildBigTable(statisticsBigTable.leastEngaged, leastTable);
        } else {
            statisticsBigTable.mostEngaged = finalArray;
            var mostTable = document.getElementById("mostTable");
            buildBigTable(statisticsBigTable.mostEngaged, mostTable);
        }

        function buildBigTable(smallArray, whereToPut) {

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

        if (direction == 'least') {

            var MysortedArray = allMembers.sort(function (a, b) {

                return a.votes_with_party_pct - b.votes_with_party_pct
            });
        } else {

            var MysortedArray = allMembers.sort(function (a, b) {
                return b.votes_with_party_pct - a.votes_with_party_pct

            })
        }

        // what is 10%?

        myNumber = (MysortedArray.length / 10).toFixed(0)

        var myFinalArray = [];
        var MyoneArray = [];
        var MyrestArray = [];

        MysortedArray.forEach(member => {

            if (myFinalArray.length < (myNumber - 1)) {

                myFinalArray.push(member)
            } else if (myFinalArray.length == (myNumber - 1)) {

                MyoneArray.push(member);
                myFinalArray.push(member);
            } else {

                MyrestArray.push(member);
            }
        })

        MyrestArray.forEach(item => {

            MyoneArray.forEach(element => {

                if (item.missed_votes == element.missed_votes) {
                    myFinalArray.push(item);
                }

            })
        })

        if (direction == 'least') {

            var worstTable = document.getElementById('worstTable')
            statisticsBigTable.leastLoyal = myFinalArray;
            buildTable(worstTable, statisticsBigTable.leastLoyal)
        } else {

            var bestTable = document.getElementById('bestTable')
            statisticsBigTable.mostLoyal = myFinalArray;
            buildTable(bestTable, statisticsBigTable.mostLoyal)
        }


        function buildTable(where, myArray) {

            for (var k = 0; k < myArray.length; k++) {
                var link = "<a href='" + myArray[k].url + "'>" + myArray[k].first_name + " " + myArray[k].last_name + "</a>";
                var numberPartyVotes = ((myArray[k].total_votes - myArray[k].missed_votes) * myArray[k].votes_with_party_pct) / 100;
                var newRow = document.createElement("tr");
                newRow.insertCell().innerHTML = link;
                newRow.insertCell().innerHTML = Math.round(numberPartyVotes);
                newRow.insertCell().innerHTML = myArray[k].votes_with_party_pct + "%";
                where.append(newRow);
            }

        }

    }

}
