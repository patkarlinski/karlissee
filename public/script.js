const nav = document.querySelector('.menu--list');
const menu = document.querySelector('.menu');
const close = document.querySelector('.close');
const listItems = document.querySelectorAll('li');
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleLabel = document.querySelector('.theme-toggle__label');
const stickyNav = document.querySelector('.nav');
const navBackdrop = document.querySelector('.nav-backdrop');
const progressBar = document.querySelector('.scroll-progress__bar');
const backToTop = document.querySelector('.back-to-top');
const revealEls = document.querySelectorAll('.reveal');
const copyEmailBtn = document.querySelector('.js-copy-email');
const contactNote = document.querySelector('.contact__note');

const projectCards = document.querySelectorAll('.js-project');
const filterChips = document.querySelectorAll('.filter-chip');
const projectModal = document.querySelector('.project-modal');
const projectModalClose = document.querySelector('.project-modal__close');
const projectModalEyebrow = document.querySelector('#project-modal-eyebrow');
const projectModalTitle = document.querySelector('#project-modal-title');
const projectModalDescription = document.querySelector('#project-modal-description');
const projectModalDemo = document.querySelector('#project-modal-demo');
const projectModalGithub = document.querySelector('#project-modal-github');
let lastFocusedEl = null;

const openNav = () => {
    document.body.classList.add('nav-open');
    menu.classList.add('menu--hide');
    close.classList.add('close--show');
};

const closeNav = () => {
    document.body.classList.remove('nav-open');
    menu.classList.remove('menu--hide');
    close.classList.remove('close--show');
};

if (menu) {
    menu.addEventListener('click', openNav);
}
if (close) {
    close.addEventListener('click', closeNav);
}
if (navBackdrop) {
    navBackdrop.addEventListener('click', closeNav);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        closeNav();
    }
});

listItems.forEach((item) => {
    item.addEventListener('click', () => {
        if (document.body.classList.contains('nav-open')) closeNav();
    });
});

const applyTheme = (theme) => {
    const isLight = theme === 'light';
    document.body.classList.toggle('light-theme', isLight);
    if (themeToggleLabel) {
        themeToggleLabel.textContent = isLight ? 'Light' : 'Dark';
    }
};

const storedTheme = window.localStorage.getItem('theme');
if (storedTheme === 'light' || storedTheme === 'dark') {
    applyTheme(storedTheme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
        applyTheme(nextTheme);
        window.localStorage.setItem('theme', nextTheme);
    });
}

const onScroll = () => {
    const y = window.scrollY || 0;

    if (stickyNav) {
        stickyNav.classList.toggle('is-scrolled', y > 8);
    }

    if (backToTop) {
        backToTop.classList.toggle('is-visible', y > 600);
    }

    if (progressBar) {
        const doc = document.documentElement;
        const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
        const pct = Math.min(1, Math.max(0, y / max));
        progressBar.style.width = `${pct * 100}%`;
    }
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
        const email = copyEmailBtn.getAttribute('data-email') || '';
        if (!email) return;

        try {
            await navigator.clipboard.writeText(email);
            if (contactNote) contactNote.textContent = 'Copied to clipboard.';
        } catch {
            if (contactNote) contactNote.textContent = 'Copy failed. You can still email me.';
        }

        window.setTimeout(() => {
            if (contactNote) contactNote.textContent = '';
        }, 2200);
    });
}

if (revealEls.length > 0) {
    const prefersReduced =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
        );
        revealEls.forEach((el) => io.observe(el));
    }
}

const setActiveChip = (chip) => {
    filterChips.forEach((c) => {
        const isActive = c === chip;
        c.classList.toggle('is-active', isActive);
        c.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
};

const normalizeTag = (tag) => String(tag || '').trim().toLowerCase();

const matchesFilter = (card, filter) => {
    const f = normalizeTag(filter);
    if (f === 'all') return true;
    const tags = normalizeTag(card.getAttribute('data-tags'))
        .split(',')
        .map(normalizeTag)
        .filter(Boolean);
    const has = (t) => tags.includes(t);
    switch (f) {
        case 'node':
            return has('node') || has('node.js') || has('pm2');
        case 'astro':
            return has('astro');
        case 'css-tailwind':
            return has('css') || has('tailwind') || has('scss') || has('sass');
        default:
            return has(f);
    }
};

if (filterChips.length > 0 && projectCards.length > 0) {
    filterChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            const filter = chip.getAttribute('data-filter') || 'all';
            setActiveChip(chip);
            projectCards.forEach((card) => {
                card.classList.toggle('is-hidden', !matchesFilter(card, filter));
            });
        });
    });
}

const openProjectModal = (card) => {
    if (!projectModal) return;
    lastFocusedEl = document.activeElement;

    const title = card.getAttribute('data-title') || card.querySelector('.project-title')?.textContent || 'Project';
    const eyebrow = card.getAttribute('data-eyebrow') || card.querySelector('.project-eyebrow')?.textContent || '';
    const description =
        card.getAttribute('data-description') ||
        card.querySelector('.project-description')?.textContent ||
        '';
    const demo = card.getAttribute('data-demo') || '#';
    const github = card.getAttribute('data-github') || '#';

    if (projectModalEyebrow) projectModalEyebrow.textContent = eyebrow;
    if (projectModalTitle) projectModalTitle.textContent = title;
    if (projectModalDescription) projectModalDescription.textContent = description.trim();
    if (projectModalDemo) projectModalDemo.href = demo;
    if (projectModalGithub) projectModalGithub.href = github;

    if (typeof projectModal.showModal === 'function') {
        projectModal.showModal();
    } else {
        projectModal.setAttribute('open', '');
    }

    setTimeout(() => projectModalClose?.focus?.(), 0);
};

const closeProjectModal = () => {
    if (!projectModal) return;
    if (typeof projectModal.close === 'function') {
        projectModal.close();
    } else {
        projectModal.removeAttribute('open');
    }
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
        lastFocusedEl.focus();
    }
};

if (projectModal) {
    projectModal.addEventListener('click', (e) => {
        const rect = projectModal.querySelector('.project-modal__content')?.getBoundingClientRect();
        if (!rect) return;
        const inContent =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
        if (!inContent) closeProjectModal();
    });

    projectModal.addEventListener('cancel', (e) => {
        e.preventDefault();
        closeProjectModal();
    });
}

if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
}

if (projectCards.length > 0) {
    projectCards.forEach((card) => {
        card.addEventListener('click', () => openProjectModal(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProjectModal(card);
            }
        });
        card.querySelectorAll('.project-links a').forEach((link) => {
            link.addEventListener('click', (e) => e.stopPropagation());
        });
    });
}