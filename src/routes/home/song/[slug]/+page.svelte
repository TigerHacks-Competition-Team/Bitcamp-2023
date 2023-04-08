<script lang="ts">
    import { page } from '$app/stores';
	import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
	import type { Group, Mesh, SkinnedMesh } from 'three/src/Three';

    let gameContainer : HTMLDivElement;
    let keyboard : Group;

    function onMIDISuccess(midiAccess : MIDIAccess) {
        for (const input of midiAccess.inputs) {
            input[1].onmidimessage = ({ data: [status, note, velocity] }) => {
                if (status === 144 && keyboard) {
                    
                }
            }
        }
    }

    onMount(() => {
        navigator.requestMIDIAccess().then(
            onMIDISuccess,
            (err) => {console.error(`Failed to get MIDI access - ${err}`)}
        )
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            45, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000 
        );

        scene.add(new THREE.AxesHelper(5));
        scene.background = new THREE.Color(0x363636);

        const light = new THREE.PointLight();
        light.position.set(0.8, 70, 50.0);
        scene.add(light);

        camera.position.x = 0.5;
        camera.position.y = 7;
        camera.position.z = 3;

        camera.rotation.x = -1;
        camera.rotation.y = 0;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        if (document.getElementsByTagName('canvas').length === 0) {
            gameContainer.appendChild( renderer.domElement );
        }

        const fbxLoader = new FBXLoader();
        const textureLoader = new THREE.TextureLoader();
        const keysBaseColor = textureLoader.load("../../textures/keys_low_Material_BaseColor.png");
        const keysNormal = textureLoader.load("../../textures/keys_low_Material_Normal.png");
        const keyRoughness = textureLoader.load("../../textures/keys_low_Material_Roughness.png");

        const material = new THREE.MeshPhysicalMaterial({  
            map: keysBaseColor,
            normalMap: keysNormal,
            roughnessMap: keyRoughness
        });

        fbxLoader.load(
            "../../meshes/keys.fbx",
            (obj) => {
                keyboard = obj;
                scene.add(obj);
                obj.scale.x = 0.005;
                obj.scale.y = 0.005;
                obj.scale.z = 0.005;
                
                obj.traverse((child) => {
                    if ((child as Mesh).isMesh) {
                        (child as Mesh).material = material;
                    }
                });
            }
        );

        function animate() {
	        requestAnimationFrame( animate );
            if (keyboard) {
                
            }
        
	        renderer.render( scene, camera );
        }

        animate();
    });

</script>

<div bind:this={gameContainer}>

</div>


