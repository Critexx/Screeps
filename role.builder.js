var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Wenn kein gültiger State oder keine keine Energy vorhanden ist, bekommt er ein Mining State
	    if((!creep.memory.state in ['🔄', '🚧', '🔧']) || creep.carry.energy == 0) {
            creep.memory.state = '🔄';
	    }
	    
	    // Wenn er ein Mining State hat, geht er Energy minen
	    if(creep.memory.state == '🔄') {
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
                    if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
			
			
			// WICHTIG: in frühe Phase muss das drin sein, später aber nicht mehr
			/*
	    var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }*/
	    }
            
        // Wenn er volle Energy hat, bekommt er ein Building State
	    if(!(creep.memory.state == '🚧') && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.state = '🚧';
	    }

        // Wenn er ein Building State hat, checkt er ab ob ein Gebäude gebaut werden muss. Wenn nicht, dann geht er den Spawn upgraden
	    if(creep.memory.state == '🚧' || creep.memory.state == '🔧') {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                creep.memory.state = '🚧';
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                // Wenn er nichts zu bauen hat, dann bekommt er ein Upgrade State und geht den Spawn upgraden
                creep.memory.state = '🔧';
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	}
};

module.exports = roleBuilder;