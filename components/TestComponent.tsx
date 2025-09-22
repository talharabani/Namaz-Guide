import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FloatingCard, GlassCard, GradientCard } from './BeautifulCards';

export default function TestComponent() {
  return (
    <View style={styles.container}>
      <GlassCard style={styles.card}>
        <Text style={styles.text}>Glass Card Test</Text>
      </GlassCard>
      
      <GradientCard 
        gradient={['#10b981', '#059669']} 
        style={styles.card}
      >
        <Text style={styles.text}>Gradient Card Test</Text>
      </GradientCard>
      
      <FloatingCard style={styles.card}>
        <Text style={styles.text}>Floating Card Test</Text>
      </FloatingCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0f172a',
  },
  card: {
    marginVertical: 10,
    width: '100%',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});
