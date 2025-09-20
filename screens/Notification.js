import React, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../componentFolder/colorComponent/ThemeContext';

const Stack = createStackNavigator(); //set navigation 

/***************************************************************/
////****************NOTIFICATION PAGE*************************///
/***************************************************************/
//This page display current notification

function NotificationScreen({ route, navigation }){
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //constant variable
    const [notifications, setNotifications] = useState([]); //set notification state

    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic});//navigate to profile page, passing parameters
    }; 
  
    //API URL Link
    const API_URL = "https://newsdata.io/api/1/latest?apikey=pub_48a2d8ea54554f75ad27fd6b4a9b7f4e&q=disaster%2Cnatural%2Clocal%2Casia"
    
    //use effect hooking on fetching alert text
    useEffect(() => {
        //function to fetch alert
        const fetchAlert = async () => {
            try{
                //constant variable 
                const response = await fetch(API_URL);//make a fetch request via link
                const data = await response.json(); //parse the JSON response

                //check if the data contain result with at least one item
                if(data?.results?.length > 0){
                    const newAlert = data.results[0]; //extract first alert from the result
                    showNotification(newAlert.title); //show notification with the alert title
                }
            } catch(error){
                //catch an exception and log error if function handle got error
                console.error('Error', error);
            }
        };
        fetchAlert(); //call on fetch alert function to fetch data
    }, []); //empty dependencies to prevent memory leaks


    //function to show notifications
    const showNotification = (title) => {
        //constant variables
        const id = Date.now(); //generate unique ID based on the current timestamp
        const createdAt = new Date();//create a new date object for the purposes of time stamping
        const date = createdAt.toLocaleDateString(); //format the date as a locale specific string
        const time = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}); //format time as local specific string
        const newNotification = { id, title, date, time };//create notification object with relevent information

        //add new notifications objects to existing list of notifications
        setNotifications((prev) => [...prev, newNotification]); 
    };  

    //function to remove any notification by its ID
    const removeNotification = (id) => {
        //Filtering out previous notification with the matching ID
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.5, y:0}}
        end={{ x:0.5, y:1}}
        style={styles.gradientBackground}
        >
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerRow}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Icon name = "arrow-back" size={24} color="black"/>
                        </Pressable>
                        <TouchableOpacity
                                onPress= {handleProfilePage}
                        >
                            <View style = {styles.profileImageContainer}>
                                { profilePic ? (
                                    <Image
                                        source={{ uri: 'http://192.168.1.116/outeralert/picupload/' + profilePic}}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <View style = {styles.avatarCircle}>
                                        <Text style = {styles.avatarText}>
                                            {firstAvatar}
                                        </Text>
                                    </View>             
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContainer}>

                    {/**TITLE */}
                    <View>
                        <Text style ={[styles.titleText,{color:colors.text}]}>
                            ALERT & NOTIFICATION
                            </Text>
                    </View>

                    {/**NOTIFICATIONS DISPLAY */}
                    {notifications.map((notif) => (

                        <View key={notif.id} style={styles.paddingOutside}>
                            <View  style={styles.notificationBox}>
                                <Image
                                    source={require('../img/icons/warning.png')}
                                    resizeMode='cover'
                                    style={styles.warningImage}
                                />
                                <View style={styles.notificationBoxContainer}>
                                    <Text style={styles.notificationMessage}>
                                       {notif.title}
                                    </Text>

                                    <View style={styles.timelineRow}>
                                        <Text style={styles.dateText}>{notif.date}</Text>
                                        <Text style={styles.timeText}>{notif.time}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity 
                                style={styles.closebutton} 
                                onPress={() => removeNotification(notif.id)}
                            >
                                <Icon name="close" size={20} color="#333"/>
                            </TouchableOpacity>
                            </View>
                        </View>    
                    ))}
                </ScrollView>
            </View>
        </LinearGradient>
    );
}

export default NotificationScreen;

const styles = StyleSheet.create({

    //NORMAL
    container:{
        flex: 1,
    },

    gradientBackground:{
        flex: 1,
    },

    scrollContainer:{
        padding: 16,
        alignItems: 'center',
        paddingTop: 20,
    },

    headerContainer:{
        paddingHorizontal: 20,
        marginTop: '13%',
        marginBottom: '2%',
        alignSelf:'stretch',
    },

    headerRow:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },

    profileImageContainer:{
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
    },

    profileImage:{
        width:40,
        height:40,
        borderRadius:20,
    },

    avatarCircle:{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#cccccc',
        position: 'absolute',
    },

    avatarText:{
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
    },

    titleText:{
        fontSize: 15,
        fontWeight:'bold',
        marginBottom: 25,
    },

    paddingOutside:{
        paddingHorizontal: 20,
        alignItems: 'center',
    },

    //NOTIFICATION BOX
    notificationBox:{
        position: 'absolute',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingHorizontal: 15,
        paddingVertical: 20,
        flexDirection: 'row',
        alignitem:'flex-start',
        justifyContent: 'space-between',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width:0, height: 4},
        shadowRadius: 6,
        broderWidth: 1,
        borderColor: '#000000',   
    },

    warningImage:{
        width: 80,
        height: 80,
        marginRight: 12,
    },

    timelineRow:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    notificationBoxContainer:{
        flex: 1,
        flexDirection: 'column',
    },

    notificationMessage:{
        fontSize: 13,
        color: '#333333',
        marginTop: 5,
        marginBottom: 15
    },

    timeText:{
        fontSize: 12,
        marginRight: 10,
    },

    dateText:{
        fontSize: 12,
    },

    closebutton:{
        position: 'absolute',
        alignitem: 'center',
        justifyContent: 'center',
        top:3,
        right: 5,
        width: 25,
        height: 25, 
    },
});