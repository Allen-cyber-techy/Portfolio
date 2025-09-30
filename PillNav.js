const PillNav = (container, options = {}) => {
  const { items, activeHref, baseColor } = options;
  const nav = document.createElement('nav');
  nav.className = 'pill-nav';

  const list = document.createElement('ul');
  list.className = 'pill-nav-list';

  const highlight = document.createElement('div');
  highlight.className = 'pill-nav-highlight';
  list.appendChild(highlight);

  let activeItem;

  items.forEach(itemData => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = itemData.href;
    link.textContent = itemData.label;
    item.appendChild(link);
    list.appendChild(item);

    if (itemData.href === activeHref) {
      activeItem = item;
    }

    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector(itemData.href).scrollIntoView({ behavior: 'smooth' });
      setActive(item);
    });
  });

  nav.appendChild(list);
  container.appendChild(nav);

  const setActive = (item) => {
    if (activeItem) {
      activeItem.classList.remove('active');
    }
    activeItem = item;
    activeItem.classList.add('active');
    positionHighlight(item);
  };

  const positionHighlight = (item) => {
    if (!item) return;
    highlight.style.width = `${item.offsetWidth}px`;
    highlight.style.left = `${item.offsetLeft}px`;
  };

  const setHighlightColor = () => {
    if (baseColor) {
      highlight.style.setProperty('--highlight-bg-color', baseColor);
    }
  };

  // Set initial state
  setActive(activeItem);
  setHighlightColor();

  window.addEventListener('resize', () => positionHighlight(activeItem));
  // Scrollspy to update active item
  const sections = items.map(item => document.querySelector(item.href));

  const scrollSpy = () => {
    let currentSection = null;
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section;
      }
    });

    if (currentSection) {
      const newActiveItem = Array.from(list.children).find(li => {
        const a = li.querySelector('a');
        return a && a.getAttribute('href') === `#${currentSection.id}`;
      });
      if (newActiveItem && newActiveItem !== activeItem) {
        setActive(newActiveItem);
      }
    }
  };

  window.addEventListener('scroll', scrollSpy);
};