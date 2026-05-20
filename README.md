# Roleta de Builds — Path of Exile 2

Aplicativo Next.js de página única que sorteia uma combinação aleatória de **classe + arma** para a sua próxima run de Path of Exile 2. Inspirado no estilo de uma roleta com dois anéis independentes (8 classes no anel interno, 11 armas no anel externo) que giram com easing realista.

**Demo:** [https://poe2-roulette.vercel.app/](https://poe2-roulette.vercel.app/)

<img width="1423" height="1231" alt="image" src="https://github.com/user-attachments/assets/fce33bfa-7671-4e88-a3a3-e4875cde5350" />

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
