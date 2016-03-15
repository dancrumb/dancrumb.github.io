/*
 * FIS
 * 
 * Feet-Inch-Sixteenth representation
 *
 * Uses Prototype
 */
 
var FIS = Class.create(
	{
		initialize: function(f,i,s,d)
	  	{
		  	//console.log('new(%o,%o,%o,%o)',f,i,s,d);
			if(typeof(f) == 'undefined') f = 0;
			if(typeof(i) == 'undefined') i = 0;
		    if(typeof(s) == 'undefined') s = 0;
		    if(typeof(d) == 'undefined') d = 1;
		      
		    this.feet = parseFloat(f);
		    this.inches = parseFloat(i);
		    this.sixteenths = parseFloat(s);	    
		    this.dimension = parseFloat(d);
	    
	    	this.normalize();
		},
		
		add: function(fis)
		{
			//console.log('%o.add(%o)',this,fis);
			var newF,newI,newS;
			newF = this.feet+ fis.feet;
			newI = this.inches + fis.inches;
			newS = this.sixteenths + fis.sixteenths;
			
			if (this.dimension !== fis.dimension)
			{
				throw new Error('Dimension mismatch');
			}

			return new FIS(newF,newI,newS,fis.dimension);
		},
		
		subtract: function(fis)
		{
			var newF,newI,newS;
			newF = this.feet- fis.feet;
			newI = this.inches - fis.inches;
			newS = this.sixteenths - fis.sixteenths;
			
			if (this.dimension !== fis.dimension)
			{
				throw new Error('Dimension mismatch');
			}

			return new FIS(newF,newI,newS,fis.dimension);
		},

        multiply: function(operand)
		{
			var product;
			var newDimension;
			if (typeof(operand) == "number") {
				product = this.toDecimalFeet() * operand;
				newDimension = this.dimension;
			}
			else {
				product = this.toDecimalFeet() * operand.toDecimalFeet();
				newDimension = this.dimension+operand.dimension;
			}
				
            return FIS.fromDecimalFeet(product,newDimension);
		},
		
		divide: function(fis)
        {
			//console.log('%o.divide(%o)',this,fis);
			console.log(this.toDecimalFeet());
			console.log(fis.toDecimalFeet());
                var product = this.toDecimalFeet() / fis.toDecimalFeet();
				console.log(product);
                return FIS.fromDecimalFeet(product,this.dimension-fis.dimension);
        },

		
		toString: function()
		{
            var modText = ['','',' squared',' cubed'][this.dimension];
			if (this.dimension > 0) {
				return this.feet + "' " + this.inches + '" ' + this.sixteenths + '/16' + modText;
			}
			else
			{
				return this.toDecimalFeet();
			}
		},
		
		toDecimalFeet: function()
		{
			//console.log('%o.toDecimalFeet()',this);
			return (this.feet + this.inches / Math.pow(12,this.dimension) + this.sixteenths/Math.pow(16*12,this.dimension));
		},
		
		toDecimalInches: function()
		{
			return (this.feet * Math.pow(12,this.dimension) + this.inches + this.sixteenths/Math.pow(16,this.dimension));
		},
		
		raiseToDimension: function(dim)
		{
			this.dimension = dim;
			return this;
		},
		
		normalize: function()
		{
			//console.log('enter normalize(%o)',this);
			if (this.dimension == 0) {
				this.feet = this.feet + this.inches / 12 + this.sixteenths / (12 * 16);
				this.inches = 0;
				this.sixteenths = 0;
			}
			else {
				
				/*
				 * If any of the units are less than zero, then normalize
				 * those by applying the subtraction to the next unit up
				 */
				if(this.sixteenths < 0)
				{
					this.inches += this.sixteenths / Math.pow(16, this.dimension);
					this.sixteenths = 0;
				}
				
				if(this.inches < 0)
				{
					this.feet += this.inches / Math.pow(12, this.dimension);
					this.inches = 0;
				}
				
				/*
				 * Next, we push fractional components down to the next level:
				 * Fractional feet => inches
				 * Fractional inches => sixteenths
				 */
				if (this.feet > Math.floor(this.feet)) {
					this.inches += Math.pow(12, this.dimension) * (this.feet - Math.floor(this.feet));
					this.feet = Math.floor(this.feet);
				}
				if (this.inches > Math.floor(this.inches)) {
					this.sixteenths += Math.pow(16, this.dimension) * (this.inches - Math.floor(this.inches));
					this.inches = Math.floor(this.inches);
				}
				this.sixteenths = Math.round(this.sixteenths);
				
				if(this.sixteenths < 0)
				{
					this.inches += this.sixteenths / Math.pow(16, this.dimension);
					this.sixteenths = 0;
				}
				
				if(this.inches < 0)
				{
					this.feet += this.inches / Math.pow(12, this.dimension);
					this.inches = 0;
				}
				
				/*
				 * Next, we fix smaller units that have 'overflowed'
				 */
				if (this.sixteenths >= Math.pow(16, this.dimension)) {
					this.inches += Math.floor(this.sixteenths / Math.pow(16, this.dimension));
					this.sixteenths %= Math.pow(16, this.dimension);
				}
				
				if (this.inches >= Math.pow(12, this.dimension)) {
					this.feet += Math.floor(this.inches / Math.pow(12, this.dimension));
					this.inches %= Math.pow(12, this.dimension);
				}
			}
			//console.log('exit normalize(%o)',this);	
		}
		
	} 
);

Object.extend(FIS,  {
	fromDecimalInches: function(decimal, dimension){
		if (typeof(dimension) == 'undefined') 
			dimension = 1;
		/*
		 * Split into constituents
		 */
		var feet = Math.floor(decimal / Math.pow(12, dimension));
		var inches = decimal % 12;
		var sixteenths = inches - Math.floor(inches);
		
		inches = Math.floor(inches);
		
		sixteenths = Math.floor(sixteenths * Math.pow(16, dimension));
		
		return new FIS(feet, inches, sixteenths, dimension);
	},
	
	fromDecimalFeet: function(decimal, dimension){
		//console.log('fromDecimalFeet(%o,%o)',decimal,dimension);
		if (typeof(dimension) == 'undefined') 
			dimension = 1;
				
		return new FIS(decimal,0,0, dimension);
	},
	
	fromMetres: function(metres, dimension){
		//console.log('fromMetres(%o,%o)', metres, dimension);
		
		if (typeof(dimension) == 'undefined') 
			dimension = 1;
		
		/*
		 * Convert to inches
		 */
		var inches = metres * Math.pow(39.3700787, dimension);
		
		return new FIS(0, inches, 0, dimension);
	},
	
	fromString: function(fisString, dimension)
	{
		/*
		 * This regex will take a string of the format:
		 * 
		 * (feet) ' (inches) " (sixteenths) s
		 * 
		 * and captures any of the defined elements.
		 * Whitespace is unimportant
		 * Any element can be present or missing
		 * 
		 * $1 is feet
		 * $2 is inches
		 * $3 is sixteenths
		 */
		var fisRegex = /\s*(?:([0-9]+(?:\.[0-9]+)?)\s*'){0,1}\s*(?:([0-9]+(?:\.[0-9]+)?)\s*"){0,1}\s*(?:([0-9]+(?:\.[0-9]+)?)\s*s){0,1}/;
		var fisData = fisRegex.exec(fisString);
		//console.log(fisData);
		
		return new FIS(fisData[1],fisData[2], fisData[3],dimension);
	}
});

