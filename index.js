window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const offsetX = canvas.offsetLeft;
    const offsetY = canvas.offsetTop;
    let savedImageData;
    const line_width = 2;
    let fillColor;
  //  const strokeColor = 'black';
    const clearBtn = document.getElementById('clear-btn');
    const rectArr = [];
    const rect = {};
    const coord = {};
    let drawing = false;

    function generateRandomColor() {
        fillColor = Math.floor(Math.random()*16777215).toString(16);
    }

    function saveCanvasImage() {
        savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function redrawImage() {
        ctx.putImageData(savedImageData, 0, 0);
    }

    function onMouseDown(e) {
     //   canvas.style.cursor = "crosshair";

        coord.startX = e.pageX - offsetX;
        coord.startY = e.pageY - offsetY;
        generateRandomColor();
        saveCanvasImage();
        drawing = true;
        const { startX, startY } = coord;
        rect.topLeftPos = { startX, startY };
    }

    function onMouseUp(e) {
     //   canvas.style.cursor = "default";
        drawing = false;
        coord.endX = e.pageX - offsetX;
        coord.endY = e.pageY - offsetY;
        const { endX, endY } = coord;
        rect.bottomRightPos = { endX, endY };
        rect.width = coord.width;
        rect.height = coord.height;
        const { topLeftPos: { startX, startY } } = rect;

        if(startX != endX && startY != endY) {
            rectArr.push(Object.assign({}, rect));
            console.log('Array', rectArr);
        }
    }

    function draw(e) {
        if (!drawing) return;
     //   ctx.strokeStyle = strokeColor;
        ctx.fillStyle = '#' + fillColor;
     //   canvas.style.cursor = "crosshair";
     //   ctx.lineWidth = line_width;
        coord.width = (e.pageX - offsetX) - coord.startX;
        coord.height = (e.pageY - offsetY) - coord.startY;
    //    ctx.clearRect(0, 0, canvas.width, canvas.height);
        clearCanvas();
        redrawImage();
        ctx.beginPath();
        ctx.fillRect(coord.startX, coord.startY, coord.width, coord.height);
     //   ctx.strokeRect(coord.startX, coord.startY, coord.width, coord.height);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function clearRectangle() {
    //    ctx.strokeStyle = '#ffffff';
        

        //loop through all the rectangles stored in rectArr
        for (let i = 0; i < rectArr.length; i++) {
            const { topLeftPos: { startX, startY }, bottomRightPos: { endX, endY }, width, height } = rectArr[i];

            //condition to check if the double click position falls between top left and bottom right
            if (
                coord.startX > startX &&
                coord.startY > startY &&
                coord.startX < endX &&
                coord.startY < endY
            ) {
                //clear the rectangle by using start position, length and width
                console.log('Clicked coords', width, height);
                clearCanvas();
                redrawImage();
                ctx.clearRect(startX, startY, width, height);
                //   ctx.strokeRect(startX, startY, endX-startX, endY-startY);
            }
        }
    }

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('dblclick', clearRectangle);
    clearBtn.addEventListener('click', clearCanvas);
});