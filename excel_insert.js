$(function(){
$("#excel").click(function(){var files = document.getElementById('file_upload').files;
if(files.length==0){
  alert("Please choose any file...");
  return;
}
var filename = files[0].name;
var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
if (extension == '.XLS' || extension == '.XLSX') {
    //Here calling another method to read excel file into json
    excelFileToJSON(files[0]);
}else{
    alert("Please select a valid excel file.");
} });
 
 // Method to read excel file and convert it into JSON 
  function excelFileToJSON(file){
      try {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function(e) {

            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type : 'binary'
            });
            var result = {};
            var firstSheetName = workbook.SheetNames[0];
            //reading only first sheet data
            var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
            //displaying the json result into HTML table
            displayJsonToHtmlTable(jsonData);
            }
        }catch(e){
            console.error(e);
        }
  }
  
 // Method to display the data in HTML Table
  function displayJsonToHtmlTable(jsonData){
    var table=document.getElementById("display_excel_data");
    if(jsonData.length>0){
        var htmlData='<tr><th>Instrument</th><th>UMC No.</th><th>Quantity</th><th>Place</th></tr>';
        for(var i=0;i<jsonData.length;i++){
            var row=jsonData[i];
            htmlData+='<tr><td>'+row["Instrument"]+'</td><td>'+row["UMC No."]
                  +'</td><td>'+row["Quantity"]+'</td><td>'+row["Place"]+'</td></tr>';
        }
        table.innerHTML=htmlData;
    }else{
        table.innerHTML='There is no data in Excel';
    }
    }

















})

	 