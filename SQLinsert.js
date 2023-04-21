
var db = window.openDatabase("itemDB","1.0","itemDB",65535);
var sql =""

$(function(){
    loadData();
    //creating a db
    $("#create").click(function(){
    db.transaction(function(transaction){
    sql = "CREATE TABLE items"+
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
        sql = "INSERT INTO items(item,quantity) VALUES(?,?)";
        transaction.executeSql(sql,[item,qty],
        function(){alert("item added successfully")},
        function(transaction,err){alert(//err.message//
        "No Database Found. Create a database first")});
        location.reload(true);
    });
    });

    //fetching records of available material
    $("#fetch").click(function(){
       loadData();
    });
function loadData(){
    $("#itemlist").children().remove();
    db.transaction(function(transaction){
        sql = "SELECT * FROM items ORDER BY id ASC";
        transaction.executeSql(sql, undefined,function(transaction,result){
            if(result.rows.length){
                for(var i=0;i<result.rows.length;i++){
                    var row = result.rows.item(i);
                    var id = row.id;
                    var item = row.item;
                    var quantity = row.quantity;
                    var button_id = "delete"+id;
                   // $("#itemlist").append('<tr><td>'+id+'</td><td>'+item+'</td><td>'+quantity+'</td><td><button href ="#" button type="button" class="btn-danger" deleteitem data-id="'+id+
                   // '">DELETE</button> <button href="#" type="button" class="btn-primary" id="find">FIND</button></td></tr>');
                   $("#itemlist").append(`<tr><td>`+id+`</td><td>`+item+`</td><td>`+quantity+`</td>
                   <td><button type="button" id=`+button_id+` class="btn-danger"><span class="bi bi-trash-fill" style="font-size:1rem"></span> Delete</button></td>
                   <td><button type="button" id=`+button_id+` class="btn-primary"><span class="bi bi-pencil-square" style="font-size:1rem"></span> Edit</button></td>
                   </tr>`);
                }



                for ( var i = 0; i <=result.rows.length; i++ ) (function(i){ 
                     
                        $("#delete"+i).click(function(){
                            alert('hiu'+i);

                           
                            // var item = $("#instrument").val()
                            // //var item = $("#result").val()
                            // console.log($("#result").val())
                            // var qty = $("#quantity").val();
                            db.transaction(function(transaction){
                                    //sql = "INSERT INTO items(item,quantity) VALUES(?,?)";
                                    sql = "UPDATE items SET quantity = '6' WHERE id ="+i
                                    transaction.executeSql(sql,[])
                                    });

                                    location.reload(true);
                        });  
                  })(i);




                


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
})



