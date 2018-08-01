// memory cleaning
module.exports = {
    
        // löscht alle nicht existierende Creeps
        run: function(){
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    }

};