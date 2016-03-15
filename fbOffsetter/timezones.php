<?php
$timezone_identifiers = DateTimeZone::listIdentifiers();
foreach($timezone_identifiers as $tz)
{
    echo "<option value=\"$tz\">$tz</option>\n";
}
?>
