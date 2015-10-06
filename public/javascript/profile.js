
$(document).ready(function(){
    Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");
    var Friend = Parse.Object.extend("Friend");
    //function getBadges(){
    //    var displayArray = [];
    //    $.getJSON("json/HR_badges.json", function(data){
    //        var badges = [];
    //        $.each(data, function(key, val){
    //            badges.push(key + " : " + val);
    //        });
    //        for(var i=0; i < badges.length; i++){
    //            displayArray[i] = badges[i].get('title');
    //            var table = document.getElementById("tableBody");
    //            $(".success").show();
    //            var row = table.insertRow(0);
    //            var cell1 = row.insertCell(0);
    //            var cell2 = row.insertCell(1);
    //            var cell3 = row.insertCell(2);
    //            var cell4 = row.insertCell(3);
    //            var cell5 = row.insertCell(4); // edit
    //            var cell6 = row.insertCell(5); // delete
    //            cell1.innerHTML = i;
    //            cell2.innerHTML = "name";
    //            cell3.innerHTML = badges[i];
    //            cell4.innerHTML = "pic";
    //            cell5.innerHTML = "<button>Edit</button>";
    //            cell6.innerHTML = "<button class='deleteButton'>Delete</button>";
    //        }
    //    });
    //
    //}

    checkCurrentLogin();
    getFriends();

    function checkCurrentLogin(){
        if(Parse.User.current()){
            var profileHeader = document.getElementById("current-user");
            $("#current-user").html(Parse.User.current().get("username")+"'s" + " Profile");
            profileHeader.innerHTML = Parse.User.current().get("username")+"'s" + " Profile";
        }
    }


    /* Should query for all games (categories) they are required to play & have played.
     *  These would be declared from a TeamLeader Role.
     */
    //function getGames(){
    //
    //}

    /*
     * Get all of our friends and have interaction options
     */
    function getFriends(){
        var friendArray = [];
        var names = [];
        var queryFriend = new Parse.Query(Friend);
        queryFriend.equalTo("from", Parse.User.current());
        queryFriend.find({
            success: function(results){
                console.log("queryFriend results objectId: " + results[0].id);

                queryFriend.get(results[0].id, {
                    success: function(object){
                        for(var i=0; i < results.length; i++){
                            friendArray[i] = results[i].get('to');
                            names[i] = object[i];
                            console.log("friendArray[i] objectId: " + friendArray[i].id);

                            var table = document.getElementById("tableFriend");
                            $(".success").show();
                            var row = table.insertRow(0);
                            var cell1 = row.insertCell(0);
                            var cell2 = row.insertCell(1);
                            var cell3 = row.insertCell(2);
                            var cell4 = row.insertCell(3);
                            var cell5 = row.insertCell(4);
                            cell1.innerHTML = friendArray[i].id;
                            cell2.innerHTML = names[i];
                            cell3.innerHTML = 100;
                            cell4.innerHTML = "<button class='messageButton'>Message</button>";
                            cell5.innerHTML = "<button class='challengeButton'>Challenge</button>";
                        }
                    }, error: function(error){
                        console.log(error.message);
                    }
                });
            }, error: function(error){
                console.log(error.message);
            }
        });
    }

});