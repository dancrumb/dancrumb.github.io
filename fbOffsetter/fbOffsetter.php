<?php 

require_once('/home/rumney/php/iCalcreator.class.php');

$uid     = $_REQUEST['uid'];
$key     = $_REQUEST['key'];
$tz      = $_REQUEST['tz']?$_REQUEST['tz']:"UTC";
$newName = $_REQUEST['name']?$_REQUEST['name']:"Modified FB Events";

/*


*/

//$timezones = DateTimeZone::listIdentifiers();
//print_r($timezones);

$v = new vcalendar();

$v->setConfig('unique_id','danrumney.co.uk');
$v->setProperty('method','PUBLISH');
$v->setConfig( "nl", "" );
$v->setConfig('url',"http://www.facebook.com/ical/u.php?uid=$uid&key=$key");

$v->parse();

while( $vevent = $v->getComponent( 'vevent' ))
{
	if( $description = $vevent->getProperty( 'description'))
	{
		$vevent->setProperty('description', str_replace("\n", " ", $description));
	}
}

$v->setProperty('X-WR-TIMEZONE',$tz);
$v->setProperty('X-WR-CALNAME',$newName);
$v->setConfig( "nl", "\n" );
$v->returnCalendar();
?>