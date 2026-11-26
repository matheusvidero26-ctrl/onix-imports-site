// O guia: o freio da rolagem. A página sempre rola presa ao gesto e nunca para sozinha, mas tem um teto de
// velocidade para a roda e o toque (teclado, barra de rolagem e links seguem livres): o alvo da rolagem nunca fica
// mais que AVANCO telas à frente de onde a página está. Por mais forte que seja o gesto, o filme anda no máximo
// ~0,9 tela por segundo e cada passagem tem tempo de tocar.
// No toque, o dedo arrastando segue o dedo (sem teto); só a inércia depois de soltar tem teto.

const AVANCO = 0.17; // telas de folga entre o alvo e a página (com o lerp 0,1 do Lenis: ~0,9 tela/s no máximo)
const INERCIA_MAX = 1.1; // telas que a inércia de um toque pode andar

export function criarGuia({ lenis }) {
  if (!lenis) return null;

  // ---- roda (mouse e trackpad): o alvo anda junto, mas nunca abre mais que AVANCO de distância da página
  function roda(data) {
    const { deltaY, event } = data;
    if (event.ctrlKey || !deltaY) return true;
    const alvo = lenis.targetScroll;
    const dir = Math.sign(deltaY);
    const lim = lenis.animatedScroll + dir * AVANCO * innerHeight;
    const novo = dir > 0 ? Math.max(alvo, Math.min(alvo + deltaY, lim)) : Math.min(alvo, Math.max(alvo + deltaY, lim));
    data.deltaY = novo - alvo;
    if (Math.abs(data.deltaY) < 0.5) { if (event.cancelable) event.preventDefault(); return false; }
    return true;
  }

  // ---- toque (o Lenis com syncTouch): o dedo arrasta a página; a inércia ao soltar é feita aqui, com teto
  function toque(data) {
    const { deltaY, event } = data;
    if (event.type !== 'touchend') return true;
    if (event.cancelable) event.preventDefault();
    const v = Math.abs(lenis.velocity);
    if (!deltaY || v < 0.5) return false;
    const d = Math.sign(deltaY) * Math.min(v ** (lenis.options.touchInertiaExponent || 1.7), INERCIA_MAX * innerHeight);
    lenis.scrollTo(lenis.targetScroll + d, { lerp: lenis.options.syncTouchLerp, programmatic: false });
    return false;
  }

  lenis.options.virtualScroll = (data) => (data.event.type.includes('touch') ? toque(data) : roda(data));
  return {};
}
