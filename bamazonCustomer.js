var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log(
            "Product ID: " + res[i].item_id + 
            " | Product Name: " + res[i].product_name + 
            " | Price: $" + res[i].price +
            " | QTY Available: " + res[i].stock_quantity);
        }

        start();
    })
});

function start() {
    inquirer
        .prompt([
            {
            name: "selectProduct",
            type: "input",
            message: "Enter the product Id for the item you'd like to buy"
            },
            {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
.then(function(answer) {
    connection.query(
        "SELECT * FROM products WHERE item_id = " + answer.selectProduct, function(err, res) {
            if (err) throw err;
            if (answer.quantity <= res[0].stock_quantity) {
                console.log("Item purchased!");
                console.log("Total Cost: $" + (res[0].price * answer.quantity));
                connection.query(
                    "SET stock_quantity = " + (res[0].stock_quantity -= answer.quantity) 
                    + "WHERE item_id = " + answer.selectProduct, function(err, res2) {
                console.log("New Stock: " + res[0].stock_quantity);
                    }
                )

            } else {
                console.log("Insufficient Quantity");
            }
        }
    )
    })
}
