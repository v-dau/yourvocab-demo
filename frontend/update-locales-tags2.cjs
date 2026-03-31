const fs = require('fs');
const pathVi = 'c:/hoctap/nam3/hk2/CT466E Nien luan - CNTT/yourvocab-src/frontend/src/locales/vi/translation.json';
const pathEn = 'c:/hoctap/nam3/hk2/CT466E Nien luan - CNTT/yourvocab-src/frontend/src/locales/en/translation.json';

function cleanBom(str) {
  return str.charCodeAt(0) === 0xFEFF ? str.slice(1) : str;
}

function addTagsToLocales() {
  const viStr = fs.readFileSync(pathVi, 'utf8');
  const enStr = fs.readFileSync(pathEn, 'utf8');

  const vi = JSON.parse(cleanBom(viStr));
  const en = JSON.parse(cleanBom(enStr));

  if (!vi.tag) { vi.tag = {}; }
  vi.tag = {
    ...vi.tag,
    btn: "Nhãn",
    manager_title: "Quản lý nhãn dán",
    search_placeholder: "Tìm kiếm nhãn dán...",
    loading: "Đang tải...",
    no_tags: "Không có nhãn dán nào",
    card_count: "{{count}} thẻ",
    load_error: "Gặp lỗi khi tải nhãn dán",
    delete_confirm: "Bạn có chắc muốn xóa Nhãn này? Các thẻ đang dùng tag này sẽ không bị xóa, chỉ mất liên kết.",
    delete_success: "Xóa nhãn dán thành công",
    delete_error: "Lỗi khi xóa nhãn dán",
    update_success: "Cập nhật nhãn dán thành công",
    update_error: "Lỗi khi cập nhật nhãn dán"
  };

  if (!en.tag) { en.tag = {}; }
  en.tag = {
    ...en.tag,
    btn: "Tags",
    manager_title: "Manage tags",
    search_placeholder: "Search tags...",
    loading: "Loading...",
    no_tags: "No tags found",
    card_count: "{{count}} cards",
    load_error: "Error loading tags",
    delete_confirm: "Are you sure you want to delete this Tag? Cards using this tag will not be deleted, only unlinked.",
    delete_success: "Tag deleted successfully",
    delete_error: "Error deleting tag",
    update_success: "Tag updated successfully",
    update_error: "Error updating tag"
  };

  fs.writeFileSync(pathVi, JSON.stringify(vi, null, 2), 'utf8');
  fs.writeFileSync(pathEn, JSON.stringify(en, null, 2), 'utf8');
  console.log("Done updating locales");
}
addTagsToLocales();
