// Adicionar no início do arquivo
window.addEventListener('load', () => {
    document.body.classList.add('content-loaded');
    setTimeout(() => {
        document.querySelector('.page-transition').classList.add('loaded');
    }, 500);
});

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section, header .hero');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const hamburgerIcon = menuToggle ? menuToggle.querySelector('.hamburger') : null;

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburgerIcon && hamburgerIcon.classList.toggle('active');
        });
    }

    function updateActiveNavLink() {
        let currentSectionId = 'hero'; // Default to hero
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjusted for fixed header, nav height approx 70-80px
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Explicitly set hero if at the very top or scrolled slightly into it
        if (scrollPosition < (sections[0].offsetTop + sections[0].clientHeight - 100) && sections[0].id === 'hero') {
             currentSectionId = 'hero';
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.getElementById(href.substring(1));
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Adjusted for fixed header height
                        behavior: 'smooth'
                    });
                    // history.pushState(null, null, href); // Optional: for SPA-like URL updates
                    
                    // Close mobile menu if active
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        hamburgerIcon && hamburgerIcon.classList.remove('active');
                    }
                }
            }
        });
    });


    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call

    const allTopicSeparators = document.querySelectorAll('.topic-separator');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' });

    allTopicSeparators.forEach(section => sectionObserver.observe(section));

    const documentoCards = document.querySelectorAll('.documento-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.classList.contains('documento-card')) {
                const content = entry.target.querySelector('.documento-content');
                if (content) {
                    content.classList.add('visible');
                    setTimeout(() => entry.target.classList.add('revealed'), 300);
                }
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    documentoCards.forEach((card, index) => {
        setTimeout(() => revealObserver.observe(card), index * 150);
    });

    const timelineContainer = document.querySelector('.timeline-container');
    const timelineItems = timelineContainer ? timelineContainer.querySelectorAll('.timeline-item') : [];

    if (timelineContainer) {
        timelineContainer.style.setProperty('--timeline-line-progress', '0px');
        function easeOutQuad(t) { return t * (2 - t); }

        function animateTimelineOnScroll() {
            const containerRect = timelineContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const startAnimatePoint = windowHeight * 0.8;
            const endAnimatePoint = -containerRect.height * 0.1;

            if (containerRect.top < startAnimatePoint && containerRect.top > endAnimatePoint) {
                let scrollProgress = (startAnimatePoint - containerRect.top) / (startAnimatePoint - endAnimatePoint + containerRect.height * 0.1);
                scrollProgress = Math.min(1, Math.max(0, scrollProgress));
                const totalLineHeight = timelineContainer.scrollHeight - 40;
                const animatedHeight = easeOutQuad(scrollProgress) * totalLineHeight;
                timelineContainer.style.setProperty('--timeline-line-progress', `${animatedHeight}px`);

                timelineItems.forEach((item, index) => {
                    const itemTopRelativeToContainer = item.offsetTop - timelineContainer.offsetTop;
                    const itemThreshold = itemTopRelativeToContainer - item.offsetHeight * 0.3;
                    if (animatedHeight > itemThreshold) {
                        setTimeout(() => item.classList.add('visible'), index * 100);
                    } else {
                        item.classList.remove('visible');
                    }
                });
            } else if (containerRect.top <= endAnimatePoint) {
                timelineContainer.style.setProperty('--timeline-line-progress', `${timelineContainer.scrollHeight - 40}px`);
                timelineItems.forEach(item => item.classList.add('visible'));
            } else if (containerRect.top >= startAnimatePoint) {
                timelineContainer.style.setProperty('--timeline-line-progress', '0px');
                timelineItems.forEach(item => item.classList.remove('visible'));
            }
        }
        window.addEventListener('scroll', animateTimelineOnScroll);
        animateTimelineOnScroll();
    }

    if (typeof Swiper !== 'undefined') {
        const pinturasSwiper = new Swiper('.swiper-container', {
            effect: 'coverflow', grabCursor: true, centeredSlides: true, slidesPerView: 'auto',
            loop: true, speed: 800,
            autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
            coverflowEffect: { rotate: 40, stretch: 0, depth: 150, modifier: 1, slideShadows: true },
            pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            on: {
                slideChange: function () {
                    const detailsPanel = document.getElementById('obra-details-panel');
                    detailsPanel && detailsPanel.classList.remove('visible');
                    document.querySelectorAll('.swiper-slide.details-active').forEach(s => s.classList.remove('details-active'));
                }
            }
        });

        const detailButtons = document.querySelectorAll('.swiper-slide .details-btn');
        const detailsPanel = document.getElementById('obra-details-panel');
        const panelTitulo = document.getElementById('panel-obra-titulo');
        const panelArtista = document.getElementById('panel-obra-artista');
        const panelTextoDetalhes = document.getElementById('panel-obra-texto-detalhes');
        const closeDetailsButton = document.getElementById('close-details-panel');

        detailButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const slide = button.closest('.swiper-slide');
                if (detailsPanel) {
                    panelTitulo && (panelTitulo.textContent = slide.dataset.obraTitulo || "Título não disponível");
                    panelArtista && (panelArtista.textContent = slide.dataset.obraArtista || "Artista não disponível");
                    panelTextoDetalhes && (panelTextoDetalhes.textContent = slide.dataset.obraDetalhes || "Detalhes não disponíveis.");
                    detailsPanel.classList.add('visible');
                    document.querySelectorAll('.swiper-slide.details-active').forEach(s => s.classList.remove('details-active'));
                    slide.classList.add('details-active');
                }
            });
        });

        if (closeDetailsButton && detailsPanel) {
            closeDetailsButton.addEventListener('click', () => {
                detailsPanel.classList.remove('visible');
                document.querySelectorAll('.swiper-slide.details-active').forEach(s => s.classList.remove('details-active'));
            });
        }

        document.addEventListener('click', (e) => {
            if (detailsPanel && detailsPanel.classList.contains('visible') &&
                !detailsPanel.contains(e.target) && !e.target.closest('.details-btn')) {
                detailsPanel.classList.remove('visible');
                document.querySelectorAll('.swiper-slide.details-active').forEach(s => s.classList.remove('details-active'));
            }
        });
    } else {
        console.warn('Swiper library not loaded. Carrossel de pinturas não funcionará.');
    }

    const mapaElements = document.querySelectorAll('#mapa-argentina-placeholder path, #mapa-argentina-placeholder circle');
    const mapaInfoBox = document.getElementById('mapa-info');
    let activeMapElement = null;

    mapaElements.forEach(el => {
        const defaultInfoText = "Passe o mouse ou clique em uma área do mapa para ver informações.";
        
        el.addEventListener('mouseover', () => {
            if (mapaInfoBox && el.dataset.info) {
                mapaInfoBox.textContent = el.dataset.info;
                mapaInfoBox.classList.add('active');
                if (el !== activeMapElement) { // Don't scale if it's already the active (clicked) one
                    el.style.transform = 'scale(1.05)';
                }
                el.style.transition = 'transform 0.3s ease, fill 0.3s ease';
            }
        });

        el.addEventListener('click', () => {
            if (mapaInfoBox && el.dataset.info) {
                // Deactivate previous active element
                if (activeMapElement && activeMapElement !== el) {
                    activeMapElement.classList.remove('active-map-point');
                    activeMapElement.style.transform = 'scale(1)';
                }
                
                // Activate current element
                mapaInfoBox.textContent = el.dataset.info;
                mapaInfoBox.classList.add('active');
                el.classList.add('active-map-point');
                el.style.transform = 'scale(1.1)'; // Slightly larger scale for clicked item
                activeMapElement = el;
            }
        });

        el.addEventListener('mouseout', () => {
            if (mapaInfoBox) {
                if (el !== activeMapElement) {
                    mapaInfoBox.textContent = defaultInfoText;
                    mapaInfoBox.classList.remove('active');
                    el.style.transform = 'scale(1)';
                } else {
                    // If mousing out of the active element, keep its info but reset scale to its "active" state
                     mapaInfoBox.textContent = el.dataset.info; // Keep info for active element
                     el.style.transform = 'scale(1.1)'; // Maintain active scale
                }
            }
        });
    });


    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            heroSection.style.backgroundPositionY = `${(window.pageYOffset || document.documentElement.scrollTop) * 0.5}px`;
        });
    }

    const criarBotaoTopo = () => {
        const botaoTopo = document.createElement('button');
        botaoTopo.innerHTML = '⇧';
        botaoTopo.className = 'botao-topo';
        botaoTopo.setAttribute('aria-label', 'Voltar ao topo da página');
        botaoTopo.title = 'Voltar ao topo';
        document.body.appendChild(botaoTopo);

        const toggleVisibility = () => {
            botaoTopo.classList.toggle('visivel', (window.pageYOffset || document.documentElement.scrollTop) > 300);
        };
        
        window.addEventListener('scroll', toggleVisibility);
        toggleVisibility();

        const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
        botaoTopo.addEventListener('click', scrollToTop);
        botaoTopo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop();
            }
        });
    };
    criarBotaoTopo();

    const adicionarZoomImagens = () => {
        document.querySelectorAll('.swiper-slide').forEach(slide => {
            slide.addEventListener('mouseenter', () => {
                // Adiciona a classe de zoom apenas se o slide for o ativo no carrossel
                if (slide.classList.contains('swiper-slide-active')) {
                    slide.classList.add('zoom-effect');
                }
            });
            slide.addEventListener('mouseleave', () => {
                slide.classList.remove('zoom-effect');
            });
        });
    };
    adicionarZoomImagens();

    const melhorarAcessibilidade = () => {
        document.querySelectorAll('.details-btn').forEach(btn => btn.setAttribute('aria-haspopup', 'dialog'));
        document.querySelectorAll('.timeline-item').forEach((item, i) => item.setAttribute('aria-label', `Evento histórico ${i + 1}`));
        document.querySelectorAll('.swiper-slide').forEach(slide => {
            slide.setAttribute('tabindex', '0');
            slide.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const detailBtn = slide.querySelector('.details-btn');
                    detailBtn && detailBtn.click();
                }
            });
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const painelVisivel = document.querySelector('.obra-details-panel-external.visible .close-btn');
                painelVisivel && painelVisivel.click();
            }
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    };
    melhorarAcessibilidade();

    const adicionarElementosDecorativos = () => {
        document.querySelectorAll('.documento-card').forEach((doc, index) => {
            if (index % 3 === 0) { // Adiciona destaque a cada terceiro card (0, 3, 6...)
                doc.classList.add('destaque');
                ['corner-top-right', 'corner-bottom-left'].forEach(cls => {
                    const corner = document.createElement('div');
                    corner.className = cls;
                    doc.appendChild(corner);
                });
            }
        });
    };
    adicionarElementosDecorativos();
});