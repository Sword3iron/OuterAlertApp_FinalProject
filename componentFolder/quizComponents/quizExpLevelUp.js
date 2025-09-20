import { useState } from 'react';

/***************************************************************/
////***************QUIZ EXPEREINCE LEVEL UP*******************///
/***************************************************************/
//function to update the expereince for player after took part in quiz
//use the parameter of userId, initialXp, and InitialLevel
function XPUpdateSystem(userId, InitialXP, initialLevel){
    //set constant valuable
    const [xp, setXP] = useState(InitialXP); //set expereince state
    const [level, setLevel] = useState(initialLevel); //set user's level state

    //function to add expereince to the user
    const addXP = async (earnedXP) => {
        try{
            //Calling API on php file
            const res = await fetch("http://192.168.1.116/outeralert/updateUserXP.php", {
                method: "POST", //get post method
                headers: { "Content-Type" : "application/json"}, //sending JSON data
                body: JSON.stringify({userId, earnedXP}), //stringify the data
            }); 

            const data =await res.json(); //parse on JSON response
            if (data.success){ //if the data parse success
                //update local state
                setXP(data.xp); //user expereince
                setLevel(data.level); //user level
            }else{
                //display console error message
                console.error("XP update failed: ", data.message);
            }
            //catch an exception to display console error
        }catch(error){
            console.error("Error updating XP: ", error);
        }
    };
    //return the state of experience data 
    return {xp, level, addXP};
}

export default XPUpdateSystem;