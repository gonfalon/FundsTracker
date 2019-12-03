/*
TODO:
Edit entries
Delete entries
Filter main page/new page with filters/month summary page
*/
var Appversion = "0.17";  //DO NOT CHANGE ANYMORE! Just add the ability to update. if you change this, all data will be deleted
var itemBeingEdited = null;

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
            category:"Other",
            amount:0
        }]
    }
    storage.setItem("data", JSON.stringify(data));
}

var sum = 0;

data.transactions.forEach(transaction => {sum+=transaction.amount});

document.getElementById('total').innerHTML = "$"+Number(sum).toFixed(2);

UpdateTransactionLog();

//window.oncontextmenu = function(e){e.preventDefault();} 

function UpdateTransactionLog()
{
    var div = document.getElementById("transactions");
    var html = "";
    data.transactions.forEach((transaction, index) => {
        var cssClass = transaction.amount<0?"w3-pale-red":"w3-pale-green";
        html = '<tr id="transaction'+index+'" class="'+cssClass+'"><td>'+transaction.date+'</td><td>'+transaction.what+'</td><td>'+transaction.category+'</td><td>$'+transaction.amount+'</td></tr>'+html;
    });
    div.innerHTML = html;
    data.transactions.forEach((transaction, index) => {
        document.getElementById("transaction"+index).oncontextmenu = function(e){EditItem(e, index)}
    });
}

function CancelAddItem()
{
    ClearForm("NewItemForm");
    ShowMain();
}

function CancelEditItem()
{
    ClearForm("EditItemFormForm");
    itemBeingEdited = null;
    ShowMain();
}

function AddNewItem()
{
    if(document.getElementById('NewItemForm').reportValidity())
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
        ClearForm("NewItemForm");
        ShowMain();
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
    document.getElementById('EditItemForm').classList.remove("w3-show");
    document.getElementById('EditItemForm').classList.add("w3-hide");
}

function ShowEditItemModal()
{
    document.getElementById('main').classList.remove("w3-show");
    document.getElementById('main').classList.add("w3-hide");
    document.getElementById('EditItemForm').classList.remove("w3-hide");
    document.getElementById('EditItemForm').classList.add("w3-show");
}

function ClearForm(form)
{
    document.getElementById(form).reset();
}

function EditItem(e, index)
{
    itemBeingEdited = index;
    e.preventDefault();
    console.log("OnContextMenu Triggered for index"+index);
    var transaction = data.transactions[index];
    document.getElementById("EditIncome").checked = transaction.amount>=0?true:false;
    document.getElementById("EditDate").value = moment(transaction.date).format("YYYY-MM-DD");
    document.getElementById("EditWhat").value = transaction.what;
    document.getElementById("EditCategory").value = transaction.category;
    document.getElementById("EditAmount").value = transaction.amount>=0?transaction.amount:-1*transaction.amount;
    ShowEditItemModal();
}

function SubmitEditItem()
{
    if(document.getElementById('EditItemFormForm').reportValidity())
    {
        var date = moment(document.getElementById('EditDate').value).format("M/D/YYYY");
        var what = document.getElementById('EditWhat').value;
        var category = document.getElementById('EditCategory').value;
        var amount = Number(document.getElementById('EditAmount').value);
        amount = document.getElementById('EditIncome').checked?amount:-1*amount;

        data.transactions[itemBeingEdited] = {
            date:date,
            what:what,
            category:category,
            amount:amount
        }
        storage.setItem("data", JSON.stringify(data));
        var sum = 0;
        data.transactions.forEach(transaction => {sum+=transaction.amount});
        document.getElementById('total').innerHTML = "$"+sum.toFixed(2);
        UpdateTransactionLog();
        ClearForm("EditItemFormForm");
        ShowMain();
    }
}