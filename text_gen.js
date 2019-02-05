const characters = ['\n', ' ', 'ء', 'آ', 'أ', 'ؤ', 'إ', 'ئ', 'ا', 'ب', 'ة', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ى', 'ي'];
const chars_to_n = {'\n': 0, ' ': 1, 'ء': 2, 'آ': 3, 'أ': 4, 'ؤ': 5, 'إ': 6, 'ئ': 7, 'ا': 8, 'ب': 9, 'ة': 10, 'ت': 11, 'ث': 12, 'ج': 13, 'ح': 14, 'خ': 15, 'د': 16, 'ذ': 17, 'ر': 18, 'ز': 19, 'س': 20, 'ش': 21, 'ص': 22, 'ض': 23, 'ط': 24, 'ظ': 25, 'ع': 26, 'غ': 27, 'ف': 28, 'ق': 29, 'ك': 30, 'ل': 31, 'م': 32, 'ن': 33, 'ه': 34, 'و': 35, 'ى': 36, 'ي': 37};
const n_to_chars = {0: '\n', 1: ' ', 2: 'ء', 3: 'آ', 4: 'أ', 5: 'ؤ', 6: 'إ', 7: 'ئ', 8: 'ا', 9: 'ب', 10: 'ة', 11: 'ت', 12: 'ث', 13: 'ج', 14: 'ح', 15: 'خ', 16: 'د', 17: 'ذ', 18: 'ر', 19: 'ز', 20: 'س', 21: 'ش', 22: 'ص', 23: 'ض', 24: 'ط', 25: 'ظ', 26: 'ع', 27: 'غ', 28: 'ف', 29: 'ق', 30: 'ك', 31: 'ل', 32: 'م', 33: 'ن', 34: 'ه', 35: 'و', 36: 'ى', 37: 'ي'};


function textToInput(inputText, charToN) {
    inputNums = [];

    for(var i=0; i<30; i++){
        inputNums.push(charToN[inputText.charAt(i)]);
    }
    return inputNums
}

function numsToModelInput(inputNotScaled, len) {
    inputNums = [];
    for(var i=0; i<30; i++){
        inputNums.push(inputNotScaled[i] / len);
    }
    return inputNums
}

function numToChars(nums, ntochars) {
    var outputText = "";
    for(var i=0; i<nums.length; i++){
        outputText += ntochars[nums[i]];
    }
    //console.log(outputText);
    return outputText;
    
}



// var output = [];
// var inputText = "لها\nلتشغل أروى عن هواها شغولها";
// var X = textToInput(inputText, chars_to_n);
 


async function generate(txt, numOfChars) {
    var pred;
    var output = [];
    var inputText = txt;
    var X = textToInput(inputText, chars_to_n);
    const model = await tf.loadModel('tfjsModel/model.json');

    
    for(var i=0; i<numOfChars; i++){
        
        inputs = numsToModelInput(X, characters.length);
        inputs = tf.tensor(inputs, [1,30,1]); 
        pred = model.predict(inputs).argMax(1);
        X.push(pred.get(0));
        output.push(pred.get(0));
        X.shift();
        inputs.dispose();
        pred.dispose();
    }
    var textOutput = numToChars(output, n_to_chars);
    result(textOutput);
}

