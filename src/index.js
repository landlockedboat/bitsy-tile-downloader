var $ = require('jquery-browserify')
let url = 'https://raw.githubusercontent.com/vikepic/the-king-is-back/master/index.html';
const tileRegex = /(?:TIL|SPR|ITM) [0-9a-zA-Z]*\n((?:[0-9]*\n){8})/;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
let pixelSize = 5;

$('#color0').on('change', function () {
	drawTiles();
});

$('#color1').on('change', function () {
	drawTiles();
});

$('#scale-slider').on('change', function () {
	pixelSize = $('#scale-slider').val();
	drawTiles();
});

$("#use-url-button").click(() => {
	url = $('#url-input').val();
	drawTiles();
});

async function drawTiles() {
	const plaintext = await getUrlContents();

	const regex = new RegExp(tileRegex, 'gi');
	match = regex.exec(plaintext);
	const matchCount = plaintext.match(regex).length;
	const maxOffsetX = Math.round(Math.sqrt(matchCount));
	let offset = { x: 0, y: 0 };
	canvas.height = maxOffsetX * 8 * pixelSize;
	canvas.width = maxOffsetX * 8 * pixelSize;
	$("#resolution").text(`Size: ${canvas.height}px * ${canvas.width}px`);
	ctx.scale(pixelSize, pixelSize);

	ctx.fillStyle = $("#color0").val();
	//console.log($("#color0").val())
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = $("#color1").val();

	while (match != null) {
		paintTile(match[1], offset);
		match = regex.exec(plaintext);
		++offset.x;
		if (offset.x > maxOffsetX) {
			offset.x = 0;
			++offset.y;
		}
	}
};

async function getUrlContents() {
	const res = await fetch(url);
	return await res.text();
}

function paintTile(tile, offset) {
	var mat = tile.split("\n");
	// trim trailing newline
	mat.pop();
	for (let i = 0; i < mat.length; i++) {
		const row = mat[i];
		for (let j = 0; j < row.length; j++) {
			const data = row[j];
			drawPixel(j + offset.x * 8, i + offset.y * 8, data);
		}
	}
}

function drawPixel(x, y, data) {
	if (data == "0") {
		return;
	}
	ctx.fillRect(x, y, 1, 1);
}

download_img = function (el) {
	var image = canvas.toDataURL("image/jpg");
	el.href = image;
};

drawTiles();
