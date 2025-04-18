$(document).ready(function() {
    // Buscar transacción en la lista
    $("#search").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#transactionList li").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Filtrar por fecha y monto
    $("#applyFilters").on("click", function() {
        var minAmount = $("#minAmount").val();
        var maxAmount = $("#maxAmount").val();
        var dateFilter = $("#dateFilter").val();

        $("#transactionList li").filter(function() {
            var amount = $(this).data("amount");
            var date = $(this).data("date");

            var matchAmount = (!minAmount || amount >= minAmount) && (!maxAmount || amount <= maxAmount);
            var matchDate = !dateFilter || date === dateFilter;

            $(this).toggle(matchAmount && matchDate);
        });
    });

    // Gráfico con Chart.js
    var ctx = document.getElementById("chart").getContext("2d");
    var chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
            datasets: [{
                label: "Transacciones",
                data: [10, 20, 15, 25, 30],
                backgroundColor: "rgba(20, 249, 166, 0.7)"
            }]
        }
    });

    // Cambiar datos del gráfico según el filtro de tiempo
    $(".time-filter").on("click", function() {
        var range = $(this).data("range");

        if (range === "week") {
            chart.data.labels = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
            chart.data.datasets[0].data = [5, 10, 7, 12, 9];
        } else if (range === "month") {
            chart.data.labels = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
            chart.data.datasets[0].data = [20, 30, 25, 35];
        } else if (range === "year") {
            chart.data.labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo"];
            chart.data.datasets[0].data = [100, 120, 150, 180, 200];
        }

        chart.update();
    });
});
