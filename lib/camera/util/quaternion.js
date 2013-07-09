/**
 * Created with JetBrains WebStorm.
 * User: imoo
 * Date: 13. 7. 5
 * Time: 오후 9:17
 * To change this template use File | Settings | File Templates.
 */


quaternion = function(_x, _y, _z, _w){
    var x=epsilon(_x), y= epsilon(_y), z=epsilon(_z), w=epsilon(_w);

    function epsilon( value ) {
        return Math.abs( value ) < 0.000001 ? 0 : value;
    };


    return {
        set: function(_x, _y, _z, _w){
            x = _x;
            y = _y;
            z = _z;
            w = _w;
        },
        getX: function(){
            return epsilon(x);
        },
        setX: function( _x ){
            x = _x;
        },
        getY: function(){
            return epsilon(y);
        },
        setY: function( _y ){
            y = _y;
        },
        getZ: function(){
            return epsilon(z);
        },
        setZ: function( _z ){
            z = _z;
        },
        getW: function(){
            return epsilon(w);
        },
        setW: function( _w ){
            w = _w;
        },
        normalize: function(){
            var length = Math.sqrt( x*x + y*y + z*z + w*w );

            x = x/length;
            y = y/length;
            z = z/length;
            w = w/length;

            return this;
        },
        subtract: function( v1, v2 ){
            x = v1.getX() - v2.getX();
            y = v1.getY() - v2.getY();
            z = v1.getZ() - v2.getZ();
            w = v1.getW() - v2.getW();
            return this;
        },
        add: function( v1, v2 ){
            x = v1.getX() + v2.getX();
            y = v1.getY() + v2.getY();
            z = v1.getZ() + v2.getZ();
            w = v1.getW() + v2.getW();

            return this;
        },
        cross: function( v1, v2 ){
            x = epsilon( v1.getW()*v2.getX() + v1.getX()*v2.getW() + v1.getY()*v2.getZ() - v1.getZ()*v2.getY() );
            y = epsilon( v1.getW()*v2.getY() + v1.getY()*v2.getW() + v1.getZ()*v2.getX() - v1.getX()*v2.getZ() );
            z = epsilon( v1.getW()*v2.getZ() + v1.getZ()*v2.getW() + v1.getX()*v2.getY() - v1.getY()*v2.getX() );
            w = epsilon( v1.getW()*v2.getW() - v1.getX()*v2.getX() - v1.getY()*v2.getY() - v1.getZ()*v2.getZ() );

            console.debug('cr'+x);

            return this;
        },
        crossBy: function(v2 ){
            var cx = epsilon( w*v2.getX() + x*v2.getW() + y*v2.getZ() - z*v2.getY() );
            var cy = epsilon( w*v2.getY() + y*v2.getW() + z*v2.getX() - x*v2.getZ() );
            var cz = epsilon( w*v2.getZ() + z*v2.getW() + x*v2.getY() - y*v2.getX() );
            var cw = epsilon( w*v2.getW() - x*v2.getX() - y*v2.getY() - z*v2.getZ() );

            x = cx;
            y = cy;
            z = cz;
            w = cw;

            return this;
        },
        conjugate: function(){
            x = -x;
            y = -y;
            z = -z;
            //w = w;
            return this;
        },
        getConjugate: function(){
            return quaternion( -x, -y, -z, w );
        },
        scalar: function( v ){
            x = x*v;
            y = y*v;
            z = z*v;

            return this;
        },
        dot: function( v1, v2){
            var result = v1.getX()*v2.getX() + v1.getY()*v2.getY() + v1.getZ()*v2.getZ();
            return result;
        },
        dot: function( v ){
            var result = x* v.getX() + y* v.getY() + z* v.getZ();
            return result;
        },
        length: function(){
            return Math.sqrt( x*x + y*y + z*z );
        },
        vectorXmatrix: function( m, v ){
            x = m.x0 * v.getX() + m.x1 * v.getY() + m.x2* v.getZ();
            y = m.y0 * v.getX() + m.y1 * v.getY() + m.y2* v.getZ();
            z = m.z0 * v.getX() + m.z1 * v.getY() + m.z2* v.getZ();
            w = m.t0 * v.getX() + m.t1 * v.getY() + m.t2* v.getZ();
            return this;
        },
        getAxisAngle: function(){
            var data = {};
            var scale = Math.sqrt( x*x + y*y +z*z );
            console.debug( 'sc'+x, scale );
            console.debug( 'sc'+y, scale );
            console.debug( 'sc'+z, scale );
            console.debug( 'sc'+w, scale );

            data.axis = vector3();
            data.axis.setX( x/scale );
            data.axis.setY( y/scale );
            data.axis.setZ( z/scale );

            data.angle = Math.acos( w )*2.0;

            return data;
        },
        inverse: function(){
            var squaredNorm =  x*x + y*y + z*z +w*w;
            x = -x/squaredNorm;
            y = -y/squaredNorm;
            z = -z/squaredNorm;
            w = w/squaredNorm;

            return this;
        },
        getInverse: function(){
            var sNorm =  x*x + y*y + z*z +w*w;
            return quaternion( -x/sNorm, -y/sNorm, -z/sNorm, w/sNorm );
        }
    };
}

