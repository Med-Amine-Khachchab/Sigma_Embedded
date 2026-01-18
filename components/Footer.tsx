export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-steel/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Sigma Embedded</h3>
          <p className="mt-3 text-sm text-slate-300">
            Plateforme de contenu et d'expertise dédiée au firmware, aux RTOS et aux
            architectures embarquées.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Navigation</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>Blog</li>
            <li>Media</li>
            <li>Equipe</li>
            <li>Newsletter</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Contact</h4>
          <p className="mt-4 text-sm text-slate-300">
            hello@sigmaembedded.ma
            <br />
            Casablanca - Maroc
          </p>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-slate-500">
        © 2024 Sigma Embedded. All rights reserved.
      </div>
    </footer>
  );
}
