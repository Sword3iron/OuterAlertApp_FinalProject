import React , {useContext} from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import call from 'react-native-phone-call';
import { useFonts } from 'expo-font';   
import { ThemeContext } from '../componentFolder/colorComponent/ThemeContext';

const Stack = createStackNavigator(); //set navigation 
 
/***************************************************************/
////*********************SOS CALL SCREEN**********************///
/***************************************************************/
//Sos Call Page allow users to engage with first-responders

function SosCallResponders({route, navigation}){
    const { userId, username, profilePic } = route.params || {}; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

     //use assets's font
     const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), //light
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), //medium
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), //bold
    });

    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic});//navigate to profile page, passing parameters
    };

    //function to make the phone call based on the parameter of number
    const makePhoneCall = (number) => {
        //constant variable for calls number
        const args = {
            number: number, //number
            prompt: true, //set prompting call to ture
        };
        call(args).catch(console.error) //if call not engaged, put out console error
    };

    return (
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
                            onPress={handleProfilePage}
                        >
                            <View style={styles.profileImageContainer}>
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
                        <Text style ={[styles.titleText, {color: colors.text}]}>S.O.S EMERGENCY CALL</Text>
                    </View>

                    <View style = {styles.squareContainer}>

                        {/**PARAMEDIC*/}
                        <Pressable
                            style={({ pressed }) => [
                                styles.square,
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={() => makePhoneCall('999')}
                        >
                        <Image
                            source={require('../img/publicServant/red_crrescent.png')}
                            resizeMode='cover'
                            style={styles.squareImage}
                        />
                        <Text style = {styles.sectionBottomText}>PARAMEDIC</Text>
                        </Pressable>
                        
                        
                        {/**POLICE*/}
                        <Pressable
                            style={({ pressed }) => [
                                styles.square,
                                pressed && { opacity: 0.7 }
                            ]}
                                onPress={() => makePhoneCall('999')}
                        >
                        <Image
                            source={require('../img/publicServant/police.png')}
                            resizeMode='cover'
                            style={styles.squareImage}
                        />
                        <Text style = {styles.sectionBottomText}>POLICE</Text>
                        </Pressable>

                        {/**FIRE FIGHTERS */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.square,
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={() => makePhoneCall('999')}
                        >
                        <Image
                            source={require('../img/publicServant/firefighters.png')}
                            resizeMode='cover'
                            style={styles.squareImage}
                        />
                        <Text style = {styles.sectionBottomText}>FIRE FIGHTERS</Text>
                        </Pressable>

                        {/**PUBLIC SERVICE */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.square,
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={() => makePhoneCall('999')}
                        >
                        <Image
                            source={require('../img/publicServant/publicservice.png')}
                            resizeMode='cover'
                            style={styles.squareImage}
                        />
                        <Text style = {styles.sectionBottomText}>PUBLIC SERVICE</Text>
                        </Pressable>

                        {/**MARITIMES */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.square,
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={() => makePhoneCall('999')}
                        >
                        <Image
                            source={require('../img/publicServant/maritimes.png')}
                            resizeMode='cover'
                            style={styles.squareImage}
                        />
                        <Text style = {styles.sectionBottomText}>MARITIMES</Text>
                        </Pressable>

                        {/**ST.JOHN */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.square,
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={() => makePhoneCall('0137056504')}
                        >
                        <Image
                            source={require('../img/publicServant/stjohn.png')}
                            resizeMode='cover'
                            style={styles.squareImage}
                        />
                        <Text style = {styles.sectionBottomText}>ST.JOHN</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
        </LinearGradient>
    );
}


/***************************************************************/
////********************STACK SCREEN**************************///
/***************************************************************/
function SosCallPage({ route }){
    //parameters of users' data
    const { userId, username, profilePic } = route.params;

    //Stack Navigation
    return(
        <Stack.Navigator screenOptions={{ headerShown:false }}> 
            <Stack.Screen name="SosCallResponders" component={SosCallResponders} initialParams={{ userId, username, profilePic }}/>
        </Stack.Navigator>
    )
}
export default SosCallPage;

const styles = StyleSheet.create({

    //NORMAL
    container:{
        flex: 1,
    },

    scrollContainer:{
        padding: 16,
        alignItems: 'center',
        paddingTop: 20,
    },

    text: {
        fontSize: 20,
        fontWeight:'bold'
    },

    gradientBackground:{
        flex:1
    },

    titleText:{
        fontSize: 15,
        fontWeight:'bold',
        marginBottom: 25,
    },

    headerContainer:{
        paddingHorizontal: 20,
        marginTop: '13%',
        marginBottom: '2%',
        alignSelf:'stretch',
    },

    headerRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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

    //CALL PAGE
    squareContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        marginTop:15,
        marginBottom: 15,
    },

    square:{
        width: '48%',
        aspectRatio:1,
        backgroundColor: '#f2f2f0',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 35,
        borderWidth: 2,
        borderColor: '#ff5733',
        overflow: 'hidden',
        position: 'relative',
    },

    squareImage:{
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },

    sectionBottomText:{
        color:'#000000',
        fontSize: 10,  
        fontFamily: 'monospace',
        fontWeight: '700',
        marginTop: 10,
    },
});