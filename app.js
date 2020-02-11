    const canvasHeight = 0.9 * window.innerHeight;
    const canvasWidth = 0.9 * window.innerWidth;
    const toolbarWidth = 0.25 * window.innerWidth;
    const defaultColor = '#020613';

    const space = document.getElementById('space');
    const ctxSpace = space.getContext('2d');
    ctxSpace.canvas.width = canvasWidth;
    ctxSpace.canvas.height = canvasHeight;

    const background = document.getElementById('background');
    const ctxBG = background.getContext('2d');
    ctxBG.canvas.width = canvasWidth;
    ctxBG.canvas.height = canvasHeight;
    ctxBG.fillStyle = 'green';
    ctxBG.fillRect(0, 0, toolbarWidth, canvasHeight);

    const toolbar = document.getElementById('toolbar');
    const ctxToolbar = toolbar.getContext('2d');
    ctxToolbar.canvas.width = toolbarWidth;
    ctxToolbar.canvas.height = canvasHeight;

    ctxToolbar.fillText('STANDARD UNITS', 10, 10);

    const toolbarMap = [
        {id: '15', x: 10, y: 10, width: 15, height: 58.9},
        {id: '20', x: 90, y: 10, width: 20, height: 58.9},
        {id: '25', x: 140, y: 10, width: 25, height: 58.9},
        {id: '30', x: 180, y: 10, width: 30, height: 58.9},
        {id: '35', x: 10, y: 100, width: 35, height: 58.9},
        {id: '40', x: 60, y: 100, width: 40, height: 58.9},
        {id: '45', x: 110, y: 100, width: 45, height: 58.9},
        {id: '50', x: 10, y: 10, width: 50, height: 58.9},
        {id: '55', x: 90, y: 10, width: 55, height: 58.9},
        {id: '60', x: 10, y: 10, width: 60, height: 58.9},
        {id: '65', x: 90, y: 10, width: 65, height: 58.9},
        {id: '70', x: 140, y: 10, width: 70, height: 58.9},
        {id: '75', x: 180, y: 10, width: 75, height: 58.9},
        {id: '80', x: 10, y: 100, width: 80, height: 58.9},
        {id: '85', x: 60, y: 100, width: 85, height: 58.9},
        {id: '90', x: 110, y: 100, width: 90, height: 58.9},
        {id: '95', x: 10, y: 10, width: 95, height: 58.9},
        {id: '100', x: 90, y: 10, width: 100, height: 58.9}
    ];


    const spaceMap = [];
    draw(ctxToolbar, toolbarWidth, toolbarMap);

    let dragging = false;
    let dragId;

    function draw(target, clearWidth, map) {
        target.clearRect(0, 0, clearWidth, canvasHeight);
        map.forEach(shape => {
            target.fillStyle = shape.color === undefined ? defaultColor : shape.color;
            target.fillRect(shape.x, shape.y, shape.width, shape.height)
        });
    }

    function mouseDownHandler(e) {
        const xEvent = e.pageX - e.target.offsetLeft;
        const yEvent = e.pageY - e.target.offsetTop;
        const target = e.target.id === 'toolbar' ? toolbarMap : spaceMap;
        target.forEach(shape => {
            const isInside = checkShapeBorders(shape, xEvent, yEvent);
            if (isInside) {
                dragging = true;
                dragId = shape.id;
                return ;
           }
        })

        function checkShapeBorders(shape, xEvent, yEvent) {
            const xInside = xEvent > shape.x && xEvent < (shape.x + shape.width);
            const yInside = yEvent > shape.y && yEvent < (shape.y + shape.height);
            return xInside && yInside;
        }
    }


    function moveHandler(e) {
        if (dragging) {
            const oldDragId = dragId;
            const isShapeExist = findShapeById(dragId, spaceMap);
            const oldCopy = isShapeExist ? findShapeById(oldDragId, spaceMap) : findShapeById(oldDragId, toolbarMap);
            const newShape = Object.assign({}, oldCopy);
            dragId = oldDragId.split('_')[0];
            newShape.x += e.movementX;
            newShape.y += e.movementY;
            newShape.id = `${dragId}_${newShape.x}_${newShape.y}`;
            replaceShapeById(oldDragId, newShape);
        }
    }

    function mouseUpHandler(e) {
        spaceMap.filter(el => el.x < toolbarWidth).map(el => replaceShapeById(el.id));
        spaceMap.filter(el => el.color !== undefined || el.id === dragId).map(el => findCrossing(el));
        dragging = false;
    }

    function findCrossing(shape) {
        const x1 = shape.x;
        const x2 = shape.x+shape.width;
        const y1 = shape.y;
        const y2 = shape.y+shape.height;
        const otherShapes = spaceMap.filter(el => el.id !== dragId);
        const xCrossing = (start, end) => start < x1 && x1 < end || start < x2 && x2 < end || x1 < start && start < x2 || x1 < end && end < x2;
        const yCrossing = (start, end) => start < y1 && y1 < end || end < y2 && y2 < end || y1 < start && start < y2 || y1 < end && end < y2;
        if (otherShapes.some(el => xCrossing(el.x, el.x+el.width) && yCrossing(el.y, el.y+el.height))) {
            highlight(shape);
        } else if (shape.color !== undefined) {
            deleteHighlight(shape);
        }
    }

    function highlight(shape) {
        const newShape = Object.assign({}, shape);
        newShape.color = 'red';
        replaceShapeById(shape.id, newShape);
    }

    function deleteHighlight(shape) {
        const newShape = Object.assign({}, shape);
        delete newShape.color;
        replaceShapeById(shape.id, newShape);
    }

    const findShapeById = (id, target) => target.filter(el => el.id === id)[0];

    const findShapeIndex = id => spaceMap.findIndex(el => el.id === id);

    function replaceShapeById(id, newShape = {}) {
        const index = findShapeIndex(id);
        if (index === -1) {
            spaceMap.push(newShape);
        } else {
            spaceMap.splice(index, 1);
            if (Object.keys(newShape).length !== 0) { // FIX ME
                spaceMap.push(newShape);
            }
        }
        dragId = newShape.id;
        draw(ctxSpace, canvasWidth, spaceMap);
    }

    // (function markupToolbar() {
    //     toolbarMap.map((el, index) => {
    //         if (index !== 0) {
    //             const newShape = Object.assign({}, el);
    //             const prevShape = toolbarMap[index-1];
    //             newShape.x += prevShape.x+prevShape.width;
    //             newShape.y += prevShape.y+prevShape.height;
    //             console.log(newShape);
    //             replaceShapeById(newShape.id, newShape);                    
    //         }
    //     });
    // })()