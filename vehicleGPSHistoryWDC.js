(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "ECUSerialNumber",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "NumberPlate",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "VINnumber",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Latitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "Longitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "Altitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "TripId",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "KL15State",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "GPSSpeed",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "Date",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "Odometer",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "FuelLevel1",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "FuelLevel2",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "AdBlueLevel",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "Driver1",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Driver2",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "vehicleGPSHistory",
            alias: "Vehicle GPS History Data",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {
        vvar apiKey = 'D3C836A16D0AD04F0AB7A8EEF4A5CE701B5A1A8D';
        var secretKey = '7614CE3E15DA69AC805D71E63A9BB92491FC8B7F';
        var dateRequest = new Date().toISOString();
        var cif = 'B28861359';
        var numberPlate = '4184';
        var startDate = '2024-05-23T09:34:56.789Z';
        var endDate = '2024-05-27T09:34:56.789Z';

        var url = 'https://swjttodfapi021.jaltest.com/JaltestTelematicsAPI/json/vehicleGPSHistory';
        var queryString = `?CIF=${cif}&numberPlate=${numberPlate}&startDate=${startDate}&endDate=${endDate}`;

        var stringToSign = 'GET\n' + url + '\n' + queryString + '\n' + '\n' + dateRequest;
        var signature = CryptoJS.HmacSHA1(stringToSign, secretKey).toString(CryptoJS.enc.Hex);
        var authorizationHeader = `CWS ${apiKey}:${signature}`;

        $.ajax({
            url: url + queryString,
            type: 'GET',
            headers: {
                'DateRequest': dateRequest,
                'Authorization': authorizationHeader,
                'Accept': 'application/json'
            },
            success: function (resp) {
                var tableData = resp.Result.map(item => ({
                    "ECUSerialNumber": item.ECUSerialNumber,
                    "NumberPlate": item.NumberPlate,
                    "VINnumber": item.VINnumber,
                    "Latitude": item.Latitude,
                    "Longitude": item.Longitude,
                    "Altitude": item.Altitude,
                    "TripId": item.TripId,
                    "KL15State": item.KL15State,
                    "GPSSpeed": item.GPSSpeed,
                    "Date": item.Date,
                    "Odometer": item.Odometer,
                    "FuelLevel1": item.FuelLevel1,
                    "FuelLevel2": item.FuelLevel2,
                    "AdBlueLevel": item.AdBlueLevel,
                    "Driver1": item.Driver1,
                    "Driver2": item.Driver2
                }));

                table.appendRows(tableData);
                doneCallback();
            },
            error: function (xhr, status, error) {
                tableau.log("Error: " + xhr.responseText);
                doneCallback();
            }
        });
    };

    tableau.registerConnector(myConnector);
})();

$(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "Vehicle GPS History";
        tableau.submit();
    });
});
