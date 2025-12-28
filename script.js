// ==========================================
// ИНИЦИАЛИЗАЦИЯ ЧАСТИЦ НА ФОНЕ
// Создаём анимированные частицы для эффектного фона
// ==========================================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50; // Количество частиц

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Случайная позиция по горизонтали
        particle.style.left = Math.random() * 100 + '%';
        
        // Случайная задержка анимации для разнообразия
        particle.style.animationDelay = Math.random() * 15 + 's';
        
        // Случайная продолжительность анимации
        particle.style.animationDuration = 15 + Math.random() * 10 + 's';
        
        // Случайный размер частицы
        const size = 2 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Случайный цвет (красный или голубой)
        particle.style.background = Math.random() > 0.5 ? '#ff0050' : '#00d4ff';
        
        particlesContainer.appendChild(particle);
    }
}

// ==========================================
// ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ
// Обеспечивает плавный переход при клике на навигацию
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Плавная прокрутка с учётом высоты навбара
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// АНИМАЦИЯ FAQ (АККОРДЕОН)
// Раскрытие/закрытие ответов на вопросы
// ==========================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Закрываем все остальные элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий элемент
            item.classList.toggle('active');
        });
    });
}

// ==========================================
// АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ
// Элементы плавно появляются когда попадают в viewport
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Элемент считается видимым при 10% в viewport
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                // Добавляем задержку для каждого последующего элемента
                const delay = entry.target.dataset.aosDelay || 0;
                entry.target.style.animationDelay = delay + 'ms';
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами с атрибутом data-aos
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.add('aos-init');
        observer.observe(el);
    });
}

// ==========================================
// ЭФФЕКТ ПАРАЛЛАКСА ДЛЯ ТЕЛЕФОНА
// Телефон слегка двигается при движении мыши
// ==========================================
function initParallax() {
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 50;
            const y = (window.innerHeight / 2 - e.clientY) / 50;
            
            heroImage.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// ==========================================
// ИЗМЕНЕНИЕ НАВБАРА ПРИ СКРОЛЛЕ
// Навбар становится более заметным при прокрутке
// ==========================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// ==========================================
// АНИМАЦИЯ СЧЁТЧИКОВ (СТАТИСТИКА)
// Числа плавно увеличиваются от 0 до финального значения
// ==========================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = counter.innerText;
                
                // Проверяем, содержит ли число десятичную точку (например, "4.9")
                const hasDecimal = target.includes('.');
                
                if (hasDecimal) {
                    // Для дробных чисел - парсим как float
                    const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
                    const suffix = target.replace(/[0-9.]/g, '');
                    if (!isNaN(numericValue)) {
                        animateCounterDecimal(counter, numericValue, suffix);
                    }
                } else {
                    // Извлекаем число из текста (например, "500K+" -> 500)
                    const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
                    const suffix = target.replace(/[0-9]/g, '');
                    if (!isNaN(numericValue)) {
                        animateCounter(counter, numericValue, suffix);
                    }
                }
                
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

// Анимация для дробных чисел (например, 4.9)
function animateCounterDecimal(element, target, suffix) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.innerText = target.toFixed(1) + suffix;
            clearInterval(timer);
        } else {
            element.innerText = current.toFixed(1) + suffix;
        }
    }, stepTime);
}

function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 50; // Количество шагов
    const duration = 2000; // Продолжительность анимации в мс
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.innerText = target + suffix;
            clearInterval(timer);
        } else {
            element.innerText = Math.floor(current) + suffix;
        }
    }, stepTime);
}

// ==========================================
// ЭФФЕКТ СВЕЧЕНИЯ ПРИ НАВЕДЕНИИ НА КАРТОЧКИ
// Добавляем интерактивное свечение курсора
// ==========================================
function initCardGlow() {
    const cards = document.querySelectorAll('.feature-card, .review-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// ==========================================
// ЭФФЕКТ ПЕЧАТАНИЯ ТЕКСТА
// Текст появляется как будто его печатают
// ==========================================
function initTypingEffect() {
    const badge = document.querySelector('.badge');
    if (badge) {
        const text = badge.innerText;
        const dot = badge.querySelector('.badge-dot');
        badge.innerHTML = '';
        if (dot) badge.appendChild(dot);
        
        let i = 0;
        const span = document.createElement('span');
        badge.appendChild(span);
        
        function typeWriter() {
            if (i < text.trim().length) {
                span.innerHTML += text.trim().charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
}

// ==========================================
// ДОБАВЛЕНИЕ СТИЛЕЙ ДЛЯ АНИМАЦИЙ SCROLL
// ==========================================
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .aos-init {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .aos-init.animate-visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-card::after,
        .review-card::after {
            content: '';
            position: absolute;
            top: var(--mouse-y, 50%);
            left: var(--mouse-x, 50%);
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(255, 0, 80, 0.1), transparent 60%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .feature-card:hover::after,
        .review-card:hover::after {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ
// Запускаем всё при загрузке DOM
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();        // Создаём частицы на фоне
    initSmoothScroll();     // Включаем плавную прокрутку
    initFAQ();              // Инициализируем аккордеон FAQ
    initScrollAnimations(); // Анимации при скролле
    initParallax();         // Эффект параллакса
    initNavbarScroll();     // Изменение навбара при скролле
    initCounters();         // Анимация счётчиков
    initCardGlow();         // Эффект свечения карточек
    addAnimationStyles();   // Добавляем стили для анимаций
    
    // Небольшая задержка перед эффектом печатания
    setTimeout(initTypingEffect, 1000);
});

// ==========================================
// ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ
// ==========================================

// Функция для отслеживания скачиваний (можно подключить аналитику)
document.querySelectorAll('a[download]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('Download initiated:', link.href);
        // Здесь можно добавить отправку события в аналитику
        // gtag('event', 'download', { 'event_category': 'apk' });
    });
});

// Предотвращаем мигание при загрузке страницы
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
