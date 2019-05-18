// Initialize FIREBASE section _____________________________________ 
const firebaseConfig = {
    apiKey: "AIzaSyDuD9oSDJJg2W0-pXkANNk6iBo-XbHx8kQ",
    authDomain: "mission-control-5773f.firebaseapp.com",
    databaseURL: "https://mission-control-5773f.firebaseio.com",
    projectId: "mission-control-5773f",
    storageBucket: "mission-control-5773f.appspot.com",
    messagingSenderId: "473488087710",
    appId: "1:473488087710:web:95ff6ee01ce0a3e6"
};

firebase.initializeApp(firebaseConfig);
//Global Variables _____________________________________ 
//active = Values from Firebase dependent on ID
//card = Table location dependent on ID  
var database = firebase.database();
var activeID = "";
var activeName = "";
var activeOwner = "";
var activeStatus = "";
var activePriority = "";
var activeEstTime = "";
var activeTag = "";
var activeBrand = "";
var activeJobNumber = "";
var activeStakeholder = "";
var activeDescription = "";
var activeDueDate = "";
var activeResources = "";
var activeNotes = "";
var cardName = "";
var cardOwner = "";
var cardStatus = "";
var cardPriority = "";
var cardDueDate = "";

//On Click event to engage with Firebase section _____________________________________ 
$("#submit-btn").on("click", function (event) {
    event.preventDefault()
    var id = ""
    var name = "Unnamed Request";
    var owner = "Unassigned";
    var status = "New";
    var priority = "Normal";
    var estTime = "0h";
    var tag = "Strategy";
    var brand = $("#brand").val().trim();
    var jobNumber = $("#jobNumber").val().trim();
    var stakeholder = $("#stakeholder").val().trim();
    var description = $("#description").val().trim();
    var dueDate = $("#dueDate").val().trim();
    var resources = $("#resources").val().trim();
    var notes = $("#notes").val().trim();

    //Creating New Request in Firebase  _____________________________________ 
    var newRequest = {
        id: id,
        name: name,
        owner: owner,
        status: status,
        priority: priority,
        estTime: estTime,
        tag: tag,
        brand: brand,
        jobNumber: jobNumber,
        stakeholder: stakeholder,
        description: description,
        dueDate: dueDate,
        resources: resources,
        notes: notes
    };
    database.ref().push(newRequest);

    //Clear Inputs _____________________________________ 
    $("#brand").val("");
    $("#jobNumber").val("");
    $("#stakeholder").val("");
    $("#description").val("");
    $("#dueDate").val("");
    $("#resources").val("");
    $("#notes").val("");
});

//Write to table from FIREBASE on child add_____________________________________
database.ref().on("child_added", function (dataSnapshot) {
    var data = dataSnapshot.val();
    var id = dataSnapshot.key
    //Write push ID back to firebase child
    database.ref(id).update({
        id: id
    });
    //Fill out Table
    var tbody = $('tbody');
    var tRow = $("<tr>").attr("class", "req").attr("data-toggle", "modal").attr("data-target", ".bd-example-modal-xl");
    var idCol = $('<td>').text(id).attr("class", "id d-none");
    var nameCol = $('<td>').text(data.name).attr("class", "name");
    var ownerCol = $('<td>').text(data.owner).attr("class", "owner");
    var statusCol = $('<td>').text(data.status).attr("class", "status");
    var priorityCol = $('<td>').text(data.priority).attr("class", "priority");
    var estTimeCol = $('<td>').text(data.estTime).attr("class", "estTime");
    var brandCol = $('<td>').text(data.brand).attr("class", "brand");
    var dueDateCol = $('<td>').text(data.dueDate).attr("class", "dueDate");
    tRow.append(idCol, nameCol, ownerCol, statusCol, priorityCol, estTimeCol, brandCol, dueDateCol);
    tbody.append(tRow);
});
//Write to table from FIREBASE on child change_____________________________________
database.ref().on("child_changed", function (dataSnapshot) {
    if (activeName == "") {
        return
    } else {
        var newData = dataSnapshot.val();
        cardName.text(newData.name);
        cardOwner.text(newData.owner);
        cardStatus.text(newData.status);
        cardPriority.text(newData.priority);
        cardEstTime.text(newData.estTime);
        cardBrand.text(newData.brand);
        cardDueDate.text(newData.dueDate);
      
        console.log("check" + activeID)
        console.log(newData)
    }
});

//Modal Populate --NEEDS WORK --ALMOST THERE! --- Sets actives
$('.table').on("click", "tr", function () {
    activeID = $(this).children(".id").text()
    
    //sets destination for updated infor in the table
    cardName = $(this).children(".name");
    cardOwner = $(this).children(".owner");
    cardStatus = $(this).children(".status");
    cardPriority = $(this).children(".priority");
    cardEstTime = $(this).children(".estTime");
    cardBrand = $(this).children(".brand");
    cardDueDate = $(this).children(".dueDate");

//sets activre with data from firebase
    database.ref(activeID).once("value")
        .then(function (dataSnapshot) {
            var data = dataSnapshot.val();
            activeName = data.name;
            activeOwner = data.owner;
            activeStatus = data.status;
            activePriority = data.priority;
            activeEstTime = data.estTime;
            activeTag = data.tag;
            activeBrand = data.brand;
            activeJobNumber = data.jobNumber;
            activeStakeholder = data.stakeholder;
            activeDescription = data.description;
            activeDueDate = data.dueDate;
            activeResources = data.resources;
            activeNotes = data.notes;

            //Gets Child of Parent div -- Work around to <p> editable dynamic class issue
            $(".modalName").children("p").text(activeName);
            $(".modalOwner").children("p").text(activeOwner);
            $(".modalStatus").children("span").text(activeStatus);
            $(".modalPriority").children("p").text(activePriority);
            $(".modalEstTime").children("p").text(activeEstTime);
            $(".modalTag").children("p").text(activeTag);
            $(".modalBrand").children("p").text(activeBrand);
            $(".modalJobNumber").children("p").text(activeJobNumber);
            $(".modalStakeholder").children("p").text(activeStakeholder);
            $(".modalDescription").children("p").text(activeDescription);
            $(".modalDueDate").children("p").text(activeDueDate);
            $(".modalResources").children("a").text(activeResources);
            $(".modalNotes").children("p").text(activeNotes);
        });
});
$('#update').on("click", function () {
    console.log("update" + activeID)
    database.ref(activeID).update({
        name: $(".modalName").children("p").text(),
        owner: $(".modalOwner").children("p").text(),
        status: $(".modalStatus").children("span").text(),
        priority: $(".modalPriority").children("p").text(),
        estTime: $(".modalEstTime").children("p").text(),
        tag: $(".modalTag").children("p").text(),
        brand: $(".modalBrand").children("p").text(),
        jobNumber: $(".modalJobNumber").children("p").text(),
        stakeholder: $(".modalStakeholder").children("p").text(),
        description: $(".modalDescription").children("p").text(),
        dueDate: $(".modalDueDate").children("p").text(),
        resources: $(".modalResources").children("a").text(),
        notes: $(".modalNotes").children("p").text()
    });
});

//Modal <p> editable
function modalText() {
    var divHtml = $(this).html();
    var editableText = $("<textarea>").attr("rows","1").css({"resize":"none", "width": "100%"});
    editableText.val(divHtml);
    $(this).replaceWith(editableText);
    editableText.focus();
    editableText.blur(editableTextBlurred);
};

function editableTextBlurred() {
    var html = $(this).val();
    var viewableText = $("<p>");
    viewableText.html(html);
    $(this).replaceWith(viewableText);
    // setup the click event for this new div
    viewableText.click(modalText);
};
$(document).ready(function () {
    $("p").click(modalText);
});

//___________READ ONCE FOR ADDING TO INDIVIDUALS VIEWS