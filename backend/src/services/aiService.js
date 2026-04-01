import { GoogleGenerativeAI } from '@google/generative-ai';
import aiUsageRepository from '../repositories/aiUsageRepository.js';

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async checkAndConsumeQuota(userId) {
    return await aiUsageRepository.checkAndConsumeQuota(userId);
  }

  async generateVocabularyInfo(word) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // You can use flash or pro

    const prompt = `Bạn là một chuyên gia ngôn ngữ học và từ điển Anh - Việt. Nhiệm vụ của bạn là cung cấp thông tin chi tiết cho từ vựng tiếng Anh được cung cấp dưới đây.

YÊU CẦU BẮT BUỘC:
Chỉ trả về duy nhất một chuỗi JSON hợp lệ, không bao gồm bất kỳ văn bản giải thích nào khác. Cấu trúc JSON phải tuân thủ chính xác các trường sau:

{
  "word": "từ vựng gốc",
  "part_of_speech": "loại từ",
  "meaning": "nghĩa tiếng Việt ngắn gọn",
  "definition": "định nghĩa giải thích bằng tiếng Anh",
  "ipa": "phiên âm quốc tế IPA",
  "example": "một câu ví dụ thực tế bằng tiếng Anh",
  "level": "cấp độ CEFR của từ, nhận các giá trị ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', null nếu không xác định được)",
  "popularity": "độ phổ biến của từ, nhận giá trị số từ 1 đến 5 hoặc null nếu không xác định được (1=Extremely rare, 2=Rare, 3=Uncommon, 4=Common, 5=Essentials)",
  "synonyms": "danh sách 2-3 từ đồng nghĩa, ngăn cách bằng dấu phẩy, null nếu không có",
  "antonyms": "danh sách 2-3 từ trái nghĩa, ngăn cách bằng dấu phẩy, null nếu không có",
  "near_synonyms": "danh sách 2-3 từ gần nghĩa, ngăn cách bằng dấu phẩy, null nếu không có"
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
      return parsedJson;
    } catch (error) {
      console.error('Error generating AI text:', error);
      throw new Error('Đã xảy ra lỗi khi tạo dữ liệu từ vựng bằng AI. Hãy thử lại.', {
        cause: error,
      });
    }
  }
}

export default new AIService();
