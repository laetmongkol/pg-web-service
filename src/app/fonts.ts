import { Anuphan, JetBrains_Mono } from "next/font/google"

// Anuphan carries both Thai and Latin with one rhythm (type.*). JetBrains Mono is reserved for
// code, numbers and short technical labels.
export const anuphan = Anuphan({
  variable: "--font-anuphan",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600"],
  display: "swap",
})

export const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
})
