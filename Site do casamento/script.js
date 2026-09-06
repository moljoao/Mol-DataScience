/* ========== LOADING SCREEN ANIMATION ========== */

class EnvelopeLoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.envelope = document.getElementById('envelope');
        this.sealContainer = document.getElementById('sealContainer');
        this.sealSvg = document.getElementById('sealSvg');
        this.cracksSvg = document.getElementById('cracksSvg');
        this.particlesContainer = document.getElementById('particlesContainer');
        this.envelopeLight = document.getElementById('envelopeLight');
        this.lightBurst = document.getElementById('lightBurst');
        this.dustContainer = document.getElementById('dustContainer');
        this.skipBtn = document.getElementById('skipBtn');

        this.isAnimating = false;
        this.skipClicked = false;

        this.init();
    }

    init() {
        // Pré-carregar check se animação já foi vista
        if (sessionStorage.getItem('loadingAnimationComplete')) {
            this.skipAnimation();
            return;
        }

        this.skipBtn.addEventListener('click', () => this.skipAnimation());
        
        // Iniciar animação após pequeno delay
        setTimeout(() => this.startAnimation(), 300);
    }

    startAnimation() {
        this.isAnimating = true;
        
        // Fase 1: Seal pulse (já está no CSS com 2.2s)
        // Fase 2: Vibration and seal breaking - timing ajustado para efeito máximo
        setTimeout(() => this.breakSeal(), 1400);
    }

    breakSeal() {
        // Mostrar rachaduras
        this.cracksSvg.classList.add('visible');
        
        // Criar partículas de explosão
        this.createParticles();
        
        // Som sutil sincronizado
        this.playBreakSound();
        
        // Abrir envelope imediatamente
        setTimeout(() => this.openEnvelope(), 400);
    }

    createParticles() {
        const particleCount = 25;
        const angles = [];
        
        // Distribuir partículas em ângulos
        for (let i = 0; i < particleCount; i++) {
            angles.push((360 / particleCount) * i + Math.random() * 25);
        }

        angles.forEach((angle, index) => {
            setTimeout(() => {
                const particle = document.createElement('div');
                const rand = Math.random();
                let className = 'particle';
                
                if (rand > 0.6) {
                    className += ' blue-light';
                } else if (rand > 0.3) {
                    className += ' blue-dark';
                } else {
                    className += ' white';
                }
                
                particle.className = className;
                
                const distance = 70 + Math.random() * 50;
                const rad = (angle * Math.PI) / 180;
                const tx = Math.cos(rad) * distance;
                const ty = Math.sin(rad) * distance;
                
                particle.style.setProperty('--tx', `${tx}px`);
                particle.style.setProperty('--ty', `${ty}px`);
                particle.style.width = (2 + Math.random() * 3) + 'px';
                particle.style.height = particle.style.width;
                particle.style.animation = `particleExplode 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
                
                this.particlesContainer.appendChild(particle);
                
                // Remover após animação
                setTimeout(() => particle.remove(), 900);
            }, index * 35);
        });
    }

    openEnvelope() {
        // Abrir flaps do envelope
        const envelopeSvg = document.querySelector('.envelope-svg');
        const leftFlap = document.querySelector('.left-flap');
        const rightFlap = document.querySelector('.right-flap');
        
        envelopeSvg.classList.add('opening');
        leftFlap.classList.add('opening');
        rightFlap.classList.add('opening', 'right-flap');
        
        // Animar selo para desaparecer
        this.sealSvg.classList.add('opening');
        
        // Animar envelope para se abrir
        this.envelope.classList.add('opening');
        
        // Efeito de luz
        this.envelopeLight.classList.add('glowing');
        
        // Ativar burst de luz
        this.activateLightBurst();
        
        // Criar poeira/dust
        this.createDustParticles();
        
        // Fade out e remover - timing ajustado
        setTimeout(() => this.finishAnimation(), 2200);
    }

    activateLightBurst() {
        this.lightBurst.classList.add('active');
        
        document.querySelectorAll('.burst-particle').forEach((particle) => {
            particle.classList.add('active');
        });
    }

    createDustParticles() {
        const dustCount = 40;
        
        for (let i = 0; i < dustCount; i++) {
            setTimeout(() => {
                const dust = document.createElement('div');
                const rand = Math.random();
                
                if (rand > 0.6) {
                    dust.className = 'dust large';
                } else if (rand > 0.3) {
                    dust.className = 'dust medium';
                } else {
                    dust.className = 'dust small';
                }
                
                const startX = (Math.random() - 0.5) * 250;
                const startY = (Math.random() - 0.5) * 250;
                const drift = (Math.random() - 0.5) * 150;
                
                dust.style.left = `${50 + startX / 250}%`;
                dust.style.top = `${50 + startY / 250}%`;
                dust.style.setProperty('--drift', `${drift}px`);
                
                const duration = 1.4 + Math.random() * 1;
                dust.style.animation = `dustFloat ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
                
                this.dustContainer.appendChild(dust);
                
                // Remover após animação
                setTimeout(() => dust.remove(), duration * 1000);
            }, i * 25);
        }
    }

    playBreakSound() {
        // Som sofisticado e elegante usando Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            
            // Som de cristal quebrando - mais sofisticado
            const osc1 = audioContext.createOscillator();
            const osc2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const gainNode2 = audioContext.createGain();
            
            osc1.connect(gainNode);
            osc2.connect(gainNode2);
            gainNode.connect(audioContext.destination);
            gainNode2.connect(audioContext.destination);
            
            // Primeira onda - frequência mais alta
            osc1.frequency.setValueAtTime(1200, now);
            osc1.frequency.exponentialRampToValueAtTime(300, now + 0.12);
            gainNode.gain.setValueAtTime(0.12, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            
            // Segunda onda - harmônico
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(600, now);
            osc2.frequency.exponentialRampToValueAtTime(150, now + 0.15);
            gainNode2.gain.setValueAtTime(0.06, now);
            gainNode2.gain.exponentialRampToValueAtTime(0.005, now + 0.15);
            
            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.12);
            osc2.stop(now + 0.15);
        } catch (e) {
            // Ignorar se Audio API não estiver disponível
        }
    }

    finishAnimation() {
        // Remover classe breaking para limpar animação
        this.sealSvg.classList.remove('breaking');
        
        // Adicionar classe hidden ao envelope
        this.envelope.classList.add('hidden');
        
        // Fade out do loading screen
        setTimeout(() => {
            this.loadingScreen.classList.add('hidden');
            sessionStorage.setItem('loadingAnimationComplete', 'true');
            this.isAnimating = false;
        }, 800);
    }

    skipAnimation() {
        if (this.isAnimating) {
            this.skipClicked = true;
            
            // Remover animações em progresso
            this.sealSvg.style.animation = 'none';
            this.cracksSvg.innerHTML = '';
            this.particlesContainer.innerHTML = '';
            this.dustContainer.innerHTML = '';
            this.lightBurst.innerHTML = '';
        }
        
        // Remover tela de loading imediatamente
        this.loadingScreen.classList.add('hidden');
        sessionStorage.setItem('loadingAnimationComplete', 'true');
        this.isAnimating = false;
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new EnvelopeLoadingScreen();
});

/* ========== END LOADING SCREEN ========== */

const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
const revealElements = document.querySelectorAll('.reveal');
const countdownIds = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};

menuToggle?.addEventListener('click', () => {
    menu?.classList.toggle('open');
});

document.querySelectorAll('.menu a').forEach((link) => {
    link.addEventListener('click', () => menu?.classList.remove('open'));
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.16 });

revealElements.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 60, 420)}ms`;
    observer.observe(el);
});

function updateCountdown() {
    const weddingDate = new Date('2026-10-10T16:00:00-03:00').getTime();
    const now = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
        countdownIds.days.textContent = '0';
        countdownIds.hours.textContent = '0';
        countdownIds.minutes.textContent = '0';
        countdownIds.seconds.textContent = '0';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownIds.days.textContent = String(days);
    countdownIds.hours.textContent = String(hours).padStart(2, '0');
    countdownIds.minutes.textContent = String(minutes).padStart(2, '0');
    countdownIds.seconds.textContent = String(seconds).padStart(2, '0');

    const countdownCards = document.querySelectorAll('.count-card span');
    countdownCards.forEach((card) => {
        card.animate(
            [
                { transform: 'translateY(0)' },
                { transform: 'translateY(-3px)' },
                { transform: 'translateY(0)' }
            ],
            { duration: 420, easing: 'ease-out' }
        );
    });
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Integração com Supabase
const SUPABASE_URL = 'https://sxxucfbnzowjkasdkvht.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4eHVjZmJuem93amthc2Rrdmh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODg1MzYsImV4cCI6MjA5MjQ2NDUzNn0.FrxSBRsk0d0ztXpxQQPqvBIuPNcoGTDJNqUSDjNhhFs';
const TABLE_NAME = 'rsvp_confirmacoes';
const GIFT_RESERVATIONS_TABLE = 'gift_reservations';

async function enviarRsvpParaSupabase(dados) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao enviar dados');
        }

        return { success: true };
    } catch (error) {
        console.error('Erro Supabase:', error);
        throw error;
    }
}

async function buscarReservasDePresentesSupabase() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${GIFT_RESERVATIONS_TABLE}?select=gift_id,guest_name,reserved_at`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao buscar reservas');
        }

        const reservas = await response.json();
        return reservas.reduce((acc, item) => {
            acc[item.gift_id] = {
                guestName: item.guest_name,
                reservedAt: item.reserved_at
            };
            return acc;
        }, {});
    } catch (error) {
        console.error('Erro ao buscar reservas do Supabase:', error);
        throw error;
    }
}

async function reservarPresenteSupabase(giftId, guestName, contributionAmount) {
    try {
        const payload = {
            gift_id: giftId,
            guest_name: guestName,
            reserved_at: new Date().toISOString()
        };

        if (contributionAmount != null) {
            payload.contribution_amount = contributionAmount;
        }

        const response = await fetch(`${SUPABASE_URL}/rest/v1/${GIFT_RESERVATIONS_TABLE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao reservar presente');
        }

        return { success: true };
    } catch (error) {
        console.error('Erro ao reservar presente:', error);
        throw error;
    }
}

async function cancelarReservaPresenteSupabase(giftId, guestName) {
    try {
        const query = `?gift_id=eq.${encodeURIComponent(giftId)}&guest_name=eq.${encodeURIComponent(guestName)}`;
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${GIFT_RESERVATIONS_TABLE}${query}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao desfazer reserva');
        }

        return { success: true };
    } catch (error) {
        console.error('Erro ao cancelar reserva:', error);
        throw error;
    }
}

const rsvpForm = document.getElementById('rsvpForm');
rsvpForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(rsvpForm);
    const nome = formData.get('nome');
    const email = formData.get('email');
    const resposta = formData.get('resposta');
    const mensagem = formData.get('mensagem');

    if (!nome || !email || !resposta) return;

    const botao = rsvpForm.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.textContent = 'Enviando...';

    try {
        await enviarRsvpParaSupabase({
            nome,
            email,
            resposta,
            mensagem
        });

        const msg = `Obrigado, ${nome}! Sua confirmação foi registrada com sucesso. 💕`;
        alert(msg);
        rsvpForm.reset();
    } catch (error) {
        alert(`Erro ao enviar: ${error.message}`);
    } finally {
        botao.disabled = false;
        botao.textContent = 'Enviar confirmação';
    }
});

/* ========== LISTA DE PRESENTES ========== */

class GiftRegistry {
    constructor() {
        this.grid = document.getElementById('giftsGrid');
        this.filters = document.getElementById('giftsFilters');
        this.searchInput = document.getElementById('giftsSearch');
        this.statsEl = document.getElementById('giftsStats');
        this.modal = document.getElementById('giftModal');
        this.modalBackdrop = document.getElementById('giftModalBackdrop');
        this.modalClose = document.getElementById('giftModalClose');
        this.modalImage = document.getElementById('giftModalImage');
        this.modalTitle = document.getElementById('giftModalTitle');
        this.modalText = document.getElementById('giftModalText');
        this.modalId = document.getElementById('giftModalId');
        this.modalAction = document.getElementById('giftModalAction');
        this.modalName = document.getElementById('giftModalName');
        this.modalAmountWrap = document.getElementById('giftModalAmountWrap');
        this.modalAmount = document.getElementById('giftModalAmount');
        this.reserveForm = document.getElementById('giftReserveForm');
        this.modalSubmitBtn = this.reserveForm?.querySelector('button[type="submit"]');

        this.activeCategory = 'all';
        this.searchTerm = '';
        this.reservations = this.loadLocalReservations();

        if (!this.grid) return;

        if (typeof GIFT_CATEGORIES === 'undefined') {
            this.grid.innerHTML = `
                <div class="gifts-empty">
                    <p>Não foi possível carregar a lista de presentes.</p>
                    <small>Verifique se o arquivo gifts-data.js está no servidor.</small>
                </div>
            `;
            return;
        }

        this.buildFilters();
        this.bindEvents();
        this.render();
        this.loadGiftAvailability().then(() => this.render()).catch(() => {
            this.render();
        });
    }

    getAllGifts() {
        const featuredGiftIds = ['viagem-noivos-1', 'viagem-noivos-2', 'viagem-noivos-3'];

        return GIFT_CATEGORIES.flatMap((category) =>
            category.items.map((item) => ({
                ...item,
                categoryId: category.id,
                categoryName: category.name,
                name: featuredGiftIds.includes(item.id) ? 'Viagem Lua de Mel' : item.name
            }))
        );
    }

    shuffleArray(items) {
        const shuffled = [...items];

        for (let index = shuffled.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
        }

        return shuffled;
    }

    loadLocalReservations() {
        try {
            const stored = localStorage.getItem('giftReservations');
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    }

    saveLocalReservations() {
        localStorage.setItem('giftReservations', JSON.stringify(this.reservations));
    }

    async loadGiftAvailability() {
        try {
            const remoteReservations = await buscarReservasDePresentesSupabase();
            this.reservations = {
                ...this.loadLocalReservations(),
                ...remoteReservations
            };
            this.saveLocalReservations();
            return this.reservations;
        } catch (error) {
            this.reservations = this.loadLocalReservations();
            return this.reservations;
        }
    }

    isCustomAmountGift(gift) {
        return gift?.type === 'customAmount';
    }

    async reserveGift(giftId, guestName, contributionAmount) {
        await reservarPresenteSupabase(giftId, guestName, contributionAmount);
        this.reservations[giftId] = {
            guestName,
            reservedAt: new Date().toISOString()
        };
        this.saveLocalReservations();
        return { success: true };
    }

    async cancelGiftReservation(giftId, guestName) {
        await cancelarReservaPresenteSupabase(giftId, guestName);
        delete this.reservations[giftId];
        this.saveLocalReservations();
        return { success: true };
    }

    buildFilters() {
        const buttons = [
            { id: 'all', label: 'Todos' },
            ...GIFT_CATEGORIES.map((cat) => ({ id: cat.id, label: cat.name }))
        ];

        this.filters.innerHTML = buttons.map((btn) =>
            `<button type="button" class="gifts-filter-btn${btn.id === 'all' ? ' active' : ''}" data-category="${btn.id}" role="tab" aria-selected="${btn.id === 'all'}">${btn.label}</button>`
        ).join('');
    }

    getFilteredGifts() {
        const term = this.searchTerm.trim().toLowerCase();
        const featuredGiftIds = ['viagem-noivos-1', 'viagem-noivos-2', 'viagem-noivos-3'];

        let gifts = this.getAllGifts().filter((gift) => {
            const matchesCategory = this.activeCategory === 'all' || gift.categoryId === this.activeCategory;
            const matchesSearch = !term ||
                gift.name.toLowerCase().includes(term) ||
                gift.categoryName.toLowerCase().includes(term);
            return matchesCategory && matchesSearch;
        });

        if (this.activeCategory === 'all') {
            const featuredGifts = gifts.filter((gift) => featuredGiftIds.includes(gift.id));
            const remainingGifts = this.shuffleArray(gifts.filter((gift) => !featuredGiftIds.includes(gift.id)));
            const orderedFeatured = featuredGifts.sort((firstGift, secondGift) =>
                featuredGiftIds.indexOf(firstGift.id) - featuredGiftIds.indexOf(secondGift.id)
            );

            return [...orderedFeatured, ...remainingGifts];
        }

        return this.shuffleArray(gifts);
    }

    updateStats(gifts) {
        const total = this.getAllGifts().length;
        const unavailable = Object.keys(this.reservations).length;
        const available = total - unavailable;
        const visible = gifts.length;

        this.statsEl.textContent = `${available} disponíveis · ${visible} exibidos`;
    }

    renderGiftCard(gift) {
        const reservation = this.reservations[gift.id];
        const isUnavailable = Boolean(reservation);
        const productLink = gift.link
            ? `<a class="gift-card-link" href="${gift.link}" target="_blank" rel="noopener noreferrer">Link para compra</a>`
            : '';
        const pixInfo = this.isCustomAmountGift(gift) && gift.pix
            ? `<p class="gift-card-pix">PIX: <strong>${gift.pix}</strong></p>`
            : '';
        const hint = this.isCustomAmountGift(gift)
            ? 'Escolha um valor e reserve este card para contribuir com a nossa lua de mel.'
            : 'Escolha este item para reservar com a nossa família.';

        return `
            <article class="gift-card${isUnavailable ? ' gift-card--unavailable' : ''}${this.isCustomAmountGift(gift) ? ' gift-card--honeymoon' : ''}" data-gift-id="${gift.id}">
                <div class="gift-card-main">
                    <div class="gift-card-meta">
                        <span class="gift-card-category">${gift.categoryName}</span>
                        <h3 class="gift-card-title">${gift.name}</h3>
                        ${pixInfo}
                        ${isUnavailable ? `<p class="gift-card-reserved-by">Reservado por <span class="gift-card-reserved-name">${reservation.guestName}</span></p>` : `<p class="gift-card-hint">${hint}</p>`}
                    </div>
                    <div class="gift-card-actions">
                        <span class="gift-card-status">${isUnavailable ? 'Indisponível' : 'Disponível'}</span>
                        ${productLink}
                        <button type="button" class="gift-card-btn" data-action="${isUnavailable ? 'cancel' : 'reserve'}">
                            ${isUnavailable ? 'Desfazer' : 'Reservar'}
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    render() {
        const gifts = this.getFilteredGifts();
        this.updateStats(gifts);

        if (gifts.length === 0) {
            this.grid.innerHTML = `
                <div class="gifts-empty">
                    <p>Nenhum presente encontrado.</p>
                    <small>Tente outra busca ou categoria.</small>
                </div>
            `;
            return;
        }

        this.grid.innerHTML = gifts.map((gift) => this.renderGiftCard(gift)).join('');
    }

    openModal(giftId, action = 'reserve') {
        const gift = this.getAllGifts().find((item) => item.id === giftId);
        if (!gift) return;

        if (action === 'reserve' && this.reservations[giftId]) return;
        if (action === 'cancel' && !this.reservations[giftId]) return;

        this.modalId.value = gift.id;
        this.modalTitle.textContent = gift.name;
        this.modalAction.value = action;
        this.modalImage?.removeAttribute('src');
        this.modalImage?.setAttribute('alt', gift.name);
        this.modalName.value = '';
        const showAmount = action === 'reserve' && this.isCustomAmountGift(gift);

        if (this.modalAmountWrap) {
            this.modalAmountWrap.hidden = !showAmount;
        }
        if (this.modalAmount) {
            this.modalAmount.required = showAmount;
            this.modalAmount.value = '';
        }

        if (action === 'cancel') {
            this.modalText.textContent = 'Informe o nome usado para reservar este presente para desfazer a reserva.';
            this.modalSubmitBtn.textContent = 'Desfazer reserva';
        } else if (showAmount) {
            this.modalText.textContent = `Informe seu nome e o valor que deseja contribuir. PIX: ${gift.pix || ''}`;
            this.modalSubmitBtn.textContent = 'Confirmar reserva';
        } else {
            this.modalText.textContent = 'Informe seu nome para reservar este presente e deixe o carinho de uma forma elegante e simples.';
            this.modalSubmitBtn.textContent = 'Confirmar reserva';
        }

        this.modal.classList.add('open');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        this.modalName.focus();
    }

    closeModal() {
        this.modal.classList.remove('open');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        this.reserveForm.reset();
        this.modalAction.value = 'reserve';
        this.modalSubmitBtn.textContent = 'Confirmar reserva';
        this.modalText.textContent = 'Informe seu nome para reservar este presente e deixe o carinho de uma forma elegante e simples.';
        if (this.modalAmountWrap) this.modalAmountWrap.hidden = true;
        if (this.modalAmount) this.modalAmount.required = false;
    }

    bindEvents() {
        this.filters.addEventListener('click', (event) => {
            const button = event.target.closest('.gifts-filter-btn');
            if (!button) return;

            this.activeCategory = button.dataset.category;
            this.filters.querySelectorAll('.gifts-filter-btn').forEach((btn) => {
                const isActive = btn === button;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', String(isActive));
            });
            this.render();
        });

        this.searchInput?.addEventListener('input', (event) => {
            this.searchTerm = event.target.value;
            this.render();
        });

        this.grid.addEventListener('click', (event) => {
            const button = event.target.closest('[data-action]');
            if (!button) return;

            const action = button.dataset.action;
            const card = button.closest('.gift-card');
            if (!card) return;

            if (action === 'reserve' || action === 'cancel') {
                this.openModal(card.dataset.giftId, action);
            }
        });

        this.modalClose?.addEventListener('click', () => this.closeModal());
        this.modalBackdrop?.addEventListener('click', () => this.closeModal());

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.modal.classList.contains('open')) {
                this.closeModal();
            }
        });

        this.reserveForm?.addEventListener('submit', async (event) => {
            event.preventDefault();
            const giftId = this.modalId.value;
            const guestName = this.modalName.value.trim();
            const action = this.modalAction.value;
            const gift = this.getAllGifts().find((item) => item.id === giftId);
            if (!giftId || !guestName) return;

            let contributionAmount;
            if (action === 'reserve' && this.isCustomAmountGift(gift)) {
                const parsedAmount = Number(this.modalAmount?.value);
                if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
                    alert('Informe um valor válido para contribuir.');
                    return;
                }
                contributionAmount = Number(parsedAmount.toFixed(2));
            }

            const submitBtn = this.reserveForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = action === 'cancel' ? 'Desfazendo...' : 'Reservando...';

            try {
                if (action === 'cancel') {
                    await this.cancelGiftReservation(giftId, guestName);
                } else {
                    await this.reserveGift(giftId, guestName, contributionAmount);
                }

                this.closeModal();
                this.render();
            } catch (error) {
                const message = action === 'cancel' ? 'Erro ao desfazer reserva' : 'Erro ao reservar';
                alert(`${message}: ${error.message}`);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = action === 'cancel' ? 'Desfazer reserva' : 'Confirmar reserva';
            }
        });
    }
}

function initGiftRegistry() {
    if (window.__giftRegistryInitialized) return;
    window.__giftRegistryInitialized = true;
    new GiftRegistry();
}

document.addEventListener('DOMContentLoaded', initGiftRegistry);

if (document.readyState !== 'loading') {
    initGiftRegistry();
}
