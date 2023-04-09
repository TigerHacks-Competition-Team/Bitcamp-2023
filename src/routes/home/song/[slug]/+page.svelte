<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import * as THREE from "three";
	import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
	import type { Group, Mesh, MeshPhysicalMaterial, Scene, SkinnedMesh } from "three/src/Three";

	import '../../../../style/menu.scss'

	import MidiPlayer from "midi-player-js";
	import MidiParser from "midi-parser-js";
	import { Midi } from "@tonejs/midi";

    let gameContainer : HTMLDivElement;
    let keyboardSkeleton : Group;
    let keyboardMesh : Group;
    let material : MeshPhysicalMaterial;
    let scene : Scene;
	let heldKeys : number[] = [];
	let currentKeys : number[] = [];
	let score = 0;

	const testMat = new THREE.MeshStandardMaterial({
        color: "red"
    });
	const plane = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0 );

	const noteOnRotation = (95 * Math.PI) / 180;
	const noteOffRotation = (90 * Math.PI) / 180;
	const highlightedNoteMat = new THREE.MeshStandardMaterial({
		color: 0x4287f5,
		emissive: "white",
		emissiveIntensity: 0.2,
	});
	const cubeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);

	function getNoteBone(i: number) {
		return keyboardSkeleton.children.findIndex(bone => {
			return bone.name === `key${String(i - 9).padStart(2, "0")}`;
		});
	}

	function getNoteMesh(i: number) {
		return keyboardMesh.children.findIndex(mesh => {
			return mesh.name === `key${String(i - 9).padStart(2, "0")}`;
		});
	}

	function onMIDISuccess(midiAccess: MIDIAccess) {
		for (const input of midiAccess.inputs) {
			input[1].onmidimessage = msg => {
				let data = (msg as MIDIMessageEvent).data;
				let noteBone = getNoteBone(data[1]);
				let noteMesh = getNoteMesh(data[1]);

				if (data[0] === 144) {
					keyboardSkeleton.children[noteBone].rotation.x = noteOnRotation;
					(keyboardMesh.children[noteMesh] as SkinnedMesh).material = highlightedNoteMat;
					heldKeys.push(data[1]);
                }
                if (data[0] === 128) {
                    keyboardSkeleton.children[noteBone].rotation.x = 
                        noteOffRotation;
                    (keyboardMesh.children[noteMesh] as SkinnedMesh).material = material; 
                    
					heldKeys.splice(heldKeys.indexOf(data[1]), 1);
                }
            }
        }
    }

	onMount(() => {
		navigator.requestMIDIAccess().then(onMIDISuccess, err => {
			console.error(`Failed to get MIDI access - ${err}`);
		});
		
		scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			20,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		
		//scene.add(new THREE.AxesHelper(5));
		scene.background = new THREE.Color(0x1c1c1c);
		const light = new THREE.PointLight();
		light.position.set(0.8, 70, 50.0);
		scene.add(light);
		camera.position.x = 0.4;
		camera.position.y = 9;
		camera.position.z = 4.5;
		
		camera.rotation.x = -1;
		camera.rotation.y = 0;
		
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		if (document.getElementsByTagName("canvas").length === 0) {
			gameContainer.appendChild(renderer.domElement);
		}
		const fbxLoader = new FBXLoader();
		const textureLoader = new THREE.TextureLoader();
		
		material = new THREE.MeshPhysicalMaterial({
			map: textureLoader.load("../../textures/keys_low_Material_BaseColor.png"),
			normalMap: textureLoader.load("../../textures/keys_low_Material_Normal.png"),
			roughnessMap: textureLoader.load("../../textures/keys_low_Material_Roughness.png"),
		});
		
		fbxLoader.load("../../meshes/keys.fbx", obj => {
			keyboardSkeleton = <Group>obj.getObjectByName("Armature");
			keyboardMesh = obj;
			scene.add(obj);
			obj.scale.x = 0.005;
			obj.scale.y = 0.005;
			obj.scale.z = 0.005;
			obj.position.z = 0.5;
			obj.traverse(child => {
				if ((child as Mesh).isMesh) {
					(child as Mesh).material = material;
				}
			});
			
			//TestSpawnNotes();
		});
		
		function animate() {
			requestAnimationFrame(animate);
			
			renderer.render(scene, camera);
		}
		
		animate();
		
		audio = new Audio("../../TEST/magnetic.mp3");
	});
	
	function TestAutoPlay() {
		let test = new MidiPlayer.Player(e => {
			let noteBone = getNoteBone(e.noteNumber);
			let noteMesh = getNoteMesh(e.noteNumber);
			if (e.name === "Note on") {
				keyboardSkeleton.children[noteBone].rotation.x = noteOnRotation;
				(keyboardMesh.children[noteMesh] as SkinnedMesh).material = highlightedNoteMat;
			}
			if (e.name === "Note off") {
				keyboardSkeleton.children[noteBone].rotation.x = noteOffRotation;
				(keyboardMesh.children[noteMesh] as SkinnedMesh).material = material;
			}
		});
		fetch("../../TEST/test.mid").then(e =>
			e.arrayBuffer().then(e => {
				test.loadArrayBuffer(e);
				test.play();
			})
		);
	}

	function spawnNote(note: any) {
		let cube = new THREE.Mesh(cubeGeo, highlightedNoteMat);

		let noteBone = keyboardSkeleton.children[getNoteBone(note.midi)];
		noteBone.getWorldPosition(cube.position);
		noteBone.getWorldScale(cube.scale);

		cube.scale.z = note.duration * fallSpeed;
		cube.position.z = -note.time * fallSpeed - countdownSeconds * fallSpeed;
		scene.add(cube);

		return { mesh: cube, note: note };
	}

	const fallSpeed = 1; // Units per second
	const countdownSeconds = 3; // Seconds
	const updatesPerSeconds = 100; // Keep at 100 pls

	const msPerUpdate = (1 / updatesPerSeconds) * 1000;
	const unitsPerUpdate = fallSpeed / updatesPerSeconds;

	let audio: HTMLAudioElement
	let playing = false

	async function TestSpawnNotes() {
		const midi = await Midi.fromUrl("../../TEST/magnetic.mid");
		const notes: any[] = [];

		midi.tracks.forEach(track => {
			track.notes.forEach(note => {
				if (note.midi > 87) return;
				notes.push(spawnNote(note));
			});
		});

		setTimeout(() => {
			audio.play()
			playing = true
		}, countdownSeconds * 1000);

		setInterval(() => {
            let i = notes.length
			currentKeys = [];
            while (i--) {
                let { mesh, note } = notes[i]
                mesh.position.z += unitsPerUpdate * audio.playbackRate;

				if (mesh.position.z < 0.05 && mesh.position.z > -0.05 ) {
					mesh.material = testMat;
					currentKeys.push(note.midi);
				} else if (mesh.position.z > 0.05 && mesh.position.z < 0.1) {
					mesh.material = highlightedNoteMat;
				}

                if (mesh.position.z > 1) {
                    scene.remove(mesh);
                    notes.splice(i, 1);
                }
            }
			console.log(score)
			if (currentKeys.length === 0) return;

			if (currentKeys.every(v => heldKeys.includes(v)) && currentKeys.length === heldKeys.length) {
				score++;
			}
        }, msPerUpdate);
	}

	function volumeChanged(e: Event) {
		audio.volume = parseInt((e.target as HTMLInputElement).value) / 100
	}

	function speedChanged(e: Event) {
		audio.playbackRate = parseInt((e.target as HTMLInputElement).value) / 100
	}
</script>

<div class="game-menu">
	<input value="100" min="0" max="100" on:input={volumeChanged} type="range"/>
	<input value="100" min="50" max="200" on:input={speedChanged} type="range" disabled={!playing}/>
	<button on:click={TestSpawnNotes}>Test</button>
</div>
<div bind:this={gameContainer} />
