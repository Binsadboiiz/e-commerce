const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Signature moment: a blue dot (the logo dot) leaves `fromEl`, arcs to the header
 * cart icon, then the icon nudges once. Purely visual, never throws, never blocks.
 * Does nothing when the user prefers reduced motion or the cart target is missing.
 */
export function flyDot(fromEl) {
  try {
    const target = document.querySelector('[data-cart-target]');
    if (!fromEl || !target || !target.animate) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const a = fromEl.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const size = 14;
    const x0 = a.left + a.width / 2 - size / 2;
    const y0 = a.top + a.height / 2 - size / 2;
    const dx = b.left + b.width / 2 - size / 2 - x0;
    const dy = b.top + b.height / 2 - size / 2 - y0;

    const dot = document.createElement('span');
    dot.setAttribute('aria-hidden', 'true');
    Object.assign(dot.style, {
      position: 'fixed', left: `${x0}px`, top: `${y0}px`,
      width: `${size}px`, height: `${size}px`, borderRadius: '50%',
      background: 'var(--color-primary, #2563eb)', boxShadow: '0 0 0 3px rgba(37,99,235,.25)',
      pointerEvents: 'none', zIndex: 9999,
    });
    document.body.appendChild(dot);

    // arc: rise above the straight line at the midpoint
    const lift = Math.min(120, Math.abs(dy) * 0.4 + 40);
    const anim = dot.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - lift}px) scale(1.15)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.6)`, opacity: 0.9 },
      ],
      { duration: 600, easing: EASE }
    );
    anim.onfinish = anim.oncancel = () => {
      dot.remove();
      target.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }],
        { duration: 250, easing: EASE }
      );
    };
  } catch {
    /* decoration only */
  }
}
