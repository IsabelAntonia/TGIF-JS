// anonymous self-invoking function 

(function () {

    var url;

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
            data = realData;
            createOptionElements();
            alternativeFilter();
        })

})()


function alternativeFilter() {
    let mySelect = document.getElementById("stateId");
    let allMembers = data.results[0].members;
    let putDataHere = document.querySelector('#putDataHere');
    putDataHere.innerHTML = "";

    var checkedCheckbox = Array.from(document.querySelectorAll('input[name=party]:checked')).map(arrayElement => arrayElement.value); 
    var filteredMembers = allMembers.filter(everyMember => { 
    var partyFilter = checkedCheckbox.includes(everyMember.party) || checkedCheckbox.length == 0;
    var stateFilter = mySelect.value == everyMember.state || mySelect.value == 'ALL';

    return partyFilter && stateFilter;
    });

    putFilteredPoliticians(filteredMembers);
}


function putFilteredPoliticians(theFiltered) {
    if (theFiltered.length === 0) {
        document.getElementById("noResults").innerHTML = "No Results";
    } else {
        theFiltered.forEach(member => {
            var newRow = document.createElement("tr");
            var names = [member.first_name, member.middle_name, member.last_name]
            var full_name = names.join(" ");
            var link = "<a href=\"" + member.url + "\"> " + full_name + "</a>";

            newRow.insertCell().innerHTML = link;
            newRow.insertCell().innerHTML = member.party;
            newRow.insertCell().innerHTML = member.state;
            newRow.insertCell().innerHTML = member.seniority;
            newRow.insertCell().innerHTML = member.votes_with_party_pct + "%";

            document.getElementById("putDataHere").append(newRow);
        });

    }

}

function createOptionElements() {

    let mySelect = document.getElementById("stateId");
    var stateNames = []
    let allMembers = data.results[0].members;

    for (i = 0; i < allMembers.length; i++) {
        if (!stateNames.includes(allMembers[i].state)) {
            stateNames.push(allMembers[i].state)
        }

    }
    stateNames.sort();

    for (j = 0; j < stateNames.length; j++) {
        var newElement = document.createElement("option")
        newElement.innerHTML = stateNames[j]

        mySelect.append(newElement);
    }
}


let CheckboxR = document.querySelector("#partyR");
CheckboxR.addEventListener("click", alternativeFilter);

let CheckboxD = document.querySelector("#partyD");
CheckboxD.addEventListener("click", alternativeFilter);

let CheckboxI = document.querySelector("#partyI");
CheckboxI.addEventListener("click", alternativeFilter);

let mySelect = document.getElementById("stateId");
mySelect.addEventListener("change", alternativeFilter);
