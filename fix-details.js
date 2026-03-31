const fs = require('fs');
const filepath = 'c:/hoctap/nam3/hk2/CT466E Nien luan - CNTT/yourvocab-src/frontend/src/components/cards/CardDetailsModal.tsx';
let content = fs.readFileSync(filepath, 'utf8');

if (!content.includes('useTranslation')) {
    content = content.replace("import React from 'react';", "import React from 'react';\nimport { useTranslation } from 'react-i18next';");
    content = content.replace("export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ card, onClose }) => {\n  if (!card) return null;", "export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ card, onClose }) => {\n  const { t } = useTranslation();\n\n  if (!card) return null;");
}

content = content.replace(/PhÃ¡t Ã¢m/g, "{t('card.ipa', 'Phát âm')}");
content = content.replace(/Phát âm/g, "{t('card.ipa', 'Phát âm')}");

content = content.replace(/NghÄ©a/g, "{t('card.meaning', 'Nghĩa')}");
content = content.replace(/<h3 className="font-semibold mb-2">Nghĩa<\/h3>/g, "<h3 className=\"font-semibold mb-2\">{t('card.meaning', 'Nghĩa')}</h3>");

content = content.replace(/Ä»‹nh nghÄ©a/g, "{t('card.definition', 'Định nghĩa')}");
content = content.replace(/Định nghĩa/g, "{t('card.definition', 'Định nghĩa')}");

content = content.replace(/VÃ dá»¥/g, "{t('card.example', 'Ví dụ')}");
content = content.replace(/Ví dụ/g, "{t('card.example', 'Ví dụ')}");

content = content.replace(/Tá»« Ä‘á»“ng nghÄ©a/g, "{t('card.synonyms', 'Từ đồng nghĩa')}");
content = content.replace(/Từ đồng nghĩa/g, "{t('card.synonyms', 'Từ đồng nghĩa')}");

content = content.replace(/Tá»« trÃ¡i nghÄ©a/g, "{t('card.antonyms', 'Từ trái nghĩa')}");
content = content.replace(/Từ trái nghĩa/g, "{t('card.antonyms', 'Từ trái nghĩa')}");

content = content.replace(/Tá»« gáº§n Ä‘á»“ng nghÄ©a/g, "{t('card.near_synonyms', 'Từ gần đồng nghĩa')}");
content = content.replace(/Từ gần đồng nghĩa/g, "{t('card.near_synonyms', 'Từ gần đồng nghĩa')}");

fs.writeFileSync(filepath, content, 'utf8');
