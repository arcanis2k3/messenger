import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <View style={styles.iconContainer}>
        {/* Added navigation to Messages screen */}
        <Pressable onPress={() => {
          useNavigation<StackNavigationProp<any>>().navigate('Messages');}}>
          <Ionicons name="chatbox-outline" size={48} color="black" />
        </Pressable>
        <Pressable onPress={() => console.log('Phone book icon pressed')}>
          <Ionicons name="book-outline" size={48} color="black" />
        </Pressable>
        <Pressable onPress={() => console.log('Settings icon pressed')}>
          <Ionicons name="settings-outline" size={48} color="black" />
        </Pressable>
      </View>
    </ParallaxScrollView>
  );

}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    paddingBottom: 20, // Adjust padding as needed
  },
});
