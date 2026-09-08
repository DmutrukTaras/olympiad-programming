import { LockKeyhole } from 'lucide-react';
import { finalMixedSet } from '@/content/final-mixed-set';

export function FinalMixedSet() {
  return (
    <section
      id="final-mixed-set"
      className="scroll-mt-28 border-t border-border py-10"
    >
      <p className="eyebrow">Фінальний checkpoint</p>
      <div className="mt-4 flex items-start gap-4">
        <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-2.5 text-red-400">
          <LockKeyhole className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Final Mixed Set
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Тут навмисно немає назв патернів, глав і підказок. Перед кодом
            запиши модель, очікувану складність і короткий доказ
            еквівалентності.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-3">
        {finalMixedSet.map((task, index) => (
          <details
            key={task.id}
            className="group rounded-2xl border border-border bg-card p-5"
          >
            <summary className="cursor-pointer list-none font-semibold marker:hidden">
              <span className="mr-3 font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              {task.title}
            </summary>
            <div className="mt-5 space-y-5 border-t border-border pt-5 text-sm leading-7 text-muted-foreground">
              <p>{task.statement}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-foreground">Вхідні дані</h3>
                  <p className="mt-1">{task.input}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Вихідні дані
                  </h3>
                  <p className="mt-1">{task.output}</p>
                </div>
              </div>
              <ul className="space-y-1 font-mono text-xs">
                {task.constraints.map((constraint) => (
                  <li key={constraint}>{constraint}</li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
