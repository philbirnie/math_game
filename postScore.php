<?php

/*
|--------------------------------------------------------------------------
| Post Score
|--------------------------------------------------------------------------
|
|
*/

global $scoresDb;

$score = (int) $_POST['score'];

if($score && is_numeric($score)) {
	try {
		$scoresDb = new PDO('sqlite:scores.db');
		$scoresDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		// Create table messages
		$scoresDb->exec("CREATE TABLE IF NOT EXISTS scores (
                    id INTEGER PRIMARY KEY,
                    score INT,
                    initials TEXT,
                    time INTEGER)");
		addScore($score);
		$scoresDb = null;
	} catch (Exception $e) {
		die("Could not add score to db" . $e->getMessage());
	}
}



function addScore($score) {
	global $scoresDb;

	if($scoresDb) {
		$insert = "INSERT INTO scores (score, time) VALUES(:score, :time)";

		$stmt = $scoresDb->prepare($insert);

		$stmt->bindParam(':score', $score);
		$stmt->bindParam(':time', time());
		$stmt->execute();
	}
}
