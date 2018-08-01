var memoryCleaner = require('memoryCleaner');
var roleMiner = require('role.miner');
var roleSecondMiner = require('role.secondMiner');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');



module.exports.loop = function () {

    memoryCleaner.run();
	
    var tower = Game.getObjectById('597fd7229ee1516cdabd4654');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType != STRUCTURE_CONTAINER && structure.hits <= structure.hitsMax-800) || (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax/4)
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
	
    // Info Spam Anzahl creeps
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
	var secondMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'secondMiner');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    console.log('miners: ' + miners.length);
    console.log('builders: ' + builders.length);
    console.log('upgraders: ' + upgraders.length);
    
    // Create Creeps
    // Priorität: 1. Miner, 2. secondMiners, 3. Builder, 4. Upgrader
    var energyNeeded = 800 - Game.spawns['Crit1'].room.energyAvailable;
    if(miners.length < 3) {
        if(energyNeeded <= 0) {
            var newMinerName = Game.spawns['Crit1'].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], 'miner' + ++Memory.lastMiner, {role: 'miner', level: 1, state: '💤' });
            console.log('Spawning new miner: ' + newMinerName);
        }
        else {
            console.log('Saving ' + energyNeeded + ' Energy for new miner')
        }
    }
	else {
		if(secondMiners.length < 2) {
			if(energyNeeded <= 0) {
				var newSecondMinerName = Game.spawns['Crit1'].createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], 'secondMiner' + ++Memory.lastSecondMiner, {role: 'secondMiner', level: 1, state: '💤' });
				console.log('Spawning new secondMiner: ' + newSecondMinerName);
			}
			else {
				console.log('Saving ' + energyNeeded + ' Energy for new secondMiner')
			}
		}
		else{
			if(upgraders.length < 5) {
				if(energyNeeded <= 0) {
					var newNameUpgrader = Game.spawns['Crit1'].createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'upgrader' + ++Memory.lastupgrader, {role: 'upgrader', level: 1, state: '💤' });
					console.log('Spawning new upgrader: ' + newNameUpgrader);
				}
				else {
					console.log('Saving ' + energyNeeded + ' Energy for new upgrader')
				}
			}
			else{
				if(repairers.length < 0) {
					if(energyNeeded <= 0) {
						var newNameRepairer = Game.spawns['Crit1'].createCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], 'repairer', {role: 'repairer', level: 1, state: '💤' });
						console.log('Spawning new repairer: ' + newNameRepairer);
					}
					else {
						console.log('Saving ' + energyNeeded + ' Energy for new repairer')
					}
				}
				else{
					var energyNeededBuilder = 800 - Game.spawns['Crit1'].room.energyAvailable;
					if(builders.length < 4) {
						if(energyNeeded <= 0) {// 2. phase [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
							var newNameBuilder = Game.spawns['Crit1'].createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'builder' + ++Memory.lastbuilder, {role: 'builder', level: 1, state: '💤' });
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
    
    // creep Funktionen Übergabe
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
		if(creep.memory.role == 'secondMiner') {
            roleSecondMiner.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepair.run(creep);
        }
       
        // Sprechblase der Creeps
       // creep.say(creep.memory.state + ' ' + creep.carry.energy + '/' + creep.carryCapacity);
    }
}