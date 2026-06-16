// Начальная база данных товаров (если LocalStorage пуст)
const defaultProducts = [
    {
        id: 1,
        name: "Приватный Скрипт Sky Premium",
        price: 1490,
        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500",
        desc: "Полностью настроенный скрипт автоматизации с обходом систем защиты. Оптимизирован под OblakoTeam."
    },
    {
        id: 2,
        name: "Готовый Магазин Скриптов (Сборка)",
        price: 2990,
        img: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=500",
        desc: "Чистый HTML/CSS/JS шаблон магазина с адаптивной мобильной версткой и готовой панелью управления."
    }
];

// Загрузка товаров из хранилища браузера или дефолтных
let products = JSON.parse(localStorage.getItem('sky_store_products')) || defaultProducts;

// DOM Элементы
const productsContainer = document.getElementById('productsContainer');
const adminModal = document.getElementById('adminModal');
const openAdminBtn = document.getElementById('openAdminBtn');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const loginAdminBtn = document.getElementById('loginAdminBtn');
const saveProductBtn = document.getElementById('saveProductBtn');

const adminPasswordInput = document.getElementById('adminPassword');
const adminAuthBlock = document.getElementById('adminAuthBlock');
const adminControlBlock = document.getElementById('adminControlBlock');
const adminProductsList = document.getElementById('adminProductsList');

// Функция вывода каталога на главную страницу
function renderCatalog() {
    productsContainer.innerHTML = '';
    
    if(products.length === 0) {
        productsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666;">Каталог пуст. Добавьте товары через админку.</p>`;
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-desc">${product.desc}</div>
                <div class="product-bottom">
                    <div class="product-price">${product.price} ₽</div>
                    <button class="btn-buy" onclick="alert('Вы покупаете: ${product.name}')">Купить</button>
                </div>
            </div>
        `;
        productsContainer.appendChild(card);
    });
}

// Функция вывода списка товаров в самой админке для удаления
function renderAdminList() {
    adminProductsList.innerHTML = '';
    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'admin-product-item';
        item.innerHTML = `
            <span>${product.name} (${product.price} руб)</span>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">Удалить</button>
        `;
        adminProductsList.appendChild(item);
    });
}

// Открытие и закрытие модалки
openAdminBtn.addEventListener('click', () => {
    adminModal.style.display = 'flex';
});

function closeAdminModal() {
    adminModal.style.display = 'none';
    // Сбрасываем авторизацию при закрытии ради безопасности
    adminPasswordInput.value = '';
    adminAuthBlock.style.display = 'block';
    adminControlBlock.style.display = 'none';
    closeAuthBtn.style.display = 'block';
}

closeAdminBtn.addEventListener('click', closeAdminModal);
closeAuthBtn.addEventListener('click', closeAdminModal);

// Авторизация в админке (Пароль: 1234)
loginAdminBtn.addEventListener('click', () => {
    if (adminPasswordInput.value === '1234') {
        adminAuthBlock.style.display = 'none';
        closeAuthBtn.style.display = 'none';
        adminControlBlock.style.display = 'block';
        renderAdminList();
    } else {
        alert('Неверный пароль администратора!');
    }
});

// Добавление нового товара
saveProductBtn.addEventListener('click', () => {
    const name = document.getElementById('newProdName').value.trim();
    const price = parseInt(document.getElementById('newProdPrice').value);
    let img = document.getElementById('newProdImg').value.trim();
    const desc = document.getElementById('newProdDesc').value.trim();

    if (!name || !price || !desc) {
        alert('Пожалуйста, заполните поля названия, цены и описания!');
        return;
    }

    // Если картинка не указана, ставим заглушку
    if (!img) {
        img = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500';
    }

    const newProduct = {
        id: Date.now(), // Уникальный ID через метку времени
        name: name,
        price: price,
        img: img,
        desc: desc
    };

    products.push(newProduct);
    saveToStorage();
    
    // Сброс полей ввода
    document.getElementById('newProdName').value = '';
    document.getElementById('newProdPrice').value = '';
    document.getElementById('newProdImg').value = '';
    document.getElementById('newProdDesc').value = '';

    // Обновляем списки везде
    renderCatalog();
    renderAdminList();
    alert('Товар успешно добавлен на витрину!');
});

// Удаление товара
window.deleteProduct = function(id) {
    if(confirm('Вы действительно хотите удалить этот товар?')) {
        products = products.filter(p => p.id !== id);
        saveToStorage();
        renderCatalog();
        renderAdminList();
    }
};

// Сохранение в LocalStorage
function saveToStorage() {
    localStorage.setItem('sky_store_products', JSON.stringify(products));
}

// Запуск при старте страницы
renderCatalog();
