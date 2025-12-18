import { extractMetadata } from './url-utils.js';

export class RecentSitesManager {
  static STORAGE_KEY = 'efemer_al_recent_sites';
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

      const { title, description: preview } = extractMetadata(content);

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
