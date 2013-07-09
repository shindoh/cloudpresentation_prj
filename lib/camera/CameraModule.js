var CameraModule = function(options)
{
    if(!options)
        options = {};

    var viewPort = options.viewPort ? options.viewPort : $('#viewPort');
    var world = $("<div id='world'></div>");
    viewPort.append(world);
      console.log(viewPort);
    var width = world.css('width');
    var height = world.css('height');

    this.mCamera = new Camera();

    var worker = new Worker('/lib/camera/RenderFPS.js');
    worker.postMessage();
    var this_ = this;
    worker.onmessage = function()
    {
        if( this_.mCamera.isTransformed() ){
            console.debug( 'transform! :D');
            world.css({
                webkitTransform: 'matrix3d('+mCamera.getMatrixQuery()+')'
            });
        }
    }
}


CameraModule.prototype.getCamera = function()
{
    return this.mCamera;
}

