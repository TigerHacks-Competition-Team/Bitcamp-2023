<script lang="ts">
    import { page } from '$app/stores';
	import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
	import type { Group, Mesh, MeshPhysicalMaterial, SkinnedMesh } from 'three/src/Three';

    import MidiPlayer from 'midi-player-js'
    import MidiParser from 'midi-parser-js'

    let gameContainer : HTMLDivElement;
    let keyboardSkeleton : Group;
    let keyboardMesh : Group;
    let material : MeshPhysicalMaterial;

    const noteOnRotation = 95 * Math.PI / 180;
    const noteOffRotation = 90 * Math.PI / 180;
    const highlightedNoteMat = new THREE.MeshStandardMaterial({
        color: "red"
    })

    function getNoteBone(i: number) {
        return keyboardSkeleton.children.findIndex(bone => {
            return bone.name === `key${String(i - 9).padStart(2, '0')}`;
        })
    }

    function getNoteMesh(i: number) {
        return keyboardMesh.children.findIndex(mesh => {
            return mesh.name === `key${String(i - 9).padStart(2, '0')}`;
        })
    }

    function onMIDISuccess(midiAccess : MIDIAccess) {
        for (const input of midiAccess.inputs) {
            input[1].onmidimessage = (msg) => {
                let data = (msg as MIDIMessageEvent).data;
                let noteBone = getNoteBone(data[1]);
                let noteMesh = getNoteMesh(data[1]);

                if (data[0] === 144) {
                    keyboardSkeleton.children[noteBone].rotation.x = 
                        noteOnRotation;
                    (keyboardMesh.children[noteMesh] as SkinnedMesh).material = highlightedNoteMat;
                }
                if (data[0] === 128) {
                    keyboardSkeleton.children[noteBone].rotation.x = 
                        noteOffRotation;
                    (keyboardMesh.children[noteMesh] as SkinnedMesh).material = material;  
                }
            }
        }
    }

    onMount(() => {
        navigator.requestMIDIAccess().then(
            onMIDISuccess,
            (err) => {console.error(`Failed to get MIDI access - ${err}`)}
        );

        TestSpawnNotes();

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

        material = new THREE.MeshPhysicalMaterial({  
            map: textureLoader.load(
                "../../textures/keys_low_Material_BaseColor.png"
            ),
            normalMap: textureLoader.load(
                "../../textures/keys_low_Material_Normal.png"
            ),
            roughnessMap: textureLoader.load(
                "../../textures/keys_low_Material_Roughness.png"
            ),
        });

        fbxLoader.load(
            "../../meshes/keys.fbx",
            (obj) => {
                keyboardSkeleton = <Group>obj.getObjectByName("Armature");
                keyboardMesh = obj;
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

	        renderer.render( scene, camera );
        }

        animate();
    });
    
    function TestAutoPlay() {
        let test = new MidiPlayer.Player(e => {
            let noteBone = getNoteBone(e.noteNumber);
            let noteMesh = getNoteMesh(e.noteNumber);
            if (e.name === "Note on") {
                keyboardSkeleton.children[noteBone].rotation.x = 
                    noteOnRotation;
                (keyboardMesh.children[noteMesh] as SkinnedMesh).material = highlightedNoteMat;
            }
            if (e.name === "Note off") {
                keyboardSkeleton.children[noteBone].rotation.x = 
                    noteOffRotation;
                (keyboardMesh.children[noteMesh] as SkinnedMesh).material = material;
            }
        })
        fetch("../../TEST/test.mid").then(e => e.arrayBuffer().then(e => {
            test.loadArrayBuffer(e)
            test.play()
        }))
    }

    function TestSpawnNotes() {
        fetch("../../TEST/test.mid").then(e => e.blob().then(blob => {
            let reader = new FileReader();
            reader.onload = (() => {
                let midiArray = MidiParser.parse(reader.result);
                console.log(midiArray);
            });
            reader.readAsDataURL(blob);
            
        }))
    }
</script>

<div bind:this={gameContainer}>

</div>
<button on:click={TestAutoPlay}>Test</button>

