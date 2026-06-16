// Товары OblakoTeam
const products = [
    { id: 1, name: 'Чаша Oblako Phunnel M Stone', price: 490, cat: 'Чаши', img: '🏺' },
    { id: 2, name: 'Кальян Amy Deluxe SS (Black)', price: 3100, cat: 'Кальяны', img: '💨' },
    { id: 3, name: 'Колба Craft (Янтарь)', price: 600, cat: 'Колбы', img: '⚱️' },
    { id: 4, name: 'Щипцы Blade Hookah', price: 380, cat: 'Аксессуары', img: '✂️' },
    { id: 5, name: 'Шило Oblako Limited', price: 200, cat: 'Аксессуары', img: '📍' },
    { id: 6, name: 'Мундштук Carbon Pro', price: 250, cat: 'Аксессуары', img: '🐍' },
    { id: 7, name: 'Чаша Oblako Flow M', price: 530, cat: 'Чаши', img: '🌪️' }
];

let cart = JSON.parse(localStorage.getItem('oblakoteam_cart')) || [];

function render(items = products) {
    const grid = document.getElementById('products-grid');
    if(!grid) return;
    grid.innerHTML = items.map(p => `
        <div class="card">
            <div class="card-img">${p.img}</div>
            <p style="color:#aaa; font-size:11px; margin:0; text-transform:uppercase; letter-spacing:1px;">${p.cat}</p>
            <h3>${p.name}</h3>
            <span class="price">${p.price} ₴</span>
            <button class="buy-btn" onclick="addToCart(${p.id})">Купить +</button>
        </div>
    `).join('');
}

window.filterCat = (cat) => {
    if (cat === 'Все') render(products);
    else render(products.filter(p => p.cat === cat));
};

window.addToCart = (id) => {
    const p = products.find(x => x.id === id);
    cart.push(p);
    updateCart();
};

window.toggleCart = () => {
    const sb = document.getElementById('cart-sidebar');
    sb.classList.toggle('active');
    document.getElementById('cart-overlay').style.display = sb.classList.contains('active') ? 'block' : 'none';
};

function updateCart() {
    localStorage.setItem('oblakoteam_cart', JSON.stringify(cart));
    document.getElementById('cart-count').innerText = cart.length;
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = cart.map((item, i) => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <div style="font-size:14px; color:#111;"><b>${item.name}</b><br>${item.price} ₴</div>
            <button onclick="remove(${i})" style="border:none; background:none; color:#f87171; cursor:pointer;">✕</button>
        </div>
    `).join('');
    const total = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('cart-total').innerText = total + ' ₴';
}

window.remove = (i) => { cart.splice(i, 1); updateCart(); };

window.sendOrder = () => {
    if(cart.length === 0) return alert('Кошик порожній');
    
    // Формируем текст
    const text = cart.map(item => `- ${item.name} (${item.price} ₴)`).join('%0A');
    const total = cart.reduce((s, i) => s + i.price, 0);
    
    // Твой ник в Telegram
    const telegramUsername = "Market199"; 
    
    const message = `Вітаю! Хочу замовити в OblakoTeam:%0A%0A${text}%0A%0AРазом до оплати: ${total} ₴`;
    window.open(`https://t.me/${telegramUsername}?text=${message}`, '_blank');
};

render();
updateCart();