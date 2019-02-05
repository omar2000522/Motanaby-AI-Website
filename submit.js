const form = document.querySelector("form");


form.addEventListener('submit', (event) => {
    event.preventDefault();
    const loading =  document.querySelector(".loading");
    const formData = new FormData(form);
    const inputText = formData.get('gen-input');
    var isValid = validInput(inputText);
    var len;

    if (document.getElementById("short").checked) len = 100;
    if (document.getElementById("normal").checked) len = 200;
    if (document.getElementById("long").checked) len = 500;


    if (!isValid) {
        document.getElementById("gen-input").style.borderColor = "red";
        alert("Please make sure that the input starting line is written in Arabic characters only.\n Also make sure that the input's length is more than 30 characters.\n\n The allowed characters are:\n spaces, new lines and ['ء', 'آ', 'أ', 'ؤ', 'إ', 'ئ', 'ا', 'ب', 'ة', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ى', 'ي']")
    }
    if (isValid && len) {
        form.style.display = "none";
        loading.style.display = "block";
        generate(inputText, len)
    }
});