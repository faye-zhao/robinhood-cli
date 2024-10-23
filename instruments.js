
const { credentials } = require("./credentials");


const fetchInstrument = (symbol) => {  
    return new Promise((resolve, reject) => {
        const Robinhood = require('robinhood')(credentials, () => {
            Robinhood.instruments(symbol,function(err, response, body){
                if(err){
                    console.error(err)
                    reject(err)
                }else{
                    resolve(body)
                }
            })
        })
    })
}


async function main() {
    const symbol = 'djt'
    const instrumentsBody  = await fetchInstrument(symbol)
    const instrument = instrumentsBody.results.find(t => t.symbol === props.symbol.toUpperCase())
    
    if (instrument) {
        props.url = instrument.url
        //url: 'https://api.robinhood.com/instruments/450dfc6d-5510-4d40-abfb-f633b7d9be3e/',
        console.log(props.symbol, instrument)
        //const dummy = await placeOrder(props)
    }
}

main()
