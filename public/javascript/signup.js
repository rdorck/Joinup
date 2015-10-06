
$(document).ready(function() {
    Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");

    //function checkUserAvailability(username) {
    //    var User = Parse.User();
    //    var queryUsers = new Parse.Query(User);
    //    var taken = [];
    //    queryUsers.find({
    //       success: function(results){
    //           for(var i=0; i < results.length; i++){
    //               taken[i] = results[i].get('username');
    //               if(taken[i] != username){
    //                   console.log("it is available");
    //               }
    //               else{
    //                   return false;
    //               }
    //           }
    //       }, error: function(error){
    //            console.log(error.message);
    //        }
    //    });
    //}

    $("#signup-form").submit(function (event) {
        event.preventDefault();
        var newUser = new Parse.User();
        var username = $("#username").val();

        //if(checkUserAvailability(username)) {
            var pass = $("#password").val();
            var firstName = $("#fname").val();
            var lastName = $("#lname").val();
            var email = $("#email").val();
            var phone = $("#phone").val();
            var sex = $(".sex").val();

            newUser.set("username", username);
            newUser.set("password", pass);
            newUser.set("firstName", firstName);
            newUser.set("lastName", lastName);
            newUser.set("email", email);
            newUser.set("phone", phone);
            newUser.set("sex", sex);

            newUser.signUp().then(function(user) {
                res.redirect('/');
            }, function(error) {
                res.render('signup', { flash: error.message });
            });

        //}
        //else{
        //    alert("Sorry " + username + " is taken. Please choose a different username.");
        //}

    });

});