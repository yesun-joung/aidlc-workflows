import { useRef } from 'react';
import {
	RankAccoladesWrapper,
	RankHiglightItem,
	RankHiglightValue,
	RankImageWrapper,
	RankInfoWrapper,
	RankItem,
	RankMake,
	RankMakeWrapper,
	RankMakeTitle,
	RankMakeDivider,
	RankMakeRating,
	RankMakeRatingValue,
	RankMakeRatingMax,
	RankPrice,
	RankValue,
} from '@caranddriver/components/content/review/vehicle-ranking/styles';
import { RankHeaderImage } from '@caranddriver/layouts/specs/styles';
import { getFrontendLink } from '@scope/components/content/utils';
import { AccoladesSection } from '@caranddriver/components/accolades/accolades-section';
import {
	useResponsiveContainer,
	handleCardClick,
	getAccolades,
	hasAnyAccolade,
	COMPACT_STYLES,
} from '@caranddriver/components/content/review/vehicle-ranking/utils';
import MarketplaceCta from '@autos/components/marketplace/marketplace-cta';
import { formatCurrency } from '@hdm/utils/currency';
import { mapMarketplacePrice } from '@autos/utils/map-marketplace-price';

const formatDollars = (amount) =>
	formatCurrency(Number(amount), 'USD', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

function buildOriginalMsrpCopy(startingAt) {
	const msrpLow = typeof startingAt === 'number' ? startingAt : Number(startingAt);
	if (!Number.isFinite(msrpLow) || msrpLow <= 0) {
		return '';
	}
	return `STARTING AT: $${msrpLow.toLocaleString()}`;
}

function VehicleRankingCard({
	highlightItem,
	highlightRank,
	image,
	make,
	model,
	rank,
	slug,
	startingAt,
	price = null,
	modelId,
	marketStatus = null,
	inFlight = false,
	readFailed = false,
	legacy_url,
	ratings,
	marketplace,
}) {
	const href = getFrontendLink({
		url: slug,
		legacy_url,
		display_type: { title: 'Review Article' },
	});

	const accolades = getAccolades(ratings);
	const containerRef = useRef(null);

	const { isSmallContainer } = useResponsiveContainer(containerRef);
	const makeModelTitle = `${make} ${model}`;

	const compactDividerStyle = isSmallContainer ? COMPACT_STYLES.divider : {};
	const compactWrapperStyle = isSmallContainer ? COMPACT_STYLES.wrapper : {};
	const compactButtonStyle = isSmallContainer ? COMPACT_STYLES.button : {};
	const compactImageStyle = isSmallContainer ? COMPACT_STYLES.image : {};

	const originalMsrpCopy = buildOriginalMsrpCopy(startingAt);
	const isUsedMarketYear = marketStatus?.toLowerCase() === 'used';
	const marketplaceLow = isUsedMarketYear ? price?.marketplace?.low : undefined;
	const marketplaceHigh = isUsedMarketYear ? price?.marketplace?.high : undefined;
	const normalizedModelId =
		modelId != null && String(modelId).trim() !== '' ? String(modelId).trim() : null;
	const { hide, display } = normalizedModelId
		? mapMarketplacePrice({
				vehicleModelId: normalizedModelId,
				inFlight,
				readFailed,
				low: marketplaceLow,
				high: marketplaceHigh,
				copyVariant: 'starting-at',
				originalMsrpCopy,
				formatDollars,
			})
		: inFlight
			? { hide: true, display: null }
			: { hide: false, display: originalMsrpCopy || null };
	const isMarketplaceCopy = !hide && display !== null && display !== originalMsrpCopy;
	const priceLabel =
		!hide && display
			? isMarketplaceCopy &&
				typeof marketplaceLow === 'number' &&
				Number.isFinite(marketplaceLow)
				? `STARTING AT: ${formatDollars(marketplaceLow)}`
				: display
			: null;

	return (
		<RankItem
			onClick={() => handleCardClick(makeModelTitle, rank)}
			href={href}
			sx={highlightItem ? RankHiglightItem : {}}
		>
			<RankImageWrapper>
				<RankHeaderImage
					width={200}
					height={150}
					image={image}
					default={{ crop: '16x9', resize: '300:*' }}
					alt={makeModelTitle}
					title={makeModelTitle}
					sx={compactImageStyle}
				/>
				<RankValue sx={highlightRank ? RankHiglightValue : {}}>{rank}</RankValue>
				{hasAnyAccolade(accolades) ? (
					<RankAccoladesWrapper>
						<AccoladesSection
							accolades={accolades}
							small
							showTooltip={true}
							selector={`rank-card-${rank}`}
						/>
					</RankAccoladesWrapper>
				) : null}
			</RankImageWrapper>
			<RankInfoWrapper ref={containerRef}>
				<RankMake>
					<RankMakeWrapper sx={compactWrapperStyle}>
						<RankMakeTitle>{makeModelTitle}</RankMakeTitle>
						{ratings?.cd_rating ? (
							<>
								<RankMakeDivider sx={compactDividerStyle} />
								<RankMakeRating>
									<RankMakeRatingValue>{ratings.cd_rating}</RankMakeRatingValue>
									<RankMakeRatingMax>/10</RankMakeRatingMax>
								</RankMakeRating>
							</>
						) : null}
					</RankMakeWrapper>
				</RankMake>
				{priceLabel ? <RankPrice>{priceLabel}</RankPrice> : null}
				{marketplace?.cox?.slug ? (
					<MarketplaceCta
						href={marketplace.cox.slug}
						variant="vehicle-ranking"
						buttonText={`SHOP ${model}`}
						data-id="vehicle-ranking-shop-button"
						isHighlighted={highlightItem}
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
						}}
						sx={compactButtonStyle}
					/>
				) : (
					<div
						style={{
							display: 'block',
							visibility: 'hidden',
							width: '100%',
							padding: '12px',
							marginBottom: '8px',
						}}
					/>
				)}
			</RankInfoWrapper>
		</RankItem>
	);
}

export default VehicleRankingCard;
