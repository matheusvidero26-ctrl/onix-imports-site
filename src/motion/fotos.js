// Fotos: cada [data-foto="pasta/nome"] recebe /img/pasta/nome.webp como fundo, carregado só perto da tela.
// FOTOS lista as que já existem; as outras ficam no cinza do lugar (secoes.css).
const FOTOS = new Set([
  ...[1, 2, 3, 4, 5, 6].map((n) => `trabalhos/0${n}`),
  'estudio/01',
]);

export function fotos() {
  const els = [...document.querySelectorAll('[data-foto]')].filter((el) => FOTOS.has(el.dataset.foto));
  const carregar = (el) => { el.style.backgroundImage = `url(/img/${el.dataset.foto}.webp)`; };
  if (!('IntersectionObserver' in window)) { els.forEach(carregar); return; }
  const io = new IntersectionObserver((entradas) => {
    for (const en of entradas) if (en.isIntersecting) { carregar(en.target); io.unobserve(en.target); }
  }, { rootMargin: '120% 0px' });
  els.forEach((el) => io.observe(el));
}
