/*
TODO:
Take the input, validate it, and add a new transaction to the log
save the transaction
*/
var Appversion = "0.16";  // change to refresh the data

var storage = window.localStorage;

var savedAppVersion = localStorage.getItem("version");
/*if there is one check if it is the same*/
if (savedAppVersion && savedAppVersion === Appversion)
{ // do nothing
}
else {
/*clear local storage*/
localStorage.clear();
/*save new app version*/
localStorage.setItem("version", Appversion);
}

var data = JSON.parse(storage.getItem("data"));
if(!data)
{
    data = {
        transactions:[{
            date:"1/1/1",
            what:"The Big Bang",
            category:"Cataclysm",
            amount:0
        }]
    }
    storage.setItem("data", JSON.stringify(data));
}

var sum = 0;

data.transactions.forEach(transaction => {sum+=transaction.amount})

document.getElementById('total').innerHTML = "$"+Number(sum).toFixed(2);

UpdateTransactionLog();

function UpdateTransactionLog()
{
    var div = document.getElementById("transactions");
    div.innerHTML = "";

    data.transactions.forEach(transaction => {
        var html = div.innerHTML;
        div.innerHTML = "<tr><td>"+transaction.date+"</td><td>"+transaction.what+"</td><td>"+transaction.category+"</td><td>"+transaction.amount+"</td></tr>"+html;
    });
}

function CancelAddItem()
{
    ClearForm();
    ShowMain();
}

function AddNewItem()
{
    if(document.getElementById('TheForm').reportValidity())
    {
        var date = moment(document.getElementById('date').value).format("M/D/YYYY");
        var what = document.getElementById('what').value;
        var category = document.getElementById('category').value;
        var amount = Number(document.getElementById('amount').value);
        amount = document.getElementById('income').checked?amount:-1*amount;

        data.transactions.push({
            date:date,
            what:what,
            category:category,
            amount:amount
        })
        storage.setItem("data", JSON.stringify(data));
        var sum = 0;
        data.transactions.forEach(transaction => {sum+=transaction.amount});
        document.getElementById('total').innerHTML = "$"+sum.toFixed(2);
        UpdateTransactionLog();
        ClearForm();
        ShowMain();
    }
    else
    {

    }
}

function ShowNewItemModal()
{
    document.getElementById('main').classList.remove("w3-show");
    document.getElementById('main').classList.add("w3-hide");
    document.getElementById('newThingForm').classList.remove("w3-hide");
    document.getElementById('newThingForm').classList.add("w3-show");
}

function ShowMain()
{
    document.getElementById('main').classList.remove("w3-hide");
    document.getElementById('main').classList.add("w3-show");
    document.getElementById('newThingForm').classList.remove("w3-show");
    document.getElementById('newThingForm').classList.add("w3-hide");
}

function ClearForm()
{
    document.getElementById("TheForm").reset();
}