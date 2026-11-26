// Nav: menu de tela cheia, links que rolam até a seção (pelo Lenis) e a cor que troca conforme o fundo embaixo dela.
export function nav({ lenis, cena }) {
  const el = document.querySelector('.nav');
  const botao = el.querySelector('.nav__menu');
  const menu = document.getElementById('menu');
  const rotulo = botao.querySelector('.sr');

  function abrir(sim) {
    botao.setAttribute('aria-expanded', String(sim));
    rotulo.textContent = sim ? 'Fechar o menu' : 'Abrir o menu';
    if (sim) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-aberto')); lenis?.stop(); menu.querySelector('a').focus({ preventScroll: true }); }
    else { menu.classList.remove('is-aberto'); lenis?.start(); setTimeout(() => { if (botao.getAttribute('aria-expanded') === 'false') menu.hidden = true; }, 700); }
    el.dataset.menu = sim ? '1' : '';
    tema();
  }
  botao.addEventListener('click', () => abrir(botao.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') { abrir(false); botao.focus(); } });

  // links internos: o de serviços para no começo do mapa (dentro da cena presa)
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const alvo = id === 'servicos' ? cena.posicaoServicos() : id ? document.getElementById(id) : 0;
    if (alvo == null) return;
    ev.preventDefault();
    if (botao.getAttribute('aria-expanded') === 'true') abrir(false);
    // no toque, a rolagem nativa (o lenis.scrollTo não anda no toque)
    const toque = matchMedia('(hover: none)').matches;
    if (lenis && !toque) lenis.scrollTo(alvo, { duration: 1.6, force: true });
    else scrollTo({ top: typeof alvo === 'number' ? alvo : alvo.getBoundingClientRect().top + scrollY, behavior: 'smooth' });
  });

  // cor: escura sobre o papel (mapa) e sobre as dúvidas; clara no resto
  const y = 36;
  const sob = (s) => { if (!s) return false; const r = s.getBoundingClientRect(); return r.top <= y && r.bottom > y; };
  const duvidas = document.querySelector('.duvidas'), trabalhos = document.querySelector('.trabalhos');
  function tema() {
    let claro = (cena.ativa && sob(cena.papel)) || sob(duvidas);
    if (sob(trabalhos)) claro = false;
    if (el.dataset.menu) claro = false;
    el.dataset.tema = claro ? 'claro' : 'azul';
  }
  lenis ? lenis.on('scroll', tema) : addEventListener('scroll', tema, { passive: true });
  addEventListener('resize', tema);
  tema();
  return { tema };
}
