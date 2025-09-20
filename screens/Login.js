import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextInput, Alert} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator(); //set navigation

/***************************************************************/
////**********************LOGIN PAGE**************************///
/***************************************************************/
const LoginScreen = ({ navigation }) => {

    //extracting font families   
    const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), //light inter
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), //bold inter
    })

    //constant variables
    const [email, setEmail] = useState(''); //set email
    const [password, setPassword] = useState(''); //set password
    
    //function to handle login
    const handleLogin = () => {
        //Calling login api from php file
        fetch("http://192.168.1.116/outeralert/login.php", {
            method: 'POST', //use post method to get data
            headers: { 'Content-Type' : 'application/json'}, //set headers for JSON data
            body: JSON.stringify({ email, password }) //sent data and password as JSON
        })
        .then(response => response.json()) //parse data to JSON response
        .then(data => {
            //if data parse is success
            if(data.success){
                //navigate the page to the home screen
                navigation.replace('HomeTab', 
                {userId: data.id, //user id
                 username: data.username, //username
                 profilePic: data.profilePic, //profile picture
                 level: data.level //user's level
                });
            }else{
                //display error message
                Alert.alert('Login Failed', data.message);
            }
        })
        //catch an exception
        .catch(error => {
            //handle network error or others
            console.error(error); //display console message
            Alert.alert('Error', "Something Went Wrong.") //display alert message
        });
    };

    return(
        <LinearGradient
            colors={['#ffffff', '#b2f0f7']}
            locations = {[0, 1]}
            start = {{ x: 0.5, y: 0}}
            end={{ x: 0.5, y: 1}}
            style={styles.gradientContainer}
        >
            <View style={styles.loginContainer}>

                {/**TITLE */}
                <Text style={styles.loginTitle}>
                    LOGIN
                </Text>

                {/**EMAIL */}
                <TextInput
                    placeholder='E-mail'
                    placeholderTextColor="#595959"
                    onChangeText={setEmail}
                    style={styles.input}
                /> 

                {/**PASSWORD */}
                <TextInput
                    placeholder='Password'
                    placeholderTextColor="#595959"
                    secureTextEntry
                    onChangeText={setPassword}
                    style={styles.input}
                />  

                {/**BUTTONS */}
                <View style={styles.registerRow}>
                    <Text style={styles.noAccountText}>No Account?</Text>
                    <TouchableOpacity onPress = {() => navigation.navigate('SignUp')}>
                        <Text style={styles.clickhereText}>  Click Here.</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={styles.loginButton}
                    onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>
                        LOGIN
                    </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({

    //NORMAL
    gradientContainer:{
        flex: 1,
    },

    loginContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        padding: 20,
    },

    loginTitle:{
        fontSize: 30,
        fontFamily: 'boldInter',
        marginBottom: 40,
        color: "#000000",
        paddingVertical: 2,
    },

    //INPUT CONTAINER
    input:{
        width: '100%',
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 30,
        marginBottom: 20,
        fontSize: 14,
    },

    //BUTTONS
    registerRow:{
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 30,
    },

    noAccountText:{
        color: "#000000",
    },

    clickhereText:{
        color: '#0034a2',
        fontWeight: '500',
    },

    loginButton:{
        backgroundColor: '#ff5f5f',
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 4,
    },

    loginButtonText:{
        color: '#b2f0f7',
        fontWeight: 'bold',
        fontSize: 16
    },
});