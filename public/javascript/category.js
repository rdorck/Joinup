/**
 * Created by robertrock on 9/13/15.
 */

$(document).ready(function(){
    Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");
    var Category = Parse.Object.extend('Category');
    var SubCategory = Parse.Object.extend('SubCategory');
    queryCategories();

    /* A function for the page's initial loading & after
     *   saving an object to Category that will display all of the
     *   current categories in the database in the table.
     */
    function queryCategories(){
        var i = 0;
        var query = new Parse.Query(Category);
        query.ascending("createdAt"); //displays results w/ most recently added on top
        // only displays categories current user has created.
        //query.equalTo("createdBy", Parse.User.current());
        var names = [];
        query.find({
            success: function(results){
                /* captured all categories, now separate them into respective rows
                 *   in the table
                 */
                for(var i=0; i < results.length; i++){
                    names[i] = results[i].get('categoryName');
                    var table = document.getElementById("tableBody");
                    $(".success").show();
                    var row = table.insertRow(0);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2); // Edit button spot
                    var cell4 = row.insertCell(3); // Delete button spot
                    cell1.innerHTML = results[i].id;
                    cell2.innerHTML = names[i];
                    cell3.innerHTML = "<button>Edit</button>";
                    cell4.innerHTML = "<button class='deleteButton'>Delete</button>";
                }
                return names;
            }, error: function(error){
                res.send(error.message);
            }
        });
    }

    /*
     * destroyed() will find the categoryName the user wants to delete
     *      from the table, then destroy() it from Parse as well.
     *  It is called after a delete to the table is made via button click
     */
    function destroyed(name){
        //console.log("name is " + name);
        var query = new Parse.Query(Category);
        query.equalTo("categoryName", name);
        query.find({
            success: function(results){
                console.log("Query successfully found " + results[0].id + " " + name);
                query.get(results[0].id, {
                    success: function(object){
                        console.log(object.id);
                        object.destroy({
                            success: function(){
                                alert("Category was deleted successfully");
                            }, error: function(error) {
                                res.send(error.message);
                            }
                        });
                    }, error: function(error){
                        res.send(error.message);
                    }
                });
            }, error: function(error){
                res.send(error.message);
            }
        });
    }

    $("table").on('click', '.deleteButton', function(e){
        e.preventDefault();
        var certain = window.prompt("Are you sure you want to delete this category? ", "type 'yes' to confirm ");
        if(certain === "yes"){
            // deletes the specified row from table
            var table = document.getElementById("tableBody");
            var row = this.parentNode.parentNode;
            var gone = row.parentNode.removeChild(row);

            // still need to destroy it from Parse
            var destroyer = gone.cells[1].innerText  // category name we seek to destroy
            //console.log(destroyer); // checking name we want to delete is correct

            destroyed(destroyer); //function call to destroy desired object
        }
        else{
            alert("Did not delete category");
        }
    });

    $("#category-form").submit(function(event) {
        event.preventDefault();
        var newCategory = new Category();
        var user = Parse.User.current();
        var category = $("#categoryNameInput").val();
        var categoryACL = new Parse.ACL();
        /* Categories should only be able to be added via
         *  setRoleWriteAccess(TeamLeader, true) and then also Admin
         */
        categoryACL.setReadAccess(user, true);
        categoryACL.setWriteAccess(user, true);
        categoryACL.setPublicReadAccess(true);
        categoryACL.setPublicWriteAccess(false);
        //categoryACL.setRoleReadAccess(TeamLeader, true);
        //categoryACL.setRoleWriteAccess(TeamLeader, true);
        newCategory.set("categoryName", category);
        newCategory.set("createdBy", user);
        newCategory.setACL(categoryACL);

        // get input file & separate information needed
        var fileIn = $("#category-img-input")[0];
        var filePath = $("#category-img-input").val();
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
                newCategory.set("categoryFile", inFile);
                newCategory.save({
                    success: function(){
                        alert("File was successfully related & saved to the category");
                        queryCategories();
                    }, error: function(error){
                        console.log(error.message);
                    }
                });
            });
        }
        else{ // there is NO file to be input, save just the category
            newCategory.save().then(function(newCategory) {
                /* category was successfully saved.  Now display
                 *  the same page with table populated w/ results
                 */
                alert("successful save by - " + Parse.User.current().get("username") );
                queryCategories();
            }, function(error) {
                alert('addCategory', { flash: error.message });
            });
        }
    });

});
