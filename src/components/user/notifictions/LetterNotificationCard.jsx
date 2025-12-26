import { Dimensions, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
// Template styles for each templateId
const templateStyles = {
  '1': { backgroundColor: '#fffaf5', borderColor: '#ffb6b9', borderWidth: 3 }, // Romantic Pink
  '2': { backgroundColor: '#fff0f5', borderColor: '#e75480', borderWidth: 3 }, // Rose Love
  '3': { backgroundColor: '#f0fff0', borderColor: '#a3d8f4', borderWidth: 3 }, // Cute Couple
  '4': { backgroundColor: '#f5f5dc', borderColor: '#deb887', borderWidth: 3 }, // Classic Letter
};

export default function LetterNotificationCard({ izhaarObj, senderName, rejected, handleAccept, handleReject, styles }) {
  const templateId = izhaarObj.template_id;
  const paperStyle = templateStyles[templateId] || templateStyles['1'];
  const { width, height } = Dimensions.get('window');
  // Show 'Izhaar User' if senderName is 'Unknown'
  const displaySender = senderName === 'Unknown' ? 'Izhaar User' : senderName;
  return (
    <View style={letterStyles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', minHeight: height }}
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[letterStyles.paper, paperStyle, { maxWidth: width - 24, minWidth: 0 }]}> 
          <Text style={letterStyles.header}>You've received a Letter Izhaar!</Text>
          <Text style={letterStyles.subHeader}>From: <Text style={letterStyles.sender}>{displaySender}</Text></Text>
          <Text style={letterStyles.code}>Code: {izhaarObj.izhaar_code || izhaarObj.code || 'N/A'}</Text>
          <Text style={letterStyles.message}>{izhaarObj.text || izhaarObj.message || 'No message.'}</Text>
          {/* Show templateId for clarity */}
          {rejected ? (
            <Text style={letterStyles.rejectedText}>Rejected successfully</Text>
          ) : (
            <View style={letterStyles.btnRow}>
              <Text style={letterStyles.instruction}>Do you accept this heartfelt letter?</Text>
              <View style={letterStyles.btnGroup}>
                <Text style={letterStyles.acceptBtn} onPress={handleAccept}>queries to know</Text>
                <Text style={letterStyles.rejectBtn} onPress={handleReject}>Not Interested</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const letterStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffaf5',
    paddingHorizontal: 8,
    paddingVertical: 16,
    width: '100%',
  },
  paper: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 24,
    paddingHorizontal: 16,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#ffb6b9',
    position: 'relative',
  },
  heart: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4d6d',
    marginBottom: 8,
    textAlign: 'left',
  },
  subHeader: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
    textAlign: 'left',
  },
  sender: {
    fontWeight: 'bold',
    color: '#e75480',
  },
  code: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
    textAlign: 'right',
  },
  message: {
    fontSize: 20,
    lineHeight: 32,
    color: '#2b2b2b',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.3,
    textAlign: 'left',
    marginBottom: 18,
  },
  btnRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 15,
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
  },
  btnGroup: {
    flexDirection: 'column',
    gap: 24,
    justifyContent: 'center',
  },
  acceptBtn: {
    backgroundColor: '#ff4d6d',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16,
    overflow: 'hidden',
  },
  rejectBtn: {
    backgroundColor: '#f44336',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16,
    overflow: 'hidden',
  },
  rejectedText: {
    color: '#f44336',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 18,
    textAlign: 'center',
  },
});
