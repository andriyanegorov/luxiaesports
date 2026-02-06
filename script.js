// --- Данные игроков ---
const playersData = {
    cs2: [
        { id: 1, nickname: "hakuji", role: "IGL | Rifler", kd: "1.00", hs: "100%", img: "https://storage.yandexcloud.net/vitmeny/public/19601/images/bKPGX97LdaCmvGRq20260104180338695aab7a72ee4.png" },
        { id: 2, nickname: "S1ence", role: "Sniper", kd: "1.00", hs: "100%", img: "https://storage.yandexcloud.net/vitmeny/public/19843/images/ceFJGGneUqZpLxzb20260104155104695a8c6803c71.png" }
    ],
    so2: [
        { id: 3, nickname: "hakuji", role: "ENTRY FRAGGER | IGL", kd: "2.10", hs: "75%", img: "https://storage.yandexcloud.net/vitmeny/public/19601/images/bKPGX97LdaCmvGRq20260104180338695aab7a72ee4.png" },
        { id: 4, nickname: "S1ence", role: "Rifler", kd: "1.58", hs: "40%", img: "https://storage.yandexcloud.net/vitmeny/public/19843/images/ceFJGGneUqZpLxzb20260104155104695a8c6803c71.png" },
        { id: 5, nickname: "ailime", role: "COACH", kd: "1.00", hs: "100%", img: "https://storage.yandexcloud.net/vitmeny/public/19601/images/nOAxKqqM0poX0xmg202512171342546942b35e4890b.png" }
    ]
};

// --- Элементы DOM ---
const rosterContainer = document.getElementById('roster-container');
const tabs = document.querySelectorAll('.tab-btn');
const modalOverlay = document.getElementById('player-modal');
const closeModalBtn = document.querySelector('.close-modal');

// Модальные элементы
const mImg = document.getElementById('m-img');
const mNick = document.getElementById('m-nick');
const mRole = document.getElementById('m-role');
const mKd = document.getElementById('m-kd');
const mHs = document.getElementById('m-hs');

// --- Кастомный Курсор ---
const cursor = document.querySelector('.cursor');
const cursor2 = document.querySelector('.cursor2');

document.addEventListener('mousemove', function(e){
    if(cursor && cursor2) {
        cursor.style.cssText = cursor2.style.cssText = "left: " + e.clientX + "px; top: " + e.clientY + "px;";
    }
});

// Добавляем эффекты при наведении на интерактивные элементы
const interactiveElements = document.querySelectorAll('a, button, .player-card-wrapper, input');
interactiveElements.forEach(el => {
    el.addEventListener('mouseover', () => cursor2.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor2.classList.remove('hovered'));
});


// --- Функции Рендеринга ---

function renderRoster(gameKey) {
    if(!rosterContainer) return;
    rosterContainer.innerHTML = ''; // Очистка
    const players = playersData[gameKey];

    players.forEach(player => {
        // Создаем обертку для 3D эффекта
        const wrapper = document.createElement('div');
        wrapper.classList.add('player-card-wrapper');
        // Добавляем атрибуты для VanillaTilt
        wrapper.setAttribute('data-tilt', '');
        wrapper.setAttribute('data-tilt-scale', '1.05');
        wrapper.setAttribute('data-tilt-max', '15');
        wrapper.setAttribute('data-tilt-glare', '');
        wrapper.setAttribute('data-tilt-max-glare', '0.4');

        wrapper.innerHTML = `
            <div class="player-card glass-panel">
                <div class="card-image-box">
                    <img src="${player.img}" alt="${player.nickname}">
                </div>
                <div class="card-content">
                    <h3>${player.nickname}</h3>
                    <span class="card-role text-red">${player.role}</span>
                </div>
            </div>
        `;

        // Клик для открытия модалки
        wrapper.addEventListener('click', () => openModal(player));
        // Ховер для курсора
        wrapper.addEventListener('mouseover', () => cursor2.classList.add('hovered'));
        wrapper.addEventListener('mouseleave', () => cursor2.classList.remove('hovered'));
        
        rosterContainer.appendChild(wrapper);
    });

    // ВАЖНО: Инициализируем VanillaTilt на новых элементах
    if(typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".player-card-wrapper"));
    }
}


// --- Модальное окно ---
function openModal(player) {
    if(!modalOverlay) return;
    mImg.src = player.img;
    mNick.textContent = player.nickname;
    mRole.textContent = player.role;
    mKd.textContent = player.kd;
    mHs.textContent = player.hs;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем скролл сайта
}

function closeModal() {
    if(!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if(modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if(e.target === modalOverlay) closeModal();
    });
}


// --- Переключение Табов ---
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderRoster(tab.dataset.game);
    });
});


// --- Инициализация при загрузке ---
document.addEventListener('DOMContentLoaded', () => {
    renderRoster('cs2'); // Загружаем CS2 по умолчанию
    if(document.querySelector(".modal-glass") && typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelector(".modal-glass"));
    }
});

// --- Скролл-бар и Анимация цифр ---
window.onscroll = function() {
    // 1. Полоска прокрутки сверху
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    const preloader = document.getElementById("scroll-preloader");
    if(preloader) preloader.style.width = scrolled + "%";

    // 2. Анимация цифр (Achievements)
    const counters = document.querySelectorAll('.counter-anim');
    counters.forEach(counter => {
        const rect = counter.getBoundingClientRect();
        // Если элемент виден на экране и еще не запущен (не имеет класса .started)
        if(rect.top < window.innerHeight && rect.bottom >= 0 && !counter.classList.contains('started')) {
            counter.classList.add('started');
            
            const target = +counter.getAttribute('data-target'); // Получаем число || 0 если текст
            const suffix = counter.getAttribute('data-suffix') || '';
            const prefix = counter.getAttribute('data-prefix') || '';
            
            // Если цель не число (например >#1), просто оставляем как есть
            if(isNaN(target)) return;

            let count = 0;
            const duration = 2000; // 2 секунды
            const increment = target / (duration / 16); // 60 FPS

            const updateCount = () => {
                count += increment;
                if(count < target) {
                    counter.innerText = prefix + Math.ceil(count) + suffix;
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = prefix + target + suffix;
                }
            };
            updateCount();
        }
    });
};

// --- ОТПРАВКА ФОРМЫ В TELEGRAM (ИСПРАВЛЕНО) ---

const form = document.getElementById('recruit-form');
const submitBtn = document.getElementById('submit-btn');
const statusText = document.getElementById('form-status');

// !!! ВАШИ ДАННЫЕ !!!
const BOT_TOKEN = '8530783323:AAHCnr_mI3iIVV7EWhjK6KGvQej7FdApzzc'; 
const CHAT_ID = '@luxiaanket'; // Канал для отправки

if(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Собираем данные
        const nickname = document.getElementById('nickname').value;
        const fullname = document.getElementById('fullname').value;
        const city = document.getElementById('city').value;
        const age = document.getElementById('age').value;
        const gameid = document.getElementById('gameid').value;
        const telegram = document.getElementById('telegram').value;

        // Формируем сообщение
        const message = `
🔥 <b>НОВАЯ ЗАЯВКА В LUXIA</b> 🔥

👤 <b>Ник:</b> ${nickname}
📝 <b>ФИО:</b> ${fullname}
🏙 <b>Город:</b> ${city}
🔞 <b>Возраст:</b> ${age}
🎮 <b>ID:</b> <code>${gameid}</code>
✈️ <b>Telegram:</b> ${telegram}
        `;

        // Визуальный эффект загрузки
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ОТПРАВКА...';
        submitBtn.disabled = true;

        // Отправка запроса к API Telegram
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.ok) {
                statusText.textContent = "ЗАЯВКА УСПЕШНО ОТПРАВЛЕНА!";
                statusText.style.color = "#00ff00";
                form.reset(); // Очистить форму
            } else {
                console.error("Telegram Error:", data);
                throw new Error('Telegram Error: ' + (data.description || 'Unknown'));
            }
        })
        .catch(error => {
            console.error(error);
            statusText.textContent = "ОШИБКА. ПРОВЕРЬТЕ КОНСОЛЬ (F12).";
            statusText.style.color = "red";
        })
        .finally(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            // Убираем статус через 5 секунд
            setTimeout(() => { statusText.textContent = ''; }, 5000);
        });
    });
}