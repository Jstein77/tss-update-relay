# update-relay

Fictional demo service. It is not a real product, customer or incident.

`update-relay` decides which origin pool serves endpoint-agent update packages in each region.

- `config/regions.json` maps each region to an origin pool.
- `config/origins.json` lists the origin pools and their status.
- `src/relay.js` resolves a region to its origin and validates the config.

## Checks

```bash
npm test          # config and routing tests
npm run plan      # prints the region-to-origin routing table
```

## Delivery

- **CI** runs the tests and prints the routing plan on every pull request.
- **Deploy** runs on every push to `main`. It deploys to `staging` first. The `production` job waits for one approval from a required reviewer on the `production` environment.

Both deploy steps are simulated. They print what would be published.
