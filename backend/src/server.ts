import { createApp } from './app';
import { env } from './config/env';
import { syncCatalogAssets } from './services/catalog-assets.service';

if (process.env.NODE_ENV !== 'test') {
  createApp()
    .then(async (app) => {
      await syncCatalogAssets().catch((error) =>
        console.error('Catalog asset sync failed:', error)
      );

      app.listen(
        env.port,
        '0.0.0.0',
        () => console.log(`LuxShop backend listening on :${env.port}`)
      );
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
