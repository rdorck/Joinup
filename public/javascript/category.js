/**
 * Created by robertrock on 9/13/15.
 */
//$(document).ready(function(){
//    alert("loaded");
//});
function addRow() {

    var categoryInput = document.getElementById("categoryNameInput").value;
    var catID = document.getElementById("tableCatID").value;

    var table = document.getElementById("tableBody");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = catID;
    cell2.innerHTML = categoryInput;

}