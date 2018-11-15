function showProvider(data) {
    $('#provider-name').text(data[2])
    $('#provider-address').text(data[3])
    $('#provider-phone').text(data[4])
}

function getInfoMedicine() {

    var type = $('#inputState').val(),
        keyword = $('#keyword').val();
    console.log('keyword: ', keyword);
    console.log('type: ', type);

    if (type == 'medicine') {

        $.post('/api/get-medicine', {
            keyword: keyword
        }, function (res) {
            console.log(res);
            if (res.status == 200) {
                $('#medicine-name').text(res.medicine[2])
                $('#ingredient').text(res.medicine[3])
                $('#benefit').text(res.medicine[4])
                $('#product').text(res.medicine[5])
                $('#price').text(res.medicine[6])
                $('#status').text(res.medicine[7])
                $('#provider-name1').text(res.provider[2])
                $('#provider-address1').text(res.provider[3])
                $('#provider-phone1').text(res.provider[4])
                $('#infoMedicine').show();
                $('#infoProvider').hide();
            }
        })
        // $('#infoMedicine').show();
    } else { // provider
        $.post('/api/get-provider', {
            keyword: keyword
        }, function (res) {
            console.log(res);
            console.log(res.provider[1]);
            if (res.status == 200) {
                showProvider(res.provider);
                $('#infoMedicine').hide();
                $('#infoProvider').show();
            }

        })
    }

}