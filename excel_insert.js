var db = window.openDatabase("itemDB","1.0","itemDB",65535);
var sql =""

$(function(){

    
$("#excel").click(function()

{var files = document.getElementById('file_upload').files;
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
            displayJsonToHtmlTable(jsonData);
            }
        }catch(e){
            console.error(e);
        }
  }
  
 // Method to display the data in HTML Table
  function displayJsonToHtmlTable(jsonData){
    console.log(jsonData)
    if(jsonData.length>0){
    for(var i=0;i<jsonData.length;i++)(function(i){
        var row_xl=jsonData[i];
       
            db.transaction(function(transaction){
            sql = "SELECT * FROM items WHERE item LIKE '%"+row_xl["UMC No."]+"%' ORDER BY id ASC";
            
            //runs perfectly upto this point 
            transaction.executeSql(sql, undefined,function(transaction,result){
                  
                if(result.rows.length){
                    //alert(result.rows.item(0).id) 
                    alert("hi "+row_xl["Quantity"] +" "+ result.rows.length + " " )

                    var row = result.rows.item(0); //as there is only single row iterareted by predecessor for() loop, rows.item(i) doesn't work. only rows,item(0) works 
                    var id = row.id;
                    var quantity = Number(row.quantity)+Number(row_xl["Quantity"]);
   
                    db.transaction(function(transaction){
                        sql = "UPDATE items SET quantity = "+quantity+" WHERE id ="+id+""
                        transaction.executeSql(sql,[])
                        });
                        $("#fetch").click()

                }
                else{ 
                    alert(row_xl["Quantity"])
                    
                        
                    db.transaction(function(transaction){
    
                        sql = "INSERT INTO items(item,quantity) VALUES(?,?)";
                        transaction.executeSql(sql,[row_xl["UMC No."],row_xl["Quantity"]],
                        function(){alert("item added successfully")},
                        function(transaction,err){alert(//err.message//
                        "No Database Found. Create a database first")});
                        $("#fetch").click()
                        
                    });

                }

                }
                ,function(transaction,err){
                    alert(/*err.message*/"No Database Found");
                });
            });       
        })(i)
    }
}
    })

	 




