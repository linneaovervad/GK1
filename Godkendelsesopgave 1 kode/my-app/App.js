import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; //  Importer createBottomTabNavigator fra @react-navigation/bottom-tabs
import Icon from 'react-native-vector-icons/Ionicons'; // Importer Ionicons fra react-native-vector-icons
import { useEffect, useState } from "react";
import { getApps, initializeApp } from "firebase/app"; // Importer initializeApp fra "firebase/app"
import { getDatabase } from "firebase/database";  // Importer getDatabase fra "firebase/database"

import Home from './components/home'; 
import ChoreList from './components/choreList';
import People from './components/people';

// Firebase konfiguration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0qPtNrj90YV3Qz75OESeSiIv0Uo8K69s",
  authDomain: "godkendelsesopgave1-3ae75.firebaseapp.com",
  databaseURL: "https://godkendelsesopgave1-3ae75-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "godkendelsesopgave1-3ae75",
  storageBucket: "godkendelsesopgave1-3ae75.appspot.com",
  messagingSenderId: "922950979868",
  appId: "1:922950979868:web:b3103fffc422d8c3132ad9"
};


const Tab = createBottomTabNavigator();

export default function App() {
  const [databaseInstance, setDatabaseInstance] = useState(null);

  useEffect(() => {
    // Initialiser kun Firebase, hvis det ikke allerede er gjort
    if (getApps().length === 0) {
      const app = initializeApp(firebaseConfig);
      console.log("Firebase initialized!");
    }

    // Initialiser databasen
    const db = getDatabase();
    setDatabaseInstance(db); // Gem databaseinstansen i state
  }, []);

  // Returner navigationen
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
// Tilføj ikoner til fanerne
            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Chore List') {
              iconName = 'list-outline';
            } else if (route.name === 'People') {
              iconName = 'people-outline';
            }

            // Returner ikon
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'lightpink',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            display: 'flex',
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        
        {/* Videregiv databaseInstance som en prop til ChoreList */}
        <Tab.Screen name="Chore List">
          {props => <ChoreList {...props} database={databaseInstance} />}
        </Tab.Screen>

        <Tab.Screen name="People" component={People} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
