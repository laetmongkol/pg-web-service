type SwatchGroup = {
  title: string;
  tokens: string[];
};

const FONT_SAMPLES = [
  {
    label: "English",
    lines: [
      "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
      "a b c d e f g h i j k l m n o p q r s t u v w x y z",
    ],
  },
  {
    label: "ไทย",
    lines: [
      "ก ข ฃ ค ฅ ฆ ง จ ฉ ช ซ ฌ ญ ฎ ฏ ฐ ฑ ฒ ณ ด ต ถ ท ธ น บ ป ผ ฝ พ ฟ ภ ม ย ร ล ว ศ ษ ส ห ฬ อ ฮ",
      "ะ า -ิ -ี -ึ -ื -ุ -ู เ แ โ ใ ไ -ํ -่ -้ -๊ -๋ -์ ๆ ฯ",
    ],
  },
  {
    label: "Numbers",
    lines: ["0 1 2 3 4 5 6 7 8 9 ๐ ๑ ๒ ๓ ๔ ๕ ๖ ๗ ๘ ๙"],
  },
  {
    label: "Other",
    lines: [". , ; : ! ? ' \" - — ( ) [ ] { } @ # & * + / < = > %   $ € £ ¥"],
  },
] as const;

const FONT_WEIGHTS = [
  { label: "light", className: "font-light" },
  { label: "regular", className: "font-normal" },
  { label: "medium", className: "font-medium" },
  { label: "semibold", className: "font-semibold" },
  { label: "bold", className: "font-bold" },
] as const;

const COLOR_GROUPS: SwatchGroup[] = [
  {
    title: "Primary — Midnight Navy",
    tokens: [
      "--color-primary-50",
      "--color-primary-100",
      "--color-primary-150",
      "--color-primary-200",
      "--color-primary-250",
      "--color-primary-300",
      "--color-primary-350",
      "--color-primary-400",
      "--color-primary-500",
      "--color-primary-600",
      "--color-primary-650",
      "--color-primary-700",
      "--color-primary-750",
      "--color-primary-800",
      "--color-primary-850",
      "--color-primary-900",
      "--color-primary-950",
    ],
  },
  {
    title: "Secondary — Amber Gold",
    tokens: [
      "--color-secondary-50",
      "--color-secondary-100",
      "--color-secondary-200",
      "--color-secondary-300",
      "--color-secondary-400",
      "--color-secondary-500",
      "--color-secondary-600",
      "--color-secondary-700",
      "--color-secondary-800",
      "--color-secondary-900",
    ],
  },
  {
    title: "Success",
    tokens: [
      "--color-success-50",
      "--color-success-100",
      "--color-success-200",
      "--color-success-300",
      "--color-success-400",
      "--color-success-500",
      "--color-success-600",
      "--color-success-700",
    ],
  },
  {
    title: "Danger",
    tokens: [
      "--color-danger-50",
      "--color-danger-100",
      "--color-danger-200",
      "--color-danger-300",
      "--color-danger-400",
      "--color-danger-500",
      "--color-danger-600",
      "--color-danger-700",
    ],
  },
  {
    title: "Info",
    tokens: [
      "--color-info-50",
      "--color-info-100",
      "--color-info-200",
      "--color-info-300",
      "--color-info-400",
      "--color-info-500",
      "--color-info-600",
      "--color-info-700",
    ],
  },
  {
    title: "Amber",
    tokens: ["--color-amber-500"],
  },
  {
    title: "Surface",
    tokens: [
      "--surface-page",
      "--surface-default",
      "--surface-muted",
      "--surface-elevated",
      "--surface-code-inline",
      "--surface-code-block",
      "--surface-blockquote",
      "--surface-navbar",
      "--surface-invert",
    ],
  },
  {
    title: "Text",
    tokens: [
      "--text-primary",
      "--text-secondary",
      "--text-muted",
      "--text-invert",
      "--text-disabled",
    ],
  },
  {
    title: "Border",
    tokens: ["--border-default", "--border-muted", "--border-strong"],
  },
  {
    title: "Brand mapping",
    tokens: [
      "--color-primary",
      "--color-primary-hover",
      "--color-primary-active",
      "--color-primary-readable",
      "--color-secondary",
      "--color-secondary-hover",
      "--color-secondary-active",
      "--focus-ring",
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-(--surface-page) font-sans text-(--text-primary)">
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Theme tokens</h1>
          <p className="text-(--text-secondary)">
            Color tokens and typeface from <code>theme-tokens.css</code> /
          </p>
        </header>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold tracking-tight">Typeface</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {FONT_WEIGHTS.map((weight) => (
              <span
                key={weight.label}
                className={`${weight.className} rounded-full border border-(--border-default) bg-(--surface-default) px-3 py-1 text-sm tracking-widest`}
              >
                {weight.label}
              </span>
            ))}
          </div>
          {FONT_SAMPLES.map((sample) => (
            <div key={sample.label} className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-(--text-muted) tracking-widest">{sample.label}</h3>
              {sample.lines.map((line) => (
                <p
                  key={line}
                  className="break-words text-2xl font-semibold leading-relaxed text-(--text-primary) tracking-widest"
                >
                  {line}
                </p>
              ))}
            </div>
          ))}
        </section>

        {COLOR_GROUPS.map((group) => (
          <section key={group.title} className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold tracking-tight tracking-widest">{group.title}</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {group.tokens.map((token) => (
                <div key={token} className="flex flex-col items-center gap-2">
                  <span
                    className="size-16 rounded-full border border-(--border-default) shadow-(--shadow-sm)"
                    style={{ backgroundColor: `var(${token})` }}
                  />
                  <span className="break-all text-center font-mono text-xs text-(--text-secondary)">
                    {token}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
