/* Helper functions */

function randint(maxn) {
    return Math.floor((Math.random() * maxn) + 1);
}

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;

        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

/* Generate number sequences */
function xkc() {
    var seq = [randint(10)]; // seed
    var k = (randint(10)-1)*Math.round(Math.random())+1; // coefficient
    var c = randint(10); // intercept
    
    // Add to sequence using rule
    for (var i = 1; i < 7; i++) {
        seq[i] = Math.max(k,1)*seq[i-1]+c;
    }
    
    // Return sequence object
    return {num_seq: seq.slice(0, -1).join(", ")+", ",
            answer: seq.slice(-1).toString(),
            rule: ((k == 1)? "Add " + c + " to each number":
                    "Multiply by " + k + " and add " + c),
            ruletype: "xkc"};
}

function sumtwo() {
    var seq = [randint(20), randint(20)]; // Seed
    seq.sort(function(a, b){return a-b});
    
    for (var i = 2; i < 7; i++) {
        seq[i] = seq[i-2] + seq[i-1]; // Apply sum-two rule
    }
    
    // Return sequence object
    return {num_seq: seq.slice(0, -1).join(", ")+", ",
            answer: seq.slice(-1).toString(),
            rule: "Sum the last two numbers",
            ruletype: "sumtwo"};
}

/* Assemble sequences */
function makeseqs(condition) {
    
    var seq = [];
    /*
    // Uncomment for longer experiment
    var conds = {"xkc": 11,
                 "sumtwo": 89};
    var numtrials = 100;
    */
    
    var conds = {"xkc": 6,
                 "sumtwo": 44};
    var numtrials = 50;
    
    for (i = 0; i < conds[condition]; i++) {
        seq.push(sumtwo());
    }
    
    while (seq.length < numtrials) {
        var test = xkc();
        if (test.answer < 350) {
            seq.push(test);
        }
    }
    
    seq = shuffle(seq);
    
    return seq

}


function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });
  
  slides.sequence = slide({
	  name: "sequence",
	  
	  /* sequence information for this sequence
	  (right now, I have not implemented condition assignment yet, and
	  the order in which sequences are presented is fixed. both will be changed soon.) */
	 
	 present : makeseqs(exp.condition),
	 
	 present_handle: function(stim) {
         $("#submit").show();
		 $("#continue").hide();
         $("#sequence > .err").html("&nbsp;");
		 
		 this.stim = stim;
		 
		 $(".numseq").html(stim.num_seq);
         exp.trialT = Date.now();
		 // todo: erase current form value?
	 },
	 
	 button : function() {
		 if ($("#ans").val() == null || $("#ans").val() == "") {
             $("#sequence > .err").html("Please complete the sequence before continuing.");
			 return
		 } else {
			 if ($("#ans").val() == this.stim.answer) {
                 $("#ans").addClass("positive");
				 $(".feedback").text("Correct! The rule is: " + this.stim.rule + ".");
                 console.log("Correct!"); // debugging
			 } else {
                 $("#ans").addClass("negative");
				$(".feedback").text("The correct answer is: " + this.stim.answer +
                    ". The rule is: " + this.stim.rule + ".");
                 console.log("Incorrect!"); // debugging
			 }
             $("#sequence > .err").html("&nbsp;");
             $("#submit").hide();
             $("#continue").show();
		 }
	 },
      
      nextTrial: function() {
          exp.RT = Date.now() - exp.trialT;
          this.log_responses();
          $("#ans").val("");
          $("#ans").removeClass("positive negative");
          $(".feedback").html("&nbsp;");
          
          _stream.apply(this);
      },
	 
	 log_responses : function() {
		 exp.data_trials.push({
             "sequence": $(".numseq").html(),
			 "response": $("#ans").val(),
             "answer": this.stim.answer,
             "rule": this.stim.rule,
             "ruletype": this.stim.ruletype,
             "accuracy": $("#ans").val() == this.stim.answer,
             "rt_in_seconds": (Date.now() - exp.trialT)/1000
			 });
			
	 }
  });
    
    slides.test_instruct = slide({
        name: "test_instruct",
        button: function() {
            exp.go();
        }
    });

    slides.testseq = slide({
        name: "testseq",
        present: shuffle([
            {num_seq: "1, 2, 3, "}, // 1
            {num_seq: "3, 6, 9, "}, // 2
            {num_seq: "8, 16, 24, "}, // 3
            {num_seq: "5, 10, 15, "}, // 4 
            {num_seq: "2, 4, 6, "}, // 5
            {num_seq: "6, 12, 18, "}, // 6
            {num_seq: "20, 40, 60, "}, // 7
            {num_seq: "4, 8, 12, "}, // 8
            {num_seq: "32, 64, 96, "}, // 9
            {num_seq: "15, 30, 45, "}, // 10
            {num_seq: "13, 26, 39, "}, // 11
            {num_seq: "9, 18, 27, "}, // 12
            {num_seq: "54, 81, 135, "}, // 13
            {num_seq: "11, 22, 33, "}, // 14
            {num_seq: "48, 96, 144, "}, // 15
            {num_seq: "7, 14, 21, "}, // 16
            {num_seq: "16, 32, 48, "}, // 17
            {num_seq: "6, 9, 15, "}, // 18
            {num_seq: "14, 28, 42, "}, // 19
            {num_seq: "50, 100, 150, "}, // 20
            {num_seq: "12, 24, 36, "} // 21
        ]),
        
        present_handle: function(stim) {
            console.log("Ready!");
            this.stim = stim;
            $("#testseq > .err").html("&nbsp;")
            $(".numseq").html(stim.num_seq);
            exp.trialT = Date.now();
        },
        
        nextTrial: function () {
            if ($("#testans").val() == "" || $("#rule").val() == "") {
                $("#testseq > .err").html("Please complete the sequence and guess the rule before continuing.");
                return
            } else {
                exp.RT = Date.now() - exp.trialT;
                this.log_responses();
                $("#testans").val("");
                $("#rule").val("");
                $("#sequence > .err").html("&nbsp;");
                _stream.apply(this);
            }
        },
        
        log_responses : function() {
            exp.data_trials.push({
                "test_seq": $(".numseq").html(),
                "test_guess": $("#testans").val(),
                "test_rule": $("#rule").val(),
                "test_rt_in_seconds": (Date.now() - exp.trialT)/1000
			 });
        }
    });
    
    slides.survey =  slide({
    name : "survey",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });


  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });
    

  return slides;
}

/// init ///
function init() {
    exp.trials = [];
    exp.accurate = [];
    exp.rt = [];
    
    exp.condition = _.sample(["xkc", "sumtwo"]);
    exp.system = {
        Browser : BrowserDetect.browser,
        OS : BrowserDetect.OS,
        screenH: screen.height,
        screenUH: exp.height,
        screenW: screen.width,
        screenUW: exp.width
    };
    //blocks of the experiment:
    exp.structure=["i0", "sequence", "test_instruct", "testseq", "survey", "thanks"]; // add test section
  
    exp.data_trials = [];
    //make corresponding slides:
    exp.slides = make_slides(exp);

    exp.nQs = utils.get_exp_length();

    $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
    $("#start_button").click(function() {
        window.scrollTo(0, 0);
        if (turk.previewMode) {
        $("#mustaccept").show();
        } else {
            $("#start_button").click(function() {$("#mustaccept").show();});
        exp.go();
    }
    });

  exp.go(); //show first slide
}