getAccount().then(account => {
    
    $.get('/api/list-waitting-approve', {account: account}, function(res){
        if(res.status == 200){
            var body = "";
            $.each(res.medicines, function(i, v){
                body += "<tr>" +
                            "<td>"+ v[1] +"</td>" + // id
                            "<td>"+ v[2] +"</td>" + // name
                            "<td>"+ v[3] +"</td>" + // ingredient
                            "<td>"+ v[4] +"</td>" + // benefit
                            "<td>"+ v[5] +"</td>" + // product by
                            "<td>"+ v[6] +"</td>" + // price
                            "<td>"+ v[7] +"</td>" + // valid
                            "<td><button type='button' id='accept-approve' class='btn btn-success'>Accept</button></td>" + // valid
                
                        "</tr>";
                $("#wattingApprove").html(body);
            })
            
        }
    })

    $.get('/api/list-approved', {account: account}, function(res){
        console.log('res: ', res);
        if(res.status == 200){
            var body = "";
            // $.each(res.medicines, function(i, v){
            //     body += "<tr>" +
            //                 "<td>"+ v[1] +"</td>" + // id
            //                 "<td>"+ v[2] +"</td>" + // name
            //                 "<td>"+ v[3] +"</td>" + // ingredient
            //                 "<td>"+ v[4] +"</td>" + // benefit
            //                 "<td>"+ v[5] +"</td>" + // product by
            //                 "<td>"+ v[6] +"</td>" + // price
            //                 "<td>"+ v[7] +"</td>" + // valid
            //                 "<td><button type='button' id='accept-approve' class='btn btn-success'>Accept</button></td>" + // valid
                
            //             "</tr>";
            //     $("#wattingApprove").html(body);
            // })
            
        }
    })

    
})

