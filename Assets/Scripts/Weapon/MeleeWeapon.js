﻿#pragma strict

class MeleeWeapon extends Weapon {
	private var weaponAnimator : Animator;
	var reach : int;
	var power : int;
	
	
	private var strikeTime : float;
	
	private var swordLengthData : float[]; // 3xn array: 
									 // first column: time
									 // second column: angle
									 // third column: length

	function MeleeWeapon(reach : int, 
			power : int,
			id : String,
			zed : GameObject) {

		this.reach = reach;
		this.power = power;
		this.id = id;
		this.zed = zed;				
	}

	// @Override
	function strike() : boolean {
		Debug.Log("melee Strike");
		strikeTime = Time.time;
		return true;
	}

	// @Override
	function secondaryStrike() {
		//Debug.Log("attack with melee weapon. power = " + power);

	}

	// @Override
	function getClipSize() : int {
		return 0; // 0 is melee
	}
	
	function initSwordLengthData(data : float[]) {
		swordLengthData = data;
	}
	
	function executeStrike() {
		
	} 
}