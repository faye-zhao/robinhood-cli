const { buy } = require("./util-robinhood");

//To test: 
//node robinhood/buy.js symbol=aapl price=101 quantity=1
//node robinhood/buy.js symbol=aapl quantity=1
const options = {}
process.argv.forEach((val, index) => {
    if (index >= 2) {
        let vals = val.split("=");
        if (vals.length !== 2) {
            return;
        }
        if (vals[0] === "symbol") {
            options.symbol = vals[1];
        } else if (vals[0] === "price") {
               options.price = vals[1];
        } else if (vals[0] === "quantity") {
            options.quantity = vals[1];
        }
    }
});

buy(options)
