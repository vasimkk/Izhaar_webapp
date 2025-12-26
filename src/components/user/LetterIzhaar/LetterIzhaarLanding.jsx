import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Alert, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RECEIVER_FORM_LETTER } from '../../config/routes';
import api from "../../utils/api";
export default function LetterIzhaarLanding(props) {
  const router = useRouter();
  const navigation = props.navigation || useNavigation();
  const { height } = Dimensions.get('window');
  return (
    <View style={styles.root}>
      {/* Back button */}
      <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>{'<'}</Text>
      </Pressable>
      {/* Top half with gradient background */}
      <LinearGradient
        colors={["#FF4242", "#000000"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.topHalf, { height: height * 0.5, justifyContent: 'center', alignItems: 'center' }]}
      >
        <Image
          source={require('../../../assets/images/letter-izhaar-img/image.png')}
          style={{ width: 350, height: 350, marginBottom: 20, resizeMode: 'contain' }}
        />
        <Text style={styles.desc}>
          Izhaar turns your feelings into beautiful, heartfelt letters—instantly and effortlessly.
        </Text>
      </LinearGradient>
      {/* Bottom half with black background */}
      <View style={[styles.bottomHalf, { minHeight: height * 0.5 }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
         
          <View style={styles.rulesBox}>
            <Text style={styles.rules}>
              1. By submitting a letter, you confirm the content belongs to you and does not violate any laws.{"\n"}
              2. Once a letter is submitted, it cannot be edited or cancelled.{"\n"}
              3. Delivery timelines may vary based on location and availability.{"\n"}
              4. Izhaar is not responsible for the receiver's reaction or response.{"\n"}
              5. Fees paid for the Letter service are final and non-refundable.{"\n"}
            </Text>
          </View>
        </ScrollView>
        <Pressable
          style={styles.btn}
          onPress={async () => {
            console.log("Generate button pressed");
            try {
              console.log("Calling /auth/user/status API...");
              const profileRes = await api.get("/auth/user/status");
              console.log("API response:", profileRes.data);
              if (profileRes.data && profileRes.data.is_active === 0) {
                Alert.alert("Inactive", "This feature is for Izhaar members only. Your account is not active.");
                console.log("User is not active");
                return;
              }
              console.log("User is active, navigating...");
              router.replace(RECEIVER_FORM_LETTER);
            } catch (err) {
              console.log("API error:", err);
              Alert.alert("Error", "Could not check user status.");
            }
          }}
        >
          <Text style={styles.btnText}>Generate</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  topHalf: {
    width: '100%',
    overflow: 'hidden',
  },
  // bgImg and bgImgInner removed
  topOverlay: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 18,
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
  bottomHalf: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 18,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 80,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    letterSpacing: 1.1,
    marginTop: 10,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  desc: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 18,
    marginTop:-10,
    paddingTop:2,
    textShadowColor: 'rgba(0,0,0,0.18)', 
  },
  rulesBox: {
    marginHorizontal: 24,
    padding: 18,
    marginBottom: 24,
    width: '90%',
    alignSelf: 'center',
    elevation: 2,
  },
  rules: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 22,
  },
  btn: {
    backgroundColor: '#ff3a76',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 2,
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
    marginBottom:30
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1.1,
  },
  backBtn: {
    position: 'absolute',
    top: 36,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:15
  },
  backBtnText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
}); 