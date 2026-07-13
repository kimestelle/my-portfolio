import BubblePrototype from './components/BubblePrototype';

export default function ExperimentsPage() {
  // Keep GlassLab and its bubble implementation available in /components,
  // but leave it unmounted while the playground is built out incrementally.
  return (
    <main
      className="playground-gradient relative z-[1] min-h-[100svh] w-full overflow-hidden bg-white"
      style={{
        backgroundImage: [
          'radial-gradient(circle 900px at 32% 24%, rgba(122,87,153,.32), rgba(122,87,153,.13) 42%, transparent 68%)',
          'radial-gradient(circle 760px at 70% 44%, rgba(240,133,71,.28), rgba(240,133,71,.12) 42%, transparent 68%)',
          'radial-gradient(circle 680px at 44% 78%, rgba(92,179,163,.26), rgba(92,179,163,.11) 42%, transparent 68%)',
        ].join(', '),
      }}
      aria-label="Playground"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/textures/sandpaper.png')",
          backgroundPosition: '0 0',
          backgroundRepeat: 'repeat',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />
      <BubblePrototype />
    </main>
  );
}
