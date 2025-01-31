import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import axios from "axios";
interface Player {
  name: string;
  status: number;
}
export default function index() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games,setGames] = useState<any[]>([])
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(0);
  const router = useRouter();
  const gameName = "Poker"
  async function fetchGames() {
    const response = await axios.get("https://scoreboard-backend-green.vercel.app/games")
    setGames(response.data)
  }
  useEffect(()=>{
    fetchGames()
  },[])
  
  function handlePlayerNameChange(index: number, name: string) {
    const newPlayerNames = [...players];
    newPlayerNames[index] = { name: name, status: 1 };
    setPlayers(newPlayerNames);
  }
  
  async function createScoreCard () {
    if (numberOfPlayers === 0) {
      Alert.alert("Insuffiecient Players", "Number of players can not be 0");
      return;
    }
    if (players.some((player) => player.name.trim() === "")) {
      Alert.alert("Invalid Input", "Please fill all player names");
      return;
    } else {
      try {
        const resArray  = Array(players.length).fill(0)
        resArray.unshift("Total")
        const totalArray = [resArray]
        const response = await axios.post("https://scoreboard-backend-green.vercel.app/players", {
          gameName,
         numberOfPlayers,
         players,
         totalArray
      });

        // Handle success (response can be checked here if needed)
        if (response.status === 201) {
          await fetchGames()
           Alert.alert("Game created successfully","click on game to navigate to scorecard")
        } else {
          Alert.alert("Error", "There was an issue submitting the scorecard.");
        }
      } catch (error) {
        console.error("Error during request:", error);
        Alert.alert("Error", "Something went wrong while creating the scorecard.");
      }
    }
    
  }
  return (
    <SafeAreaView>
      <View style={styles.inputContainer}>
        <Text style={styles.inputHeading}>Enter the Number of players:</Text>
        <TextInput
          style={styles.InputField}
          inputMode="numeric"
          onChangeText={(num) => {
            setPlayers(new Array(Number(num)).fill({ name: "", status: 1 }));
            setNumberOfPlayers(Number(num));
          }}
          value={numberOfPlayers.toString()}
        />
      </View>
      <ScrollView>
        <View>
          <View style={styles.playerContainer}>
            {/* Input for players */}
            {players.map((player, id) => (
              <View key={id} style={styles.playerInputs}>
                <Text style={styles.playerTitle}>Player {id + 1}:</Text>
                <TextInput
                  placeholder={`Enter name for player ${id + 1}`}
                  onChangeText={(text) => handlePlayerNameChange(id, text)}
                  value={player.name}
                />
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={createScoreCard}>
            <View style={styles.Button}>
              <Text style={styles.textButton}>Create Score Card</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.gameContainer}>
            <Text style={styles.gameContainerTitle}>Your games</Text>
            {games.map((game)=>(
               <View key={game._id}>
                   
               <Link href={ `/game/${game._id}`} ><Text
            style={styles.gameContainerText}
          
             >{game.gameName}</Text></Link>
               </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 14,
    flexDirection: "row",
    alignContent: "center",
    marginHorizontal: 10,
    marginTop: 10,
    gap: 10,
  },
  inputHeading: {
    fontWeight: "600",
    fontSize: 20,
  },
  InputField: {
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 2,
    fontSize: 20,
    padding: 0,
    width: 50,
    textAlign: "center",
  },
  Button: {
    marginHorizontal: "auto",
    marginVertical: 10,
    backgroundColor: "#3f41c1",
    width: "auto",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 5,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    padding: 5,
  },
  playerContainer: {
    marginLeft: 24,
  },
  playerInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  playerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  gameContainerTitle:{
    fontWeight:'600',
    fontSize:28,
  },
  gameContainer:{
    flex:1,
    alignItems:'center',
     marginTop:25
  },
  gameContainerText:{
    fontSize:20,
    fontWeight:'400',
    padding:10,
    textDecorationStyle:'solid',
    textDecorationLine:"underline"
  }
});
