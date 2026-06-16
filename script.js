// Конфигурация Telegram (Замени юзернейм на свой без знака @)
const TELEGRAM_USERNAME = "ТВОЙ_ТЕЛЕГРАМ_НИК";

// Дефолтные товары магазина
let products = [
    { id: 1, name: "Приватный Скрипт SkyHack", price: 490, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400" },
    { id: 2, name: "Игровая валюта (Премиум)", price: 250, img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400" },
    { id: 3, name: "Набор читов Oblako Pack", price: 990, img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400" }
];

// Состояние корзины
let cart = [];

// DOM Элементы
const productsContainer = document.getElementById('productsContainer');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

// Элементы админки
const adminModal = document.getElementById('adminModal');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const addProdBtn = document.getElementById('addProdBtn');
const adminItemsList = document.getElementById('adminItemsList');

// Инициализация отображения витрины
function renderProducts() {
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">${product.price} руб.</div>
            <button class="btn" onclick="addToCart(${product.id})">В корзину</button>
        `;
        productsContainer.appendChild(card);
    });
}

// Добавление товара в корзину
window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
};

// Удаление товара из корзины
window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
};

// Обновление состояния корзины
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>${item.quantity} x ${item.price} руб.</span>
            </div>
            <button class="btn-remove" onclick="removeFromCart(${item.id})">Удалить</button>
        `;
        cartItemsContainer.appendChild(row);
    });

    cartTotalPrice.innerText = `${total} руб.`;
    cartCount.innerText = count;
}

// Открытие и закрытие корзины
cartIcon.addEventListener('click', () => cartModal.classList.add('active'));
closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));

// Сворачивание корзины при нажатии на ЛЮБУЮ область сайта (вне контента корзины)
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

// Секретные клавиши для Админки: Ctrl + Shift + A
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'ф' || e.key === 'Ф')) {
        e.preventDefault();
        const password = prompt("Введите секретный пароль администратора:");
        if (password === "1234") {
            openAdminPanel();
        } else if (password !== null) {
            alert("Неверный пароль!");
        }
    }
});

// Функции Админ-панели
function openAdminPanel() {
    adminModal.classList.add('active');
    renderAdminItems();
}

closeAdminBtn.addEventListener('click', () => adminModal.classList.remove('active'));

function renderAdminItems() {
    adminItemsList.innerHTML = '';
    products.forEach(product => {
        const row = document.createElement('div');
        row.className = 'admin-item-row';
        row.innerHTML = `
            <span>${product.name} (${product.price} руб.)</span>
            <button class="btn-remove" onclick="deleteProduct(${product.id})">Удалить</button>
        `;
        adminItemsList.appendChild(row);
    });
}

// Добавление нового товара из админки
addProdBtn.addEventListener('click', () => {
    const name = document.getElementById('newProdName').value;
    const price = parseInt(document.getElementById('newProdPrice').value);
    let img = document.getElementById('newProdImg').value;

    if (!name || !price) {
        alert("Заполните название и цену!");
        return;
    }
    if (!img) img = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400";

    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        img: img
    };

    products.push(newProduct);
    renderProducts();
    renderAdminItems();

    // Очищаем форму
    document.getElementById('newProdName').value = '';
    document.getElementById('newProdPrice').value = '';
    document.getElementById('newProdImg').value = '';
});

// Удаление товара из админки
window.deleteProduct = function(id) {
    products = products.filter(p => p.id !== id);
    renderProducts();
    renderAdminItems();
};

// Оформление заказа и отправка данных в Telegram
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Ваша корзина пуста!");
        return;
    }

    let message = "Привет! Я хочу сделать заказ в OblakoTeam Store:\n\n";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${index + 1}. ${item.name} — ${item.quantity} шт. (${itemTotal} руб.)\n`;
    });

    message += `\nИтоговая сумма заказа: ${total} руб.`;

    // Кодируем текст для URL и осуществляем переход в Telegram
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${encodedMessage}`, '_blank');
    
    // Очищаем корзину после отправки
    cart = [];
    updateCart();
    cartModal.classList.remove('active');
});

// Старт приложения
renderProducts();
