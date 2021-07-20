<?php

$ZNS_IP = "192.168.0.17";	// Adresse IP de l'automate

function AddLog($txt)
{
	$f = fopen('php_log.txt','a+');
	fputs($f,$txt . "\r\n");
	fclose($f); 
}

function _curl_get( $url )
{
//	AddLog( "request : ". $url );
	$curl = curl_init(); 
	curl_setopt($curl, CURLOPT_URL, $url); 
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); 
	
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); 
	curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type: application/json","Accept:application/json")); 	
	
	$page = curl_exec($curl);
//	AddLog( "curl Returning : ".$page  );
	curl_close($curl); 
	return $page;
}
$command = "";
$firstRun = true; 
	header('Content-Type: text/xml');
	$count = count($_GET);
	foreach($_GET as $key=>$val) 
	{
//		AddLog( "get : ".$key ."=".$val ); 
		if( !$firstRun )
		{
			$command.= "&";
		}
		$command.= $key ."=".$val;
		$firstRun = false;
	}
	
	
	
	echo _curl_get( $ZNS_IP."/zns.cgi?" . $command );

?>