import { GoogleGenerativeAI } from '@google/generative-ai';
import aiUsageRepository from '../repositories/aiUsageRepository.js';

class AIService {
  async checkAndConsumeQuota(userId) {
    return await aiUsageRepository.checkAndConsumeQuota(userId);
  }

  async getQuota(userId) {
    return await aiUsageRepository.getQuota(userId);
  }

  async generateVocabularyInfo(word) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' }); // lên ai.google.dev/gemini-api/docs/models để xem những model nào dùng được

    const prompt = `Bạn là một chuyên gia ngôn ngữ học và từ điển Anh - Việt. Nhiệm vụ của bạn là cung cấp thông tin chi tiết cho từ vựng tiếng Anh được cung cấp dưới đây.

YÊU CẦU BẮT BUỘC:
Chỉ trả về duy nhất một chuỗi JSON hợp lệ, không bao gồm bất kỳ văn bản giải thích nào khác. Cấu trúc JSON phải tuân thủ chính xác các trường sau:

{
  "word": "từ vựng gốc",
  "part_of_speech": "chỉ nhận MỘT trong các giá trị sau (lowercase): 'noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection'. Nếu không có thì để rỗng ''",
  "meaning": "nghĩa tiếng Việt ngắn gọn",
  "definition": "định nghĩa giải thích bằng tiếng Anh",
  "ipa": "phiên âm quốc tế IPA (chỉ phần phiên âm, KHÔNG BAO GỒM 2 DẤU / / bao quanh, ví dụ: kəˈnɛkʃn)",
  "example": "một câu ví dụ thực tế bằng tiếng Anh",
  "level": "cấp độ CEFR của từ, nhận các giá trị ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', để rỗng '' nếu không xác định được)",
  "popularity": "độ phổ biến của từ, nhận giá trị số từ 1 đến 5 hoặc để rỗng '' nếu không xác định được (1=Extremely rare, 2=Rare, 3=Uncommon, 4=Common, 5=Essentials)",
  "synonyms": "danh sách 1-3 từ đồng nghĩa, ngăn cách bằng dấu phẩy, để rỗng '' nếu không có",
  "antonyms": "danh sách 1-3 từ trái nghĩa, ngăn cách bằng dấu phẩy, để rỗng '' nếu không có",
  "near_synonyms": "danh sách 1-3 từ gần nghĩa, ngăn cách bằng dấu phẩy, để rỗng '' nếu không có"
}

Từ vựng cần phân tích: "${word}"`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the JSON output (in case it's wrapped in markdown ```json)
      let cleanedText = text.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText
          .replace(/^```json/, '')
          .replace(/```$/, '')
          .trim();
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```/, '').replace(/```$/, '').trim();
      }

      // Parse and return JSON
      const parsedJson = JSON.parse(cleanedText);

      // Strip slashes from IPA if present
      if (parsedJson.ipa) {
        parsedJson.ipa = parsedJson.ipa.replace(/^\/|\/$/g, '').trim();
      }

      // Format Part of Speech securely
      if (parsedJson.part_of_speech) {
        parsedJson.part_of_speech = parsedJson.part_of_speech.toLowerCase().trim();
      }

      return parsedJson;
    } catch (error) {
      throw new Error('Đã xảy ra lỗi khi tạo dữ liệu từ vựng bằng AI. Hãy thử lại.', {
        cause: error,
      });
    }
  }
}

export default new AIService();
