/*
 * Tokenizer for FIS Calculator
 *
 * The only operators that this supports are:
 * 	+
 * 	-
 * 	*	
 * 	/
 * 
 * Also recognises parantheses:
 * 	(
 * 	)
 * 
 * Whitespace is ignored
 * All other tokens must be FIS, metre or numerical values
 * 
 * Requires Prototype
 */

 var FISTokenizer = Class.create(
	{
		initialize: function()
		{
			this.tokens = [];
			this.currentToken = "";
		},
		
		tokenize: function(str)
		{
			this.tokens = [];
			console.log("Tokenize: %s",str);
			/*
			 * Whitespace is irrelevant when it comes to tokenizing.
			 * 
			 * What we expect is a series of values, separated by operators and 
			 * parantheses.
			 */
			var oThis = this;
			console.log("Whitespace Removed: %o",$w(str));
			$w(str).each(function(stringPart)
			{
				while(stringPart.search(/[+\-*\/()]/) >= 0)
				{
					if(stringPart.search(/[+\-*\/()]/) != 0)
					{
						oThis.tokens.push(stringPart.substr(0,stringPart.search(/[+\-*\/()]/)));	
					}
					oThis.tokens.push(stringPart.charAt(stringPart.search(/[+\-*\/()]/)));
					stringPart = stringPart.substr(stringPart.search(/[+\-*\/()]/)+1);
				}
				if(stringPart.length > 0)
				{
					oThis.tokens.push(stringPart);
				}
			});
			console.log('Tokenized: %o',this.tokens);
		}

	}
	);