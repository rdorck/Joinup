/**
 * Created by robertrock on 9/13/15.
 */

$(document).ready(function(){
    Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");
    var Category = Parse.Object.extend('Category');
    var i = 0;
    var query = new Parse.Query(Category);
    var names = [];
    query.find({
        success: function(results){
            // do something with the 'results'
            for(var i=0; i < results.length; i++){
                names[i] = results[i].get('categoryName');
                var table = document.getElementById("tableBody");
                $(".success").show();
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.innerHTML = i;
                cell2.innerHTML = names[i];
            }
            return names;
        }, error: function(error){
            res.send(error.message);
        }
    });
    $("#some-form").submit(function(event) {
        event.preventDefault();
        var newCategory = new Category();

        var category = $("#categoryNameInput").val();
        newCategory.set("categoryName", category);
        newCategory.save().then(function(newCategory) {
            /* category was successfully saved.  Now display
             *  the same page with table populated w/ results
             */
            alert("success");
            var table = document.getElementById("tableBody");
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = names.length;
            cell2.innerHTML = category;
        }, function(error) {
            alert('some', { flash: error.message });
        });
    });
    alert("loaded");
});
//function addRow() {
//    var categoryInput = document.getElementById("categoryNameInput").value;
//    var catID = document.getElementById("tableCatID").value;
//
//    var table = document.getElementById("tableBody");
//    var row = table.insertRow(0);
//    var cell1 = row.insertCell(0);
//    var cell2 = row.insertCell(1);
//    cell1.innerHTML = catID;
//    cell2.innerHTML = categoryInput;
//}