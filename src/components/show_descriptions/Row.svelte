<script>
    export let videoId = "";
    export let start = "";
    export let end = "";
    export let text = "";
</script>

<tr>
    <td>
        <button class="icon-button delete-button" titlte="Eliminar">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-x" viewBox="0 0 16 16">
                <path d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293z"/>
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
            </svg>
        </button>
    </td>
    <td>{start}</td>
    <td>{end}</td>
    <td>
        <input 
            type="text" 
            bind:value={text} 
            placeholder="Añade una descripción..." 
        />
    </td>
    <td>
        <button class="icon-button tts-button" title="Texto a voz">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
            </svg>
        </button>
    </td>
</tr>

<style>
    td {
        padding: 14px 20px;
        text-align: center;
        border-bottom: 1px solid #FFE6CC;
        /* background-color: #FFF7ED; */
        font-size: 1rem;
        color: #333;
    }

    input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #FFE6CC;
        border-radius: 6px;
        /* background-color: #FFF7ED; */
        font-size: 1rem;
        color: #333;
        box-sizing: border-box;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    input::placeholder {
        color: #aaa;
    }

    input:focus {
        outline: none;
        border-color: #FFB84D;
        box-shadow: 0 0 0 2px rgba(255, 184, 77, 0.3);
        background-color: #fff;
    }

    .icon-button {
        background-color: #FFF3E0; /* suave fondo crema */
        border: none;
        padding: 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .icon-button svg {
        fill: #FFB84D;
        transition: fill 0.3s ease;
    }

    .icon-button:hover {
        background-color: #FFB84D;
        transform: scale(1.1);
    }

    .icon-button:hover svg {
        fill: white;
    }

</style>
