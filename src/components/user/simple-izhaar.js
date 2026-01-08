import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import api from '../utils/api';

const SimpleIzhaar = () => {
	const router = useRouter();
	const params = useLocalSearchParams();
	const [loading, setLoading] = useState(false);
	let parsedData = null;
	try {
		parsedData = params.data ? JSON.parse(params.data) : null;
	} catch (e) {
		parsedData = null;
	}

	// Only show message input and submit directly on Next
	const [message, setMessage] = useState('');
	const handleNext = async () => {
		setLoading(true);
		try {
			// Build payload with all required fields for backend
			let payload = { message };
			if (parsedData && parsedData.izhaar_code && parsedData.receiver) {
				payload = {
					izhaar_code: parsedData.izhaar_code,
					message,
					receiver: parsedData.receiver,
					sender_id: parsedData.sender_id || null,
					type: parsedData.type || 'simple',
				};
			}
			// Validate required fields
			if (!payload.izhaar_code || !payload.receiver || !payload.type || (!payload.message)) {
				Alert.alert('Error', 'Missing required fields.');
				setLoading(false);
				return;
			}
			console.log('Submitting payload:', payload);
			const res = await api.post('/izhaar/submit', payload);
			Alert.alert('Success', 'Izhaar submitted successfully!');
			router.replace('/user/dashboard');
		} catch (error) {
			Alert.alert('Error', error.response?.data?.message || error.message || 'Failed to submit.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Write your Izhaar message</Text>
			<TextInput
				style={styles.input}
				placeholder="Type your message here..."
				value={message}
				onChangeText={setMessage}
				multiline
			/>
			<Pressable
				style={[styles.button, (!message || loading) && styles.buttonDisabled]}
				onPress={handleNext}
				disabled={!message || loading}
			>
				<Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Next'}</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		padding: 24,
	},
	text: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 18,
	},
	input: {
		width: '100%',
		minHeight: 80,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 10,
		padding: 12,
		fontSize: 16,
		marginBottom: 20,
		backgroundColor: '#fafafa',
		textAlignVertical: 'top',
	},
	button: {
		backgroundColor: '#ffb6b9',
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 8,
		alignItems: 'center',
	},
	buttonDisabled: {
		backgroundColor: '#eee',
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
	},
});

export default SimpleIzhaar;
