
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safearea}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          router.push("/home"); // Navigate to /index
        }}
      >
        <Text style={styles.text}>Create game</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    fontSize: 20,
    fontWeight: "600",
  },
});
