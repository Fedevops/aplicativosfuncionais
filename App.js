import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView, 
  Platform,
  Keyboard,
  Alert,
  AsyncStorage


} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [task, setTask] = useState([]);/*Array para listar as tarefas*/
  const [newTask, setNewTask] = useState('');/*função para adicionar nova tarefa*/
  
  async function addTask() {/*Função assíncrona para adicionar Task*/
    if(newTask == ''){
      return;
    }
    const search = task.filter(task => task === newTask );/*Verificar se na tarefa digitada pelo user, se já existe uma tarefa igual */
      if(search.length != 0) {
          Alert.alert("Atenção", "Você já cadastrou essa tarefa");
          return;
      }
      setTask([...task, newTask]); /*incluir tarefa digitada pelo usuário junto as demais da lista*/
      setNewTask(""); /*limpar o campo input, após a tarefa ser incluída*/

    Keyboard.dismiss();/*Esconder o teclado*/

  }

  async function removeTask (item) {
    Alert.alert("Deletar Task", "Deseja mesmo remover esta tarefa?",
    [
      {
        text: "Cancel",
        onPress: ()=>{
          return;
        },
        style: 'cancel'
      },
      {
        text: "OK",
        onPress: () => setTask(task.filter(tasks => tasks != item))
      }
    ],
    { cancelable: false }
    );
    
  }

  useEffect(()=>{
    async function carregaDados(){
      const task = await AsyncStorage.getItem("task");

      if(task){
        setTask(JSON.parse(task));
      }
    }
    carregaDados();

  },[])
  useEffect (()=> {
    async function salvarDados(){
      AsyncStorage.setItem("task", JSON.stringify(task))
    }
    salvarDados();
  }, [task]);

  /*useEffect(() => {
    console.log(newTask);

    }, [newTask])///Trecho para debugar no console, as alterações da propriedade OnchangeText*/

  return (
 

    <>
    <KeyboardAvoidingView /*propriedade para o teclado não cobrir a área das tasks*/
      keyboardVerticalOffset={0}
      style={{ flex: 1 }}
      
    >
      <View style={styles.container}> 
        <View style={styles.Body}>
          <FlatList style={styles.FlatList}
          data={task}
          keyExtractor={item => item.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.ContainerView}>
              <Text style={styles.Texto}>{item}</Text>
              <TouchableOpacity onPress={() => removeTask(item)}>
                <MaterialIcons name="delete-forever" size={24} color="red"/>

              </TouchableOpacity>
            </View>
          
          
            )}
          />
        </View>
      
        <View style={styles.Form}>
          <TextInput style={styles.Input}
          placeholderTextColor="#999"
          autoCorrect={true}
          placeholder="Adicione uma tarefa"
          maxLength={25}
          onChangeText={text => setNewTask(text)}
          value={newTask}
          />
          <TouchableOpacity style={styles.Button} onPress={() =>addTask()}>
            <MaterialIcons name="add-task" size={24} color="white"/>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.TextProd}>Lista de Tarefas by Fernando Silva (11) 95438-5880</Text>
        </View>
      </View>
      </KeyboardAvoidingView>
    </>
         
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20

  },

  Body: {
    flex: 1
  },
  Form: {
    padding: 0,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: '#eee',
    

  },
  Input: {
    flex: 1,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#eee'

  },
  Button:{
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c6cce',
    borderRadius: 4,
    marginLeft: 10

  },
  FlatList: {
    flex: 1,
    marginTop: 5

  },
  ContainerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    backgroundColor: '#eee',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    borderWidth: 1,
    borderColor: '#eee',


  },
  Texto: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    marginTop: 4,
    textAlign:'center'

  },
  TextProd:{
    fontSize: 10,
    color: "gray",
    justifyContent: 'center',
    textAlign:'center'
  }

});
