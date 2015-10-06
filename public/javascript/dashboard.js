$(document).ready(function(){
    Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");
    var userQuery = new Parse.Query(Parse.User);

    queryUsers();

    function queryUsers() {
        userQuery.ascending("createdAt");
        var userArray = [];
        var userEmails = [];
        userQuery.find({
            success: function(users){
                for(var i=0; i < users.length; i++){
                    userArray[i] = users[i].get("username");
                    userEmails[i] = users[i].get("email");
                    var table = document.getElementById("tableBody");
                    $(".success").show();
                    var row = table.insertRow(0);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    cell1.innerHTML = i;
                    cell2.innerHTML = userArray[i];
                    cell3.innerHTML = userEmails[i];
                    cell4.innerHTML = 100;
                    cell5.innerHTML = "<button class='reward-button'>Reward</button>";
                }
                return userArray;
            }, error: function(error){
                console.log(error.message);
            }
        });
    }


});