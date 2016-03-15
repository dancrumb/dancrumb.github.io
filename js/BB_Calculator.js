/*
 * Code for enhanced BB Calculation Form
 */
$(function()
	{
		console.log("Doc Ready");
		$("form#CalculationForm").submit(function()
			{
				console.log("Submitting..");
				//validateData();
				calculateBB();
				return false;
			}
		);
		
		$("select#LinkTypes").change(function()
			{
				updateLinkSpeed();
				updateProcessTime();
			}
		);
		
		$("input#DataField").change(function()
			{
				updateFrameSize();
				updateProcessTime();
			}
		);
		
		$("select#LengthUnit").change(updateRTT);
		$("input#LinkLength").change(function()
			{
				updateRTT();
				updateProcessTime();
			}
			
		);
	
		$("input#LinkSpeed").change(updateProcessTime);
		$("input#FrameSize").change(updateProcessTime);
		$("select#SpeedUnit").change(updateProcessTime);
		
		
		$("input#LinkSpeed").attr("disabled","disabled");
		$("select#SpeedUnit").attr("disabled","disabled");
		
		$("div#link").show();
		
		updateRTT();
		updateLinkSpeed();
		updateProcessTime();
		
		
	}
);

function validateData()
{
	console.log(validateData);
}

function calculateBB()
{
	console.log(calculateBB);

	
	var rtt = parseFloat($("input#RoundTripTime").attr("value"));
	var rxp = parseFloat($("input#RxPrtProcessTime").attr("value"));
	var txp = parseFloat($("input#TxPrtProcessTime").attr("value"));
	
	var bb = (rtt+rxp)/txp;
	
	console.log("RTT: %d, RxP: %d, TxP: %d => BB: %d",rtt,rxp,txp,bb);
	
	$("div#BB_Result").text("Optimal BB Credit: "+bb);
}


function updateLinkSpeed()
{
	var ocTypes = {
					"oc1":51.84,
					"oc3":155.52,
					"oc3c":139.264,
					"oc12":622.08,
					"oc24":1244.16,
					"oc48":2488.32,
					"oc96":4976.64,
					"oc192":9953.28,
					"oc768":39813.12
					};
	var newType = $("select#LinkTypes").attr("value");
	
	if(newType != "custom")
	{
		$("input#LinkSpeed").attr("disabled","disabled");
		$("select#SpeedUnit").attr("disabled","disabled");
		$("input#LinkSpeed").attr("value",ocTypes[newType]);
		$("select#SpeedUnit").attr("value","mbps");
	}
	else
	{
		$("input#LinkSpeed").attr("disabled","");
		$("select#SpeedUnit").attr("disabled","");
	}
	
}

function updateRTT()
{
	var multipliers = {
						"km":1,
						"mi":1.609344
					   };
	var linkLengthValue = $("input#LinkLength").attr("value");
	var linkMultiplier = $("select#LengthUnit").attr("value");
	
	console.log(linkLengthValue);
	console.log(linkMultiplier)
	
	
	var distance = parseFloat(linkLengthValue) * multipliers[linkMultiplier];
	
	var rtt = distance * 10;
	
	$("input#RoundTripTime").attr("value",rtt);

}

function updateProcessTime()
{
	console.log("updateProcessTime");
	var multipliers = {
						"mbps": 131072,
						"gbps": 134217728,
						"mbs":	1048576,
						"gbs":	1073741824
					};
	var frameSize = $("input#FrameSize").attr("value");
	var txRate = parseFloat($("input#LinkSpeed").attr("value"));
	var txUnit = $("select#SpeedUnit").attr("value");
	
	var bytesPerSecond = txRate * multipliers[txUnit];
	
	$("input#RxPrtProcessTime").attr("value",(frameSize*1000*1000/bytesPerSecond));
	$("input#TxPrtProcessTime").attr("value",(frameSize*1000*1000/bytesPerSecond));
}

function updateFrameSize()
{
	var dataField = parseFloat($("input#DataField").attr("value"));
	dataField = Math.round(dataField/4) * 4;
	
	$("input#FrameSize").attr("value",dataField+36);
}