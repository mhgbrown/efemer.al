export class RecentSitesManager {
  static STORAGE_KEY = 'ephemer_al_recent_sites';
  static MAX_SITES = 50;

  static getSites() {
    try {
      const sites = localStorage.getItem(this.STORAGE_KEY);
      return sites ? JSON.parse(sites) : [];
    } catch (e) {
      console.error('Failed to load recent sites:', e);
      return [];
    }
  }

  static saveSite(url, content) {
    try {
      const sites = this.getSites();
      const timestamp = Date.now();

      // Extract title: Priority to first H1, fallback to first non-empty line
      let title = 'Untitled Site';
      if (content) {
        const lines = content.trim().split('\n');
        const h1Line = lines.find(line => line.trim().startsWith('# '));

        if (h1Line) {
          title = h1Line.replace(/^#+\s*/, '').trim();
        } else if (lines.length > 0) {
          title = lines[0].replace(/^#+\s*/, '').trim();
        }

        title = title.substring(0, 50) || 'Untitled Site';
      }

      const newSite = {
        url,
        title,
        timestamp,
        preview: content ? content.substring(0, 100) : ''
      };

      // Remove duplicates (by URL)
      const filteredSites = sites.filter(site => site.url !== url);

      // Add new site to top
      filteredSites.unshift(newSite);

      // Limit to MAX_SITES
      const trimmedSites = filteredSites.slice(0, this.MAX_SITES);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedSites));

      // Dispatch event for UI updates
      window.dispatchEvent(new CustomEvent('recent-sites-updated'));

      return newSite;
    } catch (e) {
      console.error('Failed to save recent site:', e);
    }
  }

  static deleteSite(timestamp) {
    try {
      const sites = this.getSites();
      const filteredSites = sites.filter(site => site.timestamp !== timestamp);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredSites));
      window.dispatchEvent(new CustomEvent('recent-sites-updated'));
    } catch (e) {
      console.error('Failed to delete site:', e);
    }
  }

  static clearSites() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('recent-sites-updated'));
    } catch (e) {
      console.error('Failed to clear sites:', e);
    }
  }
}
