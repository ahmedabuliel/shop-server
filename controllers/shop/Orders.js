const conn= require('../../DB');
var shortid = require('shortid');
const tax=0.17;
const totalPrice=(orderItems)=>{
    return orderItems.reduce((currentValue, nextValue) => {
        return currentValue + nextValue.amount * finalPrice(nextValue)*(1+tax);
      }, 0);
}
const totalTax=(orderItems)=>{
    return orderItems.reduce((currentValue, nextValue) => {
        return currentValue + nextValue.amount * finalPrice(nextValue)*tax;
      }, 0);
}

const finalPrice=item=>{
    let price=item.product[0].Price;
    item.selectedVari && item.selectedVari.forEach((i,index)=>{
        if(i.item.price)
        price =i.item.price
    })
    return price
 }
 
exports.getCheckOut = (req,res) => {
    const id = req.auth.id;
    let sql=`SELECT Items FROM cart WHERE userID = ${id}`;

    conn.query(sql,function (error, results, fields) {
        if (error) throw error;
  
        const items=JSON.stringify(results[0] )
  
      const orderItems= JSON.parse( items.replace(/\\/g,'').replace('{"Items":""','').replace('""}',''))
  
    const totalOrder=totalPrice(orderItems);
    const tax=totalTax(orderItems);
    res.send({totalOrder, orderItems,tax})
    });
}

exports.createOrder=(req,res)=>{
  
    const {payment,total,cart} =req.body;
 
    orderID=shortid.generate()
    const id = req.auth.id;
    let sql =` INSERT INTO orders(userID, Total, PayPalPayment, Items,Status, OrderID) SELECT ${id},${total},'${JSON.stringify(payment)}',cart.Items ,"Not Processed","${orderID}"
    FROM cart WHERE userID=${id}`
    
   conn.query(sql,function (error, results, fields) {
        if (error) throw error;
    res.send("OK")
    })
}

exports.getUserOrders=(req,res)=>{
    const id = req.auth.id;
    let sql =`SELECT  userID, Total,  Items, Status, Date, OrderID FROM orders WHERE userID=${id} ORDER BY orders.Date DESC`
    conn.query(sql,function (error, results, fields) {
        if (error) throw error;
    res.send(results)
    })
}
exports.getAdminOrders=(req,res)=>{
    const id = req.auth.id;
    let sql =`SELECT  orders.* , users.Address FROM orders INNER JOIN users  ON orders.userID = users.ID WHERE userID=${id}`
    conn.query(sql,function (error, results, fields) {
        if (error) throw error;
    res.send(results)
    })
}
exports.updateAdminOrderStatus=(req,res)=>{
 const {status,orderID}=req.body
    let sql =  ` UPDATE orders SET Status ="${status}" WHERE orderID="${orderID}"`
    conn.query(sql,function (error, results, fields) {
        if (error) throw error;
    res.send(results)
    })
 
}

