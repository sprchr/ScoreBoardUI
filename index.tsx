import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Player {
  name: string;
  status: number;
  _id: string;
}
const { id } = useLocalSearchParams();
export default function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState(0);
  const [scoreId, setScoreId] = useState('');
  const [roundsData, setRoundsData] = useState<(string | number)[][]>([]);

  const [total, setTotal] = useState<any[]>([]);
  const [tempTotal, setTempTotal] = useState<any[]>([]);
  const [roundInput, setRoundInput] = useState<string>("");
  const [storeRound, setStoreRound] = useState(true);
  async function fetchPlayers() {
    const response = await axios.get(`http://192.168.29.131:3001/api/players:${id}`);
    const filteredPlayers =response.data.players.players.filter(
      (player: Player) => player.status === 1
    );
    setPlayers(filteredPlayers);
    setTotal(response.data.scores[0].totalArray)
    setScoreId(response.data.scores[0]._id)
    setTempTotal(response.data.scores[0].totalArray)
    setRounds(response.data.scores[0].totalArray.length)
  }
  useEffect(() => {
    fetchPlayers();
  }, []);
  
  function handleInputChange(rd: number, cd: number, value: string) {
  const temp = JSON.parse(JSON.stringify(tempTotal));
  const inital = JSON.parse(JSON.stringify(total)); 
  temp[rd][cd] = (Number(total[rd][cd])) + (Number(value));
  setTempTotal(temp);
  setTotal(inital); 
  setRoundInput('')
  }

  function handleRounds() {
    if (!storeRound || (total.length < rounds)) {
      Alert.alert(
        "Update Progress",
        "Store the scores of current round before procedding"
      );
      return;
    }
    if (players.length === 0) return;
    setRounds((prevRounds) => prevRounds + 1); // Increment rounds
    const initialScoreCard: any = Array(players.length-1).fill("");
    initialScoreCard.unshift(`Round ${total.length}`);
    setRoundsData((round) => [...round, initialScoreCard]);
    setStoreRound((prev)=>!prev); 
    
  }
  async function storeData() {
    if (roundsData.length === 0) {
      Alert.alert(
        "Round data not available",
        "Add store and enter score before saving the data"
      );
      return;
    }
  
    
    
    const tempArray = [...tempTotal];
    
  
    const values = roundsData[0].map((val, index) => 
      index > 0 ? (val ? Number(val) : 0) : val
    );
    tempArray.push(values);
    
    try {
      const response = await axios.post("http://192.168.29.131:3001/api/scorecard", {
        scoreId,
        scoreCard: tempArray, 
      });
  
      // Step 4: Handle the response
      if (response.status === 200) {
        setStoreRound((prev)=>!prev); 
        Alert.alert("Success", "Data stored successfully!");
        console.log(storeRound)
       setRoundsData([]);
        await fetchPlayers()
        
      } else {
        Alert.alert("Error", "Failed to store the data.");
      }
    } catch (error) {
      // Step 5: Error handling
      console.error("Error storing data:", error);
      Alert.alert("Error", "There was an error storing the data. Please try again.");
    }
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView>
        <View >
          <Text style={styles.title}>Poker ScoreCard</Text>
          <ScrollView showsVerticalScrollIndicator={true}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleRounds()}
              >
                <Text style={styles.buttonText}>Add Round</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.scoreContainer]}>
              <View>
                
                {players.map((player, index) => (
                  
                    <View key={player._id}>
                      <Text style={
                          index == 0
                            ? [styles.headerCell, styles.cell]
                            : [ styles.cell,styles.nameCell]
                        }>{player.name}</Text>
                    </View>
                 
                ))}
              </View>
              <ScrollView horizontal={true}>
              {tempTotal.map((totalArray,id) => (
                    <View key={id}>
                      {totalArray.map((col:any,index:any)=>(
                        <Text
                        key={index} style={ 
                          index == 0
                          ? [styles.headerCell, styles.cell]
                          : [ styles.cell,styles.nameCell]
                        }>{col}</Text>
                      ))}
                    </View>
                ))}
                <View style={styles.scoreRow}>
                  {roundsData
                    ? roundsData.map((array, index) => (
                        <View key={index}>
                          {array.map((value, id) => (
                            <View key={id}>
                              {id === 0 ? (
                                <Text style={[styles.headerCell, styles.cell]}>
                                  {value}
                                </Text>
                              ) : (
                                <Pressable
                                  onPress={Keyboard.dismiss}
                                >
                                  <TextInput
                                    style={styles.cell}
                                    value={String(value)}
                                    onChangeText={(text) => {
                                      roundsData[index][id] = text;
                                      setRoundInput(text);
                                    }}
                                    onEndEditing={() =>
                                      handleInputChange(index, id, roundInput)
                                    }
                                    placeholder="Score"
                                    keyboardType="numeric"
                                  />
                                </Pressable>
                              )}
                            </View>
                          ))}
                        </View>
                      ))
                    : ""}
                </View>
              </ScrollView>
            </View>

            <View>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={() => storeData()}
              >
                <Text style={[styles.buttonText]}>Save the current round</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
 
  scoreContainer: {
    flexDirection: "row",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  scoreRow: {
    flex: 1,
    flexDirection: "row",
  },

  cell: {
    padding: 10,
    borderColor: "#ccc",
    textAlign: "center",
    width: 100,
    borderBottomWidth:1
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#ddd",
  },

  nameCell: {
    width: 100,
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  inputCell: {
    width: 100,

    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    backgroundColor: "#fff",
    padding: 5,
  },
  buttonContainer: {
    flex: 1,
    width: "auto",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#5d6cd1",
    padding: 6,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  saveButton: {
    marginTop: 15,
  },
});
