var roleSecondMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
		
		// miner sammeln solange, bis sie voll sind.
		// TODO: Statesystem einbauen, da sie sonst, wenn sie nur einen Teil ihres Carrys in die Extension verfrachtet haben, gleich wieder zurück minen gehn -> travel waste
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            creep.memory.state = '🔄';
        }
		// wenn ein freier Container zur Verfügung steht, transferiert er die Energy in den Container
        else {
			var container = Game.getObjectById('59810f729eb096781376b486');
			// wenn ein freier Container zur Verfügung steht, transferiert er die Energy in den Container
			// TODO: Danach macht er nichts und steht nur rum. Allenfalls blockiert er dadurch andere creeps -> deshalb später einen "Waiting Spot" via Flag definieren
			if(container) {
				if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
        }
	}
};

module.exports = roleSecondMiner;