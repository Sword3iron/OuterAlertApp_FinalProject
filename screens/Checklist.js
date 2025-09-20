import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity, Image, Modal, TextInput, Alert, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { ThemeContext } from '../componentFolder/colorComponent/ThemeContext';

const Stack = createStackNavigator(); //set navigation 

/***************************************************************/
////*******************CHECKLIST PAGE*************************///
/***************************************************************/
//This page display all inserted checklists

function ChecklistPage({ route, navigation }){
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

     //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic});//navigate to profile page, passing parameters
    }; 
  
     //use assets's font
    const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), //light
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), //medium
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), //bold
    });
 
    //constant variable on use state
    const [checklists, setChecklists] = useState([]); //checkist
    const [modalVisible, setModalVisible] = useState(false); //modal visibility state set to false
    const [title, setTitle] = useState(''); //title
    const [description, setDescription] = useState(''); //description
    const [refreshing, setRefreshing] = useState(false); //refreshing state set to false

    //function to handle task
    const handleAddTask = () => {
        if(!title || !description){ //if the title and description not inserted
            Alert.alert('Error', "Please insert checklist properly."); //return error message
            return; //return state
        }
        //for task items, split the sentence everytime it hits next paragraph
        const taskItems = description
            .split('\n') //split the sentence
            .map(t => t.trim()) //trim the word
            .filter(t => t.length > 0) //limitating the length of the word

        if(taskItems.length === 0){ //if the task item is not inserted
            Alert.alert("Error", "Please add one task."); //prompt error message
            return; //return state
        }
        //constant variable to store task data 
        const taskData = {
           userId: userId, //user id
           checklistTitle: title, //title
           taskItems: taskItems //task items
        };
        fetch("http://192.168.1.116/outeralert/insertChecklist.php", {
            method: 'POST', //use method post
            headers: { 'Content-Type' : 'application/json'}, //parse to json file
            body: JSON.stringify(taskData), //stringify the task data
        })
        .then(response => response.json()) //response to json file
        .then(data => { 
            if(data.success){ //if data parse success
                Alert.alert('Success', 'Checklist added!'); //display alert message
                setTitle(''); //set checklist title
                setDescription(''); //set checklist Description
                setModalVisible();//set modal visible
            }else{
                Alert.alert('Error', data.message || 'Checklist Failed to add.') //display error message
            }
        })
        .catch(error => { //catch an exception if not success
            console.error(error); //display console error
            Alert.alert('Error', 'Something Went Wrong'); //display alert message
        }); 
    }  
 
    //function to fetch inserted task
    const fetchChecklists = () => { 
        fetch(`http://192.168.1.116/outeralert/fetchChecklist.php?userId=${userId}`) //fetch data based on user's id
        .then(response => response.json()) //response to json file
        .then(data => { 
            if (data.success){ //if data parse success
                setChecklists(data.checklists); //extract the data of checklists
            }else{
                console.log("No Checklist Found"); //display log message if no checklist found
            }
        })
        //catch exception error
        .catch(error => console.error("Error fetching checklists: ", error)) //error message 
    };
    //use effect hooking on fetching database
    useEffect(() => {
        fetchChecklists(); 
    }, []);

    //function to pull on refresh handler
    const onRefresh = () => {
        setRefreshing(true); //set refresh state true
        fetch(`http://192.168.1.116/outeralert/fetchChecklist.php?userId=${userId}`) //fetch data based on user's id
        .then(response => response.json()) //response to json file
        .then(data => {
            if (data.success){  //if data parse success
                setChecklists(data.checklists); //extract the data of checklists
            }
            setRefreshing(false); //set refresh state false
        })
        .catch(error => {
            console.error("Error", error); //display error message
        });
    };

    //VIEW STRUCTURE
    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.5, y:0}}
        end={{ x:0.5, y:1}}
        style={styles.gradientBackground}
        >
            <View style={styles.container}>

                {/**HEADER */} 
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
  
                {/**TITLE */} 
                <View>
                    <Text style={[styles.titleText, {color: colors.text}]}>
                        CHECKLIST 
                    </Text>
                </View>
    
                {/**CHECKLIST */} 
                <View style={styles.heightWrapper}>
                    <ScrollView 
                        contentContainerStyle={styles.scrollContainer}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                    >
                        {checklists.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => navigation.navigate('ChecklistStatus', {
                                                                    userId, 
                                                                    username,
                                                                    profilePic, 
                                                                    checklistId: item.id, 
                                                                    checklistTitle: item.checklistTitle, 
                                                                    dateCreated: item.dateCreated,
                                                                    timeCreated: item.timeCreated, 
                                })} 
                            >
                            <LinearGradient
                                colors={['#2EFF2E', '#ffffff']}
                                location={[0, 0.5, 1]}
                                start={{ x:0, y:1}}
                                end={{ x:0.4, y:2}}
                                style={styles.checklistCard} 
                            >
                                <View style={styles.checklistContainer}>
                                    <Icon name = "clipboard" size={50} color="black" style={{marginRight: 30}}/>
                                    <View>
                                        <Text style={styles.checklistTitle}>{item.checklistTitle}</Text>
                                        <View style={styles.dateTimeRow}>
                                            <Text style={styles.checklistDate}>{item.dateCreated}</Text>
                                            <Text style={styles.checklistTime}>{item.timeCreated}</Text>
                                        </View>
                                    </View>
                                </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/**ADD BUTTON */} 
                <TouchableOpacity 
                    style={styles.plusButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Icon name="add" size={30} color="#000000"/>
                </TouchableOpacity>

                {/**MODAL POP-UP */} 
                <Modal visible={modalVisible} animationType='slide' transparent>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>ADD TASK</Text>

                            {/**TASK TITLE */} 
                            <TextInput
                                placeholder='Task Title'
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                            />

                            {/**TASK DESCRIPTION */} 
                            <TextInput
                                placeholder='Task Description'
                                style={[styles.input, {height: 180}]}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />

                            {/**BUTTONS */} 
                            <View style={styles.modalButtons}>
                                <TouchableOpacity 
                                    onPress={() => setModalVisible(false)}
                                    style={styles.modalCancelButton}
                                >
                                    <Text style={styles.buttonText}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={handleAddTask} 
                                    style={styles.modalAddBtn}
                                >
                                    <Text style={styles.buttonText}>ADD</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </LinearGradient>
    );
}

 
/***************************************************************/
////***************CHECKLIST ITEM STATUS**********************///
/***************************************************************/
//This page display task and objecitves from the checklist user inserted.

function ChecklistStatus({route, navigation}){
    const { userId, username, profilePic, checklistId, checklistTitle, dateCreated, timeCreated } = route.params; //pass parameters of checklist information
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);


    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic});
    };

     //use assets's font
    const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), //light
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), //medium
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), //bold
    });

    const [items, setItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    //Handle function for handle tasks
    const handleAddTask = () => {
        if(!title || !description){ //if the title and description is not filled
            Alert.alert('Error', "Please insert checklist properly."); //display the alert message
            return; //return the result
        }
       
        //Insertion data
        const taskData = {
           userId: userId, //user Id
           checklistTitle: title, //checklist title
           taskItems: [description] //task items
        };

        fetch("http://192.168.1.116/outeralert/insertChecklist.php", {   //fetch the php API
            method: 'POST', //use method post
            headers: { 'Content-Type' : 'application/json'}, //send JSON file
            body: JSON.stringify(taskData), //recieve the body of JSON file of data 
        })
        .then(response => response.json()) //response to JSON file
        .then(data => { 
            if(data.success){
                Alert.alert('Success', 'Checklist added!'); //display message if the task is added to the php.
                setTitle(''); //reset the checklist title
                setDescription(''); //reset the checklist description
                setModalVisible(); //set the modal visiblility.
            }else{
                Alert.alert('Error', data.message || 'Checklist Failed to add.') //display error messgae
            } 
        })
        .catch(error => {
            console.error(error); //display error in console
            Alert.alert('Error', 'Something Went Wrong'); //display alert message
        }); 
    }  

    /**Fetch checklist items that was written by user  */
    /**It collect the data of checklists based on individual user */
    useEffect(() => {
        fetch(`http://192.168.1.116/outeralert/fetchChecklistItems.php?checklistId=${checklistId}`)
        .then(res => res.json()) //pass data and convert to JSON file
        .then(data => {
            if(data.success){ //if the data convert success
                setItems(data.items); //extract the item from the data to setItem function
            }else{
                console.log("No Items Found"); //display log message
            }
        })
        .catch(err => console.error(err)); //catch an exception
    }, [checklistId]); //clean the array data 
    

    /**Function used to change the task status  */
    /**It collect the data of checklists based on individual user */
    const toggleTaskStatus = (id, currentStatus) => {
        //constant variables to store two status: 'done' or 'not done'
        const newStatus = currentStatus === 'done' ? 'not_done' : 'done'; 

        fetch("http://192.168.1.116/outeralert/updateTaskStatus.php",{
            method: 'POST', //use POST method
            headers: {'Content-Type' : 'application/json'}, //pass data to json
            body: JSON.stringify({id, status: newStatus}) //stringigy the data to json
        })
        .then(res => res.json()) //pass data and convert to JSON file
        .then(data => {
            if(data.success){ //if the data convert success
                setItems(prevItems => //extract the item from the data to setItem function
                    prevItems.map(item =>  //set the previous items to the map
                        item.id === id ? {...item, status: newStatus} : item //swicth the status to new status
                    )
                );
            }else{
                Alert.alert("Error", data.message || "Failed to update status"); //display error message
            }
        })
        //catch an exception
        .catch(err => console.error(err));
    }

    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.5, y:0}}
        end={{ x:0.5, y:1}}
        style={styles.gradientBackground}
        >
            {/**HEADER */}
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
                  
                {/**TITLE */} 
                <View>
                    <Text style={[styles.titleTextChecklist, {color: colors.text}]}>
                        CHECKLIST
                    </Text>
                </View>

                {/**BUTTON */}
                <View style={styles.itemsDateTimeContainer}>
                    <Text style={styles.dateText}>{dateCreated}</Text>
                    <Text style={styles.seperatorLine}>        </Text>
                    <Text style={styles.timeText}>{timeCreated}</Text>
                </View>

                <View style={styles.scrollContainer}>
                    <LinearGradient
                        colors={['#2EFF2E', '#ffffff']}
                        location={[0, 0.5, 1]}
                        start={{ x:0, y:1}}
                        end={{ x:0.4, y:2}}
                        style={styles.itemCard} 
                    >
                        <View style={styles.itemsTitleContainer}>
                            <Text style={styles.checklistTitleText}>{checklistTitle}</Text>
                        </View>
                    </LinearGradient>
                    <ScrollView>
                        {items.length > 0 ? (
                            items.map(task => (
                                <View key={task.id} 
                                    style={[styles.itemRow,
                                            {
                                                backgroundColor: task.status === 'done' ? '#d4ffd4' : '#ffd4d4',
                                                borderRadius: 8,
                                                paddingHorizontal: 25,
                                                marginVertical: 5,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }
                                    ]}
                                >
                                    <Pressable
                                        onPress={() => toggleTaskStatus(task.id, task.status)}
                                        style={{marginRight: 50}}
                                    >
                                        <Icon
                                            name ={task.status ==='done' ? 'checkmark-circle' : 'close-circle'}
                                            size = {22}
                                            color = {task.status === 'done' ? 'green' : 'red'}                                            />
                                    </Pressable>
                                    <View>
                                        <Text style={styles.itemText}>
                                            {task.checklistDesc}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text>No Task Found.</Text>
                        )}
                    </ScrollView>  
                </View>
                    

                {/**ADD TASK BUTTON */}
                <TouchableOpacity 
                    style={styles.plusButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Icon name="add" size={30} color="#000000"/>
                </TouchableOpacity>

                {/**MODAL INPUT */}
                <Modal visible={modalVisible} animationType='slide' transparent>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>ADD TASK</Text>
                            <TextInput
                                placeholder='Task Title'
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                            />

                            <TextInput
                                placeholder='Task Description'
                                style={[styles.input, {height: 180}]}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
  
                            {/**BUTTON */}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity 
                                    onPress={() => setModalVisible(false)}
                                    style={styles.modalCancelButton}
                                >
                                    <Text style={styles.buttonText}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={handleAddTask} 
                                    style={styles.modalAddBtn}
                                >
                                    <Text style={styles.buttonText}>ADD</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </LinearGradient>
    )
}
 
/***************************************************************/
////********************STACK SCREEN**************************///
/***************************************************************/

function ChecklistScreen({ route }){
    //parameters of users' data
    const { userId, username, profilePic } = route.params;

    //Stack Navigation
    return(
        <Stack.Navigator screenOptions={{ headerShown:false }}> 
            <Stack.Screen name="ChecklistPage" component={ChecklistPage} initialParams={{ userId, username, profilePic }}/>
            <Stack.Screen name="ChecklistStatus" component={ChecklistStatus} initialParams={{ userId, username, profilePic }}/>
        </Stack.Navigator>
    )
}
export default ChecklistScreen;

const styles = StyleSheet.create({

    /**NORMAL */
    container:{
        flex: 1,
    },

    gradientBackground:{
        flex: 1,
    },

    heightWrapper:{
        height: 590,
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
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25,
    },

    //**PLUS BUTTON */
    plusButton:{
        position: 'absolute',
        backgroundColor: '#ffffff',
        bottom: 110,
        right: 20,
        borderRadius: 30,
        padding: 12,
        elevation: 5,

    },

    /**CHECKLIST COLUMN */
    checklistCard:{
        paddingHorizontal: 45,
        paddingVertical: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 0.9,
        shadow: "#000000",
        shadowOffset: {  width:0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3
    },

    checklistContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },

    checklistTitle:{
        fontSize: 15,
        fontFamily: 'boldInter',
        color:'#333333',
    },

    dateTimeRow:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    checklistDate:{
        fontSize: 14,
        color: '#888888',
        marginRight: 10,
        marginTop: 5,
        fontFamily: 'boldInter',
    },

    checklistTime:{
        fontSize: 14,
        color: '#888888',
        marginTop: 5,
        fontFamily: 'boldInter',
    },

    /**MODAL */
    modalBackground:{
        flex: 1,
        backgroundColor:'rgba(0,0,0,0.8)',
        justifyContent:'center',
        alignItems: 'center',
    },

    modalContent: {
        backgroundColor: '#ffffff',
        padding: 20,
        width: '90%',
        borderRadius:10,
    },

    modalTitle:{
        fontSize: 15,
        fontFamily: 'boldInter',
        marginBottom: 25,
    },

    input:{
        borderWidth: 0.5,
        borderColor: "#cccccc",
        borderRadius: 8,
        padding: 15,
        marginBottom: 25,
    },

    modalButtons:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    modalCancelButton:{
        backgroundColor: '#ff5f5f',
        padding: 10,
        borderRadius: 8,
        marginRight: 15,
    },

    modalAddBtn:{
        backgroundColor: '#ff5f5f',
        padding: 10,
        borderRadius: 8,    
    },

    buttonText:{
        color: '#d5d5d5',
        fontFamily: 'mediumInter',
        fontSize: 13,
    },

    //**CHECKLISTS ITME */
    itemCard:{
        paddingHorizontal: 110,
        paddingVertical: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadow: "#000000",
        shadowOffset: {  width:0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3
    },

    titleTextChecklist:{
        fontSize: 14,
        fontFamily: 'mediumInter',
        color: '#000000',
        textAlign: 'center',
        marginVertical: 10,
    },

    itemsDateTimeContainer:{
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    itemsTitleContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },

    checklistTitleText:{
        fontSize: 14,
        color: '#000000',
        fontFamily: 'boldInter',
    },

    dateText:{
        fontSize: 14,
        color: '#555555',
        fontFamily: 'mediumInter'
    },

    timeText:{
        fontSize: 14,
        color: '#555555',
        fontFamily: 'mediumInter'
    },

    seperatorLine:{
        fontSize: 14,
        color: '#555555',
        marginHorizontal: 55,
    },

    itemRow:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderWidth: 1,
    },
 
    itemText:{
        fontSize: 14,
        color: '#000000',

    },

});