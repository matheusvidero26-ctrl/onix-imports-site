# Site da Oficina Onix Import

Landing page feita sobre o template ORBO (carro 3D visto de cima, Vite + Three.js + GSAP), com a identidade da Onix Import.

## Rodar

```bash
npm ci            # instala as versões travadas
npm run fotos     # baixa as fotos ilustrativas (trabalhos e oficina) para public/img/
npm run dev       # abre em http://localhost:5232
npm run build     # gera a pasta dist/ para subir na hospedagem
```

No celular, na mesma rede Wi-Fi: `npm run dev -- --host`.

## O que já é da Onix

- Nome ONIX na abertura, no hero e no rodapé. A nav mostra ONIX IMPORT e o favicon é o símbolo octogonal.
- Cores da identidade:
  - Laranja Laca `#ff5a1f` nos blocos.
  - Preto Ônix `#0b0b0c`.
  - Gelo `#f4f4f2` no papel.
  - Verde Ácido `#b6e33b` na faixa da abertura e no hover do rodapé.
  - O carro 3D e o desenho técnico acendem em laranja.
  - Sobre o laranja, o texto pequeno fica preto, para ter contraste.
- Quatro serviços no mapa, cada um com um marco a cada 15% da cena:
  - Pintura completa
  - Retoques e reparos
  - Polimento e acabamento
  - Cores especiais
- Contatos:
  - WhatsApp (11) 94392-5608
  - @oniximportoficial
  - contato@oniximport.com.br
  - Av. Mandaqui, 35/39 · Bairro do Limão · CEP 02550-000
- A avaliação real: "Entrega no prazo combinado e preço justo no serviço que solicitei."

## Falta a oficina mandar

1. **Fotos reais dos carros pintados** para as 6 cartas. Hoje são fotos de banco, marcadas "Foto ilustrativa". Salve cada uma como `fonte/fotos/trabalhos/0N.jpg` e rode `npm run fotos -- trabalhos/0N`.
2. **Foto da oficina** para a seção "A oficina". Salve como `fonte/fotos/estudio/01.jpg`.
3. **Horários de funcionamento**: estão como `[preencher]` no rodapé.
4. **Formas de pagamento**: estão como `[preencher]` na última dúvida.
5. **Mais avaliações reais**, com nome e carro. Hoje tem uma polaroide só, com o símbolo no lugar da foto.
6. **Confirmar os textos dos serviços e das dúvidas.** Foram escritos pelo que uma oficina de pintura costuma fazer.
7. **Preços**: os serviços mostram "sob orçamento". Se quiserem mostrar valores "a partir de", troque no `index.html`.

O crédito do modelo 3D (Aston Martin DB11, CC-BY 4.0) fica no rodapé porque a licença exige.

O `CLAUDE.md` é o guia técnico do template, com a arquitetura, as regras de celular e como personalizar.
