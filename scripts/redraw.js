var shouldStop = false;
var ROW_HEIGHT = 16;
var COL_WIDTH = 75;

window.util = {
  randomInt: function(a) {
    return Math.floor(Math.random() * a);
  },
  repeat: function(string, length) {
    return(new Array(length + 1)).join(string);
  }
};

function renderInlineBlockGrid(container, numRows, numColumns, textWeight) {
  var html = [];
  console.time('build-html');
  for (var row = 1; row <= numRows; row++) {
    var rowHtml = [];
    rowHtml[0] = '<div class="row">';
    for (var col = 1; col <= numColumns; col++) {
      rowHtml[col] = ['<div class="inline-cell" id="', getId(row, col),
         '">', getText(textWeight), '</div>'].join('');
    }
    rowHtml.push('</div>');
    html[row] = rowHtml.join('');
  }
  console.timeEnd('build-html');
  console.time('parse');
  container.innerHTML = html.join('');
  console.timeEnd('parse');
}

function renderAbsoluteGrid(container, numRows, numColumns, textWeight) {
  var html = [];
  console.time('build-html');
  for (var row = 1; row <= numRows; row++) {
    for (var col = 1; col <= numColumns; col++) {
      var rowOffset = (row - 1) * ROW_HEIGHT + 'px';
      var colOffset = (col - 1) * COL_WIDTH + 'px';
      var cellHtml = ['<div class="absolute-cell" id="',
         getId(row, col),
         '" style="left:', colOffset,
          ';top:', rowOffset, ';">', getText(textWeight), '</div>'].join('');
      html.push(cellHtml);
    }
  }
  console.timeEnd('build-html');
  console.time('parse');
  container.innerHTML = html.join('');
  console.timeEnd('parse');
}

function renderTable(container, numRows, numColumns, textWeight) {
  var html = ['<table><tbody>'];
  console.time('build-html');
  for (var row = 1; row <= numRows; row++) {
    var rowHtml = [];
    rowHtml[0] = '<tr class="table-row">';
    for (var col = 1; col <= numColumns; col++) {
      rowHtml[col] = ['<td class="table-cell"  id="', getId(row, col),
           '">', getText(textWeight), '</td>'].join('');
    }
    rowHtml.push('</tr>');
    html[row] = rowHtml.join('');
  }
  html.push('</tbody></table>');
  console.timeEnd('build-html');
  console.time('parse');
  container.innerHTML = html.join('');
  console.timeEnd('parse');
}

function renderSingleColumnDivs(container, numRows, numColumns, textWeight) {
  var html = [];
  console.time('build-html');
  for (var col = 0; col < numColumns; col++) {
    var colHtml = ['<div class="column-div">'];
    for (var row = 1; row <= numRows; row++) {
      colHtml[row] = [getText(textWeight), '<br/>'].join('');
    }
    colHtml.push('</div>');
    html[col] = colHtml.join('');
  }
  console.timeEnd('build-html');
  console.time('parse');
  container.innerHTML = html.join('');
  console.timeEnd('parse');

}

function updateText(numRows, numColumns, textWeight) {
  for (var row = 1; row <= numRows; row++) {
    for (var col = 1; col <= numColumns; col++) {
      var elem = document.getElementById(getId(row, col));
      if (elem) {
        // elem.innerHTML = getText(textWeight);
        elem.innerHTML = '';
        elem.appendChild(getTextNode(textWeight))
      }
    }
  }
}

var ALPHABET = 'abcdefghijklmnopqrstuv';
function getText(textWeight) {
  return util.repeat(
      ALPHABET.charAt(util.randomInt(ALPHABET.length)), 
      textWeight);
}

var REPLICAS = 100000;
var domCache = {};
for (var i = 0; i < ALPHABET.length; i++) {
  var c = ALPHABET.charAt(i);
  domCache[c] = [];
  var text = util.repeat(c, 8);
  for (var j = 0; j < REPLICAS; j++) {
    domCache[c][j] = document.createTextNode(text);
  }
}

function getTextNode(textWeight) {
  var c = ALPHABET[util.randomInt(ALPHABET.length)];
  if (domCache[c].length) {
    return domCache[c].pop();
  }
  return document.createTextNode('dom cache empty');
}

function getId(row, col) {
  return row + '-' + col;
}

function renderInLoop(fpsDiv, renderer) {
  var last = new Date().getTime();
  var count = 0;
  var renderFn = function() {
    if (count++ % 10 == 0) {
      var now = new Date().getTime();
      var fps = Math.round(10000 / (now - last));
      last = now;
      fpsDiv.innerHTML = fps + '';
    }
    if (shouldStop) {
      shouldStop = false;
      container.innerHTML = '';
    } else {
      renderer();
      webkitRequestAnimationFrame(renderFn);
    }
  };
  webkitRequestAnimationFrame(renderFn);
}

function stop() {
  shouldStop = true;
}
