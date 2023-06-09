<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import * as THREE from "three";
	import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
	import type { Group, Mesh, MeshPhysicalMaterial, Scene, SkinnedMesh } from "three/src/Three";
	import { getFirestore, doc, getDoc, where, query, getDocs, collection, addDoc } from "firebase/firestore";
	import { getStorage, ref, getDownloadURL } from "firebase/storage";
	import { app } from "../../../stores";
	import { create_in_transition } from "svelte/internal";

	import { fly, fade } from 'svelte/transition'

	import '../../../../style/menu.scss'

	import { Midi } from "@tonejs/midi";

    let gameContainer : HTMLDivElement;
    let keyboardSkeleton : Group;
    let keyboardMesh : Group;
    let material : MeshPhysicalMaterial;
    let scene : Scene;
	let heldKeys : number[] = [];
	let currentKeys : number[] = [];
	let score = 0;
	let performance = 60;

	const testMat = new THREE.MeshStandardMaterial({
        color: "red"
    });

	const noteOnRotation = (95 * Math.PI) / 180;
	const noteOffRotation = (90 * Math.PI) / 180;
	const highlightedNoteMat = new THREE.MeshStandardMaterial({
		color: 0x4287f5,
		emissive: "white",
		emissiveIntensity: 0.2,
	});
	const highlightedNoteMatGood = new THREE.MeshStandardMaterial({
		color: 0x61e84d,
		emissive: "white",
		emissiveIntensity: 0.2,
	});
	const highlightedNoteMatBad = new THREE.MeshStandardMaterial({
		color: 0xf54636,
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
					(keyboardMesh.children[noteMesh] as SkinnedMesh).material = 
						(currentKeys.includes(data[1])) ? highlightedNoteMatGood : highlightedNoteMatBad;
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

	const storage = getStorage();
	const db = getFirestore(app);
	let midi: any

	let songName: string
	let songAuthor: string

	onMount(async () => {
		let promises: Promise<any>[] = []

		if (!app) {
			console.error('Invalid session');
			return;
		}
		
		promises.push(new Promise((resolve, reject) => {
			getDoc(doc(db, "songs", $page.params.slug)).then(docSnap => {
				songName = docSnap?.data()?.title
				songAuthor = docSnap?.data()?.author
				getDownloadURL(ref(storage, docSnap?.data()?.original)).then(url => {
					fetch(url).then(e => e.blob()).catch(reject).then(e => {
						let reader = new FileReader()
						reader.onload = (e => {
							audio = new Audio(reader.result as string);
							getDownloadURL(ref(storage, docSnap?.data()?.midi)).then(e => {
								Midi.fromUrl(e).then(e => {
									midi = e
									resolve(undefined)
								}).catch(reject);
							}).catch(reject)
						})
						reader.onerror = reject
						reader.readAsDataURL(e as Blob)
					}).catch(reject)
				}).catch(reject);
			}).catch(reject)
		}));

		promises.push(navigator.requestMIDIAccess().then(onMIDISuccess, err => {
			console.error(`Failed to get MIDI access - ${err}`);
		}));
		
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
			obj.renderOrder = 5;
			obj.scale.x = 0.005;
			obj.scale.y = 0.005;
			obj.scale.z = 0.005;
			obj.position.z = 0.5;
			obj.traverse(child => {
				if ((child as Mesh).isMesh) {
					(child as Mesh).material = material;
				}
			});

			Promise.all(promises).then(() => {
				loaded = true
			}).catch(e => {
				loadingError = e
			})
		});
		
		function animate() {
			requestAnimationFrame(animate);
			
			renderer.render(scene, camera);
		}
		
		animate();
	});

	function spawnNote(note: any) {
		let cube = new THREE.Mesh(cubeGeo, highlightedNoteMat);
		cube.renderOrder = 1;

		let noteBone = keyboardSkeleton.children[getNoteBone(note.midi)];
		noteBone.getWorldPosition(cube.position);
		noteBone.getWorldScale(cube.scale);

		cube.scale.z = note.duration * fallSpeed * 5;
		cube.position.z = -note.time * fallSpeed - countdownSeconds * fallSpeed;
		cube.position.y -= 0.001;
		scene.add(cube);

		return { mesh: cube, note: note };
	}

	const fallSpeed = 1; // Units per second
	const countdownSeconds = 3; // Seconds
	const updatesPerSeconds = 100; // Keep at 100 pls

	const msPerUpdate = (1 / updatesPerSeconds) * 1000;
	const unitsPerUpdate = fallSpeed / updatesPerSeconds;

	let audio: HTMLAudioElement
	let started = false
	let paused = false
	let countdown = false
	let loaded = false
	let loadingError: any

	async function beginGame() {
		if (started) return

		started = true
		const notes: any[] = [];

		(midi.tracks as any[]).forEach(track => {
			(track.notes as any[]).forEach(note => {
				if (note.midi > 87) return;
				notes.push(spawnNote(note));
			});
		});

		countdown = true
		let countdownTick = 0
		let countdownInterval = setInterval(() => {
			if (!paused) countdownTick += audio.playbackRate
			if (countdownTick > countdownSeconds * updatesPerSeconds) {
				audio.play()
				countdown = false
				clearInterval(countdownInterval)
			}
		}, msPerUpdate)

		setInterval(() => {
			if (paused) return

            let i = notes.length
			currentKeys = [];
            while (i--) {
                let { mesh, note } = notes[i]
                mesh.position.z += unitsPerUpdate * audio.playbackRate;

				if (mesh.position.z < 0.05 && mesh.position.z > -0.05 ) {
					currentKeys.push(note.midi);
				} else if (mesh.position.z > 0.05 && mesh.position.z < 0.1) {
					
				}

                if (mesh.position.z > 0.25) {
                    scene.remove(mesh);
                    notes.splice(i, 1);
                }
            }
			if (currentKeys.length === 0) return;

			if (currentKeys.every(v => heldKeys.includes(v)) && currentKeys.length === heldKeys.length) {
				score++;
				performance += 0.15;
			} else {
				performance -= 0.15;
			}
        }, msPerUpdate);
	}

	function volumeChanged(e: Event) {
		audio.volume = parseInt((e.target as HTMLInputElement).value) / 100
	}

	function speedChanged(e: Event) {
		audio.playbackRate = parseInt((e.target as HTMLInputElement).value) / 100
	}

	function togglePauseMenu() {
		if (!started) return
		paused = !paused
		audio[(!paused && !countdown ? "play" : "pause")]()
	}
</script>

<svelte:window on:keypress={e => {if (e.key === 'p') togglePauseMenu()}}/>

{#if (paused || !started)}
<div class="pause-menu game-ui" transition:fade={{duration: 100}}>
	{#if started}
		<label for="">Volume</label>
		<input value={audio.volume*100} min="0" max="100" on:input={volumeChanged} type="range"/>
		<label for="">Speed</label>
		<input value={audio.playbackRate*100} min="50" max="200" on:input={speedChanged} type="range"/>
	{:else}
		<button on:click={beginGame} disabled={!loaded}>Start</button>
		{#if loadingError} <p>Error Loading Data!</p> <p>{loadingError.message}</p> {/if}
	{/if}
</div>
{/if}
{#if (!paused && started)}
<div class="game-ui" transition:fly>
	<div class="top">
		<div class="song-info">
			{#if (songName && songAuthor)}
				<h1 class="title is-3">{songName}</h1>
				<h5 class="title is-5">{songAuthor}</h5>
			{/if}
		</div>
		<div class="player-score">
			<h1 class="title is-3">{String(score).padStart(6, '0')}</h1>
		</div>
	</div>
	<div class="player-meter">
		<meter value={performance} max="100" min="0" low="20" high="60" optimum="80"></meter>
	</div>
</div>
{/if}

{#if !loaded}
<div class="loading-block" transition:fade />
{/if}

<div bind:this={gameContainer} />