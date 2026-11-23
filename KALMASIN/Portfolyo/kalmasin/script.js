document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       1. MOBİL MENÜ & NAVİGASYON
       ========================================= */
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('open'));
    });

    /* =========================================
       2. ESNAF / ÖĞRENCİ SEKMELERİ VE HERO BUTON YÖNLENDİRMESİ
       ========================================= */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function activateTab(role) {
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === role);
        });
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `tab-${role}`);
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => activateTab(btn.dataset.tab));
    });

    // Hero'daki "Kullanıcılar için KALMASIN" ve "İşletmeler için KALMASIN" butonları
    document.querySelectorAll('[data-role-select]').forEach(roleBtn => {
        roleBtn.addEventListener('click', () => {
            const chosenRole = roleBtn.getAttribute('data-role-select');
            activateTab(chosenRole);
            const formSelect = document.getElementById('userRole');
            if (formSelect) formSelect.value = chosenRole;
        });
    });

    /* =========================================
       3. TELEFON MOCKUP CANLI GERİ SAYIM SAYACI
       ========================================= */
    const countdownEl = document.getElementById('phoneCountdown');
    let totalSeconds = 6269; // 01:44:29

    setInterval(() => {
        if (totalSeconds <= 0) totalSeconds = 6269;
        totalSeconds--;
        const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        if (countdownEl) countdownEl.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);

    const demoGrabBtn = document.getElementById('demoGrabBtn');
    if (demoGrabBtn) {
        demoGrabBtn.addEventListener('click', () => {
            demoGrabBtn.textContent = 'Ayırtıldı ✓';
            demoGrabBtn.style.background = '#10b981';
        });
    }

    /* =========================================
       4. İNTERAKTİF ŞANS ÇARKI (SPIN WHEEL)
       ========================================= */
    const spinWheel = document.getElementById('spinWheel');
    const spinBtn = document.getElementById('spinBtn');
    const wheelResult = document.getElementById('wheelResult');

    const prizes = [
        '%20 Akşam İndirimi',
        'Küçükpark Kafe’den Ücretsiz Çay',
        '+50 ResQ Club Puanı',
        '₺25 Sürpriz Paket Kuponu',
        'Sonraki Siparişte 2x Puan',
        'Ücretsiz Sürpriz Tatlı'
    ];

    let currentRotation = 0;
    let isSpinning = false;

    if (spinBtn && spinWheel) {
        spinBtn.addEventListener('click', () => {
            if (isSpinning) return;
            isSpinning = true;
            wheelResult.textContent = 'Çark dönüyor... Bol şans!';

            const extraSpins = 5 * 360;
            const randomDeg = Math.floor(Math.random() * 360);
            currentRotation += extraSpins + randomDeg;
            spinWheel.style.transform = `rotate(${currentRotation}deg)`;

            setTimeout(() => {
                const normalizedDeg = (360 - (currentRotation % 360)) % 360;
                const prizeIndex = Math.floor(normalizedDeg / 60);
                wheelResult.innerHTML = `🎉 Tebrikler! Kazandığın ödül: <strong>${prizes[prizeIndex]}</strong>`;
                isSpinning = false;
            }, 4000);
        });
    }

    /* =========================================
       5. HTML5 CANVAS KAZI-KAZAN (SCRATCH CARD)
       ========================================= */
    const canvas = document.getElementById('scratchCanvas');
    const resetScratchBtn = document.getElementById('resetScratchBtn');
    const scratchStatus = document.getElementById('scratchStatus');
    const scratchPrizeText = document.getElementById('scratchPrizeText');

    const scratchCoupons = ['KÜÇÜKPARK20', 'TAZE15', 'SIFIRATIK25', 'GOLDGIFT'];

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;

        function initScratchCard() {
            const randomCode = scratchCoupons[Math.floor(Math.random() * scratchCoupons.length)];
            scratchPrizeText.textContent = randomCode;
            scratchStatus.textContent = 'Gümüş alanı kazıyarak ödülünü ortaya çıkar.';

            ctx.globalCompositeOperation = 'source-over';
            const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            grad.addColorStop(0, '#94a3b8');
            grad.addColorStop(0.5, '#cbd5e1');
            grad.addColorStop(1, '#64748b');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 16px Plus Jakarta Sans, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('✨ BURAYI KAZI ✨', canvas.width / 2, canvas.height / 2 + 6);
        }

        function scratch(x, y) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 22, 0, Math.PI * 2);
            ctx.fill();
            scratchStatus.innerHTML = `🎊 Kod açıldı: <strong>${scratchPrizeText.textContent}</strong> — Kasada veya sepette kullan!`;
        }

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        canvas.addEventListener('mousedown', () => (isDrawing = true));
        window.addEventListener('mouseup', () => (isDrawing = false));
        canvas.addEventListener('mousemove', e => {
            if (!isDrawing) return;
            const pos = getPos(e);
            scratch(pos.x, pos.y);
        });

        canvas.addEventListener('touchstart', e => {
            isDrawing = true;
            const pos = getPos(e);
            scratch(pos.x, pos.y);
        });
        canvas.addEventListener('touchmove', e => {
            if (!isDrawing) return;
            e.preventDefault();
            const pos = getPos(e);
            scratch(pos.x, pos.y);
        });
        canvas.addEventListener('touchend', () => (isDrawing = false));

        resetScratchBtn.addEventListener('click', initScratchCard);
        initScratchCard();
    }

    /* =========================================
       6. AKORDEON SSS MENÜSÜ
       ========================================= */
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('open');
        });
    });

    /* =========================================
       7. ERKEN ERİŞİM FORMU SAHTE GÖNDERİM ONAYI
       ========================================= */
    const joinForm = document.getElementById('joinForm');
    const formSuccess = document.getElementById('formSuccessMessage');

    if (joinForm) {
        joinForm.addEventListener('submit', e => {
            e.preventDefault();
            joinForm.classList.add('hidden');
            formSuccess.classList.remove('hidden');
        });
    }

    /* =========================================
       8. SCROLL REVEAL ANİMASYONU
       ========================================= */
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    /* =========================================
       9. TR / EN DİL DEĞİŞTİRİCİ
       ========================================= */
    const langToggle = document.getElementById('langToggle');
    let currentLang = 'tr';

    const translations = {
        en: {
            nav_about: 'Project & Urban Rights',
            nav_how: 'How It Works',
            nav_perks: 'ResQ Club & Games',
            nav_impact: 'Fieldwork & Team',
            nav_faq: 'FAQ',
            nav_join: 'Join Us',
            hero_badge: 'Bornova Küçükpark • In Partnership with İzmir City Council',
            hero_title: 'Zero waste, <span class="gradient-text">full flavor.</span>',
            hero_desc: 'A next-gen community and food-rescue network connecting fresh end-of-day surplus from Küçükpark local shops with university students. <strong>Catch it fresh, waste nothing.</strong>',
            btn_users: 'KALMASIN for Users',
            btn_users_sub: 'Grab surprise boxes & win rewards',
            btn_business: 'KALMASIN for Businesses',
            btn_business_sub: 'Turn end-of-day surplus into value',
            about_eyebrow: 'MORE THAN A DISCOUNT APP',
            about_title: 'Urban Rights & Zero Waste in Küçükpark',
            how_title: 'How Does KALMASIN Work?',
            how_sub: 'Pick your role and explore the circular flow in Küçükpark.',
            tab_student: '🎓 For Students & Users',
            tab_business: '🏪 For Küçükpark Businesses'
        },
        tr: {
            nav_about: 'Proje & Kent Hakkı',
            nav_how: 'Nasıl Çalışır?',
            nav_perks: 'ResQ Club & Oyunlar',
            nav_impact: 'Saha & Ekip',
            nav_faq: 'SSS',
            nav_join: 'Bize Katıl',
            hero_badge: 'Bornova Küçükpark • İzmir Kent Konseyi Paydaşlığı',
            hero_title: 'İsraf yok, <span class="gradient-text">lezzet çok.</span>',
            hero_desc: 'Küçükpark’taki yerel işletmelerin gün sonunda taze kalan ürünlerini üniversite öğrencileriyle uygun koşullarda buluşturan yeni nesil topluluk ve gıda kurtarma ağı. <strong>Taze yakala, ziyan etme.</strong>',
            btn_users: 'Kullanıcılar için KALMASIN',
            btn_users_sub: 'Sürpriz paketleri yakala, ödül kazan',
            btn_business: 'İşletmeler için KALMASIN',
            btn_business_sub: 'Gün sonu fazlasını kazanca dönüştür',
            about_eyebrow: 'BİR İNDİRİM UYGULAMASINDAN FAZLASI',
            about_title: 'Küçükpark’ta Kent Hakkı ve Sıfır Atık',
            how_title: 'KALMASIN Nasıl Çalışır?',
            how_sub: 'Rolünü seç ve Küçükpark’taki döngünün nasıl işlediğini keşfet.',
            tab_student: '🎓 Öğrenciler & Kullanıcılar İçin',
            tab_business: '🏪 Küçükpark Esnafı İçin'
        }
    };

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'tr' ? 'en' : 'tr';
            langToggle.textContent = currentLang === 'tr' ? 'EN' : 'TR';

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[currentLang][key]) {
                    el.innerHTML = translations[currentLang][key];
                }
            });
        });
    }
});