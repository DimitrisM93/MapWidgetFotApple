import { useState, useEffect } from 'react';
import { MapPin, Share } from 'lucide-react';

function App() {
  const [destination, setDestination] = useState('');
  
  const searchParams = new URLSearchParams(window.location.search);
  const destParam = searchParams.get('dest');
  
  // Type definition for iOS standalone mode
  const isIosStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;
  const isStandalone = isIosStandalone || window.matchMedia('(display-mode: standalone)').matches;

  useEffect(() => {
    if (destParam && isStandalone) {
      // Redirect to Google Maps immediately and auto-start navigation
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destParam)}&travelmode=driving&dir_action=navigate`;
      window.location.href = googleMapsUrl;
    } else if (destParam) {
      document.title = `${destParam}`;
    }
  }, [destParam, isStandalone]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      window.location.href = `/?dest=${encodeURIComponent(destination.trim())}`;
    }
  };

  if (destParam && isStandalone) {
    // Show a blank/loading screen while redirecting
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
        <MapPin size={48} color="#6b46c1" />
      </div>
    );
  }

  if (destParam) {
    // Install View
    return (
      <div className="glass-card">
        <h1>Almost there!</h1>
        <p>Verify your destination for <strong>{destParam}</strong>:</p>
        
        <div className="map-preview" style={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', marginTop: '8px' }}>
          <iframe 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            loading="lazy" 
            allowFullScreen 
            src={`https://maps.google.com/maps?q=${encodeURIComponent(destParam)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
        </div>

        <div className="share-instruction">
          <span>1. Tap the</span>
          <Share size={20} color="#a0a0a0" />
          <span>Share button</span>
        </div>
        <div className="share-instruction">
          <span>2. Select <strong>"Add to Home Screen"</strong></span>
        </div>
      </div>
    );
  }

  // Home View
  return (
    <div className="glass-card">
      <div className="icon-container">
        <MapPin size={32} color="#fff" />
      </div>
      <h1>Maps Shortcut</h1>
      <p>Create an iOS home screen shortcut that opens Google Maps navigation directly to your destination.</p>
      
      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input 
          type="text" 
          placeholder="e.g. Home, Work, 123 Main St"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <button type="submit">Create Shortcut</button>
      </form>
    </div>
  );
}

export default App;
