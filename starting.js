import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, Button  } from 'react-native';
import {useState, useEffect} from 'react'

import {vh, vw} from 'react-native-expo-viewport-units'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Restart} from 'fiction-expo-restart';

export default function Starting() {
    
    const [mainColor, setMainColor] = useState('red')
    const [name, setName] = useState('')

    function continueApp()
    {
        console.log(name, mainColor)
        if(name)
        {
            setData('name', name)
            setData('mainC', mainColor)

            setData('tasks', JSON.stringify([ {id: 0} ]))
    
            Restart();
        }else{
            alert('Name is invalid')
        }
    }

    const setData = async (key, value) => {
        await AsyncStorage.setItem(
          key, value
        )
      }

    const Circle = ({c, selected}) => {
        if(mainColor == c)
        {
            return (
                <TouchableOpacity onPress={() => {setMainColor(c)}} style={{backgroundColor: c, width: 50, height: 50, borderRadius:40, marginRight: 10, borderWidth: 2, borderColor: '#292929'}}>
    
                </TouchableOpacity>
            )    
        }
        return (
            <TouchableOpacity onPress={() => {setMainColor(c)}} style={{backgroundColor: c, width: 50, height: 50, borderRadius:40, marginRight: 10}}>

            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
          <Text style={{fontSize: 30, fontWeight: 'bold', marginTop: 80, marginLeft: 20 }} >Welcome to {'\n'}Simple-Todo</Text>
          <Text style={{fontSize: 15, marginLeft: 20, marginBottom: 20}} >This data will only be visible to you!</Text>
        
            <TextInput 
                style={{width: 250, height: 40, backgroundColor: '#fcfcfc', marginLeft: 20, padding: 10, borderRadius: 10, shadowColor: mainColor, marginBottom: 20, shadowOffset: { width: 0, height: 7, }, shadowOpacity: 0.64, shadowRadius: 7.27, elevation: 12,}}
                placeholder={'Enter your name'}
                onChangeText={(newN) => {setName(newN)}}
                value={name}
            />

            <Text style={{fontSize: 15, marginLeft: 20, marginTop: 20}} >Choose a color:</Text>
            <View style={{justifyContent: 'center', marginTop: 20, display: 'flex', flexDirection: 'row'}}>

                <Circle c={'red'} />
                <Circle c={'blue'} />
                <Circle c={'green'}  />
                <Circle c={'orange'}  />
                <Circle c={'purple'} />

            </View>

            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                <TouchableOpacity onPress={() => {continueApp()}} style={{width: 120, height: 35, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fcfcfc', borderRadius: 10, shadowColor: mainColor, marginBottom: 20, shadowOffset: { width: 0, height: 7, }, shadowOpacity: 0.64, shadowRadius: 7.27, elevation: 12,}} >
                    <Text style={{fontSize: 15, color: mainColor}}>Proceed &gt;</Text>
                </TouchableOpacity>
            </View>
        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });
  