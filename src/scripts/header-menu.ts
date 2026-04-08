document.addEventListener('DOMContentLoaded', () => {
    const panel = document.querySelector('[data-menu="panel"]') as HTMLElement | null;
    const overlay = document.querySelector('[data-menu="overlay"]') as HTMLElement | null;
    const closeBtn = panel?.querySelector('.menu-popout-close') as HTMLElement | null;
    const triggers = document.querySelectorAll<HTMLElement>('.menu-popout.icon-menu, .ph-nav.icon-menu');

    if (!panel || !overlay || !closeBtn) return;

    const openMenu = () => {
        panel.hidden = false;
        overlay.hidden = false;
        requestAnimationFrame(() => {
            panel.classList.add('is-open');
            overlay.classList.add('is-open');
        });
    };

    const closeMenu = () => {
        panel.classList.remove('is-open');
        overlay.classList.remove('is-open');
        panel.addEventListener(
            'transitionend',
            () => {
                panel.hidden = true;
                overlay.hidden = true;
            },
            { once: true }
        );
    };

    triggers.forEach(el => el.addEventListener('click', openMenu));
    overlay.addEventListener('click', closeMenu);
    closeBtn.addEventListener('click', closeMenu);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
    });

    const items = panel.querySelectorAll<HTMLElement>('.menu-popout-item');

    items.forEach(item => {
        const toggle   = item.querySelector<HTMLElement>('.menu-popout-toggle');
        const expander = item.querySelector<HTMLElement>('.menu-popout-expander');
        const sub      = item.querySelector<HTMLElement>('.menu-popout-sub');
        const link     = item.querySelector<HTMLElement>('.menu-popout-link');

        if (!toggle || !expander || !sub || !link) return;

        sub.style.maxHeight = '0px';
        sub.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');

        const setExpanded = (expanded: boolean) => {
            toggle.setAttribute('aria-expanded', String(expanded));
            if (expanded) {
                sub.hidden = false;
                requestAnimationFrame(() => {
                    sub.style.maxHeight = sub.scrollHeight + 'px';
                });
            } else {
                sub.style.maxHeight = '0px';
                setTimeout(() => {
                    sub.hidden = true;
                }, 200);
            }
        };

        const closeSiblings = () => {
            items.forEach(sib => {
                if (sib === item) return;
                const t = sib.querySelector<HTMLElement>('.menu-popout-toggle');
                const s = sib.querySelector<HTMLElement>('.menu-popout-sub');
                if (!t || !s) return;
                t.setAttribute('aria-expanded', 'false');
                s.style.maxHeight = '0px';
                setTimeout(() => {
                    s.hidden = true;
                }, 200);
            });
        };

        link.addEventListener('click', e => e.stopPropagation());

        expander.addEventListener('click', e => {
            e.stopPropagation();
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            closeSiblings();
            setExpanded(!expanded);
        });

        toggle.addEventListener('click', e => {
            e.stopPropagation();
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            closeSiblings();
            setExpanded(!expanded);
        });
    });

    const ro = new ResizeObserver(() => {
        panel.querySelectorAll<HTMLElement>('.menu-popout-toggle[aria-expanded="true"]').forEach(t => {
            const id = t.getAttribute('aria-controls');
            const sub = id ? document.getElementById(id) as HTMLElement | null : null;
            if (sub) sub.style.maxHeight = sub.scrollHeight + 'px';
        });
    });

    ro.observe(document.documentElement);
});