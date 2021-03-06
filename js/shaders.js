define(function(){
return function(){
return{
    shaderSettings: {
        planeUnderneathSettings:{
            frequency: 5,
            amplitude: 100,
            uniforms: {
                amplitude: {
                    type: 'f',
                    value: 1
                }
            },
            attributes: {
                displacement: {
                    type: 'f',
                    value: []
                }
            }
        }
    }
    ,
    updateShaders: function (frameNumber) {
        this.shaderSettings.planeUnderneathSettings.uniforms.amplitude.value =
            Math.sin(frameNumber / this.shaderSettings.planeUnderneathSettings.frequency) ;
    }
    ,
    trackShaderMaterial: function () {
        var material = new THREE.ShaderMaterial({
            uniforms: {},
            attributes: {},
            vertexShader: vertexShader(),
            fragmentShader: fragmentShader(),
            transparent: true,
            wireframe: false
        });

        return material;

        function vertexShader () {
            return ""+
                "varying vec2 vUv;"+
                "void main(){"+
                "vUv = uv;"+
                "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}"
        }

        function fragmentShader () {
            return ""+
                "varying vec2 vUv;"+
                "void main(){"+
                "float color = 0.0;"+
                "vec2 position = vUv;"+
                    //lanes
                "color = (sin((position.x) * 15.8 ) / 2.0) / sin(position.y * 3.1);"+
                    //circles under lanes
                "if(color < 0.3) color = sin(position.y * 50.0) * sin(position.x * 50.0);"+
                "gl_FragColor=vec4( 0, color / 3.0, color, 1.0);}"
        }
    }
    ,
     planeUnderneathMaterial: function (geometry) {
        var material = new THREE.ShaderMaterial({
            uniforms: this.shaderSettings.planeUnderneathSettings.uniforms,
            attributes: this.shaderSettings.planeUnderneathSettings.attributes,
            vertexShader: vertexShader(),
            fragmentShader: fragmentShader(),
            transparent: true,
            wireframe: true
        });

        var verts = geometry.vertices;

        var values = this.shaderSettings.planeUnderneathSettings.attributes.displacement.value;

        for (var v = 0; v < verts.length; v++)
            values.push(Math.sin(Math.random()) * this.shaderSettings.planeUnderneathSettings.amplitude);

        return material;

        function vertexShader () {
            return ""+
                "attribute float displacement;"+
                "uniform float amplitude;"+
                "varying vec2 vUv;"+
                "varying vec3 vNormal;"+
                "void main(){"+
                "vUv = uv;"+
                "vNormal = normal;"+
                "vec3 newPosition = position + normal * vec3(displacement * amplitude);"+
                "gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);}"
        }

        function fragmentShader () {
            return ""+
                "uniform float amplitude;"+
                "varying vec2 vUv;"+
                "varying vec3 vNormal;"+
                "void main(){"+
                "float color = 0.0;"+
                "vec2 position = vUv;"+
                "color = sin(gl_FragCoord.x) / sin(gl_FragCoord.y);"+
                "if(color > 0.6) discard;"+
                "gl_FragColor=vec4( 0, 0, amplitude + 1.9, 1.0);}"

        }
    }
    ,
    scrollingRingsMaterial: function () {
        var material = new THREE.ShaderMaterial({
            uniforms: shaderSettings.planeUnderneathSettings.uniforms,
            attributes: {},
            vertexShader: vertexShader(),
            fragmentShader: fragmentShader(),
            transparent: true,
            wireframe: false
        });

        return material;

        function vertexShader () {
            return ""+
                "varying vec2 vUv;"+
                "uniform float amplitude;"+
                "void main(){"+
                "vUv = uv;"+
                "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}"
        }

        function fragmentShader () {
            return ""+
                "varying vec2 vUv;"+
                "uniform float amplitude;"+
                "void main(){"+
                "float color = 0.0;"+
                "vec2 position = vUv;"+
                "color = (position.y * (gl_FragCoord.y / 100.0)) * sin(gl_FragCoord.x) *sin(gl_FragCoord.y);"+
                "gl_FragColor=vec4( color, color / 3.0, color / 5.0, 1.0);}"
        }
    }
}
}()
})