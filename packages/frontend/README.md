# HA+ Frontend

Shared Python frontend lifecycle code for HA+ Home Assistant integrations. The
package lives alongside `@ha-plus/ui` and uses Home Assistant's supported panel,
static-path, extra-JavaScript, and WebSocket registration APIs.

The package handles serialized registration, versioned module URLs, early icon
loading, installed-version panel metadata, retry-safe registration stages, and
panel restoration after unload/reload. Each app supplies its asset paths, panel
identity, permissions, and decorated WebSocket handlers.

## Bundling into an integration

Pin `@ha-plus/frontend` to an immutable release tarball in the app's development
dependencies. Add the following command to the app's existing frontend build,
using its integration domain in the output path.

```sh
ha-plus-frontend-vendor custom_components/DOMAIN/ha_plus_frontend
```

Commit the generated Python module, license, and `SOURCE.json`. Import it through
`.ha_plus_frontend` inside the integration. The source marker records the bundled
package version. Existing build-drift checks verify the generated files.

Distribution uses the apps' existing npm build tools. Every app receives an
integration-local copy, so its release is self-contained and can pin its own
version. Home Assistant installs the bundled Python through the integration
archive.

## Verification and release

Run `npm test --workspace @ha-plus/frontend`, then
`npm pack --workspace @ha-plus/frontend`. Publish the generated
`ha-plus-frontend-VERSION.tgz` on a release tagged `frontend-vVERSION`.
Preserve published tarballs and commit each consumer's updated lockfile.
