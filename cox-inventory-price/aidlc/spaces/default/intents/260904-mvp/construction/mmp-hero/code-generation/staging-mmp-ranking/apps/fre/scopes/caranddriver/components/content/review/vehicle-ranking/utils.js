import { useRef, useState, useEffect } from 'react';
import { get } from '@media-platforms/utils/get';
import { getNewestYearFromReviewArticles } from '../../../../page-utils/utils';
import { fireModelPageEvent } from '@caranddriver/components/content/review/hero-section/utils';

const LIST_MIN_LENGTH = 2;

export const CONTAINER_CONFIG = {
	SMALL_THRESHOLD: 210,
};

export const COMPACT_STYLES = {
	divider: { display: 'none' },
	wrapper: { flexDirection: 'column', gap: '0', alignItems: 'center' },
	button: { fontSize: 'font-size-12', padding: '{xs}' },
	image: { pb: 0 },
};

export function useResponsiveContainer(containerRef) {
	const isSmallRef = useRef(false);
	const [isSmallContainer, setIsSmallContainer] = useState(false);

	useEffect(() => {
		if (!window.ResizeObserver || !containerRef.current) {
			return undefined;
		}

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target === containerRef.current) {
					const containerWidth = entry.contentRect.width;
					const shouldBeSmall = containerWidth < CONTAINER_CONFIG.SMALL_THRESHOLD;

					if (shouldBeSmall !== isSmallRef.current) {
						isSmallRef.current = shouldBeSmall;
						setIsSmallContainer(shouldBeSmall);
					}
				}
			}
		});

		observer.observe(containerRef.current);

		return () => {
			observer.disconnect();
		};
	}, [containerRef]);

	return { isSmallContainer };
}

export const handleCardClick = (title, rank) => {
	fireModelPageEvent('ranked_in_list', { ctaText: title, primaryUx: 'tile-click', pos: rank });
};

export const getAccolades = (ratings = {}) => ({
	isTenBest: ratings.is_cd_ten_best || false,
	isEditorsChoice: ratings.is_cd_editors_choice || false,
	isEvOfTheYear: ratings.is_cd_ev_of_the_year || false,
});

export const hasAnyAccolade = (accolades) =>
	accolades.isTenBest || accolades.isEditorsChoice || accolades.isEvOfTheYear;

export const getRankedList = (contentModel, contentYear, rankedModels, marketStatus) => {
	let modelFoundInRanked = false;
	let count = 0;
	let rank = 0;

	const list = rankedModels
		.filter((rankedModel) => {
			const reviewArticles = get(rankedModel, 'model.review_articles', []);
			const currentReviewArticle =
				marketStatus === 'new'
					? getNewestYearFromReviewArticles(reviewArticles) || {}
					: reviewArticles.find((article) => article.year === contentYear);

			if (
				(count < 6 && currentReviewArticle && Object.keys(currentReviewArticle).length > 0) ||
				rankedModel.model?.id === contentModel
			) {
				rankedModel.primaryReview = currentReviewArticle;
				count += 1;
				return true;
			}

			return false;
		})
		.map((rankedModel) => {
			rank += 1;
			const { order = '' } = rankedModel || {};
			const primaryReviewArticle = get(rankedModel, 'primaryReview', {});
			const model = get(rankedModel, 'model.name', '');
			const modelId = get(rankedModel, 'model.id', '');
			const make = get(rankedModel, 'model.make.name', '');
			const years = get(rankedModel, 'model.years', []);
			const price = get(primaryReviewArticle, 'price', {});
			const startingAt = get(primaryReviewArticle, 'price.low', 0);

			const trimId = years.find(
				(y) => y.year === primaryReviewArticle?.year && y.primary_vehicle_compare_data_id,
			)?.primary_vehicle_compare_data_id;

			/* eslint-disable camelcase */
			const { url, lede_image, legacy_url } = primaryReviewArticle || {};
			const {
				media_object: { hips_url },
				metadata,
			} = lede_image || {
				media_object: { hips_url: undefined },
				metadata: undefined,
			};

			if (rankedModel.model?.id === contentModel && order > 0) {
				modelFoundInRanked = true;

				if (order > 6) {
					rank = order;
				}
			}

			const image = { hips_url, metadata };

			return {
				rank,
				make,
				model,
				image,
				startingAt,
				price,
				slug: url,
				legacy_url,
				highlightItem: rankedModel.model?.id === contentModel,
				highlightRank: rankedModel.model?.id === contentModel,
				year: primaryReviewArticle?.year,
				trimId,
				modelId,
				ratings: primaryReviewArticle?.ratings || {},
				marketplace: primaryReviewArticle.marketplace,
			};
		});

	if (!modelFoundInRanked || list?.length < LIST_MIN_LENGTH) {
		return [];
	}

	list.sort((a, b) => (a.rank > b.rank ? 1 : -1));

	if (list.length > 6) {
		list.splice(5, 1);
	}

	return list;
};

export const getCurrentYearCategory = (pageData, contentYear) => {
	const years = get(pageData, 'vehicle_models.0.years', []);
	if (!Array.isArray(years) || years.length === 0) {
		return undefined;
	}
	const currentYearObj = years.find((yearObj) => {
		return yearObj.year === ~~contentYear;
	});
	return currentYearObj?.primary_ranked_list;
};

export const shouldShowList = (pageData) => {
	const vehicleSubmodels = pageData.vehicle_submodels ? pageData.vehicle_submodels[0] : {};
	const { manufacturing_status: manufacturingStatus = '' } = vehicleSubmodels || {};

	return manufacturingStatus !== 'projected-new-model-not-in-market-yet';
};
