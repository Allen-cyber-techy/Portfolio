const PillNav = (container, options) => {
  const {
    items,
    activeHref,
    ease = 'power3.easeOut',
    baseColor = '#fff',
    pillColor = '#060010',
    hoveredPillTextColor = '#060010',
    pillTextColor,
    initialLoadAnimation = true
  } = options;

  const resolvedPillTextColor = pillTextColor ?? baseColor;
  let isMobileMenuOpen = false;
  let hamburgerRef;
  let mobileMenuRef;
  let navItemsRef;
  let logoRef;

  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': resolvedPillTextColor
  };

  const navHTML = `
    <nav class="pill-nav" aria-label="Primary" style="${Object.entries(cssVars).map(([k, v]) => `${k}: ${v}`).join(';')}">
      <a class="pill-logo" href="${items?.[0]?.href || '#'}" aria-label="Home">
        Allen Sunil
      </a>
      <div class="pill-nav-items desktop-only">
        <ul class="pill-list" role="menubar">
          ${items.map((item, i) => `
            <li role="none">
              <a role="menuitem" href="${item.href}" class="pill${activeHref === item.href ? ' is-active' : ''}" aria-label="${item.ariaLabel || item.label}">
                ${item.label}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
      <button class="mobile-menu-button mobile-only" aria-label="Toggle menu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </nav>
    <div class="mobile-menu-popover mobile-only" style="${Object.entries(cssVars).map(([k, v]) => `${k}: ${v}`).join(';')}">
      <ul class="mobile-menu-list">
        ${items.map(item => `
          <li>
            <a href="${item.href}" class="mobile-menu-link${activeHref === item.href ? ' is-active' : ''}">${item.label}</a>
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  container.innerHTML = navHTML;

  logoRef = container.querySelector('.pill-logo');
  navItemsRef = container.querySelector('.pill-nav-items');
  hamburgerRef = container.querySelector('.mobile-menu-button');
  mobileMenuRef = container.querySelector('.mobile-menu-popover');

  if (mobileMenuRef) {
    gsap.set(mobileMenuRef, { visibility: 'hidden', opacity: 0, scaleY: 1 });
  }

  if (initialLoadAnimation) {
    if (logoRef) {
      gsap.set(logoRef, { scale: 0 });
      gsap.to(logoRef, { scale: 1, duration: 0.6, ease });
    }
    if (navItemsRef) {
      gsap.set(navItemsRef, { width: 0, overflow: 'hidden' });
      gsap.to(navItemsRef, { width: 'auto', duration: 0.6, ease });
    }
  }

  const toggleMobileMenu = () => {
    isMobileMenuOpen = !isMobileMenuOpen;
    const lines = hamburgerRef.querySelectorAll('.hamburger-line');
    if (isMobileMenuOpen) {
      gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
      gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      gsap.set(mobileMenuRef, { visibility: 'visible' });
      gsap.fromTo(mobileMenuRef, { opacity: 0, y: 10, scaleY: 1 }, { opacity: 1, y: 0, scaleY: 1, duration: 0.3, ease, transformOrigin: 'top center' });
    } else {
      gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
      gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      gsap.to(mobileMenuRef, { opacity: 0, y: 10, scaleY: 1, duration: 0.2, ease, transformOrigin: 'top center', onComplete: () => gsap.set(mobileMenuRef, { visibility: 'hidden' }) });
    }
  };

  hamburgerRef.addEventListener('click', toggleMobileMenu);
};
