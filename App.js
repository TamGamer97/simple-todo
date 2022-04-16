import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert  } from 'react-native';
import {useState, useEffect} from 'react'

import {vh, vw} from 'react-native-expo-viewport-units'
import AsyncStorage from "@react-native-async-storage/async-storage";

import Index from './index'
import Starting from './starting';

export default function App() {

  const [screen, setScreen] = useState(0)

  const getData = async (key) => {
    let data = await AsyncStorage.getItem(key)
    return data
  }

  useEffect(() => {
    console.log('checkiung')
    getData('mainC')
      .then(data => {
        console.log(data)
        if(!data)
        {
            setScreen(1)
        }else{
          setScreen(2)
        }
      })
  }, [])

  if(screen == 0)
  {
    return (
      <Text>loading..</Text>
    )
  }
  if(screen == 1)
  {
    return (
      <Starting/>   
    )
  }
  if(screen == 2)
  {
    return (
      <Index/>   
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
