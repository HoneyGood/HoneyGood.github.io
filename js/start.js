
//function for acceleration
function getA(V1, V2, B1, B2, qDELm, E) {
    return (parseFloat(qDELm)*(parseFloat(parseFloat(V1)*parseFloat(B1))-parseFloat(parseFloat(V2)*parseFloat(B2))+parseFloat(E)))
}
//function for coordinates
function getCord(cord0, V, dt, a) {
    return parseFloat(parseFloat(cord0) + parseFloat(parseFloat(V) * parseFloat(dt)) + parseFloat((parseFloat(a) * parseFloat(parseFloat(dt) * parseFloat(dt)) * 0.5)));}

//main function
function start() {

    // language=JQuery-CSS
    var X0 = new $('#X0').val(); /*Get start coordinates*/
    var Y0 =new $('#Y0').val();
    var Z0 = $('#Z0').val();

    var VX =new $('#VX').val(); /*Get start velocity projection */
    var VY =new $('#VY').val();
    var VZ =new $('#VZ').val();

    var Ex =new $('#Ex').val(); /*Get start electric field projection*/
    var Ey =new $('#Ey').val();
    var Ez =new $('#Ez').val();

    var Bx =new $('#Bx').val(); /*Get start magnetic field projection*/
    var By =new $('#By').val();
    var Bz =new $('#Bz').val();

    var dt = new $('#dt').val(); /*Get dt*/
    var t =new $('#t').val(); /*Get t*/
    var qDELm =new $('#q').val() / $('#m').val(); /*Get const "q" divided "m" */

    var ax, ay, az; /*for algorithm*/
    var x, y, z;

    /*Create camera and set position*/
    var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(20, 5, 30);

    /*Create scene(space scene)*/
    var scene = new THREE.Scene();

    /*Create light and set position*/
    var light = new THREE.PointLight();
    light.position.set(0, 20, 50);
    scene.add(light); //add light


    var renderer = renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    //start creating vector
    //material vector (color)
    var material = new THREE.LineBasicMaterial({ color: 0xffb02e });
    /*we take the coordinates after the first tick of the algorithm and build a vector*/
    var geometry = new THREE.Geometry();
    //first coordinates
    geometry.vertices.push(new THREE.Vector3(X0, Y0, Z0));


    ax = getA(VY, VZ, Bz, By, qDELm, Ex);
    ay = getA(VZ,VX ,Bx , Bz, qDELm, Ey);
    az = getA(VX, VY, By, Bx, qDELm, Ez);

    x = getCord(X0, VX, dt, ax);
    y = getCord(Y0, VY, dt, ay);
    z = getCord(Z0, VZ, dt, az);
    //second coordinates (increased by 1000 for clarity on 3d graf)
    geometry.vertices.push(new THREE.Vector3((parseFloat(x))*1000.0, (parseFloat(y))*1000.0, (parseFloat(z))*1000.0));
    //create vector
    var line = new THREE.Line(geometry, material);
    line.type.big().bold();
    scene.add(line);//add vector on scene


    //axes OX OY OZ
    var axes = new THREE.AxisHelper(200);
    scene.add(axes);
    //grid-plane
    var plane = new THREE.GridHelper(50, 50);
    scene.add(plane);

    //sphere (start point)                            (radius,line frequency on top,line frequency on bottom)
    var sphereGeometryBase = new THREE.SphereGeometry(.15, 100, 100);
    var sphereMaterialBase = new THREE.MeshBasicMaterial(
        {color: 0xeada42, wireframe: true});
    //set coordinates for start point sphere
    var sphereBase = new THREE.Mesh(sphereGeometryBase, sphereMaterialBase);
    sphereBase.position.x = X0;
    sphereBase.position.y = Y0;
    sphereBase.position.z = Z0;
    scene.add(sphereBase);
    //graph points(spheres) parameters          (radius,line on top, bottom)-look like line
    var sphereGeometry = new THREE.SphereGeometry(.01, .01, .01);
    var sphereMaterial = new THREE.MeshBasicMaterial(
        {color: 0xFF00FF, wireframe: true});

    /*algorithm: until the end of "t" build points*/
    //t-dt!!! after tick algorithm
    while (t > 0) {
        //function for get "a"
        ax = getA(VY, VZ, Bz, By, qDELm, Ex);
        ay = getA(VZ,VX ,Bx , Bz, qDELm, Ey);
        az = getA(VX, VY, By, Bx, qDELm, Ez);
        //function for get coordinates
        x = getCord(X0, VX, dt, ax);
        y = getCord(Y0, VY, dt, ay);
        z = getCord(Z0, VZ, dt, az);



        //create tiny sphere
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.x = x;
        sphere.position.y = y;
        sphere.position.z = z;
        scene.add(sphere);

        //set new coordinates and speed; parseFloat() - bad coding :(
        VX = parseFloat(parseFloat(parseFloat(ax) * parseFloat(dt))+parseFloat(VX));
        VY = parseFloat(parseFloat(parseFloat(ay) * parseFloat(dt))+parseFloat(VY));
        VZ = parseFloat(parseFloat(parseFloat(az) * parseFloat(dt))+parseFloat(VZ));

        X0 = x;
        Y0 = y;
        Z0 = z;

        t -= parseFloat(dt); //reduce "t"
    }
        //set render on web page (html page on id="WebGL-output")
        $('#WebGL-output').html(renderer.domElement)

    //for move camera
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}