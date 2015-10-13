
$(document).ready(function(){
    Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");
    var Category = Parse.Object.extend("Category");
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
            profileHeader.innerHTML = Parse.User.current().get("username")+"'s" + " Profile";
        }
    }

    function recentlyAdded(){
        var holder = [];
        var queryCatgory = new Parse.Query(Category);
        queryCatgory.ascending("createdAt");
        queryCatgory.find({
            success: function(results){
                for(var i=0; i < results.length; i++){
                    holder[i] = results[i].get('categoryName');
                    var para = document.getElementById("recentlyAddedGame");
                    para.innerHTML = holder[i];
                }
            }, error: function(error){
                console.log(error.message);
            }
        });
    }

    /* Should query for all games (categories) they are required to play & have played.
     *  These would be declared from a TeamLeader Role.
     */
    //function getGames(){
    //
    //}

    function findUsername(objId){
        var array = [];
        var queryUser = new Parse.Query(Parse.User);
        queryUser.get(objId);
        queryUser.find({
           success: function(objResults){
               for(var k=0; k < objResults.length; k++){
                   array[k] = objResults[k].get('username');
                   console.log("array: " + array[k]);
                   var table = document.getElementById("tableFriend");
                   $(".success").show();
                   var row = table.insertRow(0);
                   var cell1 = row.insertCell(0);
                   var cell2 = row.insertCell(1);
                   var cell3 = row.insertCell(2);
                   var cell4 = row.insertCell(3);
                   var cell5 = row.insertCell(4);
                   cell1.innerHTML = objId;
                   cell2.innerHTML = array[k];
                   cell3.innerHTML = 100;
                   cell4.innerHTML = "<button class=' tableButton messageButton'>Message</button>";
                   cell5.innerHTML = "<button class='tableButton challengeButton'>Challenge</button>";
               }
               return array;
           }, error: function(error){
                console.log(error.message);
            }
        });
    }

    /*
     * Get all of our friends and have interaction options
     */
    function getFriends(){
        var friendArray = [];
        var queryFriend = new Parse.Query(Friend);
        queryFriend.equalTo("from", Parse.User.current());
        queryFriend.find({
            success: function(results){
                console.log("Friend objectId: " + results[0].id);
                for(var i=0; i < results.length; i++){
                    friendArray[i] = results[i].get('to');
                    console.log("friendArray[i] objectId: " + friendArray[i].id);
                    findUsername(friendArray[i].id);
                }
            }, error: function(error){
                console.log(error.message);
            }
        });
    }

});