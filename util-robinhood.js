const { credentials } = require("./credentials");

// node quotes.js AAPL,MSFT 
// symbol is comma separated
const fetchQuote = (symbol) => {  
    return new Promise((resolve, reject) => {
        const Robinhood = require('robinhood')(credentials, function(){
            Robinhood.quote_data(symbol, function(err, response, body){
                if(err){
                    console.error(err);
                    reject(err)
                }else{
                    const {results} = body
                    const quotes = results.map(r => {
                        const {symbol,  ask_price, bid_price, last_trade_price} = r
                        return {
                            symbol,
                            ask: Number(Number(ask_price).toFixed(2)), 
                            bid: Number(Number(bid_price).toFixed(2)),
                            last: Number(Number(last_trade_price).toFixed(2))
                        }
                    })
                    resolve(quotes)
                    //{
                    //    results: [
                    //        {
                    //            ask_price: String, // Float number in a String, e.g. '735.7800'
                    //            ask_size: Number, // Integer
                    //            bid_price: String, // Float number in a String, e.g. '731.5000'
                    //            bid_size: Number, // Integer
                    //            last_trade_price: String, // Float number in a String, e.g. '726.3900'
                    //            last_extended_hours_trade_price: String, // Float number in a String, e.g. '735.7500'
                    //            previous_close: String, // Float number in a String, e.g. '743.6200'
                    //            adjusted_previous_close: String, // Float number in a String, e.g. '743.6200'
                    //            previous_close_date: String, // YYYY-MM-DD e.g. '2016-01-06'
                    //            symbol: String, // e.g. 'AAPL'
                    //            trading_halted: Boolean,
                    //            updated_at: String, // YYYY-MM-DDTHH:MM:SS e.g. '2016-01-07T21:00:00Z'
                    //        }
                    //    ]
                    //}
                }
            })
        })
    })
}


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

const fetchPositions = () => {  
    return new Promise((resolve, reject) => {
        const Robinhood = require('robinhood')(credentials, function(err, data){
            Robinhood.nonzero_positions(function(err, response, body){
                if (err){
                    console.error(err);
                    reject(err)
                }else{
                    const {results} = body
                    //console.log(results)
                    const positons = results.map(t => {
                        const {symbol, quantity, average_buy_price} = t
                        return {symbol, quantity: Math.round(quantity), cost_basis: Number(average_buy_price)}
                    })
                    resolve(positons)
                }
            });
        });
    })
}

const placeOrder = ({symbol, price, url, quantity, type}) => {  
    if (!symbol) {
        console.log('Specify symbol')
        return
    }
    if (!price) {
        console.log('Specify price')
        return
    }
    return new Promise((resolve, reject) => {
        const Robinhood = require('robinhood')(credentials, () => {
            const options = {
                type: 'limit',
                quantity: quantity || 1,
                bid_price: price,
                instrument: {
                    url,
                    symbol
                }
                // // Optional:
                // trigger: String, // Defaults to "gfd" (Good For Day)
                // time: String,    // Defaults to "immediate"
                // type: String     // Defaults to "market"
            }
            const func =  (type === 'buy') ? Robinhood.place_buy_order : Robinhood.place_sell_order
            
            func(options, (error, response, body) => {
                if(error){
                    console.error('Order error.', error)
                    reject(error)
                }else{
                    //console.log('Order OK.', body)
                    resolve(body)
                }
            })
        })
    })
}

//price is optional. If not specified, the last price is used
//quantity is optional. If not specified, the quantity of the position is used
const sell = async ({symbol, quantity, price}) => {
    if (!symbol) {
        console.log('Specify symbol')
        return
    }
    /*
    if (!quantity) {
        console.log('Specify quantity')
        return
    }
    */
    const options = {symbol, quantity}

    const instrumentsBody  = await fetchInstrument(symbol)
    const instrument = instrumentsBody.results.find(t => t.symbol === symbol.toUpperCase())
    
    if (!instrument) {
        console.log('Instrument not found')
        return
    }
    options.url = instrument.url
    //url: 'https://api.robinhood.com/instruments/450dfc6d-5510-4d40-abfb-f633b7d9be3e/',

    if (quantity) {
        options.quantity = quantity
    } else {
        const positions  = await fetchPositions()
        const symbolPosition = positions.find(t => t.symbol.toUpperCase() === symbol.toUpperCase()) 
        if (!symbolPosition) {
            console.log('Position not found')
            return
        }
        options.quantity = symbolPosition.quantity
    }

    if (price) {
        options.price = price
    } else {
        const quote  = await fetchQuote(symbol)
        options.price = quote[0].last
    }

    options.type = 'sell'
    console.log(options)

    const dummy = await placeOrder(options)
}


//price is optional
const buy = async ({symbol, quantity, price}) => {
    if (!symbol) {
        console.log('Specify symbol')
        return
    }
    if (!quantity) {
        console.log('Specify quantity')
        return
    }
    const options = {symbol, quantity}

    const instrumentsBody  = await fetchInstrument(symbol)
    const instrument = instrumentsBody.results.find(t => t.symbol === symbol.toUpperCase())
    
    if (!instrument) {
        console.log('Instrument not found')
        return
    }
    options.url = instrument.url
    //url: 'https://api.robinhood.com/instruments/450dfc6d-5510-4d40-abfb-f633b7d9be3e/',

    if (price) {
        options.price = price
    } else {
        const quote  = await fetchQuote(symbol)
        options.price = quote[0].last
    }
    options.type = 'buy'
    console.log(options)
    const dummy = await placeOrder(options)
}

const positionsWithQuote = async () => {
    const positions  = await fetchPositions()
    const symbols = positions.map(t => t.symbol).join(',')
    const quotes = await fetchQuote(symbols)
    //console.log('positions', positions)
    //console.log('quotes', quotes)

    const positionsWithQuote = []
    let totalGain = 0
    for (const t of positions) {
        const {symbol, quantity, cost_basis} = t
        const quote = quotes.find(q => q.symbol === t.symbol.toUpperCase())
        const {last} = quote
        const diff = Math.round((last - t.cost_basis) * 100) / 100
        const diffPercent = Math.round(Math.round((diff / t.cost_basis) * 10000) / 100)
        const gain = Math.round((diff * t.quantity) * 100) / 100
        totalGain += gain
        positionsWithQuote.push({symbol, gain, percent: `${diffPercent}%`, quantity, cost_basis, last, diff} )
    }
    totalGain = Math.round(totalGain * 100) / 100
    console.log(positionsWithQuote.map((t,row) => (Object.values(t)).map((s, col)=>{ 
        if (col===0) {
            return `${s}`.padEnd(10, ' ')
        } else {
            return `${s}`.padStart(10, ' ')
        }

    }).join(' ')).join('\n\n'))
    console.log('totalGain', Math.round(totalGain))
    return {positionsWithQuote, totalGain}
}

module.exports = {
    fetchQuote,
    fetchInstrument,
    fetchPositions,
    positionsWithQuote,
    placeOrder,
    buy,
    sell,
}