/*
 * Creep Factory
 */
var maxCountMiner = 3;
var maxCountUpgrader = 3;
var maxCountBuilder = 2;
var maxCountRepairer = 1;

var creep = {
    name: null,
    role: null,
    body: []
};

var RoleEnum = {"miner": "miner", "upgrader": "upgrader", "builder": "builder", "repairer": "repairer"};
Object.freeze(RoleEnum);

function GetCreepPrio(){
    if(Memory.countMinerAlive < maxCountMiner)
    {
        Memory.nextCreepRole = RoleEnum.miner;
        return RoleEnum.miner;
    };
        
    if(Memory.countBuilder < maxCountBuilder){
        Memory.nextCreepRole = RoleEnum.builder;
        return RoleEnum.builder;
    }
        
    if(Memory.countRepairer < maxCountRepairer){
        Memory.nextCreepRole = RoleEnum.repairer;
        return RoleEnum.repairer;
    }
           
    if(Memory.countUpgrader < maxCountUpgrader)
    {
        Memory.nextCreepRole = RoleEnum.upgrader;
        return RoleEnum.Upgrader;
    }
    Memory.nextCreepRole = "nothing";
    return null; 
}


function CreateMiner(){
    Game.spawns['Crit1'].spawnCreep(_GetBody(), GetCreepName(), {
        memory: GetCreepMemory()
    });
}

/**
 * Returns creep name depending on his role
 * 
 * @private
 * @returns {String} creep name
 */
function _GetCreepName(){
    // Rollenbuchstabe wählen und durchloopen wievielte Nummer
    return 'M' + ++Memory.lastMiner;
}

/**
 * Returns body parts depending on the available energy
 *
 * @private
 * @returns {String[]} e.g. [WORK, CARRY, MOVE]
 */
function _GetBody(){
    var maxEnergyAvailable = Game.spawns['Crit1'].room.energyCapacityAvailable;
    if(maxEnergyAvailable >= 550){
        return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    }
    if(maxEnergyAvailable >= 400){
        return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }
    if(maxEnergyAvailable >= 300){
        return [WORK, CARRY, MOVE];
    } 
}

// memory object zurückgeben
function GetCreepMemory(){
    return {role: 'miner', level: 1, state: '💤' };
}

function CreateCreeps(){
    creep.role = GetCreepPrio();
    if(creep.role == null){
        // abbrechen
    }
    console.log(creepRole);
    
    var energyNeeded = 200 - Memory.energyAvailable;
    if(Memory.countMinerAlive < maxCountMiner) {
        if(energyNeeded <= 0) {
            var newMinerName = Game.spawns['Crit1'].spawnCreep([WORK, CARRY, MOVE], 'M' + ++Memory.lastMiner, {
                memory: {role: 'miner', level: 1, state: '💤'}
            });
            console.log('Spawning new miner: ' + newMinerName);
        }
        else {
            console.log('Saving ' + energyNeeded + ' Energy for new miner')
        }
    }
    else{ if(Memory.countUpgraderAlive < maxCountUpgrader) {
			if(energyNeeded <= 0) {
				var newNameUpgrader = Game.spawns['Crit1'].spawnCreep([WORK, CARRY, MOVE], 'U' + ++Memory.lastupgrader, {
				    memory: {role: 'upgrader', level: 1, state: 'ðŸ’¤'}
				});
				console.log('Spawning new upgrader: ' + newNameUpgrader);
			}
			else {
				console.log('Saving ' + energyNeeded + ' Energy for new upgrader')
			}
		}
		else{
			if(Memory.countRepairerAlive < maxCountRepairer) {
				if(energyNeeded <= 0) {
					var newNameRepairer = Game.spawns['Crit1'].spawnCreep([WORK, CARRY, MOVE], 'R', {
					    memory: {role: 'repairer', level: 1, state: 'ðŸ’¤'}
					});
					console.log('Spawning new repairer: ' + newNameRepairer);
				}
				else {
					console.log('Saving ' + energyNeeded + ' Energy for new repairer')
				}
			}
    		else{
    			var energyNeededBuilder = 200 - Memory.energyAvailable;
    			if(Memory.countBuilderAlive < maxCountBuilder) {
    				if(energyNeeded <= 0) {
    					var newNameBuilder = Game.spawns['Crit1'].spawnCreep([WORK, CARRY, MOVE], 'B' + ++Memory.lastbuilder, {
    					    memory: {role: 'builder', level: 1, state: 'ðŸ’¤'}
    					});
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

