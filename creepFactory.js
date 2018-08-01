/*
 * Creep Factory
 */
var countMiner = 3;
var countUpgrader = 3;
var countBuilder = 2;
var countRepairer = 1;

function CreateCreeps(){
    var energyNeeded = 200 - Memory.energyAvailable;
    if(Memory.countMiner < countMiner) {
        if(energyNeeded <= 0) {
            var newMinerName = Game.spawns['Crit1'].createCreep([WORK, CARRY, MOVE], 'M' + ++Memory.lastMiner, {role: 'miner', level: 1, state: '💤' });
            console.log('Spawning new miner: ' + newMinerName);
        }
        else {
            console.log('Saving ' + energyNeeded + ' Energy for new miner')
        }
    }
    else{ if(Memory.countUpgrader < countUpgrader) {
			if(energyNeeded <= 0) {
				var newNameUpgrader = Game.spawns['Crit1'].createCreep([WORK, CARRY, MOVE], 'U' + ++Memory.lastupgrader, {role: 'upgrader', level: 1, state: 'ðŸ’¤' });
				console.log('Spawning new upgrader: ' + newNameUpgrader);
			}
			else {
				console.log('Saving ' + energyNeeded + ' Energy for new upgrader')
			}
		}
		else{
			if(Memory.countRepairer < countRepairer) {
				if(energyNeeded <= 0) {
					var newNameRepairer = Game.spawns['Crit1'].createCreep([WORK, CARRY, MOVE], 'R', {role: 'repairer', level: 1, state: 'ðŸ’¤' });
					console.log('Spawning new repairer: ' + newNameRepairer);
				}
				else {
					console.log('Saving ' + energyNeeded + ' Energy for new repairer')
				}
			}
    		else{
    			var energyNeededBuilder = 200 - Memory.energyAvailable;
    			if(Memory.countBuilder < countBuilder) {
    				if(energyNeeded <= 0) {
    					var newNameBuilder = Game.spawns['Crit1'].createCreep([WORK, CARRY, MOVE], 'B' + ++Memory.lastbuilder, {role: 'builder', level: 1, state: 'ðŸ’¤' });
    					console.log('Spawning new builder: ' + energyNeededBuilder);
    				}
    				else {
    					console.log('Saving ' + energyNeeded + ' Energy for new builder')
    				}
    			}
    		}
        }
    }
}

module.exports = {
    run:  function(){
        CreateCreeps();
    }
};

