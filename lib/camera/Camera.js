/**
 * Created with JetBrains WebStorm.
 * User: imoo
 * Date: 13. 7. 3
 * Time: 오후 11:20
 * To change this template use File | Settings | File Templates.
 */

Camera = function(){
    var eye = vector3(0, 0, 0);
    var mQuaternion = null;
    var speed = 3;
    var transformed = false;
    var quaternMatrix4 = {};

    function initilize(){
        mQuaternion = quaternionFromAxisAngle( vector3(1, 0, 0), 0 );
    }

    function mulMatrix4( m1, m2 ){
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
    }
    function epsilon( value ) {
        return Math.abs( value ) < 0.000001 ? 0 : value;
    }

    //pitch(y) yaw(z) roll(x)
    function quaternionFromEulerAngle(x,y,z){
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
    }
    function quaternionFromAxisAngle(dir, angle){
        var sinAngle;
        var vn = vector3(dir.getX(), dir.getY(), dir.getZ());

        vn.normalize();
        var radian = angle/180*Math.PI;
        sinAngle = Math.sin( radian*0.5 );
        var qx = vn.getX() * sinAngle;
        var qy = vn.getY() * sinAngle;
        var qz = vn.getZ() * sinAngle;
        var qw = Math.cos( radian*0.5 );



        var quatern = quaternion(qx, qy, qz, qw );



        return quatern;
    }
    function quaternionToMatrix( q ){
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
    }

    function matrixToQuery(m){
        return    m.x0 +',' + m.x1 +','+ m.x2 +','+ m.x3 +','
            + m.y0 +',' + m.y1 +','+ m.y2 +','+ m.y3 +','
            + m.z0 +',' + m.z1 +','+ m.z2 +','+ m.z3 +','
            + m.t0 +',' + m.t1 +','+ m.t2 +','+ m.t3
    }
    initilize();


    return {
        lookAt: function(){
            //may be position
            quaternMatrix4.t0 = epsilon( -eye.getX() );
            quaternMatrix4.t1 = epsilon( eye.getY() );
            quaternMatrix4.t2 = epsilon( -eye.getZ() );
            quaternMatrix4.t3 = 1.0;

            return quaternMatrix4;
        },
        looAtQuery: function(){
            transformed = false;
            return matrixToQuery( this.lookAt() );
        },
        getMatrixQuery: function(){
            //may be position
            transformed = false;
            quaternMatrix4.t0 = epsilon( -eye.getX() );
            quaternMatrix4.t1 = epsilon( eye.getY() );
            quaternMatrix4.t2 = epsilon( -eye.getZ() );
            quaternMatrix4.t3 = 1.0;



            return matrixToQuery( quaternMatrix4 );
        },

        //move camera
        moveUp: function(){
            eye.setY( eye.getY() + speed );
            transformed = true;
        },
        moveDown: function(){
            eye.setY( eye.getY() - speed );
            transformed = true;
        },
        moveRight: function(){
            eye.setX( eye.getX() + speed );
            transformed = true;
        },
        moveLeft: function(){
            eye.setX( eye.getX() - speed );
            transformed = true;
        },
        moveFor: function(){
            eye.setZ( eye.getZ() - speed );
            transformed = true;
        },
        moveBack: function(){
            eye.setZ( eye.getZ() + speed );
            transformed = true;
        },

        //rotate camera
        rotateX: function( dx ){
            var xq = quaternionFromAxisAngle( vector3(1, 0, 0), dx );
            mQuaternion = mQuaternion.crossBy( xq );
            quaternMatrix4 = quaternionToMatrix( mQuaternion );
            transformed = true;
        },
        rotateY: function( dy ){
            var yq = quaternionFromAxisAngle( vector3(0, 1, 0), dy );
            mQuaternion = yq.crossBy( mQuaternion );
            quaternMatrix4 = quaternionToMatrix( mQuaternion );
            transformed = true;
        },
        rotateZ: function( dz ){
            var zq = quaternionFromAxisAngle( vector3(0, 0, 1), dz );
            mQuaternion = zq.crossBy( mQuaternion );
            quaternMatrix4 = quaternionToMatrix( mQuaternion );
            transformed = true;
        },

        //etc
        getQuaternion: function(){
            return mQuaternion;
        },
        setQuaternion: function( q ){
            mQuaternion = q;
            quaternMatrix4 = quaternionToMatrix( mQuaternion );
            transformed = true;
        },
        getLocation: function(){
            return eye;
        },
        setSpeed: function(s){
            speed = s;
        },
        isTransformed: function(){
            return transformed;
        }
    }
}
