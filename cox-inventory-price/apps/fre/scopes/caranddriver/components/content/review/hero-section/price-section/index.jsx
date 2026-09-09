import {
	PriceSectionContainer,
	PriceTitleContainer,
	PriceButtonsContainer,
	PriceValues,
	CarValueForecastLink,
	ValueForecastIcon,
	HeroPriceCtasWrapper,
} from './styles';
import MarketplaceCta from '@autos/components/marketplace/marketplace-cta';
import TradeInCta from '@caranddriver/components/marketplace/trade-in-cta';
import {
	getMarketplaceReviewArticle,
	useDisplayMarketplaceCTA,
	getMarketplaceHref,
	getMarketplaceHrefNew,
	getMarketplaceHrefUsed,
	getMarketplaceHrefUsedNoYear,
	getMarketplaceHrefCertifiedNoYear,
} from '@autos/components/marketplace/marketplace-cta/utils';
import { getFormattedPriceRange } from '@caranddriver/page-utils/price-utils';
import { formatCurrency } from '@hdm/utils/currency';
import { mapMarketplacePrice } from '@autos/utils/map-marketplace-price';
import { useIsValidMarketStatusForTradeIn } from '@caranddriver/components/marketplace/trade-in-cta/utils';
import { SkipLink } from '@hdm/components/skip-link';
import { useFlag } from '@media-platforms/flagger';

const formatDollars = (amount) =>
	formatCurrency(Number(amount), 'USD', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

export function ReviewArticlePriceSection({
	price = null,
	marketplace = null,
	vehicleModelId,
	marketplaceLow = undefined,
	marketplaceHigh = undefined,
	marketStatus = null,
	inFlight = false,
	readFailed = false,
	showCarValueForecast = false,
	year = null,
}) {
	const marketplaceData = { ...marketplace, ...getMarketplaceReviewArticle() };
	const showMarketplace = useDisplayMarketplaceCTA(marketplaceData);
	const priceString = getFormattedPriceRange(price, { separator: '\u2013', collapseEqual: true });
	const originalMsrpCopy = priceString
		? `${priceString}${price?.is_estimate ? ' est' : ''}`
		: '';
	const isUsedMarketYear = marketStatus?.toLowerCase() === 'used';
	const mapperLow = isUsedMarketYear ? marketplaceLow : undefined;
	const mapperHigh = isUsedMarketYear ? marketplaceHigh : undefined;
	const normalizedModelId =
		vehicleModelId != null && String(vehicleModelId).trim() !== ''
			? String(vehicleModelId).trim()
			: null;
	const { hide, display } = normalizedModelId
		? mapMarketplacePrice({
				vehicleModelId: normalizedModelId,
				inFlight,
				readFailed,
				low: mapperLow,
				high: mapperHigh,
				copyVariant: 'hero-range',
				originalMsrpCopy,
				formatDollars,
			})
		: inFlight
			? { hide: true, display: null }
			: { hide: false, display: originalMsrpCopy || null };
	const isMarketplaceCopy = !hide && display !== null && display !== originalMsrpCopy;
	const marketplacePriceBody =
		isMarketplaceCopy &&
		typeof mapperLow === 'number' &&
		Number.isFinite(mapperLow) &&
		typeof mapperHigh === 'number' &&
		Number.isFinite(mapperHigh)
			? `${formatDollars(mapperLow)} - ${formatDollars(mapperHigh)}`
			: null;
	const showMarketplaceTitle = Boolean(marketplacePriceBody);
	const showMsrpTitle = !hide && display !== null && !isMarketplaceCopy;
	const showPriceText = !hide && display;
	const carValueForecastLabel = "See how this vehicle's price has changed";
	const tradeInCtaFlag = useFlag('fre.autos.mmp.trade-in-cta');
	const isValidMarketStatus = useIsValidMarketStatusForTradeIn();
	const showTradeInCta = tradeInCtaFlag && isValidMarketStatus;
	const isUsedMarketStatus = !isValidMarketStatus;

	return (
		<PriceSectionContainer>
			{showMarketplaceTitle ? <PriceTitleContainer>Marketplace</PriceTitleContainer> : null}
			{showMsrpTitle ? <PriceTitleContainer>MSRP</PriceTitleContainer> : null}
			<PriceButtonsContainer>
				{showPriceText ? (
					showMarketplace && marketplacePriceBody ? (
						<MarketplaceCta
							href={getMarketplaceHref(marketplaceData)}
							variant="hero-price"
							elementID="review-article-price-link"
							data-id="review-article-price-link"
						>
							{marketplacePriceBody}
						</MarketplaceCta>
					) : (
						<PriceValues>{display}</PriceValues>
					)
				) : null}
				{showCarValueForecast ? (
					<SkipLink anchorId="car-value-forecast" data-id="car-value-forecaster-skip-link">
						<CarValueForecastLink aria-label="View car value forecast" type="button">
							<ValueForecastIcon aria-hidden="true" />
							<span>{carValueForecastLabel}</span>
						</CarValueForecastLink>
					</SkipLink>
				) : null}
				{showMarketplace ? (
					<HeroPriceCtasWrapper>
						{isUsedMarketStatus ? (
							<>
								<MarketplaceCta
									buttonText="Shop Used"
									href={getMarketplaceHrefUsed(marketplaceData, year)}
									variant="hero"
									elementID="marketplace-cta-hero-used"
									data-id="review-article-marketplace-cta-hero-used"
								/>
								<MarketplaceCta
									buttonText="Shop Certified Used"
									href={getMarketplaceHrefCertifiedNoYear(marketplaceData)}
									variant="hero-secondary"
									elementID="marketplace-cta-hero-certified-used"
									data-id="review-article-marketplace-cta-hero-certified-used"
								/>
								{tradeInCtaFlag ? <TradeInCta /> : null}
							</>
						) : (
							<>
								<MarketplaceCta
									buttonText="Shop New"
									href={getMarketplaceHrefNew(marketplaceData, year)}
									variant="hero"
									elementID="marketplace-cta-hero"
									data-id="review-article-marketplace-cta-hero"
								/>
								<MarketplaceCta
									buttonText="Shop Used"
									href={getMarketplaceHrefUsedNoYear(marketplaceData)}
									variant="hero-secondary"
									elementID="marketplace-cta-hero-used"
								/>
							</>
						)}
						{showTradeInCta ? <TradeInCta /> : null}
					</HeroPriceCtasWrapper>
				) : null}
			</PriceButtonsContainer>
		</PriceSectionContainer>
	);
}
