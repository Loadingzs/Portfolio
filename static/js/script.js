// ============================================================================
// CONFIGURAÇÕES E CONSTANTES
// ============================================================================
const CONFIG = {
  enableSkillAnimations: true,
  enablePortfolioFilter: true,
  enableThemeToggle: true,
  enableSmoothScroll: true,
  enableAnalytics: false,
  enableErrorReporting: false,
  enablePWA: false,
  skillAnimationDelay: 100,
  portfolioAnimationDuration: 300,
  themeKey: 'portfolio_theme',
  observerThreshold: 0.1,
  observerRootMargin: '0px 0px -100px 0px',
  contactApiEndpoint: '/api/contact',
  animationDuration: {
    short: 200,
    medium: 300,
    long: 500
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  }
};

// ============================================================================
// VARIÁVEIS GLOBAIS E CACHE DE ELEMENTOS
// ============================================================================
let currentTheme = 'light';
let portfolioItems = [];
let isMenuOpen = false;

// Cache de elementos DOM para melhor performance
const DOMCache = {
  header: null,
  themeToggle: null,
  navbarToggle: null,
  navbarMenu: null,
  backToTop: null,
  currentYear: null,
  contactForm: null,
  skillProgressBars: null,
  filterButtons: null
};

// ============================================================================
// UTILITIES
// ============================================================================
// Sistema de debounce para eventos
function debounce(func, wait = 100) {
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

// Sistema de storage
const Storage = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return localStorage.getItem(key);
    }
  },
  
  set: (key, value) => {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  },
  
  remove: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};

// Sistema de logging
const Logger = {
  info: (message, data = null) => {
    console.log(`[INFO] ${message}`, data || '');
  },
  
  error: (message, error = null) => {
    console.error(`[ERROR] ${message}`, error || '');
    
    if (CONFIG.enableErrorReporting) {
      // sendToErrorService(message, error);
    }
  },
  
  warn: (message, data = null) => {
    console.warn(`[WARN] ${message}`, data || '');
  }
};

// Sistema de analytics
const Analytics = {
  track: (event, data = {}) => {
    if (CONFIG.enableAnalytics) {
      console.log(`[Analytics] ${event}`, data);
      // Implementar Google Analytics, Mixpanel, etc.
    }
  },
  
  trackPageView: (page) => {
    Analytics.track('page_view', { page });
  },
  
  trackEvent: (category, action, label = null) => {
    Analytics.track('event', { category, action, label });
  }
};

// ============================================================================
// INICIALIZAÇÃO PRINCIPAL
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
  Logger.info('Portfólio inicializado com configurações:', CONFIG);
  Analytics.trackPageView(window.location.pathname);
  
  initCache();
  initTheme();
  initNavigation();
  initSkillAnimations();
  initPortfolioFilter();
  initContactForm();
  initBackToTop();
  initAnimationsOnScroll();
  initCurrentYear();
  animateHeroElements();
  initTypingEffect();
  initVisitCounter();
  initLoadingScreen();
  trackImportantInteractions();
  
  // Carregar fontes
  loadFonts();
  
  Logger.info('Inicialização completa');
});

// ============================================================================
// INICIALIZAÇÃO DO CACHE
// ============================================================================
function initCache() {
  try {
    DOMCache.header = document.querySelector('.header');
    DOMCache.themeToggle = document.querySelector('.theme-toggle');
    DOMCache.navbarToggle = document.querySelector('.navbar__toggle');
    DOMCache.navbarMenu = document.querySelector('.navbar__menu');
    DOMCache.backToTop = document.querySelector('.back-to-top');
    DOMCache.currentYear = document.getElementById('current-year');
    DOMCache.contactForm = document.querySelector('.contact__form');
    DOMCache.skillProgressBars = document.querySelectorAll('.skill-progress');
    DOMCache.filterButtons = document.querySelectorAll('.filter-btn');
    DOMCache.portfolioItems = document.querySelectorAll('.portfolio-item');
    
    Logger.info('Cache DOM inicializado');
  } catch (error) {
    Logger.error('Erro ao inicializar cache DOM', error);
  }
}

// ============================================================================
// GERENCIAMENTO DE TEMA
// ============================================================================
function initTheme() {
  if (!CONFIG.enableThemeToggle) return;
  
  // Verificar tema salvo
  const savedTheme = localStorage.getItem(CONFIG.themeKey);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Definir tema inicial
  if (savedTheme) {
    currentTheme = savedTheme;
  } else if (prefersDark) {
    currentTheme = 'dark';
  }
  
  // Aplicar tema
  applyTheme();
  
  // Configurar botão de alternância
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    updateThemeIcon();
    Logger.info('Tema inicializado e botão configurado');
  }
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme();
  updateThemeIcon();
  localStorage.setItem(CONFIG.themeKey, currentTheme);
  Analytics.trackEvent('theme', 'toggle', currentTheme);
  Logger.info('Tema alterado para:', currentTheme);
}

function applyTheme() {
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}

function updateThemeIcon() {
  const icon = document.querySelector('.theme-toggle i');
  if (icon) {
    icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// ============================================================================
// NAVEGAÇÃO
// ============================================================================
function initNavigation() {
  try {
    // Menu mobile
    if (DOMCache.navbarToggle && DOMCache.navbarMenu) {
      DOMCache.navbarToggle.addEventListener('click', toggleMobileMenu);
      
      const navLinks = document.querySelectorAll('.navbar__link');
      navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
    }
    
    // Smooth scroll
    if (CONFIG.enableSmoothScroll) {
      initSmoothScroll();
    }
    
    // Header scroll effect
    window.addEventListener('scroll', debounce(handleHeaderScroll, 10));
    window.addEventListener('scroll', debounce(updateActiveNavLinkOnScroll, 50));
    
    // Resize handler
    window.addEventListener('resize', debounce(handleResize, 150));
    
    Logger.info('Navegação inicializada');
  } catch (error) {
    Logger.error('Erro ao inicializar navegação', error);
  }
}

function toggleMobileMenu() {
  isMenuOpen = !isMenuOpen;
  DOMCache.navbarToggle.classList.toggle('active');
  DOMCache.navbarMenu.classList.toggle('active');
  document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  
  Analytics.trackEvent('navigation', 'mobile_menu_toggle', isMenuOpen ? 'open' : 'close');
}

function closeMobileMenu() {
  DOMCache.navbarToggle.classList.remove('active');
  DOMCache.navbarMenu.classList.remove('active');
  isMenuOpen = false;
  document.body.style.overflow = '';
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      const headerHeight = DOMCache.header?.offsetHeight || 80;
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      updateActiveNavLink(targetId);
      Analytics.trackEvent('navigation', 'internal_link_click', targetId);
    });
  });
}

function updateActiveNavLink(targetId = null) {
  const navLinks = document.querySelectorAll('.navbar__link');
  
  if (targetId) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === targetId) {
        link.classList.add('active');
      }
    });
  } else {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = sectionId;
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
}

function updateActiveNavLinkOnScroll() {
  if (CONFIG.enableSmoothScroll) {
    updateActiveNavLink();
  }
}

function handleHeaderScroll() {
  if (DOMCache.header) {
    if (window.scrollY > 100) {
      DOMCache.header.classList.add('scrolled');
    } else {
      DOMCache.header.classList.remove('scrolled');
    }
  }
}

function handleResize() {
  // Fechar menu móvel se a tela for redimensionada para maior
  if (window.innerWidth > CONFIG.breakpoints.mobile && isMenuOpen) {
    closeMobileMenu();
  }
}

// ============================================================================
// ANIMAÇÕES DE HABILIDADES
// ============================================================================
function initSkillAnimations() {
  if (!CONFIG.enableSkillAnimations) return;
  
  try {
    const skillsSection = document.querySelector('.skills');
    if (!skillsSection) return;
    
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateSkillBars();
            skillObserver.unobserve(entry.target);
            Analytics.trackEvent('animation', 'skills_visible');
          }
        });
      },
      {
        threshold: CONFIG.observerThreshold,
        rootMargin: CONFIG.observerRootMargin
      }
    );
    
    skillObserver.observe(skillsSection);
    Logger.info('Animações de habilidades inicializadas');
  } catch (error) {
    Logger.error('Erro ao inicializar animações de habilidades', error);
  }
}

function animateSkillBars() {
  const skillProgressBars = DOMCache.skillProgressBars;
  
  if (!skillProgressBars) return;
  
  skillProgressBars.forEach((bar, index) => {
    setTimeout(() => {
      const level = bar.getAttribute('data-level');
      bar.style.width = `${level}%`;
      bar.style.transition = `width 1.5s ease-out ${index * 0.1}s`;
    }, index * CONFIG.skillAnimationDelay);
  });
}

// ============================================================================
// FILTRO DO PORTFÓLIO
// ============================================================================
function initPortfolioFilter() {
  if (!CONFIG.enablePortfolioFilter) return;
  
  try {
    portfolioItems = Array.from(DOMCache.portfolioItems || []);
    
    if (DOMCache.filterButtons) {
      DOMCache.filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          const filter = this.getAttribute('data-filter');
          
          // Atualizar botões ativos
          DOMCache.filterButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          // Filtrar itens
          filterPortfolioItems(filter);
          
          Analytics.trackEvent('portfolio', 'filter', filter);
        });
      });
    }
    
    Logger.info('Filtro de portfólio inicializado');
  } catch (error) {
    Logger.error('Erro ao inicializar filtro de portfólio', error);
  }
}

function filterPortfolioItems(filter) {
  portfolioItems.forEach((item, index) => {
    const category = item.getAttribute('data-category');
    const shouldShow = filter === 'all' || category === filter;
    
    setTimeout(() => {
      if (shouldShow) {
        item.classList.remove('hidden');
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      } else {
        item.classList.add('hidden');
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
      }
    }, index * 50);
  });
}

// ============================================================================
// FORMULÁRIO DE CONTATO
// ============================================================================
function initContactForm() {
  const contactForm = DOMCache.contactForm;
  
  if (!contactForm) return;
  
  try {
    // Adicionar validação em tempo real
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', clearFieldError);
    });
    
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (!validateForm()) {
        showNotification('Por favor, corrija os erros no formulário.', 'error');
        return;
      }
      
      const formData = new FormData(this);
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      submitButton.textContent = 'Enviando...';
      submitButton.disabled = true;
      
      try {
        // Simulação de envio - substituir por chamada real à API
        const response = await simulateApiCall(formData);
        
        if (response.success) {
          showNotification('Mensagem enviada com sucesso! Em breve entrarei em contato.', 'success');
          contactForm.reset();
          Analytics.trackEvent('contact', 'form_submit_success');
        } else {
          showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
          Analytics.trackEvent('contact', 'form_submit_error');
        }
      } catch (error) {
        showNotification('Erro de conexão. Verifique sua internet.', 'error');
        Logger.error('Erro ao enviar formulário', error);
        Analytics.trackEvent('contact', 'form_submit_exception');
      } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
    
    Logger.info('Formulário de contato inicializado');
  } catch (error) {
    Logger.error('Erro ao inicializar formulário de contato', error);
  }
}

function validateForm() {
  let isValid = true;
  const form = DOMCache.contactForm;
  if (!form) return false;
  
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  
  inputs.forEach(input => {
    if (!validateField({ target: input })) {
      isValid = false;
    }
  });
  
  return isValid;
}

function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  let isValid = true;
  let message = '';
  
  field.classList.remove('error');
  
  if (field.required && !value) {
    isValid = false;
    message = 'Este campo é obrigatório';
  } else if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      message = 'Email inválido';
    }
  } else if (field.name === 'message' && value.length < 10) {
    isValid = false;
    message = 'Mensagem muito curta (mínimo 10 caracteres)';
  }
  
  if (!isValid) {
    field.classList.add('error');
    showFieldError(field, message);
  } else {
    clearFieldError({ target: field });
  }
  
  return isValid;
}

function showFieldError(field, message) {
  let errorElement = field.parentNode.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    field.parentNode.appendChild(errorElement);
  }
  errorElement.textContent = message;
  errorElement.style.cssText = 'color: #f44336; font-size: 12px; margin-top: 5px;';
}

function clearFieldError(e) {
  const field = e.target;
  field.classList.remove('error');
  const errorElement = field.parentNode.querySelector('.error-message');
  if (errorElement) errorElement.remove();
}

async function simulateApiCall(formData) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        message: 'Mensagem recebida com sucesso!' 
      });
    }, 1500);
  });
}

// ============================================================================
// NOTIFICAÇÕES
// ============================================================================
function showNotification(message, type = 'info') {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'assertive');
  
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification__close" aria-label="Fechar notificação">&times;</button>
  `;
  
  // Estilos da notificação
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: var(--z-notification, 3000);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 300px;
    max-width: 400px;
    animation: slideInRight 0.3s ease;
  `;
  
  // Botão de fechar
  const closeBtn = notification.querySelector('.notification__close');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    margin-left: 15px;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  closeBtn.addEventListener('click', () => {
    closeNotification(notification);
  });
  
  // Adicionar ao body
  document.body.appendChild(notification);
  
  // Adicionar animações CSS se não existirem
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remover automaticamente após 5 segundos
  const autoRemoveTimeout = setTimeout(() => {
    if (notification.parentNode) {
      closeNotification(notification);
    }
  }, 5000);
  
  // Função para fechar notificação
  function closeNotification(notif) {
    clearTimeout(autoRemoveTimeout);
    notif.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notif.parentNode) {
        notif.parentNode.removeChild(notif);
      }
    }, 300);
  }
}

// ============================================================================
// BOTÃO VOLTAR AO TOPO
// ============================================================================
function initBackToTop() {
  const backToTopButton = DOMCache.backToTop;
  
  if (backToTopButton) {
    window.addEventListener('scroll', debounce(() => {
      if (window.scrollY > 500) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    }, 10));
    
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      Analytics.trackEvent('navigation', 'back_to_top');
    });
    
    Logger.info('Botão voltar ao topo inicializado');
  }
}

// ============================================================================
// ANIMAÇÕES NO SCROLL
// ============================================================================
function initAnimationsOnScroll() {
  try {
    const animatedElements = document.querySelectorAll(
      '.about__image, .about__text, .skill-category, .portfolio-item, .timeline-item'
    );
    
    animatedElements.forEach(element => {
      element.classList.add('fade-in-up');
    });
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: CONFIG.observerThreshold,
        rootMargin: CONFIG.observerRootMargin
      }
    );
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
    
    Logger.info('Animações no scroll inicializadas');
  } catch (error) {
    Logger.error('Erro ao inicializar animações no scroll', error);
  }
}

// ============================================================================
// ANIMAÇÕES DO HERO
// ============================================================================
function animateHeroElements() {
  const heroElements = document.querySelectorAll('.hero__greeting, .hero__name, .hero__title, .hero__description, .hero__buttons, .hero__social');
  
  heroElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `all 0.6s ease ${index * 0.1}s`;
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100);
  });
}

// ============================================================================
// ANO ATUAL NO FOOTER
// ============================================================================
function initCurrentYear() {
  if (DOMCache.currentYear) {
    DOMCache.currentYear.textContent = new Date().getFullYear();
  }
}

// ============================================================================
// EFEITO DE DIGITAÇÃO (OPCIONAL)
// ============================================================================
function initTypingEffect() {
  const heroTitle = document.querySelector('.hero__title');
  if (!heroTitle) return;
  
  const originalText = heroTitle.textContent;
  heroTitle.textContent = '';
  
  let cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  heroTitle.appendChild(cursor);
  
  let i = 0;
  
  function typeWriter() {
    if (i < originalText.length) {
      const char = originalText.charAt(i);
      const charSpan = document.createElement('span');
      charSpan.textContent = char;
      charSpan.style.opacity = '0';
      charSpan.style.animation = `fadeIn 0.1s ease ${i * 0.05}s forwards`;
      
      heroTitle.insertBefore(charSpan, cursor);
      i++;
      setTimeout(typeWriter, 50);
    }
  }
  
  // Iniciar após um pequeno delay
  setTimeout(typeWriter, 1000);
}

// ============================================================================
// CONTADOR DE VISITAS
// ============================================================================
function initVisitCounter() {
  try {
    if (Storage.get('visitCount')) {
      let count = parseInt(Storage.get('visitCount'));
      count++;
      Storage.set('visitCount', count);
      Analytics.trackEvent('engagement', 'return_visit', count);
    } else {
      Storage.set('visitCount', 1);
      Analytics.trackEvent('engagement', 'first_visit');
    }
    
    Logger.info('Contador de visitas atualizado', { count: Storage.get('visitCount') });
  } catch (error) {
    Logger.error('Erro ao atualizar contador de visitas', error);
  }
}

// ============================================================================
// TELA DE CARREGAMENTO
// ============================================================================
function initLoadingScreen() {
  const loadingScreen = document.querySelector('.loading');
  if (!loadingScreen) {
    // Criar tela de loading se não existir
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = '<div class="loading__spinner"></div>';
    document.body.appendChild(loadingDiv);
  }
  
  // Esconder loading após carregamento completo
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loading = document.querySelector('.loading');
      if (loading) {
        loading.classList.add('hidden');
        setTimeout(() => {
          if (loading.parentNode) {
            loading.parentNode.removeChild(loading);
          }
        }, 500);
      }
    }, 500);
  });
}

// ============================================================================
// RASTREAMENTO DE INTERAÇÕES IMPORTANTES
// ============================================================================
function trackImportantInteractions() {
  // Rastrear cliques em botões importantes
  document.querySelectorAll('.btn--primary, .filter-btn, .social-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = e.target.textContent.trim() || e.target.getAttribute('aria-label') || 'Unknown';
      Analytics.trackEvent('interaction', 'button_click', text);
    });
  });
  
  // Rastrear downloads
  document.querySelectorAll('a[download]').forEach(link => {
    link.addEventListener('click', () => {
      const filename = link.getAttribute('href') || 'Unknown';
      Analytics.trackEvent('download', 'file', filename);
    });
  });
}

// ============================================================================
// CARREGAMENTO DE FONTES
// ============================================================================
function loadFonts() {
  try {
    // Carregar fontes do Google Fonts com preload para performance
    const preloadLink = document.createElement('link');
    preloadLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:wght@400;600;700&display=swap';
    preloadLink.rel = 'preload';
    preloadLink.as = 'style';
    preloadLink.crossOrigin = 'anonymous';
    document.head.appendChild(preloadLink);
    
    // Link principal das fontes
    const link = document.createElement('link');
    link.href = preloadLink.href;
    link.rel = 'stylesheet';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    
    Logger.info('Fontes carregadas');
  } catch (error) {
    Logger.error('Erro ao carregar fontes', error);
  }
}

// ============================================================================
// SERVICE WORKER (OPCIONAL - PARA PWA)
// ============================================================================
function registerServiceWorker() {
  if (CONFIG.enablePWA && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          Logger.info('ServiceWorker registrado com sucesso:', registration.scope);
          Analytics.trackEvent('pwa', 'service_worker_registered');
        })
        .catch(error => {
          Logger.error('Falha ao registrar ServiceWorker:', error);
          Analytics.trackEvent('pwa', 'service_worker_failed');
        });
    });
  }
}

// ============================================================================
// LAZY LOADING DE IMAGENS
// ============================================================================
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// ============================================================================
// INICIALIZAR FUNÇÕES ADICIONAIS APÓS CARREGAMENTO COMPLETO
// ============================================================================
window.addEventListener('load', () => {
  // Inicializar lazy loading
  initLazyLoading();
  
  // Registrar service worker se habilitado
  if (CONFIG.enablePWA) {
    registerServiceWorker();
  }
  
  // Adicionar classes de animação escalonada
  const portfolioGrid = document.querySelector('.portfolio__grid');
  if (portfolioGrid) {
    portfolioGrid.classList.add('stagger-animation');
  }
  
  Logger.info('Carregamento completo da página');
});

// ============================================================================
// EXPORTAÇÕES PARA DEBUG (OPCIONAL)
// ============================================================================
if (typeof window !== 'undefined') {
  // Para debugging no console
  window.PortfolioApp = {
    config: CONFIG,
    storage: Storage,
    logger: Logger,
    analytics: Analytics,
    toggleTheme: toggleTheme,
    showNotification: showNotification,
    getCurrentTheme: () => currentTheme
  };
  
  Logger.info('PortfolioApp disponível no console como window.PortfolioApp');
}