function showNumberWithAnimation( i , j , randNumber ){
	var numCell = $("#num-cell-" + i + "-" + j);
	//numCell.css("width", 100);
	//numCell.css("height", 100);
	//numCell.css("left", getPosLeft(i, j));
	//numCell.css("top", getPosTop(i, j));
	numCell.css("color", getNumberColor());
	numCell.css("background-color", getNumberBackgroundColor(randNumber));
	numCell.css("color", getNumberColor(randNumber));
	numCell.text(randNumber);
	numCell.animate({
		width:"100px",
		height:"100px",
		left:getPosLeft(i, j),
		top:getPosTop(i, j)
	},50);
};

//方格移动动画
function showMoveAnimation( fromX , fromY , toX , toY ){
	var numCell = $("#num-cell-" + fromX + "-" + fromY);
	//console.log(numCell);
	numCell.animate({
		top:getPosTop(toX , toY)+"px",
		left:getPosLeft(toX , toY)+"px"
	},200)
};
