/**
 * Created by robertrock on 9/22/15.
 */

$(document).ready(function(){

    var parents = function getParents(){
        var parentCategory = Parse.Object.extend("Category");
        var query = new Parse.Query(parentCategory);
        query.ascending("createdAt");
        query.find({
           success: function(results){
               var select = document.getElementById("selectParent");
               $.each(results, function(parentName, categoryName ){

               });
           } , error: function(error){
                console.log(error.message);
            }
        });
    }

});