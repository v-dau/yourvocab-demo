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

vi.tag.confirm_delete_short = "Xóa nhãn này?";
vi.tag.delete_btn = "Xóa";
vi.tag.delete_confirm = "Bạn có chắc chắn? Các thẻ liên kết sẽ không bị xóa.";

en.tag.confirm_delete_short = "Delete this tag?";
en.tag.delete_btn = "Delete";
en.tag.delete_confirm = "Are you sure? Linked cards won't be deleted.";

fs.writeFileSync(pathVi, JSON.stringify(vi, null, 2), 'utf8');
fs.writeFileSync(pathEn, JSON.stringify(en, null, 2), 'utf8');
console.log("Updated locales for inline delete UI");
