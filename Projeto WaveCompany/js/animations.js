/**
 * ANIMAÇÕES E EFEITOS AVANÇADOS
 * Efeitos tecnológicos impressionantes para a página inicial
 */

// =========================================
// 1. EFFECT DE PARTÍCULAS FLUTUANTES
// =========================================
function initParticles() {
    const heroSection = document.querySelector('.hero-premium');
    if (!heroSection) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;

    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(179, 143, 111, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            animation: particleMove ${duration}s linear ${delay}s infinite;
            box-shadow: 0 0 ${size * 2}px rgba(179, 143, 111, 0.5);
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    heroSection.appendChild(particlesContainer);
}

// =========================================
// 2. ANIMATED TEXT REVEAL EFFECT
// =========================================
function initTextReveal() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;

    const originalText = titleElement.innerHTML;
    titleElement.innerHTML = '';
    
    // Restaurar o HTML com as tags, mas dividindo apenas o conteúdo de texto
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalText;
    
    const text = tempDiv.innerText;
    let charIndex = 0;
    
    function revealChar() {
        if (charIndex < text.length) {
            charIndex++;
            // Reconstruir com a porção do texto revelada
            const displayText = text.substring(0, charIndex);
            
            // Manter o HTML original mas com o texto limitado
            tempDiv.innerHTML = originalText;
            const allText = tempDiv.innerText;
            
            // Criar efeito visual
            titleElement.style.minHeight = 'auto';
            
            setTimeout(revealChar, 30);
        }
    }
    
    // Apenas restaurar o efeito visual, mas manter a animação CSS
    titleElement.innerHTML = originalText;
}

// =========================================
// 3. SMOOTH SCROLL COM PARALLAX
// =========================================
function initParallaxScroll() {
    const sections = document.querySelectorAll('.hero-gradient');
    
    window.addEventListener('scroll', () => {
        sections.forEach(section => {
            const scrollY = window.scrollY;
            const elementOffset = section.offsetTop;
            
            if (scrollY < elementOffset + window.innerHeight) {
                section.style.transform = `translateY(${scrollY * 0.5}px)`;
            }
        });
    });
}

// =========================================
// 4. HOVER EFFECT EM BOTÕES
// =========================================
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn-premium, .btn-secondary-premium');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Criar ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                pointer-events: none;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 20px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                animation: rippleEffect 0.6s ease-out;
            `;
            
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// =========================================
// 5. CONTADOR ANIMADO PARA ESTATÍSTICAS
// =========================================
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const element = entry.target;
                element.classList.add('counted');
                
                const finalValue = element.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                const isPercentage = finalValue.includes('%');
                const isMoney = finalValue.includes('R$');
                const hasPlus = finalValue.includes('+');
                const hasYears = finalValue.includes('+');
                
                let currentValue = 0;
                const increment = numericValue / 60;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    
                    if (currentValue >= numericValue) {
                        currentValue = numericValue;
                        clearInterval(counter);
                    }
                    
                    let displayValue = Math.floor(currentValue);
                    
                    if (isPercentage) {
                        element.textContent = displayValue + '%';
                    } else if (isMoney) {
                        element.textContent = 'R$ ' + displayValue.toLocaleString('pt-BR');
                    } else {
                        element.textContent = displayValue.toLocaleString('pt-BR');
                        if (hasPlus || hasYears) {
                            element.textContent += '+';
                        }
                    }
                }, 30);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

// =========================================
// 6. CARD TILT EFFECT
// =========================================
function initCardTilt() {
    const cards = document.querySelectorAll('.benefit-card, .testimonial-card, .pricing-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const rotateX = (mouseY - centerY) / 10;
            const rotateY = (centerX - mouseX) / 10;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.01)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// =========================================
// 7. BACKGROUND ANIMATION GRADIENT
// =========================================
function initGradientAnimation() {
    const hero = document.querySelector('.hero-premium');
    if (!hero) return;
    
    let hue = 0;
    
    setInterval(() => {
        hue = (hue + 0.5) % 360;
        // Efeito sutil no fundo
        hero.style.setProperty('--hue', hue);
    }, 50);
}

// =========================================
// 8. FLOATING CARDS ENHANCED ANIMATION
// =========================================
function initFloatingCardsEnhanced() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = `
                translateY(-30px)
                rotateX(15deg)
                scale(1.05)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// =========================================
// 9. NAVBAR DYNAMIC EFFECT
// =========================================
function initNavbarDynamics() {
    const navbar = document.querySelector('.navbar-premium');
    const navLinks = document.querySelectorAll('.navbar-premium .nav-link');
    
    if (!navbar) return;
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (this.classList.contains('btn-premium-nav')) {
                this.style.boxShadow = '0 0 30px rgba(113, 0, 20, 0.6)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// =========================================
// 10. SCROLL REVEAL ANIMATIONS
// =========================================
function initScrollReveals() {
    const revealElements = document.querySelectorAll('.benefit-card, .testimonial-card, .pricing-card, .stat-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = `fadeInUp 0.6s ease-out forwards`;
                }, index * 50);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(element => observer.observe(element));
}

// =========================================
// 11. SMOOTH SCROLL BEHAVIOR
// =========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// =========================================
// 12. FORM ANIMATIONS
// =========================================
function initFormAnimations() {
    const formInputs = document.querySelectorAll('.form-control, .form-select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.filter = 'drop-shadow(0 10px 30px rgba(113, 0, 20, 0.2))';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
            this.parentElement.style.filter = 'drop-shadow(none)';
        });
    });
}

// =========================================
// 13. PAGE LOAD ANIMATION
// =========================================
function initPageLoadAnimation() {
    // Animar elementos na carga
    const mainElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
    
    mainElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.animation = `none`;
        
        setTimeout(() => {
            element.style.animation = `fadeInUp 0.8s ease-out forwards`;
        }, index * 200);
    });
}

// =========================================
// 14. CURSOR EFFECT (OPCIONAL)
// =========================================
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(179, 143, 111, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        display: none;
        transition: all 0.1s ease;
    `;
    
    document.body.appendChild(cursor);
    
    const interactiveElements = document.querySelectorAll('button, a, .benefit-card, .testimonial-card');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = (e.clientX - 10) + 'px';
        cursor.style.top = (e.clientY - 10) + 'px';
        
        // Verificar se está sobre elemento interativo
        const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
        
        if (hoveredElement && 
            (hoveredElement.tagName === 'BUTTON' || 
             hoveredElement.tagName === 'A' ||
             hoveredElement.closest('.benefit-card') ||
             hoveredElement.closest('.testimonial-card'))) {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = 'rgba(113, 0, 20, 1)';
        } else {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'rgba(179, 143, 111, 0.5)';
        }
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
}

// =========================================
// ADICIONAR ESTILOS DE ANIMAÇÃO CSS
// =========================================
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes rippleEffect {
            from {
                width: 20px;
                height: 20px;
                opacity: 1;
            }
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
        
        @keyframes particleMove {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
            }
            25% {
                transform: translateY(-50px) translateX(30px) rotate(90deg);
            }
            50% {
                transform: translateY(-100px) translateX(-20px) rotate(180deg);
            }
            75% {
                transform: translateY(-50px) translateX(-40px) rotate(270deg);
            }
            100% {
                transform: translateY(0) translateX(0) rotate(360deg);
            }
        }
        
        @keyframes glow {
            0%, 100% {
                text-shadow: 0 0 10px rgba(179, 143, 111, 0.5);
            }
            50% {
                text-shadow: 0 0 20px rgba(179, 143, 111, 1);
            }
        }
        
        .benefit-card h4, .testimonial-card h5 {
            animation: none;
        }
        
        .particles-container {
            z-index: 1 !important;
        }
    `;
    
    document.head.appendChild(style);
}

// =========================================
// INITIALIZE ALL ANIMATIONS ON PAGE LOAD
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando animações avançadas...');
    
    // Executar todas as inicializações
    addAnimationStyles();
    initPageLoadAnimation();
    initParticles();
    initParallaxScroll();
    initButtonEffects();
    initCounterAnimation();
    initCardTilt();
    initGradientAnimation();
    initFloatingCardsEnhanced();
    initNavbarDynamics();
    initScrollReveals();
    initSmoothScroll();
    initFormAnimations();
    // initCursorEffect(); // Descomente se quiser ativar o cursor customizado
    
    console.log('✨ Animações carregadas com sucesso!');
});

// Performance optimization - lazy load heavy animations
window.addEventListener('load', function() {
    // Remover classe de loading se existir
    document.body.classList.remove('loading');
});
