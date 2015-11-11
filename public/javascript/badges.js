/**
 * Created by robertrock on 11/10/15.
 */
$(document).ready(function(){
    Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");

    var profileButton = document.getElementById("profileName");
    profileButton.innerHTML += " "
    profileButton.innerHTML += Parse.User.current().get("username");

    var Badge = Parse.Object.extend("Badges");

    queryBadges();


    function queryBadges(){

        var query = new Parse.Query(Badge);

        var names = [];
        var descriptions = [];
        var dates = [];
        var creators = [];
        var datesRegex = [];

        query.find({
            success: function(results){
                /* captured all categories, now separate them into respective rows
                 *   in the table
                 */
                for(var i=0; i < results.length; i++){
                    names[i] = results[i].get('badgeName');
                    console.log("createdAt:  " + results[i].createdAt);
                    dates[i] = results[i].createdAt.toString();
                    var createdAtRegex = dates[i].match(/\b(?:(?:Mon)|(?:Tues?)|(?:Wed(?:nes)?)|(?:Thur?s?)|(?:Fri)|(?:Sat(?:ur)?)|(?:Sun))(?:day)?\b[:\-,]?\s*[a-zA-Z]{3,9}\s+\d{1,2}\s*,?\s*\d{4}/);
                    //console.log("createdAtRegex: " + createdAtRegex);
                    datesRegex[i] = createdAtRegex;
                    //console.log("datesRegex: " + datesRegex[i]);

                    console.log("createdBy: " + results[i].get("createdBy").id);
                    creators[i] = results[i].get("createdBy").id;

                    console.log("description: " + results[i].get("badgeDescription"));
                    descriptions[i] = results[i].get("badgeDescription");

                    var table = document.getElementById("tableBody");
                    $(".success").show();
                    var row = table.insertRow(0);
                    var cellObjectId = row.insertCell(0);
                    var cellCreatedAt = row.insertCell(1);
                    var cellCreatedBy = row.insertCell(2)
                    var cellBadgeName = row.insertCell(3);
                    var cellBadgeDescription = row.insertCell(4);
                    var cellEditButton = row.insertCell(5);
                    var cellDeleteButton = row.insertCell(6);

                    cellObjectId.innerHTML = results[i].id;
                    cellCreatedAt.innerHTML = datesRegex[i];
                    cellCreatedBy.innerHTML = creators[i];
                    cellBadgeName.innerHTML = names[i];
                    cellBadgeDescription.innerHTML = descriptions[i];
                    cellEditButton.innerHTML = "<button class='editButton table-button'>Edit</button>";
                    cellDeleteButton.innerHTML = "<button class='deleteButton table-button'>Delete</button>";
                }
                return names;
            }, error: function(error){
                res.send(error.message);
            }
        });
    }



    $("#badge-form").submit(function(event) {
        event.preventDefault();
        var newBadge = new Badge();
        var user = Parse.User.current();
        var badgeName = $("#badgeNameInput").val();
        var badgeDescription = $("#badgeDescriptionInput").val();
        var badgeACL = new Parse.ACL();
        /* Categories should only be able to be added via
         *  setRoleWriteAccess(TeamLeader, true) and then also Admin
         */
        badgeACL.setReadAccess(user, true);
        badgeACL.setWriteAccess(user, true);
        badgeACL.setPublicReadAccess(true);
        badgeACL.setPublicWriteAccess(false);

        newBadge.set("badgeName", badgeName);
        newBadge.set("badgeDescription", badgeDescription);
        newBadge.set("createdBy", user);
        newBadge.setACL(badgeACL);

        // get input file & separate information needed
        var fileIn = $("#badge-img-input")[0];
        var filePath = $("#badge-img-input").val();
        // we must 'escape' the backslash, ironically w/ a backslash
        var fileName = filePath.split("\\").pop();

        if(fileIn.files.length > 0){ // this means we in fact have some file
            var file = fileIn.files[0];
            var parseFile = new Parse.File(fileName, file);
            parseFile.save({
                success: function(){
                    /* save file to Parse first this way we can
                     *   reference it below when relating this file
                     *   to a category
                     */
                }, error: function(error){
                    console.log(error.message);
                }
            }).then(function(inFile){
                /* this then function is the 'below' referenced above,
                 *   here we are now relating the file to a category,
                 *   creating the relationship btwn the two.
                 */
                newBadge.set("badgeImg", inFile);
                newBadge.save({
                    success: function(){
                        alert("Badge was successfully saved!");
                        queryBadges();
                    }, error: function(error){
                        console.log(error.message);
                    }
                });
            });
        }
        else{ // there is NO file to be input, save just the category
            newBadge.save().then(function(newBadge) {
                /* category was successfully saved.  Now display
                 *  the same page with table populated w/ results
                 */
                alert("successful save by - " + Parse.User.current().get("username") );
                queryBadges();
            }, function(error) {
                alert('badges', { flash: error.message });
            });
        }
    });

































});