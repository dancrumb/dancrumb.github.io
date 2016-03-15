/*
 * Foot-Inch Calculator
 * 
 * I'll be using the acronym FIS to stand for "Feet, Inches, Sixteenths"
 * 'Decimal' means decimal inches
 */
 
Element.addMethods({
  /**
   *  Element#getTextContent(@element) -> String
   *  Cross-browser means of getting Element#textContent or Element#innerText
   **/
  getTextContent: function(element) {
    if (!Object.isUndefined(element.textContent)) {
      return element.textContent;
    }
    return element.innerText;
  }
});


Event.observe(window,'dom:loaded',function()
{

	var buttonMappings = {
		"button_1" : 1,
		"button_2" : 2,
		"button_3" : 3,
		"button_4" : 4,
		"button_5" : 5,
		"button_6" : 6,
		"button_7" : 7,
		"button_8" : 8,
		"button_9" : 9,
		"button_0" : 0,
		"button_plus" : '+',
		"button_minus" : '-',
		"button_times" : '*',
		"button_divide" : '/',
		"button_point" : '.',
		"button_feet" : "'",
		"button_inches" : '"',
		"button_sixteenths" : 's',
		"button_equals" : '=',
		"button_up" : '^'               
	};
	
	var layout = [
		[7,8,9,'plus'],
		[4,5,6,'minus'],
		[1,2,3,'times'],
		['equals',0,'point','divide'],
		['feet','inches','sixteenths','up']
	
	];
	
	$A(layout).each(function(row,rowNum){
		$A(row).each(function(buttonTag,colNum){
			//console.log($('button_'+buttonTag));
			$('button_'+buttonTag).setStyle({'position':'absolute','left':(colNum*3)+'em','top':(rowNum*2)+'em'});
			
		});
	})
	$('button_panel').show();
	$$('.calc_button').each(function(but)
	{
		but.observe('click',function(evt)
		{
			if (this.readAttribute('id') !== 'button_equals') {
				$('equation').setValue($('equation').getValue() + '' + buttonMappings[this.readAttribute('id')])
			}
			else{
				evaluate();
			}
			//console.log(buttonMappings[this.readAttribute('id')]);
		});
	});
	
	$('equation').observe('keypress',function(evt)
	{
		if(evt.keyCode == Event.KEY_RETURN)
		{
			evaluate();
		}
	});
});

function evaluate(){
	var expression = $('equation').getValue();
	var newExpression = new Element("li", {
		 'class':'expression'
	}).insert(expression);
	newExpression.observe('click',function(evt)
	{
		$('equation').setValue(this.getTextContent())
	});
	$$('#answers ul')[0].insert(newExpression);
	var newResult;
	try {
		var result = String(fisCalc.parse($('equation').getValue()));
		var newResult = new Element("li", {
			'class': 'result'
		}).insert(result);
		newResult.observe('click',function(evt)
		{
			var resultString = this.getTextContent();
			resultString = resultString.replace(/(.*)\/16/,"$1s");
			resultString = resultString.replace(/squared/,"^2");
			resultString = resultString.replace(/cubed/,"^3");
			$('equation').setValue($('equation').getValue() + resultString)
		});
	} catch (e) {
		var newResult = new Element("li", {
			'class': 'error'
		}).insert('Problem with expression');
	}

	
	$$('#answers ul')[0].insert(newResult);
	$('answers').scrollTop = $('answers').scrollHeight;
	$('equation').setValue('');
}
