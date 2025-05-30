<script>
	import Navbar from "../../components/Navbar.svelte";
	import Row from "../../components/show_descriptions/Row.svelte";
	import { onMount, onDestroy } from "svelte";
	import { getLocalStorage, BACKEND_URL } from "$lib/basic";
	import Swal from "sweetalert2";

	import {
		videoId,
		descriptions,
		fileUrl,
		fileName,
	} from "$lib/writables";

	let videoLoaded = false;
	let optionSelected;
	
	onMount(() => {
		if ($videoId === "") {
			const storedVideoId = getLocalStorage("video_id");
			const storedFileUrl = getLocalStorage("file_url");
			const storedFileName = getLocalStorage("file_name");
			optionSelected = getLocalStorage("option_selected");
			const storedDescriptions = getLocalStorage("descriptions");

			if (storedVideoId && storedFileUrl && storedFileName) {
				videoId.set(storedVideoId);
				fileUrl.set(storedFileUrl);
				fileName.set(storedFileName);
				
				if (typeof storedDescriptions === "string") {
					descriptions.set(JSON.parse(storedDescriptions));
				}
				else if (typeof storedDescriptions === "object") {
					descriptions.set(storedDescriptions);
			}

				videoLoaded = true;
			}
		}

		if ($videoId !== "") {
			videoLoaded = true;
			handleDescriptions();
		}
	});

	function formatTime(timeStr) {
		const parts = timeStr.split(":").map(Number);
		let totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];

		let rounded = Math.round(totalSeconds);

		const h = String(Math.floor(rounded / 3600)).padStart(2, "0");
		const m = String(Math.floor((rounded % 3600) / 60)).padStart(2, "0");
		const s = String(rounded % 60).padStart(2, "0");

		return `${h}:${m}:${s}`;
	}

	function handleDescriptions() {
	   console.log("Handling descriptions...");
	   console.log("Current descriptions:", $descriptions);

	   $descriptions.forEach((desc) => {
			desc.start_at = formatTime(desc.start_at);
			desc.end_at = formatTime(desc.end_at);
	   });
	}

	function removeDescriptionFromStorage(video_id, desc_id) {
		console.log("Removing description:", video_id, desc_id);

		let storedDescriptions = getLocalStorage("descriptions");

		if (!Array.isArray(storedDescriptions)) {
			console.error("No valid descriptions found in localStorage.");
			return;
		}

		const updatedDescriptions = storedDescriptions.filter(
			desc => !(desc.video_id === video_id && desc.description_id === desc_id)
		);

		console.log("Updated descriptions:", updatedDescriptions);

		descriptions.set(updatedDescriptions);
		localStorage.setItem("descriptions", JSON.stringify(updatedDescriptions));

		handleDescriptions();
	}

	function updateDescriptionTime(video_id, desc_id, type, value) {
		console.log("Updating description time:", video_id, desc_id, type, value);

		let storedDescriptions = getLocalStorage("descriptions");

		if (!Array.isArray(storedDescriptions)) {
			console.error("No valid descriptions found in localStorage.");
			return;
		}

		const updatedDescriptions = storedDescriptions.map(desc => {
			if (desc.video_id === video_id && desc.description_id === desc_id) {
				return { ...desc, [type]: value };
			}
			return desc;
		});

		console.log("Updated descriptions:", updatedDescriptions);

		descriptions.set(updatedDescriptions);
		localStorage.setItem("descriptions", JSON.stringify(updatedDescriptions));

		handleDescriptions();
	}

	function updateDescriptionText(video_id, desc_id, text) {
		console.log("Updating description text:", video_id, desc_id, text);

		let storedDescriptions = getLocalStorage("descriptions");

		if (!Array.isArray(storedDescriptions)) {
			console.error("No valid descriptions found in localStorage.");
			return;
		}

		const updatedDescriptions = storedDescriptions.map(desc => {
			if (desc.video_id === video_id && desc.description_id === desc_id) {
				return { ...desc, text: text };
			}
			return desc;
		});

		console.log("Updated descriptions:", updatedDescriptions);

		descriptions.set(updatedDescriptions);
		localStorage.setItem("descriptions", JSON.stringify(updatedDescriptions));

		handleDescriptions();
	}

	async function addDescription(video_id) {
		console.log("Adding new description...");

		const newDescription = {
			video_id: video_id,
			start_at: "00:00:00",
			end_at: "00:00:00",
			text: "",
		};

		const reponse = await fetch(`${BACKEND_URL}/api/videos/add_description/${video_id}/`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newDescription)
		});

		if (reponse.status !== 200) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'No se pudo añadir la descripción.',
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#FFB84D',
			});
			console.error("Failed to add description:", reponse.status);
			return;
		}

		let storedDescriptions = getLocalStorage("descriptions") || [];
		storedDescriptions.push(newDescription);

		descriptions.set(storedDescriptions);
		localStorage.setItem("descriptions", JSON.stringify(storedDescriptions));

		handleDescriptions();
	}
</script>

<main>
	<Navbar/>

	{#if videoLoaded}
		<div class="video-container">
			<h3>Video ID: {$videoId}</h3>
			<h3>File Name: {$fileName}</h3>
			<video 
				controls 
				autoplay 
				loop 
				muted
				src="{$fileUrl}">
			</video>

			<div class="table-container">
				<table class="description-table">
					<thead>
						<tr>
							<th id="thBorrar"></th>
							<th>Inicio</th>
							<th>Fin</th>
							<th>Descripción</th>
							<th id="thTTS"></th>
						</tr>
					</thead>
					<tbody>
						{#each $descriptions as desc}
							<Row 
								video_id={$videoId} 
								start={desc.start_at} 
								end={desc.end_at} 
								desc_id={desc.description_id}
								text={desc.text}
								onDelete={removeDescriptionFromStorage}
								onUpdateTime={updateDescriptionTime}
								onUpdateDescription={updateDescriptionText}
								option_selected={optionSelected}
							/>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<div class="button-container">
			<button id="add-button" on:click={() => addDescription($videoId)}>
				Añadir Descripción
			</button>
			<button>
				Procesar Video
			</button>
		</div>
	{/if}
</main>

<style>
	.description-table {
		border-collapse: collapse;
		margin-top: 30px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		border-radius: 5px;
		overflow: hidden;
		font-family: sans-serif;
	}

	.description-table thead {
		background-color: #FFB84D;
		color: white;
		text-align: center;
	}

	.description-table th,
	.description-table td {
		padding: 14px 20px;
		border-bottom: 1px solid #FFE6CC;
	}

	.description-table tr:hover {
		background-color: #FFF0DC; /* efecto hover */
		transition: background-color 0.3s ease;
	}

	.description-table input[type="text"] {
		width: 100%;
		padding: 8px;
		border: 1px solid #FFE6CC;
		border-radius: 6px;
		background-color: #FFF7ED;
		font-size: 1rem;
		color: #333;
	}

	.description-table input[type="text"]:focus {
		outline: none;
		border-color: #FFB84D;
		box-shadow: 0 0 0 2px rgba(255, 184, 77, 0.3);
	}

	.video-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 20px;
	}

	video {
		width: 100%;
		max-width: 600px;
		height: auto;
	}

	h3 {
		margin-bottom: 10px;
	}

	#start-button {
		margin-bottom: 40px;
	}

	.button-container {
		display: flex;
		justify-content: center;
		gap: 20px; /* espacio entre los botones */
		margin-top: 20px;
	}

	button {
		margin-top: 30px;
		background-color: #FFB84D;
		color: white;
		border: none;
		padding: 12px 25px;
		font-size: 1.1rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	button:hover {
		background-color: white;
		border: 2px solid #FFE6CC;
		color: #FFB84D;
	}

</style>