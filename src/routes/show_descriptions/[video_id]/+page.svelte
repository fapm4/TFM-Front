<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Row from '$lib/components/show_descriptions/Row.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { getLocalStorage, BACKEND_URL } from '$lib/basic';
	import Swal from 'sweetalert2';

	import { page } from '$app/stores';
	$: video_id = $page.params.video_id;

	import { videoId, descriptions, fileUrl, fileName } from '$lib/writables';

	let videoLoaded = false;

	let optionSelected;

	async function fetchVideoData() {
		const response = await fetch(`${BACKEND_URL}/api/videos/get_video_stats/${video_id}/`);

		if (response.status !== 200) {
			const data = await response.json();
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: data.message,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#FFB84D'
			});
			return null;
		}

		return await response.json();
	}

	async function setupData() {
		const data = await fetchVideoData();
		if (!data) return;

		videoId.set(video_id || data.video_id);
		fileUrl.set(`${BACKEND_URL}${data.video_file_path}`);
		fileName.set(data.video_title);
		optionSelected = data.option_selected || 'default';

		let descList = typeof data.descriptions === 'string'
			? JSON.parse(data.descriptions)
			: data.descriptions || [];

		descriptions.set(descList);
		videoLoaded = true;
		handleDescriptions();

	}

	onMount(async () => {
		await setupData();
	});

	function formatTime(timeStr) {
		const parts = timeStr.split(':').map(Number);
		let totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];

		let rounded = Math.round(totalSeconds);

		const h = String(Math.floor(rounded / 3600)).padStart(2, '0');
		const m = String(Math.floor((rounded % 3600) / 60)).padStart(2, '0');
		const s = String(rounded % 60).padStart(2, '0');

		return `${h}:${m}:${s}`;
	}

	function handleDescriptions() {
		const updated = $descriptions.map(desc => ({
			...desc,
			start_at: formatTime(desc.start_at),
			end_at: formatTime(desc.end_at),
			desc: desc.description
		}));
		descriptions.set(updated);
	}

	function removeDescription(video_id, desc_id) {
		setupData();
		handleDescriptions();
	}

	function updateDescriptionTime(video_id, desc_id, type, value) {
		setupData();
		handleDescriptions();
	}

	function updateDescriptionText(video_id, desc_id, description) {
		const updated = $descriptions.map(desc =>
			desc.video_id === video_id && desc.description_id === desc_id
				? { ...desc, description }
				: desc
		);

		console.log(updated);
		descriptions.set(updated);
		handleDescriptions();
	}

	async function addDescription(video_id) {
		const newDescription = {
			video_id,
			start_at: '00:00:00',
			end_at: '00:00:00',
			description: ''
		};

		const response = await fetch(`${BACKEND_URL}/api/videos/add_description/${video_id}/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newDescription)
		});

		if (response.status !== 200) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'No se pudo añadir la descripción.',
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#FFB84D'
			});
			console.error('Failed to add description:', response.status);
			return;
		}

		const added = await response.json();
		setupData();
		handleDescriptions();
	}

	function processVideo(video_id) {
		Swal.fire({
			title: 'Procesando video',
			text: 'Esto puede tardar unos minutos...',
			showConfirmButton: false,
			willOpen: () => {
				Swal.showLoading();
			}
		});

		fetch(`${BACKEND_URL}/api/videos/add_descriptions_to_video/${video_id}/`, {
			method: 'POST'
		})
			.then(response => {
				if (response.status !== 200) {
					throw new Error('Error al procesar el video');
				}
				return response.json();
			})
			.then(data => {
				Swal.fire({
					icon: 'success',
					title: 'Éxito',
					text: 'El video se ha procesado correctamente.',
					confirmButtonColor: '#FFB84D'
				});
				setupData();
			})
			.catch(error => {
				console.error('Error:', error);
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: error.message,
					confirmButtonText: 'Aceptar',
					confirmButtonColor: '#FFB84D'
				});
			});
	}
</script>

<main>
	<Navbar />

	{#if videoLoaded}
		<div class="video-container">
			<h3>Video ID: {$videoId}</h3>
			<h3>File Name: {$fileName}</h3>
			<video controls autoplay loop muted src={$fileUrl}> </video>

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
								desc_id={desc.id}
								text={desc.description}
								onDelete={removeDescription}
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
			<button on:click={() => processVideo($videoId)}> 
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
		background-color: #ffb84d;
		color: white;
		text-align: center;
	}

	.description-table th,
	.description-table td {
		padding: 14px 20px;
		border-bottom: 1px solid #ffe6cc;
	}

	.description-table tr:hover {
		background-color: #fff0dc; /* efecto hover */
		transition: background-color 0.3s ease;
	}

	.description-table input[type='text'] {
		width: 100%;
		padding: 8px;
		border: 1px solid #ffe6cc;
		border-radius: 6px;
		background-color: #fff7ed;
		font-size: 1rem;
		color: #333;
	}

	.description-table input[type='text']:focus {
		outline: none;
		border-color: #ffb84d;
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
		background-color: #ffb84d;
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
		border: 2px solid #ffe6cc;
		color: #ffb84d;
	}
</style>
