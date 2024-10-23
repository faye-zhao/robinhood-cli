const { credentials } = require("./credentials");


let options = {
    updated_at: '2024-10-16',
    //instrument: 'https://api.robinhood.com/instruments/df6c09dc-bb4f-4495-8c59-f13e6eb3641f/'
}

var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.orders(options, function(err, response, body){
        if(err){
            console.error('Error:', err);
        }else{
            console.log("orders");
            //console.log(body.results);
            const orders = body.results.map(order => {
                const {price, quantity, type, side, user_cancel_request_state} = order
                return {
                    id: order.id,
                    symbol: order.instrument.symbol,
                    type,
                    price,
                    quantity: Math.round(quantity),
                    side,
                    state: user_cancel_request_state
                }
            })
            console.log(orders)
        }
    })
});

/* 
order example
{
  next: null,
  previous: null,
  results: [
    {
      id: '670fe4fa-1973-4a33-aa89-9cfc113a5e43',
      ref_id: '13429E6D-2941-47A8-9011-A323EB17543B',
      url: 'https://api.robinhood.com/orders/670fe4fa-1973-4a33-aa89-9cfc113a5e43/',
      account: 'https://api.robinhood.com/accounts/5QS38123/',
      user_uuid: '6c67ba74-3de0-420a-895a-1a664732eed6',
      position: 'https://api.robinhood.com/positions/5QS38123/46dd49fa-6f7c-4936-8ae4-2d4ad1d4170a/',
      cancel: null,
      instrument: 'https://api.robinhood.com/instruments/46dd49fa-6f7c-4936-8ae4-2d4ad1d4170a/',
      instrument_id: '46dd49fa-6f7c-4936-8ae4-2d4ad1d4170a',
      cumulative_quantity: '10.00000000',
      average_price: '3.21500000',
      fees: '0.00',
      state: 'filled',
      derived_state: 'filled',
      pending_cancel_open_agent: null,
      type: 'market',
      side: 'buy',
      time_in_force: 'gfd',
      trigger: 'immediate',
      price: '3.22000000',
      stop_price: null,
      quantity: '10.00000000',
      reject_reason: null,
      created_at: '2024-10-16T16:08:26.436459Z',
      updated_at: '2024-10-16T16:08:26.804974Z',
      last_transaction_at: '2024-10-16T16:08:26.633000Z',
      executions: [Array],
      extended_hours: false,
      market_hours: 'regular_hours',
      override_dtbp_checks: false,
      override_day_trade_checks: false,
      response_category: null,
      stop_triggered_at: null,
      last_trail_price: null,
      last_trail_price_updated_at: null,
      last_trail_price_source: null,
      dollar_based_amount: null,
      drip_dividend_id: null,
      total_notional: [Object],
      executed_notional: [Object],
      investment_schedule_id: null,
      is_ipo_access_order: false,
      ipo_access_cancellation_reason: null,
      ipo_access_lower_collared_price: null,
      ipo_access_upper_collared_price: null,
      ipo_access_upper_price: null,
      ipo_access_lower_price: null,
      is_ipo_access_price_finalized: false,
      is_visible_to_user: true,
      has_ipo_access_custom_price_limit: false,
      is_primary_account: true,
      order_form_version: 6,
      preset_percent_limit: null,
      order_form_type: 'share_based_market_buys',
      last_update_version: 2,
      placed_agent: 'user',
      is_editable: false,
      replaces: null,
      user_cancel_request_state: 'order_finalized',
      tax_lot_selection_type: null
    }
  ]
}

*/