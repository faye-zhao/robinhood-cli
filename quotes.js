const { credentials } = require("./credentials");

const fetchQuote = (symbols) => {  
    return new Promise((resolve, reject) => {
        const Robinhood = require('robinhood')(credentials, function(){
            Robinhood.quote_data(symbols, function(err, response, body){
                if(err){
                    console.error(err);
                    reject(err)
                }else{
                    //console.log("quote_data");
                    //console.log(body);
                    const {results} = body
                    const quotes = results.map(r => {
                        const {symbol, ask_price, bid_price, last_trade_price} = r
                        return {
                            symbol,
                            ask: Number(Number(ask_price).toFixed(2)), 
                            bid: Number(Number(bid_price).toFixed(2)),
                            last: Number(Number(last_trade_price).toFixed(2))
                        }
                    })

                    resolve(quotes)
                }
            })
        })
    })
}

// node quotes.js AAPL,MSFT
let symbols = ''
process.argv.forEach((val, index) => {
    if (index >= 2) {
        symbols = val;
    }
});

async function main() {
    const quote  = await fetchQuote(symbols)
    console.log(quote)

}

main()
