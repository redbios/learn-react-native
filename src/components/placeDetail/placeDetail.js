import React from "react";
import { Modal, View, Text, Button, Image, StyleSheet } from "react-native";

const placeDetail = props => {
  let modalContent = null;

  if (props.placeDetail) {
    modalContent = (
      <View>
        <Image source={props.placeDetail.image} style={styles.placeImage} />
        <Text style={styles.placeName}>{props.placeDetail.name}</Text>
      </View>
    );
  }
  return (
    <Modal
      visible={props.placeDetail !== null}
      animationType="slide"
      onRequestClose={props.onModalClosed}
    >
      <View style={styles.modalContainer}>
        {modalContent}
        <View>
          <Button title="Delete" color="red" onPress={props.onItemDeleted} />
          <Button title="Close" onPress={props.onModalClosed} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 22
  },
  placeImage: {
    width: "100%",
    height: 200
  },
  placeName: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28
  }
});

export default placeDetail;
