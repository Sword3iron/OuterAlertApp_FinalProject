import React, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, ScrollView, Image, TouchableOpacity, FlatList, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from 'expo-font';
import { ThemeContext } from '../componentFolder/colorComponent/ThemeContext';

const Stack = createStackNavigator(); //set navigation 


/***************************************************************/
////*********************PROFILE SCREEN***********************///
/***************************************************************/
//Main Profile Screen
//Where it all started when tap profile screen or navigation tab

function ProfileScreen({ route, navigation }){
    const {username, profilePic, level} = route.params || {}; //pass parameter for username and profile pictures
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //display profile pic with avatar if not profile pic is upload

    //use assets's font
    const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), //light
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), //medium
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), //bold
    });

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //set the component for other menu settings items
    const settingsMenu = [
        {title: 'Account Settings', icon: 'person-circle-outline', screen: 'AccountSettings' }, //Account settings page
        {title: 'Page Settings', icon: 'cog', screen: 'PageSettings'}, //Page Setting page
        {title: 'App Feedback', icon: 'document-outline', screen: 'AppFeedback'}, //App Feedback page
        {title: 'Bug Report', icon: 'bug', screen: 'BugReport'}, //Bug Report page
        {title: 'About App', icon: 'information-circle-outline', screen: 'AboutApp'}, //About Us page
    ];
    
    return(
        <LinearGradient
            colors={colors.gradient1} 
            location={[0, 0.5, 1]}
            start={{ x:0.5, y:0}}
            end={{ x:0.5, y:1}}
            style={styles.gradientBackground} 
        >
 
             {/**DISPLAY PROFILE PICTURE */}
            <ScrollView contentContainerStyle = {styles.scrollContainer}>
                <View style = {styles.profileSection}>
                    <View style = {styles.profilePicCircle}>
                    {profilePic ? (
                        <Image
                            source={{ uri: 'http://192.168.1.116/outeralert/picupload/' + profilePic}}
                            style={styles.profileImage}
                        />
                        ) : (
                            <View style={styles.avatarCircle}>
                                <Text style={[styles.avatarText, {color: colors.text}]}>{firstAvatar}</Text>
                            </View>
                        )}
                    </View>

                    {/**DISPLAY USERNAME */}
                    <Text style = {[styles.usernameText, {color: colors.text}]}> {username} </Text> 

                    <View style={styles.xpBox}>
                        <Image source={require("../img/icons/xp.png")} style={styles.xpIcon}/>
                        <Text style = {[styles.levelText, {color: colors.text}]}>Level: {level}</Text>
                    </View>

                    <View style = {styles.buttonRow}>
                        <TouchableOpacity 
                            style = {styles.navigateButton}
                            onPress={() => navigation.navigate('EditProfile')}    
                        >
                            <Text style = {styles.buttonText}> EDIT PROFILE </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style = {styles.navigateButton}
                            onPress = {() => navigation.navigate('SignUp')}    
                        >
                            <Text style = {styles.buttonText}> REGISTER </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                 {/**DISPLAY CONTAINER */}
                <View style = {styles.settingContainer}>
                    {settingsMenu.map((item, index) => ( 
                        <View key={index}>
                            <TouchableOpacity 
                                style = {styles.settingItem}
                                onPress={() => navigation.navigate(item.screen, {username})}
                                >
                                <Ionicons name={item.icon} size={25} color="#000000"/>
                                <Text style = {styles.settingText}>{item.title}</Text>
                                <Ionicons name="chevron-forward" size={25} color="#000000"/>
                            </TouchableOpacity>

                            {index === 1 && <View style={styles.dividerLine}/>}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </LinearGradient>
    );
} 

/**BUTTON EDIT PROFILE */
/**On top of the profile page with register button */
function EditProfilePage({route}){
    const navigation = useNavigation(); //navigation usage

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //constant variables
    const [currentUsername, setCurrentUsername] = useState(''); //use state for current username to be set
    const [username, setUsername] = useState('');  //use state for username to be set
    const [profilePic, setProfilePic] = useState(''); //use state for profile picture to be set

    //use effect hooking on checking username parameter
    useEffect(() => {
        if (route.params?.username){  
            //display console log for username debug
            console.log("received Username: ", route.params.username);
            setCurrentUsername(route.params.username); //set current username from logged in user
        } else {
            //display error message for debugging
            console.log("received no username passed in route.params: ");
        }
    }, [route.params]); //clear the parameter to prevent memory leaks

    //Function for changing profile picture
    //using library sensor of image library async
    const handleProfilePic = async () => {
        //request permission to access the media library for android
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted){ //if the permission is ungranted
            //display alert message
            Alert.alert("Permission Denied", "Please enable permission access to your image library.")
            return;//exit the function if permission is denied
        }

        //launch the photo album library for the user to pick an image
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaType: ImagePicker.MediaTypeOptions.Images, //limit to image 
            base64: true, //include the encoding type of base64 file
            quality: 0.5,//set quality of the image to 50%
        });

        //check if the users canceled an asset selection
        if(! result.canceled && result.assets && result.assets.length > 0){
            const asset = result.assets[0]; //get the first asset of the image
            setProfilePic({ //update the profile picture state with the base64 data and URI
                base64: asset.base64, //use encoding of base64
                uri: asset.uri, //extract image resource as uri
            });
        }
    };

    //Handle Update for both username and profile picture
    const handleProfileUpdate = () => {
        if(!username){ //if the username is not entered
            //display alert message 
            Alert.alert("Incompleted, please enter your username");
            return; //return if username is missing
        }

        //constant variable for storing data
        const updateProfileData = {
            currentUsername: currentUsername, //current username
            username: username, //username
            profilePic: profilePic?.base64 || null //profile picture
        }

        //Calling API of php file
        fetch('http://192.168.1.116/outeralert/update.php', {
                method: 'POST', //use method post
                headers: { 'Content-Type' : 'application/json'}, //set header for JSON data
                body: JSON.stringify(updateProfileData) //stringify profile data
        })
        .then(res => res.json()) //parse the JSON response
        .then(json => { //if the json is succeed on sending request
            if(json.success){
                //display alert message for success
                Alert.alert('Update Is Successful.');
            }else{
                //display alert message for failure
                Alert.alert("Error: " + json.message);
            }
        })      
    }

    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.1, y:1}}
        end={{ x:0.5, y:-1}} 
        style={styles.gradientBackground} 
        >
            <View style = {styles.settingScreen}> 
                <View style={styles.headerRow}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name = "arrow-back" size={24} color="black"/>
                </Pressable>
                <Text style={[styles.settingTitle, {color: colors.text}]}> Profile Edit </Text>
                    <View style={styles.aboutAppContainer}>
                        <View style = {styles.settingContainerSub}>
                            <Text style = {styles.settingDesc}>
                                Change your profile page and username here.
                            </Text>

                            {/**USERNAME CHANGING */}
                            <Text style = {styles.subTitle}>
                                Username
                            </Text>
                            <TextInput
                                placeholder='New Username'
                                style = {styles.newUsernameInput}
                                value = {username}
                                onChangeText={setUsername}
                            />

                            {/**PROFILE PICTURE CHANGING */}
                            <Text style = {styles.subTitle}>
                                Profile Pic / Avatar
                            </Text>

                            <TouchableOpacity
                                style={styles.navigateProfilePicButton}
                                onPress={handleProfilePic}
                            >
                                <Text style={styles.uploadButtonText}>
                                    Tap To Replace Your Profile Image 
                                </Text>
                            </TouchableOpacity>

                            {profilePic && <Image source={{ uri: profilePic.uri }} style={styles.profilePicUploadImage}/>}

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleProfileUpdate}
                            >
                                <Text style={styles.uploadButtonText}>
                                    Update Profile Here
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}
/***************************************************************/
////****************PAGE SETTINGS SECTION*********************///
/***************************************************************/

/**PROFILE SCREEN SECTION PAGES*/
/**Account setting pages below the buttons */
function AccountSettingsPage({route}){
    const navigation = useNavigation(); //navigation usage

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //constant variables
    const {username} = route.params; //use to make sql change password by finding username
    const [newPassword, setNewPassword] = useState(''); //use state for new password
    const [confirmPassword, setConfirmPassword] = useState(''); //use state for current password

    //function to handle password update
    const handlePasswordUpdate = async () => {
        if(newPassword !== confirmPassword) //if new password does not match
        {
            //display error message 
            Alert.alert("Error", "Password Does Not Match Above.");
            return;//return if the password is empty
        }

        //constant variable for storing data
        const updatePasswordData = {
            username: username, //username
            password: newPassword, //new password
            confirmPassword: confirmPassword,  //confirm password        
        };

        //Calling API from php file
        fetch('http://192.168.1.116/outeralert/updatePassword.php', {
            method: 'POST', //use post method
            headers: { 'Content-Type' : 'application/json'}, //set header for JSON data
            body: JSON.stringify(updatePasswordData) //stringify password data
        })
        .then(res => res.json()) //parse the JSON response
        .then(json => { //if the request seding is success
            if(json.success){
                //display alert message on successful
                Alert.alert('Update Is Successful.');
            }else{
                //display alert message on failure
                Alert.alert("Error: " + json.message);
            }
        })      
    }

    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.1, y:1}}
        end={{ x:0.5, y:-1}}
        style={styles.gradientBackground} 
        >
            <View style = {styles.settingScreen}>
                <View style={styles.headerRow}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name = "arrow-back" size={24} color="black"/>
                </Pressable>
                <Text style={[styles.settingTitle, {color: colors.text}]}>Account Settings</Text>
                    <View style={styles.aboutAppContainer}>
                        <View style = {styles.settingContainerSub}>
                            <Text style = {styles.settingDesc}>
                                    Change Your Password here
                            </Text>

                             {/**USERNAME */}
                             <Text style = {styles.subTitle}>
                                Password
                            </Text>
                            <TextInput
                                placeholder='Password'
                                value = {newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                                style = {styles.boxInput}
                            />

                            {/**CONFIRM USERNAME*/}
                            <Text style = {styles.subTitle}>
                                Confirm Password
                            </Text>
                            <TextInput
                                placeholder='Confirm Password'
                                value = {confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                style = {styles.boxInput}
                            />

                            {/**SUBMIT*/}
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress = {handlePasswordUpdate}
                            >
                                <Text style={styles.uploadButtonText}>
                                    SUBMIT
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}

/**PAGE SETTINGS PAGE*/
/**Page settings that display menu for configuration setting */
function PageSettingsPage({route, navigation}){
    const {username} = route.params || {}; //pass parameter for username and profile pictures

    //Page setting menu
    const pageSettingsMenu =[
        {title: 'Help', icon: 'help-circle-outline', screen: 'HelpSetting'}, //help setting
        {title: 'Appearance', icon: 'sunny', screen: 'AppearanceSetting'}, //appearance setting
        {title: 'Terms & Condition', icon: 'documents-sharp' , screen: 'TermsConditionSetting'}, //terms and condition setting
        {title: 'Privacy Policy', icon: 'shield' , screen: 'PolicySetting'} //policy setting
    ];

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //function to handle log out account
    const handleLogout = async () => {
        try {
            //Calling API on php file
            const res = await fetch('http://192.168.1.116/outeralert/logout.php',{
                method: 'GET', //use method get
            });
            const data = await res.json(); //parse the JSON response
            if (data.success){ //if the log out is success
                //navigate the page back to login
                navigation.replace('Login');
            }
        }catch(error){ //catch an exception 
            //display error message
            console.error('Logout failed: ', error);
        }
    };

    //function to handle account deletion
    const handleDeleteAccount = async (username) => {
        //display alert message asking user if they wanted to delete account
       Alert.alert(
        "Delete Account",
        "Are you sure you want to delete your account? Once click, it cannot be undone.",
        [   //if no
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { //if yes
                text: "Yes",
                style: 'destructive',
                onPress: async () => { //when the button is press
                    try{
                        //Calling API on php file
                        const res = await fetch ('http://192.168.1.116/outeralert/delete.php', {
                            method: 'POST', //use post method
                            headers: { "Content-Type" : "application/json"}, //parse to json file
                            body: JSON.stringify({username}), //stringigy the data
                        });
                        const result = await res.json(); //parse to JSON response
                        if (result.success){ //if deletion success
                            //display alert message
                            Alert.alert("Sad To See You Go...", "Thank you for using our app.");
                            //navigate the app back to login page
                            navigation.replace('Login');
                        } else{
                            //display error message
                            Alert.alert('Error', result.error || "Deletion failed");
                        }
                    }catch(error){ //catch an exception
                        //display error message
                        console.error("Account Deletion Failed", error);
                    }
                }
            }
        ])
    };

    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.1, y:1}}
        end={{ x:0.5, y:-1}}
        style={styles.gradientBackground} 
        >
            <View style = {styles.settingScreen}>
                <View style={styles.headerRow}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name = "arrow-back" size={24} color="black"/>
                </Pressable>
                <Text style={[styles.settingTitle, {color: colors.text}]}>Page Settings</Text>
                    <View style={styles.aboutAppContainer}>

                        {/**DISPLAY CONFIGURATION SETTINGS FOR OTHER PAGES */}
                        <View style = {styles.settingContainerSub}>
                            {pageSettingsMenu.map((item, index) => ( 
                            <View key={index}>
                                <TouchableOpacity 
                                    style = {styles.settingItem2}
                                    onPress={() => navigation.navigate(item.screen)}
                                    >
                                    <Ionicons name={item.icon} size={25} color="#000000"/>
                                        <Text style = {styles.settingText2}>{item.title}</Text>
                                        <Ionicons name="chevron-forward" size={25} color="#000000" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {/**BUTTON */}
                        <View style = {styles.settingContainerSub}>
                            <TouchableOpacity
                                onPress={handleLogout}
                            >
                                <Text style={styles.redText}> LOG OUT ACCOUNT </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDeleteAccount(username)}
                            >
                                <Text style={styles.redText}> DELETE ACCOUNT </Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}

/**APP FEEDBACK PAGE*/
/**App Feedback Page that allow users to send feedback */
function AppFeedbackPage(){
    const navigation = useNavigation(); //navigation usage

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //constant variables
    const [usedFrequent, setUsedFrequent] = useState(''); //set question usage frequent
    const [usedFeature, setUsedFeature] = useState('');  //set question usage feature
    const [usedDislike, setUsedDislike] = useState('');  //set question dislike
    const [usedImprovement, setUsedImprovement] = useState('');  //set question used improvement
    const [usedRating, setUsedRating] = useState('');  //set question used rating

    //function to handle submit feedback
    const handleSubmitFeedback = async() => {

        //constant variables for sending data
        const insertFeedbackData = {
            usedFrequent: usedFrequent, //question usage frequent
            usedFeature: usedFeature, //question usage feature
            usedDislike: usedDislike, //set question dislike
            usedImprovement: usedImprovement, //set question used improvement
            usedRating: usedRating,//set question used rating
        };

        //Calling API on php file
        fetch('http://192.168.1.116/outeralert/userFeedback.php', {
            method: 'POST', //get post method
            headers: { 'Content-Type' : 'application/json'}, //parse to json file
            body: JSON.stringify(insertFeedbackData) //stringify feedback data
        })
        .then(res => res.json()) //parse to JSON response
        .then(json => {
            if(json.success){ //if request sending success
                //display alert message on successful
                Alert.alert('Feedback Received!', 
                            'Thank you for your response!',
                            [
                                {
                                    text: 'OK',
                                    //navigate back to previous page
                                    onPress: () => navigation.goBack()
                                }
                            ]
                        );
            }else{
                //display alert error message
                Alert.alert("Error: " + json.message);
            }
        })      
    }

    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.1, y:1}}
        end={{ x:0.5, y:-1}}
        style={styles.gradientBackground} 
        >
            <View style = {styles.settingScreen}>
                <View style={styles.headerRow}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name = "arrow-back" size={24} color="black"/>
                    </Pressable>
                </View>
                <ScrollView contentContainerStyle={styles.bottomScroll}>
                    <Text style={[styles.settingTitle, {color: colors.text}]}> App Feedback </Text>
                        <View style={styles.aboutAppContainer}>
                            <View style = {styles.settingContainerSub}>

                                {/**DESCRIPTION */}
                                <Text style = {styles.settingDesc}>
                                        Do your like our app? Please state 
                                        your feedback below to let us know!
                                </Text>

                                {/**FEEDBACK 1 */}
                                <Text style = {styles.subTitle}>
                                    How often you use our app?
                                </Text>
                                <TextInput
                                    style = {styles.boxInput}
                                    value = {usedFrequent}
                                    onChangeText={setUsedFrequent}
                                />

                                {/**FEEDBACK 2*/}
                                <Text style = {styles.subTitle}>
                                    What is your most used feature?
                                </Text>
                                <TextInput
                                    style = {styles.boxInput}
                                    value = {usedFeature}
                                    onChangeText={setUsedFeature}
                                />
                                
                                {/**FEEDBACK 3*/}
                                <Text style = {styles.subTitle}>
                                    What do you not like while using this app?
                                </Text>
                                <TextInput
                                    style = {styles.boxInput}
                                    value = {usedDislike}
                                    onChangeText={setUsedDislike}
                                />
                            
                                {/**FEEDBACK 4*/}
                                <Text style = {styles.subTitle}>
                                    If anything, what will you like to see to be imporved?
                                </Text>
                                <TextInput
                                    style = {styles.boxInput}
                                    value = {usedImprovement}
                                    onChangeText={setUsedImprovement}
                                />

                                {/**FEEDBACK 5*/}
                                <Text style = {styles.subTitle}>
                                    Rate Scalability of this app.
                                </Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue = {usedRating}
                                        onValueChange = {(itemValue) => setUsedRating(itemValue)}
                                        style={styles.TextInput}
                                    >
                                        <Picker.Item label = "1 to 5" value="" />
                                        <Picker.Item label = "1" value="1" />
                                        <Picker.Item label = "2" value="2" />
                                        <Picker.Item label = "3" value="3" />
                                        <Picker.Item label = "4" value="4" />
                                        <Picker.Item label = "5" value="5" />
                                    </Picker>
                                </View>

                                {/**BUTTON */}
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleSubmitFeedback}
                                >
                                    <Text style={styles.uploadButtonText}>
                                        SUBMIT
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                </ScrollView>
            </View>
        </LinearGradient>
    )
}

/**BUG REPORT PAGE*/
/**Bug report Page that allow users to report glitch */
function BugReportPage(){
    const navigation = useNavigation(); //navigation usage

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //constant variables
    const [bugsType, setBugsType] = useState(''); //set bugs type state
    const [bugsDesc, setBugsDesc] = useState(''); //set bugs description

    //function to handling submit bug report
    const handleSubmitBugReport = async() => {

        //constant variables for inserting bug report data
        const insertBugReportData = {
            bugsType: bugsType, //bugs type
            bugsDesc: bugsDesc, //bugs description
        };

        //Calling API on php file
        fetch('http://192.168.1.116/outeralert/reportBug.php', {
            method: 'POST', //use post method
            headers: { 'Content-Type' : 'application/json'}, //parse to json file
            body: JSON.stringify(insertBugReportData) //stringify the data
        })
        .then(res => res.json()) //parse to JSON response
        .then(json => {
            if(json.success){ //if the json sending request success
                //display alert message on successful  
                Alert.alert('Bug Reported!', 
                            'Thank you! We will fix this problem as soon as we can.',
                            [
                                {
                                    text: 'OK',
                                    //navigate back to previous page
                                    onPress: () => navigation.goBack()
                                }
                            ]
                        );
            }else{
                //display error message
                Alert.alert("Error: " + json.message);
            }
        })      
    }

    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.1, y:1}}
        end={{ x:0.5, y:-1}}
        style={styles.gradientBackground} 
        >
            <View style = {styles.settingScreen}>
                <View style={styles.headerRow}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name = "arrow-back" size={24} color="black"/>
                </Pressable>
                    <ScrollView>
                    <Text style={[styles.settingTitle, {color: colors.text}]}>Bug Report</Text>
                        <View style={styles.aboutAppContainer}>
                            <View style = {styles.settingContainerSub}>

                                {/**DESCRIPTION */}
                                <Text style = {styles.settingDesc}>
                                        Please report any bugs and glitch you found within our app.
                                </Text>   

                                {/**COMPLIANT 1 */}
                                <Text style = {styles.subTitle}>
                                    What type of glitch you encounter?
                                </Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue = {bugsType}
                                        onValueChange = {(itemValue) => setBugsType(itemValue)}
                                        style={styles.TextInput}
                                    >
                                        <Picker.Item label = "Bugs And Glitch" value="" color="#cccccc" />
                                        <Picker.Item label = "Database problem" value="Database problem" />
                                        <Picker.Item label = "Pages not working" value="Pages not working" />
                                        <Picker.Item label = "No Responding" value="No Responding" />
                                        <Picker.Item label = "Service is Unavaliable" value="Service is Unavaliable" />
                                        <Picker.Item label = "Messy Interface" value="Messy Interface" />
                                        <Picker.Item label = "GPS Not Working" value="GPS Not Working" />
                                        <Picker.Item label = "Lagging" value="Lagging" />
                                        <Picker.Item label = "Others" value="Others" />
                                    </Picker>
                                </View>

                                {/**COMPLIANT 2 */}
                                <Text style = {styles.subTitle}>
                                    Please state the description of the bug.
                                    </Text>
                                <TextInput
                                    style = {[styles.bugReportInput, {height: 200}]}
                                    value = {bugsDesc}
                                    onChangeText={setBugsDesc}
                                    multiline={true}
                                    scrollEnabled={false}
                                />

                                {/**BUTTON */}
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleSubmitBugReport}
                                >
                                    <Text style={styles.uploadButtonText}>
                                        SUBMIT
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </LinearGradient>
    )
}

/**ABOUT APP PAGE*/
/**About App Page that view app information*/
function AboutAppPage(){
    const navigation = useNavigation(); //navigation usage

    //data for extraction
    const aboutAppData = [
        {key: 'Version', value: '1.0.0'},   //version
        {key: 'Deveoped In', value: 'React Native'}, //developed
        {key: 'Software', value: 'Android'}, //software
        {key: 'App Type', value: 'Custom App'}, //app type
    ];

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.1, y:1}}
        end={{ x:0.5, y:-1}}
        style={styles.gradientBackground} 
        >
            <View style = {styles.settingScreen}>
                <View style={styles.headerRow}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name = "arrow-back" size={24} color="black"/>
                </Pressable>

                {/**TITLE */}
                <Text style={[styles.settingTitle, {color: colors.text}]}>About App</Text>
                    <View style={styles.aboutAppContainer}>
                        <View style = {styles.settingContainerSub}>

                            {/**ITEMS */}
                            <FlatList
                            data={aboutAppData}
                            keyExtractor={(item) => item.key}
                            renderItem={({ item }) =>(
                                <View style = {styles.row}>
                                    <Text style = {styles.cellKey}>{item.key}</Text>
                                    <Text style = {styles.cellValue}>{item.value}</Text>                       
                                </View>
                            )}
                        /> 
                        </View>
                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}

/***************************************************************/
////******************APP SETTING SCREEN**********************///
/***************************************************************/
// PAGE SETTING PAGES
//This section contains settings for page setting pages.
//here there are six of options settings.

/**HELP PAGE*/
//Help Page display text information on appliation usage
function HelpPage(){
    const navigation = useNavigation(); //navigation usage

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.1, y:1}}
        end={{ x:0.5, y:-1}}
        style={styles.gradientBackground} 
        >
            <View style = {styles.settingScreen}> 
                <View style={styles.headerRow}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name = "arrow-back" size={24} color="black"/>
                </Pressable>

                {/**TITLE */}
                <Text style={[styles.settingTitle, {color: colors.text}]}>
                    Help
                </Text>
                    <ScrollView contentContainerStyle={styles.scrollviewStyle}>
                    <View style={styles.aboutAppContainer}>

                        {/**QUIZ */}
                        <View style = {styles.settingContainerSub}>
                            <Text style = {styles.privacyTextTitle}>
                                QUIZ
                            </Text>
                            <Text style = {styles.privacyTextContent}>
                            • Click on any topic you want to do.{"\n"}{"\n"}
                            • Select one of them will automatically start the test.{"\n"}{"\n"}
                            • The time limit 10 minutes. If the test is not completed you will be directed to the quiz page.{"\n"}{"\n"}
                            • Answer every question, for every right you will gain experience 'XP'.{"\n"}{"\n"}
                            • Wrong question will not give you experience.{"\n"}{"\n"}
                            </Text>
                        </View>

                        {/**SOS CALL */}
                        <View style = {styles.settingContainerSub}>
                            <Text style = {styles.privacyTextTitle}>
                                CALL
                            </Text>
                            <Text style = {styles.privacyTextContent}>
                                • This is the section where you will engaging S.O.S calling to your first-responders{"\n"}{"\n"}
                                • There are six public's servant to call, Paramedics, Police, St.John, Fire Fighters, Civil Service and Maritimes.{"\n"}{"\n"}
                                • Click any one of them will prompt a meesage to choose you calling interface{"\n"}{"\n"}
                                • Select one of them to engage phone call.{"\n"}{"\n"}
                            </Text>
                        </View>

                        {/**CHECKLIST */}
                        <View style = {styles.settingContainerSub}>
                            <Text style = {styles.privacyTextTitle}>
                                CHECKLIST
                            </Text>
                            <Text style = {styles.privacyTextContent}>
                                • Checklist help you to remember everything you need before part-taking the action during disaster event.{"\n"}{"\n"}
                                • Tap the '+' icon below the bottom right corner.{"\n"}{"\n"}
                                • Enter the title and items that you need to do.{"\n"}{"\n"}
                                • Press 'submit' button to insert the list.{"\n"}{"\n"}
                                • Click inside the checklist you inserted, you will see your tasks and objective.{"\n"}{"\n"}
                                • Depend on you, you can either mark your task as done or undone.{"\n"}{"\n"}
                            </Text>
                        </View>

                        {/**NEWS, WEATHER AND TIPSHACKS */}
                        <View style = {styles.settingContainerSub}>
                            <Text style = {styles.privacyTextTitle}>
                                NEWS, WEATHER and TIPS & HACKS
                            </Text>
                            <Text style = {styles.privacyTextContent}>
                                • There are other section where you will gained information via viewing latest updates on news and weather. 
                                Whereas you can view tips and trick to help yourselves and your family.{"\n"}{"\n"}
                                • Click one of them will display the current event: Weather to local forecast, News to lastest updates on disaster.{"\n"}{"\n"}
                                • You can share the article to the social media platform such as facebook.{"\n"}{"\n"}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                </View>
            </View>
        </LinearGradient>
    )
}

//APPERANCE PAGE
//appearance Page configurate app display
function AppearanceSettingPage(){

    //color theme when turning on the dark mode
    const { isDarkMode, toggleTheme, colors} = useContext(ThemeContext);

    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.1, y:1.1}}
        end={{ x:0.2, y:-1}}
        style={styles.gradientBackground} 
        >
            <View style = {styles.settingScreen}> 
                <View style={styles.headerRow}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name = "arrow-back" size={24} color="black"/>
                </Pressable>

                    {/**TITLE */}
                    <Text style={[styles.settingTitle, {color: colors.text}]}>
                        Help
                    </Text>

                    {/**SWITCH */}
                    <View style={styles.aboutAppContainer}>
                        <View style={styles.toggleRow}>
                            <Text style={styles.toggleLabel}>Dark Mode</Text>
                            <Switch
                                value={isDarkMode}
                                onValueChange={toggleTheme}
                                thumbColor={isDarkMode? '#fff' : '#000'}
                                trackColor={{false: '#ccc', true: '#666'}}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}

//TERM AND CONDITION
//Terms and Condition Page display regulations notes
function TermConditionPage(){

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    const navigation = useNavigation();
    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.1, y:1}}
        end={{ x:0.5, y:-1}}
        style={styles.gradientBackground} 
        >
            <View style = {styles.settingScreen}> 
                <View style={styles.headerRow}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name = "arrow-back" size={24} color="black"/>
                </Pressable>

                    {/**TITLE */}
                    <Text style={[styles.settingTitle, {color: colors.text}]}>
                        Terms & Condition
                    </Text>
                    <ScrollView contentContainerStyle={styles.scrollviewStyle}>
                    <View style={styles.aboutAppContainer}>
                        <View style = {styles.settingContainerSub}>

                            {/**DESCRIPTION */}
                            <Text style = {styles.privacyTextContent}>
                            Outeralert provided seamless service that ensrues your expereince is safe, secure and satisfying.
                            Read these terms and conidtion below to understand the responsibilities and ethics while using the app.
                            {"\n"}{"\n"}

                                {/**CONTENT */}
                                <View style={{ paddingHorizontal: 10, marginVertical: 12}}>
                                    <Text style = {styles.privacyTextContent}>
                                    •  User are responsible for their own actions and content while using the app.{"\n"}{"\n"}
                                    •  No harassment and illegal activities are allow in attempt to compromise the app's security.{"\n"}{"\n"}
                                    •  User are not allowed to hack, modify and make significant amount of changes without owner's permission.{"\n"}{"\n"}
                                    </Text>
                                </View>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                </View>
            </View>
        </LinearGradient>
    )
}

//PRIVACY POLICY
//Privacy and Policy page display rules and regulations
function PrivacyPolicyPage(){
    const navigation = useNavigation(); //navigation usage

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.1, y:1}}
        end={{ x:0.5, y:-1}}
        style={styles.gradientBackground} 
        >
            <View style = {styles.settingScreen}> 
                <View style={styles.headerRow}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name = "arrow-back" size={24} color="black"/>
                </Pressable>

                {/**TITLE */}
                <Text style={[styles.settingTitle, {color: colors.text}]}>
                    Privacy Policy
                </Text>
                <ScrollView contentContainerStyle={styles.scrollviewStyle}>
                    <View style={styles.aboutAppContainer}>
                        <View style = {styles.settingContainerSub}>

                            {/**DESCRIPTION */}
                            <Text style = {styles.privacyTextContent}>
                            This application does not collects, uses and disclouse any information
                            that associated with our users, it has no way in sharing personal data with 
                            third-party user and that it does not condone or tolerate any misuse, abuse
                            unauthorized disclouse of user information.
                            {"\n"}{"\n"}

                            This application is for project testing uses only, and it was never 
                            meant to be engaging cookies and tracking policies that may affect 
                            to personal data of user in any way.
                            {"\n"}{"\n"}

                            Here in outeralert, we are committed to protecting user's privacy.
                            {"\n"}{"\n"}

                                {/**CONTENT */}
                                <View style={{ paddingHorizontal: 10, marginVertical: 12}}>
                                    <Text style = {styles.privacyTextContent}>
                                    • We do not share personal information without user's consent. {"\n"}{"\n"}
                                    • User's data is stored and secured. {"\n"}{"\n"}
                                    • We use encryption to safeguard user's data information. {"\n"}{"\n"}
                                    • We regulary review our privacy practices and enthic codes. {"\n"}{"\n"}
                                    • Ensuring user's safety and transperancy over the usage of data overboard. {"\n"}{"\n"}
                                    • We comply with relevant privacy laws and regulations. {"\n"}{"\n"}
                                    • We are committed to countinues improve and enhancement for user's experience to ensure equality. {"\n"}{"\n"}
                                    </Text>
                                </View>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                </View>
            </View>
        </LinearGradient>
    )
}

/***************************************************************/
////********************STACK SCREEN**************************///
/***************************************************************/
/**MAIN PAGE STACK FOR PROFILE PAGE */
//Main Function - Navigation for profile page
function ProfilePage({route, navigation})
{
    //parameters of users' data
    const {userId, username, profilePic, level} = route.params || {};

    //Stack Navigation
    return(
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} initialParams={{userId, username, profilePic, level}}/>
            <Stack.Screen name="EditProfile" component={EditProfilePage} initialParams={{userId, username, profilePic}}/>

            {/**Main Setting Pages */}
            <Stack.Screen name="AccountSettings" component={AccountSettingsPage} initialParams={{username}}/>
            <Stack.Screen name="PageSettings" component={PageSettingsPage}/> 
            <Stack.Screen name="AppFeedback" component={AppFeedbackPage}/>
            <Stack.Screen name="BugReport" component={BugReportPage}/>
            <Stack.Screen name="AboutApp" component={AboutAppPage}/>

            {/**Page Settings Pages */}
            <Stack.Screen name="HelpSetting" component={HelpPage}/>
            <Stack.Screen name="AppearanceSetting" component={AppearanceSettingPage}/>
            <Stack.Screen name="TermsConditionSetting" component={TermConditionPage}/>
            <Stack.Screen name="PolicySetting" component={PrivacyPolicyPage}/>
        </Stack.Navigator>
    )
}

export default ProfilePage;

const styles = StyleSheet.create({

    /**MAIN INTERFACE */
    scrollContainer:{
        flex: 1,
        width:'100%',
        alignContent:'center',
        alignItems: 'center',
        marginVertical: '25%',
    },

    gradientBackground:{
        flex: 1,
    },

    profileSection:{
        alignItems: 'center',
        marginBottom: 30,
    },

    profilePicCircle:{
        width: 110,
        height: 110,
        borderRadius: "50%",
        justifyContent: 'center',
        alignItems:'center',
        marginBottom: '10',
        backgroundColor: '#ff7575',
        overflow: 'hidden',
    },

    profileImage:{
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    avatarCircle:{
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
        borderWidth: 0.9,
    },

    avatarText:{
        fontSize: 35,
        color: '#ffffff',
        fontWeight:'bold',
    },

    usernameText:{
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 18,
    },

    xpBox:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    xpIcon:{
        width:20,
        height: 20,
        right: 10,
    },

    levelText:{
        fontFamily: 'lightInter',
        fontSize: 15,
    },

    buttonRow:{
        flexDirection: 'row',
        gap: 10,
        marginTop: 15,
    },

    navigateButton:{
        backgroundColor: '#ff5f5f',
        paddingHorizontal: 30,
        paddingVertical: 8,
        borderRadius: 4,
    },

    buttonText: {
        color: '#b2f0f7',
        fontFamily: 'mediumInter',
        fontSize: 12,
    },

    settingContainer:{
        width: '85%',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff',
        elevation: 5,
    },

    settingItem:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomColor: '#eeeeee',
        gap: 15,
    },

    settingItem2:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 12,
        borderBottomColor: '#eeeeee',
        gap: 15,
    },

    settingText:{
        flex:1,
        fontSize: 16,
        fontFamily: 'lightInter',
    },

    settingText2:{
        flex: 1,
        fontSize:15,
        fontFamily: 'lightInter',
    },

    dividerLine:{
        width: '100%',
        height: 1.5,
        backgroundColor: '#cccccc',
        marginVertical: 20,
    },

    redText:{
        color: '#f7330c',
        fontFamily: 'boldInter',
        marginTop: 10,
    },


    //**CONTAINER FOR SETTINGS PAGES - Usuability Codes Applied for other pages*/
    settingScreen:{
        flex: 1,
    },

    settingTitle:{
        fontSize: 15,
        fontFamily: 'boldInter',
        marginTop: 60,
        paddingBottom: 15,
        textAlign: 'center',
    },

    scrollviewStyle:{
        paddingBottom: "30%",
    },

    settingContainerSub:{
        width: '100%',
        padding: 20,
        marginTop: 5,
        marginBottom: 30,    
        backgroundColor: "#ffffff",
        borderRadius: 20,
    },
    
    headerRow:{
        position: 'relative',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },

    backButton:{
        position: 'absolute',
        top: 50,
        left:30,
        zIndex: 10,
        padding: 10,
    },

    settingDesc:{
        fontsize: 15,
        fontFamily: 'mediumInter',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: "10%",
        color: "#000000",
    },
    
    subTitle:{
        marginTop: 5,
        marginBottom: 12,
        paddingLeft: 10,
        fontSize: 13,
        fontFamily: 'lightInter',
    },

    submitButton:{
        backgroundColor: '#ff5f5f',
        marginTop: 10,
        paddingVertical: 8,
        borderRadius: 5,
    },

    boxInput:{
        borderWidth: 0.5,
        borderColor: "cccccc",
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#ffffff'
    },

    bottomScroll:{
        paddingBottom: 80,
    },

    /**APPEARANCE*/
    toggleRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        marginVertical: 8,
        shadowColor: "#000000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 4,
        elevation: 2
    },

    toggleLabel:{
        fontSize: 14,
        fontFamily: 'mediumInter'
    },


    /**EDIT PROFILE */
    navigateProfilePicButton:{
        backgroundColor: '#008000',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 15,
        marginBottom: 10,
        shadowColor: '#000000',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },

    newUsernameInput:{
        borderWidth: 0.5,
        borderColor: "cccccc",
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#ffffff'
    },

    profilePicUploadImage:{
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf:'center',
        marginBottom: 15,
    },
    
    uploadButtonText:{
        color: '#b2f0f7',
        fontFamily: 'mediumInter',
        fontSize: 15,
        textAlign: 'center',
    },

    /**BUG REPORT */
    bugReportInput:{
        borderWidth: 0.5,
        borderColor: "cccccc",
        padding: 15,
        borderRadius: 8,
        textAlignVertical: "top"
    },

    /**FEEDBACK */
    pickerContainer:{
        borderWidth: 0.5,
        borderColor: "#000000",
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#ffffff'  
    },

    //**ABOUT APP */
    aboutAppContainer:{
        padding: 10,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomColor: '#05fe03',
        borderBottomWidth: 0.5,
    },

    cellKey:{
        fontWeight: 'bold',
        fontSize: 16,
        paddingRight: 90,
    },

    cellValue:{
        fontSize: 16,
        paddingHorizontal: 5,
        color: '#b9b9b9'
    },

    fontStyleContainer:{
        fontFamily: 'lightInter',
        fontSize: 12,
    },

    /**PRIVACY POLICY SETTINGS */
    privacyTextTitle:{
        textAlign: 'left',
        fontSize: 13,
        fontFamily: 'boldInter'
    },

    privacyTextContent:{
        marginTop: 15,
        textAlign: 'justify',
        fontFamily: 'lightInter'
    },
});