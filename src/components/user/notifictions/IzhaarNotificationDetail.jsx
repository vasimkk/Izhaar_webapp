import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import api from '../../utils/api';
import LetterNotificationCard from './LetterNotificationCard';
import { CHAT_INTERFACE } from '../../config/routes';
export default function IzhaarNotificationDetail() {

  const router = useRouter();
  const { izhaar } = useLocalSearchParams();
  const [rejected, setRejected] = useState(false);
  let izhaarObj = {};
  try {
    izhaarObj = izhaar ? JSON.parse(izhaar) : {};
    console.log('IzhaarNotificationDetail - izhaarObj:', izhaarObj);
  } catch (e) {}

  const senderName = izhaarObj.sender_name === 0 || izhaarObj.sender_name === '0' ? 'Izhaar User' : izhaarObj.sender_name || 'Unknown';

  const handleAccept = async () => {
    try {
      const res = await api.patch(`/izhaar/accept/${izhaarObj.izhaar_code || izhaarObj.code}`);
      console.log('Accept response:', res.data);
      router.replace(CHAT_INTERFACE);
      alert('Accepted!');
    } catch (e) {
      alert('Failed to accept.');
    }
  };

  const handleReject = async () => {
    try {
      await api.patch(`/izhaar/reject/${izhaarObj.izhaar_code || izhaarObj.code}`);
      setRejected(true);
    } catch (e) {
      alert('Failed to reject.');
    }
  };

  const isLetterType = izhaarObj.type === "LETTER";

  return (
    <View style={styles.container}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>{'<'}</Text>
      </Pressable>
      {isLetterType ? (
        <LetterNotificationCard
          izhaarObj={izhaarObj}
          senderName={senderName}
          rejected={rejected}
          handleAccept={handleAccept}
          handleReject={handleReject}
        />
      ) : (
        <View style={styles.card}>
          <Text style={styles.header}>Izhaar Details</Text>
          <View style={styles.row}><Text style={styles.label}>Izhaar Code:</Text><Text style={styles.value}>{izhaarObj.izhaar_code || izhaarObj.code || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Sender:</Text><Text style={styles.value}>{senderName}</Text></View>
          {(izhaarObj.text || izhaarObj.message) ? (
            <View style={styles.row}>
              <Text style={styles.label}>Message:</Text>
              <Text style={[styles.value, styles.messageValue]}>{izhaarObj.text || izhaarObj.message}</Text>
            </View>
          ) : null}
          {rejected ? (
            <Text style={styles.rejectedText}>Rejected successfully</Text>
          ) : (
            <View style={styles.btnRow}>
              <Pressable style={[styles.btn, styles.accept]} onPress={handleAccept}>
                <Text style={styles.btnText}>Accept</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.reject]} onPress={handleReject}>
                <Text style={styles.btnText}>Reject</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff4f7',
    borderRadius: 18,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff3a76',
    marginBottom: 18,
  },
  row: {
    width: '100%',
    marginBottom: 12,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 15,
    color: '#888',
    marginBottom: 2,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  messageValue: {
    fontWeight: '400',
    color: '#444',
    fontSize: 16,
    marginTop: 2,
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 28,
    gap: 20,
    alignSelf: 'center',
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  accept: {
    backgroundColor: '#4caf50',
  },
  reject: {
    backgroundColor: '#f44336',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  },
  backBtnText: {
    color: '#ff3a76',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  rejectedText: {
    color: '#f44336',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 28,
    alignSelf: 'center',
  },
});
