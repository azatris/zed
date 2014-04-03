﻿ #pragma strict
import System.Collections.Generic;

var _transform : Transform;
var trailRenderer : TrailRenderer;
var spriteRenderer : SpriteRenderer;
var bulletProperties : BulletProperties;
private var speed : float;
private var lastDeltaTime : float;
private var finalPosition : Vector3;
private var moving : boolean;


function Start () {
	moving = true;
}

function Update () {
	
	// bullet always moves distance predicted in last frame
	if (moving) {
		move();		
		checkCollision();
		checkBoundaries();
	} else {
		_transform.position = finalPosition;
		spriteRenderer.enabled = false;
		TimedObjectDestructor.destroyGameObjectInSeconds(gameObject,
				trailRenderer.time);			
	}
}

function setSpeed(speed : float) {
	this.speed = speed;
}

private function move() {
	_transform.position += lastDeltaTime*speed*_transform.right;
	lastDeltaTime = Time.deltaTime;
}


/*
 * Casts a ray to predict if bullet will collide with any Collider
 * between now and the next frame. If there is a collider, 
 * it gets all colliders that are in line of movement 
 */
private function checkCollision() {
	var rayCastStart : Vector2 = new Vector2(_transform.position.x, _transform.position.y);
	var rayCastDirection : Vector2 = new Vector2(_transform.right.x, _transform.right.y);
	var rayCastLength : float = Time.deltaTime*speed;

	var raycastHit2D : RaycastHit2D[] = Physics2D.RaycastAll(
			rayCastStart,  
			rayCastDirection, 
			rayCastLength);
			
	if (raycastHit2D.Length != 0) {							
		// again raycast (this time infinitely long), to get all objects
		// in line of fire
		raycastHit2D = Physics2D.RaycastAll(
			rayCastStart,  
			rayCastDirection, 
			Mathf.Infinity);
		
		if (raycastHit2D.Length == 0) {
			Debug.Log("error in BulletMovement.js: second raycast empty!");
			return;
		}
		var firstHitObject = raycastHit2D[0].collider.transform.root.gameObject;
		
		if (firstHitObject.CompareTag("zombie")) {
			evaluateZombieCollision(raycastHit2D, firstHitObject);
			
			// bullet to be destroyed
			finalPosition = _transform.position + raycastHit2D[0].fraction*lastDeltaTime*speed*transform.right;				
			moving = false;
		}										
	}	
}


function evaluateZombieCollision(raycastHit2D : RaycastHit2D[], firstHitObject : GameObject) {	
	var hitChildren : List.<GameObject> = new List.<GameObject>();

	for (var i : int = 0; i < raycastHit2D.Length; i++) {
		if (raycastHit2D[i].collider.transform.root.gameObject == firstHitObject) {
			hitChildren.Add(raycastHit2D[i].collider.gameObject);
		}
	}
	
	var zombieImpact : ZombieImpact = firstHitObject.transform.root.gameObject.GetComponent(ZombieImpact);
	if (zombieImpact != null) {
		zombieImpact.impact(bulletProperties.getPower(), 
				new Vector2(speed*_transform.up.x, speed*_transform.up.y), 
				hitChildren);
	} else {
		Debug.Log("Hit Object does not have ZombieResources component!");
	}
}


private function checkBoundaries() {
	var pos : Vector3 = _transform.position;
	
	if ((pos.x < EnvironmentAttributes.mapBounds.min.x) 
			|| (pos.x > EnvironmentAttributes.mapBounds.max.x) 
 			|| (pos.y < EnvironmentAttributes.mapBounds.min.y) 
 			|| (pos.y > EnvironmentAttributes.mapBounds.max.y)) {
		
		TimedObjectDestructor.destroyGameObjectInSeconds(gameObject,
				trailRenderer.time);
	}
}