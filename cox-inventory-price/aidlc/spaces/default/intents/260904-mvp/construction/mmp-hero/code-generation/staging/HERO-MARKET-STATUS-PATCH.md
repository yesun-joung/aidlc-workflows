# Hero wrapper patch — `marketStatus` prop

Add to `ReviewArticlePriceSection` in `hero-section/index.jsx`:

```jsx
					marketStatus={yearObject?.market_status}
```

`market_status` is already on the hero year from `VehicleModelFragment` (`years { market_status ... }`).
