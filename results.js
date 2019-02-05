function result(output) {
    const label = document.getElementById("output-lab");
    const resultField = document.getElementById("output")
    const loading = document.getElementById("loading")

    output = output.replace(/(\n)/g,"<br/>");

    loading.style.display = "none";
    resultField.style.display = "block";
    label.innerHTML = output;
}