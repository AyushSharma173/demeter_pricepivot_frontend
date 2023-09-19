import React from "react";
import { Text, TouchableOpacity, View, Modal, Linking, Platform } from "react-native";
import StyleSheetRW from "core/StyleSheetRW";
import colors from "res/colors";
import { fs, rh, rw } from "core/designHelpers";

interface NewVersionModalProps {
    visible: boolean;
    closeModal: () => void;
    isUpdateCompulsory: boolean;
}

const NewVersionModal = ({ visible, closeModal, isUpdateCompulsory }: NewVersionModalProps) => {

    const updateText = isUpdateCompulsory ?
        'This version of app is no longer supported. Please update to continue using app.' :
        'A new version of app is available.'

    const updateApp = () => {
        if(Platform.OS === 'ios') {
            Linking.openURL('https://apps.apple.com/us/app/game-on-app-llc/id6443446110');
        }
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={closeModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        New Version Update
                    </Text>
                    <Text style={styles.modalText}>
                        {updateText}
                    </Text>
                    <View style={styles.modalButtonsContainer}>
                        <TouchableOpacity onPress={() => updateApp()} style={[styles.modalButton, styles.updateButton]}>
                            <Text style={[styles.modalButtonText, styles.updateButtonText]}>Update</Text>
                        </TouchableOpacity>
                        {!isUpdateCompulsory && <TouchableOpacity onPress={closeModal} style={[styles.modalButton, styles.closeButton]}>
                            <Text style={[styles.modalButtonText, styles.closeButtonText]}>Cancel</Text>
                        </TouchableOpacity>}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default NewVersionModal;

const styles = StyleSheetRW.create(() => ({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: rw(20),
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: fs(18),
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        marginBottom: rh(12),
        textAlign: 'center',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    modalButton: {
        borderRadius: 5,
        padding: rw(10),
        marginTop: rh(10),
        marginLeft: rw(5),
        marginRight: rw(5),
        width: '45%',
    },
    updateButton: {
        backgroundColor: `${colors.lightGreen}`,
    },
    closeButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: `${colors.lightGreen}`,
    },
    modalButtonText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    updateButtonText: {
        color: '#fff',
    },
    closeButtonText: {
        color: `${colors.lightGreen}`,
    },
}));