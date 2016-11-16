function alignContainers ( gridContainer , grid) {
    var rows = angular.element(gridContainer + ' .ui-grid .ui-grid-render-container-body .ui-grid-row');
    var pinnedRowsLeft = angular.element(gridContainer + ' .ui-grid .ui-grid-pinned-container-left .ui-grid-row');
    var gridHasRightContainer = grid.hasRightContainer();
    if (gridHasRightContainer) {
        var pinnedRowsRight = angular.element(gridContainer + ' .ui-grid .ui-grid-pinned-container-right .ui-grid-row');
    }

    var bodyContainer = grid.renderContainers.body;

    // get count columns pinned on left
    var columnsPinnedOnLeft = grid.renderContainers.left.renderedColumns.length;

    for(var r = 0; r < rows.length; r++) {
        // Remove height CSS property to get new height if container resized (slidePanel)
        var elementBody = angular.element(rows[r]).children('div');
        elementBody.css('height', '');
        var elementLeft = angular.element(pinnedRowsLeft[r]).children('div');
        elementLeft.css('height', '');
        if (gridHasRightContainer) {
            var elementRight = angular.element(pinnedRowsRight[r]).children('div');
            elementRight.css('height', '');
        }

        // GET Height when set in auto for each container
        // BODY CONTAINER
        var rowHeight = 0;
        if(rows[r])
            rowHeight = rows[r].offsetHeight;
        // LEFT CONTAINER
        var pinnedRowLeftHeight = 0;
        if (columnsPinnedOnLeft&&pinnedRowsLeft[r]) {
            pinnedRowLeftHeight = pinnedRowsLeft[r].offsetHeight;
        }
        // RIGHT CONTAINER
        var pinnedRowRightHeight = 0;
        if (gridHasRightContainer&&pinnedRowsRight[r]) {
            pinnedRowRightHeight = pinnedRowsRight[r].offsetHeight;
        }
        // LARGEST
        var largest = Math.max(rowHeight, pinnedRowLeftHeight, pinnedRowRightHeight);

        // Apply new row height in each container
        elementBody.css('height', largest);
        elementLeft.css('height', largest);
        if (gridHasRightContainer) {
            elementRight.css('height', largest);
        }

        // Apply new height in gridRow definition (used by scroll)
        if(bodyContainer.renderedRows[r])
            bodyContainer.renderedRows[r].height = largest;
    }
    // NEED TO REFRESH CANVAS
    bodyContainer.canvasHeightShouldUpdate = true;
};