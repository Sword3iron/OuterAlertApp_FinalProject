/***************************************************************/
////*******************JEST UNIT TEST*************************///
/***************************************************************/
//This whole page is used for unit testing
//it relied on using jest unit testing libraries
//combine all the function together for simplifying testing
const app = require('./functionTest');

//CALL PAGE
describe("CALL PAGE", ()=>{
    //Caling a first-responder number
    test("Calling ambulance", () => {
        expect(app.callFirstResponder("999")).toBe("Calling first responder at 999");
    });

    //Caling a first-responder with the same number
    test("Calling Police - Same Number", () => {
        expect(app.callOtherResponder("999")).toBe("Calling other responder at 999");
    });
});
//CHECKLIST PAGE
describe("CHECKLIST PAGE", ()=>{
    //Sorting the checklist length before and each
    beforeEach(() => {
        app.checklists.length = 0;
    });

    //insert a checklist
    test("Checklist insertion", () => {
        app.insertChecklists("Assisting Families");
        expect(app.checklists.length).toBe(1);
    });

    //insert an item into the checklist
    test("item insertion", () => {
        app.insertChecklists("Secure Safety Location");
        app.insertChecklistsItem(0, "Find Shelter");
        expect(app.checklists[0].items.length).toBe(1);
    });

    //mark the item as done or undone
    test("Mark item done and not done", ()=> {
        app.insertChecklists("Help Family");
        app.insertChecklistsItem(0, "Buy Medicine Kit");
        const done = app.markItemDone(0, 0);
        expect(done).toBe(true);
        const undone = app.markItemDone(0, 0);
        expect(undone).toBe(false);
    });
});

//QUIZ PAGE
describe ("QUIZ", () => {
    //Select a quiz topic
    test("Select Topic", () => {
        expect(app.selectQuizTopic("Flood")).toBe("Flood");
    });

    //Select a correct answer
    test("Select the correct answer", () =>{
        expect(app.answerQuestion(true)).toBe("Correct!");
    })

    //Select a wrong answer
    test("Select the wrong answer", () =>{
        expect(app.answerQuestion(false)).toBe("Wrong!");
    })

    //increase an experience for every correct answer
    test("Select the correct answer and increase XP", () => {
        const startXP = app.user.xp;
        app.answerQuestion(true);
        expect(app.user.xp).toBe(startXP + 10);
    });
});

//PROFILE PAGE
describe ("PROFILE SETTINGS", () => {
    //Change the password
    test("Change the password", () => {
        expect(app.changePassword("newone123")).toBe(true);
    });

    //Change the profile pictures
    test("Change the profile picture", () => {
        expect(app.changeProfilePic("profile.png")).toBe(true);
    });

    //Change the username
    test("Change the username", () => {
        expect(app.changeUsername("theusername123")).toBe(true);
    });
});

//NOTIFICATION PAGE
describe("RECEIVE NOTIFICATION", () => {
    //Receive the notification as soon as it pop up
    test("Receive soon after it pop up", () => {
        app.pushNotification("Test Notification");
        const notif = app.receiveNotification();
        expect(notif.message).toBe("Test Notification");
        expect(() => app.receiveNotification()).toThrow("Earthquake hit 2.4");
    });
});


/***************************************************************/
////**********************SNAPSHOTS***************************///
/***************************************************************/

describe("SNAPSHOT TESTING", () => {
    beforeEach(() => {
        //Reset data before snapshot tests
        app.checklists.length = 0;
        app.user.xp = 0;
        app.user.level = 1;
        app.notifications.length = 0;
    });

    //CHECKLISTS
    test("Checklist Function", () => {
        app.insertChecklists("Secure Safety Location");
        app.insertChecklistsItem(0, "Find Shelter");
        app.insertChecklistsItem(0, "Buy Medicine Kit");

        //take snapshot
        expect(app.checklists).toMatchSnapshot();
    });

    //PROFILE
    test("User Profile", () => {
        app.changeUsername("newone123");
        app.changeProfilePic("profile.png");
        app.changePassword("theusername123");

        //take snapshot
        expect(app.user).toMatchSnapshot();
    })

    //NOTIFICATION
    test("Notification Function", () => {
        app.pushNotification("Earthquake hit 2.4");
        app.pushNotification("Flood Hit Habour");

        //take snapshot
        expect(app.notifications).toMatchSnapshot();
    });
});