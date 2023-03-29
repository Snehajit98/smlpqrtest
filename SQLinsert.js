
var db = window.openDatabase("itemDB","1.0","itemDB",65535);

$(function(){
   //loadData();
    //creating a db
    $("#create").click(function(){
    db.transaction(function(transaction){
    var sql = "CREATE TABLE items"+
            "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
            "item VARCHAR(100) NOT NULL,"+ //will use this "item" as a key(as #item) in insert function
            "quantity INTEGER(5) NOT NULL)"; //will use this "quantity" as another key(as #quantity) in insert function
            transaction.executeSql(sql,undefined,
            function(){alert("Database created!");},
            function(){alert("Database already exists");})
        });
    });
    
    //removing a db
    $("#remove").click(function(){
        if(!confirm(" Are you sure?",""))return;;
        db.transaction(function(transaction){
            var sql = "DROP TABLE items";
            transaction.executeSql(sql,undefined,
            function(){alert("table deleted")},
            function(){alert("No tables found to delete");});
            $("#itemlist").children().remove();
        });
    });

    //inserting an element...the most important one
    $("#insert").click(function(){
    var item = $("#instrument").val()
    //var item = $("#result").val()
    console.log($("#result").val())
    var qty = $("#quantity").val();
    db.transaction(function(transaction){
        // alert("item added successfully");
        var sql = "INSERT INTO items(item,quantity) VALUES(?,?)";
        transaction.executeSql(sql,[item,qty],
        function(){alert("item added successfully")},
        function(transaction,err){alert(//err.message//
        "No Database Found. Create a database first")});
    });
    });

    //fetching records of available material
    $("#fetch").click(function(){
       loadData();
    });
function loadData(){
    $("#itemlist").children().remove();
    //alert("working");

    db.transaction(function(transaction){
        
        var sql = "SELECT * FROM items ORDER BY id ASC";
        transaction.executeSql(sql, undefined,function(transaction,result){
            if(result.rows.length){
                for(var i=0;i<result.rows.length;i++){
                    var row = result.rows.item(i);
                    var id = row.id;
                    var item = row.item;
                    var quantity = row.quantity;
                    $("#itemlist").append('<tr><td id = "del'+id+'">'+id+'</td><td>'+item+'</td><td>'+quantity+
                    '</td><td><button href ="#" button type="button" class="btn-danger" deleteitem data-id="'+id+
                    '">DELETE</button> <button href="#" type="button" class="btn-primary" id="find">FIND</button></td></tr>');

                }
            }
            else{
                $("#itemlist").append("<tr><td colspan='3' align ='center'> No Items Found</td><tr>");
            }
        },function(transaction,err){
            alert(/*err.message*/"No Database Found");
        }
        );
    });
    }

 $(".deleteitem").on("click",function(){var id = $(this).data("id");})
})

