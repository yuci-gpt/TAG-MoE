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

// Copy BibTeX with button animation
function copyBibTeX() {
    const bibtexCode = document.getElementById('bibtex-code').innerText;
    const btn = event.target;

    navigator.clipboard.writeText(bibtexCode).then(() => {
        // Store original content
        const originalHTML = btn.innerHTML;

        // Change to success state with animation
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.classList.add('copied');

        // Reset after 2 seconds
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
        }, 2000);
    });
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
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let zoomLevel = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;
let currentImageIndex = 0;
let imageElements = [];

// Gather all lightbox trigger images
function updateImageElements() {
    imageElements = Array.from(document.querySelectorAll('.lightbox-trigger'));
}

// Open lightbox
document.querySelectorAll('.lightbox-trigger').forEach((img, index) => {
    img.addEventListener('click', function () {
        updateImageElements();
        currentImageIndex = imageElements.indexOf(this);
        openLightboxAtIndex(currentImageIndex);
    });
});

function openLightboxAtIndex(index) {
    currentImageIndex = index;
    const img = imageElements[index];

    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
    lightboxTitle.textContent = img.alt;

    // Reset zoom when opening
    zoomLevel = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();

    // Update navigation buttons visibility
    lightboxPrev.style.display = currentImageIndex > 0 ? 'flex' : 'none';
    lightboxNext.style.display = currentImageIndex < imageElements.length - 1 ? 'flex' : 'none';

    setTimeout(() => {
        lightbox.classList.add('show');
    }, 10);
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('show');
    setTimeout(() => {
        lightbox.style.display = 'none';
        zoomLevel = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }, 300);
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Mouse wheel zoom
lightboxImg.addEventListener('wheel', (e) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.min(Math.max(1, zoomLevel + delta), 5); // Min 1x, Max 5x

    if (newZoom !== zoomLevel) {
        zoomLevel = newZoom;
        updateTransform();
        updateCursor();
    }
});

// Update transform with zoom and pan
function updateTransform() {
    lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;
}

// Update cursor based on zoom level
function updateCursor() {
    lightboxImg.style.cursor = zoomLevel > 1 ? 'grab' : 'zoom-in';
}

// Mouse drag to pan (when zoomed)
lightboxImg.addEventListener('mousedown', (e) => {
    if (zoomLevel > 1) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        lightboxImg.style.cursor = 'grabbing';
        e.preventDefault();
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        updateCursor();
    }
});

// Touch drag to pan (when zoomed) - for mobile devices
let touchStartX = 0;
let touchStartY = 0;

lightboxImg.addEventListener('touchstart', (e) => {
    if (zoomLevel > 1 && e.touches.length === 1) {
        isDragging = true;
        touchStartX = e.touches[0].clientX - translateX;
        touchStartY = e.touches[0].clientY - translateY;
        e.preventDefault();
    }
});

lightboxImg.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
        translateX = e.touches[0].clientX - touchStartX;
        translateY = e.touches[0].clientY - touchStartY;
        updateTransform();
        e.preventDefault();
    }
});

lightboxImg.addEventListener('touchend', () => {
    if (isDragging) {
        isDragging = false;
    }
});

// Navigation buttons
lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
        openLightboxAtIndex(currentImageIndex - 1);
    }
});

lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentImageIndex < imageElements.length - 1) {
        openLightboxAtIndex(currentImageIndex + 1);
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('show')) {
        if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
            openLightboxAtIndex(currentImageIndex - 1);
        } else if (e.key === 'ArrowRight' && currentImageIndex < imageElements.length - 1) {
            openLightboxAtIndex(currentImageIndex + 1);
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});
