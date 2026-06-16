// Налаштування адмінки
const ADMIN_PASSWORD = "1234"; // Зміни на свій секретний пароль
const TELEGRAM_USERNAME = "OblakoTeam_Work"; 

// Масив товарів (Якщо в пам'яті браузера порожньо — завантажуємо базові товари)
let defaultProducts = [
    { id: 1, name: "Чохол Silicone Case Premium", price: 550, desc: "Оригінальний м'який силіконовий чохол з мікрофіброю всередині.", img: "item1.jpg" },
    { id: 2, name: "Захисне скло 5D Full Glue", price: 290, desc: "Надміцне гартоване скло з повним проклеюванням екрана.", img: "item2.jpg" },
    { id: 3, name: "Кабель Fast Charge Type-C 1m", price: 350, desc: "Швидка зарядка та синхронізація даних, міцне нейлонове обплетення.", img: "item3.jpg" }
];

// Завантаження товарів з локального сховища або дефолтних
let products = JSON.parse(localStorage.getItem('sky_products')) || defaultProducts;
let cart = [];

// При першому запуску сайту відразу малюємо каталог
document.addEventListener("DOMContentLoaded", () => {
    renderCatalog();
});

// Функція для виведення товарів у каталог магазину
function renderCatalog() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.desc || ''}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price} ₴</span>
                    <button class="buy-btn" onclick="addToCart('${product.name}', ${product.price})">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Логіка вітального екрану
function enterStore() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContents = document.querySelectorAll('.hidden-content');
    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.transform = 'scale(1.03)';
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        mainContents.forEach(el => el.classList.add('show-content'));
    }, 500);
}

// Управління вікнами авторизації адміна
function openAdminAuth() { document.getElementById('adminAuthModal').style.display = 'flex'; }
function closeAdminAuth() { document.getElementById('adminAuthModal').style.display = 'none'; document.getElementById('adminPassword').value = ''; }

// Перевірка пароля адміна
function checkAdminPassword() {
    const passInput = document.getElementById('adminPassword').value;
    if (passInput === ADMIN_PASSWORD) {
        closeAdminAuth();
        openAdminPanel();
    } else {
        alert("Невірний пароль адміністратора!");
    }
}

// Відкриття та оновлення панелі адміна
function openAdminPanel() {
    document.getElementById('adminPanelModal').style.display = 'flex';
    renderAdminProducts();
}
function closeAdminPanel() { document.getElementById('adminPanelModal').style.display = 'none'; }

// Виведення списку товарів усередині адмінки (з кнопкою Видалити)
function renderAdminProducts() {
    const container = document.getElementById('admin-items-container');
    container.innerHTML = '';

    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'admin-product-item';
        item.innerHTML = `
            <span>${product.name} (${product.price} ₴)</span>
            <button class="delete-product-btn" onclick="deleteProduct(${product.id})">Видалити</button>
        `;
        container.appendChild(item);
    });
}

// Додавання нового товару (включаючи обробку завантаженого фото)
function addNewProduct() {
    const name = document.getElementById('newProdName').value.trim();
    const price = parseInt(document.getElementById('newProdPrice').value);
    const desc = document.getElementById('newProdDesc').value.trim();
    const imageFile = document.getElementById('newProdImage').files[0];

    if (!name || !price) {
        alert("Будь ласка, вкажіть назву та ціну товару!");
        return;
    }

    // Якщо фото вибрано, перетворюємо його на Base64 рядок, щоб зберегти в пам'ять
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgData = e.target.result; // Це готове фото у вигляді тексту
            saveProductToArray(name, price, desc, imgData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // Якщо фото немає, ставимо дефолтну заглушку
        saveProductToArray(name, price, desc, 'item1.jpg');
    }
}

function saveProductToArray(name, price, desc, img) {
    const newProduct = {
        id: Date.now(), // Унікальний ID за часом створення
        name: name,
        price: price,
        desc: desc,
        img: img
    };

    products.push(newProduct);
    localStorage.setItem('sky_products', JSON.stringify(products)); // Зберігаємо в пам'ять
    
    // Очищаємо форму
    document.getElementById('newProdName').value = '';
    document.getElementById('newProdPrice').value = '';
    document.getElementById('newProdDesc').value = '';
    document.getElementById('newProdImage').value = '';

    // Оновлюємо інтерфейс сайту та адмінки
    renderAdminProducts();
    renderCatalog();
    alert("Товар успішно додано на сайт!");
}

// Видалення товару
function deleteProduct(id) {
    if (confirm("Ви впевнені, що хочете видалити цей товар?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('sky_products', JSON.stringify(products));
        renderAdminProducts();
        renderCatalog();
    }
}

// КОШИК ТА ЛОГІКА ЗАМОВЛЕННЯ (Без змін)
function toggleCart() { document.getElementById('cartModal').classList.toggle('active'); }

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) { existingItem.quantity += 1; } 
    else { cart.push({ name: name, price: price, quantity: 1 }); }
    updateCartUI();
}

function updateCartUI() {
    const cartCountEl = document.getElementById('cart-count');
    const itemsListEl = document.getElementById('cart-items-list');
    const totalPriceEl = document.getElementById('cart-total-price');

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalCount;
    itemsListEl.innerHTML = '';

    if (cart.length === 0) {
        itemsListEl.innerHTML = '<p class="empty-text">Кошик поки що порожній</p>';
        totalPriceEl.textContent = '0 ₴';
        return;
    }

    let totalSum = 0;
    cart.forEach(item => {
        const itemSum = item.price * item.quantity;
        totalSum += itemSum;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div>
                <div style="font-weight: 500; margin-bottom: 4px; font-size: 14px;">${item.name}</div>
                <small style="color: #6c757d;">${item.price} ₴ × ${item.quantity}</small>
            </div>
            <div style="font-weight: 600; color: #007bff; font-size: 15px;">${itemSum} ₴</div>
        `;
        itemsListEl.appendChild(itemDiv);
    });
    totalPriceEl.textContent = `${totalSum} ₴`;
}

function sendToTelegram() {
    if (cart.length === 0) { alert("Ваш кошик порожній!"); return; }
    let message = "Привіт, OblakoTeam! Я хочу зробити замовлення на вашому сайті:\n\n";
    let totalSum = 0;
    cart.forEach((item, index) => {
        const itemSum = item.price * item.quantity;
        totalSum += itemSum;
        message += `${index + 1}. 🛒 ${item.name} — ${item.quantity} шт. (${itemSum} ₴)\n`;
    });
    message += `\n💰 Загальна сума замовлення: ${totalSum} ₴`;
    window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`, '_blank');
    cart = [];
    updateCartUI();
    document.getElementById('cartModal').classList.remove('active');
    showThankYouModal();
}

function showThankYouModal() {
    const modal = document.createElement('div');
    modal.className = 'thank-you-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">✨</div>
            <h2>Дякуємо за замовлення!</h2>
            <p>Ваша заявка успішно сформована та надіслана.</p>
            <p>Менеджер уже чекає на вас у <strong>Telegram</strong>!</p>
            <button class="close-modal-btn" onclick="this.parentElement.parentElement.remove()">Чудово</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => { if (modal.parentNode) modal.remove(); }, 5000);
}
