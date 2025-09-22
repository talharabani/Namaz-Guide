import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Theme';

const { width } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language?: string;
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  prompt: string;
  category: string;
}

const quickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Prayer Times',
    icon: 'time-outline',
    prompt: 'What are the prayer times for today?',
    category: 'Prayer',
  },
  {
    id: '2',
    title: 'Qibla Direction',
    icon: 'compass-outline',
    prompt: 'How do I find the Qibla direction?',
    category: 'Prayer',
  },
  {
    id: '3',
    title: 'Wudu Steps',
    icon: 'water-outline',
    prompt: 'Can you explain the steps of Wudu?',
    category: 'Rituals',
  },
  {
    id: '4',
    title: 'Prayer Mistakes',
    icon: 'warning-outline',
    prompt: 'What are common mistakes in prayer?',
    category: 'Education',
  },
  {
    id: '5',
    title: 'Islamic Duas',
    icon: 'heart-outline',
    prompt: 'Share some important Islamic duas',
    category: 'Duas',
  },
  {
    id: '6',
    title: 'Ramadan Guide',
    icon: 'moon-outline',
    prompt: 'Tell me about Ramadan practices',
    category: 'Special Occasions',
  },
  {
    id: '7',
    title: 'Hajj Information',
    icon: 'airplane-outline',
    prompt: 'Explain the Hajj pilgrimage',
    category: 'Pilgrimage',
  },
  {
    id: '8',
    title: 'Islamic Calendar',
    icon: 'calendar-outline',
    prompt: 'Tell me about the Islamic calendar',
    category: 'Calendar',
  },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Assalamu Alaikum! I\'m your AI Islamic assistant. I can help you with prayer times, Islamic knowledge, duas, and answer questions in multiple languages. How can I assist you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const scrollViewRef = useRef<ScrollView>(null);

  const categories = ['All', 'Prayer', 'Rituals', 'Education', 'Duas', 'Special Occasions', 'Pilgrimage', 'Calendar'];

  // Mock AI responses based on keywords
  const generateAIResponse = (userMessage: string, language: string): string => {
    const message = userMessage.toLowerCase();
    
    // Prayer times
    if (message.includes('prayer time') || message.includes('namaz time')) {
      return language === 'ur' 
        ? 'آپ کی جگہ کے لیے نماز کے اوقات: فجر 5:30 AM، ظہر 12:15 PM، عصر 3:45 PM، مغرب 6:20 PM، عشاء 7:45 PM۔ آپ اپنی جگہ کے لیے درست اوقات چیک کر سکتے ہیں۔'
        : language === 'ar'
        ? 'أوقات الصلاة لموقعك: الفجر 5:30 صباحاً، الظهر 12:15 ظهراً، العصر 3:45 عصراً، المغرب 6:20 مساءً، العشاء 7:45 مساءً. يمكنك التحقق من الأوقات الدقيقة لموقعك.'
        : 'Prayer times for your location: Fajr 5:30 AM, Dhuhr 12:15 PM, Asr 3:45 PM, Maghrib 6:20 PM, Isha 7:45 PM. You can check the exact times for your location.';
    }
    
    // Qibla direction
    if (message.includes('qibla') || message.includes('direction')) {
      return language === 'ur'
        ? 'قبلہ کی سمت تلاش کرنے کے لیے: 1) کمپاس استعمال کریں 2) موبائل ایپ استعمال کریں 3) سورج کی سمت سے اندازہ لگائیں۔ مکہ مکرمہ کی سمت قبلہ ہے۔'
        : language === 'ar'
        ? 'للعثور على اتجاه القبلة: 1) استخدم البوصلة 2) استخدم تطبيق الهاتف المحمول 3) قدر الاتجاه من الشمس. اتجاه مكة المكرمة هو القبلة.'
        : 'To find Qibla direction: 1) Use a compass 2) Use a mobile app 3) Estimate from sun direction. The direction of Mecca is the Qibla.';
    }
    
    // Wudu steps
    if (message.includes('wudu') || message.includes('ablution')) {
      return language === 'ur'
        ? 'وضو کے مراحل: 1) نیت کریں 2) ہاتھ دھوئیں 3) منہ دھوئیں 4) ناک صاف کریں 5) چہرہ دھوئیں 6) بازو دھوئیں 7) سر کا مسح کریں 8) پاؤں دھوئیں۔'
        : language === 'ar'
        ? 'خطوات الوضوء: 1) النية 2) غسل اليدين 3) غسل الفم 4) تنظيف الأنف 5) غسل الوجه 6) غسل الذراعين 7) مسح الرأس 8) غسل القدمين.'
        : 'Wudu steps: 1) Make intention 2) Wash hands 3) Rinse mouth 4) Clean nose 5) Wash face 6) Wash arms 7) Wipe head 8) Wash feet.';
    }
    
    // Prayer mistakes
    if (message.includes('mistake') || message.includes('error')) {
      return language === 'ur'
        ? 'نماز میں عام غلطیاں: 1) جلدی میں نماز پڑھنا 2) غلط قبلہ کی طرف منہ کرنا 3) وضو نہ کرنا 4) غلط تلفظ 5) توجہ نہ دینا۔'
        : language === 'ar'
        ? 'الأخطاء الشائعة في الصلاة: 1) التسرع في الصلاة 2) التوجه لاتجاه خاطئ 3) عدم الوضوء 4) النطق الخاطئ 5) عدم التركيز.'
        : 'Common prayer mistakes: 1) Rushing through prayer 2) Facing wrong direction 3) Not performing wudu 4) Incorrect pronunciation 5) Lack of concentration.';
    }
    
    // Duas
    if (message.includes('dua') || message.includes('supplication')) {
      return language === 'ur'
        ? 'اہم دعائیں: "ربنا آتنا فی الدنیا حسنة و فی الآخرة حسنة و قنا عذاب النار" (اے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے اور ہمیں آگ کے عذاب سے بچا)'
        : language === 'ar'
        ? 'الدعوات المهمة: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار"'
        : 'Important duas: "Rabana atina fid dunya hasanatan wa fil akhirati hasanatan wa qina adhaban nar" (Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire)';
    }
    
    // Ramadan
    if (message.includes('ramadan') || message.includes('fasting')) {
      return language === 'ur'
        ? 'رمضان کی باتیں: 1) روزہ رکھنا 2) تراویح پڑھنا 3) قرآن پڑھنا 4) صدقہ دینا 5) افطار میں جلدی کرنا 6) سحری کھانا۔'
        : language === 'ar'
        ? 'أمور رمضان: 1) الصيام 2) صلاة التراويح 3) قراءة القرآن 4) إعطاء الصدقة 5) تعجيل الإفطار 6) تناول السحور.'
        : 'Ramadan practices: 1) Fasting 2) Taraweeh prayer 3) Reading Quran 4) Giving charity 5) Breaking fast early 6) Eating suhoor.';
    }
    
    // Hajj
    if (message.includes('hajj') || message.includes('pilgrimage')) {
      return language === 'ur'
        ? 'حج کے مراحل: 1) احرام باندھنا 2) طواف کرنا 3) سعی کرنا 4) عرفات میں رکنا 5) مزدلفہ میں رکنا 6) رمی کرنا 7) قربانی کرنا۔'
        : language === 'ar'
        ? 'مراحل الحج: 1) الإحرام 2) الطواف 3) السعي 4) الوقوف بعرفة 5) الوقوف بمزدلفة 6) رمي الجمرات 7) الذبح.'
        : 'Hajj steps: 1) Ihram 2) Tawaf 3) Sa\'i 4) Standing at Arafat 5) Standing at Muzdalifah 6) Stoning 7) Sacrifice.';
    }
    
    // Islamic calendar
    if (message.includes('calendar') || message.includes('hijri')) {
      return language === 'ur'
        ? 'اسلامی کیلنڈر: قمری کیلنڈر ہے جو چاند کے چکر پر مبنی ہے۔ 12 مہینے ہیں: محرم، صفر، ربیع الاول، ربیع الثانی، جمادی الاول، جمادی الثانی، رجب، شعبان، رمضان، شوال، ذی القعدہ، ذی الحجہ۔'
        : language === 'ar'
        ? 'التقويم الإسلامي: تقويم قمري يعتمد على دورة القمر. هناك 12 شهراً: محرم، صفر، ربيع الأول، ربيع الثاني، جمادى الأولى، جمادى الثانية، رجب، شعبان، رمضان، شوال، ذو القعدة، ذو الحجة.'
        : 'Islamic calendar: Lunar calendar based on moon cycles. 12 months: Muharram, Safar, Rabi\' al-awwal, Rabi\' al-thani, Jumada al-awwal, Jumada al-thani, Rajab, Sha\'ban, Ramadan, Shawwal, Dhu al-Qi\'dah, Dhu al-Hijjah.';
    }
    
    // Default response
    return language === 'ur'
      ? 'میں آپ کی مدد کرنے کے لیے یہاں ہوں۔ آپ نماز، اسلامی تعلیمات، دعائیں، یا کوئی بھی سوال پوچھ سکتے ہیں۔'
      : language === 'ar'
      ? 'أنا هنا لمساعدتك. يمكنك السؤال عن الصلاة، التعاليم الإسلامية، الأدعية، أو أي سؤال آخر.'
      : 'I\'m here to help you. You can ask about prayer, Islamic teachings, duas, or any other questions.';
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      language: selectedLanguage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText, selectedLanguage),
        isUser: false,
        timestamp: new Date(),
        language: selectedLanguage,
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: QuickAction) => {
    setInputText(action.prompt);
  };

  const filteredActions = selectedCategory === 'All' 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory);

  useEffect(() => {
    // Scroll to bottom when new message is added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="chatbubble-ellipses" size={28} color="#06b6d4" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.appName}>AI Assistant</Text>
            <Text style={styles.appSubtitle}>Your Islamic guide</Text>
          </View>
        </View>
        
        {/* Language Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.languageSelector}
        >
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                selectedLanguage === lang.code && styles.selectedLanguageButton
              ]}
              onPress={() => setSelectedLanguage(lang.code)}
              activeOpacity={0.8}
            >
              <Text style={styles.languageFlag}>{lang.flag}</Text>
              <Text style={[
                styles.languageText,
                selectedLanguage === lang.code && styles.selectedLanguageText
              ]}>
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.selectedCategoryButtonText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Action Buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsScroll}
        >
          {filteredActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
              onPress={() => handleQuickAction(action)}
              activeOpacity={0.8}
            >
              <Ionicons name={action.icon as any} size={24} color="#06b6d4" />
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.aiMessage
            ]}
          >
            <View style={[
              styles.messageBubble,
              message.isUser ? styles.userBubble : styles.aiBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText
              ]}>
                {message.text}
              </Text>
              <Text style={[
                styles.messageTime,
                message.isUser ? styles.userMessageTime : styles.aiMessageTime
              ]}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        ))}
        
        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything about Islam..."
            placeholderTextColor="#6b7280"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? "white" : "#6b7280"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  appName: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: 'white',
  },
  appSubtitle: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    marginTop: 2,
  },
  languageSelector: {
    marginTop: Spacing.sm,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: Spacing.sm,
  },
  selectedLanguageButton: {
    borderColor: '#06b6d4',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  languageFlag: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  languageText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    fontWeight: '600',
  },
  selectedLanguageText: {
    color: '#06b6d4',
  },
  quickActionsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.sm,
  },
  categoryFilter: {
    marginBottom: Spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: Spacing.sm,
  },
  selectedCategoryButton: {
    borderColor: '#06b6d4',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  categoryButtonText: {
    fontSize: FontSizes.xs,
    color: '#94a3b8',
    fontWeight: '600',
  },
  selectedCategoryButtonText: {
    color: '#06b6d4',
  },
  quickActionsScroll: {
    marginTop: Spacing.sm,
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 80,
  },
  quickActionText: {
    fontSize: FontSizes.xs,
    color: 'white',
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  messageContainer: {
    marginBottom: Spacing.md,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  userBubble: {
    backgroundColor: '#06b6d4',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: FontSizes.md,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: 'white',
  },
  messageTime: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiMessageTime: {
    color: '#94a3b8',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06b6d4',
    marginRight: Spacing.xs,
  },
  inputContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: 'white',
    maxHeight: 100,
    paddingHorizontal: Spacing.sm,
  },
  sendButton: {
    backgroundColor: '#06b6d4',
    borderRadius: BorderRadius.full,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
