import { writable } from "svelte/store";

///////////////////////////////////////////////////////////////////////////
// Conexón con el backend
const IP = 'localhost';
const PORT = 8000;
export const BACKEND_URL = `http://${IP}:${PORT}`;

///////////////////////////////////////////////////////////////////////////
// Manejar localStorage

export function getLocalStorage(key) {
    const value = localStorage.getItem(key);
    if (value) {
        return JSON.parse(value);
    }
    return null;
}

export function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocalStorage(key) {
    localStorage.removeItem(key);
}

export function clearLocalStorage() {
    localStorage.clear();
}

export const idiomaDiccionario = {
    "en_US": "Inglés (EE. UU.)",
    "it_IT": "Italiano",
    "sv_SE": "Sueco",
    "fr_CA": "Francés (Canadá)",
    "ms_MY": "Malayo",
    "de_DE": "Alemán",
    "he_IL": "Hebreo",
    "id_ID": "Indonesio",
    "en_GB": "Inglés (Reino Unido)",
    "bg_BG": "Búlgaro",
    "es_ES": "Español (España)",
    "es_MX": "Español (México)",
    "fi_FI": "Finlandés",
    "fr_FR": "Francés",
    "ja_JP": "Japonés",
    "ko_KR": "Coreano",
    "pt_BR": "Portugués (Brasil)",
    "zh_CN": "Chino (Simplificado)",
    "zh_TW": "Chino (Tradicional)",
    "nl_BE": "Neerlandés (Bélgica)",
    "ro_RO": "Rumano",
    "pt_PT": "Portugués (Portugal)",
    "th_TH": "Tailandés",
    "en_AU": "Inglés (Australia)",
    "hr_HR": "Croata",
    "sk_SK": "Eslovaco",
    "hi_IN": "Hindi",
    "uk_UA": "Ucraniano",
    "vi_VN": "Vietnamita",
    "ar_001": "Árabe (global)",
    "hu_HU": "Húngaro",
    "el_GR": "Griego",
    "ru_RU": "Ruso",
    "en_IE": "Inglés (Irlanda)",
    "ca_ES": "Catalán",
    "nb_NO": "Noruego (Bokmål)",
    "en_IN": "Inglés (India)",
    "da_DK": "Danés",
    "zh_HK": "Chino (Hong Kong)",
    "en_ZA": "Inglés (Sudáfrica)",
    "sl_SI": "Esloveno",
    "nl_NL": "Neerlandés (Países Bajos)",
    "tr_TR": "Turco",
    "pl_PL": "Polaco",
    "cs_CZ": "Checo"
};
