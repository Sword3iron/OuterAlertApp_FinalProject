import React, {useContext} from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';

/***************************************************************/
////*****************HOUTLY FORECAST ROW**********************///
/***************************************************************/

//weather code for displaying image icon
const WEATHER_ICON = {
    0: 'sunny',
    1: 'partly-sunny',
    2: 'cloudy', 
    3: 'cloudy',
    45: 'cloudy-fog',
    48: 'cloudy-fog',
    51: 'rainy',
    53: 'rainy',
    55: 'rainy',
    61: 'rainy', 
    63: 'rainy',
    65: 'rainy',
    80: 'rainy',
    81: 'rainy',
    82: 'rainy',
    95: 'thunderstorm',
    96: 'thunderstorm', 
    99: 'thunderstorm',
};

function HourlyForecastRow({ data })
{
    //use assets's font
    const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../../assets/font/static/Inter_18pt-Light.ttf'), //light
        mediumInter: require('../../assets/font/static/Inter_18pt-Medium.ttf'), //medium
        boldInter: require('../../assets/font/static/Inter_18pt-Bold.ttf'), //bold
    });

    return(
        <View style={styles.hourlyContainer}>
            <LinearGradient
            colors={['#63DCE3', '#37797D']}
            location={[0, 0.5, 1]}
            start={{ x:0, y:0.5}}
            end={{ x:1.5, y:1}}
            style={styles.hourlyGradientBackground}
            >

                {/**HOURLY CONTAINER */}
                <View style={styles.hourlyRow}>
                    <FlatList
                        horizontal
                        data={data}
                        keyExtractor={item=>item.time.toString()}
                        renderItem={({ item, index }) => {
                            const iconName= WEATHER_ICON[item.weathercode] || 'cloud-outline';
                            return(
                                <View style={[styles.hourlyItem, index !== data.length -1]}>
                                    <Text style={styles.hourlyText}>{item.time}:00</Text>
                                    <Ionicons name={iconName} size={28} color="#77fce9"/>
                                    <Text style={styles.hourlyTempText}>{item.temperature.toFixed()} °C</Text>
                                </View>
                            );
                        }}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </LinearGradient>
        </View>
    )
}

export default HourlyForecastRow;

const styles = StyleSheet.create({  

    //CONTAINER
    hourlyGradientBackground:{
        borderRadius: 12,
        paddingHorizontal: 10,
    },

    hourlyContainer:{
        marginTop: 15,
        borderRadius: 12,
        alignSelf: 'center',
        flexDirection: 'row',
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 1.25,
        shadowRadius: 0.84,
        elevation: 4,
    },

    hourlyItem:{
        width: 60,
        paddingVertical: 15,
        alignItems: 'center',
    },

    hourlyText:{
        fontSize:14,
        marginBottom: 4,
        fontFamily: 'mediumInter'
    },

    hourlyTempText:{
        fontSize: 14,
        marginTop: 4,
        fontFamily: 'boldInter'
    },
});