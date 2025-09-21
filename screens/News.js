import React, {useEffect, useState, useContext, useCallback} from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Image, TouchableOpacity, ActivityIndicator, Linking, Alert, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { ThemeContext } from '../componentFolder/colorComponent/ThemeContext';
import useNewsDataApiClient from "newsdataapi";

const Stack = createStackNavigator(); //set navigation 

/***************************************************************/
////**********************NEWS PAGE***************************///
/***************************************************************/
//News page where headlines and other information display

function NewsPage({ route, navigation }){
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //extracting font families 
     const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), //light inter
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), //medium inter
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), //bold inter
    });

    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic});//navigate to profile page, passing parameters
    };    

    //constant variables
    const [articles, setArticles] = useState([]); //set article state
    const [loading, setLoading] = useState(true); //set loading state
    const [refreshing, setRefreshing] = useState(false); //set refreshing state

    //API URL Link
    const API_URL = "https://newsdata.io/api/1/latest?apikey=pub_48a2d8ea54554f75ad27fd6b4a9b7f4e&q=disaster%2Cnatural%2Clocal%2Casia"
    
    //function to fetch news information
    const fetchNewsJson = async () => {
        try {
            const response = await fetch(API_URL); //make fetch request
            const json = await response.json(); //parse the JSON response

            //if the response indicate success and it contain array of results
            if(json.status === "success" && Array.isArray(json.results)){ 
                setArticles(json.results); //update the articles state with the fetch results.
            }else{
                setArticles([]); //clear article memory array to prevent leaks
            }
        }catch (error){
            //catch an exception if it handle any error during data fetch
            console.error(error);
            setArticles([]); //clear the article on the error
        }finally{
            //stop hooking on loading and refreshing state
            setLoading(false); //loading state set to false
            setRefreshing(false); //refreshing state set to false
        }
    };
    
    //use effect hooking on fetch news data on component mount
    useEffect(() => {
        fetchNewsJson(); //function to fetch news data
    }, []); //empty dependency array to prevent memory leaks

    //render loading indicator if fonts are not loaded
    if(!fontLoaded){
        return <ActivityIndicator size='large' color="#4791c9" />
    }

    //determine the primary headline of the first article section header
    const headline = Array.isArray(articles) && articles.length > 0 ? articles[0] : null;
    //slice 5 article below the headlines for display
    const otherArticles = Array.isArray(articles) && articles.length > 1 ? articles.slice(1, 6) : [];

    //function to handle refreshing component
    const onRefresh = useCallback(() => {
        setRefreshing(true);//set refreshing state to true
        fetchNewsJson();  //fetch news data 
    });

    return(
        <LinearGradient
        colors={colors.gradient1}
        location={[0, 0.5, 1]}
        start={{ x:0.5, y:0}}
        end={{ x:0.5, y:1}}
        style={styles.gradientBackground}
        >
            <View style={styles.container}>
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
                        <Text style={[styles.titleText, {color:colors.text}]}>
                            NEWS
                        </Text>
                    </View>

                    {/**NEWS HEADLINES */}
                    {headline && (
                        <TouchableOpacity
                            style={styles.headlineCard}
                            onPress={() => navigation.navigate('NewsArticle', {article:headline})}
                        >
                        <Image 
                            source=
                            {headline.image_url ? 
                                {uri: headline.image_url} 
                                : require('../img/icons/newspaper.png')
                            }
                            style={styles.headlineImage}
                        />
                        <View style={styles.headlineOverlay}>
                            <Text style={styles.headlineTitle} numberOfLines={2}>
                                {headline.title}
                            </Text>
                        </View>

                        </TouchableOpacity>
                    )}

                {/**OTHER HEADLINES TITLE */}
                <View style={styles.paddingOutside}>
                    <Text style={[styles.subText, {color:colors.text}]}>
                        Other Headlines
                    </Text>
                </View>

                {/**OTHER HEADLINES */}
                <View style={styles.newsWrapper}>
                    <ScrollView
                        refreshControl=
                            {<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                        }
                    >
                        <View style={styles.paddingOutside}>
                            {loading ? (
                                <ActivityIndicator size="large" color='#4791c9' />
                            ) : otherArticles.length === 0 ? (
                                <Text style={styles.noNewsText}>We Be Right Back With More Update!</Text>
                            ) : (
                                otherArticles.map((item, index) => (
                                    <View key={index} style={styles.newsCard}>
                                        {item.image_url ? (
                                            <Image source = {{ uri: item.image_url}} style={styles.newsImage}/>
                                        ) : (
                                            <Image 
                                                source={require('../img/icons/newspaper.png')}
                                                style={styles.newsImage}
                                            /> 
                                        )}
                                        <View style={styles.textContainer}>
                                            <Text style={styles.newsTitle} numberOfLines={2}>
                                                {item.title}
                                            </Text>
                                            <Text style={styles.dateTime}>
                                                {new Date(item.pubDate).toLocaleDateString()} | {''}
                                                {new Date(item.pubDate).toLocaleTimeString()}
                                            </Text>
                                            <TouchableOpacity
                                                    style={styles.readMoreButton}
                                                    onPress={() => navigation.navigate('NewsArticle', {article: item})}
                                            >
                                                <Text style={styles.readMoreText}>Read More</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </LinearGradient>
    );
}
  
/***************************************************************/
////******************NEWS ARTICLES***************************///
/***************************************************************/
//This page display news article 
//Article can be read and share

function NewsArticle({ route, navigation }){
    const { username, profilePic, article } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //extracting font families 
    const [fontLoaded] = useFonts({ //use font from font loaded
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), //light inter
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), //medium inter
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), //bold inter
    });

    //if the article is not fetched or out of headlines
    //return message
    if (!article){
        return (
            <View style={styles.center}>
                <Text>Sorry, Please Refresh Again</Text>
            </View>
        );
    }

    //function that allow user to share the article to social media platform
    //due to react native compability, the request will use link instead.
    //using share link from HTML method
    const platformMediaShare = (platform) => {
        const url = article.link || ''; //display url link
        const title = article.title || ''; //display article title
        const links = { //links for social media platform
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        };
        if(links[platform]) Linking.openURL(links[platform]); //if platform link tapped, naviagte to the social media platform respectively.
    }

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
                </View>
            </View>

            {/**ARTICLE IMAGE */}
            {article.image_url ? (
                <Image source={{ uri:article.image_url }} style={styles.articleImage}/>
            ) : (
                <Image 
                    source = {require('../img/icons/newspaper.png')}
                    style = {styles.articleImage}
                />
            )}

            {/**ARTICLE*/}
            <View style={{flex: 1}}>
                <View style={styles.paddingArticleOutside}>
                    <ScrollView>
                        <Text style={[styles.articleTitle, {color:colors.text}]}>{article.title}</Text>

                        <Text style={[styles.articleAuthor, {color: colors.text}]}>
                            {article.creator ? `by ${article.creator}` : 'Unknown Author'} | {''}
                        </Text>

                        <View style={styles.timeDateRow}>
                            <Text style={[styles.articleDateTime, {color: colors.text}]}>
                                {new Date (article.pubDate).toLocaleDateString()}
                            </Text>
                            <Text style={[styles.articleDateTime, {color: colors.text}]}>
                                {new Date (article.pubDate).toLocaleTimeString()}
                            </Text>    
                        </View>

                        <Text style={[styles.articleContent, {color: colors.text}]}>
                            {article.description || 'No Text Avaliable'}
                        </Text>

                        {/**ARTICLE SHARING */}
                        <View style={styles.shareContainer}>
                        <View style={styles.shareTextContainer}>
                            <Text style={[styles.shareText, {color: colors.text}]}>Share: </Text>
                            <View style={styles.shareIconRow}>
                                <TouchableOpacity onPress={() => platformMediaShare('facebook')} style={styles.socialIcon}>
                                    <FontAwesome name='facebook' size={28} color="#000000"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    </ScrollView>
                </View>
            </View>
        </LinearGradient>
    );
}

/***************************************************************/
////********************STACK SCREEN**************************///
/***************************************************************/
/**MAIN PAGE STACK FOR PROFILE PAGE */
//Main Function - Navigation for profile page

function NewsScreen({route, navigation})
{
    //parameters of users' data
    const {userId, username, profilePic} = route.params || {};

    //Stack Container
    return(
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name="NewsPage" component={NewsPage} initialParams={{userId, username, profilePic}}/>
            <Stack.Screen name="NewsArticle" component={NewsArticle} initialParams={{userId, username, profilePic}}/>
        </Stack.Navigator>
    )
}

export default NewsScreen;

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

    paddingOutside:{
        paddingHorizontal: 30,
    },

    newsWrapper:{
        height: 300,
        paddingbottom: 50,
    },

    //NEWS CARD
    titleText:{
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25,
    },

    subText:{
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 20,
    },
    
    headlineCard:{
        width: '90%',
        height: 210,
        borderRadius: 12,
        overflow:"hidden",
        alignSelf: 'center',
        marginBottom: 16,
        elevation: 5,
        backfaceVisibility: '#cccccc',
    }, 
 
    headlineImage:{
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },

    headlineOverlay:{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    headlineTitle:{
        color: '#ffffff',
        fontSize: 12,
        textAlign: 'center',
    },

    newsCard: {
        flexDirection:'row',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 15,
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowOffset: {width:0, height:2},
        shadowRadius: 5,
        elevation: 3,
    },

    newsImage:{
        width: 100,
        height: 100,
        borderRadius: 10,
    },

    textContainer:{
        flex:1,
        marginLeft:10,
        justifyContent: 'space-between',
    },

    newsTitle:{
        fontSize: 14,
        fontFamily: 'boldInter',
        marginBottom: 5
    },

    dateTime:{
        fontSize: 12,
        color: '#555555',
        marginBottom: 5,
    },

    readMoreButton:{
        backgroundColor: '#ff6f61',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },

    readMoreText:{
        color: '#ffffff',
        fontSize: 12,
        fontFamily: 'boldInter'
    },

    //ARTICLE
    paddingArticleOutside:{
        paddingHorizontal: 30,
        paddingTop: 140,
        paddingBottom: 50,
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
        fontFamily: 'boldInter',
        fontSize: 15,
        marginBottom: 10,
    },

    articleAuthor:{
        fontFamily: 'lightInter',
        color: '#555555',
        fontSize: 15,
        marginBottom: 10,
    },

    timeDateRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    articleDateTime:{
        fontFamily: 'mediumInter',
        color: '#555555',
        fontSize: 10,
        marginBottom: 25,
    },

    articleContent:{
        fontFamily: 'lightInter',
        color: '#555555',
        fontSize: 13,
        marginBottom: 5,
    },

    //SHARE ICON ROW
    shareContainer:{
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },

    shareText:{
        left: 5,
        marginBottom: 10,
        fontFamily: 'mediumInter',
        fontSize: 15,
    },

    shareTextContainer:{
       paddingHorizontal: 5,
       paddingBottom: 50,
    },

    shareIconRow:{
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
    },

    socialIcon:{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    }
});