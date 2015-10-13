$(document).ready(function(){
    Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");
    //Mailgun.initialize('sandbox11783fbada334d4a825cde853cce3717.mailgun.org', 'key-0aeded91185230fc8a83b13b4936fd3b');
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
                    var cell6 = row.insertCell(5);
                    cell1.innerHTML = users[i].id;
                    cell2.innerHTML = userArray[i];
                    cell3.innerHTML = userEmails[i];
                    cell4.innerHTML = 100;
                    cell5.innerHTML = "<button class='tableButton addFriend-button'>+ Friend</button>";
                    cell6.innerHTML = "<button class='tableButton reward-button'>Reward</button>";
                }
                return userArray;
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