/**
 * Implements a tetris piece with the following available methods:
 *
 *  toLeft()
 *  toRight()
 *  rotate()
 *  fall()
 *
 */


function tetrisPiece(options){
	this.pattern = getTetrimonPatterns();

	// generate a random tetrimon with a random rotation
	this.generateTetrimon = function(){
		var result = {};

		result.tetrimon = Math.floor(Math.random() * this.pattern.length);
		result.rotation = Math.floor(Math.random() * this.pattern[result.tetrimon].length);

		result.top_x = -this.pattern[result.tetrimon][result.rotation].length + 1;
		result.top_y = Math.floor((this.tetrisGame.screen_width - this.pattern[result.tetrimon][result.rotation][0].length) / 2);

		// show firt line of tetrimon at the start
		line_found = false;
		for(var x = (this.pattern[result.tetrimon][result.rotation].length - 1); x > 0 && !line_found; --x){
			for(var y = 0; !line_found && y < this.pattern[result.tetrimon][result.rotation][0].length; ++y){
				if (this.pattern[result.tetrimon][result.rotation][x][y]){
					line_found = true;
				}
			}
		}
		result.top_x = -x;

		return result;
	}


	this.tetrisGame = options.tetris;

	var new_options = this.generateTetrimon();

	this.tetrimon = new_options.tetrimon;
	this.rotation = new_options.rotation;
	this.top_x    = new_options.top_x;
	this.top_y    = new_options.top_y

	/*
	this.tetrimon = Math.floor(Math.random() * this.pattern.length);
	this.rotation = Math.floor(Math.random() * this.pattern[this.tetrimon].length);
	this.top_x = -this.pattern[this.tetrimon][this.rotation].length + 1;
	this.top_y = Math.floor((this.tetrisGame.screen_width - this.pattern[this.tetrimon][this.rotation][0].length) / 2) ;
	*/

	this.cols = this.pattern[this.tetrimon][this.rotation][0].length;
	this.rows = this.pattern[this.tetrimon][this.rotation].length;


	// display the piece
	this.display = function(){
		for(x = 0; x < this.rows; ++x){
			for(y = 0; y < this.cols; ++y){
				if (this.pattern[this.tetrimon][this.rotation][x][y]){
					this.tetrisGame.turnOnPixel({'x':(x + this.top_x), 'y':(this.top_y + y)});
				}
			}
		}
	}

	// dissapear
	this.dissapear = function(){
		for(x = 0; x < this.rows; ++x){
			for(y = 0; y < this.cols; ++y){
				if (this.pattern[this.tetrimon][this.rotation][x][y]){
					this.tetrisGame.turnOffPixel({'x':(x + this.top_x), 'y':(this.top_y + y)});
				}
			}
		}
	}

	// move piece down by 1 pixel
	this.fall = function(){
		if(this.canMoveDown()){
			this.dissapear();
			++this.top_x;
			this.display();
			return true;
		}

		return false;
	}

	// Check if current piece can be moved down
	this.canMoveDown = function(){
		can_move = true;

		// for each column
		// find the bottom most pixel
		// and check if it has space to fall
		for(y = 0; y < this.cols && can_move; ++y){
			x = this.rows - 1;
			while(x >= 0 && this.pattern[this.tetrimon][this.rotation][x][y] != 1){
				--x;
			}

			// there is a pixel in that column
			if (x >= 0){
				new_position = {
					'x' : x + this.top_x + 1,
					'y' : y + this.top_y
				};

				if ( !this.tetrisGame.isFreePixel( new_position ) ){
					// this pixel cannot fall
					can_move = false;
				}
			}
		}

		return can_move;
	}

	// move piece to the left
	this.toLeft = function(){
		if (this.canMoveLeft()){
			this.dissapear();
			--this.top_y;
			this.display();
		}
	};

	// can this piece be moved to the left?
	this.canMoveLeft = function(){
		can_move = true;

		// for each line
		// take the most left pixel
		// and check if can be moved to the left
		for(x = 0; x < this.rows && can_move; ++x){
			y = 0;
			while(y < this.cols && this.pattern[this.tetrimon][this.rotation][x][y] == 0){
				++y;
			}

			if (y < this.cols){ // there is a pixel on this line
				new_position = {
					x : this.top_x + x,
					y : this.top_y - 1 + y
				};

				if ( !this.tetrisGame.isFreePixel(new_position)){
					can_move = false;
				}
			}
		}

		return can_move;
	}

	// move piece to the right
	this.toRight = function(){
		if (this.canMoveRight()){
			this.dissapear();
			++this.top_y;
			this.display();
		}

	}

	// can this piece be moved to the right?
	this.canMoveRight = function(){
		can_move = true;

		// for each line
		// take the right most pixel
		// and check if can be moved to the left
		for(x = 0; x < this.rows && can_move; ++x){
			y = this.cols -1 ;
			while(y >= 0 && this.pattern[this.tetrimon][this.rotation][x][y] == 0){
				--y;
			}

			if (y >= 0){ // there is a pixel on this line
				new_position = {
					x : this.top_x + x,
					y : this.top_y + 1 + y
				};

				if ( !this.tetrisGame.isFreePixel(new_position)){
					console.log()
					can_move = false;
				}
			}
		}

		return can_move;
	}

	// rotate piece
	this.rotate = function(){
		new_rotation = (this.rotation + 1) % this.pattern[this.tetrimon].length;

		// check if all new pixels are displayed correctly (not out of screen)
		this.dissapear(); // check also if pixels are free
		can_be_rotated = true;
		for(x = 0; x < this.rows && can_be_rotated; ++x){
			for(y = 0; y < this.cols && can_be_rotated; ++y){
				if (this.pattern[this.tetrimon][new_rotation][x][y] == 1){
					// check new rows
					if (can_be_rotated && (this.top_x + x < 0 || this.top_x + x >= this.tetrisGame.screen_height) ){
						can_be_rotated = false;
					}
					// check new cols
					if (can_be_rotated && (this.top_y + y < 0 || this.top_y + y >= this.tetrisGame.screen_width) ){
						can_be_rotated = false;
					}

					if (can_be_rotated){
						// check if pixel is free
						new_pos = {
							x : this.top_x + x,
							y : this.top_y + y,
							checkRotation : true
						};

						if(!this.tetrisGame.isFreePixel(new_pos)){
							can_be_rotated = false;
						}
					}
				}
			}
		}

		if (can_be_rotated){
			this.rotation = new_rotation;
		}
		this.display();
	}


	// display this tetrimon as preview
	this.displayAsPreview = function(container_selector){
		container = $(container_selector);

		container.html('');
		for(var x = 0; x < this.pattern[this.tetrimon][this.rotation].length; ++x){
			for(var y = 0; y < this.pattern[this.tetrimon][this.rotation][0].length; ++y){
				if (this.pattern[this.tetrimon][this.rotation][x][y]){
					container.append('<i class="x on"></i>');
				}
				else {
					container.append('<i class="x"></i>');
				}
			}
			container.append('<div class="clear"></div>');
		}
	}

	return this;
}