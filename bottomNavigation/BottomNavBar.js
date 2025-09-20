import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from "react-native";
 
/**ALL SCREEN PAGES */
import SosCallPage from "../screens/SosCall";
import HomeScreen from "../screens/Home";
import NotificationScreen from '../screens/Notification';
import ProfilePage from '../screens/Profile';
import QuizStack from "../screens/Quiz";
import WeatherScreen from "../screens/Weather";
import TipsHackScreen from "../screens/TipsHack";
import ChecklistScreen from "../screens/Checklist";
import NewsScreen from "../screens/News";

//create a bottom bar navigator
const Tab = createBottomTabNavigator();

/***************************************************************/
////*****************BOTTOM BAR NAVIGATION********************///
/***************************************************************/
function BottomTabNavigator({route}) {
    const { userId, username, profilePic, level, checklistId } = route.params || {};

    return(
        <Tab.Navigator
            screenOptions={{
                headerShown: false, //undisplay header
                tabBarShowLabel: false, //undisplay label
                tabBarStyle: styles.bottomTabBar, //styling tab bar
                tabBarActiveTintColor: '#63dce3', //color for active page
                tabBarInactiveTintColor: '#999', //color for inactive page
            }}
        >
            {/**HOME */}
            <Tab.Screen name="Home" 
                        component={HomeScreen} 
                        initialParams={{userId, username, profilePic, level}}  
                        options={{tabBarIcon:({color, size}) => (
                <Ionicons name="home-outline" color={color} size = {30}/>
                ),
            }}/>

            {/**SOS CALL */}
            <Tab.Screen name="SosCall" 
                        component={SosCallPage}
                        initialParams={{userId, username, profilePic, level}}  
                        options={{tabBarIcon:({color, size}) => (
                <Ionicons name="call-outline" color={color} size = {30}/>
                ),
            }}/>

            {/**NOTIFICATION */}
            <Tab.Screen name="Notification" 
                        component={NotificationScreen} 
                        initialParams={{userId, username, profilePic, level}}  
                        options={{tabBarIcon:({color, size}) => (
                <Ionicons name="notifications-outline" color={color} size = {30}/>
                ),
            }}/>
            
            {/**PROFILE */}
            <Tab.Screen name="Profile" 
                        component={ProfilePage} 
                        initialParams={{userId, username, profilePic, level}} 
                        options={{tabBarIcon:({color, size}) => (
                <Ionicons name="person-outline" color={color} size = {30}/>
                ),
            }}/>

            {/**QUIZ */}
            <Tab.Screen
                name="Quiz"
                component={QuizStack}
                initialParams={{ userId, username, profilePic, level}}
                options = {{
                    tabBarButton: () => null,
                    tabBarItemStyle: {display: 'none'},
                    tabBarStyle: styles.bottomTabBar,
                    headerShown: false,
                }}
            />

            {/**WEATHER */}
            <Tab.Screen
                name="Weather"
                component={WeatherScreen}
                initialParams={{ userId, username, profilePic, level}}
                options = {{
                    tabBarButton: () => null,
                    tabBarItemStyle: {display: 'none'},
                    tabBarStyle: styles.bottomTabBar,
                    headerShown: false,
                }}
            />

            {/**TIPS AND HACK */}
            <Tab.Screen
                name="TipsHack"
                component={TipsHackScreen}
                initialParams={{ userId, username, profilePic, level}}
                options = {{
                    tabBarButton: () => null,
                    tabBarItemStyle: {display: 'none'},
                    tabBarStyle: styles.bottomTabBar,
                    headerShown: false,
                }}
            />

            {/**CHECKLIST */}
            <Tab.Screen
                name="Checklist"
                component={ChecklistScreen}
                initialParams={{ userId, username, profilePic, level, checklistId }}
                options = {{
                    tabBarButton: () => null,
                    tabBarItemStyle: {display: 'none'},
                    tabBarStyle: styles.bottomTabBar,
                    headerShown: false,
                }}
            />

            {/**NEWS */}
            <Tab.Screen
                name="News"
                component={NewsScreen}
                initialParams={{ userId, username, profilePic, level}}
                options = {{
                    tabBarButton: () => null,
                    tabBarItemStyle: {display: 'none'},
                    tabBarStyle: styles.bottomTabBar,
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
}

export default BottomTabNavigator;

const styles = StyleSheet.create({

    //BOTTOM BAR NAVIGATION
    bottomTabBar:{
        height: '10.5%',
        borderTopWidth: 0,
        backgroundColor: "#fff",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        marginHorizontal: 0,
        marginBottom: 0,
        paddingTop: 15,
        position: "absolute",
        overflow: 'hidden',
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2}
    },
    hiddenTabBar:{
        display:'none',
    },
});

