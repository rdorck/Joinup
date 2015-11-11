$(document).ready(function(){
    Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");
    //Mailgun.initialize('sandbox11783fbada334d4a825cde853cce3717.mailgun.org', 'key-0aeded91185230fc8a83b13b4936fd3b');
    var userQuery = new Parse.Query(Parse.User);

    var profileButton = document.getElementById("profileName");
    profileButton.innerHTML += " "
    profileButton.innerHTML += Parse.User.current().get("username");

    var allUsers = [];

    queryUsers();
    topPerformer();
    sosPerformer();

    var userScores = [];

    function queryUsers() {
        userQuery.ascending("createdAt");
        var userArray = [];
        var userEmails = [];
        var holder = 0;
        userQuery.find({
            success: function(users){
                for(var i=0; i < users.length; i++){
                    allUsers[i] = users[i];
                    console.log(allUsers[i].id);
                    //queryScore(allUsers[i]);

                    userArray[i] = users[i].get("username");
                    userEmails[i] = users[i].get("email");

                    var table = document.getElementById("tableBody");
                    $(".success").show();
                    var row = table.insertRow(0);
                    var cellUserId = row.insertCell(0);
                    var cellUsername = row.insertCell(1);
                    var cellEmail = row.insertCell(2);
                    var cellVerified = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);
                    cellUserId.innerHTML = users[i].id;
                    cellUsername.innerHTML = userArray[i];
                    cellEmail.innerHTML = userEmails[i];
                    cellVerified.innerHTML = users[i].get("emailVerified");
                    cell5.innerHTML = "<button class='tableButton addFriend-button'>+ Friend</button>";
                    cell6.innerHTML = "<button class='tableButton reward-button'>Reward</button>";
                }

            }, error: function(error){
                console.log(error.message);
            }
        });
    }


    function queryScore(userId){
        var scoreObject = Parse.Object.extend("Score");
        var queryScore = new Parse.Query(scoreObject);
        queryScore.equalTo("user", userId);
        queryScore.find({
            success: function(player){
                for(var i=0; i < player.length; i++) {
                    console.log(player[i].get("score"));
                }
            }, error : function(error){
                console.log(error.message);
            }
        });
        //if(queryScore.notEqualTo("user", userId)){
        //    console.log("no score for user");
        //}
    }

    function topPerformer(){
        var html = document.getElementById("topUsername");
        var Score = Parse.Object.extend("Score");
        var queryScore = new Parse.Query(Score);
        queryScore.descending("score");
        queryScore.find({
            success: function(objects){
                console.log(objects[0].attributes);
                html.innerHTML = objects[0].get("name");
                topPerformerUser = objects[0].get("user");
            }, error: function(error){
                console.log(error.message);
            }
        });
    }

    function sosPerformer(){
        var html = document.getElementById("sosUsername");
        var Score = Parse.Object.extend("Score");
        var queryScore = new Parse.Query(Score);
        queryScore.ascending("score");
        queryScore.find({
            success: function(objects){
                console.log(objects[0].attributes);
                html.innerHTML = objects[0].get("name");
            }, error: function(error){
                console.log(error.message);
            }
        });
    }


    function rewardEmail(dest){
        console.log("Reward email is set to go to " + dest);
        Parse.Config.get().then(function(config){
            var badge = config.get("HR_BadgeLevel1");
            var img = config.get("levelOneImg");
            console.log("Badge: " + badge.achievement + " " + badge.imgURL);
            var congrats = window.confirm(img + " " + "Congratulations on rewarding " + badge.title + " for " + badge.achievement);
        });
        //Mailgun.sendEmail({
        //    to: "rdrock@udel.edu",
        //    from: "Mailgun@CloudCode.com",
        //    subject: "You've been Rewarded !",
        //    text: "Someone has recognized the hard work you have been putting in recently.  Here is a reward to thank you! Keep up the great work!"
        //}, {
        //    success: function(httpResponse) {
        //        console.log(httpResponse);
        //        response.success("Email sent!");
        //    },
        //    error: function(httpResponse) {
        //        console.error(httpResponse);
        //        response.error("Uh oh, something went wrong");
        //    }
        //});
    }

    $("table").on('click', '.reward-button', function(e){
        e.preventDefault();
        // deletes the specified row from table
        var table = document.getElementById("tableBody");
        var row = this.parentNode.parentNode;
        var to = row.parentNode.childNodes;
        var rewarded = row.parentNode.removeChild(row);

        var rewardedDestination = rewarded.cells[1].innerText;

        rewardEmail(rewardedDestination); //function call to destroy desired object

    });

    $("table").on('click', '.addFriend-button', function(e){
        e.preventDefault();
        var Friend = Parse.Object.extend("Friend");
        var user = Parse.User.current();
        var newFriend = new Friend();
        var row = this.parentNode.parentNode;
        var friended = row.parentNode.removeChild(row);
        var friendedUsername = friended.cells[1].innerText;
        console.log("friendUsername: " + friendedUsername);

        var queryUser = new Parse.Query(Parse.User);
        queryUser.equalTo("username", friendedUsername);
        queryUser.find({
            success: function(results){
                console.log("You added " + results[0].id + " !");
                newFriend.set("from", user);
                newFriend.set("to", results);
                var friendACL = new Parse.ACL();
                friendACL.setReadAccess(results[0].id, true);
                friendACL.setReadAccess(Parse.User.current(), true);
                friendACL.setPublicReadAccess(true);
                friendACL.setWriteAccess(results[0].id, true);
                friendACL.setWriteAccess(Parse.User.current(), true);
                newFriend.setACL(friendACL);
                var role = new Parse.Role("Friend", friendACL);
                newFriend.save({
                    success: function(friend){
                        console.log(friend + " is now your friend! Send them a message or start challenging them!");
                    }, error: function(error){
                        console.log(error.message);
                    }
                });
            }, error: function(error){
                console.log(error.message);
            }
        });

    });

});