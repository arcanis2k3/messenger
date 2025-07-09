import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Z Messagez</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // You can change the background color
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    // We will add the golden color for the 'Z' later when we have the logo
    color: '#000',
  },
});

export default SplashScreen;