// ===== MAIN.JS - WEBFUN.IA =====
// Arquivo principal JavaScript do site
// Compatível com o chatbot AtendeBot

(function() {
    'use strict';

    // Configurações globais
    const CONFIG = {
        apiBaseUrl: 'https://api.webfun.ia',
        enableAnimations: true,
        chatbotEnabled: true,
        debugMode: false
    };

    // Estado da aplicação
    const state = {
        currentPage: 'home',
        userPreferences: {},
        chatbotInitialized: false
    };

    // Inicialização quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    function initializeApp() {
        log('Inicializando Webfun.IA...');
        
        // Inicializar componentes
        initNavigation();
        initAnimations();
        initForms();
        initScrollEffects();
        initChatbotIntegration();
        
        // Carregar preferências do usuário
        loadUserPreferences();
        
        log('Aplicação inicializada com sucesso');
    }

    // ===== SISTEMA DE LOG =====
    function log(message, data = null) {
        if (CONFIG.debugMode) {
            console.log(`[Webfun.IA] ${message}`, data || '');
        }
    }

    function logError(message, error = null) {
        console.error(`[Webfun.IA] ERRO: ${message}`, error || '');
    }

    // ===== SISTEMA DE NAVEGAÇÃO =====
    function initNavigation() {
        // Menu mobile
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mainNav = document.querySelector('.main-nav');
        
        if (mobileMenuBtn && mainNav) {
            mobileMenuBtn.addEventListener('click', function() {
                mainNav.classList.toggle('active');
                this.classList.toggle('active');
            });
        }

        // Smooth scroll para links internos
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Ativar link ativo na navegação
        window.addEventListener('scroll', debounce(updateActiveNavLink, 100));
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ===== ANIMAÇÕES =====
    function initAnimations() {
        if (!CONFIG.enableAnimations) return;
        
        // Animação de entrada para elementos
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observar elementos para animação
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
        
        // Animação para stats/counters
        initCounters();
    }

    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 segundos
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Iniciar quando visível
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        counterObserver.unobserve(entry.target);
                    }
                });
            });
            
            counterObserver.observe(counter);
        });
    }

    // ===== FORMULÁRIOS =====
    function initForms() {
        const forms = document.querySelectorAll('form[data-ajax]');
        
        forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
        });
        
        // Validação em tempo real
        document.querySelectorAll('input[required]').forEach(input => {
            input.addEventListener('blur', validateField);
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const statusElement = document.getElementById('contact-status');

        // Validar formulário
        if (!validateForm(form)) {
            if (statusElement) {
                statusElement.textContent = 'Por favor, preencha todos os campos obrigatórios.';
                statusElement.style.color = '#ef4444';
            }
            return;
        }

        // Mostrar loading
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        if (statusElement) {
            statusElement.textContent = '';
        }

        // Preparar dados para envio
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone') || '',
            message: formData.get('message') || ''
        };

        // Enviar para API
        fetch('http://localhost:8000/api/leads/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            submitBtn.textContent = 'Enviado!';
            submitBtn.disabled = false;

            if (statusElement) {
                statusElement.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                statusElement.style.color = '#10b981';
            }

            form.reset();

            // Restaurar texto original após 3 segundos
            setTimeout(() => {
                submitBtn.textContent = originalText;
                if (statusElement) {
                    statusElement.textContent = '';
                }
            }, 3000);

        })
        .catch(error => {
            console.error('Erro ao enviar formulário:', error);
            submitBtn.textContent = 'Erro - Tentar novamente';
            submitBtn.disabled = false;

            if (statusElement) {
                statusElement.textContent = 'Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.';
                statusElement.style.color = '#ef4444';
            }

            // Restaurar texto original após 3 segundos
            setTimeout(() => {
                submitBtn.textContent = originalText;
            }, 3000);
        });
    }

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('input[required], textarea[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        return isValid;
    }

    function validateField(e) {
        const field = e.target;
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.classList.add('error');
            showFieldError(field, 'Este campo é obrigatório');
        } else {
            field.classList.remove('error');
            clearFieldError(field);
        }
        
        // Validação específica por tipo
        if (field.type === 'email') {
            validateEmail(field);
        }
    }

    function validateEmail(field) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(field.value)) {
            field.classList.add('error');
            showFieldError(field, 'Por favor, insira um email válido');
        }
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // ===== EFEITOS DE SCROLL =====
    function initScrollEffects() {
        // Header fixo com background ao scrollar
        const header = document.querySelector('.main-header');
        
        if (header) {
            window.addEventListener('scroll', debounce(() => {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, 10));
        }
        
        // Botão "voltar ao topo"
        initBackToTop();
    }

    function initBackToTop() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(backToTopBtn);
        
        // Mostrar/ocultar botão
        window.addEventListener('scroll', debounce(() => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100));
    }

    // ===== INTEGRAÇÃO COM CHATBOT =====
    function initChatbotIntegration() {
        if (!CONFIG.chatbotEnabled) return;
        
        // Aguardar o chatbot carregar
        const checkChatbotLoaded = setInterval(() => {
            if (typeof WFChatbot !== 'undefined') {
                clearInterval(checkChatbotLoaded);
                state.chatbotInitialized = true;
                log('Chatbot integrado com sucesso');
                
                // Eventos customizados do chatbot
                setupChatbotEvents();
            }
        }, 100);
        
        // Timeout após 5 segundos
        setTimeout(() => {
            if (!state.chatbotInitialized) {
                clearInterval(checkChatbotLoaded);
                logError('Chatbot não carregado dentro do tempo esperado');
            }
        }, 5000);
    }

    function setupChatbotEvents() {
        // Aqui você pode adicionar interações específicas entre o site e o chatbot
        // Por exemplo: abrir chatbot quando clicar em "Solicitar Demonstração"
        
        const demoButtons = document.querySelectorAll('[data-open-chatbot]');
        demoButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (state.chatbotInitialized) {
                    WFChatbot.open();
                    
                    // Scroll suave para o chatbot
                    setTimeout(() => {
                        const chatbotIcon = document.getElementById('wfChatbotIcon');
                        if (chatbotIcon) {
                            chatbotIcon.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                        }
                    }, 500);
                }
            });
        });
    }

    // ===== SISTEMA DE NOTIFICAÇÕES =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animação de entrada
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Fechar notificação
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ===== UTILITÁRIOS =====
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== API REQUESTS =====
    async function apiRequest(endpoint, options = {}) {
        const url = `${CONFIG.apiBaseUrl}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        
        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            logError('Erro na requisição API', error);
            throw error;
        }
    }

    // ===== GERENCIAMENTO DE ESTADO =====
    function saveUserPreferences() {
        try {
            localStorage.setItem('webfun_ia_preferences', JSON.stringify(state.userPreferences));
        } catch (error) {
            logError('Erro ao salvar preferências', error);
        }
    }

    function loadUserPreferences() {
        try {
            const saved = localStorage.getItem('webfun_ia_preferences');
            if (saved) {
                state.userPreferences = JSON.parse(saved);
            }
        } catch (error) {
            logError('Erro ao carregar preferências', error);
        }
    }

    function updatePreference(key, value) {
        state.userPreferences[key] = value;
        saveUserPreferences();
    }

    // ===== EXPORTAÇÃO PARA USO GLOBAL =====
    window.WebfunIA = {
        // Configuração
        config: CONFIG,
        state: state,
        
        // Métodos públicos
        showNotification: showNotification,
        apiRequest: apiRequest,
        updatePreference: updatePreference,
        
        // Utilitários
        debounce: debounce,
        throttle: throttle,
        
        // Logs (apenas em debug mode)
        log: CONFIG.debugMode ? log : function() {},
        
        // Reinicialização
        reinitialize: function() {
            initializeApp();
        }
    };

    // Log de inicialização
    log('Webfun.IA Main.js carregado');

})();