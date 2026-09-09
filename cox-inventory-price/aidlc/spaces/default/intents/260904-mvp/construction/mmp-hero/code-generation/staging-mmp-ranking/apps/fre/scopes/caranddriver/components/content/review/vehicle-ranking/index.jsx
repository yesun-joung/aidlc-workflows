import { useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { visibleElements } from '@caranddriver/components/content/review/plugins/state';
import { usePageData } from '@media-platforms/page-data';
import { get } from '@media-platforms/utils/get';
import VehicleRankingCard from '@caranddriver/components/content/review/vehicle-ranking/vehicle-ranking-card';
import RankSubLink from '@caranddriver/components/content/review/vehicle-ranking/rank-sub-link';
import { RankWrapper } from '@caranddriver/components/content/review/vehicle-ranking/styles';
import { getRankingUrlPath } from '@caranddriver/components/content/review/vehicle-helper';
import { observerOptions } from '@caranddriver/components/content/review/plugins/utils';
import StickySectionObserve from '../plugins/sticky-section-observe';
import { getCurrentYearCategory, getRankedList, shouldShowList } from './utils';
import VehicleCompareIngressSection from '@autos/components/vehicle-compare-ingress-section';

function VehicleRanking({ 'data-node-id': dataNodeId }) {
	const setVisibleElements = useSetAtom(visibleElements);
	const ref = useRef(null);
	const pageData = usePageData('data.content.0', null);
	const contentYear = get(pageData, 'vehicle_tags.0.year');
	const currentYear = get(pageData, 'vehicle_models.0.years', []).find(
		(obj) => ~~obj.year === ~~contentYear,
	);
	const marketStatus = get(currentYear, 'market_status', null);

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

	if (!pageData) return null;
	if (!shouldShowList(pageData)) {
		return null;
	}

	const model = get(pageData, 'vehicle_tags.0.model.id');
	const title = 'Where This Vehicle Ranks';
	const anchorID = 'ranking';

	const primaryCategory =
		marketStatus !== 'new'
			? getCurrentYearCategory(pageData, contentYear)
			: get(pageData, 'vehicle_models.0.primary_ranked_list', null);

	if (!primaryCategory) return null;

	const rankedList = primaryCategory ? primaryCategory.ranked_list : [];
	const sanitizedList = getRankedList(model, ~~contentYear, rankedList, marketStatus);
	if (!sanitizedList) return null;

	const primaryVehicle = sanitizedList.find((item) => item.modelId === model);
	const nonPrimaryVehicles = sanitizedList.filter((item) => item !== primaryVehicle);

	const trimIds = [primaryVehicle, ...nonPrimaryVehicles]
		.map((item) => item?.trimId)
		.filter(Boolean)
		.slice(0, 5);

	const currentModel = sanitizedList.find((item) => item.highlightRank);

	if (currentModel?.year !== Number(contentYear)) {
		return null;
	}
	const rankListTitle = currentModel ? `#${currentModel.rank} in ${primaryCategory.title}` : null;
	const rankPagePath = getRankingUrlPath(primaryCategory.path);

	return Array.isArray(sanitizedList) && sanitizedList.length ? (
		<div
			data-embed="vehicle-ranking"
			data-node-id={dataNodeId}
			data-id="review-article-vehicle-ranking-section"
			ref={ref}
			data-anchor-id={anchorID}
		>
			<StickySectionObserve anchor-id={anchorID} title={title} data-tag="h2">
				<strong>Where This Vehicle Ranks</strong>
			</StickySectionObserve>
			<RankSubLink title={rankListTitle} href={rankPagePath} data-id="vehicle-ranking-sub-link" />
			<RankWrapper>
				{sanitizedList.map((listElem) => (
					<VehicleRankingCard
						key={listElem.rank}
						{...listElem}
						marketStatus={marketStatus}
						inFlight={false}
						readFailed={false}
					/>
				))}
			</RankWrapper>
			<VehicleCompareIngressSection
				id="vehicle-ranking-ingress"
				body="Compare the {{make_and_model}} with the top vehicles in this segment with our new compare tool."
				buttonText="Compare the top cars"
				displayNewBadge={true}
				trimIds={trimIds}
				primaryUx="compare_mmp_rankings"
			/>
		</div>
	) : null;
}

export default VehicleRanking;
