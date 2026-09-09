import { gql } from '@apollo/client';
import { Fragment } from '@hdm/utils/graphql';
import { MEDIA_ROLE, MEDIA_TYPES } from '@hdm/utils/constants';

const { SLIDE: roleSlide } = MEDIA_ROLE;
const { IMAGE: typeImage } = MEDIA_TYPES;

export const VehicleModelFragment = new Fragment(
	'VehicleModelFragment',
	gql`
		fragment VehicleModelFragment on Content {
			vehicle_models {
				__typename
				marketplace {
					cox {
						slug
						models {
							name
							code
							trims 
							{
								name
								code
							}
						}
						series 
						{
							name
							code
						}
					}
				}
				primary_submodel {
					id
				}
				content {
					media(role: 3) {
						... on Image {
							hips_url
						}
					}
				}
				id
				name
				primary_year
				primary_body_style
				primary_ranked_list {
					id
					title
					slug
					path
					ranked_list {
						order
						model {
							id
							name
							primary_year
							state
							make {
								id
								name
							}
								review_articles(market_status: "new") {
									name
									model
									title
									year
									url
									legacy_url
									social_dek
									seo_meta_description
									primary_fuel_type
								lede_image {
									media_object {
										hips_url
									}
									metadata {
										crops
										lede_image_link_url
									}
								}
								ratings {
									cd_rating
									is_cd_ten_best
									is_cd_editors_choice
									is_cd_ev_of_the_year
								}
								price {
									low
									is_estimate
								}
								specs {
									epa {
										combined {
											high
											low
										}
										city {
											high
											low
										}
										highway {
											high
											low
										}
										combined_elec {
											high
											low
										}
										city_elec {
											high
											low
										}
										highway_elec {
											high
											low
										}
										estimated_battery_range {
											high
											low
										}
									}
								}
								marketplace {
									cox {
										slug
									}
								}
							}
							years {
								primary_vehicle_compare_data_id
								year
							}
						}
					}
				}
				state
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
				}
				make {
					id
					name
					section {
						slug
					}
					marketplace {
						cox {
							makes {
								name
								code
							}
						}
					}
						review_articles(publish_state: "published") {
							name
							model
							title
							year
							url
							social_dek
							seo_meta_description
							primary_fuel_type
							legacy_url
						lede_image {
							media_object {
								hips_url
							}
							metadata {
								crops
								lede_image_link_url
							}
						}
						ratings {
							cd_rating
							is_cd_ten_best
							is_cd_editors_choice
							is_cd_ev_of_the_year
						}
						price {
							low
							is_estimate
						}
						specs {
							epa {
								combined {
									high
									low
								}
								city {
									high
									low
								}
								highway {
									high
									low
								}
								combined_elec {
									high
									low
								}
								city_elec {
									high
									low
								}
								highway_elec {
									high
									low
								}
								estimated_battery_range {
									high
									low
								}
							}
						}
						marketplace {
							cox {
								slug
							}
						}
						model
					}
				}
				ratings {
					cd_rating
					max_rating
					is_cd_ten_best
					is_cd_editors_choice
					is_cd_ev_of_the_year
				}
				properties {
					fuel_types
					primary_fuel_type
					topspeed
					liters
					horsepower
					zerosixty
					epa_highway_elec
					epa_city_elec
					epa_highway
					epa_city
				}
				years {
					primary_vehicle_compare_data_id
					primary_ranked_list {
						id
						title
						slug
						path
						ranked_list {
							order
							model {
								id
								name
								primary_year
								make {
									id
									name
								}
								review_articles {
									name
									model
									title
									year
									url
									legacy_url
									lede_image {
										media_object {
											hips_url
										}
										metadata {
											crops
											lede_image_link_url
										}
									}
									price {
										low
									}
								}
								years {
									primary_vehicle_compare_data_id
									year
								}
							}
						}
					}
					content {
						status
						display_type {
							title
						}
						section {
							slug
						}
						slug
						metadata {
							legacy_url
						}
					}
					year
					market_status
					state
					ratings {
						cd_rating
						is_cd_editors_choice
						is_cd_ev_of_the_year
						is_cd_ten_best
						max_rating
						safety {
							high
						}
					}
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
					chrome_trims {
						name
						key_features
						msrp_low_style {
							id
							base_msrp
						}
						estimated_price
						hide
						overrides {
							name
							price
						}
						recommended
					}
					custom_trims {
						id
						name
						key_features
						price
						estimated_price
						hide
						recommended
					}
					specs {
						epa {
							combined {
								high
								low
							}
							city {
								high
								low
							}
							highway {
								high
								low
							}
							combined_elec {
								high
								low
							}
							city_elec {
								high
								low
							}
							highway_elec {
								high
								low
							}
							estimated_battery_range {
								high
								low
							}
						}
						seating {
							high
							low
						}
						cargo_capacity {
							high
							low
						}
						drivetrains
						warranties {
							mileage
							years
						}
					}
					related_galleries(hide: false) @include(if: $includeRelatedGalleries) {
						gallery_type
						content {
							title
							media(first:500, role_in: [${roleSlide}], media_type_in: ["${typeImage}"]) {
								id
								role
								media_type
								media_metadata {
									headline
									dek
								}
								... on Image {
									role
									hips_url
									metadata {
										crops
										photo_credit
									}
									image_metadata {
										photo_credit
										seo_meta_title
										seo_meta_description
									}
									source {
										title
									}
								}
							}
						}
					}
				}
				generations {
					name
					year_start
					year_end
				}
				submodels {
					id
					name
					chrome_style_ids
					year
					manufacturing_status
					fuel
					media {
						media_object {
							hips_url
						}
					}
				}
				review_articles {
					year
					url
					legacy_url
					market_status
					ratings {
						cd_rating
					}
					marketplace {
						cox {
							slug
						}
					}
					content {
						media(role: 3) {
							... on Image {
								url
								hips_url
								media_metadata
								{
									crops
								}
							}
						}
					}
				}
			}
		}
	`,
);
