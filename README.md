# Roleta de Builds — Path of Exile 2

Aplicativo Next.js de página única que sorteia uma combinação aleatória de **classe + arma** para a sua próxima run de Path of Exile 2. Inspirado no estilo de uma roleta com dois anéis independentes (8 classes no anel interno, 11 armas no anel externo) que giram com easing realista.

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

## Deploy no Vercel

A maneira mais simples:

1. Faça o push deste repositório para o GitHub (`gh repo create` ou pelo site).
2. Importe em [vercel.com/new](https://vercel.com/new) — o Vercel detecta Next.js automaticamente e nenhum ajuste é necessário.

Alternativa via CLI:

```bash
npm i -g vercel
vercel        # primeira vez (faz login + cria o projeto)
vercel --prod # promove para produção
```

## Trocar os ícones por arte real

Os anéis usam glifos unicode como placeholders. Para usar a arte oficial:

1. Coloque arquivos em `public/poe2/classes/<id>.webp` e `public/poe2/weapons/<id>.webp`.
2. Em `app/data/poe2.ts`, troque o campo `glyph` por um caminho de imagem ou adicione um campo `iconSrc`.
3. Em `app/components/WheelRing.tsx`, substitua o `<text>` do glifo por um `<image href={...}>` SVG.
