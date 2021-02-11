const express = require("express");
const ejs = require("ejs");
const bodyparser = require('body-parser');
const sql = require("mysql");

let app = express();
const urlencodedParser = bodyparser.urlencoded({extended: false});

app.set('view engine', 'ejs');
app.use(express.static('./public'));

const connection = sql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "seenima",
    multipleStatements: true
})

//similar to php nga mysqli_connect("localhost","user"...)

connection.connect((err)=>{
    if(err) throw err;
    console.log("Database connected");
})


global.globeType = 0;
global.globAcc_ID = 0;

//LOGIN, CUSTOMER AND ADMIN PROFILE
app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/logout',(req,res)=>{
    globAcc_ID=0;
    res.redirect('/landingPage');
})

app.post('/login',urlencodedParser,(req,res)=>{
    let logData = req.body;
    
    console.log(logData);
    connection.query('SELECT * FROM account WHERE username=? AND password=?',[logData.username,logData.password],(err,result)=>{
        
        global.globAcc_ID = result[0].acc_ID;
        
        console.log(globAcc_ID);

        if(result[0].type == 1){
            res.redirect('/custDash');
        }else if(result[0].type == 0){
            res.redirect('/adminDash');
        }

    })

});

//......:::::FOR ADMIN:::::.....

app.get('/adminDash', (req,res)=>{
    if(globAcc_ID != 0 && globAcc_ID != undefined){
            connection.query('SELECT * FROM events;SELECT * FROM requestforcollab WHERE isReplied = 0;',(err, response) => {
                let eventsNato = response[0];
                let collabsNato = response[1];
                console.log(eventsNato);
                console.log("Now for collabs");
                console.log(collabsNato);
            res.render('AdminDashboard', {events: eventsNato,collabs : collabsNato});
        });
    }else{
        res.redirect('/login');
    }
})

//CRUD for Eventsccrs

//Read Events
app.get('/adminEvent', (req,res)=>{
    connection.query('SELECT * FROM events;',(err, response) => {
        res.render('AdminEvents', {rows: response});
    });
})

//Create Events
app.post('/adminEvent',urlencodedParser, (req,res)=>{
    let data = req.body;
    console.log(data);
    connection.query("INSERT INTO events(eventName,descript,eventPrice,eventVenue,eventDateTime,num_Tickets) VALUES('"+data.eventName+"','"+data.descript+"','"+data.eventPrice+"','"+data.eventVenue+"','"+data.eventDateTime+"','"+data.num_Tickets+"')", (err)=>{
        if (err) throw err;
        res.redirect("/adminEvent");
    })
})

//Delete Events
app.get("/deleteEvent/:row_id", (req, res) => {
    let row_id = req.params.row_id;
    connection.query("DELETE FROM `events` WHERE event_ID="+row_id);
    res.redirect("/adminEvent");
});

//Reading the edit form
app.get("/editEvent/:row_id", (req, res) => {
    let row_id = req.params.row_id;
    connection.query('SELECT * FROM events WHERE event_ID='+row_id,(err, response) => {
        console.log(response);
        res.render('editEvents', {rows: response});
    });
});

//Update the Event
app.post('/editEvent',urlencodedParser, (req,res)=>{
    let datos = req.body;
    console.log(datos);
    let que = 'UPDATE events SET eventName = ?,descript = ?,eventPrice = ?,eventVenue = ?,eventDateTime = ?,num_Tickets = ? WHERE event_ID =?';
    connection.query(que,[datos.eventName,datos.descript,datos.eventPrice,datos.eventVenue,datos.eventDateTime,datos.num_Tickets,datos.event_ID], (err,response)=>{
        if (err) throw err;
        res.redirect("/adminEvent");
    })
})

//END of CRUD for events

app.get('/adminCollab', (req,res)=>{
    connection.query('SELECT * FROM requestforcollab WHERE isReplied = 0',(err, response) => {
        console.log(response);
        res.render('AdminCollab', {collabs : response});
    });
})

app.get('/deleteCollab/:row_id', (req,res)=>{
    let row_id = req.params.row_id;
    connection.query("UPDATE `requestforcollab` SET isReplied = '1' WHERE ID ="+row_id, (err,response)=>{
        if (err) throw err;
        res.redirect("/adminCollab");
    })
})


app.get('/adminProfile', (req,res)=>{
    
    if(globAcc_ID != 0 && globAcc_ID != undefined){
        connection.query("SELECT * FROM account WHERE acc_ID="+globAcc_ID, (err,result)=>{
            res.render('AdminUser',{account:result});
        });
    }else{
        res.redirect('/login');
    }
});

app.post('/adminProfile',urlencodedParser,(req,res)=>{
    let data =  req.body;

    connection.query('UPDATE account SET username=?, password=? WHERE acc_ID=?',[data.username,data.password,data.acc_ID],(err,result)=>{
        if(err)throw err;
        res.redirect('/adminProfile');
    });
});

//....::::::FOR CUSTOMER:::::.......
app.get('/custDash', (req,res)=>{
  if(globAcc_ID != 0 && globAcc_ID != undefined){
        connection.query("SELECT * FROM events LIMIT 7;SELECT * FROM events INNER JOIN tickets ON events.event_ID =  tickets.event_ID WHERE acc_ID = '"+globAcc_ID+"' AND  isPurchased ='1'  LIMIT 4;SELECT * FROM events INNER JOIN tickets ON events.event_ID =  tickets.event_ID WHERE acc_ID = '"+globAcc_ID+"' AND  isPurchased ='0'  LIMIT 4",(err,result)=>{
            let event = result[0];
            let purchase = result[1];
            let cart = result[2];
            res.render('CustomerDashboard',{event: event,purchase: purchase,cart: cart});
        });
    }else{
        res.redirect('/login');
    }
 
});


//delete tickets from the Dashboard Cart
app.get('/deleteTicket/:ticket_ID',(req,res)=>{
    let ticket_ID = req.params.ticket_ID;
    console.log(ticket_ID);
    connection.query('DELETE FROM tickets WHERE ticket_ID='+ticket_ID);
    res.redirect('/custDash');
});

//adding a ticket to either purchased or cart
app.get('/addTicket/:ticket_ID',(req,res)=>{
    if(globAcc_ID != 0 && globAcc_ID != undefined){
            let ticket_ID = req.params.ticket_ID;
             connection.query('SELECT * FROM events WHERE event_ID='+ticket_ID,(err,result)=>{
                let event = result;
                res.render('addTicket',{event: event});
            })
    }else{
        res.redirect('/login');
    }
})

app.post('/addTicket',urlencodedParser, (req,res)=>{
    let datosTicket = req.body;
    console.log(datosTicket);
    if(datosTicket.isPurchased === '1'){
        connection.query("INSERT INTO tickets (event_ID,acc_ID,qty,isPurchased) VALUES('"+datosTicket.event_ID+"','"+globAcc_ID+"','"+datosTicket.qty+"','"+datosTicket.isPurchased+"'); UPDATE `events` SET tickets_Sold = '"+datosTicket.tickets_Sold+"',total_Sales='"+datosTicket.total_Sales+"' WHERE event_ID ="+datosTicket.event_ID, (err,response)=>{
            if (err) throw err;
            console.log("Yay na purchase");
            res.redirect('/custPurchase');
        })
    }else{
        connection.query("INSERT INTO tickets (event_ID,acc_ID,qty,isPurchased) VALUES('"+datosTicket.event_ID+"','"+globAcc_ID+"','"+datosTicket.qty+"','"+datosTicket.isPurchased+"')", (err,response)=>{
            if (err) throw err;
            console.log("yay na cart");
            res.redirect('/custCart');
        })
    }
    
  
})



app.get('/editTicket/:ticket_ID&:event_ID',(req,res)=>{
    let ticket_ID = req.params.ticket_ID;
    let event_ID = req.params.event_ID;

    connection.query("SELECT * FROM tickets WHERE ticket_ID="+ticket_ID+"; SELECT * FROM events WHERE event_ID="+event_ID,(err,result)=>{
        let ticket = result[0];
        let event = result[1];
        console.log(ticket);
        console.log(event);
        res.render('editTicket',{ticket:ticket,event:event});

    });
});


app.post('/editTicket',urlencodedParser,(req,res)=>{
    let datosTicket = req.body;
    if(datosTicket.isPurchased === '1'){
            connection.query("UPDATE `tickets` SET qty = '"+datosTicket.qty+"',isPurchased='"+datosTicket.isPurchased+"' WHERE ticket_ID ="+datosTicket.ticket_ID+" ;UPDATE `events` SET tickets_Sold = '"+datosTicket.tickets_Sold+"',total_Sales='"+datosTicket.total_Sales+"' WHERE event_ID ="+datosTicket.event_ID,(err,response)=>{
                if (err) throw err;
                console.log("Yay na purchase");
                res.redirect('/custPurchase');
            })
    }else{
        connection.query("UPDATE `tickets` SET qty = '"+datosTicket.qty+"' WHERE ticket_ID ="+datosTicket.ticket_ID,(err,response)=>{
            if (err) throw err;
            console.log("Yay na cart");
            res.redirect('/custCart');
        })
    }
    
})


app.get('/custEvent', (req,res)=>{
    connection.query('SELECT * FROM events',(err,result)=>{
        res.render('CustomerOfferedEvent',{event:result});
    });
    
})


app.get('/custPurchase', (req,res)=>{
    let acc_ID = req.params.acc_ID;

    if(globAcc_ID != 0 && globAcc_ID != undefined){
        connection.query("SELECT * FROM events INNER JOIN tickets ON events.event_ID =  tickets.event_ID WHERE acc_ID = '"+globAcc_ID+"' AND  isPurchased ='1'",(err,result)=>{
            let purchase = result;
             res.render('CustomerPurchase',{purchase: purchase});
         })
    }else{
        res.redirect('/login');
    }
})



app.get('/custCart', (req,res)=>{
    let acc_ID = req.params.acc_ID;

    if(globAcc_ID != 0 && globAcc_ID != undefined){
        connection.query("SELECT * FROM events INNER JOIN tickets ON events.event_ID =  tickets.event_ID WHERE acc_ID = '"+globAcc_ID+"' AND  isPurchased ='0'",(err,result)=>{
             res.render('CustomerCart',{cart: result});
        })
    }else{
        res.redirect('/login');
    }
})

//update quantity of tickets
app.post('editTicket',urlencodedParser, (req,res)=>{
    let data = req.body;
    connection.query('UPDATE tickets SET qty =? FROM tickets WHERE tickets_ID=?',[data.qty,data.ticket_ID],(err,result)=>{
        res.redirect('/custCart')
    });
});

//delete tickets from the Cart
app.get('/deleteCart/:ticket_ID',(req,res)=>{
    let ticket_ID = req.params.ticket_ID;
    console.log(ticket_ID);
    connection.query('DELETE FROM tickets WHERE ticket_ID='+ticket_ID);
    res.redirect('/custCart');
});

app.get('/custProfile', (req,res)=>{
    if(globAcc_ID != 0 && globAcc_ID != undefined){
        connection.query("SELECT * FROM account WHERE acc_ID="+globAcc_ID, (err,result)=>{
            console.log("Showing account");
            console.log(result);
             res.render('CustomerUser',{account:result});
         });
    }else{
        res.redirect('/login');
    }
});

app.post('/custProfile',urlencodedParser,(req,res)=>{
    let data = req.body;

    connection.query('UPDATE account SET username=?, password=? WHERE acc_ID=?',[data.username,data.password,data.acc_ID],(err,result)=>{
        if (err) throw err;
        res.redirect('/custProfile');
    });
});

//.....::::FOR ALL::::....
app.get('/notif', (req,res)=>{
    res.render('notif')
})

app.get('/landingPage', (req,res)=>{
    res.render('landingPage');
})

//Create and Delete For Collabs
app.post('/landingPage',urlencodedParser,(req,res)=>{
    let content = req.body;
    console.log(content);

    connection.query("INSERT INTO requestforcollab(email,fullName,message) VALUES('"+content.email+"','"+content.fullName+"','"+content.message+"')", (err)=>{
        if (err) throw err;
        res.redirect("/landingPage");
    })
})






app.listen(3000);