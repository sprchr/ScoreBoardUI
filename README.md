# Expo Project Setup Guide

This guide will walk you through setting up a new **Expo** project in React Native with the required packages, file structure, and ScoreBoard App

## Prerequisites

Before setting up your Expo project, ensure that you have the following installed on your machine:

- **Node.js** (LTS version recommended): [Download Node.js](https://nodejs.org/)
- **Expo CLI**: Install the Expo CLI globally using npm or yarn.

### Install Expo CLI

To install Expo CLI, run the following command:

```bash
npm install -g expo-cli
# OR using yarn
yarn global add expo-cli
```



## Create a New Expo Project

You can create a new Expo project using the `npx expo` command. Choose the template based on your requirements:

```bash
npx expo init <project-name> --template <template-name>
```
```bash
cd projectName
npx expo
```
## Installed Packages

Below are the packages installed in the project for scoreboard app:

```json
{
  "axios": "^1.7.9",
  "expo": "~52.0.27",
  "expo-router": "~4.0.17",
  "expo-status-bar": "~2.0.1",
  "react": "18.3.1",
  "react-native": "0.76.6",
  "react-native-safe-area-context": "4.12.0",
  "react-native-web": "~0.19.13"
}
```

## Project File Structure

For consistency, we will maintain a structured and similar naming convention for the files in the project.

```
/src
  /app
    /home
        -index.tsx
        /game
            -index.tsx

```

# Poker Scorecard App 
## Overview

This application allows users to create a scorecard for a poker game, track players' scores over multiple rounds, and save the data for future reference. It includes two main screens:

1. **Create Score Card Screen**: Allows users to input the number of players, their names, and create a game with a scorecard.
2. **Score Tracking Screen**: Displays players, their scores, and allows users to input scores for each round.

The app uses React Native, Expo Router for navigation, and Axios for making API requests to manage the game's data.

---

## **Create Score Card Screen**

### Components

1. **TextInput (Player Number Input)**:
   - Allows the user to enter the number of players.
   - Updates the state to create corresponding player fields.

2. **Player Name Input**:
   - Renders dynamically based on the number of players entered.
   - Each player input field allows users to input a player's name.
   - Validates that all player names are entered before submitting.

3. **Create Score Card Button**:
   - When clicked, it sends the game data (including the number of players and their names) to the backend to create a game and scorecard.

4. **Games List**:
   - Fetches a list of all games from the backend and displays them.
   - Each game is a clickable link that navigates to the score tracking screen.

### Functions

- **fetchGames**: Fetches the list of games from the backend API.
- **handlePlayerNameChange**: Updates the player's name based on input changes.
- **createScoreCard**: Validates the input fields and sends a POST request to create a new scorecard.

### API Requests

- **GET** `/games`: Fetches a list of all available games.
- **POST** `/players`: Creates a new scorecard for the game.

---
## **Score Tracking Screen**

### Components

1. **Players List**:
   - Displays the list of players in a horizontal table format.
   - Each player’s name is rendered.

2. **Score Input Table**:
   - Displays the scorecard for each round.
   - Allows users to enter scores for each player in every round.

3. **Add Round Button**:
   - Adds a new round of scoring.
   - Prompts users to store the current round before proceeding to the next round.

4. **Save Round Button**:
   - Stores the current round’s score data to the backend.
   - Updates the scorecard with the new scores.

### Functions

- **fetchPlayers**: Fetches the game data, including players and their existing scores.
- **handleRounds**: Adds a new round and initializes empty score cells.
- **storeData**: Sends the scorecard data to the backend and saves it.

### API Requests

- **GET** `/players/{id}`: Fetches the players and scorecard data for a specific game.
- **POST** `/games/{gameId}`: Saves the updated scorecard data for a specific game.

---

## **Key State Variables**

### Create Score Card Screen:
- `players`: Holds the player objects with their name and status.
- `games`: Holds the list of available games.
- `numberOfPlayers`: The number of players for the game.

### Score Tracking Screen:
- `players`: Holds the list of active players and their information.
- `rounds`: The current number of rounds played.
- `roundsData`: Holds the data for each round's scores.
- `total`: The total scores for each player across all rounds.
- `tempTotal`: A temporary array for holding intermediate score calculations before saving.

---

## **Styling**

The app uses `StyleSheet` from React Native to apply the following styles:

1. **Input Fields**: Styled with a border and centered text.
2. **Buttons**: Styled with a background color and padding for better interaction.
3. **Score Table**: Styled to display scores in a tabular format, with header and data cells differentiated.
4. **General Layout**: Uses padding and margins to ensure proper spacing between elements.

### Example Style Snippets:

```js
const styles = StyleSheet.create({
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
  cell: {
    padding: 10,
    borderColor: "#ccc",
    textAlign: "center",
    width: 100,
    borderBottomWidth: 1
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
});
```

---

## **Possible Enhancements**

- **Real-time Score Updates**: Implement WebSocket for real-time score updates.
- **User Authentication**: Add login functionality to manage users and their games.
- **Leaderboard**: Add a leaderboard to track player scores over time.

---

## **Conclusion**

This app provides a simple, user-friendly way to track poker game scores, making it easy for players to enter their scores, view previous games, and create new scorecards. With a clean user interface and robust backend support, it serves as a great tool for managing poker games.



