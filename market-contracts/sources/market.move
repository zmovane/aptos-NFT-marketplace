module Dollars1200PerHour::market{
    use std::signer;
    use std::string::String;
    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_std::event::{Self, EventHandle};    
    use aptos_std::table::{Self, Table};
    use aptos_token::token;
    use aptos_token::token_coin_swap::{ list_token_for_swap, exchange_coin_for_token };

    const ESELLER_CAN_NOT_BE_BUYER: u64 = 1;
    const FEE_DENOMINATOR: u64 = 10000;

    struct MarketId has store, drop, copy {
        market_name: String,
        market_address: address,
    }

    struct Market has key {
        market_id: MarketId,
        fee_numerator: u64,
        fee_payee: address,
        signer_cap: account::SignerCapability
    }

    struct MarketEvents has key {
        create_market_event: EventHandle<CreateMarketEvent>,
        list_token_events: EventHandle<ListTokenEvent>,
        buy_token_events: EventHandle<BuyTokenEvent>
    }

    struct ListedItems has key {
        items: Table<token::TokenId, ListedItem>
    }

    struct ListedItem has drop, store {
        market_id : MarketId,
        token_owner: address,
        price: u64,
    }

    struct CreateMarketEvent has drop, store {
        market_id: MarketId,
        fee_numerator: u64,
        fee_payee: address,
    }

    struct ListTokenEvent has drop, store {
        market_id: MarketId,
        token_id: token::TokenId,
        token_owner: address,
        price: u64
    }

    struct BuyTokenEvent has drop, store {
        market_id: MarketId,
        token_id: token::TokenId,
        token_owner: address,
        buyer: address,
        price: u64
    }

    fun get_resource_account_cap(market_address : address) : signer acquires Market{
        let market = borrow_global<Market>(market_address);
        account::create_signer_with_capability(&market.signer_cap)
    }

    public fun create_market<CoinType>(sender: &signer, market_name: String, fee_numerator: u64, fee_payee: address) acquires MarketEvents, Market {        
        let sender_addr = signer::address_of(sender);
        let market_id = MarketId { market_name, market_address: sender_addr };
        if(!exists<MarketEvents>(sender_addr)){
            move_to(sender, MarketEvents{
                create_market_event: account::new_event_handle<CreateMarketEvent>(sender),
                list_token_events: account::new_event_handle<ListTokenEvent>(sender),
                buy_token_events: account::new_event_handle<BuyTokenEvent>(sender)
            });
        };
        if(!exists<ListedItems>(sender_addr)){
            move_to(sender, ListedItems{
                items: table::new()
            });
        };
        if(!exists<Market>(sender_addr)){
            let (resource_signer, signer_cap) = account::create_resource_account(sender, x"01");
            token::initialize_token_store(&resource_signer);
            move_to(sender, Market{
                market_id, fee_numerator, fee_payee, signer_cap
            });
            let market_events = borrow_global_mut<MarketEvents>(sender_addr);
            event::emit_event(&mut market_events.create_market_event, CreateMarketEvent{ market_id, fee_numerator, fee_payee });
        };
        let resource_signer = get_resource_account_cap(sender_addr);
        if(!coin::is_account_registered<CoinType>(signer::address_of(&resource_signer))){
            coin::register<CoinType>(&resource_signer);
        };
    }

    public fun list_token<CoinType>(market_address:address, market_name: String, token_owner: &signer, creator: address, collection: String, name: String, property_version: u64, price: u64) acquires MarketEvents, Market, ListedItems {
        let market_id = MarketId { market_name, market_address };
        let resource_signer = get_resource_account_cap(market_address);
        let token_owner_addr = signer::address_of(token_owner);
        let token_id = token::create_token_id_raw(creator, collection, name, property_version);
        let token = token::withdraw_token(token_owner, token_id, 1);

        token::deposit_token(&resource_signer, token);
        list_token_for_swap<CoinType>(&resource_signer, creator, collection, name, property_version, 1, price, 0);

        let listed_items = borrow_global_mut<ListedItems>(market_address);
        table::add(&mut listed_items.items, token_id, ListedItem {
            market_id, token_owner: token_owner_addr, price
        });

        let market_events = borrow_global_mut<MarketEvents>(market_address);
        event::emit_event(&mut market_events.list_token_events, ListTokenEvent{
            market_id, token_id, token_owner: token_owner_addr, price
        });
    } 

    public fun buy_token<CoinType>(market_address: address, market_name: String, buyer: &signer, creator: address, collection: String, name: String, property_version: u64, price: u64) acquires MarketEvents, Market, ListedItems{
        let market_id = MarketId { market_name, market_address };
        let token_id = token::create_token_id_raw(creator, collection, name, property_version);
        let listed_items = borrow_global_mut<ListedItems>(market_address);
        let token_owner = table::borrow(&listed_items.items, token_id).token_owner;
        let buyer_addr = signer::address_of(buyer);
        assert!(token_owner != buyer_addr, ESELLER_CAN_NOT_BE_BUYER);

        let resource_signer = get_resource_account_cap(market_address);
        exchange_coin_for_token<CoinType>(buyer, price, signer::address_of(&resource_signer), creator, collection, name, property_version, 1);
        
        let royalty = token::get_royalty(token_id);
        let royalty_fee = price * token::get_royalty_numerator(&royalty) / token::get_royalty_denominator(&royalty);
        let market = borrow_global<Market>(market_address);
        let market_fee = price * market.fee_numerator / FEE_DENOMINATOR;
        let amount = price - royalty_fee - market_fee;
        let coins = coin::withdraw<CoinType>(&resource_signer, amount);
        coin::deposit<CoinType>(token_owner, coins);
        table::remove(&mut listed_items.items, token_id);
        let market_events = borrow_global_mut<MarketEvents>(market_address);
        event::emit_event(&mut market_events.buy_token_events, BuyTokenEvent{
            market_id ,token_id, token_owner, buyer: buyer_addr, price
        });
    }
}