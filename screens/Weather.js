import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Pressable, Image, ActivityIndicator, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchWeatherApi } from 'openmeteo';
import { useFonts } from 'expo-font';
import HourlyForecastRow from '../componentFolder/weatherComponents/HourlyForecastRow';
import WeeklyForecastColumn from '../componentFolder/weatherComponents/WeeklyForecastColumn'

const Stack = createStackNavigator(); //set navigation 

/***************************************************************/
////*********************WEATHER SCREEN***********************///
/***************************************************************/
//This page display weather forecast
function WeatherScreen({ route, navigation }){
    const { username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {username, profilePic});//navigate to profile page, passing parameters
    };

    //use assets's font
    const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), //light
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), //medium
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), //bold
    });

    //constants variables
    const[weatherData, setWeatherData] = useState(null); //set weather data state null
    const[loading, setLoading] = useState(true); //set loading state true
    const [hourlyData, setHourlyData] = useState([]); //set hourly data state
    const now = new Date(); //set current date
    const hour = now.getHours(); //set current hours
    const isDay = hour>= 6 && hour < 18; //set a day for 6 hours

    //extract weather data
    //get weather info is called with the weather code
    //and a boolean that indicating day or night
    const weatherInfo = weatherData        
    ? getWeatherInfo(weatherData.code, isDay)
    : null; 

    //function to display image of weather forecast
    function getWeatherInfo(code, isDay)
    { 
        //round the weather code to the nearest integer
        const weatherCode = Math.round(code);

        //display images if weather code indicate clear and sunny weather
        if(weatherCode === 0){
            return isDay
            ? { label: "Sunny", image: require("../img/weatherIcons/sunny.png")}
            : { label: "Clear Night", image: require("../img/weatherIcons/nighty.png")};
        }

        //display images if weather code indicate cloudy and night weather
        if([1, 2, 3, 10].includes(weatherCode)){
            return isDay
            ? { label: "Cloudy", image: require("../img/weatherIcons/cloudy.png")}
            : { label: "Night", image: require("../img/weatherIcons/nighty.png")};
        }

        //display images if weather code indicate rainy weather
        if([61, 63, 65].includes(weatherCode)){
            return { label: "Rainy", image: require("../img/weatherIcons/rainy.png")};
        }

        //display images if weather code indicate thunderstorm weather
        if([95, 96, 99].includes(weatherCode)){
            return { label: "Thunderstorm", image: require("../img/weatherIcons/thunder.png")};
        }

        //display images if weather code indicate foggy and night weather
        if([45, 48].includes(weatherCode)){
            return isDay
            ? { label: "Foggy", image: require("../img/weatherIcons/foggy.png")}
            : { label: "Night", image: require("../img/weatherIcons/nighty.png")};
        }

        //display images if weather code indicate windy and night weather
        return isDay
            ? { label: "Windy", image:require("../img/weatherIcons/windy.png")}
            : { label: "Night", image: require("../img/weatherIcons/nighty.png")};
    }

    //use effect hooking on display weather based on current location
    useEffect(() => {
        async function getWeather(){
            try{
                const params = {
                    latitude: 52.52, //asia latitude
                    longitude: 13.41, //asia longitude
                    hourly: ["weathercode", "wind_speed_10m", "relative_humidity_2m", "temperature_2m"], //extract the data of wind, humidity and temperature
                    current_weather: true, //set the current weather true
                    //current: ["weather_code", "temperature_2m", "relative_humidity_2m", "wind_speed_10m", "is_day"],
                    timezone: "Asia/Singapore", //set time zone to singapore and asia coordination
                };

                //API URL Link
                const url = "https://api.open-meteo.com/v1/forecast";
                const responseRaw = await fetch( //fetch the parameter
                    `${url}?latitude=${params.latitude}&longitude=${params.longitude}`+
                    `&hourly=${params.hourly.join(",")}` +
                    `&current_weather=true&timezone=${params.timezone}`
                )
                const data = await responseRaw.json(); //parse on JSON response
                const current = data.current_weather; //extract the current weather data

                //update state with current weather info
                setWeatherData({
                    temp: current.temperature, //current temperature
                    humidity: data.hourly.relative_humidity_2m ? data.hourly.relative_humidity_2m[0] : 0, //current humidity speed 
                    wind: data.hourly.wind_speed_10m ? data.hourly.wind_speed_10m[0] : 0, //current wind speed
                    code:current.weathercode, //weather code for condition
                    isDay: current.is_day === 1, //day or night indicator
                });

                //get current local hour
                const now = new Date(); //current day
                const currentHour = now.getHours(); //current hour
                //extract arrays of times, weather codes, and temperatures
                const times = data.hourly.time; //current hour
                const weathercodes = data.hourly.weathercode; //current weather
                const temps = data.hourly.temperature_2m; //current temperature
                //find the index of the current hour in the hourly data
                const startIndex = times.findIndex(t => new Date(t).getHours() === currentHour);
                //prepare an array to hold the forecast data for the next few hours and display them in container
                const sliceData = []; //set array for slice data
                for(let i = startIndex; i < startIndex + 5; i++){
                    if(times[i]){
                        sliceData.push({
                            time: new Date(times[i]).getHours(), //hour of the forecast
                            weathercode: weathercodes[i], //weather condition code
                            temperature: temps[i], //temperature at that hours
                        });
                    }
                }
                //update state with hourly forecast data
                setHourlyData(sliceData);
            }catch(error){
                //catch an exception to display console error message
                console.error(error);
            }finally{
                //set loading state to false
                setLoading(false);
            }
        }
        //extratc the function of get weather
        getWeather();
    }, []); //empty the dependency to prevent memory leaks

    //if the loading state is true, enabling the activity indicator
    if(loading)
    {
        return(
            <View style={styles.container}>
                {loading ? (
                <ActivityIndicator size='large' color="#4791c9" style={{marginTop:50}}/>
                ) : null}
            </View>
        );
    }

    //if the weather data is empty, display error message
    if(!weatherData)
    {
        return(
            <View style={styles.container}>
                <Text style={styles.loadingText}>Failed To Load The Weather Page. Try Again.</Text>
            </View>
        );
    }

    return(
        <LinearGradient
        colors={['#4c79ff', '#ffffff']}
        location={[0, 0.5, 1]}
        start={{ x:0.5, y:0}}
        end={{ x:0.5, y:1.5}}
        style={styles.gradientBackground}
        >
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerRow}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Ionicons name = "arrow-back" size={24} color="black"/>
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
                <View style={styles.container}>

                    {/**WEATHER IMAGE ICON */}
                    <View style={styles.currentWeatherBox}>
                        <Image
                            source={weatherInfo.image}
                            style={styles.currentWeatherImage}
                        />
                        <Text style={styles.currentWeatherText}>
                            {weatherInfo.label}
                        </Text>
                    </View>
                    <View style={styles.tempRow}>

                        {/**TEMPERATURE */}
                        <View style={styles.tempCard}>
                            <Ionicons name="thermometer-outline" size={28} color="#b50000"/>
                            <Text style={styles.tempLabel}>Temp</Text>
                            <Text style={styles.value}>{weatherData.temp.toFixed()}°C</Text>
                        </View>

                        {/**HUMIDITY */}
                        <View style={styles.tempCard}>
                            <Ionicons name="water-outline" size={28} color="#3500b5"/>
                            <Text style={styles.tempLabel}>Humidity</Text>
                            <Text style={styles.value}>{weatherData.humidity.toFixed(1)}°C</Text>
                        </View>

                        {/**WIND */}
                        <View style={styles.tempCard}>
                            <Ionicons name="leaf-outline" size={28} color="#24b500"/>
                            <Text style={styles.tempLabel}>Wind</Text>
                            <Text style={styles.value}>{weatherData.wind.toFixed(1)} km/h</Text>
                        </View>
                    </View>
                    {hourlyData.length > 0 && <HourlyForecastRow data={hourlyData}/>}
                    <View>
                        <WeeklyForecastColumn/>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
}

export default WeatherScreen;

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

    //WEATHER BOX TOP
    currentWeatherBox:{
        alignItems: 'center',
        marginBottom: 5,
    },

    currentWeatherText:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 5,
    },

    currentWeatherImage:{
        width: 55,
        height: 55,
        resizeMode: 'contain',
    },

    //TEMPERATURE, HUMIDITY and WIND
    tempRow:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 45,
        overflow: 'hidden',
    },

    tempCard:{
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },

    tempLabel:{
        fontSize: 14,
        color: '#ffffff',
        marginTop: 6,
    },

    value:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 4
    },

    //LOADING
    loadingText:{
        textAlign:'center',
    }
})