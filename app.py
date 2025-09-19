from flask import Flask, render_template, jsonify
import random
from datetime import datetime, timedelta

app = Flask(__name__)

# Generate realistic cryptocurrency data with proper computation
def generate_crypto_data():
    cryptos = []
    base_data = [
        {"name": "Bitcoin", "symbol": "BTC", "base_price": 63000, "volatility": 0.08},
        {"name": "Ethereum", "symbol": "ETH", "base_price": 3200, "volatility": 0.10},
        {"name": "Binance Coin", "symbol": "BNB", "base_price": 580, "volatility": 0.12},
        {"name": "Cardano", "symbol": "ADA", "base_price": 0.45, "volatility": 0.15},
        {"name": "Solana", "symbol": "SOL", "base_price": 130, "volatility": 0.18},
        {"name": "Ripple", "symbol": "XRP", "base_price": 0.52, "volatility": 0.13},
        {"name": "Polkadot", "symbol": "DOT", "base_price": 6.80, "volatility": 0.14},
        {"name": "Dogecoin", "symbol": "DOGE", "base_price": 0.12, "volatility": 0.20},
        {"name": "Litecoin", "symbol": "LTC", "base_price": 80, "volatility": 0.11},
        {"name": "Avalanche", "symbol": "AVAX", "base_price": 35, "volatility": 0.16},
        {"name": "Shiba Inu", "symbol": "SHIB", "base_price": 0.000025, "volatility": 0.25},
        {"name": "Tron", "symbol": "TRX", "base_price": 0.12, "volatility": 0.12},
        {"name": "Cosmos", "symbol": "ATOM", "base_price": 8.50, "volatility": 0.14},
        {"name": "Monero", "symbol": "XMR", "base_price": 170, "volatility": 0.09},
        {"name": "Stellar", "symbol": "XLM", "base_price": 0.11, "volatility": 0.13},
        {"name": "VeChain", "symbol": "VET", "base_price": 0.03, "volatility": 0.16},
        {"name": "NEAR Protocol", "symbol": "NEAR", "base_price": 7.20, "volatility": 0.17},
        {"name": "Algorand", "symbol": "ALGO", "base_price": 0.18, "volatility": 0.15},
        {"name": "Internet Computer", "symbol": "ICP", "base_price": 12.50, "volatility": 0.19},
        {"name": "ApeCoin", "symbol": "APE", "base_price": 1.20, "volatility": 0.22}
    ]
    
    icons = {
        "BTC": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg",
        "ETH": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg",
        "BNB": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bnb.svg",
        "ADA": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/ada.svg",
        "SOL": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/sol.svg",
        "XRP": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/xrp.svg",
        "DOT": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/dot.svg",
        "DOGE": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/doge.svg",
        "LTC": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/ltc.svg",
        "AVAX": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/avax.svg",
        "SHIB": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/shib.svg",
        "TRX": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/trx.svg",
        "ATOM": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/atom.svg",
        "XMR": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/xmr.svg",
        "XLM": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/xlm.svg",
        "VET": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/vet.svg",
        "NEAR": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/near.svg",
        "ALGO": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/algo.svg",
        "ICP": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/icp.svg",
        "APE": "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/ape.svg"
    }
    
    for i, crypto_base in enumerate(base_data):
        # Generate realistic price with volatility
        volatility_factor = 1 + (random.random() * 2 - 1) * crypto_base["volatility"]
        price = round(crypto_base["base_price"] * volatility_factor, 6 if crypto_base["base_price"] < 1 else 2)
        
        # Generate price change percentage based on volatility
        price_change_24h = round((random.random() * 2 - 1) * crypto_base["volatility"] * 100, 2)
        
        # Generate market cap based on price with some randomness
        market_cap = round((0.8 + random.random() * 0.4) * crypto_base["base_price"] * 1000000000, 2)
        
        # Generate volume based on market cap with some randomness
        volume = round((0.05 + random.random() * 0.1) * market_cap, 2)
        
        # Generate supply values
        circulating_supply = round(random.uniform(1000000, 100000000000), 2)
        total_supply = circulating_supply * (1.0 + random.random() * 0.5)
        
        # Generate all-time high
        ath = round(price * (1.2 + random.random() * 1.8), 2)
        
        # Generate price history for charts (last 30 days)
        price_history = []
        current_price = price
        for j in range(30):
            day_volatility = crypto_base["volatility"] / 5  # Daily volatility is lower
            change_factor = 1 + (random.random() * 2 - 1) * day_volatility
            current_price = round(current_price * change_factor, 6 if crypto_base["base_price"] < 1 else 2)
            price_history.append({
                "time": (datetime.now() - timedelta(days=30-j)).timestamp(),
                "value": current_price
            })
        
        cryptos.append({
            "id": i + 1,
            "name": crypto_base["name"],
            "symbol": crypto_base["symbol"],
            "icon": icons[crypto_base["symbol"]],
            "price": price,
            "priceChange24h": price_change_24h,
            "marketCap": market_cap,
            "volume": volume,
            "circulatingSupply": circulating_supply,
            "totalSupply": total_supply,
            "ath": ath,
            "rank": i + 1,
            "priceHistory": price_history,
            "lastUpdated": datetime.now().isoformat()
        })
    
    return cryptos

# Global stats calculation
def get_global_stats(cryptos):
    total_market_cap = sum(crypto["marketCap"] for crypto in cryptos)
    total_volume = sum(crypto["volume"] for crypto in cryptos)
    
    return {
        "totalMarketCap": total_market_cap,
        "totalVolume": total_volume,
        "btcDominance": round((cryptos[0]["marketCap"] / total_market_cap) * 100, 2),
        "activeCryptos": len(cryptos),
        "lastUpdated": datetime.now().isoformat()
    }

# Format numbers for display
def format_crypto_data(cryptos):
    formatted_cryptos = []
    for crypto in cryptos:
        # Format price
        if crypto["price"] < 0.01:
            price_formatted = f"${crypto['price']:.6f}"
        elif crypto["price"] < 1:
            price_formatted = f"${crypto['price']:.4f}"
        else:
            price_formatted = f"${crypto['price']:,.2f}"
        
        # Format market cap
        if crypto["marketCap"] >= 1e9:
            market_cap_formatted = f"${crypto['marketCap']/1e9:.2f}B"
        elif crypto["marketCap"] >= 1e6:
            market_cap_formatted = f"${crypto['marketCap']/1e6:.2f}M"
        else:
            market_cap_formatted = f"${crypto['marketCap']:,.2f}"
        
        # Format volume
        if crypto["volume"] >= 1e9:
            volume_formatted = f"${crypto['volume']/1e9:.2f}B"
        elif crypto["volume"] >= 1e6:
            volume_formatted = f"${crypto['volume']/1e6:.2f}M"
        else:
            volume_formatted = f"${crypto['volume']:,.2f}"
        
        # Format supply
        if crypto["circulatingSupply"] >= 1e9:
            supply_formatted = f"{crypto['circulatingSupply']/1e9:.2f}B {crypto['symbol']}"
        elif crypto["circulatingSupply"] >= 1e6:
            supply_formatted = f"{crypto['circulatingSupply']/1e6:.2f}M {crypto['symbol']}"
        else:
            supply_formatted = f"{crypto['circulatingSupply']:,.2f} {crypto['symbol']}"
        
        # Format total supply
        if crypto["totalSupply"] >= 1e9:
            total_supply_formatted = f"{crypto['totalSupply']/1e9:.2f}B {crypto['symbol']}"
        elif crypto["totalSupply"] >= 1e6:
            total_supply_formatted = f"{crypto['totalSupply']/1e6:.2f}M {crypto['symbol']}"
        else:
            total_supply_formatted = f"{crypto['totalSupply']:,.2f} {crypto['symbol']}"
        
        # Format ATH
        if crypto["ath"] < 0.01:
            ath_formatted = f"${crypto['ath']:.6f}"
        elif crypto["ath"] < 1:
            ath_formatted = f"${crypto['ath']:.4f}"
        else:
            ath_formatted = f"${crypto['ath']:,.2f}"
        
        formatted_cryptos.append({
            **crypto,
            "priceFormatted": price_formatted,
            "marketCapFormatted": market_cap_formatted,
            "volumeFormatted": volume_formatted,
            "supplyFormatted": supply_formatted,
            "totalSupplyFormatted": total_supply_formatted,
            "athFormatted": ath_formatted,
            "priceChange24hFormatted": f"{crypto['priceChange24h']:+.2f}%",
            "priceChange24hClass": "positive" if crypto["priceChange24h"] >= 0 else "negative"
        })
    
    return formatted_cryptos

# Generate initial data
cryptos = generate_crypto_data()
global_stats = get_global_stats(cryptos)
formatted_cryptos = format_crypto_data(cryptos)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/cryptos")
def get_cryptos():
    return jsonify({
        "anye": formatted_cryptos,
        "globalStats": {
            "totalMarketCap": f"${global_stats['totalMarketCap']/1e12:.2f}T",
            "totalVolume": f"${global_stats['totalVolume']/1e9:.2f}B",
            "btcDominance": f"{global_stats['btcDominance']:.2f}%",
            "activeCryptos": f"{global_stats['activeCryptos']}",
            "lastUpdated": global_stats["lastUpdated"]
        }
    })

@app.route("/api/crypto/<int:crypto_id>")
def get_crypto(crypto_id):
    crypto = next((c for c in formatted_cryptos if c["id"] == crypto_id), None)
    if crypto:
        return jsonify(crypto)
    return jsonify({"error": "Cryptocurrency not found"}), 404

# Endpoint to refresh data
@app.route("/api/refresh-data")
def refresh_data():
    global cryptos, global_stats, formatted_cryptos
    cryptos = generate_crypto_data()
    global_stats = get_global_stats(cryptos)
    formatted_cryptos = format_crypto_data(cryptos)
    return jsonify({"status": "success", "message": "Data refreshed successfully"})

if __name__ == "__main__":
    app.run(debug=True)