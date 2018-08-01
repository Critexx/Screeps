var settings = require('settings');
var memoryCleaner = require('memoryCleaner');
var roleMiner = require('role.miner');
var roleSecondMiner = require('role.secondMiner');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var creepFactory = require('creepFactory');



module.exports.loop = function () {

    
    memoryCleaner.run();
    // Anzahl Creeps in Memory ablegen
    Memory.countMiner = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').length;
	Memory.countSecondMiner = _.filter(Game.creeps, (creep) => creep.memory.role == 'secondMiner').length;
    Memory.countBuilder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
    Memory.countUpgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
	Memory.countRepairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length;
	
	// Wieviel Energy im Room verfügbar ist
	Memory.energyAvailable = Game.spawns['Crit1'].room.energyAvailable;
	// Maximale Energy die im Room möglich ist
	Memory.energyCapacity = Game.spawns['Crit1'].room.energyCapacityAvailable;

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
    
    // Create Creeps
    // Priorität: 1. Miner, 2. secondMiners, 3. Builder, 4. Upgrader
    creepFactory.run();
    
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