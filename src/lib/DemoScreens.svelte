<script>
    let { index = 0 } = $props();
    const screens = ['Screen one', 'Screen two', 'Screen three'];
</script>

<div class="s">
    <h3>{screens[index]}</h3>
    <div class="card"></div>
    <div class="card"></div>
    <div class="btn"></div>
</div>

<style>
    .s {
        padding: 24px 16px;
    }

    h3 {
        margin: 0 0 12px;
        color: var(--accent);
    }

    .card {
        height: 70px;
        margin-top: 12px;
        border-radius: 12px;
        background: var(--accent-container);
    }

    .btn {
        height: 40px;
        margin-top:20px;
        border-radius: 20px;
        background: var(--accent);
    }
</style>