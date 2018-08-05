/*
 * Creep Factory
 */
var maxCountMiner = 3;
var maxCountUpgrader = 3;
var maxCountBuilder = 2;
var maxCountRepairer = 1;

var creep = {
    name: null,
    body: [],
    memory: {role: null, prefix: null, index: null, level: null, room: 1, state: '💤' }
};

var RoleEnum = {"miner": "miner", "upgrader": "upgrader", "builder": "builder", "repairer": "repairer"};
Object.freeze(RoleEnum);

/**
 * Sets creep role and returns if a creep is needed
 *
 * @returns {boolean} returns true if a creep is needed and false if not
 */
function _SetCreepRole(){
    if(Memory.countMinerAlive < maxCountMiner)
    {
        Memory.nextCreepRole = RoleEnum.miner;
        creep.memory.role = RoleEnum.miner
        return true;
    };
        
    if(Memory.countBuilder < maxCountBuilder){
        Memory.nextCreepRole = RoleEnum.builder;
        creep.memory.role = RoleEnum.builder
        return true;
    }
        
    if(Memory.countRepairer < maxCountRepairer){
        Memory.nextCreepRole = RoleEnum.repairer;
        creep.memory.role = RoleEnum.repairer
        return true;
    }
           
    if(Memory.countUpgrader < maxCountUpgrader)
    {
        Memory.nextCreepRole = RoleEnum.upgrader;
        creep.memory.role = RoleEnum.upgrader
        return true;
    }
    Memory.nextCreepRole = "nothing";
    return false; 
}

/**
 * Sets creep name, memory.prefix and memory.index depending on his role
 * 
 * @private
 */
function _SetCreepName(){
    if(creep.memory.role){
        creep.memory.prefix = creep.memory.role.charAt(0).toUpperCase();
    }else{
        creep.memory.prefix = "unknown";
    }
    
    switch(creep.memory.role){
        case RoleEnum.miner: creep.memory.index = ++Memory.lastMiner;
        case RoleEnum.upgrader: creep.memory.index = ++Memory.lastupgrader;
        case RoleEnum.builder: creep.memory.index = ++Memory.lastbuilder;
        case RoleEnum.repairer: creep.memory.index = ++Memory.lastRepairer;  
    }
    creep.name = creep.memory.prefix + creep.memory.index;
    // loopen durch alle creep liste
    // for(var index in Memory.creeps) {
    //     if(!Game.creeps[name]) {
    //         delete Memory.creeps[name];
    //     }
    // }

}

/**
 * Sets body parts depending on the available energy
 *
 * @private
 * @returns {int} how much energy needed
 */
function _SetCreepBody(){
    var maxEnergyAvailable = Game.spawns['Crit1'].room.energyCapacityAvailable;
    if(maxEnergyAvailable >= 550){
        creep.body = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
        creep.memory.level = 3;
        return 550 - Game.spawns['Crit1'].room.energyAvailable;
    }
    if(maxEnergyAvailable >= 400){
        creep.body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        creep.memory.level = 2;
        return 400 - Game.spawns['Crit1'].room.energyAvailable;
    }
    if(maxEnergyAvailable >= 300){
        creep.body = [WORK, CARRY, MOVE];
        creep.memory.level = 1;
        return 300 - Game.spawns['Crit1'].room.energyAvailable;
    } 
}

/**
 * Main function for creating a creep
 *
 */
function CreateCreeps(){
    // wenn kein creep benötigt wird, wird die function abgebrochen
    if(_SetCreepRole() == false){
        console.log('No creeps needed');
        return;
    }
    var energyNeeded = _SetCreepBody();
    if(energyNeeded > 0){
        console.log(`Saving ${energyNeeded} Energy for a new Level ${creep.memory.level} ${creep.memory.role}`);
        return;
    }
    _SetCreepName();
    Game.spawns['Crit1'].spawnCreep(creep.body, creep.name, {
        memory: creep.memory
    });
    console.log(`Spawning creep ${creep.name} (Level: ${creep.memory.level}, Role: ${creep.memory.role})`)

    // var energyNeeded = 200 - Memory.energyAvailable;
    // if(Memory.countMinerAlive < maxCountMiner) {
    //     if(energyNeeded <= 0) {
    //         var newMinerName = Game.spawns['Crit1'].spawnCreep([WORK, CARRY, MOVE], 'M' + ++Memory.lastMiner, {
    //             memory: {role: 'miner', level: 1, state: '💤'}
    //         });
    //         console.log('Spawning new miner: ' + newMinerName);
    //     }
    //     else {
    //         console.log('Saving ' + energyNeeded + ' Energy for new miner')
    //     }
    // }
    // else{ if(Memory.countUpgraderAlive < maxCountUpgrader) {
	// 		if(energyNeeded <= 0) {
	// 			var newNameUpgrader = Game.spawns['Crit1'].spawnCreep([WORK, CARRY, MOVE], 'U' + ++Memory.lastupgrader, {
	// 			    memory: {role: 'upgrader', level: 1, state: 'ðŸ’¤'}
	// 			});
	// 			console.log('Spawning new upgrader: ' + newNameUpgrader);
	// 		}
	// 		else {
	// 			console.log('Saving ' + energyNeeded + ' Energy for new upgrader')
	// 		}
	// 	}
	// 	else{
	// 		if(Memory.countRepairerAlive < maxCountRepairer) {
	// 			if(energyNeeded <= 0) {
	// 				var newNameRepairer = Game.spawns['Crit1'].spawnCreep([WORK, CARRY, MOVE], 'R', {
	// 				    memory: {role: 'repairer', level: 1, state: 'ðŸ’¤'}
	// 				});
	// 				console.log('Spawning new repairer: ' + newNameRepairer);
	// 			}
	// 			else {
	// 				console.log('Saving ' + energyNeeded + ' Energy for new repairer')
	// 			}
	// 		}
    // 		else{
    // 			var energyNeededBuilder = 200 - Memory.energyAvailable;
    // 			if(Memory.countBuilderAlive < maxCountBuilder) {
    // 				if(energyNeeded <= 0) {
    // 					var newNameBuilder = Game.spawns['Crit1'].spawnCreep([WORK, CARRY, MOVE], 'B' + ++Memory.lastbuilder, {
    // 					    memory: {role: 'builder', level: 1, state: 'ðŸ’¤'}
    // 					});
    // 					console.log('Spawning new builder: ' + energyNeededBuilder);
    // 				}
    // 				else {
    // 					console.log('Saving ' + energyNeeded + ' Energy for new builder')
    // 				}
    // 			}
    // 		}
    //     }
    // }
}

module.exports = {
    run:  function(){
        CreateCreeps();
    }
};

