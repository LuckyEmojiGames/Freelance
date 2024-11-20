import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Button, StyleSheet, Text } from 'react-native';
import HomeScreen from '../Screens/HomeScreen';
import MessageListChatScreen from '../Screens/MessageListScreen';
import CreateProjectScreen from '../Screens/CreateProjectScreen';
import { Entypo, FontAwesome5, AntDesign } from '@expo/vector-icons';
import ClientScreen from '../Screens/ClientScreen';
import axios from 'axios';
import { BASE_URL } from '../Components/config';
import FreelancerProfileScreen from '../Screens/FreelancerProfileScreen';
import { useNavigation } from '@react-navigation/native';


const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {
  const navigation = useNavigation();
  const [showCreateProject, setShowCreateProject] = useState(true);
  const [userType, setUserType] = useState("");

  const getUserType = () => {
    axios.get(`${BASE_URL}/whoami`).then((res) => {
      (res.data.user.userType == "freelancer") ? setShowCreateProject(false) : setShowCreateProject(true)
      setUserType(res.data.user.userType)
      console.log(showCreateProject)
    }).catch((err) => {
      console.log(err);
    })
  }
  useEffect(() => {
    getUserType();
  }, [])

  const handleOnChatIconPress = () =>{
    navigation.navigate("MessageListChatScreen")
  }

  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: {
        position: 'absolute',
        elevation: 2,
        borderTopColor: "transparent",
        backgroundColor:"#040B18CC",
        borderTopRightRadius:15,
        borderTopLeftRadius:15,
      },
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "white",
      tabBarActiveBackgroundColor: "black"
    }} initialRouteName="Home" >
      <Tab.Screen
          name="Задания"
          component={HomeScreen}
          options={{
            headerTitleAlign: "center",
            header: () => (
              <View style={styles.header}>
                <View style={styles.buttonContainer}>
                  <Button title="Menu" onPress={() => console.log("Menu button pressed")} />
                  <Button title="Add" onPress={() => console.log("Add button pressed")} />
                  <Button title="Ando" onPress={() => console.log("Add button pressed")} />
                </View>
                <Text style={styles.headerTitle}>Задания</Text> 
              </View>
            ),
            headerTitleStyle: {
              color: "white",
              fontWeight: "bold",
            },
            headerStyle: {
              backgroundColor: "black",
            },
            tabBarIcon: () => <Entypo name='check' size={24} color="white" />
          }}
        />
      <Tab.Screen name="Финансы" component={ClientScreen} options={{
        headerShown: false,
        tabBarIcon: () => <Entypo name='wallet' size={24} color="white" />
      }} />
      <Tab.Screen name="Вакансии" component={HomeScreen} options={{
        headerShown: false,
        tabBarIcon: () => <Entypo name='bucket' size={24} color="white" />
      }} />
      <Tab.Screen name="Еще" component={MessageListChatScreen} options={{
        headerShown: false,
        tabBarIcon: () => <Entypo name='message' size={24} color="white" />
      }} />
      {showCreateProject && (<Tab.Screen name="CreateProject" component={CreateProjectScreen} options={{
        headerShown: false,
        tabBarIcon: () => <AntDesign name="plussquare" size={24} color="white" />
      }} />)}
      {userType == "client" && (<Tab.Screen name="UserProfile" component={ClientScreen} options={{
        headerShown: false,
        tabBarIcon: () => <FontAwesome5 name="user-alt" size={24} color="white" />
      }} />)}
      {/* {userType == "freelancer" && (<Tab.Screen name="UserProfile" component={FreelancerProfileScreen} options={{
        headerShown: false,
        tabBarIcon: () => <FontAwesome5 name="user-alt" size={24} color="black" />
      }} />
      )} */}
      <Tab.Screen name="Назад" component={HomeScreen} options={{
        headerShown: true,
        headerRight : () =>(<Entypo onPress={() => {
          navigation.goBack();
        }} style = {{paddingRight : 10}} name='chat' size={24} color="white" />),
        tabBarIcon: () => <Entypo name='back' size={24} color="white" />
      }} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  header: {
    padding: 10,
    backgroundColor: "black",
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "white",
    marginTop: 5, // Add margin for spacing from buttons
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default BottomTabNavigator





