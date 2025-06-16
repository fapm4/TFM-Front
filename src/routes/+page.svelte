<script>
	import Navbar from "$lib/components/Navbar.svelte";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { on } from "svelte/events";

	onMount(() => {
		flushStorage();
	});
	
	function flushStorage() {
		localStorage.clear()
	}

	function handleClick() {
		goto("/upload_file");
	}
</script>

<Navbar />

<main>
	<div class="title-container">
		<h1>AutoDescripción: Genera textos impactantes en segundos</h1>
	</div>

	<div class="list-group">
		<p>Con AutoDescripción puedes:</p>
		<ul>
			<li>🎙️ Añadir descripciones grabando un audio.</li>
			<li>📝 Generar descripciones a partir de un texto.</li>
			<li>🤖 Usar Inteligencia Artificial para optimizar descripciones.</li>
		</ul>
	</div>

	<p>🛍️ <strong>Ahorra tiempo y esfuerzo</strong> generando descripciones en segundos.</p>
	<p>🎨 <strong>Personaliza el estilo y tono</strong> según tu necesidad.</p>
	<p>📂 Descarga y sube tus audio-descripciones en formato WebVTT.</p>

	<div id="button-container">
		<button id="start-button" on:click={handleClick}>
			¡Comienza ahora!
		</button>
	</div>
</main>

<style>

	#button-container {
		text-align: center;
		margin-top: 20px;
	}

	#start-button {
		background-color: #FFB84D;
		color: white;
		border: none;
		padding: 10px 20px;
		font-size: 1.2rem;
		border-radius: 5px;
		cursor: pointer;
		margin-top: 20px;
	}
	
	#start-button:hover {
		background-color: white;
		transition: background-color 0.3s ease;
		border: 2px solid #FFE6CC;
		color: #FFB84D;
	}

	main {
		padding: 40px 20px;
		max-width: 800px;
		margin: auto;
	}

	.title-container {
		/* background: #FFFAE6; */
		border: 2px dashed #FF8C00;
		padding: 20px;
		border-radius: 10px;
		text-align: center;
		box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
		margin: 0 auto 25px;
	}

	h1 {
		font-size: 2.5rem;
		color: #222;
		font-weight: bold;
		margin: 0;
	}

	p {
		font-size: 1.3rem;
		line-height: 1.8;
		color: #444;
		margin-bottom: 18px;
		text-align: justify;
	}

	p::before {
		content: "➤ ";
		font-weight: bold;
	}

	.list-group ul {
		padding-left: 20px;
		list-style: none;
	}

	.list-group li {
		font-size: 1.2rem;
		margin-bottom: 10px;
		color: #555;
	}
</style>
