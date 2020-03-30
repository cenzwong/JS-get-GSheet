var GSheetURL="https://docs.google.com/spreadsheets/d/e/2PACX-1vSrQiEKgWx_4d1zD6PsUvXSqrkB1y1vnTeea7saxTRzTFLLtGiqK8GZQQZD9_t6suEgmhzlbqnmlQ3y/pubhtml";

// let GSheetAry;
let GSheetArys = {};

const getData = () => {
  $.get(GSheetURL, function(data,status){
    // console.log("Data: " + data + "\nStatus: " + status);

    // let txt = extractData(data, 3, 2);
    GSheetArys = extractDataArys(data);
    // console.log(GSheetArys);
    // console.log(GSheetArys["mySheet1"]);
  });
};  

function createArray(length) {
  var arr = new Array(length || 0),
      i = length;

  if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while(i--) arr[length-1 - i] = createArray.apply(this, args);
  }

  return arr;
}

function extractDataArys(myData){
  var slicedData, slicedData4sheet, startData, endData;

  var listAry = [];
  var dataTempArys = {}
  var startTable, endTable, totalDataSize, totalDataRow, totalDataColumn;
  var totalSheet = myData.match(/switchToSheet/g).length/2;
  // console.log(totalSheet);
  var startSheetTable = myData.lastIndexOf("sheet-menu");
  var endSheetTable = myData.lastIndexOf("sheets-viewport");
  slicedData4sheet = myData.slice(startSheetTable, endSheetTable);
  slicedData = myData;

  for(let i = 1; i <= totalSheet; i++){
    temp = slicedData4sheet.split('<a href="#">')[i].substring(0,slicedData4sheet.indexOf('</a>')-slicedData4sheet.indexOf('<a href="#">')-12);
    // console.log(temp);
    listAry.push(temp);

    // console.log(slicedData);
    startTable = slicedData.indexOf("<tbody>");
    endTable = slicedData.indexOf("</tbody>");
    // console.log(startTable, endTable);
    slicedData = slicedData.slice(startTable, endTable);
    // console.log(slicedData);
    totalDataSize = slicedData.match(/<\/td>/g).length;
    totalDataRow = slicedData.match(/<\/tr>/g).length;
    totalDataColumn = totalDataSize/totalDataRow;
    dataAry = createArray(totalDataRow,totalDataColumn);
    dataTempArys[listAry[i-1]] = createArray(totalDataRow,totalDataColumn);
    
    var rowRawData = slicedData.split("<tr");
    column = 1;
    
    for(let r = 1; r <= totalDataRow; r++){
      for(let c = 1; c <= totalDataColumn; c++){
          startData = rowRawData[r].split("<td")[c].indexOf(">");
          endData = rowRawData[r].split("<td")[c].indexOf("</td>");
          dataAry[r-1][c-1] = rowRawData[r].split("<td")[c].substring(startData+1, endData);
          //GSheetArys[listAry[i-1]][r-1][c-1] = rowRawData[r].split("<td")[c].substring(startData+1, endData);
      }
    }
    dataTempArys[listAry[i-1]] = dataAry
    slicedData = myData.slice(endTable+6, myData.length);

  }
    return dataTempArys;
}


//Program Start
getData();