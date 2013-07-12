/**
 * Created with JetBrains WebStorm.
 * User: imoo
 * Date: 13. 7. 5
 * Time: 오후 7:33
 * To change this template use File | Settings | File Templates.
 */

/**
 * Created with JetBrains WebStorm.
 * User: imoo
 * Date: 13. 7. 3
 * Time: 오후 11:20
 * To change this template use File | Settings | File Templates.
 */

ObjectController = function(camera){
    var angle = angle3(0, 0, 0);
    var eye = vector3(0, 0, 1);
    var parent = camera;
    var mQuaternion = quaternion(0, 0, 0, 1);
    var quaternMatrix4 = {};
    var transformed = false;

    var speed = 3;

    mulMatrix4 = function( m1, m2 ){
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

    function quaternionFromAxisAngle(dir, angle){
        var sinAngle;
        var vn = vector3(dir.getX(), dir.getY(), dir.getZ());

        vn.normalize();
        dir.normalize();
        var radian = (angle)/180*Math.PI;
        sinAngle = Math.sin( radian*0.5 );
        var qx = dir.getX() * sinAngle;
        var qy = dir.getY() * sinAngle;
        var qz = dir.getZ() * sinAngle;
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
    function getRotateVector( base ){
        var vn = vector3( base.getX(), base.getY(), base.getZ()).normalize();
        if( vn.length() === 0 )
            return vn;

        var q = parent.getQuaternion();
        var quatern = quaternion(q.getX(), q.getY(), q.getZ(), q.getW() );

        var vecQuat = quaternion( vn.getX(), vn.getY(), vn.getZ(), 0.0 );
        var resQuat = quaternion().cross( vecQuat, quatern.getConjugate() );
        var endQuat = quaternion().cross( quatern, resQuat );

        return vector3( endQuat.getX(), -endQuat.getY(), endQuat.getZ() );
    }
    return {
        getMatrixQuery: function(){
            //may be position
            transformed = false;
            quaternMatrix4.t0 = eye.getX();
            quaternMatrix4.t1 = -eye.getY();
            quaternMatrix4.t2 = eye.getZ();
            quaternMatrix4.t3 = 1.0;

            return matrixToQuery( quaternMatrix4 );

        },
        showFacade: function(){
            mQuaternion = parent.getQuaternion().getInverse();
            angle = mQuaternion.getEulerAngle();
        },
        lookFacade: function(){
            parent.setQuaternion( mQuaternion.getInverse() );
        },
        setParent: function(_parent){
            parent = _parent;
        },




        //translation
        translateX : function(val){
            var revisedVector = getRotateVector( vector3(1, 0, 0) );
            revisedVector.scalar(val);
            eye = vector3().add( eye, revisedVector );
        },
        translateY : function(val){
            var revisedVector = getRotateVector( vector3(0, -1, 0) );
            revisedVector.scalar(val);
            eye = vector3().add( eye, revisedVector );
        },
        translateZ : function(val){
            var revisedVector = getRotateVector( vector3(0, 0, 1) );
            revisedVector.scalar(val);
            eye = vector3().add( eye, revisedVector );
        },
        getPosition: function( dx, dy ){
            var revisedX = getRotateVector( vector3(1, 0, 0) );
            var revisedY = getRotateVector( vector3(0, 1, 0) );
            return vector3().add( eye, vector3().add( revisedX.scalar(dx), revisedY.scalar(dy) ) );
        },
        getDepth: function( dz ){
            var revisedVector = getRotateVector( vector3(0, 0, 1) );
            return vector3().add(eye, revisedVector.scalar(dz));
        },
        setPosition: function( x, y, z){
            eye.setX( x );
            eye.setY( y );
            eye.setZ( z );
        },
        getLocation: function(){
            return eye;
        },


        //rotation

        rotateX: function( dx ){
            var xq = quaternionFromAxisAngle( vector3(1, 0, 0), dx );
            mQuaternion = mQuaternion.crossBy( xq );
            quaternMatrix4 = mQuaternion.getMatrix();
        },
        rotateY: function( dy ){
            var yq = quaternionFromAxisAngle( vector3(0, 1, 0), dy );
            mQuaternion = yq.crossBy( mQuaternion );
            quaternMatrix4 = mQuaternion.getMatrix();
        },
        rotateZ: function( dz ){
            var zq = quaternionFromAxisAngle( vector3(0, 0, 1), dz );
            mQuaternion = zq.crossBy( mQuaternion );
            quaternMatrix4 = mQuaternion.getMatrix();
        },
        getRotation: function(dx, dy, dz){
            if(!dz)
            {
                dz = 0;
            }

            var rotation = angle3( dy, -dx, -dz );
            return angle3().add( angle, rotation);
        },
        setRotation: function(x, y, z ){
            var xq = quaternionFromAxisAngle( vector3(1, 0, 0), x );
            var yq = quaternionFromAxisAngle( vector3(0, 1, 0), y );
            var zq = quaternionFromAxisAngle( vector3(0, 0, 1), z );
            angle.set( x, y, z );

            mQuaternion = xq;
            mQuaternion = yq.crossBy( mQuaternion );
            mQuaternion = zq.crossBy( mQuaternion );

            quaternMatrix4 = mQuaternion.getMatrix();


        }

    }
}

