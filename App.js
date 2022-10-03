import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TextInput, FlatList} from 'react-native';
import { initializeApp } from'firebase/app';
import { getDatabase, push, ref, onValue, remove } from'firebase/database';

export default function App() {

  const firebaseConfig = {
    apiKey: "AIzaSyAkjS78KAW1T2e1tFGkX5bME3QBaonr3GY",
    authDomain: "shopping-list-743c5.firebaseapp.com",
    databaseURL: "https://shopping-list-743c5-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "shopping-list-743c5",
    storageBucket: "shopping-list-743c5.appspot.com",
    messagingSenderId: "688356342850",
    appId: "1:688356342850:web:faac7450fb4dc32704c1db",
    measurementId: "G-3ES35E89MQ"
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const [keys, setKeys] = useState([]);
  const [listItem, setListItem] = useState('');
  const [listQuantity, setListQuantity] = useState('');
  const [items, setItems] = useState([]);



  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fbItems = Object.values(data);
        const fbKeys = Object.keys(data);
        setItems(fbItems);
        setKeys(fbKeys);
      }
      else {
        setItems([]);
      }
    })
  }, []);
  
  const addPressed = () => { 
    push(
      ref(database, 'items/'),
      { 'product': listItem, 'amount': listQuantity });
      setListItem('');
      setListQuantity('');
  };

  const deleteItem = (index) => {
    var key = keys[index];
    remove(ref(database, 'items/' + key));
  }

  return (

    <View style={styles.container}>
      <View>
        <TextInput style={styles.input} placeholder=" Product" onChangeText={listItem => setListItem(listItem)} value={listItem}/>
      </View>
      <View>
        <TextInput style={styles.input} placeholder=" Quantity" keyboardType="numeric" onChangeText={listQuantity => setListQuantity(listQuantity)} value={listQuantity}/>
      </View>
      <View style={styles.buttoncontainer}>
        <View>
        <Button onPress={addPressed} title="Add" />
        </View>
      </View>
      <View style={styles.shoppinglist}>
      <Text style={{ color: "blue" }}>Shopping List</Text>
      <FlatList 
      data={items}
      renderItem={({item, index}) =>
      <View style={styles.listcontainer}>
      <Text>{item.amount} x {item.product}</Text>
      <Text style={{ color: "blue" }} onPress={() => deleteItem(index)}> delete</Text>
      </View>
    } 
      />
      </View>
      <StatusBar style="auto" />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 80,
    alignItems: 'center',
    
  },

  shoppinglist: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    
  },

  buttoncontainer : {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'space-evenly'
    
  },

  listcontainer : {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly'
    
  },

  input : {
    width:200  , 
    borderColor: 'gray', 
    borderWidth: 1
  }

});

