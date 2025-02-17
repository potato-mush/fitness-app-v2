import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";

const Store = ({ coins, setCoins, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [slideAnim] = useState(new Animated.Value(-300)); // Start with off-screen position
  const [hoveredFood, setHoveredFood] = useState(null); // For hover effect on mobile

  const foodImages = {
    energyDrink: require("../assets/avatar/energy-drink.png"),
    apple: require("../assets/avatar/apple.png"),
    friedEgg: require("../assets/avatar/fried-egg.png"),
    chickenLeg: require("../assets/avatar/chicken-leg.png"),
  };

  const prices = {
    energyDrink: 150,
    apple: 20,
    friedEgg: 45,
    chickenLeg: 100,
  };

  // Animate the store panel in from the left
  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePurchase = (item) => {
    const price = prices[item];
    if (coins >= price) {
      setCoins(coins - price);
      setModalMessage(`Successfully added ${item}!`);
    } else {
      setModalMessage("Insufficient coins!");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    onClose(); // Close the store when modal is dismissed
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <Image
          source={require("../assets/avatar/apple.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      <Text style={styles.header}>STORE</Text>

      {/* Items Section */}
      <View style={styles.itemsContainer}>
        {Object.keys(foodImages).map((food, index) => (
          <View key={food} style={styles.item}>
            <TouchableOpacity
              onPress={() => handlePurchase(food)}
              onMouseEnter={() => setHoveredFood(food)} // Add hover effect on desktop
              onMouseLeave={() => setHoveredFood(null)} // Remove hover effect
              style={[
                styles.itemImageWrapper,
                hoveredFood === food && styles.itemImageHovered, // Apply hover effect
              ]}
            >
              <Image source={foodImages[food]} style={styles.itemImage} />
            </TouchableOpacity>

            <View style={styles.buyButton}>
              <Image
                source={require("../assets/avatar/coin.png")}
                style={styles.coinIcon}
              />
              <Text style={styles.price}>{prices[food]}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Modal */}
      <Modal visible={showModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 10,
    paddingTop: 50,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "center", // Center content horizontally
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 2,
  },
  icon: {
    width: 30,
    height: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center items horizontally
    alignItems: "center", // Center items vertically within the container
    marginTop: 20,
    flexWrap: "wrap",
    gap: 20, // Add spacing between items
  },
  item: {
    alignItems: "center",
  },
  itemImageWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemImage: {
    width: 100,
    height: 100,
    margin: 12,
    opacity: 1,
  },
  itemImageHovered: {
    opacity: 0.8, // Simulate hover by changing opacity
  },
  buyButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  coinIcon: {
    width: 20,
    height: 20,
  },
  price: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#EC808D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Store;
