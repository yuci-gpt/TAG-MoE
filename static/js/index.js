// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const doc = document.documentElement;
const icon = themeToggle.querySelector('i');
const navbarLogo = document.getElementById('navbar-logo');
const favicon = document.getElementById('favicon');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    doc.setAttribute('data-theme', savedTheme);
    updateThemeAssets(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    doc.setAttribute('data-theme', 'dark');
    updateThemeAssets('dark');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = doc.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    doc.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeAssets(newTheme);
});

function updateThemeAssets(theme) {
    // Update Icon
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        // Dark Mode -> Light Logo
        navbarLogo.src = 'static/images/logo_light.png';
        favicon.href = 'static/images/logo_light.ico';
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        // Light Mode -> Dark Logo
        navbarLogo.src = 'static/images/logo_dark.png';
        favicon.href = 'static/images/logo_dark.ico';
    }
}

// Cursor Glow Effect
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Copy BibTeX
function copyBibTeX() {
    const bibtexCode = document.getElementById('bibtex-code').innerText;
    navigator.clipboard.writeText(bibtexCode).then(() => {
        showToast();
    });
}

function showToast() {
    const toast = document.getElementById("toast");
    toast.className = "toast show";
    setTimeout(function () { toast.className = toast.className.replace("show", ""); }, 3000);
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Back to Top Button
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');

function openLightbox(src) {
    lightbox.style.display = "flex";
    // Force reflow to enable transition
    void lightbox.offsetWidth;
    lightbox.classList.add('show');
    lightboxImg.src = src;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    lightbox.classList.remove('show');
    setTimeout(() => {
        lightbox.style.display = "none";
        document.body.style.overflow = 'auto'; // Restore scrolling
    }, 300); // Match transition duration
}

document.querySelectorAll('.lightbox-trigger').forEach(img => {
    img.addEventListener('click', () => {
        openLightbox(img.src);
    });
});

closeBtn.addEventListener('click', () => {
    closeLightbox();
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});
