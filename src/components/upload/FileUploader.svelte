<script>
    import { fileUploaded, fileDetails, fileObject } from "$lib/writables";
	import { SvelteURLSearchParams } from "svelte/reactivity";

    let draggedOver = false;
	let fileInput;

    function handleDragOver(event) {
		event.preventDefault();
		draggedOver = true;
	}

	function handleDragLeave() {
		draggedOver = false;
	}

	function handleUploadClick() {
		fileInput.click();
	}

    function setParams(files) {
        if (files.length > 0) {
            fileUploaded.set(true);
            fileObject.set(files[0]);
            fileDetails.set(`Nombre: ${files[0].name}, Tamaño: ${(files[0].size / 1024).toFixed(2)} KB, Tipo: ${files[0].type}`);
		}
    }

    function handleDrop(event) {
		event.preventDefault();
		draggedOver = false;

		const files = event.dataTransfer.files;
		setParams(files);
	}

	function handleFileChange(event) {
		const files = event.target.files;
        setParams(files);
	}
</script>

<div class="file-upload-container">
    <div
        class="dashed-container {draggedOver ? 'drag-over' : ''}"
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
        on:drop={handleDrop}
    >
        <p>{draggedOver ? "¡Suelta el archivo aquí!" : "Arrastra tus archivos aquí"}</p>
    </div>

    <input
        type="file"
        bind:this={fileInput}
        on:change={handleFileChange}
        style="display: none"
    />

    <button on:click={handleUploadClick}>
        Subir archivo
    </button>
    
    <!-- Muestra los detalles del archivo si se ha subido -->
    {#if $fileUploaded}
        <div class="file-details">
            <p>Detalles del archivo:</p>
            <p>{$fileDetails}</p>
        </div>
    {/if}
</div>

<style>
    .file-upload-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }

    .dashed-container {
        border: 2px dashed #FFE6CC;
        border-radius: 15px;
        padding: 30px;
        width: 80%;
        max-width: 1000px;
        min-height: 250px;
        margin-top: 30px;
        text-align: center;
        transition: background-color 0.3s, border-color 0.3s;
        background-color: #fffdf8;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }

    .dashed-container p {
        font-size: 1.2rem;
        color: #444;
    }

    .dashed-container.drag-over {
        background-color: #fff5e6;
        border-color: #FFA726;
    }

    .file-details {
        margin-top: 15px;
        padding: 12px 20px;
        background-color: #fff9f3;
        border: 1px solid #FFA726;
        border-radius: 8px;
        width: 80%;
        max-width: 800px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    button {
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