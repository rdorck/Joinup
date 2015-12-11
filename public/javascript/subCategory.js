/**
 * Created by robertrock on 9/22/15.
 */

$(document).ready(function(){
    Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");
    var SubCategory = Parse.Object.extend('SubCategory');
    var Category = Parse.Object.extend('Category');
    var Question = Parse.Object.extend('Question');

    var profileButton = document.getElementById("profileName");
    profileButton.innerHTML += " "
    profileButton.innerHTML += Parse.User.current().get("username");

    queryParentSelector();
    querySubCategories();

    /* This function will query for all the Categories and populate an
     *   <option> choice for each one.
     */
    function queryParentSelector(){
        var i = 0;
        var query = new Parse.Query(Category);
        query.descending("createdAt"); //displays results w/ most recently added on top
        var parents = [];
        query.find({
            success: function(results){
                // captured all categories, now separate them into options
                for(var i=0; i < results.length; i++){
                    parents[i] = results[i].get('categoryName');
                    var select = document.getElementById("selector");
                    select.options[select.options.length] = new Option(parents[i], parents[i]);
                }
                return parents;
            }, error: function(error){
                res.send(error.message);
            }
        });
    }

    function selectedParent(){
        var select = document.getElementById("selector");
        if(select.options.length > 0){
            var selectedParentText = select.options[select.selectedIndex].text;
            var selectedParentValue = select.options[select.selectedIndex].value;
            // do these need to combined in some way to make a full object? ^^^^
            //console.log("Inside selectedParent() selectParentValue : " + selectedParentValue);
            return selectedParentValue;
        }
        else {
            alert("Parent is not chosen");
        }
    }

    /*
     *  Called from querySubCategories() to find a sub-category's parent category
     */
    function linkParent(objectId, createdDate, childName, minScore, parentId){
        console.log("createdDate: " + createdDate);
        var queryParent = new Parse.Query(Category);
        var parentRelated = [];
        queryParent.get(parentId);
        queryParent.find({
            success: function(pars){
                for(var j=0; j < pars.length; j++){
                    console.log("pars[j]: " + pars[j].id);
                    parentRelated[j] = pars[j].get('categoryName');
                    console.log("parentRelated[j]: " + parentRelated[j]);
                    var table = document.getElementById('tableBody');
                    $(".success").show();
                    var row = table.insertRow(0);
                    var cellId = row.insertCell(0);
                    var cellCreatedAt = row.insertCell(1);
                    var cellName = row.insertCell(2);
                    var cellParent = row.insertCell(3);
                    var cellMinPassingScore = row.insertCell(4);
                    var cellEditButton = row.insertCell(5);
                    var cellDeleteButton = row.insertCell(6);

                    cellId.innerHTML = objectId;
                    cellCreatedAt.innerHTML = createdDate;
                    cellName.innerHTML = childName;
                    cellParent.innerHTML = parentRelated[j];
                    cellMinPassingScore.innerHTML = minScore + "%";
                    cellEditButton.innerHTML = "<button class='table-button editButton'>Edit</button>";
                    cellDeleteButton.innerHTML = "<button class='table-button deleteButton'>Delete</button>";
                }
                return parentRelated;
            }, error: function(error){
                console.log(error.message);
            }
        });
    }

    /* A function for the page's initial loading & after
     *   saving an object to Category that will display all of the
     *   current categories in the database in the table.
     */
    function querySubCategories(){
        var i = 0;
        var query = new Parse.Query(SubCategory);
        query.ascending("parentCategory"); //displays results w/ most recently added on top
        var names = [];
        var dates = [];
        var datesRegex = [];
        var parents = [];
        var minPassingScores = [];
        query.find({
            success: function(results){
                /* captured all sub-categories, now separate them into respective rows
                 *   in the table
                 */
                for(var i=0; i < results.length; i++){
                    names[i] = results[i].get('subCategoryName');
                    dates[i] = results[i].createdAt.toString();
                    var createdAtRegex = dates[i].match(/\b(?:(?:Mon)|(?:Tues?)|(?:Wed(?:nes)?)|(?:Thur?s?)|(?:Fri)|(?:Sat(?:ur)?)|(?:Sun))(?:day)?\b[:\-,]?\s*[a-zA-Z]{3,9}\s+\d{1,2}\s*,?\s*\d{4}/);
                    datesRegex[i] = createdAtRegex;
                    parents[i] = results[i].get('parentCategory');
                    minPassingScores[i] = results[i].get('minPassingScore')
                    //console.log("Sending parents[i]: " + parents[i].id + " to linkParent()");
                    linkParent(results[i].id, datesRegex[i], names[i], minPassingScores[i],  parents[i].id);

                }
                return names;
            }, error: function(error){
                res.send(error.message);
            }
        });
    }

    $("#subCategory-form").submit(function(event){
        event.preventDefault();
        var newSubCategory = new SubCategory();
        var user = Parse.User.current();
        var subCategory = $("#subCategoryName-input").val();
        var minPassingScore = $("#subCategoryMinPassingScore-input").val();

        var subParent = selectedParent();
        //console.log("returned from selectedParent is: " + subParent);
        var queryParentCat = new Parse.Query(Category);
        queryParentCat.equalTo("categoryName", subParent);
        queryParentCat.find({
            success: function(results){
                console.log("queryParentCat found: " + results[0].id + " the parent's objectId");
                queryParentCat.get(results[0].id, {
                    success: function(object){
                        //console.log(object.id);
                        newSubCategory.set("createdBy", user);
                        newSubCategory.set("subCategoryName", subCategory);
                        newSubCategory.set("minPassingScore", minPassingScore);
                        newSubCategory.set("parentCategory", object);

                        var fileIn = $("#subCategory-img-input")[0];
                        var filePath = $("#subCategory-img-input").val();
                        var fileName = filePath.split("\\").pop();

                        if(fileIn.files.length > 0){
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
                                 *   here we are now relating the file to a subCategory,
                                 */
                                newSubCategory.set("subCategoryFile", inFile);
                                newSubCategory.save({
                                    success: function(){
                                        alert("File was successfully saved to SubCategory");
                                        querySubCategories();
                                    }, error: function(error){
                                        console.log(error.message);
                                    }
                                });
                            });
                        }
                        else { // No file to be input, save just subCategory
                            newSubCategory.save().then(function(newSubCategory) {
                                alert("Successful save by - " + Parse.User.current().get("username"));
                                querySubCategories();
                            }, function(error) {
                                alert('subCategory was not saved, error: ' +  error.message);
                            });
                        }
                    }, error: function(error){
                        res.send(error.message);
                    }
                });
            }, error: function(error){
                console.log(error.message);
            }
        });
    });

    /*
     * destroyed() will find the subCategoryName the user wants to delete
     *      from the table, then destroy() it from Parse as well.
     *  It is called after a delete to the table is made via button click
     */
    function destroyed(name){
        //console.log("name is " + name);
        var query = new Parse.Query(SubCategory);
        var queryQuestion = new Parse.Query(Question);
        var qArray = [];
        query.equalTo("subCategoryName", name);
        query.find({
            success: function(results){
                console.log("Query successfully found " + results[0].id + " " + name);
                query.get(results[0].id, {
                    success: function(object){
                        console.log(object.id);
                        queryQuestion.equalTo("parentSubCategory", object);
                        queryQuestion.find({
                            success: function(relatedQuestions){
                                for(var i=0; i < relatedQuestions.length; i++){
                                    qArray[i] = relatedQuestions[i];
                                    console.log("questions related to this sub-category are: " + qArray[i].id);
                                    queryQuestion.get(relatedQuestions[i].id, {
                                        success: function(qObject){
                                            console.log("qObject: " + qObject.id);
                                            qObject.destroy({
                                                success: function(){
                                                    alert("Related questions to this sub-category were successfully deleted.");
                                                }, error: function(error){
                                                    console.log(error.message);
                                                }
                                            });
                                        }, error: function(error){
                                            console.log(error.message);
                                        }
                                    });
                                }
                            }, error: function(error){
                                console.log(error.message);
                            }
                        });
                        object.destroy({
                            success: function(){
                                alert("SubCategory was deleted successfully");
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
        var certain = window.prompt("You're 100% you want to delete this sub-category? Any questions related to this sub-category will also be destroyed.", "type 'yes' to confirm");
        if(certain === "yes") {
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
            alert("Did not delete sub-category");
        }
    });

});