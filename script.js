//(MAJOR)----------- GLOBAL VARIABLES (DEFAULT JSON CORD) ---------------------
    /**
     * Helper Grid coordinates json
     * 
     * TODO: Meybe should be changed with more random numbers ?!
     */
    let mainGridJson = [
        { "x": -60, "y": -60, "z": 100, },
        { "x": -60, "y": 140, "z": 100, },
        { "x": 140, "y": 140, "z": 100, }
    ];

    /**
     * Helper Wire coordinates json
     * 
     * TODO: I think should be changed with more random numbers
     * In order to make more interesting wire.
     */
    let mainWireJson = [
        { "x": 5,  "y": 5, "z": 10, },
        { "x": 0,  "y": 80, "z": -10, },
        { "x": 80, "y": 80, "z": 4, },
        { "x": 80, "y": 0, "z": 0, },
        { "x": 5,  "y": 5, "z": 10 },
    ];
//(MAJOR)---------------------- MAIN JSON ARRAYS ------------------------------    
    let wireJson = [], middleWireJson = [], gridJson = [], wireDL = [], BMaxArr = [], BMaxArrCount = 0, gridCounter = [];
//(MAJOR)---------------- MAIN LOGIC OF BIOT-SAVART LAW -----------------------

    let gridXValue = 2, gridYValue = 2, gridZValue = 1, wireCordCount = 4;

    function addCoordinatesToWireMiddle(counter){
        let beginX = gridJson[counter-1].x, beginY = gridJson[counter-1].y, beginZ = gridJson[counter-1].z;
        let counterOfDL = 0, sumOfdB = 0
        let dB = {"x":0, "y":0, "z":0}, B = {"x":0, "y":0, "z":0};
        let arrayOfdB = [];
        let maxX = -99999, maxY = -99999, maxZ = -99999;
      
        for( let i = 0 ; i < middleWireJson.length; i++ ){
            
            let rx = beginX - middleWireJson[i].x;
            let ry = beginY - middleWireJson[i].y;
            let rz = beginZ - middleWireJson[i].z;

            let dlx = wireJson[i+1].x - wireJson[i].x; 
            let dly = wireJson[i+1].y - wireJson[i].y; 
            let dlz = wireJson[i+1].z - wireJson[i].z; 
            
            let rk = (rx*rx+ry*ry+rz*rz);

            dB.x = ry*dlz - rz*dly;
            dB.y = rz*dlx - rx*dlz;
            dB.z = rx*dly - ry*dlx;

            dB.x /= rk;
            dB.y /= rk;
            dB.z /= rk;

            B.x += (dB.x);
            B.y += (dB.y);
            B.z += (dB.z);

        }
        
        gridJson[counter] = {"x": B.x, "y": B.y, "z": B.z};
        gridCounter.push(counter);
        counter++;
        counter = comeBackToBegin(beginX, beginY, beginZ, counter);

        BMaxArr[BMaxArrCount] = Math.sqrt((B.x*B.x)+(B.y*B.y)+(B.z*B.z));
        BMaxArrCount++;

        return counter;
    }

//(MAJOR)------------- RETURN TO BEGIN COORDINATES (HELPER) -------------------
    function comeBackToBegin(beginX, beginY, beginZ, counter){
        gridJson[counter] = {"x": beginX, "y": beginY, "z": beginZ};
        counter++;

        return counter;
    }

//(MAJOR)-------------------- MATHEMATIC FUNCTIONS ----------------------------

    function calculateR(gridX, gridY, gridZ, wireMidX, wireMidY, wireMidZ){
        let deltaX = gridX - wireMidX;
        let deltaY = gridY - wireMidY;
        let deltaZ = gridZ - wireMidZ;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
    }

    function setDL(){
        let saveLastCoordinate;
        wireDL = wireJson.map(function(cord, index){
            if(index > 0){
                let deltaX = cord.x - saveLastCoordinate.x;
                let deltaY = cord.y - saveLastCoordinate.y;
                let deltaZ = cord.z - saveLastCoordinate.z;
                saveLastCoordinate = cord;
                return Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);

            }
            else{
                saveLastCoordinate = cord;
            }
        });
        wireDL.shift();
    }


//(MAJOR)---------------- HELPERS OF FIRST GRID SETTER ------------------------

    function collectGridYCoordinates(counter, counterFirst, yDiff){
        for (let j = 1; j <= (gridYValue-1); j++) {
            gridJson[counter] = {"x": gridJson[counterFirst].x, "y": gridJson[counterFirst].y+(yDiff*j), "z": gridJson[counterFirst].z};
            counter++;
            counter = addCoordinatesToWireMiddle(counter);
        }
    }

    function collectGridXCoordinates(counter, counterFirst, xDiff, yDiff){
        for (let j = 1; j <= (gridXValue-1); j++) {
            gridJson[counter] = {"x": gridJson[counterFirst].x+(xDiff*j), "y": gridJson[counterFirst].y, "z": gridJson[counterFirst].z};
            counter++;
            counter = addCoordinatesToWireMiddle(counter);
            let x = counter-1;
            let beginX = gridJson[x].x;
            let beginY = gridJson[x].y;
            let beginZ = gridJson[x].z;
            for (var z = 1 ; z <= (gridYValue-1); z++) {
                gridJson[counter] = {"x": gridJson[x].x, "y": gridJson[x].y-(yDiff*z), "z": gridJson[x].z};
                counter++;
                gridJson[counter] = {"x": gridJson[counter-1].x-(xDiff), "y": gridJson[counter-1].y, "z": gridJson[x].z};
                counter++;
                counter = addCoordinatesToWireMiddle(counter);
                gridJson[counter] = {"x": gridJson[counter-1].x+(xDiff), "y": gridJson[counter-1].y, "z": gridJson[x].z};
                counter++;
                counter = addCoordinatesToWireMiddle(counter);
            }
            gridJson[counter] = {"x": beginX, "y": beginY, "z": beginZ};
            counter++;
        }
    }

//(MAJOR)------------------ SETTER OF THE FIRST GRID --------------------------

    /**
     * Function which one sets Grid json
     * 
     * TODO: refactor whole function to smaller parts
     */
    function setGridCoordinates(){
        if(gridXValue != 0 && gridYValue != 0 && gridZValue != 0){
            let saveLast = {}, counter, counterFirst;
            let xDiff, yDiff, zDiff;
            for (var i = 0; i < mainGridJson.length; i++) {
                if( i > 0 ){
                    if(saveLast.x != mainGridJson[i].x){

                        xDiff = (mainGridJson[i].x - saveLast.x) / (gridXValue-1);    
                        zDiff = (mainGridJson[i].z + saveLast.z) / (gridZValue-1);
                        counter = gridJson.length;
                        counterFirst = counter-1;

                        collectGridXCoordinates(counter, counterFirst, xDiff, yDiff);
                        
                        //Make clone of grid in other side
                        if(gridZValue > 1) {
                            makeCloneOfGrid(yDiff, xDiff, zDiff);
                        }
                    }
                    if(saveLast.y != mainGridJson[i].y){
                        counter = gridJson.length;
                        counterFirst = counter-1;
                        yDiff = (mainGridJson[i].y - saveLast.y) / (gridYValue-1);
                        collectGridYCoordinates(counter, counterFirst, yDiff);
                        saveLast = mainGridJson[i];
                    }
                }
                else{
                    gridJson.push(mainGridJson[i]);
                    saveLast = mainGridJson[i];
                }
            };
        }
    }

//(MAJOR)------------- SETTER OF MIRROR GRID (SECOND GRID) --------------------

    /**
     * Function which ones make clone of made grid
     * 
     * @param {float} yDiff 
     * @param {float} xDiff 
     */
    function makeCloneOfGrid(yDiff, xDiff, zDiff){
        counter = gridJson.length-1;
        let beginX, beginY, beginZ;
        for (let i = 1; i <= (gridXValue); i++) {
            counter = changeGridCoordinatesSideSubstract(counter, zDiff, yDiff);//substract
            beginX = gridJson[counter].x;
            beginY = gridJson[counter].y;
            beginZ = gridJson[counter].z;
            counter = addCoordinatesToWireMiddle(counter+1);
            counter--;
            
            for (var j = 1; j <= (gridYValue-1); j++) {
                counter = subtractDifferenceOfYCoordinates(counter, yDiff);
                counter = addCoordinatesToWireMiddle(counter+1);
                counter--;
                counter = changeGridCoordinatesSide(counter, zDiff, yDiff);
                counter = changeGridCoordinatesSideSubstract(counter, zDiff, yDiff);//substract

                if(i > 0 && i != gridXValue){//paeiti i desne
                    counter = subtractDifferenceOfXCoordinates(counter, xDiff);
                    counter = addDifferenceOfXCoordinates(counter, xDiff);
                }
            }
            gridJson[gridJson.length] = {"x": beginX, "y": beginY, "z": beginZ};
            counter++;
            if(i != gridXValue){//paeiti i desne
                counter = subtractDifferenceOfXCoordinates(counter, xDiff);
                counter = changeGridCoordinatesSide(counter, zDiff, yDiff);
            }
        }

        counter = subtractDifferenceOfYCoordinates(counter, yDiff);
    }

//(MAJOR)------------------ SETTER OF WIRE COORDINATES ------------------------

    /**
     * Function which one sets coordinates of Wire
     */
    function setWireCoordinates(){
        if(wireCordCount != 0){
            wireJson = mainWireJson;
            let tmp = [
                {"x":-20, "y": 40, "z": 0},
                {"x":40, "y": 100, "z": 0},
                {"x":100, "y": 40, "z": 0},
                {"x":40, "y": -20, "z": 0},
            ];
            let i = 0;
            let j = 1;
            const count = wireJson.length;
            for( i = 0 ; i <= ((wireCordCount) - count); i++){
                    wireJson.splice(j, 0, tmp[i]);
                    j+=2;
            }
        }
    }

//(MAJOR)-------------- SETTER OF WIRE MIDDLE COORDINATES ---------------------
    function setMiddleCoordinatesOfWire(){
        let lastCord, xCord, yCord, zCord;
        middleWireJson = wireJson.map(function(cord, index){
            if(index > 0){
                xCord = divideBiggerNumber(lastCord.x, cord.x);
                yCord = divideBiggerNumber(lastCord.y, cord.y);
                zCord = divideBiggerNumber(lastCord.z, cord.z);
                lastCord = cord;
                return {"x":xCord, "y": yCord, "z": zCord};

                } else {
                    lastCord = cord;
                }
        });
        middleWireJson.shift();
    }

    function divideBiggerNumber(firstCord, secondCord){
        if(firstCord != secondCord){
            return (firstCord+secondCord) / 2;
        }
        return secondCord;
    }


//(MID - Starting point) -------- BUTTON CLICK --------------------------------

    /**
     * On click collect all coordinates and show geometries
     */
    const calculateButton = document.querySelector('.save');
    let buttonClicked = false;
    $(calculateButton).on( "click", function() {

        setWireCoordinates();
        setMiddleCoordinatesOfWire();
        setDL();//length between the coordinates
        setGridCoordinates();
        
        $(navbar).hide();
        $(menu).hide();

        if(buttonClicked == false){
            init();
            animate();
        }
        buttonClicked = true;
    });

    

//(MID)---------------- HELPERS (For setting coordinates) ---------------------
    function addDifferenceOfXCoordinates(counter, xDiff){
        gridJson[counter+1] = {"x": gridJson[counter].x+xDiff, "y": gridJson[counter].y, "z": gridJson[counter].z};
        counter++;
        return counter;
    }

    function subtractDifferenceOfXCoordinates(counter, xDiff){
        gridJson[counter+1] = {"x": gridJson[counter].x-xDiff, "y": gridJson[counter].y, "z": gridJson[counter].z};
        counter++;
        return counter;
    }

    function addDifferenceOfYCoordinates(counter, yDiff){
        gridJson[counter+1] = {"x": gridJson[counter].x, "y": gridJson[counter].y+yDiff, "z": gridJson[counter].z};
        counter++;
        return counter;
    }
    function changeGridCoordinatesSide(counter, zDiff, yDiff, add){
        gridJson[counter+1] = {"x": gridJson[counter].x, "y": gridJson[counter].y, "z": gridJson[counter].z*(-1)};
        counter++;
        return counter;
    }

    function changeGridCoordinatesSideSubstract(counter, zDiff, yDiff){
        for (let i = 1; i <= (gridZValue-1); i++) {
            gridJson[counter+1] = {"x": gridJson[counter].x, "y": gridJson[counter].y, "z": gridJson[counter].z-zDiff};
            counter++;
            counter = addCoordinatesToWireMiddle(counter+1);
            counter--;
        }

        return counter;
    }


    function subtractDifferenceOfYCoordinates(counter, yDiff){
        gridJson[counter+1] = {"x": gridJson[counter].x, "y": gridJson[counter].y-yDiff, "z": gridJson[counter].z};
        counter++;
        return counter;
    }





//(MINOR)---------------------- GEOMETRY DRAWERS ------------------------------

    /**
     * Default Three.js variables to render geometries
     */
    let wirePositions = [], gridPositions = [];
    let wireColors = [], gridColors = [];

    /**
     * Function which one draw WIRE
     * 
     * TODO: Should be possible to make on function of Grid and Wire drawer.
     * 
     * @param {object} wireGeometry 
     */
    function drawWire(wireGeometry){
        wireJson.forEach(function(cord) {
            wirePositions.push( cord.x, cord.y, cord.z );
            let color = new THREE.Color( 'red' );
            wireColors.push(0xff0000);
            wireColors.push(color);
            wireColors.push(color);
        });

        wireGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( wirePositions, 3 ) );
        wireGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( wireColors, 3 ) );
        wireGeometry.computeBoundingSphere();

        return wireGeometry;
    }

    /**
     * Function which one draw Grid
     * 
     * TODO: Should be possible to make on function of Grid and Wire drawer.
     * 
     * @param {object} gridGeometry 
     */
    function drawGrid(gridGeometry){
        let max = Math.max(...BMaxArr);
        for(let i = 0; i < gridCounter.length; i++){
            gridJson[gridCounter[i]].x /= max/(100);
            gridJson[gridCounter[i]].y /= max/(100);
            gridJson[gridCounter[i]].z /= max/(100);
        }

        gridJson.forEach(function(cord) {
            gridPositions.push( cord.x, cord.y, cord.z );
            gridColors.push(0x222222);
            gridColors.push(0x222222);
            gridColors.push(0x222222);
        });

        gridGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( gridPositions, 3 ) );
        gridGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( gridColors, 3 ) );
        gridGeometry.computeBoundingSphere();

        return gridGeometry;
    }


//(MINOR)----------------------- DEFAULT RENDER -------------------------------

    /**
     * Default Three.js variables
     */
    let camera, scene, renderer, controls;
    let mesh;

    /**
     * Initial function which one give command to draw geometries and configure camera settings
     */
    function init() {
        scene = new THREE.Scene();
        let wireGeometry = new THREE.BufferGeometry();
        let gridGeometry = new THREE.BufferGeometry();
        let material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

        /** DRAW WIRE AND ADD TO SCENE **/
        wireGeometry = drawWire(wireGeometry);
        mesh = new THREE.Line( wireGeometry, material );
        scene.add( mesh );
        
        /** DRAW GRID AND ADD TO SCENE **/
        gridGeometry = drawGrid(gridGeometry);
        mesh = new THREE.Line( gridGeometry, material );
        scene.add( mesh );

        configureCameraSettings();
    }

//(MINOR)------------------ THREE.js MAIN FUNCTIONS ---------------------------

    /**
     * Declares window size in which one should be render geometry 
     */
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    /**
     * Animates geometry in 60FPS
     */
    function animate() {
        requestAnimationFrame( animate );
        render();
    }

    /**
     * Renders geometry
     */
    function render() {
        renderer.render( scene, camera );
    }

//(MINOR)----------------------- CAMERA SETTINGS ------------------------------

    /**
     * Default camera settings like (size, or there are possibility to move geometry with mouse)
     */
    function configureCameraSettings(){
        camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 1, 4000 );
        camera.position.z = 2750;
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        container.appendChild( renderer.domElement );
        window.addEventListener( 'resize', onWindowResize, false );
    }


//(MINOR)------------------------ DATA SELECTORS ------------------------------

    const container = document.querySelector('.container');
    const selectWire = document.querySelector('.wire-select-field');
    const selectGridX = document.querySelector('.grid-select-field-x');
    const selectGridY = document.querySelector('.grid-select-field-y');
    const selectGridZ = document.querySelector('.grid-select-field-z');
    const navbar = document.querySelector('.navbar');
    const menu = document.querySelector('.menu');

    /**
     * Selector of wire coordinates count and casting it to integer
     */
    $(selectWire).on( "change", function() {
    wireCordCount = parseInt($(selectWire).val());
    });

    /**
     * Selector of Grid X coordinates count (width) and casting it to integer
     */
    $(selectGridX).on( "change", function() {
    gridXValue = parseInt($(selectGridX).val());
    });

    /**
     * Selector of Grid Y coordinates counts (height) and casting it to integer
     */
    $(selectGridY).on( "change", function() {
    gridYValue = parseInt($(selectGridY).val());
    });

    /**
     * Selector of Grid Z count of how much grids will be in geometry and casting it to integer
     */
    $(selectGridZ).on( "change", function() {
    gridZValue = parseInt($(selectGridZ).val());
    });

    //-----------------------------------------------------------------------------