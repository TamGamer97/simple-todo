import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, Image  } from 'react-native';
import {useState, useEffect} from 'react'

import {vh, vw} from 'react-native-expo-viewport-units'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Restart} from 'fiction-expo-restart';

import settingsIcon from './settingsIcon.png'

export default function Index() {

  const [text, setText] = useState('')
  const [mainColor, setMColor] = useState('red')
  const [tasks, setTasks] = useState([])
  const [viewTypeTxt, setVTT] = useState('none')
  const [rup, setRUP] = useState(0)
  const [showAlert, setShowAlert] = useState(0)
  const [name, SetName] = useState('')

  useEffect(async() => {
    let n = await getData('name')
    let c = await getData('mainC')

    setMColor(c)
    SetName(n)

  }, [])

  
  useEffect(async() => {
    // setData('tasks', JSON.stringify([ {id: 0} ]))
    getData('tasks')
      .then(data => {
        data = JSON.parse(data)
        if(data.length == 1)
        {
          if(data[0]['id'] == 0)
          {
            // console.log('frist time')
            data = [ {value: 'undefined'} ]
          }
        }
        // console.log(data)
    
    
        setTasks(data)
      })

  }, [])

  const setData = async (key, value) => {
    await AsyncStorage.setItem(
      key, value
    )
  }

  const getData = async (key) => {
    let data = await AsyncStorage.getItem(key)
    return data
  }

  function onChangeText(newT) { setText(newT), setVTT('flex') }

  async function makeTask()
  {
      setVTT('none')

      let Task = {'done': false, 'value': text, 'id': tasks.length, 'dec': 'none'}

      tasks.push(Task)

      setData('tasks', JSON.stringify(tasks))

      console.log('created task')
      console.log(tasks)

      setText('') // this rerenders page for us
  }

  async function modifyTask(id)
  {
      console.log('modifying task ' + id)
      if(tasks[id]['id'] == id)
      {
          if(tasks[id]['done'])
          {
              // remove
              setShowAlert(id)
              // alert('Do you want to delete this Task?')
          }else{
              tasks[id]['done'] = true
              tasks[id]['dec'] = 'line-through'
          }
      }

      console.log('under')
      console.log(tasks)
      setData('tasks', JSON.stringify(tasks))

      let count = 0

      for (var x = 0; x < tasks.length; x++)
      {
          if(tasks[x]['id'] < count) {count = tasks[x]['id']}
      }

      // tasks.push( {id: count - 1} )

      if(rup == 0) 
      {
        setRUP(1)
      } else {
        setRUP(0)
      }
      setTasks(tasks) // this rerenders page
  }

  function deleteTask(id)
  {
    setShowAlert(0)
      for (var x = 0; x < tasks.length; x++)
      {
          if(tasks[x]['id'] == id)
          {
            // x = ind
            tasks.splice(x, 1)
            console.log('new task')
            console.log(tasks)

            setData('tasks', JSON.stringify(tasks))

            if(rup == 0) 
            {
              setRUP(1)
            } else {
              setRUP(0)
            }
            setTasks(tasks) // this rerenders page


          }
      }
  }

  function unmarkTask(id)
  {
    setShowAlert(0)
    
    for (var x = 0; x < tasks.length; x++)
    {
      if(tasks[x]['id'] == id)
      {
        console.log(tasks[x])
        tasks[x]['done'] = false
        tasks[x]['dec'] = 'none'
    
    
        setData('tasks', JSON.stringify(tasks))
    
        if(rup == 0) 
        {
          setRUP(1)
        } else {
          setRUP(0)
        }
        setTasks(tasks) // this rerenders page
      }

    }


  }

  function resetMyApp()
  {
    AsyncStorage.clear()
    Restart();
  }

  const AlertSpec = () => 
  {
    if(showAlert > 0)
    {
      Alert.alert(
        "Modifying Task",
        "Delete or Unmark Task",
        [
          {
            text: "Close",
            onPress: () => { console.log("Cancel Pressed"); setShowAlert(0) },
            style: "cancel"
          },
          { 
            text: "Delete",
            onPress: () => deleteTask(showAlert)
          },
          { 
            text: "Unmark",
            onPress: () => unmarkTask(showAlert)
          }
        ]
      )
    } else{
      return (
        <View></View>
      )
    }
  }

  const TaskComponenet = ({text, id, lineType}) => {
    if(text == "undefined")
    {
      return (
        <View style={{marginTop: 10}}>

        </View>
      )
    }
    return (
      <TouchableOpacity onPress={ () => {modifyTask(id)}} style={{width: vw(85), height: 50, backgroundColor: '#fcfcfc', borderRadius: 10, shadowColor: mainColor, marginBottom: 20, shadowOffset: { width: 0, height: 7, }, shadowOpacity: 0.64, shadowRadius: 7.27, elevation: 12,}}>
        <Text style={{marginTop: 14, marginLeft: 10, textDecorationLine: lineType}} >{text}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 30, fontWeight: 'bold', marginTop: 80, marginLeft: 20 }} >Hi {name}!</Text>
      <Text style={{fontSize: 15, marginLeft: 20, marginBottom: 20}} >Start typing to create a new task</Text>

        <TouchableOpacity onPress={ () => {resetMyApp()} } style={{ position: 'absolute', right: 20, top: 85}}>
            <Image source={settingsIcon} style={{width: 30, height: 30}} />
        </TouchableOpacity>


      {AlertSpec()}

      <View style={{display: 'flex', alignItems: 'center'}}>

        {/* <TaskComponenet text={'This is my task 1'} id={0} lineType={'line-through'} />
        <TaskComponenet /> */}

        <FlatList
          style={{width: vw(100), height: vh(100)}}
          contentContainerStyle={{display: 'flex', alignItems: 'center', marginBottom: 10}}
          data={ tasks }
          renderItem={ ({item}) => (<TaskComponenet key={item.id} text={item.value} lineType={item.dec} id={item.id} />) }
          extraData={rup} // to force flatlist to rerender
        />

      </View>

      <View style={{position: 'absolute', bottom: 30, width: vw(100) }}>
          <Text style={{fontSize: 15, marginBottom: -25, marginLeft: 35, display: viewTypeTxt}}>Click 'Done' when finished</Text>
        <View style={{display: 'flex', alignItems: 'center'}}>
          <TextInput
            style={{backgroundColor: '#fcfcfc', width: 300, height: 45, marginTop: 30, borderRadius: 10, paddingLeft: 10, borderColor: mainColor, borderWidth: 1}}
            onChangeText={onChangeText}
            value={text}
            placeholder={'Enter a task'}
            onSubmitEditing={makeTask}

          />
        </View>
      </View>


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
