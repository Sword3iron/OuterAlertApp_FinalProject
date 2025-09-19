
/***************************************************************/
////*****************FUNCTION UNIT TEST***********************///
/***************************************************************/
//TEST FUNCTION 
//This whole page is used for unit testing
//combine all the function together for simplifying testing

//create a mock data for testing
let checklists = []; //checklist
let user = { //user data
    username: 'testUser',
    password: 'abcd1234',
    profilePic: 'userPicture.png',
    xp: 0,
    level: 1,
};
let notifications = []; //notifications array

//Caling a first-responder number
function callFirstResponder(number){
    if(!number) throw new Error("No Number Provided");
    return `Calling first responder at ${number}`;
}

//Caling a first-responder with the same number
function callOtherResponder(number){
    if(!number) throw new Error("No Number Provided");
    return `Calling other responder at ${number}`;
}

//insert a checklist
function insertChecklists(name){
    if(!name) throw new Error ("Checklist name is required!");
    checklists.push({name, items: [] });
    return checklists;
}

//insert an item into the checklist
function insertChecklistsItem(listIndex, itemName){
    if (!itemName) throw new Error("Item name required");
    if (!checklists[listIndex]) throw new Error("Chcklist not found");
    checklists[listIndex].items.push({ name: itemName, done: false});
    return checklists[listIndex].items;
}

//mark the item as done or undone
function markItemDone(listIndex, itemIndex){
    const item = checklists[listIndex]?.items[itemIndex];
    if (!item) throw new Error("Item not found");
    item.done = !item.done;
    return item.done;
}

//Select a quiz topic
function selectQuizTopic(topic){
    const topics = ["Earthquake", "Flood", "Fire"];
    if(!topics.includes(topic)) throw new Error("Topic not found");
    return topic;
}

//Select a correct and wrong answer
function answerQuestion(correct){
    if(correct){
        user.xp += 10;
        if(user.xp >= 50) user.level++;
        return "Correct";
    }else{
        return "Wrong";
    }
}

//Change the password
function changePassword(newPassword){
    if(!newPassword) throw new Error("Password is required!");
    user.password = newPassword;
    return true;
}

//Change the profile pictures
function changeProfilePic(newProfilePic){
    if(!newProfilePic) throw new Error("Profile Picture is required!");
    user.profilePic = newProfilePic;
    return true;
}

//Change the username
function changeUsername(newUsername){
    if(!newUsername) throw new Error("Username is required!");
    user.username = newUsername;
    return true;
}

//push notification message
function pushNotification(message){
    notifications.push({message, seen: false});
}

//receive notification message
function receiveNotification(){
    const notif = notifications.shift();
    if (!notif) throw new Error ("Earthquake hit 2.4");
    return notif;
}

//export functions
module.exports = {
    callFirstResponder,
    callOtherResponder,
    insertChecklists,
    insertChecklistsItem,
    markItemDone,
    selectQuizTopic,
    answerQuestion,
    changePassword,
    changeProfilePic,
    changeUsername,
    pushNotification,
    receiveNotification,
    checklists,
    user,
    notifications,
};