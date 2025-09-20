import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { ThemeContext } from '../componentFolder/colorComponent/ThemeContext';

const Stack = createStackNavigator(); //set navigation 

/***************************************************************/
////*****************TIPS AND HACK HOME PAGE******************///
/***************************************************************/
//This page display article image

function TipsHackHome({ route, navigation }){
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

     //use assets's font
     const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), //light
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), //medium
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), //bold
    });

    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic});//navigate to profile page, passing parameters
    };

    //constant variables
    const [articles, setArticles] = useState([]); //set article state
    const [search, setSearch] = useState(""); //set article search

    //use effect hooking on extraction of article
    useEffect(() => {
        //Calling API on php file
        fetch("http://192.168.1.116/outeralert/getArticle.php",{
            method: 'GET', //use get method
            headers: {"Content-Type" : "application/json"},  //send JSON file
        })
        .then((res) => res.json()) //response to JSON file
        .then((data) => { //if data sucessfully receive request
            if(data.success) setArticles(data.articles); //extarct the article from the data
        })
        //catch an exception and displaying error message console
        .catch((err) => console.log(err));
    }, []); //clear array to prevent memory leaks

    //filters the article array to include the article for headers
    const filteredArticles =articles.filter((a) => 
        a.articleTitle.toLowerCase().includes(search.toLowerCase())
    );

    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
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
                    TIPS AND TRICKS 
                </Text>
            </View>

            {/**SEARCH */}
            <View style={styles.paddingOutside}>
                <View style={styles.searchBar}>
                    <TextInput
                        placeholder='Search...'
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                    />
                    <Icon name="search" size={20} color="#333" style={{marginRight: 10}}/>
                </View>
            </View>
            
            {/**TIPS AND HACK IMAGE */}
            <View style={styles.paddingOutside}>
                <ScrollView>
                        {filteredArticles.length > 0 && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate("TipsHackArticle", {id: filteredArticles[0].id, username, profilePic})}
                            >
                            <Image
                                source={{ uri: 'http://192.168.1.116/outeralert/tipsHackImages/' + filteredArticles[0].articleImage}}
                                style={styles.featuredImage}
                            />
                            <Text style={[styles.featuredTitle, {color: colors.text}]}>
                                {filteredArticles[0].articleTitle}
                            </Text>
                            <Text style={[styles.featuredSub, {color: colors.text}]}>
                                {filteredArticles[0].articleSub}
                            </Text>
                            </TouchableOpacity>
                        )} 
                        <FlatList
                            data={filteredArticles.slice(1)}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2} 
                            scrollEnabled={false}
                            contentContainerStyle={styles.gridContainer}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.gridItem}
                                    onPress={() => navigation.navigate("TipsHackArticle", {id: item.id, username, profilePic})}
                                >
                                    <Image
                                        source={{ 
                                            uri: 'http://192.168.1.116/outeralert/tipsHackImages/' + item.articleImage}}
                                        style={styles.gridImage}
                                    />
                                    <View style={styles.paddingGrid}>
                                        <Text style={[styles.gridTitle, {color: colors.text}]} numberOfLines={2}>{item.articleTitle}</Text>
                                        <Text style={[styles.gridSub, {color: colors.text}]} numberOfLines={2}>{item.articleSub}</Text>
                                    </View>
                                </TouchableOpacity> 
                            )} 
                        />
                </ScrollView>
            </View>
        </LinearGradient>
    );
}

/***************************************************************/
////*****************TIPS AND HACK ARTICLE********************///
/***************************************************************/
// this page display the article content

function TipsHackArticle({ route, navigation }){
    const { id, username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), //light
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), //medium
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), //bold
    });

     //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic});//navigate to profile page, passing parameters
    };

    //constants variables
    const [article, setArticle] = useState(null); //set the article state null

    //use effect hooking on article's content extraction
    useEffect(() => {
        //Calling API on php file
        fetch(`http://192.168.1.116/outeralert/getArticleText.php?id=${id}`,{
            method: 'GET', //use get method
            headers: {"Content-Type" : "application/json"}, //parse to json file
        })
        .then((res) => res.json()) //response to json file
        .then((data) => {  
            if(data.success){ //if data parse success
                setArticle(data.article); //extract article data
        }else{
            //display error message
            console.log("Error", data.message)
        }
        })
        //catch an exception on error message
        .catch((err) => console.log(err));
    }, [id]); //clear the article's id array to prevent memory leaks


    return(
    <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.5, y:0}}
        end={{ x:0.5, y:1}}
        style={styles.gradientBackground}
        >
            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Icon name = "arrow-back" size={24} color="white"/>
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
                                    <Text style = {[styles.avatarText, {color: colors.text}]}>
                                        {firstAvatar}
                                    </Text>
                                </View>              
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/**ARTICLE CONTENT*/}
            {article ? (
                <>
                <Image
                    source={{
                        uri: "http://192.168.1.116/outeralert/tipsHackImages/" + article.articleImage,
                    }}
                    style={styles.articleImage}
                />
                <ScrollView>
                    <View style={styles.paddingArticleOutside}>
                        <Text style={[styles.articleTitle, {color: colors.text}]}>{article.articleTitle}</Text>
                        <View style={styles.dateTimeRow}>
                            <Text style = {styles.dateText}>
                                {new Date(article.created_at).toLocaleDateString()}
                            </Text>
                            <Text style = {styles.dateText}>
                                {new Date(article.created_at).toLocaleTimeString()}
                            </Text>
                        </View>
                        <Text style={[styles.articleSub, {color: colors.text}]}>{article.articleSub}</Text>
                        <Text style={[styles.articleContent, {color: colors.text}]}>{article.articleContent}</Text>
                    </View>
                </ScrollView>
                </>
            ):(
                <Text style={[styles.loadingSection, {color: colors.text}]}>
                    Loading Article...
                </Text>
            )}
        </LinearGradient>
    );
}

/***************************************************************/
////********************STACK SCREEN**************************///
/***************************************************************/
function TipsHackScreen({ route }){
    //parameters of users' data
    const { userId, username, profilePic } = route.params;

    //Stack Navigation
    return(
        <Stack.Navigator screenOptions={{ headerShown:false }}> 
            <Stack.Screen name="TipsHackHome" component={TipsHackHome} initialParams={{ userId, username, profilePic }}/>
            <Stack.Screen name="TipsHackArticle" component={TipsHackArticle}/>
        </Stack.Navigator>
    )
}

export default TipsHackScreen;

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
        zIndex: 3,
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

    /**SEARCH */
    paddingOutside:{
        paddingHorizontal: 35,
    },

    searchBar:{
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: "#ffffff",
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    searchInput:{
        flex: 1,
        fontSize: 14,
        paddingVertical: 5,
        paddingHorizontal: 10,
        color: '#333333',
    },

    /**NEWS CONTAINER */
    featuredImage:{
        height: 150,
        width: '100%',
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 25,
    },

    featuredTitle:{
        fontSize: 15,
        fontFamily: 'boldInter',
    },

    featuredSub:{
        fontSize: 13,
        fontFamily: 'lightInter',
    },

    gridContainer:{
        paddingVertical: 10,
    },

    paddingGrid:{
        alignItems: 'center',
    },

    gridItem:{
        flex: 1,
        alignItems: 'center',
        maxWidth: "50%", 
        marginBottom: 16,
    },  

    gridImage:{
        width: 140,
        height: 90,
        borderRadius: 8,
    }, 

    gridTitle:{
        marginTop: 5,
        fontSize: 12,
        fontFamily: 'mediumInter',
    },

    gridSub:{
        fontSize: 10,
        fontFamily: 'lightInter',
    },

    //ARTICLE
    paddingArticleOutside:{
        paddingHorizontal: 30,
        paddingTop: 140,
        paddingBottom: 135,
    },

    articleImage:{
        width: '100%',
        height: 200,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        position: 'absolute',
        top: 0,
        left:0,
        right: 0,
        zIndex: 2,
    },

    articleTitle:{
        fontSize: 22,
        fontFamily: "boldInter",
        color: '#000000',
        marginBottom: 8,
    },

    dateTimeRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingBottom: 15,
    },

    articleSub:{
        fontSize: 16,
        color: '#a3a3a3',
        marginBottom: 12,
        fontStyle: 'italic'
    },

    articleContent:{
        fontSize: 12,
        lineHeight: 22,
        color: '#333',
        marginBottom: 16,
        textAlign: 'justify'
    },

    dateText:{
        fontSize: 12,
        color: '#F60960',
        fontFamily: 'mediumInter',
    }
  
}) 