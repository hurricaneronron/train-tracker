// Initialize Firebase
var config = {
	apiKey: "AIzaSyAh7GiagXoghh5iWpNqf3GKSYFSbEp5qi8",
	authDomain: "train-tracker-7c6d2.firebaseapp.com",
	databaseURL: "https://train-tracker-7c6d2.firebaseio.com",
	projectId: "train-tracker-7c6d2",
	storageBucket: "train-tracker-7c6d2.appspot.com",
	messagingSenderId: "611937650158"
}
firebase.initializeApp(config)

var database = firebase.database()

// current time
setInterval( function( ) {
  $('#current-time').text("Current Time: "+moment( ).format("HH:mm")+"")
}, 100)

// click function
$("#submit-btn").on("click" , function( ) {

  event.preventDefault( )

  // input values
  var trainName= $('#train-name').val( ).trim( )
  var destination = $('#destination').val( ).trim( )
  var firstTrain = $('#first-train').val( ).trim( )
  var frequency = $('#frequency').val( ).trim( )

  // push to database 
  database.ref( ).push({
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
  })

  $("input").val( " " )
})

// when new element is added
database.ref( ).on("child_added", function( snap ) {
  var trainName = snap.val( ).trainName
  console.log("New Train Name: "+trainName+"")
  var destination = snap.val( ).destination
  console.log("New Destination: "+destination+"")
  var firstTrain = snap.val( ).firstTrain
  console.log("New First Train: "+firstTrain+"")
  var frequency = parseInt(snap.val( ).frequency)
  console.log("New Frequency: "+frequency+"")

  // math
  var currentTime = moment( ).unix( )
  console.log("Current Time: "+currentTime+"")

  var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years")

  var timeDiff = moment().diff(moment(firstTrainConverted), "minutes")
    console.log("Time Difference: " + timeDiff)

  var remainder = timeDiff % frequency
  console.log("Remainder: "+remainder+"")

  var minutesAway = (frequency - remainder)
  console.log("Minutes Away: "+minutesAway+"")

  var nextArrival = moment( ).add(minutesAway, 'minutes')
  console.log("Next Train: "+nextArrival+"")

  // add to table
  $("#train-data").append("<tr> <td>"+trainName+"</td> <td>"+destination+"</td> <td>"+frequency+"</td> <td>"+moment(nextArrival).format('HH:mm')+"</td> <td>"+minutesAway+"</td> </tr>")
},

function(errorObject){
    console.log("The Read failed: " + errorObject.code)
})
