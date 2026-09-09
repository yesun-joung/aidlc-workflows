import dynamic from 'next/dynamic';
import DomHandler from '@hdm/domhandler';
import StickyContainer from '@caranddriver/components/sticky-container';
import { getVehicleBreadcrumbs } from '@caranddriver/components/content/review/breadcrumbs/helpers';
import { get } from '@media-platforms/utils/get';
import SlideMenu from '@caranddriver/components/sticky-container/slide-menu';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import {
	anchorHeadingH2RefsAtom,
	visibleElements,
} from '@caranddriver/components/content/review/plugins/state';
import { lazy, STRATEGIES } from '@media-platforms/next-lazy';
import { getMediaByRoleAndType } from '@hdm/components/media/utils';
import { MEDIA_TYPES, MEDIA_ROLE } from '@hdm/utils/constants';
import { BreadcrumbsNav } from '@hdm/components/breadcrumbs/styles';
import {
	getFrontendLink as getVehicleFrontendLink,
	getYearObject,
	getPrimaryYearObject,
	getReviewSpecsUrl,
} from '@caranddriver/components/content/review/vehicle-helper';
import { getYearAgnosticLegacyUrl } from '@autos/components/content/specs/specs-helper';
import { ReviewArticleAccoladesSection } from '@caranddriver/components/content/review/hero-section/accolades-section';
import { ReviewArticlePriceSection } from '@caranddriver/components/content/review/hero-section/price-section';
import { ReviewArticleIncentivesSection } from '@caranddriver/components/content/review/hero-section/incentives-section';
import { HighsLowsVerdictHeroSection } from '@caranddriver/components/content/review/hero-section/high-low-verdict-section';
import RatingTooltip from '@caranddriver/components/rating-tooltip/tooltip';
import RatingTooltipActivator from '@caranddriver/components/rating-tooltip/activator';
import { HeroGallerySection } from '@autos/components/content/review/hero-section/gallery-section';
import { observerOptions } from '@caranddriver/components/content/review/plugins/utils';
import StickySectionObserve from '@caranddriver/components/content/review/plugins/sticky-section-observe';
import YearsSelectorDropdown from '../years-selector-dropdown';
import { YearSelectContainer, DropdownChevronIcon } from '../years-selector-dropdown/styles';
import HeroSectionNavAnchor from '@scope/components/content/review/hero-section/nav-anchor';
import { SlotContent } from '@media-platforms/slots';
import { useFlag } from '@media-platforms/flagger';
import InventoryWidget from '@autos/components/inventory-widget';
import useIsSponsored from '@hdm/hooks/use-is-sponsored';
import { usePageData } from '@media-platforms/page-data';
import { useReviewInventoryWidgetData } from '../inventory-widget-data';
import { isIncentiveEligibleMarketYear } from '@caranddriver/components/content/review/hero-section/incentives-section/utils';
import {
	getReviewHeroStyleIds,
	useReviewHeroIncentives,
} from '@caranddriver/components/content/review/hero-section/incentives-section/use-review-hero-incentives';

import {
	StickyWrapper,
	RatingCheckIcon,
	ReviewHeroBreadcrumbsWrapper,
	ReviewHeroRating,
	ReviewHeroRatingLabel,
	ReviewHeroRatingValue,
	ReviewHeroRatingWrapper,
	ReviewHeroTitleRowWrapper,
	ReviewHeroTitle,
	ReviewArticleDetailsSection,
	ReviewArticleAtAGlanceSection,
	RatingWrapper,
	ReviewHeroToolbar,
	SavePanelWrapper,
	InventoryWidgetWrapper,
} from './styles';
import PositionTracker from '@hdm/components/nav/position-tracker';
import SavePanel from '@caranddriver/components/bookmarks/save-panel';

const Breadcrumbs = lazy(
	dynamic(() => import('@hdm/components/breadcrumbs')),
	{
		strategy: STRATEGIES.STATIC,
		wrapper: BreadcrumbsNav,
		forwardedRef: false,
		wrapperProps: { 'aria-label': 'breadcrumbs' },
	},
);

function ReviewArticleHero({ data, titleMarkup, 'data-node-id': dataNodeId }) {
	const setVisibleElements = useSetAtom(visibleElements);
	const ref = useRef(null);
	const tooltipRef = useRef(null);
	const title = 'AT A GLANCE';
	const anchorID = 'at-a-glance';
	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setVisibleElements((prevState) => [...prevState, entry.target]);
				} else {
					setVisibleElements((prevState) => [...prevState].filter((item) => item !== entry.target));
				}
			});
		}, observerOptions);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, []);

	const { media, metadata, section } = data;
	const vehicleModels = get(data, 'vehicle_models.0', {});
	const vehicleSubmodels = get(data, 'vehicle_submodels.0', {});
	const vehicleTags = get(data, 'vehicle_tags.0', {});
	const bbTrimStyleData = get(data, 'bbTrimStyleData');
	const forecasterValues = get(data, 'forecasterValues');
	const { lows: metadataLows, highs: metadataHighs, verdict: metadataVerdict } = metadata;
	const bodyHLV = usePageData('bodyHLV');

	// Body HLV (first <hlv-table> in the article body) is hoisted into the hero;
	// subsequent <hlv-table> blocks stay inline. Falls back to metadata when no
	// body HLV exists.
	const highs = bodyHLV ? (bodyHLV.highs ?? '') : metadataHighs;
	const lows = bodyHLV ? (bodyHLV.lows ?? '') : metadataLows;
	const verdict = bodyHLV ? (bodyHLV.verdict ?? '') : metadataVerdict;

	const currentModelYear = ~~vehicleTags.year;
	// const modelYears = vehicleModels.years;
	// const showYearsSelector = currentModelYear && modelYears;
	// An all-empty authored body HLV intentionally hides this section; the
	// metadata fallback is suppressed in that case (see hlv-table.js).
	const showHighsLowsVerdict = lows || highs || verdict;
	const showBreadcrumbs = currentModelYear && vehicleModels && section;
	const breadcrumbsItems =
		showBreadcrumbs && getVehicleBreadcrumbs(currentModelYear, vehicleModels, section);

	const h2RefList = useAtomValue(anchorHeadingH2RefsAtom);

	// A shared class name between legacy FRE and FRE that allows Google Optimize to target the
	// header just under the starting at price.
	const googleOptimizeTarget = 'review-header-inner';

	const { primary_year: primaryYear, years: modelYears, marketplace } = vehicleModels;
	const primaryYearObject = getPrimaryYearObject(modelYears, primaryYear);
	const yearObject = getYearObject(modelYears, currentModelYear) ?? {};
	const isPrimaryYear = primaryYear === currentModelYear;
	const yearAgnosticLegacyUrl = getYearAgnosticLegacyUrl(vehicleModels);
	const specsUrl =
		vehicleSubmodels && primaryYearObject
			? getReviewSpecsUrl(primaryYearObject, isPrimaryYear, vehicleSubmodels, yearAgnosticLegacyUrl)
			: null;
	const showSpecs = !!specsUrl;

	const ledeImage = getMediaByRoleAndType(media, MEDIA_TYPES.IMAGE, MEDIA_ROLE.LEDE) || {};
	const images = media?.filter((item) => item?.media_type === MEDIA_TYPES.IMAGE);

	const { ratings = {}, price = {} } = yearObject ?? primaryYearObject;

	const initialIncentiveData = get(data, 'incentive_data', null);
	const currentYearObject = vehicleModels?.years?.find((y) => Number(y.year) === currentModelYear);
	const chromeTrims = currentYearObject?.chrome_trims ?? [];
	const modelPageUrl =
		yearAgnosticLegacyUrl ||
		(primaryYearObject?.content ? getVehicleFrontendLink(primaryYearObject) : null);

	const vehicleData = {
		make: vehicleModels?.make?.name || '',
		model: vehicleModels?.name || '',
		modelPageUrl,
		year: currentModelYear,
		msrpMin: price?.low || null,
		msrpMax: price?.high || null,
		ledeImage,
		marketplace,
	};
	const { cd_rating: rating = 0, max_rating: ratingMax } = ratings;

	const accolades = {};
	Object.keys(ratings).forEach((key) => {
		if (ratings[key]) {
			if (key === 'is_cd_ten_best') {
				accolades.isTenBest = true;
			}
			if (key === 'is_cd_editors_choice') {
				accolades.isEditorsChoice = true;
			}
			if (key === 'is_cd_ev_of_the_year') {
				accolades.isEvOfTheYear = true;
			}
		}
	});
	const showSavePanel = useFlag('fre.autos.savable.mmp');
	const inventoryMMPHigherPosition = useFlag('fre.autos.inventory.mmp_higher_position');
	const showCarValueForecast = useFlag('fre.autos.mmp.car-value-forecaster');
	const showReviewHeroIncentives = useFlag('fre.autos.mmp.review-hero-incentives');
	const isIncentiveEligibleYear = isIncentiveEligibleMarketYear(vehicleModels, currentModelYear);
	const { styleId: reviewHeroStyleId, compareStyleIds: reviewHeroCompareStyleIds } =
		getReviewHeroStyleIds(chromeTrims);
	const { incentiveData, eligibleTrimsQueryData } = useReviewHeroIncentives({
		initialIncentiveData,
		styleId: reviewHeroStyleId,
		compareStyleIds: reviewHeroCompareStyleIds,
		chromeTrims,
		enabled: showReviewHeroIncentives && isIncentiveEligibleYear,
	});
	const showReviewHeroIncentivesContent =
		showReviewHeroIncentives && incentiveData && isIncentiveEligibleYear;
	const { isSponsored } = useIsSponsored();

	const inventoryWidgetData = useReviewInventoryWidgetData();

	return (
		<>
			{showBreadcrumbs ? (
				<ReviewHeroBreadcrumbsWrapper>
					<Breadcrumbs items={breadcrumbsItems} />
				</ReviewHeroBreadcrumbsWrapper>
			) : null}
			<ReviewHeroToolbar>
				{modelYears?.length > 0 ? (
					<YearSelectContainer>
						<YearsSelectorDropdown
							variant="model-hero"
							currentModelYear={currentModelYear}
							modelYears={modelYears}
						/>
						<DropdownChevronIcon sx={{ variant: 'model-hero' }} />
					</YearSelectContainer>
				) : null}
				{showSavePanel ? (
					<SavePanelWrapper>
						<SavePanel tooltipId="review-header-save" dataId="save-vehicle" />
					</SavePanelWrapper>
				) : null}
			</ReviewHeroToolbar>
			<ReviewHeroTitleRowWrapper className={googleOptimizeTarget}>
				<ReviewHeroTitle>
					<DomHandler dom={titleMarkup} />
				</ReviewHeroTitle>

				{rating ? (
					<ReviewHeroRatingWrapper>
						<ReviewHeroRating>
							<ReviewHeroRatingValue>{rating}</ReviewHeroRatingValue>/<span>{ratingMax ?? 10}</span>
						</ReviewHeroRating>
						<RatingTooltipActivator tooltipRef={tooltipRef}>
							<ReviewHeroRatingLabel>
								<RatingCheckIcon />
								<RatingWrapper>
									<i>C/D</i> RATING
								</RatingWrapper>
							</ReviewHeroRatingLabel>
						</RatingTooltipActivator>
						<RatingTooltip ref={tooltipRef} />
					</ReviewHeroRatingWrapper>
				) : null}
			</ReviewHeroTitleRowWrapper>

			{images?.length > 0 ? <HeroGallerySection ledeImage={ledeImage} images={images} /> : null}
			<ReviewArticleDetailsSection>
				<ReviewArticlePriceSection
					price={price}
					marketplace={marketplace}
					vehicleModelId={
						vehicleModels?.id != null ? String(vehicleModels.id) : undefined
					}
					marketplaceLow={price?.marketplace?.low}
					marketplaceHigh={price?.marketplace?.high}
					marketStatus={yearObject?.market_status}
					inFlight={false}
					readFailed={false}
					showCarValueForecast={
						showCarValueForecast && bbTrimStyleData ? forecasterValues.length === 4 : null
					}
					year={currentModelYear}
				/>

				{showReviewHeroIncentivesContent ? (
					<ReviewArticleIncentivesSection
						embedInDetailsSection
						vehicleData={vehicleData}
						incentiveData={incentiveData}
						eligibleTrimsQueryData={eligibleTrimsQueryData}
						chromeTrims={chromeTrims}
					/>
				) : null}
				{Object.keys(accolades).length > 0 ? (
					<ReviewArticleAccoladesSection accolades={accolades} />
				) : null}
			</ReviewArticleDetailsSection>

			{/* {showYearsSelector ? (
				<YearsSelector currentModelYear={currentModelYear} modelYears={modelYears} />
			) : null} */}

			{showReviewHeroIncentivesContent ? (
				<ReviewArticleIncentivesSection
					vehicleData={vehicleData}
					incentiveData={incentiveData}
					eligibleTrimsQueryData={eligibleTrimsQueryData}
					chromeTrims={chromeTrims}
				/>
			) : null}

			<StickyWrapper>
				<StickyContainer scrollOffset={105} nonStickyOffset={55}>
					{h2RefList ? <SlideMenu items={h2RefList} /> : []}
				</StickyContainer>
			</StickyWrapper>

			{showHighsLowsVerdict || showSpecs ? (
				<div
					data-embed="review-article-hero"
					data-node-id={dataNodeId}
					ref={ref}
					data-anchor-id={anchorID}
				>
					<ReviewArticleAtAGlanceSection>
						<StickySectionObserve anchor-id={anchorID} title={title} data-location="header" />
						{showHighsLowsVerdict ? (
							<HighsLowsVerdictHeroSection highs={highs} lows={lows} verdict={verdict} />
						) : null}
					</ReviewArticleAtAGlanceSection>
				</div>
			) : null}
			{inventoryMMPHigherPosition && !isSponsored ? (
				<InventoryWidgetWrapper>
					<InventoryWidget
						{...inventoryWidgetData}
						variant="model-hero"
						data-embed="inventory-widget-hero"
					/>
				</InventoryWidgetWrapper>
			) : null}
			<SlotContent name="mmp-hero-nav-anchor">
				<HeroSectionNavAnchor vehicleModels={vehicleModels} currentModelYear={currentModelYear} />
			</SlotContent>
			<PositionTracker />
		</>
	);
}

export default ReviewArticleHero;
