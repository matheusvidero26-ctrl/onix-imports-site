// Avaliações: polaroides soltas que dá para pegar, arrastar e jogar. Cada uma tem posição
// e velocidade; arrastando, ela inclina para o lado em que anda e, solta, segue no embalo com atrito e bate nas bordas
// do mural. No toque, só um arrasto mais de lado que de cima pega a foto; o resto rola a página.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REDUZIDO } from './ease.js';

export function parede() {
  const mural = document.querySelector('.parede__mural');
  const fotos = [...mural.querySelectorAll('.polaroide')];
  let z = 10, rodando = false;

  const corpos = fotos.map((el) => {
    const base = parseFloat(getComputedStyle(el).getPropertyValue('--r')) || 0;
    return { el, x: 0, y: 0, vx: 0, vy: 0, giro: 0, vg: 0, base, pego: false, gx: 0, gy: 0, t: 0, px: 0, py: 0 };
  });

  // entram uma a uma, caindo no lugar, quando o mural aparece
  if (!REDUZIDO) {
    gsap.set(fotos, { y: -60, opacity: 0 });
    ScrollTrigger.create({
      trigger: mural, start: 'top 75%', once: true,
      onEnter: () => gsap.to(fotos, { y: 0, opacity: 1, duration: 0.9, ease: 'ob-out', stagger: 0.08, clearProps: 'transform,opacity' }),
    });
  }

  function aplicar(c) { c.el.style.translate = `${c.x}px ${c.y}px`; c.el.style.rotate = `${c.base + c.giro}deg`; }

  function passo() {
    let vivo = false;
    const m = mural.getBoundingClientRect();
    for (const c of corpos) {
      if (!c.pego) {
        c.vx *= 0.92; c.vy *= 0.92;
        c.x += c.vx; c.y += c.vy;
        // bordas do mural: volta com metade da velocidade
        const r = c.el.getBoundingClientRect();
        if (r.left < m.left - 20 && c.vx < 0) { c.vx *= -0.5; c.x += 2; }
        if (r.right > m.right + 20 && c.vx > 0) { c.vx *= -0.5; c.x -= 2; }
        if (r.top < m.top - 40 && c.vy < 0) { c.vy *= -0.5; c.y += 2; }
        if (r.bottom > m.bottom + 60 && c.vy > 0) { c.vy *= -0.5; c.y -= 2; }
      }
      // a inclinação segue a velocidade de lado, numa mola que passa do ponto e volta
      const alvo = Math.max(-16, Math.min(16, c.vx * 0.9));
      c.vg += (alvo - c.giro) * 0.12; c.vg *= 0.78; c.giro += c.vg;
      aplicar(c);
      if (c.pego || Math.abs(c.vx) + Math.abs(c.vy) > 0.05 || Math.abs(c.vg) > 0.01 || Math.abs(c.giro - alvo) > 0.05) vivo = true;
    }
    if (vivo) requestAnimationFrame(passo); else rodando = false;
  }
  const acordar = () => { if (!rodando) { rodando = true; requestAnimationFrame(passo); } };

  for (const c of corpos) {
    let inicio = null, decidido = false;
    c.el.addEventListener('pointerdown', (ev) => {
      if (ev.button !== 0) return;
      inicio = { x: ev.clientX, y: ev.clientY, id: ev.pointerId, toque: ev.pointerType !== 'mouse' };
      decidido = !inicio.toque; // no mouse pega na hora; no toque espera ver para que lado o dedo vai
      if (decidido) pegar(ev);
    });
    c.el.addEventListener('pointermove', (ev) => {
      if (!inicio || ev.pointerId !== inicio.id) return;
      if (!decidido) {
        const dx = Math.abs(ev.clientX - inicio.x), dy = Math.abs(ev.clientY - inicio.y);
        if (dx + dy < 8) return;
        decidido = true;
        if (dx > dy) pegar(ev); else { inicio = null; return; }
      }
      if (!c.pego) return;
      const agora = performance.now(), dt = Math.max(8, agora - c.t);
      const nx = ev.clientX - c.gx, ny = ev.clientY - c.gy;
      c.vx = ((nx - c.x) / dt) * 16; c.vy = ((ny - c.y) / dt) * 16;
      c.x = nx; c.y = ny; c.t = agora;
    });
    const soltar = (ev) => {
      if (!inicio || ev.pointerId !== inicio.id) return;
      inicio = null;
      if (!c.pego) return;
      c.pego = false;
      c.el.classList.remove('is-pegando');
      if (performance.now() - c.t > 80) { c.vx *= 0.2; c.vy *= 0.2; } // parou antes de soltar: não arremessa
      acordar();
    };
    c.el.addEventListener('pointerup', soltar);
    c.el.addEventListener('pointercancel', soltar);

    function pegar(ev) {
      c.el.setPointerCapture(ev.pointerId);
      c.pego = true;
      c.gx = ev.clientX - c.x; c.gy = ev.clientY - c.y; c.t = performance.now();
      c.vx = c.vy = 0;
      c.el.style.zIndex = ++z;
      c.el.classList.add('is-pegando');
      acordar();
    }
  }
}
