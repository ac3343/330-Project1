<?php
	// 1) The URL to the web service
	$URL = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=hate-crime-per-state&q=&facet=basename&facet=year&facet=bias_motivation";

	$year = $_GET["year"]; 

	$URL .= "&refine.year=";
	$URL .= $year;

	// 3) The name of the parameter shoutify expects is "INPUT"
	$params = ["INPUT" => $year];

	// 4) Convert it to JSON, because Shoutify wants data passed to it as JSON
	$jsonToSend = json_encode($params);

	// 5) The `stream_context_create()` function is where we can specify the POST method
	// https://www.php.net/manual/en/context.http.php

	$opts = array('http' =>
			array(
					'method'  => 'POST',
					'header'  => 'Content-Type: application/json',
					'content' => $jsonToSend
			)
	);
	$context = stream_context_create($opts);


	// 6) Call the web service
	$result = file_get_contents($URL);

	// 7) Echo results 
	header('content-type:application/json'); // tell the requestor that this is JSON
	header("Access-Control-Allow-Origin: *"); // turn on CORS for that shout-client.html can use this service
	echo $result;
?>