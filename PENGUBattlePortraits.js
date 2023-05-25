/*:
 * @author PENGU
 * @target MZ
 * @plugindesc Show battle portraits
 * @param File Param
 * @type file
 * @dir img/pictures
 * @require 1
 * @default Pick a picture
 *
 * @param Gray Param
 * @type boolean
 * @default true
 * @desc Gray portraits when HP is low
 * @help Terms of use: free to use and/or modify for any project.
 */

// Get the parameters from the plugin manager
var dafile = PluginManager.parameters("PENGUBattlePortraits")["File Param"];
var showGray = PluginManager.parameters("PENGUBattlePortraits")["Gray Param"];

function applyPortraitsAfterStart() {
  // Call the original start method

  //Scene_Message.prototype.start.call(this);
  //BattleManager.playBattleBgm();
  //BattleManager.startBattle();
  //this._statusWindow.refresh();
  //this.startFadeIn(this.fadeSpeed(), false);

  // Call the applyPortrait function
  $gameScreen.applyPortrait();
}

// Store the original start method in a variable
var originalStart = Scene_Battle.prototype.start;

// Override the start method with the new function
Scene_Battle.prototype.start = function () {
  // Call the original start method using the stored variable
  originalStart.call(this);

  // Call the new function instead of the original start method
  applyPortraitsAfterStart.call(this);
};

Game_Screen.prototype.applyPortrait = function () {
  console.log("applyPortrait");

  this.showPicture(
    1,
    $gameVariables.value(
      $dataActors[$gameParty.members()[0].actorId()].meta["id"]
    ),
    1,
    300,
    863,
    60,
    60,
    255,
    0
  );
  this.showPicture(
    2,
    $gameVariables.value(
      $dataActors[$gameParty.members()[1].actorId()].meta["id"]
    ),
    1,
    740,
    863,
    60,
    60,
    255,
    0
  );
  this.showPicture(
    3,
    $gameVariables.value(
      $dataActors[$gameParty.members()[2].actorId()].meta["id"]
    ),
    1,
    1180,
    863,
    60,
    60,
    255,
    0
  );
  this.showPicture(
    4,
    $gameVariables.value(
      $dataActors[$gameParty.members()[3].actorId()].meta["id"]
    ),
    1,
    1620,
    863,
    60,
    60,
    255,
    0
  );
  // Set the tone of the picture to the corresponding gray value for each party member
  // Tone consists of a red, green, blue and gray value
  $gameScreen._pictures[101]._tone = [
    0,
    0,
    0,
    calculateGrayStart($gameParty.members()[0].actorId()),
  ];

  $gameScreen._pictures[102]._tone = [
    0,
    0,
    0,
    calculateGrayStart($gameParty.members()[1].actorId()),
  ];
  $gameScreen._pictures[103]._tone = [
    0,
    0,
    0,
    calculateGrayStart($gameParty.members()[2].actorId()),
  ];
  $gameScreen._pictures[104]._tone = [
    0,
    0,
    0,
    calculateGrayStart($gameParty.members()[3].actorId()),
  ];
};

// Store the original apply method in a variable
var _Game_Action_apply = Game_Action.prototype.apply;

// Override the apply method with the new function
Game_Action.prototype.apply = function (target) {
  // Call the original function, pass the this object and target as arguments
  _Game_Action_apply.call(this, target);

  // Check if the gray param is true
  if (showGray == "true") {
    // Check if the target is an actor or an enemy
    if (target.hasOwnProperty("_actorId") == true) {
      $gameScreen.grayActorCalculation(target._actorId);
    } else {
      BattleManager.prototype.grayEnemyCalculation(target._enemyId);
    }
  }
};

// function to calculate the gray value for an actor at the start of battle
function calculateGrayStart(actorID) {
  // Gray is the ratio between the actors current hp and the actors max hp
  var gray =
    (1 - $gameActors.actor(actorID).hp / $gameActors.actor(actorID).mhp) * 255;
  return gray;
}

Game_Screen.prototype.grayActorCalculation = function (actorID) {
  // Check if the actorID is null or undefined before proceeding
  if (actorID != null && actorID != undefined) {
    var gray =
      (1 - $gameActors.actor(actorID).hp / $gameActors.actor(actorID).mhp) *
      255;

    // Check which actor is the target and set the corresponding picture tone
    if (actorID == $gameParty.members()[0].actorId()) {
      $gameScreen._pictures[101]._tone[3] = gray;
    } else if (actorID == $gameParty.members()[1].actorId()) {
      $gameScreen._pictures[102]._tone[3] = gray;
    } else if (actorID == $gameParty.members()[2].actorId()) {
      $gameScreen._pictures[103]._tone[3] = gray;
    } else if (actorID == $gameParty.members()[3].actorId()) {
      $gameScreen._pictures[104]._tone[3] = gray;
    } else {
      //pass
    }
  }
};

// Calculate the gray value for an enemy
BattleManager.prototype.grayEnemyCalculation = function (enemiesID) {
  for (var i = 0; i < $gameTroop._enemies.length; i++) {
    if ($gameTroop._enemies[i]._enemyId == enemiesID) {
      var troopId = i;
      break;
    }
  }

  var gray =
    (1 - $gameTroop._enemies[troopId].hp / $gameTroop._enemies[troopId].mhp) *
    255;

  var sprites = BattleManager._spriteset._enemySprites;
  // Loop through all enemy sprites and check if the enemyId matches the target
  for (const sprite of sprites) {
    if (sprite._battler._enemyId == enemiesID) {
      sprite.setColorTone([0, 0, 0, gray]);
    }
  }
};
