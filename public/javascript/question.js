$(document).ready(function(){
    Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");
    var Category = Parse.Object.extend("Category");
    var SubCategory = Parse.Object.extend("SubCategory");
    var Question = Parse.Object.extend("Question");

    var profileButton = document.getElementById("profileName");
    profileButton.innerHTML += " "
    profileButton.innerHTML += Parse.User.current().get("username");

    queryParentCategory();
    queryParentSubCategory();
    queryQuestion();


    /*
     *  For character counting on option inputs.  This allows us to guarantee the options text will
     *      in fact fit on the screen and display correctly.
     */
    var text_max = 50;
    $("#optionAText_feedback").html(text_max + " characters remaining");
    $("#optionBText_feedback").html(text_max + " characters remaining");
    $("#optionCText_feedback").html(text_max + " characters remaining");
    $("#optionDText_feedback").html(text_max + " characters remaining");

    $("#optionA").keyup(function () {
        var text_length = $("#optionA").val().length;
        var text_remaining = text_max - text_length;
        $("#optionAText_feedback").html(text_remaining + " characters remaining");

    });

    $("#optionB").keyup(function () {
        var text_length = $("#optionB").val().length;
        var text_remaining = text_max - text_length;
        $("#optionBText_feedback").html(text_remaining + " characters remaining");

    });

    $("#optionC").keyup(function () {
        var text_length = $("#optionC").val().length;
        var text_remaining = text_max - text_length;
        $("#optionCText_feedback").html(text_remaining + " characters remaining");

    });

    $("#optionD").keyup(function () {
        var text_length = $("#optionD").val().length;
        var text_remaining = text_max - text_length;
        $("#optionDText_feedback").html(text_remaining + " characters remaining");

    });
    // END of character counting


    function queryParentCategory(){
        var query = new Parse.Query(Category);
        query.descending("createdAt");
        var parents = [];
        query.find({
            success: function(results){
                // captured all categories, now separate them into options
                for(var i=0; i < results.length; i++){
                    parents[i] = results[i].get('categoryName');
                    var select = document.getElementById("category-selector");
                    select.options[select.options.length] = new Option(parents[i], parents[i]);
                }
                return parents;
            }, error: function(error){
                res.send(error.message);
            }
        });
    } // END of queryParentCategory()


    /* Really this function shouldn't be called until some Parent is selected because
     *  then we know what subCategories to query as appose to all of them.
     */
    function queryParentSubCategory(){
        var querySubs = new Parse.Query("SubCategory");
        querySubs.descending("createdAt");
        var subParents = [];
        var select = document.getElementById("subCategory-selector");
        querySubs.find({
            success: function(results){
                for(var i=0; i < results.length; i++){
                    subParents[i] = results[i].get("subCategoryName");

                    select.options[select.options.length] = new Option(subParents[i], subParents[i]);
                }
                select.options[select.options.length] = new Option(" ", " ");
                return subParents;
            }, error: function(error){
                console.log(error.message);
            }
        });
    } // END of queryParentSubCategory()


    function selectedParentCategory(){
        var select = document.getElementById("category-selector");
        if(select.options.length > 0){
            //var selectedParentText = select.options[select.selectedIndex].text;
            var selectedParentValue = select.options[select.selectedIndex].value;
            // do these need to combined in some way to make a full object? ^^^^
            return selectedParentValue;
        }
        else {
            alert("Parent is not chosen");
        }
    } // END of selectedParentCategory()


    function selectedParentSubCategory(){
        var select = document.getElementById("subCategory-selector");
        if(select.options.length > 0){
            //var selectedParentSubText = select.options[select.selectedIndex].text;
            var selectedParentSubValue = select.options[select.selectedIndex].value;
            // do these need to combined in some way to make a full object? ^^^^
            return selectedParentSubValue;
        }
        else {
            alert("Parent SubCategory is not chosen");
        }
    } // END of selectedParentSubCategory()


    /*
     *  Allows the user to select an answer via radio buttons as apposed to the previous version of entering
     *    the whole option, or a select menu.  We will still save the answer as a String that is still the entire
     *    option, but the user doesn't have to enter the whole thing anymore.
     */
    function selectedAnswer(){
        var a = document.getElementById("radioA");
        var b = document.getElementById("radioB");
        var c = document.getElementById("radioC");
        var d = document.getElementById("radioD");

        if(a.checked){
            var ans = $("#optionA").val();
            b.checked = false;
            c.checked = false;
            d.checked = false;
            console.log("ans A " + ans);
        } else if(b.checked){
            var ans = $("#optionB").val();
            a.checked = false;
            c.checked = false;
            d.checked = false;
            console.log("ans B " + ans);
        } else if(c.checked){
            var ans = $("#optionC").val();
            a.checked = false;
            b.checked = false;
            d.checked = false;
            console.log("ans C " + ans);
        } else {
            var ans = $("#optionD").val();
            a.checked = false;
            b.checked = false;
            c.checked = false;
            console.log("ans D " + ans);
        }
        return ans;
    } // END of selectedAnswer()

    /*
     *
     */
    function isRanking(){
        var on = document.getElementById("radioOn");

        if(on.checked){
            return true;
        }
        else {
            return false;
        }
    } // END of isRanking()

    function selectedDifficulty(){
        var easy = document.getElementById("easy");
        var medium = document.getElementById("medium");
        var hard = document.getElementById("hard");
        var expert = document.getElementById("expert");

        if(easy.checked){
            var diff = $("#easy").val();
            medium.checked = false;
            hard.checked = false;
            expert.checked = false;
            //console.log("easy " + diff);
        } else if(medium.checked){
            var diff = $("#medium").val();
            easy.checked = false;
            hard.checked = false;
            expert.checked = false;
            //console.log("medium " + diff);
        } else if(hard.checked){
            var diff = $("#hard").val();
            easy.checked = false;
            medium.checked = false;
            expert.checked = false;
            //console.log("hard " + diff);
        } else {
            var diff = $("#expert").val();
            easy.checked = false;
            medium.checked = false;
            hard.checked = false;
            //console.log("expert " + diff);
        }
        return diff;

    } // END if selectedDifficulty()

    function queryQuestion(){
        var query = new Parse.Query(Question);
        query.ascending("createdAt");
        //var a = [];
        var questions = [];
        var images = [];
        query.find({
            success: function(results){
                for(var i=0; i < results.length; i++){
                    //var a = results[i];
                    //console.log("a: " + a);
                    //console.log("results looking for Category: " + results[i].get('parentCategory').id);
                    //console.log("results looking for SubCategory: " + results[i].get('parentSubCategory').id);

                    questions[i] = results[i].get("questionText");
                    images[i] = results[i].get("questionFile");

                    /* Testing to ensure we can capture the file, perhaps use it to display to the table? */
                    //if(images[i]){
                    //    console.log("images: " + images[i].url());
                    //}

                    var table = document.getElementById("tableBody");
                    $(".success").show();
                    var row = table.insertRow(0);
                    var qId = row.insertCell(0);
                    var qText = row.insertCell(1);
                    var qSubCategory = row.insertCell(2);
                    var qCategory = row.insertCell(3);
                    var qEdit = row.insertCell(4);
                    var qDelete = row.insertCell(5);
                    qId.innerHTML = results[i].id;
                    qText.innerHTML = questions[i];
                    qSubCategory.innerHTML = results[i].get('parentSubCategory').id;
                    qCategory.innerHTML = results[i].get('parentCategory').id;
                    qEdit.innerHTML = "<button class='tableButton editButton'>Edit</button>";
                    qDelete.innerHTML = "<button class='tableButton deleteButton'>Delete</button>";
                }
                return questions;
            }, error: function(error){
                console.log(error.message);
            }
        });
    } // END of queryQuestion()

    $("#question-form").submit(function(event){
        event.preventDefault();

        var newQuestion = new Question();
        var user = Parse.User.current();
        var question = $("#question-input").val();
        var optionA = $("#optionA").val();
        var optionB = $("#optionB").val();
        var optionC = $("#optionC").val();
        var optionD = $("#optionD").val();
        var timer = $("#timer").val();

        if(isRanking() == true) {
            console.log("ranking is on");
            newQuestion.set("mostCorrect", optionA);
            newQuestion.set("partiallyCorrect", optionB);
            newQuestion.set("partiallyIncorrect", optionC);
            newQuestion.set("mostIncorrect", optionD);
            newQuestion.set("answer", optionA);
        } else {
            newQuestion.addUnique("options", optionA);
            newQuestion.addUnique("options", optionB);
            newQuestion.addUnique("options", optionC);
            newQuestion.addUnique("options", optionD);
            var answer = selectedAnswer();
            newQuestion.set("answer", answer);
            //console.log("Using radio buttons answer is: " + answer);
        }

        var questionParent = selectedParentCategory();
        //console.log("Question parent category selected is: " + questionParent);
        var questionParentSub = selectedParentSubCategory();
        //console.log("Question parent subCategory selected is: " + questionParentSub);

        var difficulty = selectedDifficulty();

        var queryCategory = new Parse.Query(Category);
        queryCategory.equalTo("categoryName", questionParent);
        queryCategory.find({
            success: function(results){
                //console.log("queryCategory matched to objectId: " + results[0].id);
                queryCategory.get(results[0].id, {
                    success: function(object){
                        newQuestion.set("createdBy", user);
                        newQuestion.set("difficulty", difficulty);
                        newQuestion.set("questionText", question);
                        newQuestion.set("timer", timer);
                        newQuestion.set("parentCategory", object);
                        if(selectedParentSubCategory()){
                            var querySubCategory = new Parse.Query(SubCategory);
                            querySubCategory.equalTo("subCategoryName", questionParentSub);
                            querySubCategory.find({
                                success: function(subResults){
                                    //console.log("querySubCategory matched to objectID: " + subResults[0].id);
                                    querySubCategory.get(subResults[0].id, {
                                        success: function(subObj){
                                            newQuestion.set("parentSubCategory", subObj);
                                            var fileIn = $("#question-img-input")[0];
                                            var filePath = $("#question-img-input").val();
                                            var fileName = filePath.split("\\").pop();

                                            if(fileIn.files.length > 0){
                                                var file = fileIn.files[0];
                                                var parseFile = new Parse.File(fileName, file);
                                                parseFile.save({
                                                    success: function(){

                                                    }, error: function(error){
                                                        console.log(error.message);
                                                    }
                                                }).then(function(inFile){
                                                    newQuestion.set("questionFile", inFile);
                                                    newQuestion.save({
                                                        success: function(){
                                                            alert("File successfully saved");
                                                            queryQuestion();
                                                        }, error: function(error){
                                                            console.log(error.message);
                                                        }
                                                    });
                                                });
                                            }
                                            else {
                                                newQuestion.save().then(function(newQuestion) {
                                                    alert("Question successfully saved by: " + user.get("username"));
                                                }, function(error){
                                                    console.log(error.message);
                                                });
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

                        else {
                            newQuestion.save().then(function(newQuestion) {
                                alert("Question successfully saved by: " + user.get("username"));
                            }, function(error){
                                console.log(error.message);
                            });
                        }


                    }, error: function(error){
                        console.log(error.message);
                    }
                });
            }, error: function(error){
                console.log(error.message);
            }
        });
    }); // END of submitting question


    /*
     * destroyed() will find the questionText the user wants to delete
     *      from the table, then destroy() it from Parse as well.
     *  It is called after a delete to the table is made via button click
     */
    function destroyed(name){
        //console.log("name is " + name);
        var query = new Parse.Query(Question);
        query.equalTo("questionText", name);
        query.find({
            success: function(results){
                //console.log("Query successfully found " + results[0].id + " " + name);
                query.get(results[0].id, {
                    success: function(object){
                        console.log(object.id);
                        object.destroy({
                            success: function(){
                                alert("Question was deleted successfully");
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
    } // END of destroyted(name)


    $("table").on('click', '.deleteButton', function(e){
        e.preventDefault();
        var certain = window.prompt("Are you sure you want to delete this question?  ", "type 'yes' to confirm");
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
            alert("Did not delete question.");
        }
    });


});
