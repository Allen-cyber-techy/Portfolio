const PillNav = (container, options) => {
  const {
    logo,
    logoAlt = 'Logo',
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
  const circleRefs = [];
  const tlRefs = [];
  const activeTweenRefs = [];
  let logoImgRef;
  let logoTweenRef;
  let hamburgerRef;
  let mobileMenuRef;
  let navItemsRef;
  let logoRef;

  const isExternalLink = href =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#');

  const isRouterLink = href => href && !isExternalLink(href);

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor
  };

  const navHTML = `
    <nav class="pill-nav" aria-label="Primary" style="${Object.entries(cssVars).map(([k, v]) => `${k}: ${v}`).join(';')}">
      <a class="pill-logo" href="${items?.[0]?.href || '#'}" aria-label="Home">
        <img src="${logo}" alt="${logoAlt}">
      </a>
      <div class="pill-nav-items desktop-only">
        <ul class="pill-list" role="menubar">
          ${items.map((item, i) => `
            <li role="none">
              <a role="menuitem" href="${item.href}" class="pill${activeHref === item.href ? ' is-active' : ''}" aria-label="${item.ariaLabel || item.label}">
                <span class="hover-circle" aria-hidden="true"></span>
                <span class="label-stack">
                  <span class="pill-label">${item.label}</span>
                  <span class="pill-label-hover" aria-hidden="true">${item.label}</span>
                </span>
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
  logoImgRef = logoRef.querySelector('img');
  navItemsRef = container.querySelector('.pill-nav-items');
  hamburgerRef = container.querySelector('.mobile-menu-button');
  mobileMenuRef = container.querySelector('.mobile-menu-popover');
  const pills = container.querySelectorAll('.pill');

  pills.forEach((pill, i) => {
    circleRefs[i] = pill.querySelector('.hover-circle');
  });

  const layout = () => {
    circleRefs.forEach((circle, i) => {
      if (!circle) return;
      const pill = pills[i];
      const rect = pill.getBoundingClientRect();
      const { width: w, height: h } = rect;
      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`
      });

      const label = pill.querySelector('.pill-label');
      const white = pill.querySelector('.pill-label-hover');

      if (label) gsap.set(label, { y: 0 });
      if (white) gsap.set(white, { y: h + 12, opacity: 0 });

      tlRefs[i]?.kill();
      const tl = gsap.timeline({ paused: true });

      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);
      if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
      if (white) {
        gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
        tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
      }

      tlRefs[i] = tl;
    });
  };

  layout();
  window.addEventListener('resize', layout);
  if (document.fonts?.ready) {
    document.fonts.ready.then(layout).catch(() => {});
  }

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

  const handleEnter = i => {
    const tl = tlRefs[i];
    if (!tl) return;
    activeTweenRefs[i]?.kill();
    activeTweenRefs[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' });
  };

  const handleLeave = i => {
    const tl = tlRefs[i];
    if (!tl) return;
    activeTweenRefs[i]?.kill();
    activeTweenRefs[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
  };

  const handleLogoEnter = () => {
    if (!logoImgRef) return;
    logoTweenRef?.kill();
    gsap.set(logoImgRef, { rotate: 0 });
    logoTweenRef = gsap.to(logoImgRef, { rotate: 360, duration: 0.2, ease, overwrite: 'auto' });
  };

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

  pills.forEach((pill, i) => {
    pill.addEventListener('mouseenter', () => handleEnter(i));
    pill.addEventListener('mouseleave', () => handleLeave(i));
  });

  logoRef.addEventListener('mouseenter', handleLogoEnter);
  hamburgerRef.addEventListener('click', toggleMobileMenu);
};