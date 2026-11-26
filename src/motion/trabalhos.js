// Trabalhos: as cartas passam de lado na frente da palavra gigante, presas à rolagem, linear e contínuo.
// Nada trava por carta; o título entra por marco.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { linhas, pecas } from './split.js';
import { CELULAR } from './ease.js';

export function trabalhos() {
  const sec = document.querySelector('.trabalhos');
  const trilho = sec.querySelector('.trabalhos__trilho');
  const palavra = sec.querySelector('.trabalhos__palavra');
  const titulo = linhas(sec.querySelector('.trabalhos__titulo'));
  const botao = pecas([sec.querySelector('.trabalhos__mais')]);
  const fim = () => -(trilho.scrollWidth - innerWidth);

  if (!CELULAR) gsap.to(trilho, {
    x: fim, ease: 'none',
    scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
  });
  // a palavra anda devagar no sentido contrário (profundidade)
  gsap.fromTo(palavra, { xPercent: 5 }, {
    xPercent: -5, ease: 'none',
    scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true },
  });
  ScrollTrigger.create({
    trigger: sec, start: 'top 55%', end: 'bottom 20%',
    onToggle: (s) => { if (s.isActive) { titulo.entrar(0); botao.entrar(0.2); } else { titulo.sair(); botao.sair(); } },
  });
}
