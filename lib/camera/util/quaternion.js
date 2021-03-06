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
    }


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
        },
        //pitch(y) yaw(z) roll(x)
        quaternionFromEulerAngle: function(x, y, z){
            var p = y/2;
            var y = z/2;
            var r = x/2;
            var sinp = Math.sin( p/180*Math.PI );       //pitch
            var siny = Math.sin( y/180*Math.PI );       //yaw
            var sinr = Math.sin( r/180*Math.PI );       //roll
            var cosp = Math.cos( p/180*Math.PI );
            var cosy = Math.cos( y/180*Math.PI );
            var cosr = Math.cos( r/180*Math.PI );
            //console.debug( sinp+':'+siny+':'+':'+sinr+':'+cosp+':'+cosy+':'+cosr);

            var qx = sinr * cosp * cosy - cosr * sinp * siny;
            var qy = cosr * sinp * cosy + sinr * cosp * siny;
            var qz = cosr * cosp * siny - sinr * sinp * cosy;
            var qw = cosr * cosp * cosy + sinr * sinp * siny;

            var quatern = quaternion(qx, qy, qz, qw );

            return quatern;
        },
        quaternionFromAxisAngle: function(axis, angle){
            var sinAngle;
            var vn = vector3(axis.getX(), axis.getY(), axis.getZ());

            vn.normalize();
            var radian = angle/180*Math.PI;
            sinAngle = Math.sin( radian*0.5 );
            var qx = vn.getX() * sinAngle;
            var qy = vn.getY() * sinAngle;
            var qz = vn.getZ() * sinAngle;
            var qw = Math.cos( radian*0.5 );

            var quatern = quaternion(qx, qy, qz, qw );

            return quatern;
        },
        fromAxisAngle: function(axis, angle){
            var sinAngle;
            var vn = vector3(axis.getX(), axis.getY(), axis.getZ());

            vn.normalize();
            var radian = angle/180*Math.PI;
            sinAngle = Math.sin( radian*0.5 );
            x = vn.getX() * sinAngle;
            y = vn.getY() * sinAngle;
            z = vn.getZ() * sinAngle;
            w = Math.cos( radian*0.5 );

            return this;
        },
        quaternionToMatrix: function(q){
            var x2 = epsilon( q.getX() * q.getX() );
            var y2 = epsilon( q.getY() * q.getY() );
            var z2 = epsilon( q.getZ() * q.getZ() );
            var xy = epsilon( q.getX() * q.getY() );
            var xz = epsilon( q.getX() * q.getZ() );
            var yz = epsilon( q.getY() * q.getZ() );
            var wx = epsilon( q.getW() * q.getX() );
            var wy = epsilon( q.getW() * q.getY() );
            var wz = epsilon( q.getW() * q.getZ() );

            var matrix4 = {};
            matrix4.x0 = epsilon(1.0 - 2.0*(y2+z2));
            matrix4.x1 = epsilon(2.0*(xy-wz));
            matrix4.x2 = epsilon(2.0*(xz+wy));
            matrix4.x3 = 0.0;

            matrix4.y0 = epsilon(2.0*(xy+wz));
            matrix4.y1 = epsilon(1.0 - 2.0*(x2+z2));
            matrix4.y2 = epsilon(2.0*(yz-wx));
            matrix4.y3 = 0.0;

            matrix4.z0 = epsilon(2.0*(xz-wy));
            matrix4.z1 = epsilon(2.0*(yz+wx));
            matrix4.z2 = epsilon(1.0 - 2.0*(x2+y2));
            matrix4.z3 = 0.0;

            matrix4.t0 = 0.0;
            matrix4.t1 = 0.0;
            matrix4.t2 = 0.0;
            matrix4.t3 = 1.0;
            return matrix4;
        },
        matrixToQuery: function(m){
            return    m.x0 +',' + m.x1 +','+ m.x2 +','+ m.x3 +','
                + m.y0 +',' + m.y1 +','+ m.y2 +','+ m.y3 +','
                + m.z0 +',' + m.z1 +','+ m.z2 +','+ m.z3 +','
                + m.t0 +',' + m.t1 +','+ m.t2 +','+ m.t3;
        },
        getMatrix: function(){
            var x2 = epsilon( x * x );
            var y2 = epsilon( y * y );
            var z2 = epsilon( z * z );
            var xy = epsilon( x * y );
            var xz = epsilon( x * z );
            var yz = epsilon( y * z );
            var wx = epsilon( w * x );
            var wy = epsilon( w * y );
            var wz = epsilon( w * z );

            var matrix4 = {};
            matrix4.x0 = epsilon(1.0 - 2.0*(y2+z2));
            matrix4.x1 = epsilon(2.0*(xy-wz));
            matrix4.x2 = epsilon(2.0*(xz+wy));
            matrix4.x3 = 0.0;

            matrix4.y0 = epsilon(2.0*(xy+wz));
            matrix4.y1 = epsilon(1.0 - 2.0*(x2+z2));
            matrix4.y2 = epsilon(2.0*(yz-wx));
            matrix4.y3 = 0.0;

            matrix4.z0 = epsilon(2.0*(xz-wy));
            matrix4.z1 = epsilon(2.0*(yz+wx));
            matrix4.z2 = epsilon(1.0 - 2.0*(x2+y2));
            matrix4.z3 = 0.0;

            matrix4.t0 = 0.0;
            matrix4.t1 = 0.0;
            matrix4.t2 = 0.0;
            matrix4.t3 = 1.0;
            return matrix4;
        },
        getMatrixQuery: function(){
            return this.matrixToQuery( this.getMatrix() );

        },
        mulMatrix4: function( m1, m2 ){
            var m = {};
            m.x0 = epsilon( m1.x0*m2.x0+m1.x1*m2.y0+m1.x2*m2.z0+m1.x3+m2.t0);
            m.x1 = epsilon( m1.x0*m2.x1+m1.x1*m2.y1+m1.x2*m2.z1+m1.x3+m2.t1);
            m.x2 = epsilon( m1.x0*m2.x2+m1.x1*m2.y2+m1.x2*m2.z2+m1.x3+m2.t2);
            m.x3 = epsilon( m1.x0*m2.x3+m1.x1*m2.y3+m1.x2*m2.z3+m1.x3+m2.t3);

            m.y0 = epsilon( m1.y0*m2.x0+m1.y1*m2.y0+m1.y2*m2.z0+m1.y3+m2.t0);
            m.y1 = epsilon( m1.y0*m2.x1+m1.y1*m2.y1+m1.y2*m2.z1+m1.y3+m2.t1);
            m.y2 = epsilon( m1.y0*m2.x2+m1.y1*m2.y2+m1.y2*m2.z2+m1.y3+m2.t2);
            m.y3 = epsilon( m1.y0*m2.x3+m1.y1*m2.y3+m1.y2*m2.z3+m1.y3+m2.t3);

            m.z0 = epsilon( m1.z0*m2.x0+m1.z1*m2.y0+m1.z2*m2.z0+m1.z3+m2.t0);
            m.z1 = epsilon( m1.z0*m2.x1+m1.z1*m2.y1+m1.z2*m2.z1+m1.z3+m2.t1);
            m.z2 = epsilon( m1.z0*m2.x2+m1.z1*m2.y2+m1.z2*m2.z2+m1.z3+m2.t2);
            m.z3 = epsilon( m1.z0*m2.x3+m1.z1*m2.y3+m1.z2*m2.z3+m1.z3+m2.t3);

            m.t0 = epsilon( m1.t0*m2.x0+m1.t1*m2.y0+m1.t2*m2.z0+m1.t3+m2.t0);
            m.t1 = epsilon( m1.t0*m2.x1+m1.t1*m2.y1+m1.t2*m2.z1+m1.t3+m2.t1);
            m.t2 = epsilon( m1.t0*m2.x2+m1.t1*m2.y2+m1.t2*m2.z2+m1.t3+m2.t2);
            m.t3 = epsilon( m1.t0*m2.x3+m1.t1*m2.y3+m1.t2*m2.z3+m1.t3+m2.t3);

            return m;
        },
        getEulerAngle: function(){
            var theta = Math.asin( -2*(x*z-w*y));
            var psi = 0;
            var pi = 0;

            if( theta < Math.abs( Math.PI/2 ) ){
                psi = Math.atan2( 2*(x*y+w*z), w*w+x*x-y*y-z*z );
                pi = Math.atan2( 2*(y*z+w*x), w*w-x*x-y*y+z*z );

            }else{
                psi = Math.atan2( -2*(x*y+w*z), -(w*w+x*x-y*y-z*z) );
                pi = Math.atan2( -2*(y*z+w*x), -(w*w-x*x-y*y+z*z) );

            }

            return angle3(pi*180/Math.PI,theta*180/Math.PI,psi*180/Math.PI);
        }
    };
}