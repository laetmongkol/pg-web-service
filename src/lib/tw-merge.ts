import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teach tailwind-merge the design-system type scale (globals.css @theme), otherwise it reads
// `text-h1` as a colour and drops it when a `text-ink` follows.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "h1", "h2", "h3", "body", "label"],
    },
  },
})

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export default cn
