const datosMeteorologicos = [];

function agregarDatosMeteorologicos() {
    const temperatura = parseFloat(document.getElementById("temperatura").value);
    const fecha = document.getElementById("fecha").value;
    datosMeteorologicos.push({ temperatura, fecha });
    document.getElementById("temperatura").value = "";
    actualizarInformeMeteorologico();
}

function seleccionarSemana() {
    const diasDeLaSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const inputsMeteorologicos = document.getElementById("datos-meteorologicos");
    inputsMeteorologicos.innerHTML = "";

    for (let i = 0; i < 7; i++) {
        const div = document.createElement("div");
        const label = document.createElement("label");
        label.textContent = diasDeLaSemana[i];
        const input = document.createElement("input");
        input.type = "number";
        input.min = -50;
        input.max = 50;
        input.step = 0.1;
        input.required = true;
        input.placeholder = `°C`;
        div.appendChild(label);
        div.appendChild(input);
        inputsMeteorologicos.appendChild(div);
    }
}

function calcularEstadisticas() {
    const inputsTemperatura = document.querySelectorAll("#datos-meteorologicos input");
    const temperaturas = [];
    let todosCamposLlenos = true;
    let alertaMostrada = false;
    const semanaSelector = document.getElementById("semana-selector");
    const valorSemana = semanaSelector.value;

    if (valorSemana === "") {
        alert("Por favor, selecciona una semana antes de calcular estadísticas.");
        return;
    }

    
    inputsTemperatura.forEach(input => {
        if (input.value === "") {
            todosCamposLlenos = false;
            return;
        }
        if (input.value > 50 || input.value < -50) {
            if (!alertaMostrada) {
                alert("Ingresa temperaturas válidas entre -50°C y 50°C.");
                alertaMostrada = true;
            }
            todosCamposLlenos = false;
            return;
        }
        temperaturas.push(parseFloat(input.value));
    });

    if (!alertaMostrada && !todosCamposLlenos) {
        alert("Por favor, ingresa todos los datos requeridos");
        return;
    }

    if (todosCamposLlenos) {
        const promedio = calcularPromedio(temperaturas);
        const maxima = Math.max(...temperaturas);
        const minima = Math.min(...temperaturas);
        document.getElementById("temperatura-promedio").textContent = promedio.toFixed(2);
        document.getElementById("temperatura-maxima").textContent = maxima.toFixed(2);
        document.getElementById("temperatura-minima").textContent = minima.toFixed(2);
        document.getElementById("contenedor-grafico").style.display = "block";
        document.getElementById("informe-meteorologico").style.display = "block";
        actualizarGraficoMeteorologico(temperaturas);
    }
}


function calcularPromedio(data) {
    const suma = data.reduce((acumulador, valor) => acumulador + valor, 0);
    return suma / data.length;
}

function actualizarGraficoMeteorologico(temperaturas) {
    const ctx = document.getElementById("grafico-meteorologico").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
            datasets: [{
                label: "Temperatura (°C)",
                data: temperaturas,
                borderColor: "blue",
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                },
            },
        },
    });
}

function exportarAPDF() {
    const temperaturaPromedio = document.getElementById("temperatura-promedio").textContent;
    const temperaturaMaxima = document.getElementById("temperatura-maxima").textContent;
    const temperaturaMinima = document.getElementById("temperatura-minima").textContent;

    html2canvas(document.getElementById("contenedor-grafico")).then(function(canvas) {
        const graficoComoImagen = canvas.toDataURL("image/png");
        const documentoPDF = {
            content: [
                { text: "Informe Meteorológico", style: "header" },
                { text: `Promedio: ${temperaturaPromedio}°C` },
                { text: `Máxima: ${temperaturaMaxima}°C` },
                { text: `Mínima: ${temperaturaMinima}°C` },
                { image: graficoComoImagen, width: 400 } 
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                }
            }
        };
        pdfMake.createPdf(documentoPDF).download("Informe_Meteorologico.pdf");
    });
}




