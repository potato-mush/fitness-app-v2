import React, { useState } from "react";
import {
  PanResponder,
  Animated,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Store from "./Store"; // Import the Store component

const CustomDraggable = ({ children, onDragRelease, disabled }) => {
  const [pan] = useState(new Animated.ValueXY());

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled, // Disable dragging if `disabled` is true
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, gestureState) => {
      onDragRelease(e, gestureState, {
        left: gestureState.moveX,
        top: gestureState.moveY,
      });
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[pan.getLayout(), styles.draggable, { zIndex: 2 }]} // Ensure draggable items are on top
    >
      {children}
    </Animated.View>
  );
};

const DiningArea = () => {
  const [coins, setCoins] = useState(100);
  const [foodCounts, setFoodCounts] = useState({
    energyDrink: 5,
    apple: 3,
    friedEgg: 2,
    chickenLeg: 4,
  });
  const [isStoreOpen, setIsStoreOpen] = useState(false); // Store visibility toggle

  const handleStoreToggle = () => {
    setIsStoreOpen(!isStoreOpen); // Toggle store visibility
  };

  const handleDrop = (food) => {
    if (foodCounts[food] > 0) {
      setFoodCounts((prevCounts) => ({
        ...prevCounts,
        [food]: prevCounts[food] - 1,
      }));
      Alert.alert(
        `You ate a ${food.replace(/([A-Z])/g, " $1").toLowerCase()}!`
      );
    } else {
      Alert.alert(
        `No more ${food.replace(/([A-Z])/g, " $1").toLowerCase()}s left!`
      );
    }
  };

  const foodImages = {
    energyDrink: require("../assets/avatar/energy-drink.png"),
    apple: require("../assets/avatar/apple.png"),
    friedEgg: require("../assets/avatar/fried-egg.png"),
    chickenLeg: require("../assets/avatar/chicken-leg.png"),
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.storeButton}
          onPress={handleStoreToggle}
        >
          <Image
            source={require("../assets/avatar/cart.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <View style={styles.coinContainer}>
          <Image
            source={require("../assets/avatar/coins.png")}
            style={styles.icon}
          />
          <Text style={styles.coinText}>{coins}</Text>
        </View>
      </View>

      {/* Food Row with Draggable Items */}
      <View style={styles.foodRow}>
        {Object.keys(foodCounts).map((food) => (
          <View key={food} style={styles.foodContainer}>
            <CustomDraggable
              onDragRelease={(event, gestureState, bounds) => {
                if (
                  bounds.left > 100 &&
                  bounds.top > 400 &&
                  bounds.left < 200 &&
                  bounds.top < 500
                ) {
                  handleDrop(food);
                }
              }}
              disabled={foodCounts[food] === 0} // Disable dragging if count is 0
            >
              <Image
                source={foodImages[food]}
                style={[
                  styles.foodImage,
                  foodCounts[food] === 0 && styles.disabledFood, // Apply disabled style if count is 0
                ]}
              />
            </CustomDraggable>
            <View style={styles.foodCountContainer}>
              <Text style={styles.foodCount}>{foodCounts[food]}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Avatar at the Bottom */}
      <View style={styles.avatarContainer}>
        <Image
          source={require("../assets/avatar/Awake.png")}
          style={styles.avatarImage}
        />
      </View>

      {/* Store Modal */}
      {isStoreOpen && (
        <Store
          coins={coins}
          setCoins={setCoins}
          onClose={handleStoreToggle} // Close store when modal is closed
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    zIndex: 1, // Ensure top row is above the avatar
  },
  storeButton: {
    padding: 10,
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
  },
  coinText: {
    color: "#FFCC33",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 5,
  },
  foodRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
    zIndex: 2, // Ensure food items are above the avatar
  },
  foodContainer: {
    alignItems: "center",
    position: "relative", // Required for absolute positioning of the food count
  },
  foodImage: {
    width: 50,
    height: 50,
  },
  disabledFood: {
    opacity: 0.5, // Make the food item semi-transparent when disabled
  },
  foodCountContainer: {
    backgroundColor: "#EC808D",
    padding: 3,
    paddingHorizontal: 7,
    borderRadius: 18,
    color: "white",
    position: "relative",
    zIndex: 2,
    top: 30,
    left: 25,
  },
  foodCount: {
    color: "white",
    fontSize: 14,
  },
  avatarContainer: {
    position: "absolute",
    bottom: 50,
    zIndex: 0, // Ensure the avatar is below the draggable items
  },
  avatarImage: {
    maxWidth: 350,
    width: 350,
    height: 350,
  },
  draggable: {
    position: "absolute",
    zIndex: 2, // Ensure draggable items are on top
  },
});

export default DiningArea;
