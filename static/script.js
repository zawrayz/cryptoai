document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const cryptoList = document.getElementById('crypto-list');
    const modal = document.getElementById('crypto-modal');
    const closeModal = document.getElementById('close');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    
    // Global crypto data
    let cryptoData = [];
    let filteredData = [];
    
    // Initialize the dashboard
    fetchCryptoData();
    
    // Event listeners
    closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
    });
    
    searchInput.addEventListener('input', (e) => {
    filterCrypto(e.target.value);
    });
    
    filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Apply filter
        filterCryptoByType(button.dataset.filter);
    });
    });
    
    refreshBtn.addEventListener('click', () => {
    refreshBtn.classList.add('rotating');
    fetchCryptoData();
    setTimeout(() => {
        refreshBtn.classList.remove('rotating');
    }, 1000);
    });
    
    // Fetch cryptocurrency data
    function fetchCryptoData() {
    // In a real application, you would fetch from an API
    // For this example, we'll use mock data
    cryptoData = generateMockData();
    filteredData = [...cryptoData];
    renderCryptoList(filteredData);
    updateGlobalStats();
    }
    
    // Render cryptocurrency list
    function renderCryptoList(data) {
    cryptoList.innerHTML = '';
    
    if (data.length === 0) {
        cryptoList.innerHTML = '<p class="no-results">No cryptocurrencies found</p>';
        return;
    }
    
    data.forEach(crypto => {
        const card = document.createElement('div');
        card.className = 'crypto-card';
        card.innerHTML = `
        <div class="crypto-header">
            <div class="crypto-name">
            <img src="${crypto.icon}" alt="${crypto.name}" class="crypto-icon">
            <div class="crypto-name-text">
                <h3>${crypto.name}</h3>
                <p>${crypto.symbol}</p>
            </div>
            </div>
            <div class="crypto-price">
            <h3>${formatPrice(crypto.price)}</h3>
            <div class="price-change ${crypto.priceChange24h >= 0 ? 'positive' : 'negative'}">
                <i class="fas ${crypto.priceChange24h >= 0 ? 'fa-caret-up' : 'fa-caret-down'}"></i>
                ${Math.abs(crypto.priceChange24h)}%
            </div>
            </div>
        </div>
        <div class="crypto-stats">
            <div class="stat">
            <div class="stat-value">${formatMarketCap(crypto.marketCap)}</div>
            <div class="stat-label">Market Cap</div>
            </div>
            <div class="stat">
            <div class="stat-value">${formatVolume(crypto.volume)}</div>
            <div class="stat-label">Volume 24h</div>
            </div>
        </div>
        `;
        
        card.addEventListener('click', () => {
        openModal(crypto);
        });
        
        cryptoList.appendChild(card);
    });
    }
    
    // Open modal with crypto details
    function openModal(crypto) {
    document.getElementById('modal-crypto-icon').src = crypto.icon;
    document.getElementById('crypto-name').textContent = crypto.name;
    document.getElementById('crypto-symbol').textContent = crypto.symbol;
    document.getElementById('crypto-price').textContent = formatPrice(crypto.price);
    
    const priceChangeElem = document.getElementById('crypto-price-change');
    priceChangeElem.innerHTML = `
        <span class="price-change ${crypto.priceChange24h >= 0 ? 'positive' : 'negative'}">
        <i class="fas ${crypto.priceChange24h >= 0 ? 'fa-caret-up' : 'fa-caret-down'}"></i>
        ${Math.abs(crypto.priceChange24h)}%
        </span>
    `;
    
    document.getElementById('crypto-marketcap').textContent = formatMarketCap(crypto.marketCap);
    document.getElementById('crypto-volume').textContent = formatVolume(crypto.volume);
    document.getElementById('crypto-supply').textContent = formatSupply(crypto.circulatingSupply, crypto.symbol);
    document.getElementById('crypto-total-supply').textContent = formatSupply(crypto.totalSupply, crypto.symbol);
    document.getElementById('crypto-ath').textContent = formatPrice(crypto.ath);
    document.getElementById('crypto-rank').textContent = `#${crypto.rank}`;
    
    modal.style.display = 'block';
    }
    
    // Filter cryptocurrencies by search term
    function filterCrypto(searchTerm) {
    if (!searchTerm) {
        filteredData = [...cryptoData];
    } else {
        filteredData = cryptoData.filter(crypto => 
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Apply active filter
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    filterCryptoByType(activeFilter, false);
    }
    
    // Filter cryptocurrencies by type
    function filterCryptoByType(filterType, resetSearch = true) {
    if (resetSearch) {
        searchInput.value = '';
    }
    
    let dataToFilter = resetSearch ? [...cryptoData] : [...filteredData];
    
    switch(filterType) {
        case 'all':
        filteredData = dataToFilter;
        break;
        case 'gainers':
        filteredData = dataToFilter.filter(crypto => crypto.priceChange24h > 0)
                                    .sort((a, b) => b.priceChange24h - a.priceChange24h);
        break;
        case 'losers':
        filteredData = dataToFilter.filter(crypto => crypto.priceChange24h < 0)
                                    .sort((a, b) => a.priceChange24h - b.priceChange24h);
        break;
        case 'volume':
        filteredData = dataToFilter.sort((a, b) => b.volume - a.volume);
        break;
    }
    
    renderCryptoList(filteredData);
    }
    
    // Update global statistics
    function updateGlobalStats() {
    // Calculate total market cap and volume
    const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.marketCap, 0);
    const totalVolume = cryptoData.reduce((sum, crypto) => sum + crypto.volume, 0);
    
    document.getElementById('total-marketcap').textContent = formatMarketCap(totalMarketCap);
    document.getElementById('total-volume').textContent = formatVolume(totalVolume);
    }
    
    // Format price with commas and dollar sign
    function formatPrice(price) {
    return '$' + price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: price < 1 ? 6 : 2
    });
    }
    
    // Format market cap in billions or millions
    function formatMarketCap(marketCap) {
    if (marketCap >= 1e9) {
        return '$' + (marketCap / 1e9).toFixed(2) + 'B';
    } else if (marketCap >= 1e6) {
        return '$' + (marketCap / 1e6).toFixed(2) + 'M';
    } else {
        return '$' + marketCap.toLocaleString();
    }
    }
    
    // Format volume in billions or millions
    function formatVolume(volume) {
    if (volume >= 1e9) {
        return '$' + (volume / 1e9).toFixed(2) + 'B';
    } else if (volume >= 1e6) {
        return '$' + (volume / 1e6).toFixed(2) + 'M';
    } else {
        return '$' + volume.toLocaleString();
    }
    }
    
    // Format supply with symbol
    function formatSupply(supply, symbol) {
    if (supply >= 1e9) {
        return (supply / 1e9).toFixed(2) + 'B ' + symbol;
    } else if (supply >= 1e6) {
        return (supply / 1e6).toFixed(2) + 'M ' + symbol;
    } else {
        return supply.toLocaleString() + ' ' + symbol;
    }
    }
    
    // Generate mock cryptocurrency data
    function generateMockData() {
    const cryptocurrencies = [
        { name: 'Bitcoin', symbol: 'BTC', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg' },
        { name: 'Ethereum', symbol: 'ETH', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg' },
        { name: 'Binance Coin', symbol: 'BNB', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bnb.svg' },
        { name: 'Cardano', symbol: 'ADA', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/ada.svg' },
        { name: 'XRP', symbol: 'XRP', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/xrp.svg' },
        { name: 'Solana', symbol: 'SOL', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/sol.svg' },
        { name: 'Polkadot', symbol: 'DOT', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/dot.svg' },
        { name: 'Dogecoin', symbol: 'DOGE', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/doge.svg' },
        { name: 'Avalanche', symbol: 'AVAX', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/avax.svg' },
        { name: 'Polygon', symbol: 'MATIC', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/matic.svg' },
        { name: 'Litecoin', symbol: 'LTC', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/ltc.svg' },
        { name: 'Chainlink', symbol: 'LINK', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/link.svg' },
        { name: 'Stellar', symbol: 'XLM', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/xlm.svg' },
        { name: 'Bitcoin Cash', symbol: 'BCH', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bch.svg' },
        { name: 'Algorand', symbol: 'ALGO', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/algo.svg' },
        { name: 'Uniswap', symbol: 'UNI', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/uni.svg' },
        { name: 'VeChain', symbol: 'VET', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/vet.svg' },
        { name: 'Cosmos', symbol: 'ATOM', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/atom.svg' },
        { name: 'Filecoin', symbol: 'FIL', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/fil.svg' },
        { name: 'Tezos', symbol: 'XTZ', icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/xtz.svg' }
    ];
    
    return cryptocurrencies.map((crypto, index) => {
        const price = Math.random() * 10000 + 10;
        const priceChange24h = (Math.random() * 10 - 5);
        const marketCap = Math.random() * 100000000000 + 1000000000;
        const volume = Math.random() * 5000000000 + 100000000;
        const circulatingSupply = Math.random() * 1000000000 + 10000000;
        const totalSupply = circulatingSupply * (1 + Math.random() * 0.5);
        const ath = price * (1 + Math.random() * 2);
        
        return {
        ...crypto,
        rank: index + 1,
        price,
        priceChange24h,
        marketCap,
        volume,
        circulatingSupply,
        totalSupply,
        ath
        };
    });
    }
});
