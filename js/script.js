$(document).ready(function() {
	var letters = ''
	squareIndexes = [],
	words = [],
	used = [],
	score = 0;

	//populate the cells with configuration one or two
	var config1 = ['s', 'e', 'r', 's', 'p', 'a', 't', 'g', 'l', 'i', 'n', 'e', 's', 'e', 'r', 's'],
	config2 = ['t', 'e', 'o', 'v', 'l', 's', 'r', 'f', 'w', 'n', 'a', 'p', 'c', 'a', 'r', 'i'];
	if(Math.floor(Math.random()*2)){
		populate(config1);
	} else {
		populate(config2);
	}

	function populate(data) {
		for(let in data) {
			$('#' + let).html(data[let].toUpperCase())
		}
	}

	//load all possible words
	$.getJSON('data/words.json', function(data) {
		for(item in data) {
			words.push(data[item]['word']);
		}
	});

	//click handlers for adding a letter
	//and submitting a word
	$('.cell').click(function(e) {
		letterClick(e);
	});

	$('#try').click(function() {
		checkWord();
	});

	//called by cell click handler 
	function letterClick(e) {
		var el = $(e.target);

		if(validateNewLetter(el)) {
			if(el.attr('id') == lastSquareSelected()) {
				backspace(el);
				console.log('back it up')
			} else {
				console.log('accepted!');
				accept(el);
			}
			$('#letters').html(letters);
		} else {
			console.log('denied!');
		}
	}

	//add letter to currently clicked cells
	function accept(el) {
		el.addClass('active');
		squareIndexes.push(el.attr('id'));
		letters += el.text();
	}

	//remove most recent cell
	function backspace(el) {
		el.removeClass('active');
		squareIndexes.pop();
		letters = letters.substring(0, letters.length - 1);
	}

	//check to see if the clicked cell is adjacent
	//to the most recently clicked cell
	function validateNewLetter(el) {
		return squareIndexes.length == 0 || hasActiveNeighbor(el);
	}

	//checks neighboring cells to see if they're active
	function hasActiveNeighbor(el) {
		var loc = parseFloat(el.attr('id')),
		last = lastSquareSelected(),
		r1 = Math.floor(loc / 4),
		c1 = loc % 4,
		r2 = Math.floor(last / 4),
		c2 = last % 4;
		return (Math.abs(r1-r2) <= 1) && (Math.abs(c1-c2) <= 1);
	}

	//returns most recent cell clicked
	function lastSquareSelected() {
		if(squareIndexes.length == 0) {
			return undefined;
		} else {
			return squareIndexes[squareIndexes.length - 1];
		}
	}

	//checks to see if a word is in the array of possible words
	//also checks to see if use has tried that word already
	//clears board after a clicking
	function checkWord() {
		letters = String(letters.toLowerCase());
		if ($.inArray(letters, words) > -1){
			console.log('it is a word, congrats!');

			if($.inArray(letters, used) == -1) {
				inductWord();
			} else {
				console.log('but you already used it...');				
			}
		} else {
			console.log('that is not a word at all!');
		}
		restart();
	}

	function inductWord() {
		var wordlen = letters.length;
		if(wordlen == 3) {
			points = 1;
		} else {
			points = wordlen - 3
		}
		console.log(letters.length);
		used.push(letters);
		score += points;
		$('#score span').html(score);
		$('#result').html(used.join(', '))
	}

	//clears the board
	function restart() {
		letters = '';
		$('#letters').html('');
		squareIndexes = [];
		var cells = $('.cell');
		cells.removeClass('active');
	}

})