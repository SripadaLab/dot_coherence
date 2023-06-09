
var pav = false;

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

// task specific variables
var current_trial = 0

var num_practice_trials = 4 //per trial type
var blocks = jsPsych.randomization.shuffle(['B'])

var factors = { 
	difficulty: ["easy"],//,"hard"],
	type: ["many","few"],
	direction: ["left","right"]
}

var nstimuli = factors.type.length * factors.difficulty.length;
var total_trials_per_block = 20; //200;
var trial_reps_per_block = total_trials_per_block / nstimuli;

var total_practice_trials = 20; //20;
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


function generate_grid(difficulty,type,direction) {
	var number=200;
	var proportion = 0.50;
	var angle = 0;
	
	if (direction=="left") {
		angle = 180;
	}
	
	if (type=="many") {
		number = 800;
	}
	
	if (difficulty=="easy") {
		proportion = randomDraw([0.8]);
	} else {
		proportion = randomDraw([0.05,0.10,0.15]);
	}

	return [number,proportion,angle];
}

function create_trial(difficulty,type,direction,practice) {
	var [number,proportion,angle] = generate_grid(difficulty,type,direction);
	
	var correct_response = 'ArrowLeft';
	if (direction=="right") {
		correct_response = 'ArrowRight';
	}
	
	var correct_text = '<div class = centerbox><div style="color:green;font-size:60px"; class = block-text>Correct!</div></div>';
	var incorrect_text = '<div class = centerbox><div style="color:red;font-size:60px"; class = block-text>Incorrect</div></div>';
	var feedback_duration = 1000;
	var fixation_duration = 500;
	var trial_id = "dots_practice";
	if (practice==0) {
		trial_id = "dots";
		correct_text = '';
		//incorrect_text = '';
		feedback_duration = 300;
		fixation_duration = 200;
	}
	
	var test_dots = {
		type: 'rdk',
		post_trial_gap: 0,
		number_of_dots: number,
		RDK_type: 3,
		choices: ["ArrowLeft","ArrowRight"],
		correct_choice: correct_response,
		coherent_direction: angle,
		coherence: proportion,
		opposite_coherence: 1-proportion,
		trial_duration: 2000,
		aperture_type: 3,
		aperture_width: 800,
		aperture_center_x: window.screen.availWidth/2,
		aperture_center_y: window.screen.availHeight/2,
		background_color: "black",
		dot_color: "white"
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
	trial.push(test_dots);
	trial.push(fixation_block);
	return trial;
}

var b_instructions = []

var b_task_instructions_2 = {
	type: 'instructions',
	pages: [
		'<div class = centerbox ><p class = block-text>If you think the majority of dots are moving to the left, press the <b>Left arrow key</b>. If you think the majority of dots are moving to the right, press the <b>Right arrow key</b>.</p><p class=block-text>Many of these stimuli can be difficult to categorize, so everyone will make some incorrect choices. If you are not sure which category to choose, just take your best guess. Try to make your responses quickly.</p><p class=block-text>You will now be given some practice trials.</p><p class=center-block-text>Press <b>ENTER</b> to begin practice.</div>'
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
		'<div class = centerbox><p class = block-text>The next round contains more trials in which you will have to determine which direction the majority of dots are moving. Remember that this task is designed to be difficult and that everyone makes some incorrect choices. Try your best to respond quickly and accurately on each trial, and if you are unsure, take your best guess.</p><p class=center-block-text>Press <b>ENTER</b> to begin task.</p></div>'
	],
	key_forward: 'Enter',	
	data: {
		trial_id: "numerosity task instructions 4"
	},
	timing_post_trial: 1000
};

b_instructions.push(b_task_instructions_2);
b_instructions.push(cursor_off);

//insert practice trials
var practice = [];
for (i = 0; i<total_practice_trials; i++) {
	var difficulty = practice_design.difficulty[i];
	var type = practice_design.type[i];
	var direction = practice_design.direction[i];
	practice = practice.concat(create_trial(difficulty,type,direction,1));
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
		var direction = initial_full_design.direction[i];
		var trial = create_trial(difficulty,type,direction,0);
		experiment_timeline = experiment_timeline.concat(trial);
	}
	//experiment_timeline.push(interblock_rest);
}

experiment_timeline.push(cursor_on);

//experiment_timeline.push(sam_trial01);
//experiment_timeline.push(sam_trial02);
//experiment_timeline.push(sam_trial03);

experiment_timeline.push(post_task_block)

experiment_timeline.push(no_fullscreen);

if (pav) {
	
	experiment_timeline.push(pavlovia_finish);
};

//experiment_timeline.push(pause);

//experiment_timeline.push(end_block)
