window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const offsetX = canvas.offsetLeft;
    const offsetY = canvas.offsetTop;
    let savedImageData;
    let fillColor;
    const clearBtn = document.getElementById('clear-btn');
    const rectArr = [];
    const rect = {};
    const coord = {};
    let drawing = false;

    function generateRandomColor() {
        fillColor = Math.floor(Math.random()*16777215).toString(16);
    }

    // Save the whole canvas
    function saveCanvasImage() {
        savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    // Redraw the whole canvas using the saved canvas
    function redrawImage() {
        ctx.putImageData(savedImageData, 0, 0);
    }

    function onMouseDown(e) {
        canvas.style.cursor = 'crosshair';

        // Get the mouse coordinates
        coord.startX = e.pageX - offsetX;
        coord.startY = e.pageY - offsetY;

        generateRandomColor();
        saveCanvasImage();

        drawing = true;
        const { startX, startY } = coord;

        // Store the start position of the rectangle using mouse coordinates
        rect.startX = startX;
        rect.startY = startY;
    }

    function onMouseUp(e) {
        canvas.style.cursor = 'default';
        drawing = false;

        // Get the ending coordinates of the mouse
        coord.endX = e.pageX - offsetX;
        coord.endY = e.pageY - offsetY;

        const { endX, endY } = coord;

        // Store the width, height and color of the drawn rectangle
        rect.width = coord.width;
        rect.height = coord.height;
        rect.color = '#' + fillColor;
        const { startX, startY } = rect;

        // Condition to store only the drawn rectangle
        if (startX != endX && startY != endY) {
            rectArr.push(Object.assign({}, rect));
        }
    }

    function draw(e) {
        // Condition to avoid drawing if the mouse is moving without being clicked
        if (!drawing) return;

        ctx.fillStyle = '#' + fillColor;
        canvas.style.cursor = 'crosshair';

        // Get the rectangle's width and height using page and mouse coordinates
        coord.width = (e.pageX - offsetX) - coord.startX;
        coord.height = (e.pageY - offsetY) - coord.startY;

        clearCanvas();
        redrawImage();

        ctx.fillRect(coord.startX, coord.startY, coord.width, coord.height);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function clearRectangle() {
        // Loop through all the rectangles stored in the rectArr array

        for (let i = rectArr.length - 1; i >= 0; i--) {
            const { startX, startY, width, height } = rectArr[i];

            if (
                /* 
                    Check if the mouse click falls on the rectangle
                    drawn from top left to bottom right
                */
                (
                    coord.startX < startX + width &&
                    coord.startY < startY + height
                ) ||
                /* 
                    Check if the mouse click falls on the rectangle
                    drawn from bottom left to top right
                */
                (
                    coord.startX > startX - width &&
                    coord.startY > startY + height
                ) ||
                /* 
                    Check if the mouse click falls on the rectangle
                    drawn from top right to bottom left
                */
                (
                    coord.startX > startX + width &&
                    coord.startY > startY - height
                )||
                /* 
                    Check if the mouse click falls on the rectangle
                    drawn from bottom right to top left
                */ 
                (
                    coord.startX > startX + width &&
                    coord.startY > startY + height
                ) 
            ) {

                // Remove the clicked rectangle from the array
                rectArr.splice(i, 1);

                // Clear the whole canvas
                clearCanvas();

                // Redraw the canvas after the clicked rectangle has been removed
                rectArr.forEach((rect) => {
                    ctx.fillStyle = rect.color;
                    ctx.fillRect(rect.startX, rect.startY, rect.width, rect.height);
                });

                // Stop the loop after the canvas is redrawn
                break;

            }
        }

    }

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('dblclick', clearRectangle);
    clearBtn.addEventListener('click', clearCanvas);
});