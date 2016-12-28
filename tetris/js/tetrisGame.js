
var tetris = {

	// screen settings
	screen_width  : 9,
	screen_height : 25,
	canvas_object : false,
	screen_pixels : [],

	// game vars
	game_running  : false, // true during play
	game_paused   : false, // true if pause is hit
	game_score    : 0,		 // points gained so far
	game_lines    : 0, 		 // lines completed so far (used to determine level)
	game_level		: 0,     // current level (determine speed)
	level_speed   : [  500,  450, 400, 350, 300, 250, 200, 180], // game speed for each level
	level_points  : [  100,  150, 200, 250, 300, 350, 400, 450], // points gained for each line per level
	level_barried : [   10,   25,  45,  70, 100, 135, 175, 220], // lines when level changes
	current_piece : false, // falling piece
	next_piece    : false, // next piece
	static_pieces : false, // old pieces




	// Init screen
	start : function(){

		if (this.game_paused){
			this.pause();
			return;
		}

		canvas_object = $('#c');

		// reset level, score etc
		this.game_level = 0;
		this.game_score = 0;
		this.game_paused = false;

		if ($('i.x', canvas_object).length > 1) {
			// pixel exists, reset them
			$('#c .x.light').removeClass('on');

			// remove current piece
			this.current_piece = false;
			return;
		}

		canvas_object.html('');
		for(x=0;x<this.screen_height; ++x){
			for(y=0;y<this.screen_width;++y){
				canvas_object.append('<i class="x px-' + x + '-' + y +'" >' + x + ',' + y +'</i>');
			}
		}

		this.game_running = true;
		this.loop();

		this.registerKeyboard();
	},




	// loop function
	loop : function(){

		if (this.game_paused){
			// no loop allowed when in pause mode
			return;
		}

		if (this.current_piece != false && !this.current_piece.canMoveDown()){
			this.clearCompleteLines();
		}

		var options = {tetris : this};
		if (this.current_piece == false || this.current_piece.canMoveDown() == false ){
			if (this.next_piece == false){
				this.current_piece = new tetrisPiece(options);
			}
			else{
				this.clearCompleteLines();
				this.current_piece = {};
				jQuery.extend(true, this.current_piece, this.next_piece);
				this.current_piece.display();
			}

			//this.current_piece = new tetrisPiece(options);
			this.next_piece = new tetrisPiece(options);
			this.next_piece.displayAsPreview('#preview .t');
		}
		else{
			this.current_piece.fall();
		}

		if (!this.endGame()){
			setTimeout(function(){if (tetris.game_running) {tetris.loop();}}, this.level_speed[this.game_level]);
		}
	},

	// play / pause button
	pause : function(){
		if (this.game_paused){
			$('#c').fadeTo(30, 1.0);
			this.game_paused = false;
			this.loop();
		}
		else {
			$('#c').fadeTo(30, 0.3);
			this.game_paused = true;
		}
	},

	// end game (return true if game over)
	endGame : function(){
		// check the most top line to see if is not empty
		game_over = false;

		this.current_piece.dissapear();
		if (this.current_piece != false && !this.current_piece.canMoveDown()){
			for(var y = 0; y < this.screen_width && !game_over; ++y){
				if (!this.isFreePixel({'x': 0, 'y' : y})){
					game_over = true;
				}
			}
		}
		this.current_piece.display();

		if (game_over){
			$('#c').html('<div class="end">Game over</div>');
		}

		return game_over;
	},


	// check for completed lines and store them
	clearCompleteLines : function(){

		lines_completed = 0;

		// start for the bottom to top
		var x = this.screen_height - 1;
		while(x > 0){
			pixels_on_this_line = 0;

			for(var y = 0; y < this.screen_width; ++y){
				pos = {'x' : x, 'y' : y};
				if (!this.isFreePixel(pos)){
					++pixels_on_this_line;
				}
			}

			if (pixels_on_this_line == this.screen_width){
				this.clearLine(x);
				++lines_completed;
			}
			else{
				--x;
			}
		}

		if (lines_completed){
			this.game_score += this.level_points[this.game_level] * lines_completed;

			if (lines_completed > 1){
				this.game_score += Math.floor(this.level_points[this.game_level] * (lines_completed - 1) / 2)
			}

			this.game_lines += lines_completed;
			if (this.game_lines >= this.level_barried[this.game_level] && this.game_level < (this.level_barried.length - 1)){
				++this.game_level;
			}

			this.info_update();
		}
	},


	score_update : function(){
		$('#s').html(this.game_score);
	},

	level_update : function(){
		$('#l').html(this.game_level + 1);
	},

	lines_update : function(){
		$('#lines').html(this.game_lines);
	},

	info_update  : function(){
		this.score_update();
		this.level_update();
		this.lines_update();
	},


	// clears given line and shift top pixels
	clearLine : function(line){
		for(var x = line; x > 0; --x){
			for(var y = 0; y < this.screen_width; ++y){
				current_pixel = {'x' : x, 'y' : y};
				top_pixel = {'x' : x - 1, 'y' : y};
				if (!this.isFreePixel(top_pixel)){
					this.turnOnPixel(current_pixel);
					this.turnOffPixel(top_pixel);
				}
				else{
					this.turnOffPixel(current_pixel);
				}
			}
		}
	},

	turnOnPixel : function(pos){
		if (!$('#c .x.px-' + pos.x + '-' + pos.y).hasClass('on')){
			$('#c .x.px-' + pos.x + '-' + pos.y).addClass('on');
		}
	},

	turnOffPixel : function(pos){
		$('#c .x.px-' + pos.x + '-' + pos.y).removeClass('on');
	},



	// Tetrimon controll
	shift_left : function(){
		this.current_piece.toLeft();
	},

	shift_right : function(){
		this.current_piece.toRight();
	},

	rotate : function(){
		this.current_piece.rotate();
	},

	fast_fall : function(){
		if (this.current_piece.top_x > 0){
			while (this.current_piece.canMoveDown()){
				this.current_piece.fall();
			}
			this.clearCompleteLines();
		}
		else {
			if (this.current_piece.canMoveDown()){
				this.current_piece.fall();
			}
		}
	},

	// check if given pixel is free and valid (inside the screen area)
	isFreePixel : function(pos){
		// check if valid line
		if (pos.x >= this.screen_height){
			// we don't check if x is positive because
			// new pieces have negative x when they start falling
			// we check for negative values only for rotation (new pices can't be rotated)
			return false;
		}

		if (typeof(pos.checkRotation) != 'undefined' && pos.checkRotation && pos.x < 0){
			return false;
		}

		// chekc if valid column
		if (pos.y < 0 || pos.y >= this.screen_width){
			return false;
		}

		return !$('#c .x.px-' + pos.x + '-' + pos.y).hasClass('on');
	},


	registerKeyboard : function(){
		// bind keys
		$(document).keydown(function(e){
			if (e.keyCode == 37){
				// left arrow
				tetris.shift_left();
				e.preventDefault();
			}
			else if (e.keyCode == 39){
				// right arrow
				tetris.shift_right();
				e.preventDefault();
			}
			else if (e.keyCode == 40 || e.keyCode == 32){
				// down arrow
				tetris.fast_fall();
				e.preventDefault();
			}
			else if (e.keyCode == 38){
				// up arrow
				tetris.rotate();
				e.preventDefault();
			}
			else if (e.keyCode == 13){
				// enter
				tetris.start();
				e.preventDefault();
			}
			else if (e.keyCode == 27 || e.keyCode == 80){
				// ESC or P
				tetris.pause();
			}
		})
	},
};