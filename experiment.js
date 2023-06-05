
var pav = false;

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

// task specific variables
var current_trial = 0

var num_practice_trials = 4 //per trial type
var blocks = jsPsych.randomization.shuffle(['B'])

var factors = { 
	difficulty: ["easy","hard"],
	type: ["many","few"]
}

var nstimuli = factors.type.length * factors.difficulty.length;
var total_trials_per_block = 2; //200;
var trial_reps_per_block = total_trials_per_block / nstimuli;

var total_practice_trials = 2; //20;
var trial_reps_practice = total_practice_trials / nstimuli;
var practice_design = jsPsych.randomization.factorial(factors,trial_reps_practice,true);
var initial_full_design = jsPsych.randomization.factorial(factors,trial_reps_per_block,true);

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */


//Set up experiment
var experiment_timeline = []

if (pav) {
	experiment_timeline.push(pavlovia_init);
};

experiment_timeline.push(fullscreen);

experiment_timeline.push(instruction_node);


function generate_grid(difficulty,type) {
	var number=50;
	
	if (difficulty=="easy") {
		number = randomDraw([31,32,33,34,35]);
	} else {
		number = randomDraw([41,42,43,44,45]);
	}
	if (type=="many") {
		number = 100-number;
	}
	
	var random1 = Array(100-number).fill(1); //blanks
	var random2 = Array(number).fill(2); //asterisks
	var random = random1.concat(random2);
	var shuffled = random.map(value => ({ value, sort: Math.random()})).sort((a,b) => a.sort-b.sort).map(({ value })=> value)
	var gridtext = '<div class="mask div-center">';
	for (var s = 0; s<100; s++) {
		if (shuffled[s]==1) {
			gridtext = gridtext + '<div class="b">&nbsp;</div>';
		} else {
			gridtext = gridtext + '<div class="w">*</div>';
		}
	}
	gridtext = gridtext + '</div>';
	return [gridtext,number];
}

function create_trial(difficulty,type,practice) {
	var [gridtext,number] = generate_grid(difficulty,type);
	
	var correct_response = 190;
	if (type=="few") {
		correct_response = 188;
	}
	
	var correct_text = '<div class = centerbox><div style="color:green;font-size:60px"; class = block-text>Correct!</div></div>';
	var incorrect_text = '<div class = centerbox><div style="color:red;font-size:60px"; class = block-text>Incorrect</div></div>';
	var feedback_duration = 1000;
	var fixation_duration = 500;
	var trial_id = "grid_practice";
	if (practice==0) {
		trial_id = "grid";
		correct_text = '';
		//incorrect_text = '';
		feedback_duration = 300;
		fixation_duration = 200;
	}
	
	var stim_block = {
			type: 'poldrack-categorize',
			is_html: true,
			stimulus: '<div class=centerbox>' + gridtext + '</div>',
			data: {
				trial_id: trial_id,
				stim: gridtext,
				number: number,
				correct_response: correct_response,
				difficulty: difficulty,
				type: type
			},
			choices: [',','<','.','>'],
			key_answer: correct_response,
			response_ends_trial: true,
			correct_text: correct_text,
			incorrect_text: incorrect_text,
			timeout_message: '<div class = centerbox><div style="font-size:60px" class = block-text>Respond Faster!</div></div>',
			timing_feedback_duration: feedback_duration,
			show_stim_with_feedback: false,
			timing_stim: 3000,
			timing_response: 3000,
			timing_post_trial: 0
	};
	
	var test_dots = {
		type: 'rdk',
		post_trial_gap: 0,
		number_of_dots: 200,
		RDK_type: 3,
		choices: ["a","l"],
		correct_choice: "a",
		coherent_direction: 0,
		coherence: 0.5,
		opposite_coherence: 0.5,
		trial_duration: 1000
	};
	
	var fixation_block = {
			type: 'html-keyboard-response',
			stimulus: '<div class=centerbox><div style="font-size:60px;" class="block-text">+</div></div>',
			choices: jsPsych.NO_KEYS,
			data: {
				trial_id: "fixation"
			},
			stimulus_duration: fixation_duration,
			trial_duration: fixation_duration
	};
	
	var trial = [];
	trial.push(stim_block);
	trial.push(test_dots);
	trial.push(fixation_block);
	return trial;
}

var b_instructions = []
var [example_stim1,number] = generate_grid("easy","few");
var [example_stim2,number] = generate_grid("hard","few");
var [example_stim3,number] = generate_grid("easy","few");
var [example_stim4,number] = generate_grid("easy","many");
var [example_stim5,number] = generate_grid("hard","many");
var [example_stim6,number] = generate_grid("easy","many");

var b_task_instructions_1 = {
	type: 'instructions',
	pages: [
		'<div class = centerbox><p class = block-text>If there are <b>MORE</b> than 50 asterisks in the box, you should press the <b>> KEY</b>. If there are <b>LESS</b> than 50 asterisks, you should press the <b>< KEY</b>.</p><p class=block-text>The following three example stimuli have <b>LESS</b> than 50 asterisks.</p></div>',
		'<div class=centerbox>' + example_stim1 + '<p class=center-block-text>Press Next to see the next example.</p></div>',
		'<div class=centerbox>' + example_stim2 + '<p class=center-block-text>Press Next to see the next example.</p></div>',
		'<div class=centerbox>' + example_stim3 + '<p class=center-block-text>Press Next to continue instructions.</p></div>',
		'<div class = centerbox><p class = block-text>The following three stimuli have <b>MORE</b> than 50 asterisks.</p></div>',
		'<div class=centerbox>' + example_stim4 + '<p class=center-block-text>Press Next to see the next example.</p></div>',
		'<div class=centerbox>' + example_stim5 + '<p class=center-block-text>Press Next to see the next example.</p></div>',
		'<div class=centerbox>' + example_stim6 + '<p class=center-block-text>Press Next to continue instructions.</p></div>',
	],
	show_clickable_nav: true,
	button_label_previous: 'Previous Page',
	button_label_next: 'Next Page',
	data: {
		trial_id: "numerosity task instructions 1"
	},
	timing_post_trial: 1000,
	key_forward: jsPsych.NO_KEYS,
	key_backward: jsPsych.NO_KEYS
};

var b_task_instructions_2 = {
	type: 'instructions',
	pages: [
		'<div class = centerbox ><p class = block-text>When presented with the stimulus, you should press the <b>greater than key [>]</b> for <b>MORE</b> than 50 or the <b>less than key [<]</b> for <b>LESS</b> than 50 asterisks. Many of these stimuli can be difficult to categorize, so everyone will make some incorrect choices. If you are not sure which category to choose, just take your best guess. Try to make your responses quickly. If you respond too slowly, you will receive a feedback message that says "Respond faster!".</p><p class=block-text>The following round contains 20 practice trials.</p><p class=center-block-text>Press <b>ENTER</b> to begin practice.</div>'
	],
	key_forward: 'Enter',
	data: {
		trial_id: "numerosity task instructions 2"
	},
	timing_post_trial:1000
};

var b_task_instructions_4 = {
	type: 'instructions',
	pages: [
		'<div class = centerbox><p class = block-text>The next round contains more trials in which you will have to determine whether each stimulus has <b>MORE</b> or <b>LESS</b> than 50 asterisks. Unlike the practice block you just completed, you will not receive any feedback if your choice is correct. If your choice is incorrect or you do not respond quickly enough you will see feedback. Remember that this task is designed to be difficult and that everyone makes some incorrect choices. Try your best to respond quickly and accurately on each trial, and if you are unsure, take your best guess.</p><p class=center-block-text>Press <b>ENTER</b> to begin task.</p></div>'
	],
	key_forward: 'Enter',	
	data: {
		trial_id: "numerosity task instructions 4"
	},
	timing_post_trial: 1000
};

b_instructions.push(b_task_instructions_1);
b_instructions.push(b_task_instructions_2);
b_instructions.push(cursor_off);

//insert practice trials
var practice = [];
for (i = 0; i<total_practice_trials; i++) {
	var difficulty = practice_design.difficulty[i];
	var type = practice_design.type[i];
	practice = practice.concat(create_trial(difficulty,type,1));
}
b_instructions = b_instructions.concat(practice);
b_instructions.push(cursor_on);
b_instructions.push(b_task_instructions_4);

experiment_timeline = experiment_timeline.concat(b_instructions);

experiment_timeline.push(cursor_off);

for (var d = 0; d < blocks.length; d++) {
	var block = blocks[d]

	//experiment_timeline = experiment_timeline.concat(instructions);
	
	for (var i = 0; i < total_trials_per_block; i++) {
		var difficulty = initial_full_design.difficulty[i];
		var type = initial_full_design.type[i];
		var trial = create_trial(difficulty,type,0);
		experiment_timeline = experiment_timeline.concat(trial);
	}
	//experiment_timeline.push(interblock_rest);
}

experiment_timeline.push(cursor_on);

experiment_timeline.push(sam_trial01);
experiment_timeline.push(sam_trial02);
experiment_timeline.push(sam_trial03);

experiment_timeline.push(post_task_block)

if (pav) {
	
	experiment_timeline.push(pavlovia_finish);
};

experiment_timeline.push(pause);

experiment_timeline.push(no_fullscreen);

experiment_timeline.push(end_block)
