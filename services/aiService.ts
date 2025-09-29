import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, API_ENDPOINTS, ERROR_MESSAGES } from '../config/api';

export interface AIResponse {
  text: string;
  success: boolean;
  error?: string;
}

export class AIService {
  private static instance: AIService;
  private static readonly QUOTA_KEY = 'ai_quota_usage';
  private static readonly QUOTA_DATE_KEY = 'ai_quota_date';

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Check if user has remaining quota
  private async checkQuota(): Promise<{canUse: boolean, remaining: number, resetTime?: Date}> {
    try {
      const today = new Date().toDateString();
      const storedDate = await AsyncStorage.getItem(AIService.QUOTA_DATE_KEY);
      const storedUsage = await AsyncStorage.getItem(AIService.QUOTA_KEY);
      
      // Reset quota if it's a new day
      if (storedDate !== today) {
        await AsyncStorage.setItem(AIService.QUOTA_DATE_KEY, today);
        await AsyncStorage.setItem(AIService.QUOTA_KEY, '0');
        return { canUse: true, remaining: API_CONFIG.DAILY_PROMPT_LIMIT };
      }
      
      const currentUsage = parseInt(storedUsage || '0');
      const remaining = API_CONFIG.DAILY_PROMPT_LIMIT - currentUsage;
      
      if (remaining <= 0) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return { canUse: false, remaining: 0, resetTime: tomorrow };
      }
      
      return { canUse: true, remaining };
    } catch (error) {
      console.error('❌ Quota check error:', error);
      return { canUse: true, remaining: API_CONFIG.DAILY_PROMPT_LIMIT };
    }
  }

  // Increment quota usage
  private async incrementQuota(): Promise<void> {
    try {
      const storedUsage = await AsyncStorage.getItem(AIService.QUOTA_KEY);
      const currentUsage = parseInt(storedUsage || '0');
      await AsyncStorage.setItem(AIService.QUOTA_KEY, (currentUsage + 1).toString());
    } catch (error) {
      console.error('❌ Quota increment error:', error);
    }
  }

  // Get quota status for display
  public async getQuotaStatus(): Promise<{used: number, remaining: number, resetTime?: Date}> {
    try {
      const today = new Date().toDateString();
      const storedDate = await AsyncStorage.getItem(AIService.QUOTA_DATE_KEY);
      const storedUsage = await AsyncStorage.getItem(AIService.QUOTA_KEY);
      
      if (storedDate !== today) {
        return { used: 0, remaining: API_CONFIG.DAILY_PROMPT_LIMIT };
      }
      
      const used = parseInt(storedUsage || '0');
      const remaining = Math.max(0, API_CONFIG.DAILY_PROMPT_LIMIT - used);
      
      if (remaining === 0) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return { used, remaining, resetTime: tomorrow };
      }
      
      return { used, remaining };
    } catch (error) {
      console.error('❌ Quota status error:', error);
      return { used: 0, remaining: API_CONFIG.DAILY_PROMPT_LIMIT };
    }
  }

  async generateResponse(userPrompt: string, language: string = 'en'): Promise<AIResponse> {
    try {
      console.log('🚀 Starting AI request...');
      console.log('📝 User prompt:', userPrompt);

      // Check quota first
      const quotaStatus = await this.checkQuota();
      if (!quotaStatus.canUse) {
        const resetTime = quotaStatus.resetTime;
        const hoursUntilReset = resetTime ? Math.ceil((resetTime.getTime() - Date.now()) / (1000 * 60 * 60)) : 24;
        
        return {
          text: `🚫 Daily limit reached! You've used all ${API_CONFIG.DAILY_PROMPT_LIMIT} free prompts today.\n\n⏰ Quota resets in ${hoursUntilReset} hours.\n\n💡 Try again tomorrow or upgrade to Pro for unlimited access.`,
          success: false,
          error: 'Daily quota exceeded'
        };
      }

      console.log(`📊 Quota remaining: ${quotaStatus.remaining}/${API_CONFIG.DAILY_PROMPT_LIMIT}`);
      console.log('🌐 Language:', language);
      console.log('🔑 API Key (first 10 chars):', API_CONFIG.GEMINI_API_KEY.substring(0, 10) + '...');
      console.log('🌐 API URL:', API_ENDPOINTS.GEMINI_GENERATE);

      // Create request body as specified
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: userPrompt
              }
            ]
          }
        ]
      };

      console.log('📋 Request body:', JSON.stringify(requestBody, null, 2));

      // Use simple free model only
      const models = [
        'gemini-1.5-flash-latest' // Simple free model
      ];

      let response;
      let lastError;

      for (const model of models) {
        try {
          console.log(`🔄 Trying model: ${model}`);
          const modelUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
          const modelEndpoint = `${modelUrl}?key=${API_CONFIG.GEMINI_API_KEY}`;
          
          response = await fetch(modelEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

          if (response.ok) {
            console.log(`✅ Model ${model} worked!`);
            break;
          } else {
            const errorText = await response.text();
            console.warn(`❌ Model ${model} failed:`, response.status, errorText);
            lastError = new Error(`Model ${model} failed: ${response.status} ${response.statusText} - ${errorText}`);
          }
        } catch (error) {
          console.warn(`❌ Model ${model} error:`, error);
          lastError = error;
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error('All models failed');
      }

      console.log('📊 Response status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Gemini API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Response data received:', data);
      
      // Parse the response correctly
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiText = data.candidates[0].content.parts[0].text;
        console.log('✅ AI Response generated:', aiText.substring(0, 100) + '...');
        
        // Increment quota usage after successful response
        await this.incrementQuota();
        console.log('📊 Quota incremented');
        
        return {
          text: aiText.trim(),
          success: true
        };
      } else {
        console.error('❌ Invalid response format:', data);
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('❌ AI Service Error:', error);
      return {
        text: this.getFallbackResponse(userPrompt, language),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async makeAPIRequest(requestBody: any): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);

    try {
      const response = await fetch(API_ENDPOINTS.GEMINI_GENERATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.TIMEOUT);
      }
      throw error;
    }
  }

  private getFallbackResponse(userPrompt: string, language: string): string {
    const lowerPrompt = userPrompt.toLowerCase();
    
    // Provide helpful responses based on common Islamic questions
    if (lowerPrompt.includes('prayer') || lowerPrompt.includes('namaz') || lowerPrompt.includes('صلاة')) {
      const responses = {
        en: "I can help you with prayer times! Please make sure location permissions are enabled in your device settings. You can also manually set your location in the app settings.",
        ur: "میں آپ کی نماز کے اوقات کے ساتھ مدد کر سکتا ہوں! براہ کرم یقینی بنائیں کہ آپ کے ڈیوائس کی سیٹنگز میں لوکیشن کی اجازت فعال ہے۔ آپ ایپ کی سیٹنگز میں اپنا مقام دستی طور پر بھی سیٹ کر سکتے ہیں۔",
        ar: "يمكنني مساعدتك في أوقات الصلاة! يرجى التأكد من تمكين أذونات الموقع في إعدادات جهازك. يمكنك أيضاً تعيين موقعك يدوياً في إعدادات التطبيق."
      };
      return responses[language as keyof typeof responses] || responses.en;
    }
    
    if (lowerPrompt.includes('qibla') || lowerPrompt.includes('قبلة')) {
      const responses = {
        en: "To find the Qibla direction, please enable location permissions in your device settings. The Qibla compass will then show you the direction to Mecca.",
        ur: "قبلہ کی سمت تلاش کرنے کے لیے، براہ کرم اپنے ڈیوائس کی سیٹنگز میں لوکیشن کی اجازت فعال کریں۔ اس کے بعد قبلہ کمپاس آپ کو مکہ کی سمت دکھائے گا۔",
        ar: "للعثور على اتجاه القبلة، يرجى تمكين أذونات الموقع في إعدادات جهازك. سيعرض لك بوصلة القبلة بعد ذلك اتجاه مكة."
      };
      return responses[language as keyof typeof responses] || responses.en;
    }

    // Default fallback messages
    const fallbacks = {
      en: ERROR_MESSAGES.AI_BUSY,
      ur: "AI مصروف ہے، براہ کرم دوبارہ کوشش کریں۔",
      ar: "الذكاء الاصطناعي مشغول، يرجى المحاولة مرة أخرى."
    };

    return fallbacks[language as keyof typeof fallbacks] || fallbacks.en;
  }
}

export const aiService = AIService.getInstance();

// Test function to verify API connection
export const testAIConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testing AI Service Connection...');
    console.log('📋 API Key (first 10 chars):', API_CONFIG.GEMINI_API_KEY.substring(0, 10) + '...');
    console.log('🌐 API URL:', API_ENDPOINTS.GEMINI_GENERATE);
    
    const response = await aiService.generateResponse('Hello, are you working?', 'en');
    console.log('✅ AI Service Test Result:', response);
    return response.success;
  } catch (error) {
    console.error('❌ AI Service Test Failed:', error);
    return false;
  }
};

// API key validation
export const validateAPIKey = (): boolean => {
  const key = API_CONFIG.GEMINI_API_KEY;
  console.log('🔍 Validating API Key...');
  console.log('📋 Key length:', key.length);
  console.log('📋 Key starts with AIza:', key.startsWith('AIza'));
  console.log('📋 Key (first 20 chars):', key.substring(0, 20) + '...');
  
  if (!key) {
    console.error('❌ API Key is missing');
    return false;
  }
  if (key.length < 20) {
    console.error('❌ API Key is too short (should be at least 20 characters)');
    return false;
  }
  if (!key.startsWith('AIza')) {
    console.error('❌ API Key format is incorrect (should start with AIza)');
    return false;
  }
  console.log('✅ API Key format looks correct');
  return true;
};

// Discover available models
export const discoverAvailableModels = async (): Promise<{success: boolean, models?: string[], error?: string}> => {
  try {
    console.log('🔍 Discovering available models...');
    
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_CONFIG.GEMINI_API_KEY}`;
    const response = await fetch(listUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to list models:', errorText);
      return {
        success: false,
        error: `Failed to list models: ${response.status} ${response.statusText} - ${errorText}`
      };
    }
    
    const data = await response.json();
    console.log('✅ Available models:', data);
    
    const models = data.models?.map((model: any) => model.name) || [];
    return {
      success: true,
      models: models
    };
  } catch (error) {
    console.error('❌ Model discovery error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Test API key with actual request
export const testAPIKeyWithRequest = async (): Promise<{success: boolean, error?: string}> => {
  try {
    console.log('🧪 Testing API key with actual request...');
    
    const testBody = {
      contents: [
        {
          parts: [
            {
              text: "Hello, this is a test message."
            }
          ]
        }
      ]
    };

    console.log('🌐 Test URL:', API_ENDPOINTS.GEMINI_GENERATE);
    console.log('📋 Test body:', JSON.stringify(testBody, null, 2));

    // Use simple free model only
    const models = [
      'gemini-1.5-flash-latest' // Simple free model
    ];

    let response;
    let lastError;

    for (const model of models) {
      try {
        console.log(`🔄 Testing model: ${model}`);
        const modelUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        const modelEndpoint = `${modelUrl}?key=${API_CONFIG.GEMINI_API_KEY}`;
        
        response = await fetch(modelEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testBody),
        });

        if (response.ok) {
          console.log(`✅ Model ${model} worked!`);
          break;
        } else {
          const errorText = await response.text();
          console.warn(`❌ Model ${model} failed:`, response.status, errorText);
          lastError = new Error(`Model ${model} failed: ${response.status} ${response.statusText} - ${errorText}`);
        }
      } catch (error) {
        console.warn(`❌ Model ${model} error:`, error);
        lastError = error;
      }
    }

    if (!response || !response.ok) {
      throw lastError || new Error('All models failed');
    }

    console.log('📊 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Key test failed:', errorText);
      return {
        success: false,
        error: `API request failed: ${response.status} ${response.statusText} - ${errorText}`
      };
    }

    const data = await response.json();
    console.log('✅ API Key test successful:', data);
    return { success: true };
  } catch (error) {
    console.error('❌ API Key test error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};