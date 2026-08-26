/**
 * ISO 639-1 language codes → English display names.
 * Shared catalog for UI labels (e.g. "th: Thai") and language admin defaults.
 */
export const LANGUAGE_NAMES = {
  aa: "Afar",
  ab: "Abkhazian",
  ae: "Avestan",
  af: "Afrikaans",
  ak: "Akan",
  am: "Amharic",
  an: "Aragonese",
  ar: "Arabic",
  as: "Assamese",
  av: "Avaric",
  ay: "Aymara",
  az: "Azerbaijani",
  ba: "Bashkir",
  be: "Belarusian",
  bg: "Bulgarian",
  bi: "Bislama",
  bm: "Bambara",
  bn: "Bengali",
  bo: "Tibetan",
  br: "Breton",
  bs: "Bosnian",
  ca: "Catalan",
  ce: "Chechen",
  ch: "Chamorro",
  co: "Corsican",
  cr: "Cree",
  cs: "Czech",
  cu: "Church Slavic",
  cv: "Chuvash",
  cy: "Welsh",
  da: "Danish",
  de: "German",
  dv: "Divehi",
  dz: "Dzongkha",
  ee: "Ewe",
  el: "Modern Greek",
  en: "English",
  eo: "Esperanto",
  es: "Spanish",
  et: "Estonian",
  eu: "Basque",
  fa: "Persian",
  ff: "Fulah",
  fi: "Finnish",
  fj: "Fijian",
  fo: "Faroese",
  fr: "French",
  fy: "Western Frisian",
  ga: "Irish",
  gd: "Scottish Gaelic",
  gl: "Galician",
  gn: "Guarani",
  gu: "Gujarati",
  gv: "Manx",
  ha: "Hausa",
  he: "Hebrew",
  hi: "Hindi",
  ho: "Hiri Motu",
  hr: "Croatian",
  ht: "Haitian",
  hu: "Hungarian",
  hy: "Armenian",
  hz: "Herero",
  ia: "Interlingua",
  id: "Indonesian",
  ie: "Interlingue",
  ig: "Igbo",
  ii: "Sichuan Yi",
  ik: "Inupiaq",
  io: "Ido",
  is: "Icelandic",
  it: "Italian",
  iu: "Inuktitut",
  ja: "Japanese",
  jv: "Javanese",
  ka: "Georgian",
  kg: "Kongo",
  ki: "Kikuyu",
  kj: "Kuanyama",
  kk: "Kazakh",
  kl: "Kalaallisut",
  km: "Central Khmer",
  kn: "Kannada",
  ko: "Korean",
  kr: "Kanuri",
  ks: "Kashmiri",
  ku: "Kurdish",
  kv: "Komi",
  kw: "Cornish",
  ky: "Kirghiz",
  la: "Latin",
  lb: "Luxembourgish",
  lg: "Ganda",
  li: "Limburgan",
  ln: "Lingala",
  lo: "Lao",
  lt: "Lithuanian",
  lu: "Luba-Katanga",
  lv: "Latvian",
  mg: "Malagasy",
  mh: "Marshallese",
  mi: "Maori",
  mk: "Macedonian",
  ml: "Malayalam",
  mn: "Mongolian",
  mr: "Marathi",
  ms: "Malay",
  mt: "Maltese",
  my: "Burmese",
  na: "Nauru",
  nb: "Norwegian Bokmål",
  nd: "North Ndebele",
  ne: "Nepali",
  ng: "Ndonga",
  nl: "Dutch",
  nn: "Norwegian Nynorsk",
  no: "Norwegian",
  nr: "South Ndebele",
  nv: "Navajo",
  ny: "Chichewa",
  oc: "Occitan",
  oj: "Ojibwa",
  om: "Oromo",
  or: "Oriya",
  os: "Ossetian",
  pa: "Punjabi",
  pi: "Pali",
  pl: "Polish",
  ps: "Pashto",
  pt: "Portuguese",
  qu: "Quechua",
  rm: "Romansh",
  rn: "Rundi",
  ro: "Romanian",
  ru: "Russian",
  rw: "Kinyarwanda",
  sa: "Sanskrit",
  sc: "Sardinian",
  sd: "Sindhi",
  se: "Northern Sami",
  sg: "Sango",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  sm: "Samoan",
  sn: "Shona",
  so: "Somali",
  sq: "Albanian",
  sr: "Serbian",
  ss: "Swati",
  st: "Southern Sotho",
  su: "Sundanese",
  sv: "Swedish",
  sw: "Swahili",
  ta: "Tamil",
  te: "Telugu",
  tg: "Tajik",
  th: "Thai",
  ti: "Tigrinya",
  tk: "Turkmen",
  tl: "Tagalog",
  tn: "Tswana",
  to: "Tonga",
  tr: "Turkish",
  ts: "Tsonga",
  tt: "Tatar",
  tw: "Twi",
  ty: "Tahitian",
  ug: "Uighur",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  ve: "Venda",
  vi: "Vietnamese",
  vo: "Volapük",
  wa: "Walloon",
  wo: "Wolof",
  xh: "Xhosa",
  yi: "Yiddish",
  yo: "Yoruba",
  za: "Zhuang",
  zh: "Chinese",
  zu: "Zulu",
} as const;

export type Iso6391LanguageCode = keyof typeof LANGUAGE_NAMES;

/** Fallback / docs locale set. Sitemap runtime uses Language API active rows instead. */
export const ACTIVE_LANGUAGE_CODES = ["th", "en"] as const;

export type ActiveLanguageCode = (typeof ACTIVE_LANGUAGE_CODES)[number];

export const ACTIVE_LANGUAGES = {
  th: {
    code: "th",
    name: LANGUAGE_NAMES.th,
    label: `th: ${LANGUAGE_NAMES.th}`,
  },
  en: {
    code: "en",
    name: LANGUAGE_NAMES.en,
    label: `en: ${LANGUAGE_NAMES.en}`,
  },
} as const satisfies Record<
  ActiveLanguageCode,
  { code: ActiveLanguageCode; name: string; label: string }
>;

const SPECIAL_LANGUAGE_NAMES: Record<string, string> = {
  "x-default": "Default",
};

/** True when `code` is in the active (shipped) locale set. */
export function isActiveLanguage(code?: string | null): code is ActiveLanguageCode {
  if (!code) return false;
  return (ACTIVE_LANGUAGE_CODES as readonly string[]).includes(code.trim().toLowerCase());
}

/** English display name for a language/locale code (falls back to the code). */
export function getLanguageName(code: string): string {
  const key = code.trim().toLowerCase();
  if (key in SPECIAL_LANGUAGE_NAMES) return SPECIAL_LANGUAGE_NAMES[key]!;
  if (Object.prototype.hasOwnProperty.call(LANGUAGE_NAMES, key)) {
    return LANGUAGE_NAMES[key as Iso6391LanguageCode];
  }
  return code;
}

/** UI label like `th: Thai`. Unknown codes return the raw code. */
export function getLanguageLabel(code: string): string {
  const trimmed = code.trim();
  if (!trimmed) return "";
  const name = getLanguageName(trimmed);
  const key = trimmed.toLowerCase();
  if (key in SPECIAL_LANGUAGE_NAMES || Object.prototype.hasOwnProperty.call(LANGUAGE_NAMES, key)) {
    return `${trimmed}: ${name}`;
  }
  return trimmed;
}
