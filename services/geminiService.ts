import { GoogleGenAI, Type } from "@google/genai";
import { DesignConcept } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Please set it to use the Gemini API.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const designConceptSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: '디자인 컨셉의 감성적인 제목',
      },
      description: {
        type: Type.STRING,
        description: '디자인이 고객의 사연과 사진(있을 경우)을 어떻게 반영하는지에 대한 상세 설명',
      },
      formatSuggestion: {
        type: Type.STRING,
        description: '청첩장의 창의적인 형태나 형식에 대한 제안 (예: 다이컷, 팝업, 티켓 모양 등)',
      },
      imagePrompt: {
        type: Type.STRING,
        description: 'AI 이미지 생성을 위한 상세하고 구체적인 프롬프트. 스타일, 색상, 주요 요소, 분위기를 포함하고, 제공된 사진의 요소를 자연스럽게 통합해야 함.',
      },
    },
    required: ['title', 'description', 'formatSuggestion', 'imagePrompt'],
  },
};

export const generateInvitationConcepts = async (story: string, color: string, mood: string, elements: string, imageData: string | null): Promise<DesignConcept[]> => {
  const prompt = `
    당신은 상상력이 풍부한 고급 청첩장 디자이너입니다. 다음 커플의 이야기, 선호도, 그리고 제공된 사진(있을 경우)을 바탕으로, 그들의 청첩장을 위한 독창적이고 예술적인 디자인 컨셉 3가지를 생성해주세요. 각 컨셉은 단순한 사각형을 넘어선 창의적인 형태나 형식을 제안해야 합니다.

    각 컨셉에 대해 다음 정보를 JSON 형식으로 제공해주세요:
    1. title: 짧고 감성적인 제목
    2. description: 디자인이 그들의 이야기와 사진(있을 경우)을 어떻게 반영하는지 설명하는 한 문단 길이의 글
    3. formatSuggestion: 청첩장의 창의적인 형태나 형식에 대한 제안 (예: 벚꽃 모양으로 따낸 다이컷 카드, 여행 티켓 모양의 청첩장, 펼치면 입체적인 팝업이 나타나는 형식 등)
    4. imagePrompt: AI 이미지 생성기가 청첩장 디자인을 만들 수 있도록 매우 상세하고 시각적인 프롬프트. 프롬프트는 스타일, 색상 팔레트, 핵심 요소, 전반적인 분위기를 포함해야 하며, 제공된 사진의 요소를 자연스럽게 통합해야 합니다.

    고객 정보:
    - 우리의 이야기: "${story}"
    - 원하는 색상 계열: "${color}"
    - 선호하는 분위기: "${mood}"
    - 특별히 넣고 싶은 요소: "${elements}"
    ${imageData ? '- (고객이 제공한 사진이 다음에 첨부됩니다. 이 사진을 디자인 영감의 핵심 요소로 활용해주세요.)' : ''}
  `;

  try {
    const textPart = { text: prompt };
    // FIX: Explicitly type `parts` to allow a mix of text and image objects, resolving a TypeScript inference error.
    const parts: ({ text: string } | { inlineData: { mimeType: string; data: string; } })[] = [textPart];

    if (imageData) {
        const mimeType = imageData.match(/data:(image\/[a-z]+);/)?.[1] || 'image/jpeg';
        const base64Data = imageData.split(',')[1];
        const imagePart = {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        };
        parts.push(imagePart);
    }
      
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: designConceptSchema,
      },
    });
    
    const jsonString = response.text.trim();
    const concepts = JSON.parse(jsonString);

    if (Array.isArray(concepts)) {
      return concepts;
    } else {
       console.error("Parsed response is not an array:", concepts);
       return [];
    }
  } catch (error) {
    console.error("Error generating invitation concepts:", error);
    throw new Error("디자인 컨셉을 생성하는 데 실패했습니다.");
  }
};

export const generateInvitationImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '3:4',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image generated.");
    }
  } catch (error) {
    console.error("Error generating invitation image:", error);
    throw new Error("디자인 이미지를 생성하는 데 실패했습니다.");
  }
};

export const generateFormatImages = async (suggestion: string): Promise<string[]> => {
  const prompts = [
    `Front view of a closed wedding invitation. The key feature is its unique physical format: "${suggestion}". Clean, minimalist, high-quality product mockup on a neutral light gray studio background with soft shadows. Modern, elegant, photorealistic style. Focus on material texture and shape.`,
    `45-degree angle view of a partially open wedding invitation with the format: "${suggestion}". Showcases the 3D structure, unique cuts, and folds. Clean, elegant, high-quality product mockup on a neutral off-white studio background with soft lighting. Photorealistic and sophisticated style.`,
    `Top-down view of a fully opened wedding invitation with the format: "${suggestion}". Clearly displays the internal layout and how it unfolds. Focus on the complete shape. High-quality, modern product mockup on a neutral light-colored studio background. Minimalist and photorealistic style.`
  ];

  try {
    const imagePromises = prompts.map(prompt => 
      ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      })
    );
    
    const responses = await Promise.all(imagePromises);
    
    const imageUrls = responses.map(response => {
      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      } else {
        throw new Error("No format image generated for one of the angles.");
      }
    });
    
    return imageUrls;

  } catch (error) {
    console.error("Error generating format images:", error);
    // Returning an array of placeholders for better UX
    return [
      `https://picsum.photos/seed/${suggestion}1/400/400?grayscale`,
      `https://picsum.photos/seed/${suggestion}2/400/400?grayscale`,
      `https://picsum.photos/seed/${suggestion}3/400/400?grayscale`
    ];
  }
};