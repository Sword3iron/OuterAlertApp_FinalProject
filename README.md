# OuterAlert
Local Disaster Preparadness and Response - Mobile Application
--------------------------------------------------------------

Requirement: <br>
Software: Android Studio, Expo Go, XAMPP, Visual Studio Code (IDE) <br>
Framework: React-Native <br> 
Language: PHP, JavaScript <br>

Greetings! This is the code repository of OuterAlert, a mobile application developed for Local Disaster
Preparadness and Response. This app is designed to providing real-time alert-based information regarding 
the geographical conditions, sending out distress signal to the first-responders for immediate assistance, 
gamification throughout interactive engagement and other reliable resources that may help users to prepares 
for and make quick and informed decisions during a crisis. 


1. Download the 'OuterAlertApp_FinalProject'.zip folder from GitHub. 
2. Put the .zip folder and extract it in your working environment.
3. Download the require software:
   - XAMPP ("https://www.apachefriends.org/download.html")
   - Expo Go (Google Play Store, IOS store)
4. Inside the 'OuterAlertApp_FinalProject' there is a MySQL file ('outeralert.sql') and PHP .zip folder ('outeralert(phpfiles)'). DO NOT DELETE both of them.
5. After downloaded XAMPP, install the software to your backend environment (C:\Xampp)
6. Click inside the folder the XAMPP, you will see 'htdocs' folder, click inside.
7. Extract the PHP .zip folder ('outeralert(phpfiles)') in there.
8. Then, open your XAMPP Control Panel, and activate both 'Apache' and 'MySQL' by tapping 'Start' button.
9. After that, tap the 'Admin' button to open phpMyAdmin page.
10. Inside phpMyAdmin, go to 'import' option on top bar.
11. Drag the MySQL file ('outeralert.sql') to the page, it would automatically load the database.
12. Open up your IDE (Visual Studio Code, Atom), and open the 'OuterAlertApp_FinalProject' as workspace.
13. Open up terminal and type 'cd..' to your folder location
14. type 'npm install' to start install libraries used in the project.
15. Then, depend on you server, you might want to make modification to make the project work:<br>
    <u>IP ADDRESS</u>
    - For some page in 'screen' folder, look at the URL link of this: "http://192.168.1.116/outeralert/{phpFileName}/"
    - change the IP address router '192.168.1.116' to your current IP address.
    - type 'ipconfig' to know your router. <br>
    <u>PORT NUMBER</u>
    - Go to 'Database.db' on your 'outeralert' folder from 'htdocs' (XAMPP)
    - Depend on your configuration, you might want to change the port number ('localhost:3307').
    - View the XAMPP control panel to see your port number.
    - To change the port number, go to the XAMPP control panel and click on 'Config' and tap 'my.ini'.
    - See 'port={localhost number}', change or switch to your current port number.
16. After all set up and done, back to the IDE, type at the terminal 'npx expo start'.
17. Scan the QR code to bundling the application.
18. You are good to go!