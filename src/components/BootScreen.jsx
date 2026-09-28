function BootScreen() {
  return (
    <div className="boot" aria-hidden="true">
      <span className="boot__ball" />
      <div className="boot__text">
        <span>&gt; INITIALIZING POKÉDEX OS</span>
        <span>&gt; LOADING KANTO DATABASE</span>
        <span>&gt; READY</span>
      </div>
      <span className="boot__scanline" />
    </div>
  );
}

export default BootScreen;
