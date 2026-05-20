document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.nav-card, .role-card, .module-card, .section-link-card, .content-card, .gallery-item');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${i * 0.07}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
});
