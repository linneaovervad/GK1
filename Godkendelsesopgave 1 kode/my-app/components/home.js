import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Home-komponenten er vores startside, hvor brugeren kan navigere til andre skærme
export default function Home({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Logo eller ikon */}
            <Image
                source={{ uri: 'https://img.icons8.com/?size=100&id=1zf5ffn5HyB8&format=png&color=000000' }} // Eksempel på logo, du kan udskifte med dit eget
                style={styles.logo}
            />
            
            {/* Velkomsttekst */}
            <Text style={styles.welcomeText}>Velkommen til Opgavefordeling!</Text>
            <Text style={styles.descriptionText}> 
                Få styr på dagligdagens opgaver i med dine roomies. Skab balance og overblik med vores enkle opgavefordeling.
            </Text>

            {/* Knap til at komme i gang */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chore List')}>
                <Ionicons name="list-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Se Opgaver</Text>
            </TouchableOpacity>

            {/* Knap til at navigere til 'People' */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('People')}>
                <Ionicons name="people-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Roomies</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDEDEC',
        padding: 20,
    },
    logo: {
        width: 50,
        height: 50,
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    descriptionText: {
      fontSize: 10,
      color: '#666',
      textAlign: 'center',
      marginBottom: 30,
      fontWeight: 'bold', 
  },
  
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgb(173, 216, 230)', // Lys blå farve til knappen
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
