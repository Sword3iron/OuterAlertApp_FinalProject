import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/***************************************************************/
////********************SPLASH SCREEN*************************///
/***************************************************************/
const SplashScreen = ({ navigation }) => { //set navigation 
    useEffect(() => { //use effect 
        const timer = setTimeout(() => {  //set time out session
            navigation .replace('Login'); //navigate to loggin page
        }, 1000);  //set the time out for splash screen for appear within 1 seconds
        return () => clearTimeout(timer);  //clear out the session
    }, [navigation])  //proceed with nevigation function

    return(
        <LinearGradient
            colors={['#63dce3', '#ffffff', '#63dce3']}
            locations={[0, 0.5, 1]}
            start={{x: 0.5, y: 0}}
            end={{x:0.5, y:1}}
            style={styles.container}
        >            

            {/**IMAGE LOGO */}
            <Image source={require('../assets/logo/outeralertlogo.png')}
                style={styles.logo}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({

    //container
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
    },

    //app logo
    logo:{
        width: 250,
        height: 250,
        resizeMode:'contain',
    },
})

export default SplashScreen;