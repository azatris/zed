﻿#pragma strict

var zed : GameObject;
var factor : float = 1.25;
var skillPointCost : int = 1;

function Start () {
setPerk();
}

function setPerk () {

// If zed already has this perk, don't do anything and return a false to
// indicate that zed already has the perk. If not, add the perk and set
// its effect on zed.

if(gameObject == GameObject.Find("zed")) {
	var zedMovement : ZedMovement = GameObject.Find("zed").GetComponent("ZedMovement") as ZedMovement;
	zedMovement.maxSpeed *= factor;
	}
}