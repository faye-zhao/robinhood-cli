const { sell } = require("./util-robinhood");

//To test: 
//  node robinhood/sellAll.js symbol=aapl 
//  node robinhood/sellAll.js symbol=aapl price=101
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
        }
    }
});

sell(options)
