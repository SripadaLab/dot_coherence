
var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
}


//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: [
   { 
	prompt: '<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
	rows: 3,
	colums: 30
   }
   ]
};

var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

/* define static blocks */
var feedback_instruct_text =
	'<div class="block-text">Welcome to the experiment. Press <strong>enter</strong> to begin.</div>'
	
var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var feedback_instruct_block = {
	type: 'instructions',
	data: {
		trial_id: "instruction"
	},
	key_forward: 'Enter',	pages: [getInstructFeedback()],
	timing_post_trial: 0,
};

/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: 'instructions',
	data: {
		trial_id: "instruction"
	},
	pages: [
		'<div class = centerbox>' + instruct_text + '</div>',
	],
	allow_keys: true,
	show_clickable_nav: false,
	button_label_previous: 'Previous Page',
	button_label_next: 'Next Page',
	timing_post_trial: 1000,
	key_forward: 'Enter',
	key_backward: jsPsych.NO_KEYS
};

var instruction_node = {
	timeline: [feedback_instruct_block, instructions_block],
	/* This function defines stopping criteria */
	loop_function: function(data) {
		for (i = 0; i < data.values().length; i++) {
			if ((data.values()[i].trial_type == 'instructions') && (data.values()[i].rt != -1)) {
				rt = data.values()[i].rt
				sumInstructTime = sumInstructTime + rt
			}
		}
		if (sumInstructTime <= instructTimeThresh * 1000) {
			feedback_instruct_text =
				'<div class="block-text">Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.</div>'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = '<div class="block-text">Done with instructions. Press <strong>enter</strong> to continue.</div>'
			return false
		}
	}
}



var audio = new Audio();
audio.src = "error.mp3";
audio.loop = false;

jsPsych.pluginAPI.preloadAudio(audio.src);

function errorDing() {
	audio.play();
}


var fullscreen = {
	type: 'fullscreen',
	fullscreen_mode: true
};

var no_fullscreen = {
	type: "fullscreen",
	fullscreen_mode: false
};



var cursor_off = {
	type: 'call-function',
	func: function() {
		document.body.style.cursor = "none";
	}
}
var cursor_on = {
	type: 'call-function',
	func: function() {
		document.body.style.cursor = "auto";
	}
}


var pavlovia_init = {
	type: "pavlovia",
	command: "init"
};

var pavlovia_finish = {
	type: "pavlovia",
	command: "finish",
	dataFilter: function(data) {
		data = jsPsych.data.get().ignore('stimulus').ignore('stim').csv();
		return data;
	},
	completedCallback: function() {
		
	}
};

var pause = {
	type: 'html-keyboard-response',
	stimulus: '<div class=centerbox><p class=center-block-text>Please wait...</p></div>',
	choices: jsPsych.NO_KEYS,
	trial_duration: 6000
};


var end_block = {
	type: 'html-keyboard-response',
	data: {
		trial_id: "end"
	},
	stimulus: '<div class=centerbox><p class=block-text>You have finished the task. </p><p class=block-text>Please wait and you will be redirected to complete the survey.</p></div>',
	choices: jsPsych.NO_KEYS,
	trial_duration: 4000
};

