fetch('data/airports.json')
    .then(response => response.json())
    .then(data => {

        // SORT DATA
        data.sort((a, b) => {

            // AIRPORT SORT
            if (a.airport < b.airport) return -1;
            if (a.airport > b.airport) return 1;

            // FREQUENCY SORT
            if (a.frequency < b.frequency) return -1;
            if (a.frequency > b.frequency) return 1;

            return 0;
        });

        // BUILD TABLE
        data.forEach(row => {

            // FORMAT FREQUENCY TO 3 DECIMALS

            let formattedFrequency = row.frequency;

            if (!isNaN(row.frequency)) {

                formattedFrequency =
                    parseFloat(row.frequency).toFixed(3);

            }

            $('#airportTable tbody').append(`

            <tr data-airport="${row.airport}">

                <!-- HIDDEN SEARCH COLUMNS -->
                <td>${row.airport}</td>
                <td>${row.code}</td>
                <td>${row.province}</td>

                <!-- DISPLAY COLUMN -->
                <td class="airport-display">

                    <div class="airport-title">

                        <span class="airport-name">
                            ${row.airport}
                        </span>

                        <span class="airport-code">
                            (${row.code})
                        </span>

                        <span class="airport-province">
                            — ${row.province}
                        </span>

                    </div>

                    <div class="airport-row-data">

                        <div class="col-comm airport-description">
                            ${row.comm}
                        </div>

                        <div class="col-transmitter">
                            ${row.transmitter}
                        </div>

                        <div class="col-timings">
                            ${row.timings || ''}
                        </div>

                        <div class="col-frequency airport-frequency">
                            ${formattedFrequency}
                        </div>

                    </div>

                </td>

            </tr>

        `);

        });

        // INITIALIZE DATATABLE
        $('#airportTable').DataTable({

            pageLength: 50,

            scrollY: '700px',
            scrollCollapse: true,

            paging: true,

            lengthMenu: [
                [10, 50, 100, -1],
                [10, 50, 100, "All"]
            ],

            order: [[0, 'asc']],

            // HIDE SEARCH COLUMNS
            columnDefs: [
                {
                    targets: [0, 1, 2],
                    visible: false
                }
            ],

            language: {
                search: "Search Airports:"
            },

            // FIX TITLE DISPLAY
            drawCallback: function () {

                let lastAirport = "";

                $('#airportTable tbody tr').each(function () {

                    const row = $(this);

                    // GET AIRPORT FROM DATA ATTRIBUTE
                    const airport = row.attr('data-airport');

                    const title = row.find('.airport-title');

                    // SHOW FIRST INSTANCE
                    if (airport !== lastAirport) {

                        title.show();

                        lastAirport = airport;

                    }

                    // HIDE REPEATED INSTANCE
                    else {

                        title.hide();

                    }

                });

            }

        });

    });