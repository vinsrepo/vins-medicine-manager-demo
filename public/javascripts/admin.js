function showProvider(data) {
    $('#provider-name').text(data[2])
    $('#provider-address').text(data[3])
    $('#provider-phone').text(data[4])

}

function getInfoProvider() {
    getAccount().then(account => {
        console.log('account: ', account);

        $.post('/api/providerByAccount', {
            account: account
        }, function (res) {
            if (res.status == 200) {
                showProvider(res.provider);
            }

        })

        $.get('/api/list-medicines', {
            address: account
        }, function (res) {
            if (res.status == 200) {
                var body = "";
                $.each(res.medicines, function (i, v) {
                    body += "<tr>" +
                        "<td>" + v[1] + "</td>" + // id
                        "<td>" + v[2] + "</td>" + // name
                        "<td>" + v[3] + "</td>" + // ingredient
                        "<td>" + v[4] + "</td>" + // benefit
                        "<td>" + v[5] + "</td>" + // product by
                        "<td>" + v[6] + "</td>" + // price
                        "<td>" + v[7] + "</td>" + // valid
                        // "<td>"+ v[7] +"</td>" + // valid

                        "</tr>";
                    $("#tbodyProduct").html(body);
                    $("#tableProduct").DataTable().reload();
                })

            }

        })

        $.get('/api/list-licenses', {
            address: account
        }, function (res) {
            if (res.status == 200) {
                var body = "";
                $.each(res.listLicenses, function (i, v) {
                    body += "<tr>" +
                        "<td>" + v[0] + "</td>" + // id
                        "<td>" + v[1] + "</td>" + // name
                        "<td>" + v[3] + "</td>" + // provider
                        "<td>" + moment(parseInt(v[2]) * 1000).format('YYYY/MM/DD, h:mm:ss a') + "</td>" + // time
                        "<td>" + v[4] + "</td>" + // valid


                        "</tr>";
                    $("#tbodyLicenses").html(body);
                    $("#tableLicenses").DataTable().reload();
                })

            }

        })



    })
}

getInfoProvider();