class DataLoggerHandler extends CanvasHandler {
	constructor(canvasId) {
		super(canvasId);
		this.graphs = [];
		this.trackedObject;
		this.showGrids = true;
		this.canvasCtx.fontStyle = "30px Calibri";
	}

	refreshTimeStepInGraphs(newTimeStep) {
		for (const graph of this.graphs) {
			graph.setXStepInPlot(newTimeStep);
			graph.clearQueue();
		}
	}

	clearGraphQueues() {
		for (const graph of this.graphs) {
			graph.clearQueue();
		}
	}

	setTrackedObject(object) {
		this.trackedObject = object;
	}

	addGraph(yAxis, centrePosition) {
		const position = {
			upperLeft: new Position(this.width * 0.25, this.height * 0.25),
			upperRight: new Position(this.width * 0.75, this.height * 0.25),
			bottomLeft: new Position(this.width * 0.25, this.height * 0.75),
			bottomRight: new Position(this.width * 0.75, this.height * 0.75),
		};
		const graph = new Graph(this.width / 2, this.height / 4, yAxis, "Time", position[centrePosition]);
		this.graphs.push(graph);
	}

	drawBackground() {
		this.drawRectangle(0, 0, this.width, this.height, "white");
	}

	drawBorders(lineCoordinates) {
		this.drawLine(lineCoordinates.topLeft.getX(), lineCoordinates.topLeft.getY(), lineCoordinates.bottomLeft.getX(), lineCoordinates.bottomLeft.getY(), "black", 5);
		this.drawLine(lineCoordinates.topRight.getX(), lineCoordinates.topRight.getY(), lineCoordinates.bottomRight.getX(), lineCoordinates.topRight.getY(), "black", 5);
	}

	drawAxis(lineCoordinates) {
		this.drawLine(lineCoordinates.middleLeft.getX(), lineCoordinates.middleLeft.getY(), lineCoordinates.middleRight.getX(), lineCoordinates.middleRight.getY(), "black", 2.5);
		this.drawLine(lineCoordinates.topLeft.getX(), lineCoordinates.topLeft.getY(), lineCoordinates.topRight.getX(), lineCoordinates.topRight.getY(), "black", 2.5);
	}

	drawYGrids(graph) {
		const distanceBetweenYTicks = graph.height / 12;
		for (let i = 0; i < 11; i++) {
			this.drawLine(graph.centrePosition.getX() - 0.5 * graph.width, graph.centrePosition.getY() + distanceBetweenYTicks * (i + 1), graph.centrePosition.getX() + 0.5 * graph.width, graph.centrePosition.getY() + distanceBetweenYTicks * (i + 1), "#D3D3D3");
			this.drawLine(graph.centrePosition.getX() - 0.5 * graph.width, graph.centrePosition.getY() - distanceBetweenYTicks * (i + 1), graph.centrePosition.getX() + 0.5 * graph.width, graph.centrePosition.getY() - distanceBetweenYTicks * (i + 1), "#D3D3D3");
		}
	}

	drawXGrids(graph) {
		for (let i = 12.5; i < graph.width; i += 12.5) {
			this.drawLine(
				graph.centrePosition.getX() - 0.5 * graph.width + i * graph.scale.getX(),
				graph.centrePosition.getY() + graph.height,
				graph.centrePosition.getX() - 0.5 * graph.width + i * graph.scale.getX(),
				graph.centrePosition.getY() - graph.height,
				"#D3D3D3"
			);
		}
	}

	drawTicks(graph) {
		const distanceBetweenYTicks = graph.height / 6;
		for (let i = 0; i < 5; i++) {
			this.drawLine(graph.centrePosition.getX() - 0.525 * graph.width, graph.centrePosition.getY() + distanceBetweenYTicks * (i + 1), graph.centrePosition.getX() - 0.475 * graph.width, graph.centrePosition.getY() + distanceBetweenYTicks * (i + 1));
			this.drawLine(graph.centrePosition.getX() - 0.525 * graph.width, graph.centrePosition.getY() - distanceBetweenYTicks * (i + 1), graph.centrePosition.getX() - 0.475 * graph.width, graph.centrePosition.getY() - distanceBetweenYTicks * (i + 1));
		}
	}

	drawGraph(graph) {
		const lineCoordinates = {
			middleLeft: new Position(graph.centrePosition.getX() - this.width * 0.25, graph.centrePosition.getY()),
			middleRight: new Position(graph.centrePosition.getX() + this.width * 0.25, graph.centrePosition.getY()),
			topLeft: new Position(graph.centrePosition.getX() - this.width * 0.25, graph.centrePosition.getY() - this.height * 0.25),
			topRight: new Position(graph.centrePosition.getX() + this.width * 0.25, graph.centrePosition.getY() - this.height * 0.25),
			bottomRight: new Position(graph.centrePosition.getX() + this.width * 0.25, graph.centrePosition.getY() + this.height * 0.25),
			bottomLeft: new Position(graph.centrePosition.getX() - this.width * 0.25, graph.centrePosition.getY() + this.height * 0.25),
		};
		if (this.showGrids) {
			this.drawYGrids(graph);
			this.drawXGrids(graph);
		}
		// drawing the graph axis
		this.drawAxis(lineCoordinates);
		// drawing boundaries between graphs
		this.drawBorders(lineCoordinates);
		const yAxisTitlePosition = graph.translateDataToCanvasPlane(new Position(10, 110));
		this.drawText(graph.axisY + " " + graph.unitsY + " (" + graph.axisYComponent + ")", yAxisTitlePosition.getX(), yAxisTitlePosition.getY(), "black");
		const xAxisTitlePosition = graph.translateDataToCanvasPlane(new Position(280, 10));
		this.drawText(graph.axisX + " (s)", xAxisTitlePosition.getX(), xAxisTitlePosition.getY(), "black");
	}

	drawYScales(graph) {
		let yValueScale;
		const xPosOfYScale = graph.centrePosition.getX() - this.width * 0.225;
		for (let i = 0; i < 5; i++) {
			yValueScale = graph.roundToSignificantFigures(20 * (i + 1) * (1 / graph.scale.getY()), 3);
			this.drawText(yValueScale, xPosOfYScale, graph.centrePosition.getY() - (i + 1) * 20, "black");
			this.drawText("-" + yValueScale, xPosOfYScale, graph.centrePosition.getY() + (i + 1) * 20, "black");
		}
	}

	drawXScales(graph) {
		let index;
		let position;
		const counter = Math.floor(50 / graph.scale.getX());
		for (let i = counter; i < graph.queue.getLength(); i += counter) {
			index = graph.queue.getQueueIndex(i);
			position = graph.translateDataToCanvasPlane(new Vector2(i * graph.scale.getX()));
			// draws the x axis scales
			this.drawText(graph.queue.data[index][2], position.getX(), graph.centrePosition.getY() + 20, "black");
		}
	}

	plotData(graph) {
		let position; let positionNext; let index; let indexNext;
		const xScale = graph.scale.getX();
		for (let i = 0; i < graph.queue.getLength() - 1; i++) {
			// gets the data iteratively from oldest to newest using getQueueIndex
			index = graph.queue.getQueueIndex(i);
			indexNext = graph.queue.getQueueIndex(i + 1);
			position = graph.translateDataToCanvasPlane(new Position(i * xScale, graph.queue.data[index][0]));
			positionNext = graph.translateDataToCanvasPlane(new Position((i + 1) * xScale, graph.queue.data[indexNext][0]));
			this.drawLine(position.getX(), position.getY(), positionNext.getX(), positionNext.getY(), "black", 1);
		}
		this.drawXScales(graph);
		this.drawYScales(graph);
	}

	animateFrame() {
		this.drawBackground();
		for (const graph of this.graphs) {
			if (this.trackedObject && this.running) {
				graph.addData(this.trackedObject);
			}
			this.drawGraph(graph);
			this.plotData(graph);
			this.drawTicks(graph);
		}
	}
}
