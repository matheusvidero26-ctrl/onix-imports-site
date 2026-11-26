// Baixa as fotos de banco da demo e gera os WebP que o site usa, em public/img/.
//
// Uso, da raiz do projeto (depois do npm ci):
//   npm run fotos                  todas as vagas que ainda não têm WebP em public/img/
//   npm run fotos -- --refaz       todas, gerando de novo
//   npm run fotos -- parede/03     só uma vaga (sempre gera de novo)
//
// As fotos não vêm no pacote: são do Unsplash e do Pexels (licença livre, uso comercial permitido, sem atribuição
// obrigatória) e cada uma é baixada do site de origem. Os originais ficam em fonte/fotos/<vaga>.jpg.
//
// Foto sua numa vaga: salve como fonte/fotos/<vaga>.jpg (ex.: fonte/fotos/trabalhos/02.jpg) e rode com a vaga.
// O arquivo que já está lá tem prioridade sobre o download. Se o carro ficar cortado, ajuste o `foco` da vaga:
// 0 encosta o recorte na esquerda (ou no topo), 1 na direita (ou no pé), 0,5 centraliza. `zoom` acima de 1 fecha
// o recorte em volta do foco.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const raiz = process.cwd();
const TRABALHO = [720, 900]; // cartas do trilho "Entregues", 4:5
const PAREDE = [640, 480]; // polaroides das avaliações, 4:3

const FOTOS = [
  { vaga: 'parede/01', tamanho: PAREDE, foco: [0.5, 0.5], cdn: 'https://images.unsplash.com/photo-1511407401960-0ee203836665', pagina: 'https://unsplash.com/photos/teal-volkswagen-beetle-parked-near-brown-house-xBRQfR2bqNI' },
  { vaga: 'parede/02', tamanho: PAREDE, foco: [1, 0.5], cdn: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a', pagina: 'https://unsplash.com/photos/white-sedan-on-gray-asphalt-road-during-daytime-73XAgT8DOpo' },
  { vaga: 'parede/03', tamanho: PAREDE, foco: [0.5, 0.65], cdn: 'https://images.unsplash.com/photo-1591738802175-709fedef8288', pagina: 'https://unsplash.com/photos/red-jeep-wrangler-on-road-during-daytime-sBPnD3jzQ7g' },
  { vaga: 'parede/04', tamanho: PAREDE, foco: [0.5, 0.64], cdn: 'https://images.unsplash.com/photo-1770446722312-0fcf39b62900', pagina: 'https://unsplash.com/photos/dark-blue-sports-car-parked-in-front-of-garage-7n6UjbmX7r8' },
  { vaga: 'parede/05', tamanho: PAREDE, foco: [0.5, 0.5], cdn: 'https://images.unsplash.com/photo-1769113528131-d2a8aeddcb90', pagina: 'https://unsplash.com/photos/a-small-red-car-parked-on-a-city-street-_wYhqW1TXSw' },
  { vaga: 'parede/06', tamanho: PAREDE, foco: [0.5, 0.5], cdn: 'https://images.unsplash.com/photo-1605270396307-d00ba5cda1d0', pagina: 'https://unsplash.com/photos/blue-bmw-m-3-on-road-during-daytime-DpGNVXCH5_8' },
];

// até 2000 px no lado maior, em JPEG: é com esse tamanho que os recortes acima foram acertados
const grande = (cdn) => cdn.includes('unsplash')
  ? `${cdn}?fm=jpg&q=86&w=2000&h=2000&fit=max`
  : `${cdn}?auto=compress&cs=tinysrgb&w=2000&h=2000&fit=max`;

async function original(f) {
  const arq = path.join(raiz, 'fonte', 'fotos', `${f.vaga}.jpg`);
  if (fs.existsSync(arq)) return arq;
  const r = await fetch(grande(f.cdn), { headers: { Accept: 'image/jpeg', 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok || !(r.headers.get('content-type') || '').startsWith('image/')) {
    throw new Error(`não baixou (${r.status}). Baixe pela página, salve como fonte/fotos/${f.vaga}.jpg e rode de novo: ${f.pagina}`);
  }
  fs.mkdirSync(path.dirname(arq), { recursive: true });
  fs.writeFileSync(arq, Buffer.from(await r.arrayBuffer()));
  return arq;
}

async function gera(f) {
  const { data, info } = await sharp(await original(f)).rotate().toBuffer({ resolveWithObject: true });
  const [w, h] = f.tamanho;
  const proporcao = w / h;
  const zoom = f.zoom ?? 1;
  const cw = Math.round(Math.min(info.width, info.height * proporcao) / zoom);
  const ch = Math.min(info.height, Math.round(cw / proporcao));
  const left = Math.round((info.width - cw) * f.foco[0]);
  const top = Math.round((info.height - ch) * f.foco[1]);
  const saida = path.join(raiz, 'public', 'img', `${f.vaga}.webp`);
  fs.mkdirSync(path.dirname(saida), { recursive: true });
  await sharp(data)
    .extract({ left, top, width: cw, height: ch })
    .resize(w, h, { kernel: 'lanczos3' })
    .webp({ quality: f.qualidade ?? 78, effort: 6 })
    .toFile(saida);
  return `${f.vaga}: ${info.width}×${info.height} → ${w}×${h} (${Math.round(fs.statSync(saida).size / 1024)} KB)`;
}

const args = process.argv.slice(2);
const refaz = args.includes('--refaz');
const pedidas = args.filter((a) => !a.startsWith('--'));
const desconhecidas = pedidas.filter((v) => !FOTOS.some((f) => f.vaga === v));
if (desconhecidas.length) throw new Error(`vaga desconhecida: ${desconhecidas.join(', ')} (vagas: ${FOTOS.map((f) => f.vaga).join(', ')})`);

const fila = FOTOS.filter((f) => (pedidas.length
  ? pedidas.includes(f.vaga)
  : refaz || !fs.existsSync(path.join(raiz, 'public', 'img', `${f.vaga}.webp`))));
if (!fila.length) console.log('Todas as fotos já estão em public/img/ (use --refaz para gerar de novo).');
let falhas = 0;
for (const f of fila) {
  try { console.log(await gera(f)); } catch (e) { falhas++; console.error(`${f.vaga}: ${e.message}`); }
}
if (falhas) process.exit(1);
