var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.memory.state = '🔄';
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.memory.state = '🔧';
	    }

		// bei einem upgrading state, geht der creep den Controller upgraden
	    if(creep.memory.state == '🔧') {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
		// ansonsten geht er Ressource holen (Prio 1 = vom Container, Prio 2 = von Source)
        else {

            // holt die resource vom container, wenn mindestens 25 Energy drin ist
            var container = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                     return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= creep.carryCapacity/2;
                }
            });

            if(container.length > 0) {
                if(creep.withdraw(container[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container[0], {visualizePathStyle: {stroke: '#ffaa00'}})}
            } else{
                if(creep.carry.energy < creep.carryCapacity) {
                    var sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        }
	}
};

module.exports = roleUpgrader;