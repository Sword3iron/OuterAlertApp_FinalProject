import React, {useEffect, useRef, useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Pressable, ScrollView, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { ThemeContext } from '../componentFolder/colorComponent/ThemeContext';

const Stack = createStackNavigator(); //set navigation 
const { width } = Dimensions.get('window'); //set dimentsion of the width as the size of the mobile window
 
//This function is used to display the headlines on the notification box
const HeadlinesBar = () => { //notification bar function
    //constant variables
    const isMounted = useRef(true); //mounting set to false
    const [headlines, setHeadlines] = useState([]); //headlines display
    const [currentHeadline, setCurrentHeadline] = useState(0); //current headlines display
    const [loading, setLoading] = useState(true); //loading state set to true

    //API URL link
    const API_URL = "https://newsdata.io/api/1/latest?apikey=pub_48a2d8ea54554f75ad27fd6b4a9b7f4e&q=disaster%2Cnatural%2Clocal%2Casia"
    
    //use effect hooking on news headlines
    useEffect(() => {
        //function to fetch the headlines
        const fetchHeadlines = async () => {
            try{
                const response = await fetch(API_URL); //make a fetch request
                const json = await response.json(); //parse the response
                if(json.results){  //if the json parse contain result
                    //extract first three article headline 'title'
                    const threeHead = json.results.slice(0, 3).map(item => item.title || "No Title");
                    setHeadlines(threeHead); //update state with the fetched headlines
                }else{
                    setHeadlines([]); //if no result, clear the array
                }
            }catch(error){
                //catch an exception of the error and log during fetch process
                console.error("Error", error);
            }finally{
                //set loading to false after fetching completes
                setLoading(false);
            }
        };
        fetchHeadlines(); //call the fetch headlines function
    }, []); //empty dependency of the array to ensure that it runs on the component mount

    //use effect hooking on mounting news headlines
    useEffect(() => {  
        if(!headlines.length) return; //exit early if there are no headlines
        const interval = setInterval(() => { //set up an interval to update the current headline every 4 seconds
            if(!isMounted.current) return; //return if the component is still mounted before updating state
            setCurrentHeadline(prev => (prev + 1) % headlines.length); //set current headlines to update the previous to current headline
        }, 4000); // = 4 seconds

        return() => {
            isMounted.current = false; //mark the component to false to dismount
            clearInterval(interval); //set the function of clearing time interval to prevent memory leak
        }
    }, [headlines]); //rerun the hook effect when headlines change

    return(
        //Display notification bar
        <View style={styles.notificationBar}>
            {loading ? (
                <ActivityIndicator size="small" color="#4791c9"/>
            ): headlines.length > 0 ? (
                <Text style={styles.notificationText} numberOfLines={1}>
                    {headlines[currentHeadline]}
                </Text>
            ) : (
                <Text style={styles.notificationText}>Loading....</Text>
            )}
        </View>
    );
};


/***************************************************************/
////************************HOME PAGE*************************///
/***************************************************************/
//The main homepage
function HomeScreen({ route, navigation }){ 
    const { userId, username, profilePic, level } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?';  //if not profile picture, display first letter avatar of username

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //extracting font families 
    const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), //light inter
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), //medium inter
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), //bold inter
    });

    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic, level}); //navigate to profile page, passing parameters
    };
    
    return(
        <LinearGradient
            colors={colors.gradient1}
            location={[0, 0.5, 1]}
            start={{ x:0.5, y:0}}
            end={{ x:0.5, y:1}}
            style={styles.gradientBackground} 
        >
            <View style={styles.screenContainer}>
                <View style={styles.headerContainer}>
                        <View style={styles.headerRow}>
                            <Text style={styles.welcomebackText}>
                                Welcome Back, {username}
                            </Text>
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

                {/*FEATURES CONTAINER*/}
                <ScrollView contentContainerStyle={styles.container}>    

                    {/*HEADLINES*/}
                    <HeadlinesBar/> 
                    
                    {/*NEWS*/}
                    <Pressable
                         onPress={()=> navigation.navigate('News')}
                         style={({ pressed }) => [
                             styles.bottomRectangle,
                             pressed && {opacity: 0.7}
                         ]}
                    >
                         <Image
                            source={require('../img/thumbnails/news_thumbnail.png')}
                            resizeMode='cover'
                            style={styles.rectangleBottomImage}
                        />
                            <Text style = {styles.sectionBottomText}>NEWS</Text>
                    </Pressable>
                    
                    {/*MIDDLE FEATURES CONTAINER*/}
                    <View style = {styles.middleSquaresContainer}>
                        
                        {/**SOS EMERGENCY CALL */}
                        <Pressable
                            onPress={()=> navigation.navigate('SosCall')}
                            style={({ pressed }) => [ 
                                styles.square, 
                                pressed && { opacity: 0.7 }
                            ]}
                            >
                            <Image
                                source={require('../img/thumbnails/call_thumbnail.png')}
                                resizeMode='cover'
                                style={styles.squareImage}
                            />
                            <Text style = {styles.sectionText}>CALL</Text>
                        </Pressable>

                        {/**NOTIFICATION HUB*/}
                        <Pressable
                            onPress={()=> navigation.navigate('Notification')}
                            style={({ pressed }) => [
                                styles.square,
                                pressed && { opacity: 0.7 }
                            ]}
                            >
                            <Image
                                source={require('../img/thumbnails/noti_thumbnail.png')}
                                resizeMode='cover' 
                                style={styles.squareImage}
                            />
                            <Text style = {styles.sectionText}>ALERT</Text>
                        </Pressable>
                        

                        {/**TIPS & TRICKS HUB */}
                        <Pressable
                            onPress={()=> navigation.navigate('TipsHack')}
                            style={({ pressed }) => [
                                styles.square,
                                pressed && { opacity: 0.7 }
                            ]}
                            >
                            <Image
                                source={require('../img/thumbnails/hacks_thumbnail.png')}
                                resizeMode='cover'
                                style={styles.squareImage}
                            />
                            <Text style = {styles.sectionText}>HACKS</Text>
                        </Pressable>

                        {/**QUIZ HUB */}
                        <Pressable
                            onPress={()=> navigation.navigate('Quiz')}
                            style={({ pressed }) => [
                                styles.square,
                                pressed && { opacity: 0.7 }
                            ]}
                            >
                            <Image
                                source={require('../img/thumbnails/quiz_thumbnail.png')}
                                resizeMode='cover'
                                style={styles.squareImage}
                            />
                            <Text style = {styles.sectionText}>QUIZ</Text>
                        </Pressable>
                    </View>

                    {/*FEATURES CONTAINER*/}     
                    {/**WEATHER HUB */}
                    <Pressable
                        onPress={()=> navigation.navigate('Weather')}
                        style={({ pressed }) => [
                            styles.bottomRectangle,
                            pressed && {opacity: 0.7}
                        ]}
                    >
                        <Image
                            source={require('../img/thumbnails/weather_thumbnail.png')}
                            resizeMode='cover'
                            style={styles.rectangleBottomImage}
                        />
                        <Text style = {styles.sectionBottomText}>WEATHER</Text>
                    </Pressable>
                        
                    {/**CHECKLIST HUB */}
                    <Pressable
                        onPress={()=> navigation.navigate('Checklist')}
                        style={({ pressed }) => [
                            styles.bottomRectangle,
                            pressed && {opacity: 0.7}
                        ]}
                    >
                        <Image
                            source={require('../img/thumbnails/checklist_thumbnail.png')}
                            resizeMode='cover'
                            style={styles.rectangleBottomImage}
                        />
                        <Text style = {styles.sectionBottomText}>CHECKLIST</Text>
                    </Pressable> 
                    <View style = {styles.marginBottomView}></View>
                    <StatusBar style = "auto"/>
                </ScrollView> 
            </View> 
        </LinearGradient>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({

    //NORMAL
    screenContainer:{
        flex: 1,
    },

    container:{
        flex: 1,
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

    welcomebackText:{
        color: "#646464",
        fontSize: 16,
        fontWeight: '500',
        marginTop: 15,
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

    /**NEWS HEADLINES */
    notificationBar:{
        width: "98%",
        height: 50,
        backgroundColor: '#ffffad',
        overflow: 'hidden',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginBottom: 15,
    },

    notificationText:{
        fontSize: 16,
        color: '#000000',
        position:'relative',
    },

    /**CONTAINER */

    container:{
        padding: 16,
        alignItems: 'center',
        paddingTop: 20,
    },

    topRectangle:{
        width:'100%',
        height: 150,
        backgroundColor: '#FFA500',
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 8,
        borderWidth: 1,
        shadowColor: "#000000",
        shadowOpacity: 0.01,
        shadowOffset: { width: 10, height: 10},
        shadowRadius: 1,
        elevation: 5
    },

    middleSquaresContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        height: 190,
        marginTop: 0,
        marginBottom: 25,
    },
    
    square:{
        width: '48%',
        aspectRatio:1,
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: "#000000",
        shadowOpacity: 0.01,
        shadowOffset: { width: 0, height: 1},
        shadowRadius: 1,
        elevation: 5
    },

    squareImage:{
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
    },

    squareText:{
        color:'#fff',
        fontsize: 14,
    },

    bottomRectangle: {
        width: '100%',
        height: 150,
        backgroundColor: '#87CEEB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: "#000000",
        shadowOpacity: 0.01,
        shadowOffset: { width: 0, height: 1},
        shadowRadius: 1,
        elevation: 5
    },

    rectangleBottomImage:{
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },

    sectionText:{
        color:'#fff',
        fontsize: 10,
        fontFamily: 'boldInter',
        marginRight: 80,
    },

    sectionBottomText:{
        color:'#fff',
        fontSize: 19,  
        fontFamily: 'boldInter',
        marginRight: 100,
    },

    gradientBackground:{
        flex:1
    },

    marginBottomView:{
        marginBottom: "20%",
    },  

});