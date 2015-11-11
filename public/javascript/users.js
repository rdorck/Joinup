/**
 * Created by robertrock on 11/5/15.
 */

$(document).ready(function(){
    Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");

    var profileButton = document.getElementById("profileName");
    profileButton.innerHTML += " "
    profileButton.innerHTML += Parse.User.current().get("username");

    queryUsers();

    function queryUsers(){
        var query = new Parse.Query(Parse.User);
        query.addAscending("createdAt");
        query.find({
           success: function(userObjects){
               for(var i=0; i < userObjects.length; i++){
                   var table = document.getElementById("tableBody");
                   $(".success").show();
                   var row = table.insertRow(0);
                   var userIdCell = row.insertCell(0);
                   var usernameCell = row.insertCell(1);
                   var userEmailCell = row.insertCell(2);
                   var nameCell = row.insertCell(3);
                   var editButtonCell = row.insertCell(4);
                   var deleteButtonCell = row.insertCell(5);
                   userIdCell.innerHTML = userObjects[i].id;
                   usernameCell.innerHTML = userObjects[i].get("username");
                   userEmailCell.innerHTML = userObjects[i].get("email");
                   nameCell.innerHTML = userObjects[i].get("firstName") + " " + userObjects[i].get("lastName");
                   editButtonCell.innerHTML = "<button class='tableButton editUser-button'>Edit</button>";
                   deleteButtonCell.innerHTML = "<button class='tableButton reward-button'>Reward</button>";
               }
           }, error: function(error){
                console.log(error.message);
            }
        });

    }



});