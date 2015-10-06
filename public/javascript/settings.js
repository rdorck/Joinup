
$(document).ready(function(){
    Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");

    var User = Parse.User;
    queryUsers();

    function queryUsers(){
        var i = 0;
        var query = new Parse.Query(User);
        query.descending("createdAt"); //displays results w/ most recently added on top
        var users = [];
        query.find({
            success: function(results){
                for(var i=0; i < results.length; i++){
                    users[i] = results[i].get('username');
                    var select = document.getElementById("userSelector");
                    select.options[select.options.length] = new Option(users[i], users[i]);
                }
                select.options[select.options.length] = new Option(" ", " ");
                return users;
            }, error: function(error){
                res.send(error.message);
            }
        });
    }




});