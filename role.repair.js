var roleRepair = {

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
	   
        if(creep.memory.state == '🔧') {
            
            /* 	Beschädigungs-Finder für kritische Strukturen:
				Filter über hitsMax/4 deckt auch Strukturen ab, die keine hits besitzen und berücksichtigt
				Roads über Swamp oder Container, die deutlich mehr hits pro Decay verlieren (5000 hits/decay)!!!
			*/
            var repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax/4
			});
			
			if(!repairTarget) {
			    repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
    			});
			}
			// Für den Turm Repairer mit Sort-Function -> Lowste Structure zuerst
			/*var repairTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < 1500;
                } 
            });
			repairTargets.sort((a,b) => a.hits - b.hits)
	        */

            if (repairTarget){
                if(creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
		// ansonsten geht er Ressource holen (Prio 1 = vom Container, Prio 2 = von Source)
        else {
			// holt die resource vom container, wenn mindestens 25 Energy drin ist
            var container = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                     return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 25;
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

module.exports = roleRepair;