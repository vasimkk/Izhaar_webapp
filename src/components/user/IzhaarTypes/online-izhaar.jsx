import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RECEIVER_FORM_TEXT, Letter_IZHAAR ,RECEIVER_FORM} from '../../config/routes';
const izhaarTypes = [
    {
        label: 'IZHAAR With Letter',
        color: ['#ffb6b9', '#fae3d9'],
        icon: '✉️',
        target: Letter_IZHAAR, // set to route or null for coming soon
    },
    // {
    //     label: 'IZHAAR With Song',
    //     color: ['#d4a5ff', '#f3e7ff'],
    //     icon: '🎵',
    //     target: RECEIVER_FORM,
    // },
    // {
    //     label: 'IZHAAR With Video',
    //     color: ['#a5d8ff', '#e3f6ff'],
    //     icon: '🎥',
    //     target: RECEIVER_FORM,
    // },
    {
        label: ' Simple IZHAAR  ',
        color: ['#ffe066', '#fffbe6'],
        icon: '🗓️',
        target: RECEIVER_FORM_TEXT,
    },
];


export default function OnlineIzhaar() {
    const router = useRouter();
    const handlePress = (target, label) => {
        if (target) {
            router.push(target);
        } else {
            Alert.alert('Coming Soon', `${label} is coming soon!`);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Confession</Text>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {izhaarTypes.map((item, idx) => (
                    <View
                        key={item.label}
                        style={[
                            styles.card,
                            { backgroundColor: item.color[0], borderColor: item.color[1] },
                        ]}
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.icon}>{item.icon}</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardLabel}>{item.label}</Text>
                                <Pressable
                                    style={styles.targetBtn}
                                    onPress={() => handlePress(item.target, item.label)}
                                >
                                    <Text style={styles.targetBtnText}>
                                        {item.target ? 'Start Now' : 'Coming Soon'}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 60,
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        alignSelf: 'center',
        color: '#333',
    },
    scrollContent: {
        paddingBottom: 24,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 18,
        borderWidth: 1,
        marginBottom: 20,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        fontSize: 38,
        marginRight: 18,
    },
    cardLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    targetBtn: {
        marginTop: 2,
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 14,
        marginBottom: 2,
    },
    targetBtnText: {
        fontSize: 14,
        color: '#888',
        fontWeight: 'bold',
    },
});



