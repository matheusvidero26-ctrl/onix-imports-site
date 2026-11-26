import '@fontsource-variable/archivo/standard.css';
import './styles/tokens.css';
import './styles/base.css';
import './sections/nav.css';
import './sections/botao.css';
import './sections/cena.css';
import './sections/secoes.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CELULAR, REDUZIDO } from './motion/ease.js';
import { criarScroll } from './motion/smooth.js';
import { criarGuia } from './motion/guia.js';
import { scrollbar } from './motion/scrollbar.js';
import { criarPalco } from './gl/palco.js';
import { cena } from './motion/cena.js';
import { abertura } from './motion/abertura.js';
import { trabalhos } from './motion/trabalhos.js';
import { parede } from './motion/parede.js';
import { duvidas } from './motion/duvidas.js';
import { fecho } from './motion/fecho.js';
import { nav } from './motion/nav.js';
import { fotos } from './motion/fotos.js';

document.documentElement.classList.add('js');
history.scrollRestoration = 'manual';

async function iniciar() {
  const lenis = criarScroll();
  criarGuia({ lenis });
  scrollbar({ lenis });
  fotos();
  duvidas();

  const [palco] = await Promise.all([criarPalco(document.querySelector('.palco'), { celular: CELULAR }), document.fonts.ready]);
  gsap.ticker.add((_, dt) => palco.quadro(Math.min(dt, 50) / 1000));

  const c = cena(palco);
  nav({ lenis, cena: c });
  abertura(palco, c);
  trabalhos();
  parede();
  fecho(palco);

  // o palco só desenha quando a cena presa ou o fecho estão na tela; em cada um, o carro mora numa caixa diferente
  const e = palco.estado;
  const secCena = document.querySelector('.cena'), secFecho = document.querySelector('.fecho');
  const vagas = { hero: document.querySelector('.hero__vaga'), mapa: document.querySelector('.mapa__vaga'), fecho: document.querySelector('.fecho__vaga') };
  const naTela = (s) => { const r = s.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
  let ondeAnt = '';
  function onde() {
    const nc = naTela(secCena), nf = naTela(secFecho);
    const agora = nc ? 'cena' : nf ? 'fecho' : '';
    e.ativo = !!agora;
    if (agora === ondeAnt) return;
    ondeAnt = agora;
    if (agora === 'cena') { e.vagaA = vagas.hero; e.vagaB = vagas.mapa; ScrollTrigger.update(); }
    if (agora === 'fecho') { e.vagaA = vagas.fecho; e.vagaB = null; e.mistura = 0; e.desenho = 0; e.zona = null; }
  }
  gsap.ticker.add(onde, false, true);
  onde();

  // o brilho da pintura segue o cursor no hero (só mouse)
  if (!REDUZIDO && matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', (ev) => palco.apontar((ev.clientX / innerWidth) * 2 - 1, (ev.clientY / innerHeight) * 2 - 1), { passive: true });
  }

  ScrollTrigger.refresh();
}
iniciar();
