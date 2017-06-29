var board = new Array();
var score = 0;
var hasConflicted = new Array(); //每个格子只能合并一次

$(document).ready(function() {
	prepareForMobile();
	newgame();
});

//移动端布局
function prepareForMobile() {
	if(documentWidth > 500) {
		gridContainerWidth = 500;
		cellPadding = 20;
		cellWidth = 100;
	}

	$('#grid-container').css('width', gridContainerWidth - 2 * cellPadding);
	$('#grid-container').css('height', gridContainerWidth - 2 * cellPadding);
	$('#grid-container').css('padding', cellPadding);
	$('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

	$('.grid-cell').css('width', cellWidth);
	$('.grid-cell').css('height', cellWidth);
	$('.grid-cell').css('border-radius', 0.02 * cellWidth);
};

function newgame() {
	//初始化棋盘格
	init();
	//在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
};

function init() {
	//重置分数
	score = 0;
	$("#score").text(score);
	//绘制底部格子
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			var gridCell = $("#grid-cell-" + i + "-" + j);
			gridCell.css("top", getPosTop(i, j));
			gridCell.css("left", getPosLeft(i, j));
		}
	}

	//添加数字
	//在board数组中添加数字
	for(var i = 0; i < 4; i++) {
		board[i] = [];
		hasConflicted[i] = [];
		for(var j = 0; j < 4; j++) {
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}
	console.log(board);
	/*board[0][0] = 2;
	board[0][1] = 2;
	board[0][2] = 4;
	board[0][3] = 8;*/
	//将数组中数字添加到view中
	updateBoardView();
};

function updateBoardView() {
	$(".num-cell").remove();
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			hasConflicted[i][j] = false; //每一个动作后都要重置一下
			var numCell = $('<div class="num-cell" id="num-cell-' + i + '-' + j + '"></div>');
			$("#grid-container").append(numCell);
			if(board[i][j] == 0) { //等于0的时候 不显示数字
				numCell.css("width", 0);
				numCell.css("height", 0);
				/*************************************为了动画效果***********************************************/
				numCell.css("left", getPosLeft(i, j) + cellWidth / 2);
				numCell.css("top", getPosTop(i, j) + cellWidth / 2);
			} else { //不等于0的时候显示数字
				numCell.css("width", cellWidth);
				numCell.css("height", cellWidth);
				numCell.css("left", getPosLeft(i, j));
				numCell.css("top", getPosTop(i, j));
				numCell.css("background-color", getNumberBackgroundColor(board[i][j]));
				numCell.css("color", getNumberColor(board[i][j]));
				numCell.text(board[i][j]);
			}
		}
	}
	$('.num-cell').css('line-height', cellWidth + 'px');
	$('.num-cell').css('font-size', 0.6 * cellWidth + 'px');
};

function generateOneNumber() {
	var spaceArray = [];
	if(haveSpace(board)) {
		//随机位置
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 4; j++) {
				if(board[i][j] == 0) {
					spaceArray.push([i, j]);
				}
			}
		}
		var ran = Math.floor(Math.random() * spaceArray.length);
		var ranX = spaceArray[ran][0];
		var ranY = spaceArray[ran][1];
		/*var ranX = Math.floor(Math.random() * 4);
		var ranY = Math.floor(Math.random() * 4);
		var time = 0;
		while(time<500) {               //只循环500次
			if(board[ranX][ranY] == 0) {
				break;
			} 
			ranX = Math.floor(Math.random() * 4);
			ranY = Math.floor(Math.random() * 4);
			time++;
		}
		
		if(time == 500){
			for(var i = 0; i < 4; i++){
				for(var j = 0; j < 4; j++){
					if(board[i][j] == 0){
						ranX = i;
						ranY =j;
					}
				}
			}
		}*/

		//随机数字
		var ranNumber = Math.random() < 0.5 ? 2 : 4;

		//在随机位置显示随机数字
		/*************************************同步数组中的数字*******************************************/
		board[ranX][ranY] = ranNumber;
		showNumberWithAnimation(ranX, ranY, ranNumber);
	}
};

$(document).keydown(function(event) {
	switch(event.keyCode) {
		case 37: //left
			if(moveLeft()) {
				setTimeout("generateOneNumber()", 200);
				setTimeout("gameOver()", 300);
			}
			break;
		case 38: //up
			if(moveUp()) {
				setTimeout("generateOneNumber()", 200);
				setTimeout("gameOver()", 300);
			}
			break;
		case 39: //right
			if(moveRight()) {
				setTimeout("generateOneNumber()", 200);
				setTimeout("gameOver()", 300);
			}
			break;
		case 40: //down
			if(moveDown()) {
				setTimeout("generateOneNumber()", 200);
				setTimeout("gameOver()", 300);
			}
			break;
		default:
			return;
	}
});

//移动端touch
document.getElementById('grid-container').addEventListener('touchstart', function(event) {
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
	
});

document.getElementById('grid-container').addEventListener('touchmove',function(event){
	event.preventDefault();  //防止页面滚动
});

document.getElementById('grid-container').addEventListener('touchend', function(event) {
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	
	var deltax = endx - startx;
	var deltay = endy - starty;
	console.log(deltax);
	console.log(deltay);

	if(Math.abs(deltax) < 0.1 * documentWidth && Math.abs(deltay) < 0.1 * documentWidth){
		return;
	}
	
		

	if(Math.abs(deltax) >= Math.abs(deltay)) {

		if(deltax > 0) {
			//move right
			if(moveRight()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("gameOver()", 300);
			}
		} else {
			//move left
			if(moveLeft()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("gameOver()", 300);
			}
		}
	} else {
		if(deltay > 0) {
			//move down
			if(moveDown()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("gameOver()", 300);
			}
		} else {
			//move up
			if(moveUp()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("gameOver()", 300);
			}
		}
	}
});

function gameOver() {
	if(noMove()) {
		alert("game over");
	}
};

//向左移动
function moveLeft() {
	if(!canMoveLeft(board)) {
		return false;
	} else {
		//找到不等于0的方块
		for(var i = 0; i < 4; i++) {
			for(var j = 1; j < 4; j++) {
				if(board[i][j] != 0) {
					//遍历左边的格子，判断能不能移过去
					for(var k = 0; k < j; k++) {
						if(board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
							showMoveAnimation(i, j, i, k);
							board[i][k] = board[i][j];
							board[i][j] = 0;
							break;
							//continue;
						} else if(board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
							showMoveAnimation(i, j, i, k);
							board[i][k] += board[i][j];
							score += board[i][j]; //加分
							$("#score").text(score);
							board[i][j] = 0;
							hasConflicted[i][k] = true;
							break;
							//continue;
						}
					}
				}

			}
		}
		setTimeout("updateBoardView()", 200); //动画完成后再进行刷新
		return true;
	}
};

//向上移动
function moveUp() {
	if(!canMoveUp(board)) {
		return false;
	} else {
		//找到不等于0的方块
		for(var i = 1; i < 4; i++) {
			for(var j = 0; j < 4; j++) {
				if(board[i][j] != 0) {
					//遍历上边的格子，判断能不能移过去
					for(var k = 0; k < i; k++) {
						if(board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
							showMoveAnimation(i, j, k, j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							break;
							//continue;
						} else if(board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
							showMoveAnimation(i, j, k, j);
							board[k][j] += board[i][j];
							score += board[i][j]; //加分
							$("#score").text(score);
							board[i][j] = 0;
							hasConflicted[k][j] = true;
							break;
							//continue;
						}
					}
				}

			}
		}
		setTimeout("updateBoardView()", 200); //动画完成后再进行刷新
		return true;
	}
};

//向右移动
function moveRight() {
	if(!canMoveRight(board)) {
		return false;
	} else {
		//找到不等于0的方块
		for(var i = 0; i < 4; i++) {
			/**************************************要从右边开始遍历*******************************************/
			for(var j = 2; j >= 0; j--) {
				if(board[i][j] != 0) {
					//遍历右边的格子，判断能不能移过去
					for(var k = 3; k > j; k--) {
						if(board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
							showMoveAnimation(i, j, i, k);
							board[i][k] = board[i][j];
							board[i][j] = 0;
							break;
							//continue;
						} else if(board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
							showMoveAnimation(i, j, i, k);
							board[i][k] += board[i][j];
							score += board[i][j]; //加分
							$("#score").text(score);
							board[i][j] = 0;
							hasConflicted[i][k] = true;
							break;
							//continue;
						}
					}
				}

			}
		}
		setTimeout("updateBoardView()", 200); //动画完成后再进行刷新
		return true;
	}
};

//向下移动
function moveDown() {
	if(!canMoveDown(board)) {
		return false;
	} else {
		//找到不等于0的方块
		/**************************************要从下边开始遍历*******************************************/
		for(var i = 2; i >= 0; i--) {
			for(var j = 0; j < 4; j++) {
				if(board[i][j] != 0) {
					//遍历下边的格子，判断能不能移过去
					for(var k = 3; k > i; k--) {
						if(board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
							showMoveAnimation(i, j, k, j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							break;
							//continue;
						} else if(board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
							showMoveAnimation(i, j, k, j);
							board[k][j] += board[i][j];
							score += board[i][j]; //加分
							$("#score").text(score);
							board[i][j] = 0;
							hasConflicted[k][j] = true;
							break;
							//continue;
						}
					}
				}

			}
		}
		setTimeout("updateBoardView()", 200); //动画完成后再进行刷新
		return true;
	}
};

function noMove() {
	if(canMoveDown(board) || canMoveLeft(board) || canMoveRight(board) || canMoveUp(board)) {
		return false;
	} else {
		return true;
	}
};