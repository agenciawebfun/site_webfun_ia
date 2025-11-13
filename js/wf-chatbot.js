// ===== CHATBOT WEBFUN.IA =====
// Script com namespacing para evitar conflitos

(function() {
    'use strict';
    
    // Configuração do chatbot
    const WF_CHATBOT_CONFIG = {
        botName: 'AtendeBot',
        companyName: 'Webfun.IA',
        websiteUrl: 'https://ia.webfun.com.br',
        animationSpeed: 300,
        whatsappNumber: '+5547997618824',
        get whatsappLink() {
            return `https://wa.me/${this.whatsappNumber.replace(/[^0-9]/g,'')}?text=${encodeURIComponent('Olá! Vim do site e quero saber mais.')}`;
        }
    };
    
    // Elementos do DOM
    let chatbotElements = {};
    let conversationState = 'initial';
    let userName = '';
    let currentService = '';
    
    // Inicialização quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        initializeChatbot();
    });
    
    function initializeChatbot() {
        createChatbotElements();
        setupEventListeners();
        showWelcomeNotification();
    }
    
    function createChatbotElements() {
        // Criar ícone do chatbot
        const chatbotIcon = document.createElement('button');
        chatbotIcon.className = 'wf-chatbot-icon';
        chatbotIcon.id = 'wfChatbotIcon';
        chatbotIcon.innerHTML = `
            <img src="images/icone.png" alt="Chatbot Webfun.IA" class="wf-chatbot-logo" onerror="this.style.display='none'; this.parentElement.classList.add('wf-chatbot-fallback'); this.parentElement.querySelector('.wf-chatbot-fallback-icon').style.display='block';" />
            <svg class="wf-chatbot-fallback-icon" style="display: none;" width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <div class="wf-notification-badge">1</div>
        `;
        
        // Criar container do chat
        const chatContainer = document.createElement('div');
        chatContainer.className = 'wf-chat-container';
        chatContainer.id = 'wfChatContainer';
        chatContainer.innerHTML = `
            <div class="wf-chat-header">
                <h1>${WF_CHATBOT_CONFIG.botName} - ${WF_CHATBOT_CONFIG.companyName}</h1>
                <button class="wf-close-btn" id="wfCloseChat">×</button>
            </div>
            <div class="wf-chat-messages" id="wfChatMessages"></div>
            <div class="wf-chat-input-container">
                <input type="text" class="wf-chat-input" id="wfUserInput" placeholder="Digite sua mensagem..." autocomplete="off">
                <button class="wf-send-button" id="wfSendButton">Enviar</button>
            </div>
        `;
        
        // Adicionar ao body
        document.body.appendChild(chatbotIcon);
        document.body.appendChild(chatContainer);
        
        // Armazenar referências
        chatbotElements = {
            icon: chatbotIcon,
            container: chatContainer,
            messages: document.getElementById('wfChatMessages'),
            input: document.getElementById('wfUserInput'),
            sendButton: document.getElementById('wfSendButton'),
            closeButton: document.getElementById('wfCloseChat')
        };
    }
    
    function setupEventListeners() {
        chatbotElements.icon.addEventListener('click', openChat);
        chatbotElements.closeButton.addEventListener('click', closeChat);
        chatbotElements.sendButton.addEventListener('click', processUserInput);
        chatbotElements.input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') processUserInput();
        });
        
        // Fechar ao clicar fora
        document.addEventListener('click', function(e) {
            if (!chatbotElements.container.contains(e.target) && 
                !chatbotElements.icon.contains(e.target) && 
                !e.target.closest('.wf-option') &&
                !e.target.closest('.wf-options-container') &&
                chatbotElements.container.classList.contains('wf-active')) {
                closeChat();
            }
        });
    }
    
    function showWelcomeNotification() {
        // Badge pulsante por 5 segundos
        setTimeout(() => {
            const badge = chatbotElements.icon.querySelector('.wf-notification-badge');
            if (badge) {
                badge.style.animation = 'none';
                setTimeout(() => badge.style.animation = 'wf-pulse 2s infinite', 50);
            }
        }, 1000);
    }
    
    function openChat() {
        chatbotElements.container.classList.add('wf-active');
        chatbotElements.icon.querySelector('.wf-notification-badge').classList.add('wf-hidden');
        
        if (conversationState === 'initial' && chatbotElements.messages.children.length === 0) {
            startConversation();
        }
        
        setTimeout(() => chatbotElements.input.focus(), WF_CHATBOT_CONFIG.animationSpeed);
    }
    
    function closeChat() {
        chatbotElements.container.classList.remove('wf-active');
    }
    
    function startConversation() {
        addBotMessage('👋 Olá! Eu sou o AtendeBot, o assistente virtual da Webfun.IA.');
        
        setTimeout(() => {
            addBotMessage('Estou aqui para ajudar você a descobrir como a inteligência artificial pode impulsionar o seu negócio.');
            
            setTimeout(() => {
                addBotMessage('Antes de começarmos, posso saber o seu nome? 😊');
            }, 1000);
        }, 1000);
    }
    
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'wf-message wf-user-message wf-fade-in';
        messageDiv.textContent = text;
        chatbotElements.messages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function addBotMessage(text, allowHTML = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'wf-message wf-bot-message wf-fade-in';
        if (allowHTML) {
            messageDiv.innerHTML = text;
        } else {
            messageDiv.textContent = text;
        }
        chatbotElements.messages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'wf-typing-indicator';
        typingDiv.innerHTML = `${WF_CHATBOT_CONFIG.botName} está digitando<span class="wf-typing-dots"><span class="wf-typing-dot"></span><span class="wf-typing-dot"></span><span class="wf-typing-dot"></span></span>`;
        chatbotElements.messages.appendChild(typingDiv);
        scrollToBottom();
        return typingDiv;
    }
    
    function scrollToBottom() {
        setTimeout(() => {
            chatbotElements.messages.scrollTop = chatbotElements.messages.scrollHeight;
        }, 100);
    }
    
    function showServices() {
        const servicesHTML = `
            <div class="wf-options-container">
                <div class="wf-option" data-service="1">
                    <div class="wf-option-number">1</div>
                    <div class="wf-option-text"><span class="wf-service-icon">📈</span> Previsão Inteligente de Vendas</div>
                </div>
                <div class="wf-option" data-service="2">
                    <div class="wf-option-number">2</div>
                    <div class="wf-option-text"><span class="wf-service-icon">🤖</span> Atendimento 24h com IA</div>
                </div>
                <div class="wf-option" data-service="3">
                    <div class="wf-option-number">3</div>
                    <div class="wf-option-text"><span class="wf-service-icon">⚙️</span> Automação Inteligente de Processos</div>
                </div>
                <div class="wf-option" data-service="4">
                    <div class="wf-option-number">4</div>
                    <div class="wf-option-text"><span class="wf-service-icon">🎯</span> Campanhas com IA</div>
                </div>
                <div class="wf-option" data-service="5">
                    <div class="wf-option-number">5</div>
                    <div class="wf-option-text"><span class="wf-service-icon">📊</span> Radar de Reputação</div>
                </div>
                <div class="wf-option" data-service="6">
                    <div class="wf-option-number">6</div>
                    <div class="wf-option-text"><span class="wf-service-icon">📋</span> Relatórios Inteligentes</div>
                </div>
            </div>
        `;
        
        chatbotElements.messages.insertAdjacentHTML('beforeend', servicesHTML);
        
        document.querySelectorAll('.wf-option[data-service]').forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation(); // Impede que o evento se propague
                selectService(this.getAttribute('data-service'));
            });
        });
        
        scrollToBottom();
    }
    
    function selectService(serviceNumber) {
        removeOptions();
        addUserMessage(`Opção ${serviceNumber}`);
        
        currentService = serviceNumber;
        conversationState = 'serviceSelected';
        
        const typingIndicator = showTypingIndicator();
        
        setTimeout(() => {
            typingIndicator.remove();
            
            const services = {
                '1': {
                    name: 'Previsão Inteligente de Vendas',
                    description: 'Utilizamos algoritmos preditivos para antecipar tendências de mercado e comportamentos de compra, permitindo que você tome decisões mais assertivas.'
                },
                '2': {
                    name: 'Atendimento 24h com IA',
                    description: 'Permite que seu site, WhatsApp ou redes sociais respondam automaticamente a clientes — 24 horas por dia, com rapidez e personalização.'
                },
                '3': {
                    name: 'Automação Inteligente de Processos',
                    description: 'Automatizamos processos repetitivos e complexos com IA, aumentando a eficiência operacional e reduzindo custos.'
                },
                '4': {
                    name: 'Campanhas com IA',
                    description: 'Criamos campanhas de marketing hiper-personalizadas que se adaptam em tempo real ao comportamento do seu público.'
                },
                '5': {
                    name: 'Radar de Reputação',
                    description: 'Monitoramos e analisamos a reputação da sua marca em todas as plataformas online, identificando oportunidades e riscos.'
                },
                '6': {
                    name: 'Relatórios Inteligentes',
                    description: 'Transformamos dados complexos em insights acionáveis com relatórios automatizados e fáceis de entender.'
                }
            };
            
            const service = services[serviceNumber];
            addBotMessage(`🔹 Excelente escolha! O ${service.name} ${service.description}`);
            
            setTimeout(showActionOptions, 1000);
            
        }, 1500);
    }
    
    function showActionOptions() {
        addBotMessage('O que você gostaria de fazer agora?');
        
        const actionsHTML = `
            <div class="wf-options-container">
                <div class="wf-option" data-action="1">
                    <div class="wf-option-number">🧾</div>
                    <div class="wf-option-text">Solicitar orçamento</div>
                </div>
                <div class="wf-option" data-action="2">
                    <div class="wf-option-number">🧠</div>
                    <div class="wf-option-text">Saber mais detalhes técnicos</div>
                </div>
                <div class="wf-option" data-action="3">
                    <div class="wf-option-number">💬</div>
                    <div class="wf-option-text">Falar com um atendente humano</div>
                </div>
                <div class="wf-option" data-action="4">
                    <div class="wf-option-number">📊</div>
                    <div class="wf-option-text">Ver exemplos e resultados</div>
                </div>
                <div class="wf-option" data-action="5">
                    <div class="wf-option-number">❓</div>
                    <div class="wf-option-text">Voltar aos serviços</div>
                </div>
            </div>
        `;
        
        chatbotElements.messages.insertAdjacentHTML('beforeend', actionsHTML);
        
        document.querySelectorAll('.wf-option[data-action]').forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation(); // Impede que o evento se propague
                handleAction(this.getAttribute('data-action'));
            });
        });
        
        scrollToBottom();
    }
    
    function handleAction(actionNumber) {
        removeOptions();
        const typingIndicator = showTypingIndicator();
        
        setTimeout(() => {
            typingIndicator.remove();
            
            const actions = {
                '1': () => {
                    addBotMessage(`Perfeito, ${userName}! 💰`);
                    addBotMessage('Para gerar um orçamento personalizado, preciso de algumas informações rápidas:');
                    addBotMessage('• Nome da sua empresa');
                    addBotMessage('• Segmento (ex: loja, restaurante, clínica)');
                    addBotMessage('• Canal que deseja integrar (ex: site, WhatsApp, Instagram)');
                    addBotMessage('Assim que eu receber essas informações, posso estimar o investimento e enviar ao nosso time de especialistas.');
                    addBotMessage(`<div style="margin-top:8px"><a href="${WF_CHATBOT_CONFIG.whatsappLink}" target="_blank" rel="noopener" class="wf-whatsapp-link">💬 Falar agora no WhatsApp</a></div>`);
                    finishConversation();
                },
                '2': () => {
                    addBotMessage('Claro! 💡');
                    addBotMessage('Nossas soluções utilizam modelos de IA avançados, podem ser integradas com diversas ferramentas e são totalmente customizáveis para atender suas necessidades específicas.');
                    addBotMessage('🔧 **Guia Técnico Breve:**');
                    addBotMessage('• **APIs REST**: Integração simples com sistemas existentes');
                    addBotMessage('• **Machine Learning**: Algoritmos preditivos e classificação');
                    addBotMessage('• **NLP**: Processamento de linguagem natural para chatbots');
                    addBotMessage('• **Cloud**: Infraestrutura escalável (AWS, Azure, Google)');
                    addBotMessage('• **Dados**: Análise em tempo real e dashboards inteligentes');
                    addBotMessage('• **Segurança**: Criptografia e compliance LGPD');
                    setTimeout(() => {
                        addBotMessage('Para mais informações:');
                        addBotMessage('Digite **1** - Para guia técnico detalhado');
                        addBotMessage('Digite **2** - Para falar com consultor');
                        conversationState = 'techGuideOptions';
                    }, 1000);
                },
                '3': () => {
                    addBotMessage('Sem problemas! 🧑‍💻');
                    addBotMessage('Vou transferir você para um de nossos especialistas humanos.');
                    addBotMessage('⏳ Aguarde um momento...');
                    addBotMessage(`<a href="${WF_CHATBOT_CONFIG.whatsappLink}" target="_blank" rel="noopener" class="wf-whatsapp-link">➡️ Abrir WhatsApp do Especialista</a>`);
                    setTimeout(() => {
                        addBotMessage('Enquanto isso, posso anotar o seu e-mail para garantir o retorno mesmo se a conexão cair?');
                    }, 2000);
                },
                '4': () => {
                    addBotMessage('Aqui estão alguns resultados alcançados com nossas soluções de IA:');
                    addBotMessage('📈 +35% de aumento nas conversões');
                    addBotMessage('⏱️ -20% no tempo de resposta');
                    addBotMessage('💬 +40% de satisfação do cliente');
                    addBotMessage('Quer que eu te mostre cases reais do seu segmento?');
                },
                '5': () => {
                    addBotMessage('Sem problema!');
                    addBotMessage('Aqui estão novamente os serviços disponíveis 👇');
                    showServices();
                }
            };
            
            if (actions[actionNumber]) {
                actions[actionNumber]();
            }
            
        }, 1500);
    }
    
    function removeOptions() {
        const optionsContainer = chatbotElements.messages.querySelector('.wf-options-container');
        if (optionsContainer) {
            optionsContainer.remove();
        }
    }
    
    function finishConversation() {
        setTimeout(() => {
            addBotMessage(`✅ Tudo certo, ${userName}!`);
            addBotMessage('Sua solicitação foi registrada e nosso time entrará em contato em breve.');
            addBotMessage('Enquanto isso, você pode conhecer mais sobre a Webfun.IA aqui 👇');
            addBotMessage(`🌐 ${WF_CHATBOT_CONFIG.websiteUrl}`);
            addBotMessage('Obrigado por conversar comigo! 🚀');
        }, 1000);
    }
    
    function processUserInput() {
        const message = chatbotElements.input.value.trim();
        
        if (message) {
            addUserMessage(message);
            
            if (conversationState === 'initial') {
                userName = message;
                conversationState = 'gotName';
                
                const typingIndicator = showTypingIndicator();
                
                setTimeout(() => {
                    typingIndicator.remove();
                    addBotMessage(`Prazer em te conhecer, ${userName}! 🙌`);
                    
                    setTimeout(() => {
                        addBotMessage('Aqui na Webfun.IA nós ajudamos empreendedores e negócios locais a economizar tempo e aumentar resultados com soluções de Inteligência Artificial.');
                        
                        setTimeout(() => {
                            addBotMessage('💡 Estes são alguns dos serviços que posso te apresentar:');
                            showServices();
                        }, 1000);
                    }, 1000);
                }, 1500);
            } else if (conversationState === 'gotName') {
                if (['1', '2', '3', '4', '5', '6'].includes(message)) {
                    selectService(message);
                } else {
                    const typingIndicator = showTypingIndicator();
                    setTimeout(() => {
                        typingIndicator.remove();
                        addBotMessage('Por favor, selecione um dos serviços disponíveis clicando nas opções ou digitando o número (1 a 6).');
                        scrollToBottom();
                    }, 1000);
                }
            } else if (conversationState === 'techGuideOptions') {
                const typingIndicator = showTypingIndicator();
                setTimeout(() => {
                    typingIndicator.remove();
                    if (message === '1') {
                        addBotMessage('📄 **Guia Técnico Detalhado**');
                        addBotMessage('Vou enviar informações técnicas mais completas:');
                        addBotMessage('🔹 **Arquitetura**: Microserviços escaláveis, APIs RESTful, WebHooks');
                        addBotMessage('🔹 **IA/ML**: TensorFlow, PyTorch, scikit-learn, modelos pré-treinados');
                        addBotMessage('🔹 **Integrações**: Zapier, Make, APIs nativas (WhatsApp, Telegram, Slack)');
                        addBotMessage('🔹 **Database**: PostgreSQL, MongoDB, Redis para cache');
                        addBotMessage('🔹 **Deploy**: Docker, Kubernetes, CI/CD automatizado');
                        addBotMessage('🔹 **Monitoramento**: Logs estruturados, métricas em tempo real');
                        addBotMessage('Para documentação técnica completa e exemplos de código, entre em contato conosco! 🚀');
                        finishConversation();
                    } else if (message === '2') {
                        addBotMessage('Excelente! 👨‍💻');
                        addBotMessage('Vou conectar você com um dos nossos consultores técnicos especialistas.');
                        addBotMessage('📧 contato@ia.webfun.com.br');
                        addBotMessage('📱 (11) 99999-9999');
                        addBotMessage('Nosso time técnico entrará em contato em até 2 horas! ⚡');
                        finishConversation();
                    } else {
                        addBotMessage('Por favor, digite **1** para guia técnico detalhado ou **2** para falar com consultor.');
                    }
                }, 1000);
            }
            
            chatbotElements.input.value = '';
        }
    }
    
    // Expor funções globais se necessário
    window.WFChatbot = {
        open: openChat,
        close: closeChat,
        reset: function() {
            conversationState = 'initial';
            userName = '';
            currentService = '';
            chatbotElements.messages.innerHTML = '';
        }
    };
    
})();