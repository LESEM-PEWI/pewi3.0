//global
//base sandbox level = 0

//gameDirector monitors achievements in the PEWI levels/exercises
// this function is called to be updated every 20 animation frames
function gameDirector() {

    if(levelGlobal){

        //aggregate tile results

        if(levelGlobal!=0){
          calculateResults();
        }

        //sandbox features
        if(levelGlobal == 0){
            //nothing currently
        }

        //all features
        contaminatedRiver();
        objectiveCheck();
    }//end if for a defined levelGlobal
}//end gameDirector()
