// Adapted from:
// http://thecodeplayer.com/walkthrough/javascript-css3-calculator

function evalcalc (input, inputVal, operators) {
    var equation = inputVal;
    var lastChar = equation[equation.length-1];
    
    equation = equation.replace(/x/g, '*').replace(/÷/g, '/');
    
    if (operators.indexOf(lastChar) > -1 || lastChar == '.') equation = equation.replace(/.$/, '');
    
    if (equation) input.val(eval(equation));
}

$(document).ready(function () { // Get all the keys from document
    var keys = document.querySelectorAll('#calculator span');
    var operators = ['+', '-', 'x', '÷'];
    var decimalAdded = false;
    var input = $('.screen');

    // Add onclick event to all the keys and perform operations
    for (var i = 0; i < keys.length; i++) {
        keys[i].onclick = function (e) {
            // Get the input and button values
            var inputVal = input.val();
            var btnVal = this.innerHTML;

            // Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
            // If clear key is pressed, erase everything
            if (btnVal == 'C') {
                input.val('');
                decimalAdded = false;
            }

            // If eval key is pressed, calculate and display the result
            else if (btnVal == '=') {
                evalcalc(input, inputVal, operators);
                decimalAdded = false;
            }
            
            // indexOf works only in IE9+
            else if (operators.indexOf(btnVal) > -1) {
                // Operator is clicked
                // Get the last character from the equation
                var lastChar = inputVal[inputVal.length - 1];

                // Only add operator if input is not empty and there is no operator at the last
                if (inputVal != '' && operators.indexOf(lastChar) == -1) input.val(input.val() + btnVal);

                // Allow minus if the string is empty
                else if (inputVal == '' && btnVal == '-') input.val(input.val() + btnVal);

                // Replace the last operator (if exists) with the newly pressed operator
                if (operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
                    // Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
                    input.val(inputVal.replace(/.$/, btnVal));
                }

                decimalAdded = false;
            }

            else if (btnVal == '.') {
                if (!decimalAdded) {
                    input.val(input.val() + btnVal);
                    decimalAdded = true;
                }
            }

            // if any other key is pressed, just append it
            else {
                input.val(input.val() + btnVal);
            }

            // prevent page jumps
            e.preventDefault();
        }
    }
    
    $('.screen').keypress(function (e) {
          if (e.which == 13) {
              evalcalc(input, input.val(), operators);
              e.preventDefault();
              return false
          }
    });
});