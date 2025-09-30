document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate(
            {
                left: `${posX}px`,
                top: `${posY}px`
            },
            { duration: 500, fill: 'forwards' }
        );
    });

    // Add hover effect on links and buttons
    const interactiveElements = document.querySelectorAll('a, button, [data-tilt]');

    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hover');
        });
    });
});