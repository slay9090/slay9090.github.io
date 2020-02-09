let section = {
  name: ["product1","ProDuct2","product3","product4","product5","product4","tprotduct7"],
  count: [5,5,5,5,5,5,5],
  prise: [10000.99,5000.99,8000.99,430.66,47535.45,1111.23,5400.78],
};
let statusCheckRowsForAdd=false;
let errMsg="null";
let topImgNameOfFilter="img/triangletop.png";
let bottonImgNameOfFilter="img/trianglebotton.png";
let selectNumberRow;

UpdateDataTableRows(section);

function UpdateDataTableRows(mass) {

  $('.cwdtable tbody').empty(); // очистить табл.

  for (let i = 0; i < mass.name.length; i++){
    let tr = '<tr>'; // создаем строку таблицы
    tr += '<td>' + mass.name[i] + '</td>'; // добавляем столбцы в строку
    tr += '<td>' + mass.count[i] + '</td>'; // добавляем столбцы в строку
    tr += '<td>' + formatPrice(String(mass.prise[i]))  + '</td>';
    tr += '<td class="actionColumn" align="center">' +
      '<input class="buttons" value="Edit" onclick="getNumberRow(\'edit\');" type="button"> ' +
      '<input class="buttons" value="Delete" onclick="getNumberRow(\'delete\')" type="button">'
      +    '' + '</td>';
    tr += '</td>';
    $('.cwdtable > tbody:last-child').append(tr); // добавляем полученную строку в дом


  }
  $('.actionColumn').css('text-align','center');
  $('.actionColumn').css('width','25%');
}

function setSelectField (input) {

  $(input).css('box-shadow','none');
  $('#errLabel').empty();
}

function checkOfProductNameValue(pName) {
//.trim(); // на пробелы тоже чекнуть
  statusCheckRowsForAdd = true; // что бы не фигарить многоуровневые иф - эльзы
if (pName.trim() == "" || pName == null || pName == undefined){
errMsg="Err: Product Name is null";
statusCheckRowsForAdd = false;
  $('#productNameField').css('box-shadow','1px 1px 1px 1px red');
}
if (pName.length>15){
  errMsg="Err: Product Name Max length>15";
  statusCheckRowsForAdd = false;
  $('#productNameField').css('box-shadow','1px 1px 1px 1px red');
}

}

function checkOfCountValue(price) {
  // Буфер залочил во внутреннем скрипте
  if (!/^\d+$/.test(price.trim())) {
    errMsg="Err: Count Value must only digital symbol";
    statusCheckRowsForAdd = false;
    $('#countField').css('box-shadow','1px 1px 1px 1px red');
  }
}

function  checkOfPriceValue(price) {

    if (!/^[0-9\.]+$/.test(price.trim())) {
      errMsg = "Err: Value Price Allowed input:0-9";
      statusCheckRowsForAdd = false;
      $('#priceField').css('box-shadow','1px 1px 1px 1px red');
    }
}

function insertData(pName,count,price) {
  if ($('#add').attr('value')=='Add'){
    addRowOfTable(pName,count,price);
  }
  if ($('#add').attr('value')=='Update'){
updateRowOfTable(pName,count,price);
  }
}

function updateRowOfTable(pName,count,price) {
  checkOfProductNameValue(pName);
  checkOfCountValue(count);
  price=price.replace('$','').split(",").join("");
  checkOfPriceValue(price);
  if (statusCheckRowsForAdd === true) {
    delRowOfTable();
    addRowOfTable(pName, count, price);
    UpdateDataTableRows(section);
  }
  else {
    $('#errLabel').empty();
    $('#errLabel').append(errMsg.substring(0, 80)).css('color','red').css('width','100%')
  }
}

function addRowOfTable(pName,count,price) // Метод добавления строк в табл.
{
  checkOfProductNameValue(pName);
  checkOfCountValue(count);
  price=price.replace('$','').split(",").join("");
  checkOfPriceValue(price);

if (statusCheckRowsForAdd === true) {
  section.name.push(pName);
  section.count.push(count);
  section.prise.push(price);

  UpdateDataTableRows(section);
}
else {
  $('#errLabel').empty();
  $('#errLabel').append(errMsg.substring(0, 80)).css('color','red').css('width','100%')
}
}


function editRowOfTable() {
  $('#productNameField').val(section.name[selectNumberRow]);
  $('#countField').val(section.count[selectNumberRow]);
  $('#priceField').val(section.prise[selectNumberRow]);
  $('#add').attr('value', 'Update');
}

function clearBottonFields() {
  $('#productNameField').val('');
  $('#countField').val('');
  $('#priceField').val('');
  $('#add').attr('value', 'Add');
}

function getNumberRow(action) {

  $(document).ready(function(){
    $('tr').one( 'click',function(){
    selectNumberRow=this.rowIndex-1;

if (action=='delete') {
clearBottonFields();
  openModal();
}
if (action=='edit'){
  editRowOfTable();
}
      $( 'tr').unbind( "click" );
    });
  });
}


function delRowOfTable() {
//alert(numberRowForDelete);
     section.name.splice(selectNumberRow, 1);
  section.count.splice(selectNumberRow, 1);
  section.prise.splice(selectNumberRow, 1);
    UpdateDataTableRows(section);
    if(isInit==true) {
      openModal();
    }

}

//надо было сразу нормальный данных сделать что бы не перегонять туда - сюда -
//сортировка по цифрам
let objs = [];
function createReversData() {
  for (let i = 0; i < section.name.length; i++) {
    objs.push({ name: section.name[i], count: section.count[i], prise: section.prise[i]});
  }
}
function writeReversData(massFrom,massTo) {
  for (let i = 0; i < massFrom.length; i++) {
    massTo.name[i] = massFrom[i].name;
    massTo.count[i] = massFrom[i].count;
    massTo.prise[i] = massFrom[i].prise;
  }

}

function getNameImgFilter(columnID) {
 return document.getElementById(columnID).getAttribute('src');
}

function setImgFilter(img,columnID) {
  if (img == "top"){$("#"+columnID).attr("src",topImgNameOfFilter);}
  if (img == "botton"){$("#"+columnID).attr("src",bottonImgNameOfFilter);}
}

function sortTable(columnID){
  createReversData();
  switch (columnID) {

    case 'sortByPrice':
      if (getNameImgFilter(columnID)==topImgNameOfFilter){
        objs.sort((a, b) => a.prise - b.prise);
        setImgFilter('botton',columnID);
      }
      else if(getNameImgFilter(columnID)==bottonImgNameOfFilter){
        objs.sort((a, b) => b.prise - a.prise);
        setImgFilter('top',columnID);

      }
      break;

    case 'sortByCount':
      if (getNameImgFilter(columnID)==topImgNameOfFilter){
        objs.sort((a, b) => a.count - b.count);
        setImgFilter('botton',columnID);
      }
      else if(getNameImgFilter(columnID)==bottonImgNameOfFilter){
        objs.sort((a, b) => b.count - a.count);
        setImgFilter('top',columnID);
      }
      break;

    case 'sortByName':
      if (getNameImgFilter(columnID)==topImgNameOfFilter){
        objs.sort(function (a, b) {if (a.name > b.name) {return 1;} if (a.name < b.name) {return -1;}return 0; });
        setImgFilter('botton',columnID);
      }
      else if(getNameImgFilter(columnID)==bottonImgNameOfFilter){
        objs.sort(function (b, a) {if (a.name > b.name) {return 1;} if (a.name < b.name) {return -1;}return 0; });
        setImgFilter('top',columnID);
      }
      break;
    default: return;
  }
    writeReversData(objs,section);
   UpdateDataTableRows(section);
   objs = [];
}



function filterByName(arr, name) {
  return arr.filter(function(item, i, arr) {
    return (item.name.toLowerCase().indexOf(name.toLowerCase()) +1 );
  });

};


function searchProduct(nameOfSearch){
createReversData();
  let viewArr = {
    name: [],
    count: [],
    prise: [],
  };
  let sectionFilterView = filterByName(objs, nameOfSearch);

  writeReversData(sectionFilterView,viewArr);
  console.log(viewArr);
  objs=[];
 UpdateDataTableRows(viewArr);

}

// обработчик прайс филда

$("input[data-type='currency']").on({
  blur: function() {
    formatCurrency($(this));
  },
  blur: function() {
    formatCurrency($(this), "blur");
  }
});
$('#priceField').focus(function(){
  document.getElementById('priceField').value = document.getElementById('priceField').value.replace('$','').split(",").join("");
});
function formatNumber(n) {
  return n.replace('.', "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function formatCurrency(input, blur) { // конвертация в свой отображаемый формат цены это для филда только, хотя можно общий универсальный сделать
  let input_val = input.val();
  if (input_val === "") { return; }
  let original_len = input_val.length;
  let caret_pos = input.prop("selectionStart");

  if (input_val.indexOf(".") >= 0) {
    let decimal_pos = input_val.indexOf(".");
    let left_side = input_val.substring(0, decimal_pos);
    let right_side = input_val.substring(decimal_pos);
    left_side = formatNumber(left_side);
    right_side = formatNumber(right_side);
    if (blur === "blur") {
      right_side += "00";
    }
    right_side = right_side.substring(0, 2);
    input_val = "$" + left_side + "." + right_side;
  } else {
    input_val = formatNumber(input_val);
    input_val = "$" + input_val;
    if (blur === "blur") {
      input_val += ".00";
    }
  }
  input.val(input_val);
  let updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;

  input[0].setSelectionRange(caret_pos, caret_pos);
}
// -- end обработчик прайс филда

function formatPrice(n) { //  конвертация в свой отображаемый формат цены

  let input_val = n;

  let original_len = input_val.length;
  let caret_pos = input_val.length;

  if (input_val.indexOf(".") >= 0) {
    let decimal_pos = input_val.indexOf(".");
    let left_side = input_val.substring(0, decimal_pos);
    let right_side = input_val.substring(decimal_pos);
    left_side = formatNumber(left_side);
    right_side = formatNumber(right_side);
    if (blur === "blur") {
      right_side += "00";
    }
    right_side = right_side.substring(0, 2);
    input_val = "$" + left_side + "." + right_side;
  } else {
    input_val = formatNumber(input_val);
    input_val = "$" + input_val;
    if (blur === "blur") {
      input_val += ".00";
    }
  }

  let updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;

  return input_val;

}



