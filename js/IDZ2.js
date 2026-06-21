document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ПРЕЛОАДЕР (Универсальный) ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader--hidden');
            setTimeout(() => { preloader.style.display = 'none'; }, 400);
        }, 3500);
    }

    // --- 2. ВАЛИДАЦИЯ И МАСКИ ПОЛЕЙ ВВОДА ---
    
    // Маска для имени (только буквы и пробелы)
    const handleNameInput = (e) => {
        const input = e.target;
        // Удаляем всё, что не буквы (латиница/кириллица) и не пробелы
        input.value = input.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
    };

    // Маска для телефона (+7 (XXX) XXX-XX-XX)
    const handlePhoneInput = (e) => {
        const input = e.target;
        let matrix = "+7 (___) ___-__-__",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = input.value.replace(/\D/g, "");
        
        if (def.length >= val.length) val = def;
        
        input.value = matrix.replace(/./g, function(a) {
            return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a;
        });
    };

    // Применяем маски ко всем существующим полям
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type === 'tel' || input.placeholder.includes('+7')) {
            input.addEventListener('input', handlePhoneInput);
            // Чтобы пользователь сразу видел +7 при фокусе
            input.addEventListener('focus', (e) => { if(!e.target.value) e.target.value = '+7 '; });
        }
        if (input.placeholder.toLowerCase().includes('имя') || input.placeholder.toLowerCase().includes('зовут')) {
            input.addEventListener('input', handleNameInput);
        }
    });

    // --- 2. МОБИЛЬНОЕ МЕНЮ (БУРГЕР) ---
    const burgerBtn = document.getElementById('burgerBtn');
    const menuClose = document.getElementById('menuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = document.querySelectorAll('.menu-list a');

    const closeMobileMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('open');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (burgerBtn) {
        burgerBtn.onclick = () => {
            mobileMenu.classList.add('open');
            if (menuOverlay) menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Блокировка скролла
        };
    }

    if (menuClose) menuClose.onclick = closeMobileMenu;
    if (menuOverlay) menuOverlay.onclick = closeMobileMenu;
    menuLinks.forEach(link => { link.onclick = closeMobileMenu; });


    // --- 3. ЛОГИКА МОДАЛЬНЫХ ОКОН (Универсальная) ---
    const overlay = document.getElementById('modalOverlay');
    const modalSuccess = document.getElementById('modalSuccess');

    // Функция закрытия ВСЕХ окон
    const hideEverything = () => {
        if (overlay) overlay.classList.remove('active');
        document.querySelectorAll('.modal, .modal-success').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
    };

    // Функция открытия конкретного окна (сначала закрывает старые)
    const openModal = (modalId) => {
        const targetModal = document.getElementById(modalId);
        if (!targetModal) return;

        closeMobileMenu(); // Закрываем бургер, если открываем из него
        hideEverything();  // Очистка наложений

        if (overlay) overlay.classList.add('active');
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Кнопки "Получить консультацию" (Шапка, Hero, Меню, Футер)
    document.querySelectorAll('.btn--header').forEach(btn => {
        btn.onclick = (e) => { e.preventDefault(); openModal('modalConsultation'); };
    });

    // Кнопки в карточках Услуг (открывают свои окна по ID из вкладок)
    // Ищем кнопки внутри сеток с конкретными ID
    const setupServiceButtons = (gridId, modalId) => {
        document.querySelectorAll(`#${gridId} .btn--service`).forEach(btn => {
            btn.onclick = (e) => { e.preventDefault(); openModal(modalId); };
        });
    };
    setupServiceButtons('private', 'modalPrivate');
    setupServiceButtons('business', 'modalBusiness');
    setupServiceButtons('general', 'modalGeneral');

    // Закрытие по крестику, кнопке успеха или оверлею
    document.querySelectorAll('.modal-close, .btn--success, #closeSucc').forEach(btn => {
        btn.onclick = (e) => { e.preventDefault(); hideEverything(); };
    });
    if (overlay) overlay.onclick = (e) => { if (e.target === overlay) hideEverything(); };


    // --- 4. ОБРАБОТКА ВСЕХ ФОРМ (ВАЛИДАЦИЯ + УСПЕХ) ---
    const handleFormSubmit = (form) => {
        form.onsubmit = (e) => {
            e.preventDefault();
            if (form.checkValidity() || document.querySelectorAll('.btn--form')) {
                openModal('modalSuccess');
                form.reset();
            } else {
                form.reportValidity();
            }
        };
    };

    // Все формы в модалках и футере
    document.querySelectorAll('form').forEach(form => handleFormSubmit(form));


    // --- 5. ТАБЫ (УСЛУГИ) ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabGrids = document.querySelectorAll('.services-grid');

    tabButtons.forEach(btn => {
        btn.onclick = () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabGrids.forEach(g => g.classList.remove('active'));
            const target = document.getElementById(btn.dataset.tab);
            if (target) target.classList.add('active');
        };
    });


    // --- 6. СЛАЙДЕР (ЦЕЛИ) ---
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let curSlide = 0;

    const showSlide = (n) => {
        if (!slides.length) return;
        slides.forEach(s => s.classList.remove('active'));
        curSlide = (n + slides.length) % slides.length;
        slides[curSlide].classList.add('active');
    };

    if (nextBtn) nextBtn.onclick = () => showSlide(curSlide + 1);
    if (prevBtn) prevBtn.onclick = () => showSlide(curSlide - 1);


    // --- 7. АККОРДЕОН (FAQ) ---
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.onclick = () => {
                // Закрыть другие, если нужно (опционально)
                // document.querySelectorAll('.faq-item').forEach(el => { if(el !== item) el.classList.remove('active'); });
                item.classList.toggle('active');
            };
        }
    });


    // --- 8. АНИМАЦИЯ БОРДОВЫХ КНОПОК (Instant / After Delay) ---
    const burgundyButtons = document.querySelectorAll('.btn');
    burgundyButtons.forEach(btn => {
        // Нажатие (Instant Dark)
        btn.addEventListener('mousedown', () => {
            btn.classList.remove('is-returning');
            btn.classList.add('is-clicked');
        });

        // Клик (After Delay 800ms -> Smart Animate 200ms)
        btn.addEventListener('click', () => {
            setTimeout(() => {
                btn.classList.add('is-returning');
                btn.classList.remove('is-clicked');
            }, 800);
        });

        // Уход мышки (Очистка)
        btn.addEventListener('mouseleave', () => {
            setTimeout(() => { btn.classList.remove('is-returning'); }, 1000); 
        });
    });

});