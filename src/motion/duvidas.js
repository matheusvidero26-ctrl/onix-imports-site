// Dúvidas: caixas que abrem animadas; a aberta vira bloco azul (CSS). Uma aberta por vez.
import { REDUZIDO } from './ease.js';

export function duvidas() {
  const itens = [...document.querySelectorAll('.duvida')];
  for (const d of itens) {
    const resumo = d.querySelector('summary');
    const corpo = d.querySelector('.duvida__resposta');
    resumo.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (d.dataset.anim) return;
      const abrir = !d.open;
      if (abrir) itens.filter((o) => o !== d && o.open).forEach((o) => fechar(o));
      abrir ? abrirItem(d, corpo) : fechar(d);
    });
  }
  function abrirItem(d, corpo) {
    d.open = true;
    if (REDUZIDO) return;
    const h = corpo.offsetHeight;
    d.dataset.anim = '1';
    corpo.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' })
      .onfinish = () => { delete d.dataset.anim; };
  }
  function fechar(d) {
    const corpo = d.querySelector('.duvida__resposta');
    if (REDUZIDO) { d.open = false; return; }
    d.dataset.anim = '1';
    const a = corpo.animate([{ height: `${corpo.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing: 'cubic-bezier(0.7, 0, 0.84, 0)' });
    a.onfinish = () => { d.open = false; delete d.dataset.anim; };
  }
}
