const fs = require('fs');
const pathVi = 'c:/hoctap/nam3/hk2/CT466E Nien luan - CNTT/yourvocab-src/frontend/src/locales/vi/translation.json';
const pathEn = 'c:/hoctap/nam3/hk2/CT466E Nien luan - CNTT/yourvocab-src/frontend/src/locales/en/translation.json';

function cleanBom(str) {
  return str.charCodeAt(0) === 0xFEFF ? str.slice(1) : str;
}

const viStr = fs.readFileSync(pathVi, 'utf8');
const enStr = fs.readFileSync(pathEn, 'utf8');

const vi = JSON.parse(cleanBom(viStr));
const en = JSON.parse(cleanBom(enStr));

vi.cards_page.filters = {
  ...vi.cards_page.filters,
  has_example: "Có ví dụ",
  has_ipa: "Có phiên âm (IPA)",
  has_definition: "Có định nghĩa",
  has_synonyms: "Có từ đồng nghĩa",
  has_antonyms: "Có từ trái nghĩa",
  has_near_synonyms: "Có từ gần nghĩa"
};

en.cards_page.filters = {
  ...en.cards_page.filters,
  has_example: "Has example",
  has_ipa: "Has IPA",
  has_definition: "Has definition",
  has_synonyms: "Has synonyms",
  has_antonyms: "Has antonyms",
  has_near_synonyms: "Has near-synonyms"
};

fs.writeFileSync(pathVi, JSON.stringify(vi, null, 2), 'utf8');
fs.writeFileSync(pathEn, JSON.stringify(en, null, 2), 'utf8');
console.log("Updated locales for filters");
