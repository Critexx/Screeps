/*
 *  memory cleaning
 */ 
 
// löscht alle nicht existierende Creeps
function CleanOldCreeps(){
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}
 
module.exports = {
    run: function(){
        CleanOldCreeps();
    }
};