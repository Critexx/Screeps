var roleMiners = {

    /** @param {Creep} creep **/
    run: function(creep) {
		// miner sammeln solange, bis sie voll sind.
		// TODO: Statesystem einbauen, da sie sonst, wenn sie nur einen Teil ihres Carrys in die Extension verfrachtet haben, gleich wieder zurück minen gehn -> travel waste
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            creep.memory.state = '🔄';
        }
		// wenn der Miner volles Carry hat, sucht er sich eine Extension oder Spawn die noch Platz hat
        else {
            var extensionsOrSpawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity);
                    }
            });
			// wenn Platz vorhanden ist, geht er dorthin und tranferiert die Energy
            if(extensionsOrSpawn) {
                if(creep.transfer(extensionsOrSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extensionsOrSpawn, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
			// wenn alle Extension/Spawn voll sind, haben Controller/Towers Priorität
			else {
				var towers = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity * 0.9;
					} 
				});
				
				/*	Level	ticksToDowngrade	Math.pow(controller.level, 2) * 1000
					1		20k					1k
					2		5k					4k
					3		10k					9k
					4		20k					16k
					5		40k					25k
					6		60k					36k
					7		100k				49k
					8		150k				64k
				*/
				
				// wenn der Controller keine regelmässigen Upgrade bekommt, wird der Container für den Controller gefüllt
				var controller = creep.room.controller;
				if(towers.length > 0 && (controller.ticksToDowngrade > Math.pow(controller.level, 2) * 1000)) {
					towers.sort((a,b) => a.hits - b.hits);
					if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffffff'}});
					}
				}
				else {
					var container = creep.room.find(FIND_STRUCTURES, {
						filter: (structure) => {
							return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
						}
					});
					// wenn ein freier Container zur Verfügung steht, transferiert er die Energy in den Container
					// TODO: Danach macht er nichts und steht nur rum. Allenfalls blockiert er dadurch andere creeps -> deshalb später einen "Waiting Spot" via Flag definieren
					if(container.length > 0) {
						if(creep.transfer(container[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(container[0], {visualizePathStyle: {stroke: '#ffffff'}});
						}
					}
				}
			}
        }
	}
};

module.exports = roleMiners;