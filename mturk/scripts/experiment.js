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
	 
	 present : [
	 	{num_seq: "5, 15, 20, ", rule: "add the last two numbers", answer: "35"},
		{num_seq: "1, 2, 4, ", rule: "double the last number", answer: "8"},
		{num_seq: "2, 6, 14, ", rule: "double the last number and add 2", answer: "30"},
		{num_seq: "20, 30, 50, ", rule: "add the last two numbers", answer: "80"},
		{num_seq: "1, 4, 13, 40, ", rule: "triple the last number and add 1", answer: "121"}
	 ],
	 
	 present_handle: function(stim) {
         $("#submit").show();
		 $("#continue").hide();
		 
		 this.stim = stim;
		 
		 $(".numseq").html(stim.num_seq);
         exp.trialT = Date.now();
		 // todo: erase current form value?
	 },
	 
	 button : function() {
		 if ($("#ans").val() == null || $("#ans").val() == "") {
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
        present: [
            {num_seq: "1, 2, 3, "},
            {num_seq: "3, 6, 9, "},
            {num_seq: "5, 10, 15, "},
            {num_seq: "2, 4, 6, "}
        ],
        
        present_handle: function(stim) {
            console.log("Ready!");
            this.stim = stim;
            $(".numseq").html(stim.num_seq);
            exp.trialT = Date.now();
        },
        
        nextTrial: function () {
          exp.RT = Date.now() - exp.trialT;
          this.log_responses();
          $("#testans").val("");
            $("#rule").val("");
          _stream.apply(this);
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
    
    exp.condition = (["mock-up"]); // in real experiment, store generating rule here
    exp.system = {
        Browser : BrowserDetect.browser,
        OS : BrowserDetect.OS,
        screenH: screen.height,
        screenUH: exp.height,
        screenW: screen.width,
        screenUW: exp.width
    };
    //blocks of the experiment:
    exp.structure=["i0", "sequence", "test_instruct", "testseq", "thanks"]; // add test section
  
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