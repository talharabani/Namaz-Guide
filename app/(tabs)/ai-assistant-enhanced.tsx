import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import AppHeader from '../../components/navigation/AppHeader';
import Card, { CardContent } from '../../components/ui/Card';
import IslamicText from '../../components/ui/IslamicText';
import { BorderRadius, FeatureColors, Shadows, Spacing } from '../../constants/DesignSystem';
import { useTheme } from '../../contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'prayer' | 'dua' | 'hadith' | 'quran';
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradient: string[];
  prompt: string;
}

interface AIResponse {
  text: string;
  type: 'text' | 'prayer' | 'dua' | 'hadith' | 'quran';
  references?: string[];
  arabic?: string;
  translation?: string;
}

export default function EnhancedAIAssistantScreen() {
  const { colors, isDark } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  useEffect(() => {
    // Initialize animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 20, stiffness: 100 });

    // Add welcome message
    addMessage({
      id: '1',
      text: 'Assalamu Alaikum! I\'m your Islamic AI Assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
      type: 'text',
    });
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const simulateAIResponse = async (userMessage: string): Promise<AIResponse> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerMessage = userMessage.toLowerCase();

    // Prayer-related responses
    if (lowerMessage.includes('prayer') || lowerMessage.includes('namaz') || lowerMessage.includes('salah')) {
      return {
        text: 'Prayer is one of the five pillars of Islam. Here\'s a beautiful hadith about prayer:',
        type: 'hadith',
        arabic: 'الصَّلَاةُ نُورٌ',
        translation: 'Prayer is light',
        references: ['Sahih Muslim'],
      };
    }

    // Dua-related responses
    if (lowerMessage.includes('dua') || lowerMessage.includes('supplication')) {
      return {
        text: 'Duas are powerful supplications to Allah. Here\'s a beautiful dua:',
        type: 'dua',
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire',
        references: ['Quran 2:201'],
      };
    }

    // Quran-related responses
    if (lowerMessage.includes('quran') || lowerMessage.includes('verse') || lowerMessage.includes('ayat')) {
      return {
        text: 'The Quran is the word of Allah. Here\'s a beautiful verse:',
        type: 'quran',
        arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
        translation: 'And whoever fears Allah - He will make for him a way out',
        references: ['Quran 65:2'],
      };
    }

    // General Islamic responses
    if (lowerMessage.includes('islam') || lowerMessage.includes('muslim') || lowerMessage.includes('faith')) {
      return {
        text: 'Islam is a complete way of life. The Prophet Muhammad (peace be upon him) said:',
        type: 'hadith',
        arabic: 'بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ',
        translation: 'Islam is built upon five pillars',
        references: ['Sahih Bukhari'],
      };
    }

    // Default response
    return {
      text: 'I\'m here to help you with Islamic knowledge. You can ask me about prayers, duas, Quran, hadith, or any Islamic topic. What would you like to know?',
      type: 'text',
    };
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      type: 'text',
    };

    addMessage(userMessage);
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await simulateAIResponse(inputText);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        isUser: false,
        timestamp: new Date(),
        type: aiResponse.type,
      };

      addMessage(aiMessage);
    } catch (error) {
      console.error('Error getting AI response:', error);
      addMessage({
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action: QuickAction) => {
    setInputText(action.prompt);
    await sendMessage();
  };

  // Quick actions
  const quickActions: QuickAction[] = [
    {
      id: 'prayer',
      title: 'Prayer Times',
      description: 'Get current prayer times',
      icon: 'time-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.prayer,
      gradient: ['#10b981', '#059669'],
      prompt: 'What are the prayer times for today?',
    },
    {
      id: 'dua',
      title: 'Daily Dua',
      description: 'Get a beautiful dua',
      icon: 'heart-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.duas,
      gradient: ['#f59e0b', '#d97706'],
      prompt: 'Give me a beautiful dua for today',
    },
    {
      id: 'quran',
      title: 'Quran Verse',
      description: 'Get an inspiring verse',
      icon: 'book-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.quiz,
      gradient: ['#8b5cf6', '#7c3aed'],
      prompt: 'Share an inspiring Quran verse',
    },
    {
      id: 'hadith',
      title: 'Hadith',
      description: 'Get a prophetic saying',
      icon: 'library-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.learn,
      gradient: ['#22c55e', '#16a34a'],
      prompt: 'Share a beautiful hadith',
    },
    {
      id: 'qibla',
      title: 'Qibla Direction',
      description: 'Find Qibla direction',
      icon: 'compass-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.qibla,
      gradient: ['#06b6d4', '#0891b2'],
      prompt: 'How do I find the Qibla direction?',
    },
    {
      id: 'ramadan',
      title: 'Ramadan',
      description: 'Ramadan information',
      icon: 'moon-outline' as keyof typeof Ionicons.glyphMap,
      color: '#ec4899',
      gradient: ['#ec4899', '#db2777'],
      prompt: 'Tell me about Ramadan',
    },
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const renderMessage = (message: ChatMessage, index: number) => (
    <Animated.View
      key={message.id}
      entering={FadeInUp.delay(index * 100)}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Card
        style={[
          styles.messageCard,
          message.isUser ? styles.userMessageCard : styles.aiMessageCard,
        ]}
      >
        <CardContent>
          <View style={styles.messageHeader}>
            <View style={styles.messageAvatar}>
              <Ionicons
                name={message.isUser ? 'person' : 'sparkles'}
                size={20}
                color={message.isUser ? 'white' : '#10b981'}
              />
            </View>
            <IslamicText variant="caption" style={styles.messageTime}>
              {message.timestamp.toLocaleTimeString()}
            </IslamicText>
          </View>
          
          <IslamicText variant="body" style={styles.messageText}>
            {message.text}
          </IslamicText>

          {message.type === 'hadith' && (
            <View style={styles.specialContent}>
              <IslamicText variant="arabic" style={styles.arabicText}>
                {message.text}
              </IslamicText>
              <IslamicText variant="translation" style={styles.translationText}>
                {message.text}
              </IslamicText>
            </View>
          )}

          {message.type === 'dua' && (
            <View style={styles.specialContent}>
              <IslamicText variant="arabic" style={styles.arabicText}>
                {message.text}
              </IslamicText>
              <IslamicText variant="translation" style={styles.translationText}>
                {message.text}
              </IslamicText>
            </View>
          )}

          {message.type === 'quran' && (
            <View style={styles.specialContent}>
              <IslamicText variant="arabic" style={styles.arabicText}>
                {message.text}
              </IslamicText>
              <IslamicText variant="translation" style={styles.translationText}>
                {message.text}
              </IslamicText>
            </View>
          )}
        </CardContent>
      </Card>
    </Animated.View>
  );

  const renderQuickAction = (action: QuickAction, index: number) => (
    <Animated.View
      key={action.id}
      entering={FadeInDown.delay(400 + index * 100)}
      style={styles.quickActionItem}
    >
      <TouchableOpacity
        onPress={() => handleQuickAction(action)}
        style={styles.quickActionButton}
      >
        <Card variant="gradient" gradient={action.gradient} style={styles.quickActionCard}>
          <CardContent>
            <View style={styles.quickActionContent}>
              <View style={styles.quickActionIcon}>
                <Ionicons name={action.icon} size={24} color="white" />
              </View>
              <View style={styles.quickActionInfo}>
                <IslamicText variant="body" style={styles.quickActionTitle}>
                  {action.title}
                </IslamicText>
                <IslamicText variant="caption" style={styles.quickActionDescription}>
                  {action.description}
                </IslamicText>
              </View>
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <AppHeader
        title="AI Assistant"
        subtitle="Your Islamic companion"
        variant="gradient"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Quick Actions */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.quickActionsContainer}>
            <IslamicText variant="subtitle" style={styles.sectionTitle}>
              Quick Actions
            </IslamicText>
            <View style={styles.quickActionsGrid}>
              {quickActions.map(renderQuickAction)}
            </View>
          </Animated.View>

          {/* Chat Messages */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.chatContainer}>
            <IslamicText variant="subtitle" style={styles.sectionTitle}>
              Chat
            </IslamicText>
            <View style={styles.messagesContainer}>
              {messages.map(renderMessage)}
              {isTyping && (
                <Animated.View entering={FadeInUp} style={styles.typingContainer}>
                  <Card style={styles.typingCard}>
                    <CardContent>
                      <View style={styles.typingContent}>
                        <View style={styles.typingAvatar}>
                          <Ionicons name="sparkles" size={20} color="#10b981" />
                        </View>
                        <IslamicText variant="body" style={styles.typingText}>
                          AI is typing...
                        </IslamicText>
                      </View>
                    </CardContent>
                  </Card>
                </Animated.View>
              )}
            </View>
          </Animated.View>

          {/* Input Area */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.inputContainer}>
            <Card style={styles.inputCard}>
              <CardContent>
                <View style={styles.inputContent}>
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    placeholder="Ask me anything about Islam..."
                    placeholderTextColor={colors.textSecondary}
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    maxLength={500}
                  />
                  <TouchableOpacity
                    onPress={sendMessage}
                    style={[
                      styles.sendButton,
                      {
                        backgroundColor: inputText.trim() ? colors.primary : colors.border,
                      },
                    ]}
                    disabled={!inputText.trim()}
                  >
                    <Ionicons
                      name="send"
                      size={20}
                      color={inputText.trim() ? 'white' : colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing[4],
  },
  quickActionsContainer: {
    marginBottom: Spacing[6],
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: (screenWidth - Spacing[4] * 2 - Spacing[3]) / 2,
    marginBottom: Spacing[3],
  },
  quickActionButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  quickActionCard: {
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  quickActionInfo: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    marginBottom: Spacing[1],
  },
  quickActionDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chatContainer: {
    marginBottom: Spacing[6],
  },
  messagesContainer: {
    gap: Spacing[3],
  },
  messageContainer: {
    marginBottom: Spacing[2],
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  userMessageCard: {
    backgroundColor: '#10b981',
  },
  aiMessageCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[2],
  },
  messageTime: {
    fontSize: 10,
    opacity: 0.7,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  specialContent: {
    marginTop: Spacing[3],
    padding: Spacing[3],
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: BorderRadius.lg,
  },
  arabicText: {
    fontSize: 18,
    textAlign: 'right',
    lineHeight: 28,
    marginBottom: Spacing[2],
  },
  translationText: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  typingContainer: {
    alignItems: 'flex-start',
  },
  typingCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  typingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[2],
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: Spacing[6],
  },
  inputCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing[3],
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    maxHeight: 100,
    paddingVertical: Spacing[3],
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacing: {
    height: Spacing[20],
  },
});
