const { fetchQuote } = require('./util-robinhood')

// node quote.js AAPL,MSFT
let symbol = ''
process.argv.forEach((val, index) => {
    if (index >= 2) {
        symbol = val;
    }
});

async function main() {
    const quote  = await fetchQuote(symbol)
    console.log(quote)

}

main()
