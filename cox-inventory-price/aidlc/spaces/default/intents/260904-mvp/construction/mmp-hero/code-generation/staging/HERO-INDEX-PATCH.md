# Hero wrapper patch — `hero-section/index.jsx`

In `ReviewArticleDetailsSection`, replace the `ReviewArticlePriceSection` props block with:

```jsx
				<ReviewArticlePriceSection
					price={price}
					marketplace={marketplace}
					vehicleModelId={vehicleModels?.id}
					marketplaceLow={price?.marketplace?.low}
					marketplaceHigh={price?.marketplace?.high}
					inFlight={false}
					readFailed={false}
					showCarValueForecast={
						showCarValueForecast && bbTrimStyleData ? forecasterValues.length === 4 : null
					}
					year={currentModelYear}
				/>
```

FRE path:

`apps/fre/scopes/caranddriver/components/content/review/hero-section/index.jsx`

Mirror path:

`apps/fre/scopes/caranddriver/components/content/review/hero-section/index.jsx`
