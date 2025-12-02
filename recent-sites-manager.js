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

  static saveSite(url, content, id = null) {
    try {
      const sites = this.getSites();
      const timestamp = Date.now();

      // Extract title and preview
      let title = 'Untitled Site';
      let preview = '';

      if (content) {
        const lines = content.split('\n');
        let titleLineIndex = -1;

        // Find H1
        const h1Index = lines.findIndex(line => line.trim().startsWith('# '));

        if (h1Index !== -1) {
          title = lines[h1Index].replace(/^#+\s*/, '').trim();
          titleLineIndex = h1Index;
        } else {
          // Fallback to first non-empty line
          const firstNonEmptyIndex = lines.findIndex(line => line.trim().length > 0);
          if (firstNonEmptyIndex !== -1) {
            title = lines[firstNonEmptyIndex].replace(/^#+\s*/, '').trim();
            titleLineIndex = firstNonEmptyIndex;
          }
        }

        title = title.substring(0, 50) || 'Untitled Site';

        // Find preview (next non-empty line after title)
        if (titleLineIndex !== -1) {
          for (let i = titleLineIndex + 1; i < lines.length; i++) {
            if (lines[i].trim().length > 0) {
              preview = lines[i].trim().substring(0, 100);
              break;
            }
          }
        }
      }

      let siteId = id;
      let existingSiteIndex = -1;

      if (siteId) {
        existingSiteIndex = sites.findIndex(site => site.id === siteId);
      } else {
        // Fallback: try to find by URL if no ID provided (legacy support)
        existingSiteIndex = sites.findIndex(site => site.url === url);
      }

      if (existingSiteIndex !== -1) {
        // Update existing site
        const existingSite = sites[existingSiteIndex];
        siteId = existingSite.id || crypto.randomUUID(); // Ensure ID exists

        sites[existingSiteIndex] = {
          ...existingSite,
          url,
          title,
          timestamp,
          preview: preview,
          id: siteId
        };

        // Move to top
        const updatedSite = sites.splice(existingSiteIndex, 1)[0];
        sites.unshift(updatedSite);
      } else {
        // Create new site
        siteId = siteId || crypto.randomUUID();
        const newSite = {
          id: siteId,
          url,
          title,
          timestamp,
          preview: preview
        };
        sites.unshift(newSite);
      }

      // Limit to MAX_SITES
      const trimmedSites = sites.slice(0, this.MAX_SITES);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedSites));

      // Dispatch event for UI updates
      window.dispatchEvent(new CustomEvent('recent-sites-updated'));

      return siteId;
    } catch (e) {
      console.error('Failed to save recent site:', e);
      return null;
    }
  }

  static findSiteByUrl(url) {
    try {
      const sites = this.getSites();
      return sites.find(site => site.url === url);
    } catch (e) {
      return null;
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
