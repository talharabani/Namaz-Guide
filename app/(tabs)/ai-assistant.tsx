import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Clipboard,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { aiService, testAIConnection } from '../../services/aiService';

const { width } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language?: string;
  isError?: boolean;
  isRetrying?: boolean;
}

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
      text: 'Assalamu Alaikum! I am your Islamic AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
      language: 'en',
    },
    {
      id: '2',
      text: 'What are the five pillars of Islam?',
      isUser: true,
      timestamp: new Date(),
      language: 'en',
    },
    {
      id: '3',
      text: 'The five pillars of Islam are:\n\n1. Shahada (Declaration of Faith)\n2. Salah (Prayer)\n3. Zakat (Charity)\n4. Sawm (Fasting during Ramadan)\n5. Hajj (Pilgrimage to Mecca)\n\nThese pillars form the foundation of Islamic practice and belief.',
      isUser: false,
      timestamp: new Date(),
      language: 'en',
    },
    {
      id: '4',
      text: 'Can you tell me about prayer times?',
      isUser: true,
      timestamp: new Date(),
      language: 'en',
    },
    {
      id: '5',
      text: 'Muslims pray five times a day:\n\n• Fajr (Dawn prayer)\n• Dhuhr (Midday prayer)\n• Asr (Afternoon prayer)\n• Maghrib (Sunset prayer)\n• Isha (Night prayer)\n\nEach prayer has specific times based on the sun\'s position.',
      isUser: false,
      timestamp: new Date(),
      language: 'en',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [quotaStatus, setQuotaStatus] = useState<{used: number, remaining: number, resetTime?: Date} | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const generateAIResponse = async (userInput: string, language: string): Promise<string> => {
    try {
      const response = await aiService.generateResponse(userInput, language);
      return response.text;
    } catch (error) {
      console.error('AI Response Error:', error);
      return language === 'ur'
        ? 'AI مصروف ہے، براہ کرم دوبارہ کوشش کریں۔'
        : language === 'ar'
        ? 'الذكاء الاصطناعي مشغول، يرجى المحاولة مرة أخرى.'
        : 'AI is busy, try again';
    }
  };

  const sendMessage = async (retryMessageId?: string) => {
    if (!inputText.trim() && !retryMessageId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      language: selectedLanguage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    const currentInput = inputText;
    const typingMessageId = (Date.now() + 1).toString();
    const typingMessage: ChatMessage = {
      id: typingMessageId,
      text: 'AI is thinking...',
      isUser: false,
      timestamp: new Date(),
      language: selectedLanguage,
    };
    setMessages(prev => [...prev, typingMessage]);

    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(typingAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    try {
      const aiResponseText = await generateAIResponse(currentInput, selectedLanguage);
      
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => msg.id !== typingMessageId);
        const aiResponse: ChatMessage = {
          id: (Date.now() + 2).toString(),
          text: aiResponseText,
          isUser: false,
          timestamp: new Date(),
          language: selectedLanguage,
        };
        return [...filteredMessages, aiResponse];
      });

      await loadQuotaStatus();
    } catch (error) {
      console.error('❌ Error getting AI response:', error);
      
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => msg.id !== typingMessageId);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          text: selectedLanguage === 'ur'
            ? 'AI مصروف ہے، براہ کرم دوبارہ کوشش کریں۔'
            : selectedLanguage === 'ar'
            ? 'الذكاء الاصطناعي مشغول، يرجى المحاولة مرة أخرى.'
            : 'AI is busy, try again',
          isUser: false,
          timestamp: new Date(),
          language: selectedLanguage,
          isError: true,
        };
        return [...filteredMessages, errorMessage];
      });
    } finally {
      setIsTyping(false);
      setIsLoading(false);
      typingAnimation.stopAnimation();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      Clipboard.setString(text);
      Alert.alert('Copied', 'Message copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const retryMessage = (messageId: string) => {
    sendMessage(messageId);
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setMessages([]) }
      ]
    );
  };

  const testAPIConnection = async () => {
    try {
      console.log('🔍 Testing API Connection...');
      
      const isWorking = await testAIConnection();
      
      if (isWorking) {
        Alert.alert('✅ Success', 'API connection is working perfectly!');
      } else {
        Alert.alert('❌ Error', 'API connection failed. Please check your configuration.');
      }
    } catch (error) {
      console.error('API Test Error:', error);
      Alert.alert('❌ Error', 'Failed to test API connection.');
    }
  };

  const loadQuotaStatus = async () => {
    try {
      // This would typically load from your API
      setQuotaStatus({ used: 5, remaining: 15, resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000) });
    } catch (error) {
      console.error('Error loading quota status:', error);
    }
  };

  useEffect(() => {
    loadQuotaStatus();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      {!item.isUser && (
        <View style={styles.aiAvatar}>
          <Text style={styles.aiAvatarEmoji}>🤖</Text>
        </View>
      )}
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble,
        item.isError && styles.errorBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userMessageText : styles.aiMessageText,
          item.isError && styles.errorText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          item.isUser ? styles.userMessageTime : styles.aiMessageTime
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.appName}>AI Assistant 🤖</Text>
            {quotaStatus && (
              <View style={styles.quotaBadge}>
                <Ionicons name="flash" size={12} color="#10b981" />
                <Text style={styles.quotaBadgeText}>{quotaStatus.remaining}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearChat}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
        
        {/* Language Selector */}
        <View style={styles.languageSelector}>
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
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      />

      {/* Message Input Field */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#6b7280"
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={() => inputText.trim() && sendMessage()}
              blurOnSubmit={false}
            />
            <View style={styles.inputActions}>
              <TouchableOpacity
                style={styles.micButton}
                onPress={() => {/* Handle mic functionality */}}
                activeOpacity={0.7}
              >
                <Ionicons name="mic-outline" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={() => sendMessage()}
                disabled={!inputText.trim() || isLoading}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={isLoading ? "hourglass-outline" : "arrow-forward"} 
                  size={20} 
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#0D1117',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 12,
  },
  quotaBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  quotaBadgeText: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '700',
    marginLeft: 4,
  },
  clearButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  languageSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedLanguageButton: {
    borderColor: '#06b6d4',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  languageText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  selectedLanguageText: {
    color: '#06b6d4',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  chatContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 120,
  },
  messageContainer: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  aiAvatarEmoji: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 2,
  },
  userBubble: {
    backgroundColor: '#16A34A',
    borderBottomRightRadius: 4,
    marginLeft: 8,
  },
  aiBubble: {
    backgroundColor: '#1E2633',
    borderBottomLeftRadius: 4,
    marginRight: 8,
  },
  errorBubble: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: 'white',
    marginBottom: 4,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: 'white',
  },
  errorText: {
    color: '#ef4444',
  },
  messageTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'right',
  },
  userMessageTime: {
    textAlign: 'right',
  },
  aiMessageTime: {
    textAlign: 'left',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#0D1117',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#1E2633',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    maxHeight: 100,
    paddingHorizontal: 12,
    lineHeight: 20,
    fontWeight: '400',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 8,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#16A34A',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#6b7280',
    shadowColor: '#6b7280',
  },
});