const { sell } = require('./util-robinhood')

//To test: 
//  node robinhood/sell.js symbol=aapl quantity=1
//  node robinhood/sell.js symbol=aaplquantity=1  price=101 
const options = {}
process.argv.forEach((val, index) => {
    if (index >= 2) {
        let vals = val.split("=");
        if (vals.length !== 2) {
            return;
        }
        if (vals[0] === "symbol") {
            options.symbol = vals[1];
        } else if (vals[0] === "p") {
            options.price = vals[1];
        } else if (vals[0] === "q") {
            options.quantity = vals[1];
        }
    }
});

sell(options)
