// Initialize Firebase
var config = {
    apiKey: "AIzaSyCwj3nNjRTPn5PgTSa-rNyQzjCHSsekWDE",
    authDomain: "zane-bootcamp.firebaseapp.com",
    databaseURL: "https://zane-bootcamp.firebaseio.com",
    projectId: "zane-bootcamp",
    storageBucket: "zane-bootcamp.appspot.com",
    messagingSenderId: "486463334849"
};
firebase.initializeApp(config);

const DATABASE = firebase.database();
const ref = DATABASE.ref();

function pullData() {
    ref.on('child_added', function (snapshot) {
        let child = snapshot.val();

        let newRow = $('<tr>').html(
            `
                        <th scope="row">${child.name}</th>
                        <td>${child.destination}</td>
                        <td>${child.frequency}</td>
                        <td id="nextTrain">${displayNext(child.firstTrain, child.frequency)}</td>
                        <td id="howLong">${howLongtoNext(child.firstTrain, child.frequency)} minutes</td>
                        <td><button class="btn btn-danger delete" id="${snapshot.key}">X</button></td>
                    `
        );

        newRow.attr('data-id', snapshot.key);

        $('#table-data').append(newRow);
    });

}

$(document).ready(function () {
    $('#submit-button').on('click', function () {
        event.preventDefault();

        let name = $('#trainName').val();
        let destination = $('#destination').val();
        let frequency = $('#frequency').val();
        let firstTrain = $('#firstTrain').val();
        console.log("Train name: " + name);
        console.log(`Train destination: ${destination}`);
        console.log(`Train frequency: ${frequency} minutes`);
        console.log(`Train first time: ${firstTrain}`);
        ref.push({
            name: name,
            destination: destination,
            frequency: frequency,
            firstTrain: firstTrain
        });
    });

    pullData();

});

$(document).on('click', '.delete', function () {
    let id = $(this).attr('id');
    $(this).parent().parent().remove();

    DATABASE.ref().child(id).remove();
});

function getNextTrain(firstTrain, freq) {
    let trainMoment = moment(firstTrain, "HH:mm").format("HHmm");
    let nowMoment = moment().format("HHmm");
    console.log("Now: " + nowMoment);
    console.log("Current train: " + trainMoment);
    let train = parseInt(trainMoment);
    let now = parseInt(nowMoment);
    while (train < now) {
        train += parseInt(freq);

    }

    newTrain = moment(train, "HHmm");
    console.log(newTrain);
    return newTrain;


}

function howLongtoNext(firstTrain, freq) {
    let currentTrain = getNextTrain(firstTrain, freq);
    let now = moment();
    return currentTrain.diff(now, 'minutes');

}

function displayNext(firstTrain, freq) {
    let currentTrain = getNextTrain(firstTrain, freq);
    return currentTrain.format("hh:mm a");
}