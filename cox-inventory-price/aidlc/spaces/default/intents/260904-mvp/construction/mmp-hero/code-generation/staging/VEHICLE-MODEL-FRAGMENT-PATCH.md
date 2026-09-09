# VehicleModelFragment patch — `vehicle-model.js`

Under `years { ... price { ... } }` (hero year selection), add marketplace scalars after `is_estimate`:

```graphql
					price {
						editorial {
							high
							low
							is_estimate
						}
						chrome {
							low
							high
						}
						low
						high
						is_estimate
						marketplace {
							high
							low
						}
					}
```

FRE path:

`apps/fre/scopes/caranddriver/components/content/fragments/vehicle-model.js`

Apply only to the `years.price` block (~line 324), not model-level `price` blocks elsewhere in the fragment.
