import { Injectable } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class MetaService {
  private isInit = false;

  // TODO: i18n
  private defaultTags: MetaDefinition[] = [
    {
      name: 'twitter:card',
      content: 'Search for crags, boulders, gyms, shops, shelters and organize your next adventure!',
    },
    { name: 'twitter:title', content: 'WeClimb.it - The search engine for climbers and outdoor lovers' },
    {
      name: 'twitter:description',
      content: 'Search for crags, boulders, gyms, shops, shelters and organize your next adventure!',
    },
    { name: 'twitter:image', content: 'https://www.weclimb.it/assets/images/social-avatar.png' },

    { property: 'og:url', content: 'https://www.weclimb.it' },
    { property: 'og:title', content: 'WeClimb.it - The search engine for climbers and outdoor lovers' },
    {
      property: 'og:description',
      content: 'Search for crags, boulders, gyms, shops, shelters and organize your next adventure!',
    },
    { property: 'og:image', content: 'https://www.weclimb.it/assets/images/social-avatar.png' },
  ];

  constructor(private ngMetaService: Meta) {}

  setDefaultSocialMeta(): void {
    if (!this.isInit) {
      this.ngMetaService.addTags(this.defaultTags);
      this.isInit = true;
    } else {
      this.defaultTags.forEach((metaTag: MetaDefinition) => {
        this.ngMetaService.updateTag(
          metaTag,
          `${metaTag.name ? 'name' : 'property'}='${metaTag.name || metaTag.property}'`,
        );
      });
    }
  }

  setDetailSocialMedia(title: string, descr: string, url: string): void {
    this.ngMetaService.updateTag({ name: 'twitter:card', content: descr }, "name='twitter:card'");
    this.ngMetaService.updateTag({ name: 'twitter:title', content: title }, "name='twitter:title'");
    this.ngMetaService.updateTag({ name: 'twitter:description', content: descr }, "name='twitter:description'");

    this.ngMetaService.updateTag({ property: 'og:url', content: url }, "property='og:url'");
    this.ngMetaService.updateTag({ property: 'og:title', content: title }, "property='og:title'");
    this.ngMetaService.updateTag({ property: 'og:description', content: descr }, "property='og:description'");
  }
}
