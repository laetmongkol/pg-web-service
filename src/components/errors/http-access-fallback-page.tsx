import LinkCustom from "@/components/link-custom.component";

type HttpAccessFallbackPageProps = {
  digits: [string, string, string];
  code: string;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
};

export function HttpAccessFallbackPage({
  digits,
  code,
  title,
  description,
  actionHref,
  actionLabel,
}: HttpAccessFallbackPageProps) {
  const [d0, d1, d2] = digits;

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden text-center">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-20 z-5 h-96 w-96 rounded-full bg-(--color-primary) blur-3xl animate-[blob-pulse-soft_5s_ease-in-out_infinite]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-35 right-100 z-5 h-67 w-67 rounded-full bg-(--color-primary) blur-3xl animate-[blob-pulse-soft_5.6s_ease-in-out_infinite] [animation-delay:-0.2s]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-20 z-5 h-72 w-72 rounded-full bg-(--color-primary) blur-3xl animate-[blob-pulse-soft_6.2s_ease-in-out_infinite] [animation-delay:-0.4s]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-80 z-5 h-40 w-40 rounded-full bg-(--color-primary) blur-3xl animate-[blob-pulse-soft_5.2s_ease-in-out_infinite] [animation-delay:-0.6s]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-9 flex select-none items-center justify-center gap-1"
      >
        <span className="text-[clamp(9rem,20vw,16rem)] font-black leading-none text-(--border-default) opacity-10 animate-bounce [animation-duration:3s] [animation-delay:-0.8s]">
          {d0}
        </span>
        <span className="text-[clamp(9rem,20vw,16rem)] font-black leading-none text-(--border-default) opacity-10 animate-bounce [animation-duration:3s] [animation-delay:-0.6s]">
          {d1}
        </span>
        <span className="text-[clamp(9rem,20vw,16rem)] font-black leading-none text-(--border-default) opacity-10 animate-bounce [animation-duration:3s] [animation-delay:-0.4s]">
          {d2}
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-(--color-primary)">{code}</p>
        <h1 className="mt-2 text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-tight text-(--text-primary)">
          {title}
        </h1>
        <p className="mt-3 max-w-120 text-sm leading-relaxed text-(--text-secondary)">{description}</p>

        <div className="relative mt-8 rounded-lg p-0.5 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-[-200%] animate-spin [animation-duration:3s] bg-[conic-gradient(from_0deg,transparent_35%,#C9A84C_47%,#fffbe6_50%,#C9A84C_53%,transparent_65%)]"
          />
          <LinkCustom
            href={actionHref}
            className="relative z-10 flex items-center justify-center rounded-md bg-(--surface-default) px-8 py-2.5 text-sm font-medium text-(--text-primary) transition-colors duration-200 hover:bg-(--surface-default)"
          >
            {actionLabel}
          </LinkCustom>
        </div>
      </div>
    </main>
  );
}
