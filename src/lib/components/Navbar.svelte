<script>
    // No necesitas lógica en este navbar por ahora
</script>

<nav class="navbar navbar-expand-lg bg-light" data-bs-theme="light">
	<div class="container-fluid navbar-container">
		<div class="navbar-left">
			<a class="nav-link active" id="home-link" href="/">
				<svg id="home-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
					<path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
				</svg>
				Home
			</a>
		</div>

		<div class="navbar-slot">
			<slot />
		</div>
	</div>
</nav>

<style>
	nav {
		background-color: #FFE6CC !important;
		border-bottom: 1px solid #FFB84D;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 10px 20px;
		position: sticky;
		top: 0;
		z-index: 1000;
		transition: background-color 0.3s ease, box-shadow 0.3s ease;
	}

	.navbar-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.navbar-left {
		display: flex;
		align-items: center;
	}

	#home-link {
		display: flex;
		align-items: center;
		font-size: 1.2rem;
		font-weight: 600;
		border: 1px solid #FFB84D;
		border-radius: 6px;
		padding: 6px 12px;
		background-color: #fff;
		color: #333;
		text-decoration: none;
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	#home-link:hover {
		background-color: #ffcf99;
		color: #000;
	}

	#home-icon {
		margin-right: 8px;
		fill: currentColor;
		width: 1.2em;
		height: 1.2em;
	}

	.navbar-slot {
		font-size: 1.4rem;
		font-weight: bold;
		color: #333;
		padding: 8px 16px;
		border-radius: 8px;
	}
</style>
