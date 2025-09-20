import React, {useEffect, useState, useContext} from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';
import XPUpdateSystem from '../componentFolder/quizComponents/quizExpLevelUp';
import { ThemeContext } from '../componentFolder/colorComponent/ThemeContext';

const Stack = createStackNavigator(); //set navigation

/***************************************************************/
////**********************QUIZ RESULT*************************///
/***************************************************************/
//Display Quiz Result
function QuizResult({route, navigation}){

    //pass parameters for users' data including level and experience
    const {correctCount, wrongCount, xpEarned, level, xp} = route.params;

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

     //use assets's font
    const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), //light
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), //medium
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), //bold
    });

    return(
        <LinearGradient
            colors={colors.gradient1}
            locations={[0, 0.5, 1]}
            start={{ x:0.5, y:0}}
            end={{ x:0.5, y:1}}
            style={styles.resultContainer}
        >
            {/**TITLE */}
            <View style={styles.resultTitleContainer}>
                <Text style={[styles.resultTitle,{color:colors.text}]}>
                    QUIZ RESULT
                </Text>
            </View>
 
             {/**ANSWER COUNTED */}
            <View style={styles.resultAnswerContainer}>
                <View style={styles.resultAnswerBox}>
                <Icon name="checkmark-circle" size={20} color="green"/>
                    <Text style={styles.correctText}>
                         CORRECT ANSWERED: {correctCount}
                    </Text>
                </View>
                <View style={styles.resultAnswerBox}>
                <Icon name="close-circle" size={20} color="red"/>
                    <Text style={styles.incorrectText}>  
                     WRONG ANSWERED: {wrongCount}
                    </Text>
                </View>
            </View>

            {/**EXPREIENCE EARNED */}
            <View style={styles.xpEarnedContainer}>
                <Image source={require("../img/icons/xp.png")} style={styles.xpIcon}/>
                <Text style={styles.earnedText}>XP earned: {xpEarned}</Text>
                <Text style={styles.earnedText}>Level: {level} | XP: {xp}/1000</Text>
            </View>

            {/**BUTTON */}
            <TouchableOpacity
                style={styles.backToPageButton}
                onPress={() => navigation.navigate('QuizPageScreen')}
            >
                <Text style={styles.backToPageButtonText}>Back To Quiz Page</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

/***************************************************************/
////**********************QUIZ SCREEN*************************///
/***************************************************************/
//Display Quiz Screen 
function QuizScreen({route, navigation}){

    //pass parameters for users' data including level and experience
    const {topic, userId, currentXP, currentLevel} = route.params || {};
    //pass parameter experience for update system based on the user id
    const { xp, level, addXP } = XPUpdateSystem(userId, currentXP, currentLevel);

    //constant variables
    const [timeLeft, setTimeLeft] = useState(600); //set time left state
    const [questions, setQuestions] = useState([]); //set questions state
    const [currentQIndex, setCurrentQIndex] = useState(0); //set current question index state
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null); //set selected option index state
    const [correctCount, setCorrectCount] = useState(0); //set correct count state
    const [wrongCount, setWrongCount] = useState(0); //set wrong count state
    const [loading, setLoading] = useState(true); //set loading state

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //use effect hooking on timer
    useEffect(() => {
        if(timeLeft <= 0) return; //if time back to 0, wtop the time
        //set up a timer that decrement time clock by 1 every second
        const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        //clean up function to clear timer before being mounted once again
        return() => clearInterval(timer);
    }, [timeLeft]); //Re-run the effect whenever timeleft changes

    //function to format seconds into "minutes and Seconds" string
    const formatTime = (seconds) => {
        const min = Math.floor(seconds/60); //calculate the whole minutes
        const sec = seconds % 60; //calculate remaining seconds
        return `${min}:${sec < 10 ? "0" : ""}${sec}`; //return formatted string with eading zero for seconds if less than 10
    }

    //use effect hooking on questions setting
    useEffect(() => {
        //Calling API on php file to extract question
        fetch(`http://192.168.1.116/outeralert/getQuestion.php?topic=${topic}`)
        .then(res => res.json()) //parse on JSON response
        .then(data => { //if the request sending succeed
            //constant variables for displaying question
            const formattedQuestions = (data.questions || []).map(q => ({
                question: q.questionText, //display question
                options: [q.optionA, q.optionB, q.optionC, q.optionD], //4 options 
                correctIndex: ["A", "B", "C", "D"].indexOf(q.correctOption) //indexed them as ABCD answer type
            }))
            setQuestions(formattedQuestions); //set the question via formatted  string
            setLoading(false);//set the loading state to falase
        })
        //catach an exception and display error message if failed
        .catch(err => console.error(err));
    }, [topic]); //clean question memory to prevent memory leaks
   
    //function to handle next question and selection
    const handleNext = async () => { 
        //constant variable to display current question index
        const currentQ = questions[currentQIndex];
        //if the answer selected is correct
        if (selectedOptionIndex === currentQ.correctIndex){
            setCorrectCount(prev => prev + 1); //set the correct to 1
        }else{ //if not correct
            setWrongCount(prev => prev + 1); //set the incorrect to 1
        }
        //if current question is not the last one
        if(currentQIndex < questions.length - 1){
            //move to the next question
            setCurrentQIndex(currentQIndex + 1);
            //reset the selected option for the new question
            setSelectedOptionIndex(null);
        }else{
            //constant variable for calculation
            //increment correct count if the answer is correct
            const finalCorrect = correctCount + (selectedOptionIndex === currentQ.correctIndex ? 1 : 0);
            //increment wrong count if the answer is incorrected
            const finalWrong = wrongCount + (selectedOptionIndex !== currentQ.correctIndex? 1 : 0);
            //calculate expereince points earned based on the correct answers
            const xpEarned = finalCorrect * 100;
            //add earned XP to user database
            await addXP (xpEarned);
            //Navigate to the quiz result, parsing the final states
            navigation.navigate('QuizResult', {
                correctCount: finalCorrect,
                wrongCount: finalWrong,
                xpEarned,
                level,
                xp
            });
        }
    };

    //handle question back
    const handleBack = async () => {
        if(currentQIndex > 0){
            //Go to the previous question
            setCurrentQIndex(currentQIndex - 1);
            //Reset selected option so that user can pick again
            setSelectedOptionIndex(null);
        }else{
            navigation.goBack();
        }
    };
    
    //if the site is loading, display loading indicator
    if(loading){
        return <ActivityIndicator size='large' color="#d5d5d5" style={{marginTop:50}}/>
    }

    //constant variables for question progress
    const question = questions[currentQIndex]; //set the current index of the question
    const progress = ((currentQIndex + 1) / questions.length) * 100; //for every question, progress bar increase by 100 meter

    return (
        <LinearGradient
            colors={colors.gradient2}
            style={styles.quizContainer}
        >
            {/**DISPLAY QUESTION BOX*/}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.questionBox}>
                    <View style={styles.timerBox}>
                        <Text style={styles.timerText}>
                            {formatTime(timeLeft)}
                        </Text>

                        {/**DISPLAY QUESTION*/}
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>{question?.question}</Text>
                        </View>

                        {/**PROGRESS BAR*/}
                        <Text style={styles.progressText}>
                            {currentQIndex + 1} / {questions.length}
                        </Text>
                        <View style={styles.progressBar}> 
                            <View style={[styles.progressBarFill, {width: `${progress}`}]}/>
                        </View>
                    </View>
                </View>

                {/**OPTION BAR */}
                <View style={styles.optionContainer}>
                    {question?.options.map((opt, index) => (
                        <Pressable
                            key={index}
                            style={[
                                styles.optionBox,
                                selectedOptionIndex === index && { backgroundColor: '#a8dadc'}
                            ]}
                            onPress={() => setSelectedOptionIndex(index)}
                        >
                            <Text style={styles.optionText}>{opt}</Text>
                        </Pressable>
                    ))}
                </View>

                {/**NAVIGATION BUTTON*/}
                <View style={styles.navigationButton}> 
                    <Pressable style={styles.navButton} onPress={handleBack}>
                        <Text style={styles.navButtonText}>BACK</Text>
                    </Pressable>
                    <Pressable style={styles.navButton} onPress={handleNext}>
                        <Text style={styles.navButtonText}>NEXT</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

/***************************************************************/
////*****************QUIZ PAGE SCREEN*************************///
/***************************************************************/
//Display Quiz page Screen for selection
function QuizPageScreen({ route, navigation }){

    //pass parameters for users' data including level and experience
    const { userId, username, profilePic, level } = route.params || {};
    //pass parameter experience for update system based on the user id
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?';

    //use assets's font
    const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), //light
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), //medium
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), //bold
    });

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic});//navigate to profile page, passing parameters
    };

    // variety cards for question topics
    const topicCards = [
        {
            //first aid
            topic: 'firstAid',
            label: 'FIRST AID',
            image: require('../img/stockImage/first-aid.jpg')
        },
        {
            //electric
            topic: 'electric',
            label: 'SAFET FIRST',
            image: require('../img/stockImage/electric.png')
        },
        {
            //blackout
            topic: 'blackOut',
            label: 'BLACKOUT',
            image: require('../img/stockImage/blackout.jpg')
        },
    ]
     
    return (
       <LinearGradient
            colors={colors.gradient1}
            locations={[0, 0.5, 1]}
            start={{ x:0.5, y:0}}
            end={{ x:0.5, y:1}}
            style={styles.gradientBackground}
        >
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

                {/**TITLE */}
                <View>
                    <Text style ={[styles.titleText,{color:colors.text}]}>
                        QUIZ
                    </Text>
                </View>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer} 
                showsVerticalScrollIndicator={false}
            >  
                    {/**IMAGE DESCRIPTION */}
                    <View style={styles.topRectangleTitleImage}>
                        <Image
                        source={require('../img/stockImage/puzzle.jpg')}
                        resizeMode='cover'
                        style={[styles.imageFitter, {opacity: 1}]}
                        />
                        <Text style={styles.overlayTextTitle}>
                            KNOWLEDGE's {"\n"}
                            FIRST HAND
                        </Text>
                    </View>

                    {/**SUB TITLE */}
                    <View>
                        <Text style={styles.subtitleText}>
                            Test Your Skills
                            </Text>
                    </View>
 
                    {/**TOPIC SELECTION 1*/}
                    {topicCards.map((item, i) => (
                        <TouchableOpacity
                        key={i}
                        style={styles.topRectangle}
                        onPress={() => navigation.navigate('QuizScreen', {topic: item.topic,
                                                                            userId,
                                                                            currentXP: 0,
                                                                            currentLevel: level
                        })}
                        >
                        <Image source={item.image} style={styles.imageFitter} resizeMode='cover' />
                        <View style={styles.imageWhiteOverlay}></View>
                        <Text style={styles.overlayText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}

                    {/**TOPIC SELECTION 2*/}
                    <View>
                        <Text style={styles.subtitleText}>
                            Catogory
                        </Text>
                    </View>
                    <ScrollView
                        horizontal showsHorizontalScrollIndicator={false}
                        style={styles.carouselContainer}
                    >
                        {[
                            {
                                topic: 'earthquake', 
                                title: 'Earthquake', 
                                subtitle:'Quake of terror',
                                image: require('../img/stockImage/fire.jpg')
                            },
                            {
                                topic: 'tsunami',
                                title: 'Tsunami', 
                                subtitle:'Wave of terror',
                                image: require('../img/stockImage/tsunami.jpg')
                            },
                            {
                                topic: 'flashflood',
                                title: 'Flash Flood', 
                                subtitle:'Rising Water Level',
                                image: require('../img/stockImage/flashflood.jpg')

                            },
                            {
                                topic: 'fireSafety',
                                title: 'Fire', 
                                subtitle:'It Spreads!',
                                image: require('../img/stockImage/fire.jpg')

                            },
                        ].map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.quizCard}
                                onPress={() => navigation.navigate('QuizScreen', {
                                    topic: item.topic,
                                    userId,
                                    currentXP: 0,
                                    currentLevel: level
                                })}
                            >
                                    <Image source={item.image} style={styles.imageFitterCard} resizeMode='cover' />
                                    <Text style={styles.quizCardTitle}>{item.title}</Text>
                                    <Text style={styles.quizCardSubtitle}>{item.subtitle}</Text>
                            </TouchableOpacity>
                        ))}
                </ScrollView>
            </ScrollView>
        </LinearGradient>
    );
}

/***************************************************************/
////********************STACK SCREEN**************************///
/***************************************************************/
function QuizStack({ route, navigation })
{
    //pass parameter for username and profile pictures
    const {userId, username, profilePic, level} = route.params || {}; 

    //Stack Navigation
    return(
        <Stack.Navigator screenOptions={{ headerShown:false }}> 
            <Stack.Screen name="QuizPageScreen" component={QuizPageScreen} initialParams={{ userId, username, profilePic, level }}/>
            <Stack.Screen name="QuizScreen" component={QuizScreen} />
            <Stack.Screen name="QuizResult" component={QuizResult} />
        </Stack.Navigator>
    )
}

export default QuizStack;

const styles = StyleSheet.create({

    //NORMAL
    screenContainer:{
        flex: 1,
    },

    container:{
        flex: 1,
        paddingHorizontal: 15,
        alignItems: 'center',
        paddingTop: 5,
    },

    text: {
        fontSize: 20,
        fontWeight:'bold'
    },

    titleText:{
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25,
    },

    subtitleText:{
        fontSize: 15,
        fotFamily: 'lightInter',
        alignSelf: 'flex-start',
        marginBottom: 15,
        color: '#000000',
    },

    gradientBackground:{
        flex:1
    },

    scrollContainer:{
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingBottom: 60,
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

    //QUIZ SELECTION
    topRectangleTitleImage:{
        width: '90%',
        height: 150,
        borderRadius: 30,
        backgroundColor: '#ffffff',
        marginBottom: 20,
        borderWidth: 0.5,
        overflow: 'hidden',
        position: 'relative',
    },

    imageFitter:{
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },

    imageWhiteOverlay:{
        position: 'absolute',
        top:0,
        left: 0,
        bottom: 0,
        right:0,
        backgroundColor:'rgba(255, 255, 255, 0.5)',
    },
    
    overlayTextTitle:{
        position: 'absolute',
        top: 40,
        left: 60,
        fontFamily: 'boldInter',
        color: "#ff5f5f",
        fontSize: 25,
        textShadowColor: '#000000',
        textShadowOffset: {width:-2, height:2},
        textShadowRadius: 9,
        zIndex: 1,
    },

    overlayText:{
        position: 'absolute',
        fontFamily: 'boldInter',
        color: "#63dce3",
        fontSize: 20,
        textShadowColor: '#000000',
        textShadowOffset: {width:-1, height:2},
        textShadowRadius: 0.5,
        zIndex: 1,
    },

    topRectangle:{
        width: '95%',
        height: 150,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 0.5,
        overflow: 'hidden',
        position: 'relative',
    },

    carouselContainer:{
        marginTop: 10,
        marginBottom: 50,
        paddingLeft: 10,
    },

    quizCard:{
        width: 130,
        height: 130,
        backgroundColor: '#fff',
        justifyContent:'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        padding: 10,
    },

    quizCardTitle:{
        fontSize: 14,
        fontFamily: 'boldInter',
        textAlign: 'center',
        color:'#63dce3',
        marginBottom: 4,
        textShadowColor: '#000000',
        textShadowOffset: {width:0, height:2},
        textShadowRadius: 0.5,
    },

    quizCardSubtitle:{
        fontsize:12,
        fontFamily: 'mediumInter',
        color:'#ffffff',
        textAlign: 'center',
        textShadowColor: '#000000',
        textShadowOffset: {width:0, height:2},
        textShadowRadius: 0.5,
    },

    imageFitterCard:{
        ...StyleSheet.absoluteFillObject,
        width: '119%',
        height: '119%',
    },

    topRectangleText:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000'
    },

    //QUIZ SCREEN
    quizContainer:{
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    
    timerBox:{
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },

    timerText:{
        fontSize: 15,
        fontFamily: 'boldInter',
        marginBottom: 10,
    },

    questionBox:{
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginTop: 0,
        marginBottom: 30,
        paddingTop: 50,
        paddingBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width:0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    questionContainer:{
        alignItems: 'center',
        marginBottom: 20,
    },

    questionText:{
        fontSize: 16,
        fontFamily: 'lightInter',
        textAlign: 'center',
    },

    progressText:{
        fontSize: 13,
        marginBottom: 15,
    },

    progressBar:{
        width: '80%',
        height: 10,
        backgroundColor: '#fffff',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },

    progressBarFill:{
        width: '20%',
        height: '100%',
        backgroundColor: 'tomato',
        borderRadius: 5
    },

    optionContainer:{
        width: '90%',
        marginBottom: 30,
    },

    optionBox:{
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    optionText:{
        fontSize: 14,
        color: '#333'
    },

    navigationButton:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 30,
    },

    navButton:{
        backgroundColor: '#ff6b5c',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
    },

    navButtonText:{
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
    },

    /**RESULT SCREEN */
    resultContainer:{
        flex:1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    resultTitleContainer:{
        paddingHorizontal: 25,
        paddingVertical: 10,
        marginBottom: 35,
        backgroundColor: '#f7f411',
        borderRadius: 15,
        justifyContent: 'center', 
        alignItems: 'center',
        elevation: 8,
        shadowOffset: {width: 2, height: 4},
        shadowColor: '#000000',
        shadowOpacity: 0.14,
        shadowRadius: 6,
    },

    resultTitle:{
        fontSize: 20, 
        fontFamily: 'boldInter',
        color: '#a8a8a8',
    },

    resultAnswerContainer:{
        flexDirection: 'column',
        justifyContent: 'space-between', 
        padding: 35,
        backgroundColor: '#c4f5e0',
        borderWidth: 5,
        borderColor: "#1a6102",
        borderRadius: 15,
    },

    resultAnswerBox:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },

    correctText:{
        fontSize: 14,
        left: 5,
        fontFamily: 'boldInter',
        color: '#16ba25'
    },
    
    incorrectText:{
        fontSize: 14,
        left: 5,
        fontFamily: 'boldInter',
        color: '#d60628'
    },

    xpEarnedContainer:{
        paddingHorizontal: 25,
        paddingVertical: 30,
        marginTop: 10,
        justifyContent: 'center', 
        alignItems: 'center',
    },

    xpIcon:{
        width: 50,
        height:50,
        resizeMode: 'contain',
        marginBottom: 10,
    },

    earnedText:{
        fontSize: 14,
        fontFamily: 'boldInter',
        color: '#181A8C'
    },

    backToPageButton:{
        backgroundColor: '#ff5f5f',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,    
    },

    backToPageButtonText:{
        color: '#d5d5d5',
        fontFamily: 'boldInter',
        fontSize: 15,
    }
});