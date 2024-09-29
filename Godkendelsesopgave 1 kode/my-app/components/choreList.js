import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ref, onValue, push, remove, update } from "firebase/database";
import { Ionicons } from '@expo/vector-icons'; 
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { Platform } from 'react-native';

export default function ChoreList({ database }) {
    const [chores, setChores] = useState([]); //ny state til at gemme chores
    const [newChore, setNewChore] = useState(""); // Ny state til at gemme ny chore
    const [assignedPerson, setAssignedPerson] = useState(""); 
    const [deadline, setDeadline] = useState(new Date()); // Ny state til at gemme deadline
    const [showDatePicker, setShowDatePicker] = useState(false); // Ny state til at vise datepicker
    const [searchPerson, setSearchPerson] = useState("");  // Ny state til at søge efter specifikt navn
    const [filteredChores, setFilteredChores] = useState([]); // Ny state til filtrerede chores

    // Hent chores fra databasen
    useEffect(() => {
        if (database) {
            const choresRef = ref(database, 'chores');
            onValue(choresRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const choreList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                    setChores(choreList);
                } else {
                    setChores([]);
                }
            });
        }
    }, [database]);

    // Filtrer chores baseret på søgning
    useEffect(() => {
        if (searchPerson.trim() === "") { // Hvis søgefeltet er tomt, vis alle chores
            setFilteredChores(chores); 
        } else {
            const filtered = chores.filter((chore) =>  // Filtrer chores baseret på søgning
                chore.assignedTo?.personName?.toLowerCase() === searchPerson.toLowerCase() // Case-insensitive søgning efter navn 
            );
            setFilteredChores(filtered);
        }
    }, [searchPerson, chores]);

    // Tilføj ny chore
    const addChore = () => {
        if (newChore.trim() === "" || assignedPerson.trim() === "") return;
        const choresRef = ref(database, 'chores'); // Reference til 'chores' i databasen  
        push(choresRef, { 
            name: newChore, 
            assignedTo: { personName: assignedPerson }, // Gem tildelt person som et objekt
            deadline: deadline.toLocaleDateString(), // Gem deadline som en string
            completed: false
        }); 
        // Nulstil inputfelter
        setNewChore(""); 
        setAssignedPerson(""); 
        setDeadline(new Date()); // Nulstil deadline
    };

    // Slet chore
    const deleteChore = (id) => {
        const choreRef = ref(database, `chores/${id}`); // Reference til specifik chore
        remove(choreRef); // Slet chore fra databasen
    };

    // Opdater status for chore
    const toggleCompleteChore = (id, currentStatus) => {
        const choreRef = ref(database, `chores/${id}`); // Reference til specifik chore
        update(choreRef, { completed: !currentStatus }); // Opdater status for chore
    };

    // Håndter ændring af deadline
    const onDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setDeadline(selectedDate); // Opdater deadline
        }
        if (Platform.OS === 'android') { // Skjul datepicker på Android
            setShowDatePicker(false); // Skjul datepicker
        }
    };

    // Returner JSX for ChoreList
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Chore List</Text>

        <TextInput
          placeholder="Add a new chore"
          value={newChore}
          onChangeText={setNewChore}
          style={styles.inputField}
        />

        <TextInput
          placeholder="Assign to"
          value={assignedPerson}
          onChangeText={setAssignedPerson}
          style={styles.inputField}
        />

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View style={styles.inputField}>
            <Text style={styles.dateText}>
              Deadline: {deadline.toLocaleDateString()}
            </Text>
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={deadline}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Button title="Add Chore" onPress={addChore} />

        {/* Inputfelt til at søge efter specifikt navn */}
        <TextInput
          placeholder="Search by name"
          value={searchPerson}
          onChangeText={setSearchPerson}
          style={styles.inputField}
        />

        {filteredChores.length > 0 ? (
          <FlatList
            data={filteredChores}
            keyExtractor={(item) => item.id || item.key}
            renderItem={({ item }) => (
              <View style={{ padding: 10, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: item.completed ? 'lightgray' : 'black' }}>Opgave: {item.name || "Ingen opgave"}</Text>
                  <Text style={{ color: item.completed ? 'lightgray' : 'black' }}>Tildelt til: {item.assignedTo?.personName || "Ingen tildelt"}</Text>
                  <Text style={{ color: 'gray' }}>Deadline: {item.deadline || "Ingen deadline"}</Text>
                </View>

                <TouchableOpacity onPress={() => toggleCompleteChore(item.id, item.completed)}>
                  {item.completed ? (
                    <Ionicons name="checkmark-circle" size={24} color="rgba(0, 128, 0, 0.5)" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={24} color="grey" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteChore(item.id)}>
                  <Text style={{ color: 'red' }}>Slet</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text>No chores found for {searchPerson}</Text>
        )}
      </View>
    );
}

const styles = StyleSheet.create({
    inputField: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#FDEDEC',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
});
