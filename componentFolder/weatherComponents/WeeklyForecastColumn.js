import React, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { fetchWeatherApi } from 'openmeteo';

/***************************************************************/
////*****************WEEKLY FORECAST ROW**********************///
/***************************************************************/
function WeeklyForecastColumn(){
 
    //use assets's font
    const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../../assets/font/static/Inter_18pt-Light.ttf'), //light
        mediumInter: require('../../assets/font/static/Inter_18pt-Medium.ttf'), //medium
        boldInter: require('../../assets/font/static/Inter_18pt-Bold.ttf'), //bold
    });

    //API URL Link
    const url = "https://api.open-meteo.com/v1/forecast";

    //constant variables
    const [forecastData, setForecastData] = useState([]); //set forecast data state
    const [loading, setLoading] = useState(true); //set loading state true
    const latitude = 52.52; //asia latitude
    const longitude = 13.41; //asia longitude

    //use effect hooking on fetch weather data
    useEffect(() => {
        //url parameter for mounting data
        fetch(
            `${url}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&start_date=${getToday()}&end_date=${getEndDate()}&timezone=auto`
        )
        .then((res) => res.json()) //parse on JSON response
        .then((data) => {
            //extract hourly data arrays
            const hourlyTemps =data.hourly.temperature_2m; //temperature
            const hourlyWeatherCodes = data.hourly.weathercode; //hour weather code
            const hourlyTimes = data.hourly.time; //hour time
            let dailyWeatherData = [];//array of weather data
            
            //loop through for every hourly times to pick data at noon
            for (let i=0; i<hourlyTimes.length; i++){
                if(hourlyTimes[i].endsWith('12:00')){
                    //create a summary object for every noon entry
                    dailyWeatherData.push({
                        date: hourlyTimes[i].split('T')[0], //extract date part
                        temperature: hourlyTemps[i], //temperature for hourly time
                        weatherCode: hourlyWeatherCodes[i], //weather code for hourly time
                    });
                }
            }

            //update state with the daily forecast data
            setForecastData(dailyWeatherData); //set the forecast data
            setLoading(false);//set the loading state false
        })
        //catch an exception to display error
        .catch((err) => {
            console.error(err); //display console message
            setLoading(false); //set loading state to false
        })
    }, []);//clear array to prevent memory leak

    //function to get today date in ISO String
    function getToday(){
        return new Date().toISOString().split('T')[0];
    }

    //function to get end date ater 6 days for forecasts
    function getEndDate(){
        const d = new Date();
        d.setDate(d.getDate() + 6);
        return d.toISOString().split('T')[0];
    }

    //function to determine weather icon
    function getWeatherIcon(code){
        if ([0].includes(code)) return 'sunny'; //sunny
        if ([1, 2, 3].includes(code)) return 'partly-sunny'; //partly icon
        if ([45, 48].includes(code)) return 'cloudy'; //cloudy
        if ([51, 53, 55].includes(code)) return 'rainy'; //rainy
        if ([61, 63, 65].includes(code)) return 'rainy'; //rainy
        if ([80, 81, 82].includes(code)) return 'rainy'; //rainy
        if ([95, 96, 99].includes(code)) return 'thunderstorm'; //thunderstorm
        return 'cloud-outline'; //default cloudy icons
    }

    //function to get the name of the weekday for a given date
    function getWeekdayName(dateString){
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {weekday: 'long'});
    }

    //set the loading state
    if(loading){
        return<ActivityIndicator size='large' color="#4791c9" />
    }

    return(
        <View style = {styles.dayContainer}>
            <LinearGradient
                colors={['#63DCE3', '#37797D']}
                location={[0, 0.5, 1]}
                start={{ x:0, y:0.5}}
                end={{ x:0.9, y:1}}
                style={styles.hourlyGradientBackground}
                >

                {/**WEEKLY CONTAINER */}
                <FlatList
                    data={forecastData}
                    keyExtractor={item=>item.date}
                    renderItem={({ item }) => (
                    <View style={styles.dayRow}>
                            <Text style={styles.dayText}>
                                {getWeekdayName(item.date)}
                            </Text>
                            <Ionicons
                                name={getWeatherIcon(item.weatherCode)}
                                size={24}
                                color="#77fce9"
                                style={styles.dayIcon}
                            />
                            <Text style={styles.dayTemp}>{item.temperature} °C</Text>
                        </View>
                    )}
                />
            </LinearGradient>
        </View>
    );
}

export default WeeklyForecastColumn;

const styles = StyleSheet.create({

    //NORMAL
    hourlyGradientBackground:{
        borderRadius: 12,
        paddingHorizontal: 10,
        padding: 20,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 1.25,
        shadowRadius: 0.84,
        elevation: 7,
    },

    dayContainer:{
        padding: 5,
        marginTop: 5,
        marginHorizontal: 20,
    },

    dayRow:{    
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
        marginHorizontal: 6,
        justifyContent: 'space-between',
        
    },

    dayText:{
        flex: 1,
        fontSize: 16,
        fontFamily: 'boldInter',
    },

    dayIcon:{
        width: 30,
        textAlign: 'center',
    },

    dayTemp:{
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'boldInter',
        textAlign: 'right',
    },
});
