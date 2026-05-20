# Roleta de Builds — Path of Exile 2

Aplicativo Next.js de página única que sorteia uma combinação aleatória de **classe + arma** para a sua próxima run de Path of Exile 2. Inspirado no estilo de uma roleta com dois anéis independentes (8 classes no anel interno, 11 armas no anel externo) que giram com easing realista.

**Demo:** [https://poe2-roulette-kcsvt8oe2-icaros-projects-b7e98c21.vercel.app/](https://poe2-roulette-kcsvt8oe2-icaros-projects-b7e98c21.vercel.app/)

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Framer Motion** para a animação de giro
- **Cinzel** (display) + **Inter** (corpo) via `next/font/google`

## Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Estrutura

- `app/page.tsx` — composição da página (cabeçalho + roleta + rodapé).
- `app/components/Roulette.tsx` — orquestrador do estado de giro.
- `app/components/WheelRing.tsx` — anel SVG genérico (recebe `items[]` e desenha as fatias).
- `app/components/Pointer.tsx` — ponteiro dourado no topo (12h).
- `app/components/ResultPanel.tsx` — rodapé com a combinação sorteada.
- `app/data/poe2.ts` — dados das 8 classes e 11 armas.
- `app/lib/spin.ts` — matemática para calcular o ângulo final do giro.

## Trocar os ícones por arte real

Os anéis usam glifos unicode como placeholders. Para usar a arte oficial:

1. Coloque arquivos em `public/poe2/classes/<id>.webp` e `public/poe2/weapons/<id>.webp`.
2. Em `app/data/poe2.ts`, troque o campo `glyph` por um caminho de imagem ou adicione um campo `iconSrc`.
3. Em `app/components/WheelRing.tsx`, substitua o `<text>` do glifo por um `<image href={...}>` SVG.

## Trocar a imagem de background

A arte de fundo fica em `public/poe2-bg.jpg` e é aplicada no `<body>` via `app/globals.css` (com `background-attachment: fixed` e overlay escuro por cima). Para usar outra imagem, basta substituir o arquivo mantendo o nome, ou apontar a URL em `globals.css`.
