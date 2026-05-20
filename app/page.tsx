import { Roulette } from "./components/Roulette";

export default function Home() {
  return (
    <main className="bg-poe-stage relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-6 md:py-10">
      <header className="absolute left-4 top-4 md:left-8 md:top-8">
        <div className="font-serif-display leading-none">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-300/80">
            Path of
          </p>
          <p className="-mt-1 text-3xl font-extrabold uppercase tracking-wider text-amber-200 md:text-4xl">
            Exile
          </p>
          <p className="-mt-1 text-4xl font-extrabold uppercase tracking-wider text-red-500 md:text-5xl">
            2
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-amber-300/60">
            Build Roulette
          </p>
        </div>
      </header>

      <div className="flex w-full max-w-5xl flex-col items-center gap-6">
        <Roulette />
      </div>

      <footer className="mt-8 w-full text-center">
        <span className="font-serif-display text-sm md:text-base italic tracking-wide text-stone-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          Feito especialmente para o meu grande amigo,{" "}
          <span className="font-bold not-italic tracking-wider text-amber-300">
            Rafael Hikkikomori Sigma
          </span>
          , por{" "}
          <span className="font-bold not-italic tracking-wider text-purple-300">
            Lisan Al Gaib
          </span>
        </span>
      </footer>
    </main>
  );
}
