import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet, Text, TextInput, Image, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { createStackNavigator } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';

const Stack = createStackNavigator(); //set navigation

/***************************************************************/
////********************SING UP PAGE**************************///
/***************************************************************/
//This is registration page
function RegisterScreen({ navigation }){
    //constant variables
    const [username, setUsername] = useState(''); //username
    const [email, setEmail] = useState(''); //email 
    const [password, setPassword] = useState(''); //password
    const [confirmPassword, setConfirmPassword] = useState('');  //confirm password
    const [contactNumber, setContactNumber] = useState(''); //contact number
    const [profilePic, setProfilePic] = useState(null); //profile picture

    //Function for pick profile picture
    //using library sensor of image library async
    const pickImage = async () => {
        //request permission to access the media library for android
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted){ //if the permission is ungranted
            //display alert message
            Alert.alert("Permission Denied", "Please enable permission access to your image library.")
            return; //exit the function if permission is denied
        }
    
        //launch the photo album library for the user to pick an image
        const result = await ImagePicker.launchImageLibraryAsync({ 
            mediaTypes: ImagePicker.MediaTypeOptions.Images,//limit to image 
            base64: true, //include the encoding type of base64 file
            quality: 0.5, //set quality of the image to 50%
        });
    
        //check if the users canceled an asset selection
        if (!result.canceled && result.assets && result.assets.length > 0){
            const asset = result.assets[0]; //get the first asset of the image
            setProfilePic({ //update the profile picture state with the base64 data and URI
                base64: asset.base64, //use encoding of base64
                uri: asset.uri, //extract image resource as uri
            });
        }
    };

    //function to register the user
    const registerUser = () => { 
        //if the password does not match
        if (password !== confirmPassword){
            ///display alert message
            Alert.alert('Error', 'Password does not match.');
            return; //return if the password is empty
        }

        //constant variable to store the data
        const userData={
            username, //username
            email, //email
            password, //password
            contactNumber, //contact number
            profilePic: profilePic?.base64 || null, //profile picture
        };

        //Calling API on php file
        fetch('http://192.168.1.116/outeralert/register.php', {
            method: 'POST', //get post method
            headers: { 'Content-Type' : 'application/json'}, //convert string to JSON file
            body: JSON.stringify(userData), //stringify the user data
        })
        .then(response => response.json()) //parse to JSON response
        .then(data => {
            //if the request sending is succeed
            if (data.success){
                //display message on successful
                Alert.alert('Success', 'Registration Successful');
                //navigate to login page
                navigation.navigate('Login');
            }else{
                ///display message on failure
                Alert.alert('Error', 'Registration Failed')
            }
        })
        //catch an exception
        .catch(error => {
            //display error message
            console.error(error);
            //display alert message
            Alert.alert('Error', 'Something Went Wrong');
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
            <View style={styles.signUpContainer}>
                <Text style={styles.signUpTitle}>SIGN UP</Text>

                {/**USERNAME */}
                <TextInput
                    placeholder='Username'
                    placeholderTextColor="#595959"
                    value = {username}
                    onChangeText={setUsername}
                    style={styles.input}
                />  

                {/**EMAIL */}
                <TextInput
                    placeholder='E-mail'
                    placeholderTextColor="#595959"
                    value = {email}
                    onChangeText={setEmail}
                    style={styles.input}
                /> 

                {/**PASSWORD */}
                <TextInput
                    placeholder='Password'
                    placeholderTextColor="#595959"
                    secureTextEntry
                    value = {password}
                    onChangeText={setPassword}
                    style={styles.input}
                />
                
                {/**CONFIRM PASSWORD */}
                <TextInput
                    placeholder='Confirm Password'
                    placeholderTextColor="#595959"
                    secureTextEntry
                    value = {confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={styles.input}
                />

                {/**CONTACT NUMBER */}
                <TextInput
                    placeholder='Contact Number'
                    placeholderTextColor="#595959"
                    value = {contactNumber}
                    onChangeText={setContactNumber}
                    keyboardType='phone-pad'
                    style={styles.input}
                />

                {/**PROFILE PICTURES */}
                <TouchableOpacity onPress={pickImage} style={styles.imageInput}>
                    <Text style = {styles.imageInputText}>
                        {profilePic ? 'Your Profile Picture' : 'Tap In to Choose Your Profile Picture'}
                    </Text>
                </TouchableOpacity>

                
                {profilePic && <Image source={{ uri: profilePic.uri }} style={styles.profileImage}/>}

                {/**BUTTON */}
                <TouchableOpacity style={styles.registerButton} onPress={registerUser}>
                    <Text style={styles.registerButtonText}>
                        REGISTER
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.backButton}
                    onPress = {() => navigation.navigate('Login')}>
                    <Text style={styles.backButtonText}>
                        BACK TO LOGIN
                    </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({

    //NORMAL
    gradientContainer:{
        flex: 1,
    },

    signUpContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        padding: 20,
    },

    signUpTitle:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 40,
        color: "#000000",
    },

    input:{
        width: '100%',
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 30,
        marginBottom: 20,
        fontSize: 14,
    },

    //BUTTON
    registerButton:{
        width: '60%',
        backgroundColor: '#ff5f5f',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 4,
    },

    registerButtonText:{
        color: '#b2f0f7',
        fontWeight: 'bold',
        fontSize: 16
    },

    backButton:{
        width: '60%',
        backgroundColor: '#ff5f5f',
        paddingVertical: 15,
        marginTop: 10,
        alignItems: 'center',
        borderRadius: 4,
    },

    backButtonText:{
        color: '#b2f0f7',
        fontWeight: 'bold',
        fontSize: 16
    },

    imageInputText:{
        color: '#000000',
        fontFamily: 'lightInter',
        marginBottom: 15,
    },  

    profileImage:{
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
    }
});